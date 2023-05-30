import { MarkdownRenderer, MarkdownEnv } from "vitepress";
import { Replacer } from "./md-replacer";

export function configureMarkdown(md: MarkdownRenderer) {
    md.use(Replacer(/\[@(\w+?)]/, buildCommandTags));
    md.use(Replacer(/\[!(\w+?)]/, buildVideoTags));
    md.use(Replacer(/\[!!(.+?)]/, buildYouTubeTags));
}

function buildCommandTags(match: string[], env: MarkdownEnv) {
    let url = `/api/#${match[1].toLowerCase()}`;
    if (env.relativePath.startsWith("ja/")) url = "/ja" + url;
    else if (env.relativePath.startsWith("zh/")) url = "/zh" + url;
    else if (env.relativePath.startsWith("ru/")) url = "/ru" + url;
    return `<a href="${url}" target="_blank"><code>@${match[1]}</code></a>`;
}

function buildVideoTags(match: string[], _: MarkdownEnv) {
    const source = `<source src="https://i.gyazo.com/${match[1]}.mp4" type="video/mp4">`;
    return `<video class="video" loop autoplay muted>${source}</video>`;
}

function buildYouTubeTags(match: string[], _: MarkdownEnv) {
    const source = `https://www.youtube-nocookie.com/embed/${match[1]}`;
    return `<span class="youtube"><iframe src="${source}" allowfullscreen></iframe></span>`;
}
