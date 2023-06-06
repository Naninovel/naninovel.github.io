import type { Plugin, ResolvedConfig } from "vite";
import axios from "axios";
import MagicString from "magic-string";
import fs from "node:fs";
import afs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

// Based on https://github.com/antfu/vite-plugin-remote-assets.

export interface RemoteAssetsOptions {
    regex?: RegExp;
    assetsDir?: string;
    retryLimit?: number;
    maxRetryDelay?: number;
}

type MediaInfo = {
    streams: MediaStream[];
}

type MediaStream = {
    index: number;
    width: number;
    height: number;
}

export function EmbedRemoteAssets(options?: RemoteAssetsOptions): Plugin {
    const regex = options?.regex ?? /\b(https?:\/\/[\w_#&?.\/-]*?\.(?:png|jpe?g|svg|gif|mp4))(?=[`'")\]])/ig;
    const assetsDir = path.resolve(options?.assetsDir ?? "./docs/.vitepress/cache/.remote-assets");
    const retryLimit = options?.retryLimit ?? 3;
    const maxRetryDelay = options?.maxRetryDelay ?? 10;
    const retries = new Map<string, number>;
    let config: ResolvedConfig;

    return {
        name: "vite-plugin-embed-remote-assets",
        enforce: "pre",
        configResolved: initialize,
        transform: downloadAndReplaceRemote
    };

    async function initialize(resolved: ResolvedConfig) {
        config = resolved;
        if (config.server.force)
            await emptyDir(assetsDir);
        ensureDir(assetsDir);
    }

    async function downloadAndReplaceRemote(code: string, id: string) {
        const magic = new MagicString(code);
        const remotes = new Set<string>;
        let match;

        regex.lastIndex = 0;
        while ((match = regex.exec(code))) {
            const start = match.index;
            const end = start + match[0].length;
            const url = match[0] as string;
            if (!url || !isValidHttpUrl(url)) continue;

            const hash = md5(url) + path.extname(url);
            const filepath = path.resolve(assetsDir, hash).replace(/\\/g, "/");
            if (!remotes.has(filepath) && !fs.existsSync(filepath))
                await downloadWithRetries(url, filepath);
            remotes.add(filepath);

            let newUrl = path.relative(path.dirname(id), `${assetsDir}/${hash}`).replace(/\\/g, "/");
            if (!newUrl.startsWith("./")) newUrl = "./" + newUrl;
            newUrl += await buildMediaInfoUrlVars(filepath);
            magic.overwrite(start, end, newUrl);
        }

        return remotes.size === 0 ? null : {
            code: magic.toString(),
            map: config.build.sourcemap ? magic.generateMap({ hires: true }) : null
        };
    }

    async function downloadWithRetries(url: string, filepath: string) {
        try { return await downloadTo(url, filepath); }
        catch (error) {
            retries[filepath] = (retries.get(filepath) ?? 0) + 1;
            if (retries[filepath] > retryLimit) {
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
        const response = await axios({
            url,
            method: "GET",
            responseType: "arraybuffer",
            timeout: 30 * 1000,
            timeoutErrorMessage: `Failed to download ${url}: timeout > 30 seconds.`,
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
}

function isValidHttpUrl(str: string) {
    let url;
    try { url = new URL(str); }
    catch (_) { return false; }
    return url.protocol === "http:" || url.protocol === "https:";
}

function md5(str: string) {
    return crypto.createHash("md5").update(str).digest("hex");
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

async function buildMediaInfoUrlVars(filepath: string) {
    const info = await getMediaInfo(filepath);
    const width = info.streams[0].width;
    const height = info.streams[0].height;
    return `?width=${width}&height=${height}`;
}

async function getMediaInfo(path: string): Promise<MediaInfo> {
    return await require("ffprobe")(path, { path: require("ffprobe-static").path });
}
