import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "PengBoo",
  description: "xupengboo的个人博客，基于VuePress构建的静态网站，主要用于分享和记录你的学习笔记、技术心得或其他有价值的内容。",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
