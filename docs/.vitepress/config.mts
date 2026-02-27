import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "XuPengBoo",
  description: "XuPengBoo的个人技术知识库，记录开发成长、学习笔记、踩坑实践",
  lang: 'zh-CN',
  base: '/',
  // 设置favicon
  // head: [['link', { rel: 'icon', href: '/favicon.ico' }]],

  // 主题相关配置
  themeConfig: {
    // TODO 左上角图标
    // logo: '/logo.png',
    siteTitle: 'XuPengBoo',

    // 导航栏配置
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      // 核心领域导航，和你的行业划分一一对应
      { text: '软件开发', link: '/dev/' },
      { text: '运维服务', link: '/ops/' },
      { text: 'AI大模型', link: '/ai/' },
      // 非核心内容收拢，不占用主导航空间
      {
        text: '更多',
        items: [
          // { text: '大数据', link: '/bigdata/' },
          { text: '项目案例', link: '/projects/' },
          { text: '工具合集', link: '/tools/' },
          { text: '关于我', link: '/about/' },
        ]
      }
    ],

    // 侧边栏
    sidebar: {
      // 软件开发板块的侧边栏，匹配 /dev/ 路径
      '/dev/': [
        // 1. 开发总览：无子项，直接跳转
        {
          text: '开发总览',
          link: '/dev/', // 对应 dev/index.md
        },
        // 2. 编程语言：有子项，支持折叠展开
        {
          text: '💻 编程语言',
          collapsed: false, // 核心高频内容，默认展开（false=展开，true=折叠）
          activeMatch: '^/dev/language/', // 只要在该分类下，就保持高亮
          // 子项：二级分类
          items: [
            {
              text: 'Python 全栈',
              collapsed: false, // 默认展开，匹配你当前核心内容
              // 三级子项：具体文章
              items: [
                { text: 'Python 总览', link: '/dev/language/python/' },
                { text: '基础语法', link: '/dev/language/python/base-syntax' },
                { text: '数据结构', link: '/dev/language/python/data-structure' },
                { text: '条件循环', link: '/dev/language/python/condition-loop' },
                { text: '函数与lambda', link: '/dev/language/python/function-lambda' },
                // 新增Python文章，直接在这里加就行
              ]
            },
            {
              text: 'Java 开发',
              collapsed: true, // 内容少，默认折叠
              items: [
                { text: 'Java 基础', link: '/dev/language/java/base' },
                // 其他Java文章
              ]
            },
            {
              text: '前端开发',
              collapsed: true,
              items: []
            }
          ]
        },
        // 3. 架构与设计
        {
          text: '🏗️ 架构与设计',
          collapsed: true, // 非高频，默认折叠
          items: [
            { text: '架构设计原则', link: '/dev/architecture/design-principle' },
            { text: '设计模式', link: '/dev/architecture/design-pattern' },
          ]
        },
        // 4. 算法与数据结构
        {
          text: '📊 算法与数据结构',
          collapsed: true,
          items: []
        },
        // 5. 数据库与中间件
        {
          text: '🗄️ 数据库与中间件',
          collapsed: true,
          items: []
        },
        // 6. 开发实战
        {
          text: '⚔️ 开发实战',
          collapsed: true,
          items: []
        }
      ],

      // 其他板块（运维/大数据/AI）的侧边栏，同理配置
    },

    // 配套开启面包屑，显示当前文章路径，和侧边栏联动
    breadcrumbs: true,
    // 右侧大纲，和侧边栏标题层级匹配
    outline: [2, 3],
    outlineTitle: '本页目录',

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
