import { MarkdownRenderer, MarkdownEnv, MarkdownOptions } from "vitepress";
import { AppendIconToExternalLinks } from "./md-link";
import { Replacer } from "./md-replacer";
import { NaniScript } from "./language";

export const Markdown: MarkdownOptions = {
    config: installPlugins,
    languages: [NaniScript],
    attrs: { disable: true } // https://github.com/vuejs/vitepress/issues/2440
};

function installPlugins(md: MarkdownRenderer) {
    md.use(Replacer(/\[@(\w+?)]/, buildCommandTags));
    md.use(Replacer(/\[!!(.+?)]/, buildYouTubeTags));
    md.use(Replacer(/\[!(\S+?)]/, buildVideoTags));
    md.use(AppendIconToExternalLinks);
}

function buildCommandTags(match: string[], env: MarkdownEnv) {
    let url = `/api/#${match[1].toLowerCase()}`;
    if (env.relativePath.startsWith("ja/")) url = "/ja" + url;
    else if (env.relativePath.startsWith("zh/")) url = "/zh" + url;
    else if (env.relativePath.startsWith("ru/")) url = "/ru" + url;
    return `<a href="${url}" target="_blank"><code>@${match[1]}</code></a>`;
}

function buildVideoTags(match: string[], _: MarkdownEnv) {
    const source = `<source src="${match[1]}" type="video/mp4">`;
    return `<video class="video" loop autoplay muted playsinline>${source}</video>`;
}

function buildYouTubeTags(match: string[], _: MarkdownEnv) {
    const source = `https://www.youtube-nocookie.com/embed/${match[1]}`;
    return `<span class="youtube"><iframe src="${source}" allowfullscreen></iframe></span>`;
}
