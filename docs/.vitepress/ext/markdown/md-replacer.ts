import { MarkdownRenderer, MarkdownEnv } from "vitepress";
import { inherits } from "util";

// Based on https://github.com/rlidwka/markdown-it-regexp.

let id = 0;

export function Replacer(regexp: RegExp, replace: (match: string[], env: MarkdownEnv) => string) {
    let self: any = (md: MarkdownRenderer) => {
        self.init(md);
    };
    self.__proto__ = Replacer.prototype;
    self.regexp = regexp;
    self.replace = replace;
    self.id = `md-replacer-${id}`;
    id++;
    return self;
}

inherits(Replacer, Function);

Replacer.prototype.init = function (md: MarkdownRenderer) {
    md.inline.ruler.push(this.id, this.parse.bind(this));
    md.renderer.rules[this.id] = this.render.bind(this);
};

Replacer.prototype.parse = function (state, silent) {
    let match = this.regexp.exec(state.src.slice(state.pos));
    if (!match) return false;

    state.pos += match[0].length;
    if (silent) return true;

    let token = state.push(this.id, "", 0);
    token.meta = { match: match };
    return true;
};

Replacer.prototype.render = function (tokens, id, options, env: MarkdownEnv) {
    return this.replace(tokens[id].meta.match, env);
};
