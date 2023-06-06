import { ILanguageRegistration } from "shiki";
import { resolve } from "path";

// https://github.com/shikijs/shiki/blob/main/docs/languages.md#supporting-your-own-languages-with-shiki

export const NaniScript: ILanguageRegistration = {
    id: "naniscript",
    aliases: ["nani"],
    scopeName: "source.naniscript",
    path: resolve("./docs/.vitepress/ext/language/naniscript.tmLanguage.json")
};
