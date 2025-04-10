import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    {
      text: "开始使用",
      icon: "akar-icons:edit",
      link: 'start/'
    },
    {
      text: "语言框架",
      icon: "material-symbols:language",
      prefix: "lang/",
      children: "structure",
      // children: [
      //   {
      //     text: "C 语言",
      //     prefix: "c/",
      //     children: "structure",
      //     collapsible: true,
      //   },
      //   {
      //     text: "Python 语言",
      //     prefix: "python/",
      //     children: "structure",
      //     collapsible: true,
      //   },
      //   {
      //     text: "Java 语言",
      //     prefix: "java/",
      //     children: "structure",
      //     collapsible: true,
      //   },
      //   {
      //     text: "JavaScript 语言",
      //     prefix: "js/",
      //     children: "structure",
      //     collapsible: true,
      //   },
      //   {
      //     text: "HTML 界面",
      //     prefix: "html/",
      //     children: "structure",
      //     collapsible: true,
      //   },
      //   {
      //     text: "CSS 样式",
      //     prefix: "css/",
      //     children: "structure",
      //     collapsible: true,
      //   },
      //   {
      //     text: "Git 工具",
      //     prefix: "git/",
      //     children: "structure",
      //     collapsible: true,
      //   },
      //   {
      //     text: "Node 环境",
      //     prefix: "node/",
      //     children: "structure",
      //     collapsible: true,
      //   },
      //   {
      //     text: "Vue 框架",
      //     prefix: "vue/",
      //     children: "structure",
      //     collapsible: true,
      //   },
      //   {
      //     text: "Spring Boot 框架",
      //     prefix: "springboot/",
      //     children: "structure",
      //     collapsible: true,
      //   },
      //   {
      //     text: "Spring Cloud 框架",
      //     prefix: "springcloud/",
      //     children: "structure",
      //     collapsible: true,
      //   },
      //   {
      //     text: "Flowable 流程引擎",
      //     prefix: "flowable/",
      //     children: "structure",
      //     collapsible: true,
      //   },
      // ],
      collapsible: true,
    },
    {
      text: "架构设计",
      icon: "book",
      prefix: "architecture/",
      children: "structure",
      collapsible: true,
    },
    {
      text: "算法心得",
      icon: "hugeicons:algorithm",
      prefix: "algorithm/",
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
    {
      text: "数据库",
      icon: "mdi:database-outline",
      prefix: "db/",
      children: "structure",
      collapsible: true,
    },
    {
      text: "平台应用",
      icon: "ep:platform",
      prefix: "platform/",
      children: "structure",
      collapsible: true,
    },
    {
      text: "大数据",
      icon: "lsicon:data-filled",
      prefix: "bigdata/",
      children: "structure",
      collapsible: true,
    },
    // {
    //   text: "第三方工具",
    //   icon: "mdi:tools",
    //   prefix: "tools/",
    //   children: "structure",
    //   collapsible: true,
    // },
    {
      text: "计算机网络",
      icon: "ooui:network",
      prefix: "network/",
      children: "structure",
      collapsible: true,
    },
    {
      text: "云计算",
      icon: "hugeicons:computer-cloud",
      prefix: "cloud-computing/",
      children: "structure",
      collapsible: true,
    },
    {
      text: "其他",
      icon: "fluent-mdl2:checked-out-by-other-12",
      prefix: "other/",
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
