import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  // "/portfolio",
  {
    text: "开始使用",
    icon: "book",
    link: "/start/"
  },
  {
    text: "测试案例",
    icon: "lightbulb",
    prefix: "/demo/",
    children: [
      {
        text: "布局与功能禁用",
        icon: "lightbulb",
        link: "disable.md",
      },
      {
        text: "密码加密的文章",
        icon: "lightbulb",
        link: "encrypt.md",
      },
      {
        text: "布局指南",
        icon: "lightbulb",
        link: "layout.md",
      },
      {
        text: "Markdown 展示",
        icon: "lightbulb",
        link: "markdown.md",
      },
      {
        text: "页面配置",
        icon: "lightbulb",
        link: "page.md",
      },
    ],
  },
   {
    text: "开源地址",
    icon: "mdi:github",
    link: "https://github.com/xupengboo/xupengboo.git",
  },
  // {
  //   text: "V2 文档",
  //   icon: "book",
  //   link: "https://theme-hope.vuejs.press/zh/",
  // },
]);
