import { defineConfig } from "vitepress";
import { NavBarTitle } from "./override";

// https://vitepress.dev/reference/site-config

export default defineConfig({
    title: "Naninovel",
    description: "Writer-friendly visual novel engine.",
    appearance: "dark",
    head: [
        ["link", { rel: "icon", sizes: "any", href: "/assets/img/nani-logo.svg" }],
        ["meta", { name: "og:image", content: "/assets/img/og.jpg" }],
        ["meta", { name: "twitter:card", content: "summary_large_image" }]
    ],
    themeConfig: {
        nav: [
            { text: "Examples", link: "/markdown-examples" }
        ],
        search: {
            provider: "algolia",
            options: {
                appId: "4PDIF5MCBA",
                apiKey: "61d68d300d7651efc10f2ff65fbbc047",
                indexName: "naninovel"
            }
        },
        sidebar: [
            {
                text: "Examples",
                items: [
                    { text: "Markdown Examples", link: "/markdown-examples" },
                    { text: "Runtime API Examples", link: "/api-examples" }
                ]
            }
        ],
        socialLinks: [
            { icon: "github", link: "https://github.com/Naninovel" },
            { icon: "discord", link: "https://discord.gg/BfkNqem" },
            { icon: "twitter", link: "https://twitter.com/naniengine" }
        ]
    },
    vite: { resolve: { alias: [NavBarTitle] } },
    cleanUrls: true
});
