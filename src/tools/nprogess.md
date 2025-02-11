---
title: NProgess 进度条工具
order: 3
icon: hugeicons:tools
---

`NProgress` 是一个轻量级的进度条库，用于在页面加载过程中显示进度条，提升用户体验。它一般用于 AJAX 请求、路由切换、页面加载等需要显示加载状态的场景。

## 主要作用

1. **显示加载状态**：在发送请求、切换路由、加载内容等耗时操作时提供视觉反馈，使用户知道页面正在加载。
2. **提升用户体验**：加载进度条可以让用户感知操作正在进行，避免出现页面空白或等待时间较长带来的疑惑。
3. **灵活配置**：NProgress 可以自定义颜色、速度、显示位置等，还支持手动控制进度条的开始、结束和进度值。

## 主要方法

- `NProgress.start()`：开始显示进度条。
- `NProgress.done()`：结束并隐藏进度条。
- `NProgress.set(n)`：将进度条设置到指定进度（`n` 为 0.0 ~ 1.0 之间的值）。
- `NProgress.inc()`：增加一点进度条的进度。

## 使用示例

假设在 Vue 项目中，我们想在路由切换时显示加载进度条：

```js
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// 路由跳转前，开始进度条
router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});

// 路由跳转后，结束进度条
router.afterEach(() => {
  NProgress.done();
});
```

## 适用场景

- **AJAX 请求**：用于显示请求加载状态，例如使用 Axios 请求拦截器来启动和结束进度条。
- **路由切换**：用于单页面应用（SPA）在路由切换时显示加载状态。
- **页面内容加载**：用于显示页面内资源（如图片、视频等）的加载进度。

通过 `NProgress`，可以有效地提升用户对加载状态的感知，有助于提高用户体验。
