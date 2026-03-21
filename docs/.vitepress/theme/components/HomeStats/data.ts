import type {
  StatItem,
  RecentItem,
  TechTag,
  BookItem,
  TimelineItem,
  LearningData,
  ProjectItem,
  MottoData
} from './types'

/* ① 统计 */
export const stats: StatItem[] = [
  { value: '52+', label: '篇技术笔记' },
  { value: '4', label: '个知识领域' },
  { value: '2022', label: '年开始记录' },
  { value: '持续', label: '迭代更新中' },
]

/* ② 最近更新 */
export const recent: RecentItem[] = [
  { tag: 'AI', tagClass: 'tag-ai', title: '本地大模型部署实践', date: '2026-03-12', link: '/ai/app/app' },
  { tag: 'Ops', tagClass: 'tag-ops', title: 'HTTPS 证书申请', date: '2026-03-12', link: '/ops/server/HTTPS 证书申请' },
  { tag: 'Ops', tagClass: 'tag-dev', title: 'Rancher 安装与使用', date: '2026-03-11', link: '/ops/k8s/Rancher 安装与使用' },
  { tag: 'Ops', tagClass: 'tag-ai', title: 'CentOS 运维手册', date: '2026-03-11', link: '/ops/server/CentOS 运维手册' },
  { tag: 'Dev', tagClass: 'tag-dev', title: 'Docker 核心命令', date: '2025-03-01', link: '/ops/docker/Docker 核心命令' },
  { tag: 'Dev', tagClass: 'tag-dev', title: 'Git 核心实战', date: '2026-02-28', link: '/dev/tools/Git 核心实战' },
]

/* ③ 技术栈 */
export const tags: TechTag[] = [
  { name: 'Java', level: 'level-high' },
  { name: 'Spring Cloud', level: 'level-high' },
  { name: 'Python', level: 'level-high' },
  { name: 'Docker', level: 'level-mid' },
  { name: 'MySQL', level: 'level-high' },
  { name: 'Git', level: 'level-high' },
  { name: 'Linux', level: 'level-mid' },
  { name: 'Kubernetes', level: 'level-mid' },
  { name: 'Redis', level: 'level-mid' },
  { name: 'LLM', level: 'level-new' },
  { name: 'Prompt Engineering', level: 'level-new' },
  { name: 'Vue 3', level: 'level-mid' },
  { name: 'Ollama', level: 'level-new' },
  { name: 'DeepSeek', level: 'level-new' },
]

/* ④ 读书推荐 */
export const books: BookItem[] = [
  {
    title: '凤凰项目',
    author: 'Gene Kim · The Phoenix Project',
    category: 'DevOps',
    color: '#c0626a',
    score: '9.2',
    badge: '强烈推荐',
    badgeClass: 'badge-must',
    quote: '运维不是救火队，是防火队。',
    review: '用小说的方式讲 DevOps，读起来根本停不下来。主角接手一个烂摊子项目，在不断救火的过程中领悟了精益生产、持续交付的精髓。技术人看了会频频点头，很多坑我也踩过。读完之后对"发布流程"、"技术债务"这些词有了全新的理解。',
    tags: ['DevOps', '持续交付', '三步工作法', '精益生产'],
  },
  {
    title: '硅谷之火',
    author: 'Michael Swaine · Fire in the Valley',
    category: '科技史',
    color: '#0891b2',
    score: '9.0',
    badge: '眼界拓展',
    badgeClass: 'badge-mind',
    quote: '个人电脑的诞生，是一群偏执狂对世界说"不"的结果。',
    review: '从 Altair 到 Apple，从车库到改变世界——这本书记录了个人电脑革命最真实的来龙去脉。那些名字如今已是传奇，但当年不过是一群穷折腾的年轻人。读完会觉得，热爱一件事并且死磕到底，是有可能真的改变什么的。',
    tags: ['科技史', 'PC革命', '创业精神', '乔布斯'],
  },
]

/* ⑤ 成长时间线 */
export const timeline: TimelineItem[] = [
  {
    year: '2021',
    title: '踏入编程世界',
    tag: '起点',
    color: '#6b7280',
    desc: '开始系统学习 Java、Vue等等，接触面向对象编程思想，写下第一行 Hello World。',
    milestones: ['Java 基础语法', '数据结构入门', '第一个物流项目', '刷B站视频'],
  },
  {
    year: '2022',
    title: '全栈能力构建',
    tag: '成长',
    color: '#2d6a4f',
    desc: '深入 Spring Boot 生态，同步学习 Nginx、MySQL、Redis等，开始接触 Linux 服务器运维。',
    milestones: ['Spring Boot', 'MySQL 调优', 'Linux 基础', 'Git 协作'],
  },
  {
    year: '2023',
    title: '架构视野初开',
    tag: '专业',
    color: '#35607e',
    desc: '从单体走向微服务，开始理解"拆分"背后的设计哲学。学会了服务治理、链路追踪、接口限流，第一次感受到架构决策对系统的长远影响。',
    milestones: ['Spring Cloud', '服务治理', '链路追踪', '性能调优'],
  },
  {
    year: '2024',
    title: '容器化与工程化',
    tag: '深化',
    color: '#0891b2',
    desc: '系统学习 Docker 容器化部署，探索 Kubernetes 集群，工程意识显著提升。',
    milestones: ['Docker 实战', 'K8s 入门', 'CI/CD 流水线', 'Python 自动化'],
  },
  {
    year: '2025',
    title: '大数据 · 知识库建立',
    tag: '沉淀',
    color: '#7c3aed',
    desc: '踏入大数据领域，学习数据处理与分析的核心体系。同步搭建本站，把多年零散的笔记系统化整理成可查阅的知识库，第一次认真地给自己的成长留档。',
    milestones: ['Hadoop / Spark', 'Hive 数仓', 'VitePress 建站', '笔记体系化'],
  },
  {
    year: '2026',
    title: '初识 AI，踏入新世界',
    tag: '进行中',
    color: '#d97706',
    current: true,
    desc: '开始系统学习 AI 与大模型方向，从理论到本地部署，从 Prompt 工程到 AI 应用开发。感觉像是又回到了 2021 年刚入门时的状态——什么都新鲜，什么都想弄懂。',
    milestones: ['LLM 理论入门', 'Ollama 本地部署', 'Prompt 工程', 'AI 应用探索'],
  },
]

/* ⑥ 当前状态 */
export const learning: LearningData = {
  // 正在学习（pct 为进度百分比 0~100）
  doing: [
    { name: '供应链系统业务深耕', pct: 45, color: '#2d6a4f', note: '持续钻研 ERP（SAP）、SRM、CRM 等供应链核心系统，理解业务比写代码更难' },
    { name: '2026 读书计划', pct: 25, color: '#0891b2', note: '目标：年内读完 10 本计算机相关书籍，目前已读 2-3 本' },
    { name: 'AI 大模型搭建与微调', pct: 100, color: '#1d4ed8', note: '从理论到落地，完成 LLM 本地部署，正在探索微调方向' },
  ],
  // 近期计划（done: true 自动显示划线+勾选）
  plan: [
    { name: 'AI Agent 学习实践', time: '2026 Q2', done: false },
    { name: 'AI 部署微调', time: '2026 Q3', done: false },
    { name: 'RAG 应用实战', time: '2026 Q4', done: false },
    { name: 'LLM 大模型搭建', time: '已完成', done: true },
    { name: 'VitePress 知识库搭建', time: '已完成', done: true },
  ],
  // 近期感悟
  thoughts: [
    { text: '专注当下这一件事，比同时做十件事更有力量。', from: '工作感悟' },
    { text: '把大目标拆碎，一小块一小块地啃——每完成一块，就离终点近一步。', from: '学习方法' },
  ],
}

/* ⑦ 项目展示 */
export const projects: ProjectItem[] = [
  {
    icon: '📚',
    name: 'XuPengBoo 知识库',
    desc: '基于 VitePress 搭建的个人技术知识库，记录全栈开发、运维实践、AI 探索的学习笔记，持续更新中。',
    stack: ['VitePress', 'Vue 3', 'Markdown'],
    status: '维护中',
    statusClass: 'status-active',
    github: 'https://github.com/xupengboo/xupengboo',
    highlight: '本站',
  },
  {
    icon: '🤖',
    name: 'LLM 本地部署实践',
    desc: '基于 Ollama 搭建本地大模型运行环境，探索 DeepSeek、Llama 等模型的私有化部署与接口调用方案。',
    stack: ['Ollama', 'Python', 'Docker', 'DeepSeek'],
    status: '实验中',
    statusClass: 'status-lab',
    github: null,
    highlight: '持续探索',
  },
  {
    icon: '🛠️',
    name: '运维自动化脚本集',
    desc: '日常运维工作中积累的 Shell / Python 自动化脚本，涵盖服务器监控、日志清理、定时备份等场景。',
    stack: ['Python', 'Shell', 'Linux', 'Crontab'],
    status: '持续积累',
    statusClass: 'status-growing',
    github: null,
    highlight: null,
  },
]

/* ⑧ 座右铭 */
export const motto: MottoData = {
  text: '让事情流动起来，让问题暴露出来，让经验沉淀下来。',
  from: '工作哲学 · 取意于《凤凰项目》中的三步工作法',
  note: '专注一件事，把它做通；遇到困难不绕路，拆开来一块一块解决；做完之后复盘，把经验变成下一次的底气。流动、反馈、沉淀——这三件事想清楚了，做什么都不会太慌。',
}
