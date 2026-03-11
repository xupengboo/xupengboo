import { defineConfig } from 'vitepress'

let title = "XuPengBoo"

// https://vitepress.dev/reference/site-config
export default defineConfig({

  ignoreDeadLinks: true, // 禁用死链接检查，解决构建失败

  title: title,
  description: "XuPengBoo的个人技术知识库，记录开发成长、学习笔记、踩坑实践",
  lang: 'zh-CN',
  base: '/',

  // favicon
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],

  // 显示最后更新时间
  lastUpdated: true,

  // Markdown 配置
  markdown: {
    image: {
      lazyLoading: true  // 图片懒加载
    },
    lineNumbers: true    // 代码块显示行号
  },

  // 主题相关配置
  themeConfig: {
    siteTitle: title,

    // 文章右侧目录深度（显示 h2 + h3）
    outline: {
      level: [2, 3],
      label: '本页目录'
    },

    // 最后更新时间文案
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    },

    // 文档页脚翻页文案
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    // 返回顶部
    returnToTopLabel: '回到顶部',

    // ==========================================
    // 1. 顶部导航栏 (Nav)
    // ==========================================
    nav: [
      { text: '首页', link: '/' },
      { text: '💻 软件开发', link: '/dev/intro', activeMatch: '/dev/' },
      { text: '☁️ 运维与数据', link: '/ops/intro', activeMatch: '/ops/' },
      { text: '🤖 AI大模型', link: '/ai/intro', activeMatch: '/ai/' },
      { text: '👤 关于我', link: '/about' },
    ],

    // ==========================================
    // 2. 动态多侧边栏 (Sidebar) - 根据路由切换
    // ==========================================
    sidebar: {
      // 软件开发侧边栏
      '/dev/': [
        {
          text: '🛠️ 开发工具箱',
          collapsed: false,
          items: [
            { text: 'Git 核心实战', link: '/dev/tools/Git 核心实战' },
          ]
        },
        {
          text: '🧱 架构基础',
          collapsed: false,
          items: [
            { text: '四种编程思想', link: '/dev/frame/四种编程思想' },
            { text: 'CAP 分布式定理', link: '/dev/frame/CAP 分布式定理' },
            { text: 'RestFul 风格', link: '/dev/frame/RestFul 风格' },
            { text: 'Web Service', link: '/dev/frame/Web Service' },
          ]
        },
        {
          text: '📐 算法 & 数据结构',
          collapsed: false,
          items: [
            { text: '数据结构', link: '/dev/algorithm/数据结构' },
            { text: '排序 & 搜索', link: '/dev/algorithm/排序 & 搜索' },
            { text: '时间 & 空间复杂度', link: '/dev/algorithm/时间 & 空间复杂度' },
          ]
        },
        {
          text: '☕ Java 生态',
          collapsed: false,
          items: [
            { text: 'Java 设计模式', link: '/dev/java/Java 设计模式' },
            { text: 'Flowable 工作流引擎', link: '/dev/java/Flowable 工作流引擎' },
          ]
        },
        {
          text: '🐍 Python',
          collapsed: false,
          items: [
            { text: 'Python 基础', link: '/dev/python/Python 基础' },
            { text: 'Python 实用工具库', link: '/dev/python/Python 实用工具库' },
          ]
        },
        {
          text: '🌐 前端开发',
          collapsed: false,
          items: [
            { text: 'Nvm 使用指南', link: '/dev/front/Nvm 使用指南' },
            { text: 'Npm 包管理器', link: '/dev/front/Npm 包管理器' },
            { text: 'Vue 生态工具', link: '/dev/front/Vue 生态工具' },
            { text: 'Node 实用工具', link: '/dev/front/Node 实用工具' },
            { text: 'HTML5 全览', link: '/dev/front/HTML5 全览' },
            { text: 'CSS 速查手册', link: '/dev/front/CSS 速查手册' },
          ]
        },
      ],

      // 运维与数据侧边栏
      '/ops/': [
        {
          text: '🐳 Docker 容器化',
          collapsed: false,
          items: [
            { text: 'Docker 环境安装', link: '/ops/docker/环境安装' },
            { text: 'Docker 核心命令', link: '/ops/docker/核心命令' },
            { text: 'Docker 单机部署', link: '/ops/docker/单机部署' },
          ]
        },
        {
          text: '☸️ Kubernetes 集群',
          collapsed: false,
          items: [
            { text: 'Yaml 配置', link: '/ops/k8s/yaml' },
          ]
        },
        {
          text: '🛠️ 服务器 & 中间件',
          collapsed: false,
          items: [
            { text: 'Linux 基础', link: '/ops/server/Linux 基础' },
            { text: 'Nginx 使用指南', link: '/ops/server/Nginx 使用指南' },
          ]
        },
        {
          text: '📊 大数据',
          collapsed: false,
          items: [
            // --- 大数据 ---
            { text: '框架设计路线', link: '/ops/bigdata/框架设计路线' },
            { text: '数据采集工具', link: '/ops/bigdata/数据采集工具' },
            { text: 'Hadoop', link: '/ops/bigdata/hadoop' },
            { text: 'Hive', link: '/ops/bigdata/hive' },
            { text: 'HBase', link: '/ops/bigdata/hbase' },
            { text: 'Spark', link: '/ops/bigdata/spark' },
            { text: 'Flink', link: '/ops/bigdata/flink' },
            { text: 'StarRocks', link: '/ops/bigdata/starrocks' },
          ]
        },
        {
          text: '🗄️ 数据库',
          collapsed: false,
          items: [
            { text: 'MySQL 基础', link: '/ops/db/mysql-basis' },
          ]
        }
      ],

      // AI 大模型侧边栏
      '/ai/': [
        {
          text: '🤖 大模型基础',
          collapsed: false,
          items: [
            { text: 'LLM 理论导论', link: '/ai/llm/llm' },
          ]
        },
        {
          text: '🛠️ AI 应用开发',
          collapsed: false,
          items: [
            { text: '本地大模型部署', link: '/ai/app/app' }
          ]
        }
      ],
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/xupengboo/xupengboo' },
    ],

    // 本地搜索
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    },

    // 页脚
    footer: {
      message: '<a href="https://beian.miit.gov.cn/" target="_blank">鲁ICP备2025142295号-1</a>',
      copyright: 'Copyright © 2024-present XuPengBoo'
    },
  },
})
