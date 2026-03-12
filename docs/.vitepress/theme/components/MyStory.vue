<template>
  <div class="story-wrapper">
    <div class="story-timeline">
      <div
        v-for="(item, i) in story"
        :key="i"
        class="story-item"
        :class="{ last: i === story.length - 1 }"
      >
        <!-- 左侧时间轴 -->
        <div class="story-axis">
          <div class="axis-year">{{ item.year }}</div>
          <div class="axis-dot" :style="{ background: item.color }"></div>
          <div class="axis-line" v-if="i < story.length - 1"></div>
        </div>
        <!-- 右侧内容 -->
        <div class="story-content">
          <div class="story-tag" :style="{ color: item.color, background: item.soft }">{{ item.tag }}</div>
          <h4 class="story-title">{{ item.title }}</h4>
          <p class="story-desc">{{ item.desc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const story = [
  {
    year: '2022',
    tag: '起点',
    title: '第一次觉得，代码挺有意思的',
    desc: '大学里开始接触 Java，写下第一行 Hello World。当时只是觉得好玩，没想到从此就入了这个坑，而且越陷越深。',
    color: '#6b7280',
    soft: 'rgba(107, 114, 128, 0.08)',
  },
  {
    year: '2023',
    tag: '成长',
    title: '开始认真了',
    desc: '系统啃 Spring Boot，摸透 MySQL 和 Redis，第一次把自己写的东西部署到服务器上跑起来——那种感觉，现在还记得。',
    color: '#2d6a4f',
    soft: 'rgba(45, 106, 79, 0.08)',
  },
  {
    year: '2024',
    tag: '深入',
    title: '把代码跑进容器里',
    desc: '开始玩 Docker 和 K8s，理解了什么叫"工程化"。踩了很多坑，也因此学会了很多在课本上找不到的东西。',
    color: '#0891b2',
    soft: 'rgba(8, 145, 178, 0.08)',
  },
  {
    year: '2025',
    tag: '沉淀',
    title: '建了这个站，开始写字',
    desc: '把这几年零散的笔记整理成知识库，同时一头扎进 AI 大模型的世界。发现把东西写出来，比只是"会用"要难得多，也值得多。',
    color: '#7c3aed',
    soft: 'rgba(124, 58, 237, 0.08)',
  },
  {
    year: '今天',
    tag: '进行中',
    title: '还在路上，远没到终点',
    desc: '每天都在学新的东西，每天都觉得自己还差得远。但不着急，方向对了，慢慢走也会到。',
    color: '#d97706',
    soft: 'rgba(217, 119, 6, 0.08)',
  },
]
</script>

<style scoped>
.story-wrapper {
  margin: 32px 0 48px;
}

.story-timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.story-item {
  display: grid;
  grid-template-columns: 88px 1fr;
  gap: 0 20px;
  align-items: stretch;
}

/* ── 左侧时间轴 ── */
.story-axis {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 4px;
}

.axis-year {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-3);
  letter-spacing: 0.04em;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  margin-bottom: 8px;
  align-self: flex-end;
  padding-right: 4px;
}

.axis-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 2px solid var(--vp-c-bg);
  outline: 2px solid currentColor;
  outline-color: inherit;
  box-shadow: 0 0 0 2px var(--vp-c-bg);
  z-index: 1;
}

.axis-line {
  flex: 1;
  width: 1.5px;
  background: var(--vp-c-divider);
  margin: 6px 0;
  min-height: 24px;
}

/* ── 右侧内容 ── */
.story-content {
  padding: 0 0 32px 0;
}

.story-item.last .story-content {
  padding-bottom: 0;
}

.story-tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 20px;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.story-title {
  font-size: 1rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  font-family: 'Noto Serif SC', 'STSong', serif;
  margin: 0 0 8px;
  line-height: 1.5;
}

.story-desc {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.85;
  margin: 0;
}

/* 响应式 */
@media (max-width: 640px) {
  .story-item {
    grid-template-columns: 64px 1fr;
    gap: 0 12px;
  }
  .axis-year {
    font-size: 11px;
  }
}
</style>
