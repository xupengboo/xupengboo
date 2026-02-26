import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "XuPengBoo",
  description: "个人知识库项目",

  // 主题相关配置
  themeConfig: {

    // 导航栏配置
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    // 侧边栏配置
    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
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
