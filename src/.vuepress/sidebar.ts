import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    {
      text: "开始使用",
      icon: "akar-icons:edit",
      link: 'start/'
    },
    {
      text: "基础语言",
      icon: "material-symbols:language",
      prefix: "lang/",
      children: "structure",
      collapsible: true,
    },
    {
      text: "框架设计",
      icon: "book",
      prefix: "frame/",
      children: "structure",
      collapsible: true,
    },
    {
      text: "运维部署",
      icon: "laptop-code",
      prefix: "ops/",
      children: "structure",
      collapsible: true,
    },
    // {
    //   text: "案例介绍",
    //   icon: "laptop-code",
    //   prefix: "demo/",
    //   link: "demo/",
    //   children: "structure",
    //   collapsible: true,
    // },
  ],
});


// export default sidebar({
//   "/": [
//     "",
//     "portfolio",
//     {
//       text: "案例",
//       icon: "laptop-code",
//       prefix: "demo/",
//       link: "demo/",
//       children: "structure",
//     },
//     {
//       text: "文档",
//       icon: "book",
//       prefix: "guide/",
//       children: "structure",
//     },
//     {
//       text: "幻灯片",
//       icon: "person-chalkboard",
//       link: "https://ecosystem.vuejs.press/zh/plugins/markdown/revealjs/demo.html",
//     },
//   ],
// });