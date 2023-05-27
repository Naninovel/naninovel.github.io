import DefaultTheme from "vitepress/theme";
import { EnhanceAppContext } from "vitepress";
import "./style.css";

// https://vitepress.dev/guide/extending-default-theme

export default {
    extends: DefaultTheme,
    enhanceApp(_: EnhanceAppContext) {}
};
