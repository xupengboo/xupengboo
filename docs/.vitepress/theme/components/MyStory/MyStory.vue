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
import { story } from './data'
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
