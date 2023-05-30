const util = require("util");
let counter = 0;

export function Plugin(regexp, replacer) {
    let self: any = function (md, options) {
        self.options = options;
        self.init(md);
    };

    self.__proto__ = Plugin.prototype;

    let flags = (regexp.global ? "g" : "")
        + (regexp.multiline ? "m" : "")
        + (regexp.ignoreCase ? "i" : "");

    self.regexp = RegExp("^" + regexp.source, flags);
    self.replacer = replacer;
    self.id = "regexp-" + counter;
    counter++;

    return self;
}

util.inherits(Plugin, Function);

Plugin.prototype.init = function (md) {
    md.inline.ruler.push(this.id, this.parse.bind(this));
    md.renderer.rules[this.id] = this.render.bind(this);
};

Plugin.prototype.parse = function (state, silent) {
    let match = this.regexp.exec(state.src.slice(state.pos));
    if (!match) return false;

    state.pos += match[0].length;
    if (silent) return true;

    let token = state.push(this.id, "", 0);
    token.meta = { match: match };
    return true;
};

Plugin.prototype.render = function (tokens, id, options, env) {
    return this.replacer(tokens[id].meta.match, env.relativePath);
};
