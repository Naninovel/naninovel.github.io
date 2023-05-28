import { defineConfig } from "vitepress";
import { Locales, SearchLocales } from "./locales";
import { NavBarTitle } from "./override";

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
    markdown: {
        config: (md) => {
            md.use(require("markdown-it-regexp")(/\[@(\w+?)]/, function (match, _) {
                let url = `/api/#${match[1].toLowerCase()}`;
                if (md["links"] !== undefined) {
                    let route = md["links"][0];
                    if (route.startsWith("/ja/")) url = "/ja" + url;
                    else if (route.startsWith("/zh/")) url = "/zh" + url;
                    else if (route.startsWith("/ru/")) url = "/ru" + url;
                }
                return `<a href="${url}" class="" target="_blank"><code>@${match[1]}</code></a>`;
            }));
            md.use(require("markdown-it-regexp")(/\[!(\w+?)]/, function (match, _) {
                return `<video class="video" loop autoplay muted><source src="https://i.gyazo.com/${match[1]}.mp4" type="video/mp4"></video>`;
            }));
            md.use(require("markdown-it-regexp")(/\[!!(.+?)]/, function (match, _) {
                return `<div class="video-container"><iframe src="https://www.youtube-nocookie.com/embed/${match[1]}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
            }));
        }
    }
});
