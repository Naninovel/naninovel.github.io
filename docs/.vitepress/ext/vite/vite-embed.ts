import type { Plugin, ResolvedConfig } from "vite";
import { get as httpGet } from "axios";
import MagicString from "magic-string";
import fs from "node:fs";
import afs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export type Options = {
    /**
     * The regex to match remote asset URLs.
     * @default Looks for http/s urls ending with png, jpg, jpeg, svg, gif or mp4.
     */
    urlRegex?: RegExp;
    /**
     * Directory path (relative to the project root) to store downloaded assets.
     * @default "./node_modules/.remote-assets"
     */
    assetsDir?: string;
    /**
     * How long to wait when downloading each asset, in seconds.
     * @default 30
     */
    downloadTimeout?: number;
    /**
     * How many times to restart the download when request fails.
     * @default 3
     */
    downloadRetryLimit?: number;
    /**
     * How long to wait before restarting the download on request fail, in seconds.
     * @default 6
     */
    downloadRetryDelay?: number;
    /**
     * Whether to append `?width=number&height=number` to the rewritten asset URLs.
     * @remarks Useful for injecting media size in HTML to optimize cumulative layout shift (CLS).
     * @default true
     */
    resolveMediaSize?: boolean;
}

export const defaultOptions = {
    urlRegex: /\b(https?:\/\/[\w_#&?.\/-]*?\.(?:png|jpe?g|svg|gif|mp4))(?=[`'")\]])/ig,
    assetsDir: "./node_modules/.remote-assets",
    downloadTimeout: 30,
    downloadRetryLimit: 3,
    downloadRetryDelay: 6,
    resolveMediaSize: true
};

type MediaInfo = {
    streams: MediaStream[];
}

type MediaStream = {
    index: number;
    width: number;
    height: number;
}

export const EmbedAssets = (options?: Options): Plugin => {
    const pattern = options?.urlRegex ?? defaultOptions.urlRegex;
    const assetsDir = path.resolve(options?.assetsDir ?? defaultOptions.assetsDir);
    const timeoutSeconds = options?.downloadTimeout ?? defaultOptions.downloadTimeout;
    const retryLimit = options?.downloadRetryLimit ?? defaultOptions.downloadRetryLimit;
    const maxRetryDelay = options?.downloadRetryDelay ?? defaultOptions.downloadRetryDelay;
    const appendSize = options?.resolveMediaSize ?? defaultOptions.resolveMediaSize;
    const downloads = new Map<string, Promise<void>>;
    const resolves = new Map<string, Promise<MediaInfo>>;
    const retries = new Map<string, number>;
    let config: ResolvedConfig;

    return {
        name: "vite-plugin-dont-move",
        enforce: "pre",
        configResolved: initialize,
        transform,
        transformIndexHtml: async (html, ctx) => (await transform(html, ctx.filename))?.code
    };

    async function initialize(resolved: ResolvedConfig) {
        config = resolved;
        if (config.server.force)
            await emptyDir(assetsDir);
        ensureDir(assetsDir);
    }

    async function transform(code: string, id: string) {
        const regex = new RegExp(pattern, pattern.flags);
        const magic = new MagicString(code);
        for (let match; (match = regex.exec(code));)
            await handleMatch(match, magic, id);
        return !magic.hasChanged() ? null : {
            code: magic.toString(),
            map: config.build.sourcemap ? magic.generateMap({ hires: true }) : null
        };
    }

    async function handleMatch(match: RegExpExecArray, magic: MagicString, id: string) {
        const start = match.index;
        const end = start + match[0].length;
        const url = match[0] as string;
        if (isValidHttpUrl(url))
            magic.overwrite(start, end, await resolve(id, url));
    }

    async function resolve(id: string, url: string) {
        const fileName = md5(url) + path.extname(url);
        const filePath = path.resolve(assetsDir, fileName);
        await downloadQueued(url, filePath);
        let newUrl = path.relative(path.dirname(id), `${assetsDir}/${fileName}`);
        if (!newUrl.startsWith("./")) newUrl = "./" + newUrl;
        return appendSize ? appendMediaSize(newUrl, await resolveMediaQueued(filePath)) : newUrl;
    }

    function downloadQueued(url: string, filepath: string) {
        if (downloads.has(filepath)) return downloads.get(filepath);
        downloads.set(filepath, fs.existsSync(filepath)
            ? Promise.resolve()
            : downloadWithRetries(url, filepath));
        return downloads.get(filepath);
    }

    async function resolveMediaQueued(filePath: string) {
        if (resolves.has(filePath)) return resolves.get(filePath);
        resolves.set(filePath, resolveMediaInfo(filePath));
        return resolves.get(filePath);
    }

    async function downloadWithRetries(url: string, filepath: string) {
        try { return await downloadTo(url, filepath); }
        catch (error) {
            retries.set(filepath, (retries.get(filepath) ?? 0) + 1);
            if (retries.get(filepath) > retryLimit) {
                fs.unlink(filepath, _ => {});
                throw error;
            }
            console.warn(`Download of ${url} failed, retrying. (error: ${error})`);
            await wait(Math.floor(Math.random() * maxRetryDelay));
            return downloadWithRetries(url, filepath);
        }
    }

    async function downloadTo(url: string, filepath: string) {
        // noinspection JSUnusedGlobalSymbols
        const response = await httpGet(url, {
            responseType: "arraybuffer",
            timeout: timeoutSeconds * 1000,
            timeoutErrorMessage: `Failed to download ${url}: timeout > ${timeoutSeconds} seconds.`,
            validateStatus: status => (status >= 200 && status < 300) || status === 429
        });

        if (response.status === 429) {
            const delay = response.headers["retry-after"];
            if (typeof delay !== "number") throw Error(`${url}: 429 without retry-after header.`);
            console.warn(`Too many download requests; the host asked to wait ${delay} seconds.`);
            await wait(delay + 1);
            return await downloadTo(url, filepath);
        }

        await afs.writeFile(filepath, response.data);
    }
};

function isValidHttpUrl(str: string) {
    let url;
    try { url = new URL(str); }
    catch (_) { return false; }
    return url.protocol === "http:" || url.protocol === "https:";
}

function md5(url: string) {
    return crypto.createHash("md5").update(url).digest("hex");
}

function wait(seconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

async function emptyDir(dir: string) {
    for (const file of await afs.readdir(dir))
        fs.unlink(path.join(dir, file), _ => {});
}

function ensureDir(dir: string) {
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir, { recursive: true });
}

function appendMediaSize(url: string, info: MediaInfo) {
    const width = info.streams[0].width;
    const height = info.streams[0].height;
    return `${url}?width=${width}&height=${height}`;
}

async function resolveMediaInfo(filePath: string): Promise<MediaInfo> {
    return await require("ffprobe")(filePath, { path: require("ffprobe-static").path });
}
