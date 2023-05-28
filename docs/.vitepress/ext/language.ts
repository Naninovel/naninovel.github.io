// @ts-ignore
import { ILanguageRegistration } from "vitepress/dist/node";
import { readFileSync } from "fs";

// https://github.com/shikijs/shiki/blob/main/docs/languages.md#supporting-your-own-languages-with-shiki

export const NaniScript: ILanguageRegistration = {
    id: "naniscript",
    scopeName: "source.naniscript",
    grammar: JSON.parse(readFileSync("./docs/.vitepress/ext/naniscript.tmLanguage.json").toString()),
    aliases: ["nani"]
};
