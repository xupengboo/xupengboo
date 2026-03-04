<template>
  <div class="home-stats-wrapper">
    <!-- 统计数字 -->
    <div class="stats-bar">
      <div class="stat-item" v-for="item in stats" :key="item.label">
        <span class="stat-number">{{ item.value }}</span>
        <span class="stat-label">{{ item.label }}</span>
      </div>
    </div>

    <!-- 最近更新 -->
    <div class="recent-section">
      <h3 class="section-title">
        <span class="title-dot"></span>
        最近更新
      </h3>
      <div class="recent-grid">
        <a v-for="item in recent" :key="item.link" :href="item.link" class="recent-card">
          <span class="card-tag" :class="item.tagClass">{{ item.tag }}</span>
          <span class="card-title">{{ item.title }}</span>
          <span class="card-date">{{ item.date }}</span>
        </a>
      </div>
    </div>

    <!-- 技术标签云 -->
    <div class="tags-section">
      <h3 class="section-title">
        <span class="title-dot"></span>
        技术栈
      </h3>
      <div class="tags-cloud">
        <span v-for="tag in tags" :key="tag.name" class="tech-tag" :class="tag.level">
          {{ tag.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
const stats = [
  { value: '10+', label: '篇技术笔记' },
  { value: '3', label: '个知识领域' },
  { value: '2025', label: '年开始记录' },
  { value: '持续', label: '迭代更新中' },
]

const recent = [
  { tag: 'AI', tagClass: 'tag-ai', title: '本地大模型部署实践', date: '2026-02-28', link: '/ai/app/app' },
  { tag: 'Dev', tagClass: 'tag-dev', title: 'Java 设计模式精讲', date: '2026-02-10', link: '/dev/java/design' },
  { tag: 'Ops', tagClass: 'tag-ops', title: 'MySQL 基础到实战', date: '2026-01-22', link: '/ops/db/mysql-basis' },
  { tag: 'Dev', tagClass: 'tag-dev', title: 'Git 核心工作流', date: '2026-01-15', link: '/dev/tools/git' },
  { tag: 'AI', tagClass: 'tag-ai', title: 'LLM 大模型理论导论', date: '2026-01-08', link: '/ai/llm/llm' },
  { tag: 'Dev', tagClass: 'tag-dev', title: 'Python 基础语法精华', date: '2025-12-20', link: '/dev/python/basic' },
]

const tags = [
  { name: 'Java', level: 'level-high' },
  { name: 'Spring Boot', level: 'level-high' },
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
</script>

<style scoped>
.home-stats-wrapper {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px 80px;
}

/* ===== 统计条 ===== */
.stats-bar {
  display: flex;
  justify-content: center;
  gap: 0;
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

/* ===== 通用 section 标题 ===== */
.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  margin-bottom: 20px;
  font-family: 'Noto Serif SC', serif;
}

.title-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  flex-shrink: 0;
}

/* ===== 最近更新 ===== */
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
  cursor: pointer;
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

/* ===== 技术标签云 ===== */
.tags-section {
  margin-bottom: 0;
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

.level-mid {
  border-color: var(--vp-c-border);
}

.level-new {
  border-color: rgba(245, 158, 11, 0.3);
  color: #92400e;
  background: rgba(245, 158, 11, 0.05);
}

.dark .level-new {
  color: #fcd34d;
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .stats-bar {
    flex-wrap: wrap;
  }
  .stat-item {
    flex: 1 1 45%;
    border-right: 1px solid var(--vp-c-border);
    border-bottom: 1px solid var(--vp-c-border);
  }
  .recent-grid {
    grid-template-columns: 1fr;
  }
  .card-date {
    display: none;
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
