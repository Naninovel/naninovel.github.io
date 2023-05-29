import { MarkdownRenderer } from "vitepress";
import regexp from "markdown-it-regexp";

export function configureMarkdown(md: MarkdownRenderer) {
    md.use(regexp(/\[@(\w+?)]/, m => buildCommandTags(md, m)));
    md.use(regexp(/\[!(\w+?)]/, m => buildVideoTags(md, m)));
    md.use(regexp(/\[!!(.+?)]/, m => buildYouTubeTags(md, m)));
}

function buildCommandTags(md: MarkdownRenderer, match: string) {
    let url = `/api/#${match[1].toLowerCase()}`;
    if (md["links"] !== undefined) {
        let route = md["links"][0];
        if (route.startsWith("/ja/")) url = "/ja" + url;
        else if (route.startsWith("/zh/")) url = "/zh" + url;
        else if (route.startsWith("/ru/")) url = "/ru" + url;
    }
    return `<a href="${url}" class="" target="_blank"><code>@${match[1]}</code></a>`;
}

function buildVideoTags(md: MarkdownRenderer, match: string) {
    const source = `<source src="https://i.gyazo.com/${match[1]}.mp4" type="video/mp4">`;
    return `<video class="video" loop autoplay muted>${source}</video>`;
}

function buildYouTubeTags(md: MarkdownRenderer, match: string) {
    const iframe = `<iframe src="https://www.youtube-nocookie.com/embed/${match[1]}" allowfullscreen></iframe>`;
    return `<div class="video-container">${iframe}</div>`;
}
