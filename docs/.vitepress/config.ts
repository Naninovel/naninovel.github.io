import { defineConfig } from "vitepress";
import { Override, Locale, NaniScript, configureMarkdown } from "./ext";

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
                locales: Locale.Search
            }
        },
        socialLinks: [
            { icon: "github", link: "https://github.com/Naninovel" },
            { icon: "discord", link: "https://discord.gg/BfkNqem" },
            { icon: "twitter", link: "https://twitter.com/naniengine" }
        ]
    },
    locales: Locale.Config,
    vite: { resolve: { alias: [Override.NavBarTitle, Override.NotFound] } },
    // https://github.com/vuejs/vitepress/issues/2440#issuecomment-1566981354
    markdown: { config: configureMarkdown, languages: [NaniScript], attrs: { disable: true } }
});
