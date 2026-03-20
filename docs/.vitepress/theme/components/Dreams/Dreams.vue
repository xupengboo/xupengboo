<template>
  <div class="dreams-wrapper">

    <div class="dreams-header">
      <p class="dreams-prelude">
        人活着，总要有几件真正想要的事。
      </p>
    </div>

    <div class="dreams-list">
      <div
          v-for="(dream, i) in dreams"
          :key="i"
          class="dream-card"
          :style="{ '--accent': dream.color, '--accent-soft': dream.soft }"
      >
        <div class="dream-index">{{ String(i + 1).padStart(2, '0') }}</div>

        <div class="dream-body">
          <div class="dream-icon">{{ dream.icon }}</div>
          <h3 class="dream-title">{{ dream.title }}</h3>
          <p class="dream-desc">{{ dream.desc }}</p>

          <!-- 底部：引用语 + 日期 -->
          <div class="dream-footer">
            <div class="dream-quote">{{ dream.quote }}</div>
            <div class="dream-date">
              <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="1" y="2" width="14" height="13" rx="2"/>
                <path d="M1 6h14M5 1v2M11 1v2"/>
              </svg>
              {{ dream.date }}
            </div>
          </div>
        </div>

        <div class="dream-corner"></div>
      </div>
    </div>

    <div class="dreams-footer">
      <span class="footer-line"></span>
      <span class="footer-text">写下来的梦想，才算真的想要</span>
      <span class="footer-line"></span>
    </div>

  </div>
</template>

<script setup>
import { dreams } from './data'
</script>

<style scoped>
.dreams-wrapper {
  margin: 48px 0 56px;
}

.dreams-header {
  margin-bottom: 36px;
}

.dreams-prelude {
  font-size: 0.95rem;
  color: var(--vp-c-text-3);
  line-height: 2;
  font-style: italic;
  padding-left: 16px;
  border-left: 2px solid var(--vp-c-divider);
  margin: 0;
}

.dreams-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dream-card {
  position: relative;
  display: flex;
  align-items: stretch;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  background: var(--vp-c-bg);
  overflow: hidden;
  transition: box-shadow 0.25s, transform 0.25s, border-color 0.25s;
}

.dream-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.07);
  border-color: var(--accent);
}

.dream-card::before {
  content: '';
  display: block;
  width: 4px;
  flex-shrink: 0;
  background: var(--accent);
  opacity: 0.85;
}

.dream-corner {
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 28px 28px 0;
  border-color: transparent var(--accent) transparent transparent;
  opacity: 0.15;
  transition: opacity 0.25s;
}

.dream-card:hover .dream-corner {
  opacity: 0.35;
}

.dream-index {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  flex-shrink: 0;
  font-size: 1.6rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--accent);
  opacity: 0.18;
  font-family: 'Noto Serif SC', Georgia, serif;
  letter-spacing: -0.02em;
  transition: opacity 0.25s;
}

.dream-card:hover .dream-index {
  opacity: 0.32;
}

.dream-body {
  flex: 1;
  padding: 22px 24px 22px 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--accent-soft);
}

.dream-icon {
  font-size: 1.5rem;
  line-height: 1;
  margin-bottom: 2px;
}

.dream-title {
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  font-family: 'Noto Serif SC', 'STSong', serif;
  margin: 0;
  line-height: 1.4;
  letter-spacing: 0.03em;
}

.dream-desc {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.85;
  margin: 0;
}

/* 底部：引用 + 日期同行 */
.dream-footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-top: 4px;
  padding-top: 10px;
  border-top: 1px dashed var(--vp-c-divider);
}

.dream-quote {
  font-size: 0.82rem;
  color: var(--accent);
  opacity: 0.75;
  font-style: italic;
  letter-spacing: 0.03em;
  flex: 1;
}

.dream-quote::before {
  content: '— ';
  opacity: 0.6;
}

.dream-date {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  flex-shrink: 0;
  letter-spacing: 0.03em;
}

.dream-date svg {
  opacity: 0.6;
  flex-shrink: 0;
}

.dreams-footer {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 36px;
}

.footer-line {
  flex: 1;
  height: 1px;
  background: var(--vp-c-divider);
}

.footer-text {
  font-size: 12px;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  letter-spacing: 0.06em;
}

@media (max-width: 640px) {
  .dream-index {
    width: 44px;
    font-size: 1.2rem;
  }

  .dream-body {
    padding: 18px 18px 18px 6px;
  }

  .dream-title {
    font-size: 0.98rem;
  }

  .dream-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>
