import { TransformContext } from "vitepress";

export function rewriteTags(html: string, id: string, ctx: TransformContext) {
    return html
        .replace(/\[@(\w+?)]/g, (_, g1) => rewriteCommandTags(ctx.page, g1))
        .replace(/\[!(\w+?)]/g, (_, g1) => rewriteVideoTags(g1))
        .replace(/\[!!(.+?)]/g, (_, g1) => rewriteYouTubeTags(g1));
}

function rewriteCommandTags(uri: string, commandId: string) {
    let url = `/api/#${commandId.toLowerCase()}`;
    if (uri.startsWith("ja/")) url = "/ja" + url;
    else if (uri.startsWith("zh/")) url = "/zh" + url;
    else if (uri.startsWith("ru/")) url = "/ru" + url;
    return `<a href="${url}" target="_blank"><code>@${commandId}</code></a>`;
}

function rewriteVideoTags(videoId: string) {
    const source = `<source src="https://i.gyazo.com/${videoId}.mp4" type="video/mp4">`;
    return `<video class="video" loop autoplay muted>${source}</video>`;
}

function rewriteYouTubeTags(videoUrl: string) {
    const iframe = `<iframe src="https://www.youtube-nocookie.com/embed/${videoUrl}" allowfullscreen></iframe>`;
    return `<div class="video-container">${iframe}</div>`;
}
