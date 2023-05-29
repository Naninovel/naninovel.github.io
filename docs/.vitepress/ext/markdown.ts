import { MarkdownRenderer } from "vitepress";
import regexp from "markdown-it-regexp";

export function configureMarkdown(md: MarkdownRenderer) {
    md.use(regexp(/\[@(\w+?)]/, function (match, _) {
        let url = `/api/#${match[1].toLowerCase()}`;
        if (md["links"] !== undefined) {
            let route = md["links"][0];
            if (route.startsWith("/ja/")) url = "/ja" + url;
            else if (route.startsWith("/zh/")) url = "/zh" + url;
            else if (route.startsWith("/ru/")) url = "/ru" + url;
        }
        return `<a href="${url}" class="" target="_blank"><code>@${match[1]}</code></a>`;
    }));
    md.use(regexp(/\[!(\w+?)]/, function (match, _) {
        return `<video class="video" loop autoplay muted><source src="https://i.gyazo.com/${match[1]}.mp4" type="video/mp4"></video>`;
    }));
    md.use(regexp(/\[!!(.+?)]/, function (match, _) {
        return `<div class="video-container"><iframe src="https://www.youtube-nocookie.com/embed/${match[1]}" allowfullscreen></iframe></div>`;
    }));
}
