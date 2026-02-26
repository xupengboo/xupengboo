import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "XuPengBoo",
  description: "XuPengBoo的个人技术知识库，记录开发成长、学习笔记、踩坑实践",
  lang: 'zh-CN',
  base: '/',
  head: [
    // 网站图标，替换为你自己的favicon（放在docs/public目录下）
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],


  // 主题相关配置
  themeConfig: {

    // 导航栏配置
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '案例', link: '/markdown-examples' },
      { text: '语言框架', link: '/lang/c/c-basis.md' },
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
    }

  }
})
