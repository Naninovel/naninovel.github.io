import { UserConfig, Alias } from "vite";
import { fileURLToPath } from "url";
import { EmbedRemoteAssets } from "./vite-remote";

export const Vite: UserConfig = {
    resolve: {
        alias: [
            override("VPNavBarTitle", "nav-title"),
            override("NotFound", "not-found")
        ]
    },
    plugins: [EmbedRemoteAssets()]
};

// https://vitepress.dev/guide/extending-default-theme#overriding-internal-components
function override(original: string, override: string): Alias {
    return {
        find: new RegExp(`^.*\\/${original}\\.vue$`),
        replacement: fileURLToPath(new URL(`../../theme/${override}.vue`, import.meta.url))
    };
}
