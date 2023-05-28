import { defineConfig } from "vitepress";
import { Locales, SearchLocales, NavBarTitle, NaniScript, configureMarkdown } from "./ext";

// https://vitepress.dev/reference/site-config

export default defineConfig({
    title: "Naninovel",
    appearance: "dark",
    cleanUrls: true,
    lastUpdated: true,
    head: [
        ["link", { rel: "icon", sizes: "any", href: "/assets/img/nani-logo.svg" }],
        ["meta", { name: "theme-color", content: "#1baeea" }],
        ["meta", { name: "og:image", content: "/assets/img/og.jpg" }],
        ["meta", { name: "twitter:card", content: "summary_large_image" }]
    ],
    themeConfig: {
        search: {
            provider: "algolia",
            options: {
                appId: "4PDIF5MCBA",
                apiKey: "61d68d300d7651efc10f2ff65fbbc047",
                indexName: "naninovel",
                locales: SearchLocales
            }
        },
        socialLinks: [
            { icon: "github", link: "https://github.com/Naninovel" },
            { icon: "discord", link: "https://discord.gg/BfkNqem" },
            { icon: "twitter", link: "https://twitter.com/naniengine" }
        ]
    },
    locales: Locales,
    vite: { resolve: { alias: [NavBarTitle] } },
    markdown: { config: configureMarkdown, languages: [NaniScript] }
});
