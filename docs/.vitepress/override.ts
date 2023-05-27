import { Alias } from "vite";
import { fileURLToPath } from "url";

// https://vitepress.dev/guide/extending-default-theme#overriding-internal-components

export const NavBarTitle = override("VPNavBarTitle", "title");

function override(original: string, override: string): Alias {
    return {
        find: new RegExp(`^.*\\/${original}\\.vue$`),
        // @ts-ignore
        replacement: fileURLToPath(new URL(`./theme/${override}.vue`, import.meta.url))
    };
}
