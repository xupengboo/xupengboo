import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "XuPengBoo",
  description: "XuPengBoo的个人技术知识库，记录开发成长、学习笔记、踩坑实践",
  lang: 'zh-CN',
  base: '/',
  // 设置favicon
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],

  // 主题相关配置
  themeConfig: {
    // TODO 左上角图标
    logo: '/logo.png',
    siteTitle: 'XuPengBoo',

    // 导航栏配置
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '技术笔记', link: '/notes/' },
      { text: '项目案例', link: '/projects/' },
      { text: '工具合集', link: '/tools/' },
      { text: '关于我', link: '/about/' },
    ],

    // 侧边栏配置
    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      },
      {
        text: '语言框架',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      },
    ],

    // 图标链接配置
    socialLinks: [
      { icon: 'github', link: 'https://github.com/xupengboo/xupengboo' },
    ],

    // 搜索插件配置
    search: {
      provider: 'local'
    },

    // 页脚
    footer: {
      message: '<a href="https://beian.miit.gov.cn/" target="_blank">鲁ICP备2025142295号-1</a>',
      copyright: 'Copyright © 2024-present XuPengBoo'
    },

  }
})
