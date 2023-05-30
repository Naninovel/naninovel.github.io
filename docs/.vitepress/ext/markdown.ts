import { MarkdownRenderer } from "vitepress";
import { Plugin } from "./md-regex";

export function configureMarkdown(md: MarkdownRenderer) {
    md.use(Plugin(/\[@(\w+?)]/, (match, page) => buildCommandTags(match, page)));
    md.use(Plugin(/\[!(\w+?)]/, buildVideoTags));
    md.use(Plugin(/\[!!(.+?)]/, buildYouTubeTags));
}

function buildCommandTags(match: string, page: string) {
    let url = `/api/#${match[1].toLowerCase()}`;
    if (page.startsWith("ja/")) url = "/ja" + url;
    else if (page.startsWith("zh/")) url = "/zh" + url;
    else if (page.startsWith("ru/")) url = "/ru" + url;
    return `<a href="${url}" target="_blank"><code>@${match[1]}</code></a>`;
}

function buildVideoTags(match: string) {
    const source = `<source src="https://i.gyazo.com/${match[1]}.mp4" type="video/mp4">`;
    return `<video class="video" loop autoplay muted>${source}</video>`;
}

function buildYouTubeTags(match: string) {
    const iframe = `<iframe src="https://www.youtube-nocookie.com/embed/${match[1]}" allowfullscreen></iframe>`;
    return `<div class="video-container">${iframe}</div>`;
}
