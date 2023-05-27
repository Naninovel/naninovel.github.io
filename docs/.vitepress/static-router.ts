import { existsSync } from "fs";
import { resolve, join } from "path";
import { resolveConfig } from "vitepress";
import { PluginOption, Connect } from "vite";
import { IncomingMessage, ServerResponse } from "http";

// https://github.com/vuejs/vitepress/issues/2426

let publicDir = "";

export const StaticRouter: PluginOption = {
    name: "route-static",
    config: initialize,
    configureServer: server => void server.middlewares.use(handleRequest)
};

async function initialize() {
    const config = await resolveConfig();
    publicDir = resolve(config.srcDir, "public");
}

function handleRequest(req: IncomingMessage, res: ServerResponse, next: Connect.NextFunction) {
    if (shouldRouteToStaticIndex(req.url))
        req.url = appendIndex(req.url);
    next();
}

function shouldRouteToStaticIndex(uri: string) {
    return existsSync(join(publicDir, uri, "index.html"));
}

function appendIndex(uri: string) {
    if (uri.endsWith("/")) return uri + "index.html";
    else return uri + "/index.html";
}
