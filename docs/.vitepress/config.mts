import { defineConfig } from 'vitepress'

let title = "XuPengBoo"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: title,
  description: "XuPengBoo的个人技术知识库，记录开发成长、学习笔记、踩坑实践",
  lang: 'zh-CN',
  base: '/',
  // 设置favicon
  // head: [['link', { rel: 'icon', href: '/favicon.ico' }]],

  // 主题相关配置
  themeConfig: {
    // 主题名
    siteTitle: title,

    // ==========================================
    // 1. 顶部导航栏 (Nav)
    // ==========================================
    nav: [
      { text: '首页', link: '/' },
      // 点击顶部导航，默认跳转到该分类的第一个文档或引导页
      { text: '💻 软件开发', link: '/dev/intro', activeMatch: '/dev/' },
      { text: '☁️ 运维与数据', link: '/ops/intro', activeMatch: '/ops/' },
      { text: '🤖 AI大模型', link: '/ai/intro', activeMatch: '/ai/' },
      {
        text: '🎒 更多',
        items: [
          { text: '算法心得', link: '/more/algo/' },
          { text: '开发工具', link: '/more/tools/git' },
          { text: '架构构思', link: '/more/arch/' }
        ]
      }
    ],

    // ==========================================
    // 2. 动态多侧边栏 (Sidebar) - 根据路由切换
    // ==========================================
    sidebar: {
      // 当 URL 以 /dev/ 开头时，显示这个侧边栏
      '/dev/': [
        {
          text: '🛠️ 开发工具箱', // 把 Git 放在这里，让它看起来很专业
          collapsed: true,
          items: [
            { text: 'Git 核心实战', link: '/dev/tools/git' },
          ]
        },
        {
          text: '☕ Java 生态',
          collapsed: true, // 默认展开
          items: [
            { text: 'Java 设计模式', link: '/dev/java/design' },
          ]
        },
        {
          text: '🐍 Python 与 C',
          collapsed: true,
          items: [
            { text: 'Python 基础', link: '/dev/python/basic' },
          ]
        },
        {
          text: '🌐 前端开发',
          collapsed: true, // 默认折叠
          items: [
            { text: 'nvm 使用', link: '/dev/front/nvm' },
          ]
        },
      ],

      // 当 URL 以 /ops/ 开头时，显示运维侧边栏
      '/ops/': [
        {
          text: '🐳 Docker 容器化',
          collapsed: true, // 默认展开
          items: [
            { text: 'Docker 核心命令', link: '/ops/docker/核心命令' },
            { text: 'Docker 单机部署', link: '/ops/docker/单机部署' },
          ]
        },
        {
          text: '☸️ Kubernetes 集群',
          collapsed: true, // 初始折叠，节省空间
          items: [
            { text: 'yaml配置', link: '/ops/k8s/yaml' },
          ]
        },
        {
          text: '🗄️ 数据库与中间件',
          collapsed: true,
          items: [
            { text: 'MySQL 基础', link: '/ops/db/mysql-basis' },
          ]
        },
        {
          text: '🛠️ 服务器',
          collapsed: true,
          items: [
              { text: 'Linux 常用命令', link: '/ops/server/linux-bash' },
          ]
        }
      ],

      // 当 URL 以 /ai/ 开头时，显示大模型侧边栏
      '/ai/': [
        {
          text: '🤖 大模型基础',
          collapsed: true,
          items: [
            { text: 'LLM 理论导论', link: '/ai/llm/llm' },
          ]
        },
        {
          text: '🛠️ AI 应用开发',
          collapsed: true,
          items: [
            { text: '本地大模型部署', link: '/ai/app/app' }
          ]
        }
      ],

      // 更多分类侧边栏
      // '/more/': [ ... ]
    },

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
  },
  markdown: {
    image: {
      // 启用图片懒加载
      lazyLoading: true
    }
  }
})
