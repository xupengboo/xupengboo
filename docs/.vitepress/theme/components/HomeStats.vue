<template>
  <div class="home-stats-wrapper">

    <!-- ① 统计数字 -->
    <div class="stats-bar">
      <div class="stat-item" v-for="item in stats" :key="item.label">
        <span class="stat-number">{{ item.value }}</span>
        <span class="stat-label">{{ item.label }}</span>
      </div>
    </div>

    <!-- ② 最近更新 -->
    <div class="recent-section">
      <h3 class="section-title">
        <span class="title-dot"></span>最近更新
      </h3>
      <div class="recent-grid">
        <a v-for="item in recent" :key="item.link" :href="item.link" class="recent-card">
          <span class="card-tag" :class="item.tagClass">{{ item.tag }}</span>
          <span class="card-title">{{ item.title }}</span>
          <span class="card-date">{{ item.date }}</span>
        </a>
      </div>
    </div>

    <!-- ③ 技术栈 -->
    <div class="tags-section">
      <h3 class="section-title">
        <span class="title-dot"></span>技术栈
      </h3>
      <div class="tags-cloud">
        <span v-for="tag in tags" :key="tag.name" class="tech-tag" :class="tag.level">
          {{ tag.name }}
        </span>
      </div>
    </div>

    <!-- ④ 读书推荐 -->
    <div class="books-section">
      <h3 class="section-title">
        <span class="title-dot"></span>读书推荐
        <span class="section-sub">— 值得反复翻阅的计算机好书</span>
      </h3>
      <div class="books-shelf">
        <div
            v-for="book in books"
            :key="book.title"
            class="book-card"
            :class="{ 'is-expanded': expandedBook === book.title }"
            @click="toggleBook(book.title)"
        >
          <div class="book-spine" :style="{ background: book.color }">
            <span class="book-score">{{ book.score }}</span>
          </div>
          <div class="book-body">
            <div class="book-header">
              <div class="book-meta">
                <span class="book-category" :style="{ color: book.color }">{{ book.category }}</span>
                <h4 class="book-title-text">{{ book.title }}</h4>
                <p class="book-author">{{ book.author }}</p>
              </div>
              <div class="book-badge" :class="book.badgeClass">{{ book.badge }}</div>
            </div>
            <p class="book-quote">" {{ book.quote }} "</p>
            <div class="book-detail" v-show="expandedBook === book.title">
              <p class="book-review">{{ book.review }}</p>
              <div class="book-tags">
                <span v-for="t in book.tags" :key="t" class="book-tag">{{ t }}</span>
              </div>
            </div>
            <div class="book-toggle">
              <span>{{ expandedBook === book.title ? '收起' : '查看评语' }}</span>
              <svg :class="{ rotated: expandedBook === book.title }" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ⑤ 成长时间线 -->
    <div class="timeline-section">
      <h3 class="section-title">
        <span class="title-dot"></span>成长轨迹
        <span class="section-sub">— 技术成长的每一步都算数</span>
      </h3>
      <div class="timeline">
        <div
            v-for="(item, index) in timeline"
            :key="index"
            class="timeline-item"
            :class="{ 'is-current': item.current }"
        >
          <div class="tl-left">
            <span class="tl-year">{{ item.year }}</span>
          </div>
          <div class="tl-line-wrap">
            <div class="tl-dot" :style="item.current ? { background: 'var(--vp-c-brand-1)', boxShadow: '0 0 0 4px var(--vp-c-brand-soft)' } : {}"></div>
            <div class="tl-line" v-if="index < timeline.length - 1"></div>
          </div>
          <div class="tl-right">
            <div class="tl-card" :class="{ 'tl-card-current': item.current }">
              <div class="tl-card-header">
                <span class="tl-title">{{ item.title }}</span>
                <span class="tl-tag" :style="{ background: item.color + '18', color: item.color }">{{ item.tag }}</span>
              </div>
              <p class="tl-desc">{{ item.desc }}</p>
              <div class="tl-milestones">
                <span v-for="m in item.milestones" :key="m" class="tl-milestone">{{ m }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ⑥ 当前在学 / 近期计划 -->
    <div class="learning-section">
      <h3 class="section-title">
        <span class="title-dot"></span>当前状态
        <span class="section-sub">— 持续更新中</span>
        <span class="live-dot">
          <span class="live-ring"></span>
          <span class="live-core"></span>
        </span>
      </h3>
      <div class="learning-grid">
        <div class="learning-col">
          <div class="learning-col-title">
            <span class="col-icon">🔥</span> 正在深入
          </div>
          <div class="learning-items">
            <div v-for="item in learning.doing" :key="item.name" class="learning-item">
              <div class="li-header">
                <span class="li-name">{{ item.name }}</span>
                <span class="li-pct">{{ item.pct }}%</span>
              </div>
              <div class="li-bar">
                <div class="li-fill" :style="{ width: item.pct + '%', background: item.color }"></div>
              </div>
              <p class="li-note">{{ item.note }}</p>
            </div>
          </div>
        </div>
        <div class="learning-col">
          <div class="learning-col-title">
            <span class="col-icon">📋</span> 近期计划
          </div>
          <div class="plan-items">
            <div v-for="item in learning.plan" :key="item.name" class="plan-item">
              <div class="plan-check" :class="{ done: item.done }">
                <svg v-if="item.done" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div class="plan-body">
                <span class="plan-name" :class="{ 'plan-done-text': item.done }">{{ item.name }}</span>
                <span class="plan-time">{{ item.time }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="learning-col">
          <div class="learning-col-title">
            <span class="col-icon">💡</span> 近期感悟
          </div>
          <div class="thoughts">
            <div v-for="t in learning.thoughts" :key="t.text" class="thought-item">
              <span class="thought-quote">"</span>
              <p class="thought-text">{{ t.text }}</p>
              <span class="thought-from">— {{ t.from }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ⑦ 项目展示 -->
    <div class="projects-section">
      <h3 class="section-title">
        <span class="title-dot"></span>项目展示
        <span class="section-sub">— 写过的代码，踩过的坑</span>
      </h3>
      <div class="projects-grid">
        <div v-for="proj in projects" :key="proj.name" class="proj-card">
          <div class="proj-top">
            <div class="proj-icon">{{ proj.icon }}</div>
            <div class="proj-status" :class="proj.statusClass">{{ proj.status }}</div>
          </div>
          <h4 class="proj-name">{{ proj.name }}</h4>
          <p class="proj-desc">{{ proj.desc }}</p>
          <div class="proj-stacks">
            <span v-for="s in proj.stack" :key="s" class="proj-stack">{{ s }}</span>
          </div>
          <div class="proj-footer">
            <a v-if="proj.github" :href="proj.github" target="_blank" class="proj-link" @click.stop>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              GitHub
            </a>
            <span v-if="proj.highlight" class="proj-highlight">{{ proj.highlight }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ⑧ 座右铭 -->
    <div class="motto-section">
      <div class="motto-card">
        <div class="motto-deco">"</div>
        <p class="motto-text">{{ motto.text }}</p>
        <div class="motto-divider"></div>
        <span class="motto-from">{{ motto.from }}</span>
        <p class="motto-note">{{ motto.note }}</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import {ref} from 'vue'

const expandedBook = ref(null)

function toggleBook(title) {
  expandedBook.value = expandedBook.value === title ? null : title
}

/* ① 统计 */
const stats = [
  {value: '38+', label: '篇技术笔记'},
  {value: '4', label: '个知识领域'},
  {value: '2022', label: '年开始记录'},
  {value: '持续', label: '迭代更新中'},
]

/* ② 最近更新 */
const recent = [
  {tag: 'AI', tagClass: 'tag-ai', title: '本地大模型部署实践', date: '2026-02-28', link: '/ai/app/app'},
  {tag: 'Dev', tagClass: 'tag-dev', title: 'CAP 分布式定理', date: '2026-02-10', link: '/dev/frame/CAP 分布式定理'},
  {tag: 'Ops', tagClass: 'tag-ops', title: 'MySQL 基础到实战', date: '2026-01-22', link: '/ops/db/mysql-basis'},
  {tag: 'Dev', tagClass: 'tag-dev', title: 'Git 核心实战', date: '2026-01-15', link: '/dev/tools/Git 核心实战'},
  {tag: 'AI', tagClass: 'tag-ai', title: 'LLM 大模型理论导论', date: '2026-01-08', link: '/ai/llm/llm'},
  {tag: 'Dev', tagClass: 'tag-dev', title: 'Python 实用工具库', date: '2025-12-20', link: '/dev/python/Python 实用工具库'},
]

/* ③ 技术栈 */
const tags = [
  {name: 'Java', level: 'level-high'},
  {name: 'Spring Boot', level: 'level-high'},
  {name: 'Python', level: 'level-high'},
  {name: 'Docker', level: 'level-mid'},
  {name: 'MySQL', level: 'level-high'},
  {name: 'Git', level: 'level-high'},
  {name: 'Linux', level: 'level-mid'},
  {name: 'Kubernetes', level: 'level-mid'},
  {name: 'Redis', level: 'level-mid'},
  {name: 'LLM', level: 'level-new'},
  {name: 'Prompt Engineering', level: 'level-new'},
  {name: 'Vue 3', level: 'level-mid'},
  {name: 'Ollama', level: 'level-new'},
  {name: 'DeepSeek', level: 'level-new'},
]

/* ④ 读书推荐 */
const books = [
  {
    title: '代码整洁之道', author: 'Robert C. Martin · Clean Code',
    category: '工程实践', color: '#2d6a4f', score: '9.4',
    badge: '强烈推荐', badgeClass: 'badge-must',
    quote: '写代码是写给人看的，顺便让机器能跑。',
    review: '这本书彻底改变了我看代码的方式。Martin 用大量真实的反例告诉你，"能跑"和"好代码"之间差了多远。读完之后写代码会不自觉地多问自己一句：这个函数的名字，三个月后的我还能看懂吗？',
    tags: ['重构', '命名规范', '函数设计', '注释哲学'],
  },
  {
    title: '深入理解Java虚拟机', author: '周志明 · JVM第三版',
    category: 'Java 进阶', color: '#1d4ed8', score: '9.6',
    badge: '经典必读', badgeClass: 'badge-classic',
    quote: '真正理解 Java，要从 JVM 开始往上看。',
    review: '国内 Java 技术书的天花板之一。GC 算法、类加载机制、即时编译器，被周志明写得清晰而有层次。面试可以背，但真正读进去之后会发现，很多"玄学"问题背后都有合理的解释。',
    tags: ['JVM', 'GC调优', '类加载', '内存模型'],
  },
  {
    title: '人月神话', author: 'Frederick P. Brooks Jr.',
    category: '软件工程', color: '#7c3aed', score: '9.1',
    badge: '思维拓展', badgeClass: 'badge-mind',
    quote: '往一个已经延误的项目里加人，只会让它更延误。',
    review: '1975 年写的书，放到今天依然字字戳心。软件的本质复杂性、概念完整性、人月不可互换，在 50 年后的敏捷时代仍然适用。这不是教你"怎么做"的书，而是让你理解"为什么这么难"。',
    tags: ['项目管理', '团队协作', '软件复杂性', '经典思想'],
  },
  {
    title: 'Python编程：从入门到实践', author: 'Eric Matthes · Python Crash Course',
    category: 'Python', color: '#d97706', score: '8.9',
    badge: '入门首选', badgeClass: 'badge-starter',
    quote: '最好的入门书，是让你一直想打开下一章的那种。',
    review: '节奏把握得非常好，前半部分夯实语法基础，后半部分用三个完整项目巩固。读完之后写一些小脚本自动化日常工作，成就感会让你上瘾。',
    tags: ['Python基础', '项目驱动', '快速上手'],
  },
]

/* ⑤ 成长时间线 */
const timeline = [
  {
    year: '2022',
    title: '踏入编程世界',
    tag: '起点',
    color: '#6b7280',
    desc: '开始系统学习 Java，接触面向对象编程思想，写下第一行 Hello World。',
    milestones: ['Java 基础语法', '数据结构入门', '第一个课程项目'],
  },
  {
    year: '2023',
    title: '全栈能力构建',
    tag: '成长',
    color: '#2d6a4f',
    desc: '深入 Spring Boot 生态，同步学习 MySQL、Redis，开始接触 Linux 服务器运维。',
    milestones: ['Spring Boot', 'MySQL 调优', 'Linux 基础', 'Git 协作'],
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
    title: '知识库建立 · AI 探索',
    tag: '沉淀',
    color: '#7c3aed',
    desc: '创建本站，将零散笔记系统化整理。同步开始深入研究大模型应用与 Prompt 工程。',
    milestones: ['VitePress 建站', 'LLM 理论学习', 'Ollama 本地部署', 'DeepSeek 实践'],
  },
  {
    year: '2026',
    title: '深耕 AI 应用开发',
    tag: '进行中',
    color: '#d97706',
    current: true,
    desc: '专注 LangChain、向量数据库等 AI 工程化方向，持续输出高质量技术笔记。',
    milestones: ['LangChain 实战', '向量数据库', 'RAG 应用', '持续写作'],
  },
]

/* ⑥ 当前状态 */
const learning = {
  doing: [
    {name: 'LangChain 框架', pct: 45, color: '#2d6a4f', note: '正在研究 Chain 和 Agent 的设计模式'},
    {name: '向量数据库 Milvus', pct: 25, color: '#0891b2', note: '学习 embedding 原理与相似度检索'},
    {name: 'Spring Cloud', pct: 70, color: '#1d4ed8', note: '微服务治理、服务网格持续完善'},
  ],
  plan: [
    {name: 'RAG 应用实战', time: '2026 Q2', done: false},
    {name: 'Kubernetes 进阶', time: '2026 Q2', done: false},
    {name: 'LangChain 笔记整理', time: '2026 Q1', done: false},
    {name: 'DeepSeek 部署笔记', time: '已完成', done: true},
    {name: 'VitePress 知识库搭建', time: '已完成', done: true},
  ],
  thoughts: [
    {text: '理解一个东西最好的方式，是试着把它讲给别人听。这也是我写笔记的理由。', from: '写作感悟'},
    {text: '不要追着新技术跑，先把一个东西真正用熟，再说下一个。', from: '学习方法'},
  ],
}

/* ⑦ 项目展示 */
const projects = [
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
const motto = {
  text: '先把一件事做对，再把它做快。慢下来思考的时间，从来不是浪费。',
  from: '我的编程哲学',
  note: '这句话提醒我在遇到问题时不要急着 Google 第一个答案，而是先想清楚问题本身是什么。',
}
</script>

<style scoped>
.home-stats-wrapper {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px 80px;
}

/* ===== 通用 section 标题 ===== */
.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  margin-bottom: 20px;
  font-family: 'Noto Serif SC', 'STSong', serif;
}

.title-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  flex-shrink: 0;
  display: inline-block;
}

.section-sub {
  font-size: 13px;
  font-weight: 400;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-base);
  letter-spacing: 0;
}

/* ===== ① 统计条 ===== */
.stats-bar {
  display: flex;
  margin: 48px 0 64px;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 16px;
  border-right: 1px solid var(--vp-c-border);
  transition: background 0.2s;
}

.stat-item:last-child {
  border-right: none;
}

.stat-item:hover {
  background: var(--vp-c-brand-soft);
}

.stat-number {
  font-size: 2rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  font-family: 'Noto Serif SC', serif;
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: var(--vp-c-text-3);
  margin-top: 6px;
  letter-spacing: 0.05em;
}

/* ===== ② 最近更新 ===== */
.recent-section {
  margin-bottom: 56px;
}

.recent-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.recent-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  text-decoration: none !important;
  border-bottom: none !important;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
}

.recent-card:hover {
  border-color: var(--vp-c-brand-3) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(45, 106, 79, 0.08);
}

.card-tag {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 0.04em;
  flex-shrink: 0;
}

.tag-ai {
  background: rgba(82, 183, 136, 0.15);
  color: #2d6a4f;
}

.tag-dev {
  background: rgba(59, 130, 246, 0.12);
  color: #1d4ed8;
}

.tag-ops {
  background: rgba(245, 158, 11, 0.12);
  color: #b45309;
}

.dark .tag-dev {
  color: #93c5fd;
}

.dark .tag-ops {
  color: #fcd34d;
}

.dark .tag-ai {
  color: #6ee7b7;
}

.card-title {
  font-size: 14px;
  color: var(--vp-c-text-1);
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-date {
  font-size: 12px;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
}

/* ===== ③ 技术栈 ===== */
.tags-section {
  margin-bottom: 56px;
}

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tech-tag {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  transition: all 0.2s;
  cursor: default;
  letter-spacing: 0.02em;
}

.tech-tag:hover {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-3);
  color: var(--vp-c-brand-1);
}

.level-high {
  border-color: rgba(45, 106, 79, 0.3);
  color: var(--vp-c-brand-1);
  background: rgba(45, 106, 79, 0.05);
}

.level-new {
  border-color: rgba(245, 158, 11, 0.3);
  color: #92400e;
  background: rgba(245, 158, 11, 0.05);
}

.dark .level-new {
  color: #fcd34d;
}

/* ===== ④ 读书推荐 ===== */
.books-section {
  margin-bottom: 56px;
}

.books-shelf {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.book-card {
  display: flex;
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
  overflow: hidden;
  background: var(--vp-c-bg);
  cursor: pointer;
  transition: box-shadow 0.25s, transform 0.25s, border-color 0.25s;
}

.book-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.07);
}

.book-card.is-expanded {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.book-spine {
  width: 6px;
  flex-shrink: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 8px;
}

.book-score {
  font-size: 9px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.85);
  writing-mode: vertical-rl;
}

.book-body {
  flex: 1;
  padding: 16px 18px 14px;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.book-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.book-meta {
  flex: 1;
  min-width: 0;
}

.book-category {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.9;
}

.book-title-text {
  font-size: 15px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  margin: 4px 0 3px;
  line-height: 1.4;
  font-family: 'Noto Serif SC', serif;
}

.book-author {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 4px;
  flex-shrink: 0;
  white-space: nowrap;
}

.badge-must {
  background: rgba(45, 106, 79, 0.12);
  color: #2d6a4f;
}

.badge-classic {
  background: rgba(29, 78, 216, 0.1);
  color: #1d4ed8;
}

.badge-mind {
  background: rgba(124, 58, 237, 0.1);
  color: #7c3aed;
}

.badge-starter {
  background: rgba(217, 119, 6, 0.1);
  color: #b45309;
}

.dark .badge-must {
  background: rgba(82, 183, 136, 0.15);
  color: #6ee7b7;
}

.dark .badge-classic {
  background: rgba(147, 197, 253, 0.15);
  color: #93c5fd;
}

.dark .badge-mind {
  background: rgba(196, 181, 253, 0.15);
  color: #c4b5fd;
}

.dark .badge-starter {
  background: rgba(252, 211, 77, 0.12);
  color: #fcd34d;
}

.book-quote {
  font-size: 13px;
  color: var(--vp-c-text-2);
  font-style: italic;
  line-height: 1.6;
  margin: 0 0 10px;
  padding-left: 10px;
  border-left: 2px solid var(--vp-c-border);
}

.book-detail {
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 12px;
  margin-bottom: 8px;
}

.book-review {
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.8;
  margin: 0 0 10px;
}

.book-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.book-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 3px;
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-3);
  border: 1px solid var(--vp-c-border);
}

.book-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--vp-c-brand-1);
  margin-top: auto;
  padding-top: 4px;
  user-select: none;
}

.book-toggle svg {
  transition: transform 0.25s;
}

.book-toggle svg.rotated {
  transform: rotate(180deg);
}

/* ===== ⑤ 成长时间线 ===== */
.timeline-section {
  margin-bottom: 56px;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.timeline-item {
  display: grid;
  grid-template-columns: 56px 28px 1fr;
  gap: 0 12px;
  align-items: stretch;
}

.tl-left {
  display: flex;
  align-items: flex-start;
  padding-top: 14px;
  justify-content: flex-end;
}

.tl-year {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-3);
  letter-spacing: 0.03em;
  font-variant-numeric: tabular-nums;
}

.timeline-item.is-current .tl-year {
  color: var(--vp-c-brand-1);
}

.tl-line-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tl-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--vp-c-border);
  border: 2px solid var(--vp-c-bg);
  outline: 2px solid var(--vp-c-border);
  margin-top: 16px;
  flex-shrink: 0;
  transition: all 0.3s;
}

.tl-line {
  flex: 1;
  width: 2px;
  background: var(--vp-c-divider);
  margin: 4px 0;
  min-height: 20px;
}

.tl-right {
  padding: 8px 0 24px;
}

.tl-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
  padding: 14px 18px;
  transition: border-color 0.2s;
}

.tl-card-current {
  border-color: rgba(45, 106, 79, 0.3);
  background: rgba(45, 106, 79, 0.03);
}

.tl-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.tl-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  font-family: 'Noto Serif SC', serif;
}

.tl-tag {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 0.04em;
}

.tl-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin: 0 0 10px;
}

.tl-milestones {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tl-milestone {
  font-size: 11px;
  padding: 2px 10px;
  border-radius: 3px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-3);
}

.timeline-item.is-current .tl-milestone {
  border-color: rgba(45, 106, 79, 0.25);
  color: var(--vp-c-brand-1);
  background: rgba(45, 106, 79, 0.05);
}

/* ===== ⑥ 当前状态 ===== */
.learning-section {
  margin-bottom: 56px;
}

.live-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 16px;
  height: 16px;
  margin-left: 4px;
}

.live-ring {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(45, 106, 79, 0.2);
  animation: pulse 2s infinite;
}

.live-core {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.4);
    opacity: 0.2;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.8;
  }
}

.learning-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.learning-col {
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
  padding: 18px 20px;
  background: var(--vp-c-bg);
}

.learning-col-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.col-icon {
  font-size: 15px;
}

/* 进度条 */
.learning-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.learning-item {
}

.li-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 5px;
}

.li-name {
  font-size: 13px;
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.li-pct {
  font-size: 12px;
  color: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
}

.li-bar {
  height: 5px;
  background: var(--vp-c-bg-mute);
  border-radius: 3px;
  overflow: hidden;
}

.li-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s ease;
}

.li-note {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin: 5px 0 0;
  line-height: 1.5;
}

/* 计划清单 */
.plan-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.plan-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.plan-check {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1.5px solid var(--vp-c-border);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
  background: transparent;
  transition: all 0.2s;
}

.plan-check.done {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
}

.plan-check svg {
  stroke: white;
}

.plan-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.plan-name {
  font-size: 13px;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.plan-done-text {
  text-decoration: line-through;
  color: var(--vp-c-text-3);
}

.plan-time {
  font-size: 11px;
  color: var(--vp-c-text-3);
}

/* 感悟 */
.thoughts {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.thought-item {
  position: relative;
  padding: 12px 14px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
}

.thought-quote {
  position: absolute;
  top: 6px;
  left: 10px;
  font-size: 28px;
  color: var(--vp-c-brand-3);
  line-height: 1;
  opacity: 0.4;
  font-family: Georgia, serif;
}

.thought-text {
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.75;
  margin: 10px 0 6px;
  padding-top: 4px;
  font-style: italic;
}

.thought-from {
  font-size: 11px;
  color: var(--vp-c-text-3);
}

/* ===== ⑦ 项目展示 ===== */
.projects-section {
  margin-bottom: 56px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.proj-card {
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
  padding: 20px;
  background: var(--vp-c-bg);
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: box-shadow 0.25s, transform 0.25s, border-color 0.25s;
}

.proj-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.07);
  border-color: var(--vp-c-brand-3);
}

.proj-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.proj-icon {
  font-size: 24px;
  line-height: 1;
}

.proj-status {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 20px;
  letter-spacing: 0.03em;
}

.status-active {
  background: rgba(45, 106, 79, 0.1);
  color: #2d6a4f;
}

.status-lab {
  background: rgba(124, 58, 237, 0.1);
  color: #7c3aed;
}

.status-growing {
  background: rgba(8, 145, 178, 0.1);
  color: #0e7490;
}

.dark .status-active {
  background: rgba(82, 183, 136, 0.15);
  color: #6ee7b7;
}

.dark .status-lab {
  background: rgba(196, 181, 253, 0.15);
  color: #c4b5fd;
}

.dark .status-growing {
  background: rgba(103, 232, 249, 0.12);
  color: #67e8f9;
}

.proj-name {
  font-size: 15px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  font-family: 'Noto Serif SC', serif;
  margin: 0;
}

.proj-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin: 0;
  flex: 1;
}

.proj-stacks {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.proj-stack {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 3px;
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-3);
  border: 1px solid var(--vp-c-border);
}

.proj-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
}

.proj-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--vp-c-brand-1);
  text-decoration: none !important;
  border-bottom: none !important;
  transition: opacity 0.2s;
}

.proj-link:hover {
  opacity: 0.75;
}

.proj-highlight {
  font-size: 11px;
  color: var(--vp-c-text-3);
  font-style: italic;
}

/* ===== ⑧ 座右铭 ===== */
.motto-section {
  margin-bottom: 0;
}

.motto-card {
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 40px 48px;
  background: var(--vp-c-bg-soft);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.motto-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-3), var(--vp-c-brand-1));
}

.motto-deco {
  font-size: 72px;
  color: var(--vp-c-brand-3);
  opacity: 0.2;
  line-height: 1;
  margin-bottom: -24px;
  font-family: Georgia, serif;
  font-weight: 700;
}

.motto-text {
  font-size: 1.25rem;
  color: var(--vp-c-text-1);
  line-height: 1.8;
  font-family: 'Noto Serif SC', 'STSong', serif;
  font-weight: 500;
  font-style: italic;
  margin: 0 0 20px;
}

.motto-divider {
  width: 40px;
  height: 2px;
  background: var(--vp-c-brand-3);
  margin: 0 auto 16px;
  border-radius: 1px;
  opacity: 0.6;
}

.motto-from {
  font-size: 13px;
  color: var(--vp-c-brand-1);
  font-weight: 500;
  letter-spacing: 0.04em;
}

.motto-note {
  font-size: 13px;
  color: var(--vp-c-text-3);
  margin: 10px 0 0;
  line-height: 1.7;
  font-style: italic;
}

/* ===== 响应式 ===== */
@media (max-width: 960px) {
  .books-shelf {
    grid-template-columns: 1fr;
  }

  .learning-grid {
    grid-template-columns: 1fr;
  }

  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-bar {
    flex-wrap: wrap;
  }

  .stat-item {
    flex: 1 1 45%;
    border-bottom: 1px solid var(--vp-c-border);
  }

  .recent-grid {
    grid-template-columns: 1fr;
  }

  .card-date {
    display: none;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .timeline-item {
    grid-template-columns: 44px 24px 1fr;
  }

  .motto-card {
    padding: 28px 24px;
  }

  .motto-text {
    font-size: 1.05rem;
  }
}

@media (max-width: 540px) {
  .home-stats-wrapper {
    padding: 0 16px 60px;
  }

  .stat-number {
    font-size: 1.6rem;
  }
}
</style>
