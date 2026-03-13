---
title: CSS 速查手册
outline: deep
---

# CSS 速查手册

> 定位：**看到需求能想到用哪个属性，查到就能用**。不需要全部记忆，遇到再翻。

**CSS**（Cascading Style Sheets，层叠样式表）控制网页的外观与布局。几个核心概念：

| 概念 | 说明 |
|---|---|
| **选择器** | 选中要设置样式的元素，如 `p`、`#id`、`.class` |
| **属性 + 值** | `color: red;` — 属性是 `color`，值是 `red` |
| **层叠** | 多个规则冲突时，按优先级决定哪条生效 |
| **继承** | `color`、`font-size` 等会被子元素继承；`margin`、`border` 不会 |

---

## 一、样式引入方式

```html
<!-- ① 外部样式表（推荐，可复用） -->
<link rel="stylesheet" href="style.css">

<!-- ② 内部样式表 -->
<style>
  p { color: red; }
</style>

<!-- ③ 内联样式（优先级最高，尽量少用） -->
<p style="color: red; margin: 0;">文字</p>
```

:::tip 优先级
内联样式 > 内部样式 > 外部样式 > 浏览器默认
:::

---

## 二、选择器

### 基础选择器

```css
p { }           /* 标签选择器 */
#app { }        /* ID 选择器 */
.btn { }        /* 类选择器 */
* { }           /* 通配符，选中所有元素 */
```

### 关系选择器

| 写法 | 含义 | 示例 |
|---|---|---|
| `A B` | A 内所有 B（后代） | `div p` |
| `A > B` | A 的直接子元素 B | `ul > li` |
| `A + B` | A 后紧邻的 B（相邻兄弟） | `h1 + p` |
| `A ~ B` | A 后所有的 B（后续兄弟） | `h1 ~ p` |

### 属性选择器

```css
[title]           /* 有 title 属性 */
[type="text"]     /* type 精确等于 text */
[class^="btn"]    /* class 以 btn 开头 */
[class$="icon"]   /* class 以 icon 结尾 */
[class*="flex"]   /* class 包含 flex */
```

### 伪类（元素状态）

:::tip 最常用的几个
```css
a:hover  { }          /* 鼠标悬停 */
a:link   { }          /* 未访问链接 */
a:visited{ }          /* 已访问链接 */
a:active { }          /* 点击瞬间 */
input:focus { }       /* 获得焦点 */
input:disabled { }    /* 禁用状态 */
input:checked  { }    /* 选中状态 */
```
链接伪类顺序必须是：`link → visited → hover → active`（助记：**LoVe HAte**）
:::

**结构伪类：**

```css
li:first-child      /* 第一个子元素 */
li:last-child       /* 最后一个子元素 */
li:nth-child(2)     /* 第 2 个子元素 */
li:nth-child(odd)   /* 奇数行（odd / even） */
li:nth-child(2n+1)  /* 奇数行（公式写法） */
p:not(.active)      /* 排除 .active 的 p */
```

### 伪元素（元素的特定部分）

```css
p::first-letter { }  /* 首字母 */
p::first-line   { }  /* 首行 */
div::before { content: "→"; }  /* 元素内容之前插入 */
div::after  { content: "←"; }  /* 元素内容之后插入 */
```

:::tip 伪类 vs 伪元素
- **伪类**（`:`）：元素处于某种**状态**，如 `:hover`、`:focus`
- **伪元素**（`::`）：元素的某个**部分**，如 `::before`、`::after`
  :::

---

## 三、盒模型

每个元素都是一个盒子，从内到外：**content → padding → border → margin**。

```
┌─────────────── margin ───────────────┐
│  ┌─────────── border ─────────────┐  │
│  │  ┌──────── padding ──────────┐ │  │
│  │  │       content             │ │  │
│  │  └───────────────────────────┘ │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

```css
div {
  width: 300px;
  padding: 20px;           /* 内边距 */
  border: 2px solid #333;  /* 边框 */
  margin: 16px auto;       /* 外边距，auto 可水平居中 */
}
```

:::tip `box-sizing` — 很重要
```css
/* 默认：width 只算 content，加上 padding/border 会撑大元素 */
box-sizing: content-box;

/* 推荐：width 包含 padding 和 border，不会撑大 */
box-sizing: border-box;
```
现代项目通常全局设置 `* { box-sizing: border-box; }`
:::

### 简写规律（上右下左，顺时针）

```css
margin: 10px;                 /* 四边都是 10px */
margin: 10px 20px;            /* 上下 10px，左右 20px */
margin: 10px 20px 30px;       /* 上 10，左右 20，下 30 */
margin: 10px 20px 30px 40px;  /* 上 右 下 左 */
/* padding 规则相同 */
```

---

## 四、常用属性速查

### 背景 `background`

```css
background-color: #fff;
background-image: url('bg.jpg');
background-repeat: no-repeat;       /* repeat / repeat-x / repeat-y */
background-position: center center; /* left top / 50% 50% / 10px 20px */
background-size: cover;             /* cover / contain / 100% */
background-attachment: fixed;       /* scroll（默认）/ fixed（视差）*/

/* 简写 */
background: #fff url('bg.jpg') no-repeat center/cover;
```

### 文本 `text`

| 属性 | 常用值 | 说明 |
|---|---|---|
| `color` | `red` / `#fff` / `rgb()` | 文字颜色 |
| `text-align` | `left` / `center` / `right` / `justify` | 水平对齐 |
| `line-height` | `1.5` / `24px` | 行高，`1.5` 表示字号 × 1.5 |
| `text-decoration` | `none` / `underline` / `line-through` | 装饰线 |
| `text-transform` | `uppercase` / `lowercase` / `capitalize` | 大小写 |
| `text-indent` | `2em` | 首行缩进 |
| `letter-spacing` | `2px` | 字符间距 |
| `word-spacing` | `4px` | 单词间距 |
| `white-space` | `nowrap` / `pre` | 空白处理，`nowrap` 禁止换行 |
| `text-shadow` | `2px 2px 4px #888` | 文字阴影 |
| `overflow` | `hidden` / `scroll` / `auto` | 内容溢出处理 |
| `word-break` | `break-all` / `keep-all` | 单词是否拆分换行 |

### 字体 `font`

| 属性 | 常用值 | 说明 |
|---|---|---|
| `font-size` | `16px` / `1rem` / `1.2em` | 字号 |
| `font-weight` | `normal` / `bold` / `400~900` | 粗细 |
| `font-style` | `normal` / `italic` | 斜体 |
| `font-family` | `"Arial", sans-serif` | 字体，按优先级回退 |

```css
/* 简写：style weight size/line-height family */
font: italic bold 16px/1.5 "Arial", sans-serif;
```

自定义字体：
```css
@font-face {
  font-family: "MyFont";
  src: url("myfont.woff2");
}
```

### 边框 `border`

```css
border: 1px solid #ccc;          /* 简写：宽度 样式 颜色 */
border-radius: 8px;               /* 圆角 */
border-radius: 50%;               /* 圆形 */
border-radius: 10px 20px 30px 40px; /* 左上 右上 右下 左下 */

/* 单边 */
border-top: 2px dashed red;
border-bottom: none;
```

`border-style` 常用值：`solid`（实线）、`dashed`（虚线）、`dotted`（点线）、`none`

### 轮廓 `outline`

和 `border` 类似，但**不占空间**，常用于 focus 状态：

```css
input:focus {
  outline: 2px solid blue;
  outline-offset: 2px;  /* 轮廓与边框的间距 */
}
/* 去掉默认 outline（注意：去掉后要保证其他视觉反馈） */
button { outline: none; }
```

### 尺寸

| 属性 | 说明 |
|---|---|
| `width` / `height` | 宽高 |
| `max-width` / `min-width` | 最大/最小宽度 |
| `max-height` / `min-height` | 最大/最小高度 |

响应式图片常用写法：
```css
img {
  max-width: 100%;
  height: auto;
}
```

---

## 五、显示与定位

### `display` 显示模式

| 值 | 说明 |
|---|---|
| `block` | 块级，独占一行（`div`、`p`、`h1` 默认） |
| `inline` | 内联，不换行，不能设宽高（`span`、`a` 默认） |
| `inline-block` | 内联+可设宽高（常用！） |
| `none` | 隐藏，**不占空间** |
| `flex` | 弹性布局容器（见第六节） |
| `grid` | 网格布局容器（见第七节） |

`display:none` vs `visibility:hidden`：

```css
display: none;       /* 隐藏 + 不占空间 */
visibility: hidden;  /* 隐藏 + 仍占空间 */
opacity: 0;          /* 透明 + 仍占空间 + 仍可触发事件 */
```

### `position` 定位

| 值 | 说明 |
|---|---|
| `static` | 默认，跟随文档流，`top/left` 无效 |
| `relative` | 相对**自身原位置**偏移，原空间保留 |
| `absolute` | 相对**最近的非 static 祖先**定位，脱离文档流 |
| `fixed` | 相对**视口**固定，滚动不移动（导航栏常用） |
| `sticky` | 滚动到阈值前是 relative，之后"粘住"（吸顶效果常用） |

```css
/* 常用：绝对居中 */
.parent { position: relative; }
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 吸顶效果 */
nav {
  position: sticky;
  top: 0;
}
```

配合 `top` / `right` / `bottom` / `left` / `z-index` 使用。

### `z-index` 堆叠顺序

数值越大越靠前，**必须配合非 static 的 position 才生效**。

```css
.modal   { position: fixed; z-index: 1000; }
.overlay { position: fixed; z-index: 999; }
```

### `overflow` 溢出处理

| 值 | 说明 |
|---|---|
| `visible` | 默认，溢出内容可见 |
| `hidden` | 裁剪溢出内容 |
| `scroll` | 始终显示滚动条 |
| `auto` | 有溢出时才显示滚动条（推荐） |

```css
/* 单行文本截断省略号 */
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### `float` 浮动

现代布局已基本用 Flex/Grid 替代，float 主要用于**文字环绕图片**。

```css
img { float: left; margin-right: 16px; }

/* 清除浮动（防止父容器高度塌陷） */
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
```

### `opacity` 透明度

```css
opacity: 0;    /* 完全透明 */
opacity: 0.5;  /* 半透明 */
opacity: 1;    /* 完全不透明 */
```

---

## 六、Flexbox 弹性布局

> 一维布局（一行或一列），**最常用的布局方案**。

```css
.container {
  display: flex;
}
```

### 容器属性

| 属性 | 常用值 | 说明 |
|---|---|---|
| `flex-direction` | `row`（默认）/ `column` / `row-reverse` / `column-reverse` | 主轴方向 |
| `justify-content` | `flex-start` / `flex-end` / `center` / `space-between` / `space-around` | 主轴对齐 |
| `align-items` | `stretch`（默认）/ `center` / `flex-start` / `flex-end` / `baseline` | 交叉轴对齐 |
| `flex-wrap` | `nowrap`（默认）/ `wrap` / `wrap-reverse` | 是否换行 |
| `align-content` | 同 `justify-content` | 多行时交叉轴对齐（单行无效） |
| `gap` | `10px` / `10px 20px` | 子元素间距（行间距 列间距） |

### 子元素属性

| 属性 | 常用值 | 说明 |
|---|---|---|
| `flex` | `1` / `0 0 200px` | 简写：grow shrink basis |
| `flex-grow` | `0`（默认）/ `1` | 剩余空间分配比例 |
| `flex-shrink` | `1`（默认）/ `0` | 空间不足时收缩比例 |
| `flex-basis` | `auto` / `200px` | 初始尺寸 |
| `align-self` | 同 `align-items` | 单独设置该子元素的交叉轴对齐 |
| `order` | 整数（默认 0） | 排列顺序，越小越靠前 |

### 高频场景速查

```css
/* 水平垂直居中（最常用） */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 两端对齐，中间自动分配 */
.space-between {
  display: flex;
  justify-content: space-between;
}

/* 左边固定，右边自适应 */
.sidebar-layout {
  display: flex;
}
.sidebar { width: 200px; flex-shrink: 0; }
.main    { flex: 1; }

/* 子元素等宽 */
.equal-cols .item { flex: 1; }

/* 换行卡片布局 */
.card-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.card { flex: 0 0 calc(33.33% - 16px); }
```

---

## 七、Grid 网格布局

> 二维布局（行 + 列），适合页面级布局和复杂网格。

```css
.container {
  display: grid;
}
```

### 容器属性

```css
.container {
  /* 定义列：3 列等宽 */
  grid-template-columns: 1fr 1fr 1fr;
  /* 简写：repeat(3, 1fr) */
  
  /* 定义行 */
  grid-template-rows: 100px auto 60px;

  /* 间距 */
  gap: 16px;              /* 行列间距相同 */
  gap: 10px 20px;         /* 行间距 列间距 */

  /* 自动填充列（响应式常用） */
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
```

| 属性 | 说明 |
|---|---|
| `grid-template-columns` | 定义列数和列宽 |
| `grid-template-rows` | 定义行数和行高 |
| `gap` | 单元格间距 |
| `justify-items` | 单元格内水平对齐 |
| `align-items` | 单元格内垂直对齐 |
| `justify-content` | 整个网格在容器中水平对齐 |
| `align-content` | 整个网格在容器中垂直对齐 |

### 子元素属性（跨行跨列）

```css
.item {
  grid-column: 1 / 3;      /* 从第 1 条线到第 3 条线（跨 2 列） */
  grid-column: span 2;     /* 跨 2 列（不指定起点） */
  grid-row: 1 / 3;         /* 跨 2 行 */
}
```

### 高频场景速查

```css
/* 经典三列等宽 */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

/* 响应式自动填充（不用媒体查询） */
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

/* 页面骨架布局 */
.layout {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 60px 1fr 40px;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  height: 100vh;
}
.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
```

:::tip Flex vs Grid 怎么选
- **Flex**：一行或一列，内容驱动尺寸 → 导航栏、按钮组、卡片行
- **Grid**：行列同时控制，布局驱动内容 → 页面骨架、图片瀑布流、仪表盘
  :::

---

## 八、CSS3 进阶

### 变量 CSS Variables

```css
:root {
  --primary: #3b82f6;
  --radius: 8px;
}

.btn {
  background: var(--primary);
  border-radius: var(--radius);
}
```

### 渐变

```css
/* 线性渐变 */
background: linear-gradient(to right, #f00, #00f);
background: linear-gradient(135deg, #667eea, #764ba2);

/* 径向渐变（从中心向外） */
background: radial-gradient(circle, #f00 20%, #00f 80%);

/* 重复渐变（条纹效果） */
background: repeating-linear-gradient(to right, red, blue 10%);
```

### 变换 `transform`

```css
transform: translate(50px, 100px);   /* 移动 */
transform: rotate(45deg);            /* 旋转 */
transform: scale(1.2);               /* 缩放 */
transform: skew(20deg, 10deg);       /* 倾斜 */

/* 组合使用 */
transform: translate(-50%, -50%) rotate(45deg) scale(1.2);

/* 3D */
transform: rotateX(45deg);
transform: rotateY(60deg);
transform: translateZ(100px);
```

### 过渡 `transition`

```css
/* transition: 属性 时长 缓动函数 延迟 */
transition: all 0.3s ease;
transition: width 0.3s ease, opacity 0.2s linear;

/* 常用缓动 */
/* ease（默认）/ linear / ease-in / ease-out / ease-in-out */

/* 示例：hover 展开 */
.box { width: 100px; transition: width 0.3s ease; }
.box:hover { width: 300px; }
```

### 动画 `animation`

```css
/* 定义关键帧 */
@keyframes slideIn {
  0%   { opacity: 0; transform: translateY(-20px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* 应用动画 */
.card {
  animation: slideIn 0.4s ease forwards;
}

/* 完整写法 */
animation: name duration timing-function delay iteration-count direction fill-mode;
```

| 常用属性 | 说明 |
|---|---|
| `animation-duration` | 持续时长 |
| `animation-delay` | 延迟开始 |
| `animation-iteration-count` | 播放次数，`infinite` 无限循环 |
| `animation-direction` | `normal` / `reverse` / `alternate`（来回） |
| `animation-fill-mode` | `forwards`（保持结束状态）/ `backwards` |

---

## 九、居中对齐速查

| 场景 | 方案 |
|---|---|
| **块级元素水平居中** | `margin: 0 auto;`（需设宽度） |
| **文本水平居中** | `text-align: center;` |
| **Flex 水平垂直居中** | `display:flex; justify-content:center; align-items:center;` |
| **绝对定位居中** | `position:absolute; top:50%; left:50%; transform:translate(-50%,-50%)` |
| **Grid 居中** | `display:grid; place-items:center;` |
| **垂直居中（单行文本）** | `line-height` = `height` |
| **垂直居中（多行）** | 用 Flex 的 `align-items:center` |

---

## 十、媒体查询（响应式）

```css
/* 移动端优先（推荐） */
.container { width: 100%; }

@media (min-width: 768px) {
  .container { width: 750px; }
}

@media (min-width: 1024px) {
  .container { width: 960px; }
}

/* 常见断点参考 */
/* 手机：< 768px */
/* 平板：768px ~ 1024px */
/* 桌面：> 1024px */
```

---

## 十一、CSS Sprite（雪碧图）

将多张小图合并为一张，减少 HTTP 请求，通过 `background-position` 显示对应区域。

```css
.icon-home {
  background: url('sprite.png') no-repeat;
  background-position: 0 0;      /* 显示第一个图标 */
  width: 24px;
  height: 24px;
}
.icon-user {
  background: url('sprite.png') no-repeat;
  background-position: -24px 0;  /* 向左偏移显示第二个 */
}
```

:::tip
现代项目更常用 **SVG 图标**（`<svg>` 或 icon font），CSS Sprite 在老项目和小图标性能优化时仍有价值。
:::

---

## 十二、`!important` 与优先级

**优先级计算（高到低）：**

```
!important > 内联 > ID > 类/伪类/属性 > 标签 > 通配符
```

```css
/* 千万少用！会破坏层叠规则，调试困难 */
color: red !important;
```

:::warning
`!important` 是最后的手段，正常开发中通过提高选择器的具体性来解决优先级问题。
:::

---

## 十三、常用 CSS 框架

| 框架 | 特点 | 适用 |
|---|---|---|
| **Bootstrap** | 组件丰富，开箱即用 | 快速搭建后台/官网 |
| **Tailwind CSS** | 原子类，高度定制 | 现代前端项目主流 |
| **UnoCSS** | 按需生成，极致轻量 | Vue/Vite 生态 |
