import { LocaleConfig, DefaultTheme } from "vitepress";
import { DocSearchProps } from "vitepress/types/docsearch";
import { EnGuideSidebar, JaGuideSidebar, ZnGuideSidebar, RuGuideSidebar } from "./sidebars";

export const Locales: LocaleConfig<DefaultTheme.Config> = {
    root: {
        lang: "en-US",
        label: "English",
        description: "Writer-friendly visual novel engine.",
        themeConfig: {
            langMenuLabel: "Language",
            lastUpdatedText: "Last Updated",
            sidebarMenuLabel: "Menu",
            darkModeSwitchLabel: "Appearance",
            outline: { label: "On this page" },
            sidebar: { "/guide/": EnGuideSidebar },
            docFooter: { prev: "Previous page", next: "Next page" },
            editLink: {
                pattern: "https://github.com/Naninovel/Documentation/edit/main/docs/:path",
                text: "Edit this page on GitHub"
            },
            nav: [
                { text: "FAQ", link: "/faq/" },
                { text: "Guide", link: "/guide/" },
                { text: "Commands", link: "/api/" },
                { text: "Support", link: "/support/" }
            ]
        }
    },
    ja: {
        lang: "ja-JP",
        label: "日本語",
        description: "Unityゲームエンジン用のフル機能を備えた、ライター向けで完全にカスタマイズ可能なビジュアルノベル拡張。",
        themeConfig: {
            langMenuLabel: "言語",
            lastUpdatedText: "最終更新 日",
            sidebarMenuLabel: "メニュー",
            darkModeSwitchLabel: "外観",
            outline: { label: "このページでは" },
            sidebar: { "/ja/guide/": JaGuideSidebar },
            docFooter: { prev: "前のページ", next: "次のページ" },
            editLink: {
                pattern: "https://github.com/Naninovel/Documentation/edit/main/docs/:path",
                text: "GitHub でこのページを編集する"
            },
            nav: [
                { text: "FAQ", link: "/ja/faq/" },
                { text: "ガイド", link: "/ja/guide/" },
                { text: "コマンド", link: "/ja/api/" },
                { text: "サポート", link: "/ja/support/" }
            ]
        }
    },
    zh: {
        lang: "zh-CN",
        label: "中文",
        description: "功能齐全、易于编写且完全可自定义的Unity游戏引擎视觉小说插件。",
        themeConfig: {
            langMenuLabel: "语言",
            lastUpdatedText: "最近更新时间",
            sidebarMenuLabel: "菜单",
            darkModeSwitchLabel: "外貌",
            outline: { label: "在本页" },
            sidebar: { "/zh/guide/": ZnGuideSidebar },
            docFooter: { prev: "上一页", next: "下一页" },
            editLink: {
                pattern: "https://github.com/Naninovel/Documentation/edit/main/docs/:path",
                text: "在 GitHub 上编辑此页面"
            },
            nav: [
                { text: "常见问题", link: "/zh/faq/" },
                { text: "指南", link: "/zh/guide/" },
                { text: "指令", link: "/zh/api/" },
                { text: "技术支持", link: "/zh/support/" }
            ]
        }
    },
    ru: {
        lang: "ru-RU",
        label: "Русский",
        description: "Расширение игрового движка Unity для создания визуальных новелл.",
        themeConfig: {
            langMenuLabel: "Язык",
            lastUpdatedText: "Обновлено",
            sidebarMenuLabel: "Меню",
            darkModeSwitchLabel: "Оформление",
            outline: { label: "На этой странице" },
            sidebar: { "/ru/guide/": RuGuideSidebar },
            docFooter: { prev: "Предыдущая страница", next: "Следующая страница" },
            editLink: {
                pattern: "https://github.com/Naninovel/Documentation/edit/main/docs/:path",
                text: "Редактировать эту страницу на GitHub"
            },
            nav: [
                { text: "FAQ", link: "/ru/faq/" },
                { text: "Руководство", link: "/ru/guide/" },
                { text: "Команды", link: "/ru/api/" },
                { text: "Поддержка", link: "/ru/support/" }
            ]
        }
    }
};

export const SearchLocales: Record<string, Partial<DocSearchProps>> = {
    ja: {
        placeholder: "文書を検索する",
        translations: {
            button: {
                buttonText: "文書を検索する",
                buttonAriaLabel: "文書を検索する"
            },
            modal: {
                searchBox: {
                    resetButtonTitle: "明確なクエリ基準",
                    resetButtonAriaLabel: "明確なクエリ基準",
                    cancelButtonText: "キャンセル",
                    cancelButtonAriaLabel: "キャンセル"
                },
                startScreen: {
                    recentSearchesTitle: "検索履歴",
                    noRecentSearchesText: "検索履歴がありません",
                    saveRecentSearchButtonTitle: "検索履歴に保存",
                    removeRecentSearchButtonTitle: "検索履歴から削除する",
                    favoriteSearchesTitle: "収集",
                    removeFavoriteSearchButtonTitle: "お気に入りから削除"
                },
                errorScreen: {
                    titleText: "結果が得られない",
                    helpText: "インターネット接続を確認する必要がある場合があります"
                },
                footer: {
                    selectText: "選ぶ",
                    navigateText: "切り替える",
                    closeText: "閉鎖",
                    searchByText: ""
                },
                noResultsScreen: {
                    noResultsText: "結果がありません",
                    suggestedQueryText: "クエリを試すことができます",
                    reportMissingResultsText: "クエリには結果が必要だと考えている？",
                    reportMissingResultsLinkText: "クリックフィードバック"
                }
            }
        }
    },
    zh: {
        placeholder: "搜索文档",
        translations: {
            button: {
                buttonText: "搜索文档",
                buttonAriaLabel: "搜索文档"
            },
            modal: {
                searchBox: {
                    resetButtonTitle: "清除查询条件",
                    resetButtonAriaLabel: "清除查询条件",
                    cancelButtonText: "取消",
                    cancelButtonAriaLabel: "取消"
                },
                startScreen: {
                    recentSearchesTitle: "搜索历史",
                    noRecentSearchesText: "没有搜索历史",
                    saveRecentSearchButtonTitle: "保存至搜索历史",
                    removeRecentSearchButtonTitle: "从搜索历史中移除",
                    favoriteSearchesTitle: "收藏",
                    removeFavoriteSearchButtonTitle: "从收藏中移除"
                },
                errorScreen: {
                    titleText: "无法获取结果",
                    helpText: "你可能需要检查你的网络连接"
                },
                footer: {
                    selectText: "选择",
                    navigateText: "切换",
                    closeText: "关闭",
                    searchByText: ""
                },
                noResultsScreen: {
                    noResultsText: "无法找到相关结果",
                    suggestedQueryText: "你可以尝试查询",
                    reportMissingResultsText: "你认为该查询应该有结果？",
                    reportMissingResultsLinkText: "点击反馈"
                }
            }
        }
    },
    ru: {
        placeholder: "Искать документы",
        translations: {
            button: {
                buttonText: "Поиск",
                buttonAriaLabel: "Поиск"
            },
            modal: {
                searchBox: {
                    resetButtonTitle: "Сброс",
                    resetButtonAriaLabel: "Сброс",
                    cancelButtonText: "Отмена",
                    cancelButtonAriaLabel: "Отмена"
                },
                startScreen: {
                    recentSearchesTitle: "Последние запросы",
                    noRecentSearchesText: "Нет последних запросов",
                    saveRecentSearchButtonTitle: "Сохранить",
                    removeRecentSearchButtonTitle: "Удалить",
                    favoriteSearchesTitle: "Сохранённые запросы",
                    removeFavoriteSearchButtonTitle: "Удалить"
                },
                errorScreen: {
                    titleText: "Ошибка",
                    helpText: "Подсказка ошибки"
                },
                footer: {
                    selectText: "Выбрать",
                    navigateText: "Навигация",
                    closeText: "Закрыть",
                    searchByText: ""
                },
                noResultsScreen: {
                    noResultsText: "Ничего не найдено",
                    suggestedQueryText: "Возможно вы искали"
                }
            }
        }
    }
};
