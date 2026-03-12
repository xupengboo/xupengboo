<template>
  <div class="hobbies-wrapper">
    <div class="hobbies-grid">
      <div
        v-for="item in hobbies"
        :key="item.title"
        class="hobby-card"
        :style="{ '--c': item.color, '--s': item.soft }"
      >
        <div class="hobby-icon">{{ item.icon }}</div>
        <div class="hobby-body">
          <h4 class="hobby-title">{{ item.title }}</h4>
          <p class="hobby-desc">{{ item.desc }}</p>
        </div>
        <div class="hobby-bg-icon">{{ item.icon }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const hobbies = [
  {
    icon: '🏀',
    title: '篮球',
    desc: '球场上是我最放松的时候。运球、传球、投篮——打球不只是运动，更是一种发泄，也是一种专注。出了一身汗，什么烦恼都少了一半。',
    color: '#d97706',
    soft: 'rgba(217, 119, 6, 0.07)',
  },
  {
    icon: '🎵',
    title: '音乐',
    desc: '敲代码的时候耳机不离头，睡前也要听几首才踏实。音乐是一种陪伴，不同的心情配不同的曲子，有时候一首歌能说清楚很多说不出口的东西。',
    color: '#7c3aed',
    soft: 'rgba(124, 58, 237, 0.07)',
  },
]
</script>

<style scoped>
.hobbies-wrapper {
  margin: 32px 0 48px;
}

.hobbies-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

/* ── 卡片 ── */
.hobby-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px 20px;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  background: var(--s);
  overflow: hidden;
  transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
}

.hobby-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.07);
  border-color: var(--c);
}

/* 左侧颜色竖条 */
.hobby-card::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: var(--c);
  opacity: 0.7;
  border-radius: 12px 0 0 12px;
}

/* 背景大图标（装饰） */
.hobby-bg-icon {
  position: absolute;
  right: -8px;
  bottom: -12px;
  font-size: 5rem;
  opacity: 0.055;
  pointer-events: none;
  line-height: 1;
  user-select: none;
}

.hobby-icon {
  font-size: 2rem;
  line-height: 1;
  flex-shrink: 0;
  margin-top: 2px;
}

.hobby-body {
  flex: 1;
  min-width: 0;
}

.hobby-title {
  font-size: 1rem;
  font-weight: 500;
  color: var(--c);
  font-family: 'Noto Serif SC', 'STSong', serif;
  margin: 0 0 8px;
  letter-spacing: 0.04em;
}

.hobby-desc {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.85;
  margin: 0;
}

/* 响应式 */
@media (max-width: 640px) {
  .hobbies-grid {
    grid-template-columns: 1fr;
  }
}
</style>
