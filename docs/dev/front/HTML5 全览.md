---
title: HTML / HTML5 全览
outline: deep
---

# HTML / HTML5 全览

**HTML**（HyperText Markup Language，超文本标记语言）**不是编程语言，而是一种标记语言**，用于描述网页的结构与内容。

| 版本 | 年份 | 特点 |
|---|---|---|
| HTML 1.0 | 1993 | 最初版本，仅支持基础文本与链接 |
| HTML 2.0 | 1995 | 加入表单支持 |
| HTML 3.2 | 1997 | 引入表格、脚本 |
| HTML 4.01 | 1999 | 推荐使用小写标签，引入 CSS 分离样式 |
| XHTML 1.0 | 2000 | 严格的 XML 语法 |
| **HTML5** | **2014** | **当前主流版本**，语义化标签、多媒体、本地存储、WebSocket 等 |

:::tip
- HTML 标签对大小写不敏感，但 W3C 在 HTML4 中**推荐**、在 XHTML 中**强制**使用小写
- 截至目前，**HTML5 是使用最广泛的版本**，现代浏览器均完全支持
  :::

---

## 一、基础标签

### `<!DOCTYPE>` 声明

告诉浏览器用哪种 HTML 规范解析网页，**必须是文档的第一行**。

```html
<!-- HTML5（推荐，最简洁） -->
<!DOCTYPE html>

<!-- HTML 4.01 -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">

<!-- XHTML 1.0 -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
```

---

### `<meta>` 元数据

不显示在页面上，但影响网页行为、SEO 和移动端适配。

```html
<!-- 字符编码，中文页面必须设置，否则部分浏览器默认 GBK 导致乱码 -->
<meta charset="UTF-8">

<!-- 搜索引擎摘要，显示在搜索结果页中，影响点击率 -->
<meta name="description" content="这是网页的简短描述">

<!-- SEO 关键词 -->
<meta name="keywords" content="HTML, CSS, JavaScript">

<!-- 移动端适配，响应式布局必须加 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- 每 30 秒自动刷新页面 -->
<meta http-equiv="refresh" content="30">
```

---

### `<h1>` ~ `<h6>` 标题

```html
<h1>一级标题</h1>
<h2>二级标题</h2>
<h3>三级标题</h3>
```

:::tip
`<h1>` SEO 权重最高，一个页面通常只用一个 `<h1>`，其余标题按层级嵌套使用。
:::

---

### `<p>` 段落

```html
<p>这是一段文字。</p>
```

:::warning `<p>` 标签的特殊行为
1. **不能嵌套块级元素**（如 `<div>`），浏览器会自动断开，导致布局错乱：
```html
<!-- 写的是 -->
<p>段落内容 <div>块级元素</div></p>
<!-- 浏览器解析为 -->
<p>段落内容</p>
<div>块级元素</div>
```
2. **可以包含内联元素**：`<span>`、`<a>`、`<strong>`、`<em>` 等
3. **空白压缩**：多个连续空格和换行符会被压缩为一个空格
   :::

---

### `<a>` 链接

```html
<!-- 绝对路径 -->
<a href="https://www.example.com">访问网站</a>

<!-- 相对路径 -->
<a href="/about">关于我们</a>

<!-- 锚链接：跳转到页面内指定位置，配合 id 使用 -->
<a href="#section1">跳转到第一节</a>
<div id="section1">第一节内容</div>

<!-- 新标签页打开 -->
<a href="https://example.com" target="_blank">新标签页打开</a>

<!-- 图片链接 -->
<a href="https://www.example.com">
  <img src="example.jpg" alt="示例图片">
</a>

<!-- 触发文件下载（仅限同源文件） -->
<a href="file.pdf" download>下载 PDF</a>
<a href="image.png" download="custom-name.png">下载并重命名</a>

<!-- 邮件 / 电话 -->
<a href="mailto:hello@example.com">发邮件</a>
<a href="tel:+8612345678">打电话</a>
```

| `target` 值 | 说明 |
|---|---|
| `_self` | 当前页面打开（默认） |
| `_blank` | 新标签页打开 |
| `_parent` | 在父框架中打开 |
| `_top` | 在整个窗口中打开 |

---

### `<img>` 图像

```html
<img src="photo.jpg" alt="图片描述" width="300" height="200">
```

| 属性 | 说明 |
|---|---|
| `src` | 图片路径（必填） |
| `alt` | 图片无法显示时的替代文本，对 SEO 和无障碍访问很重要 |
| `width` / `height` | 宽高，建议只设一个，避免图片变形 |

---

### 文本格式化标签

| 标签 | 效果 | 说明 |
|---|---|---|
| `<b>` | **粗体** | 仅视觉效果 |
| `<strong>` | **粗体** | 有语义，表示重要内容（推荐） |
| `<i>` | *斜体* | 仅视觉效果 |
| `<em>` | *斜体* | 有语义，表示强调（推荐） |
| `<u>` | 下划线 | — |
| `<s>` | ~~删除线~~ | — |
| `<mark>` | 高亮文本 | HTML5 新增 |
| `<sub>` | 下标 | 如 H₂O |
| `<sup>` | 上标 | 如 x² |
| `<code>` | `等宽字体` | 行内代码片段 |
| `<pre>` | 预格式化文本 | 保留空格和换行 |
| `<br>` | 换行 | 自闭合标签 |
| `<hr>` | 水平分隔线 | 自闭合标签 |

---

### `<table>` 表格

```html
<table>
  <thead>
    <tr>
      <th>姓名</th>
      <th>年龄</th>
      <th>城市</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>张三</td>
      <td>25</td>
      <td>北京</td>
    </tr>
  </tbody>
</table>
```

| 标签 | 全称 | 说明 |
|---|---|---|
| `<table>` | table | 表格容器 |
| `<thead>` | table head | 表头区域 |
| `<tbody>` | table body | 表体区域 |
| `<tr>` | table row | 行 |
| `<th>` | table header | 表头单元格（默认加粗居中） |
| `<td>` | table data | 数据单元格 |

---

### `<ul>` / `<ol>` 列表

```html
<!-- 无序列表 unordered list -->
<ul>
  <li>苹果</li>
  <li>香蕉</li>
</ul>

<!-- 有序列表 ordered list -->
<ol>
  <li>第一步：准备材料</li>
  <li>第二步：开始制作</li>
</ol>

<!-- 嵌套列表 -->
<ul>
  <li>水果
    <ul>
      <li>苹果</li>
      <li>香蕉</li>
    </ul>
  </li>
</ul>
```

---

### `<div>` / `<span>` 区块

```html
<!-- div：块级元素，独占一行，常用于页面布局 -->
<div class="container">
  <p>内容区域</p>
</div>

<!-- span：内联元素，不换行，常用于局部样式调整 -->
<p>这是<span style="color: red;">红色</span>文字</p>
```

---

### `<form>` 表单

```html
<form action="/submit" method="post">

  <!-- 文本输入 -->
  <label for="name">用户名：</label>
  <input type="text" id="name" name="name" placeholder="请输入用户名" required>

  <!-- 密码 -->
  <label for="pwd">密码：</label>
  <input type="password" id="pwd" name="password" required>

  <!-- 单选按钮（同组 name 相同） -->
  <label>性别：</label>
  <input type="radio" id="male" name="gender" value="male" checked>
  <label for="male">男</label>
  <input type="radio" id="female" name="gender" value="female">
  <label for="female">女</label>

  <!-- 复选框 -->
  <input type="checkbox" id="agree" name="agree" checked>
  <label for="agree">订阅推送</label>

  <!-- 下拉列表 -->
  <label for="country">国家：</label>
  <select id="country" name="country">
    <option value="cn">中国</option>
    <option value="us">美国</option>
    <option value="uk">英国</option>
  </select>

  <!-- 提交 -->
  <input type="submit" value="提交">

</form>
```

---

### `<iframe>` 内嵌框架

```html
<iframe
  src="https://example.com"
  width="600"
  height="400"
  title="内嵌页面"
></iframe>
```

---

### `<script>` / `<noscript>`

```html
<script>
  console.log("Hello World!")
</script>

<!-- 浏览器禁用或不支持 JS 时显示 -->
<noscript>您的浏览器不支持 JavaScript，请启用后使用。</noscript>
```

---

### 字符实体

HTML 中部分字符有特殊含义（如 `<`、`>`），需要用字符实体来显示：

| 显示 | 描述 | 实体名称 | 实体编号 |
|---|---|---|---|
| （空格） | 空格 | `&nbsp;` | `&#160;` |
| `<` | 小于号 | `&lt;` | `&#60;` |
| `>` | 大于号 | `&gt;` | `&#62;` |
| `&` | 和号 | `&amp;` | `&#38;` |
| `"` | 引号 | `&quot;` | `&#34;` |
| `'` | 撇号 | `&apos;` | `&#39;` |
| © | 版权 | `&copy;` | `&#169;` |
| ® | 注册商标 | `&reg;` | `&#174;` |
| ™ | 商标 | `&trade;` | `&#8482;` |
| × | 乘号 | `&times;` | `&#215;` |
| ÷ | 除号 | `&divide;` | `&#247;` |
| ¥ | 人民币/日元 | `&yen;` | `&#165;` |
| € | 欧元 | `&euro;` | `&#8364;` |

---

## 二、页面布局

HTML5 之前，布局依赖无语义的 `<div id="nav">`、`<div class="header">` 等写法。HTML5 引入**语义化标签**，让结构更清晰，对 SEO 和无障碍访问更友好。

> SEO（Search Engine Optimization, 搜索引擎优化）：是一种优化方法和策略，目的是让你的网站在这些搜索引擎的结果页里排名更靠前，从而获得更多免费流量。

```html
<body>
  <header>
    <nav>导航栏</nav>
  </header>

  <main>
    <article>
      <section>文章章节</section>
    </article>
    <aside>侧边栏</aside>
  </main>

  <footer>页脚</footer>
</body>
```

![20260310-HTML5-页面布局.png](/images/20260310-HTML5-页面布局.png)

| 标签 | 用途 |
|---|---|
| `<header>` | 页面或区块的头部 |
| `<nav>` | 导航链接区域 |
| `<main>` | 页面主体内容（每页只用一个） |
| `<article>` | 独立的完整内容（如博客文章、新闻） |
| `<section>` | 文档中的章节或区段 |
| `<aside>` | 侧边栏，与主内容相关但独立 |
| `<footer>` | 页面或区块的底部 |
| `<figure>` | 独立的媒体内容（图片、图表、代码块等） |
| `<figcaption>` | `<figure>` 的标题说明 |

---

## 三、HTML5 新增标签

### `<canvas>` 画布

`<canvas>` 只是容器，必须通过 JavaScript 调用 Canvas API 绘制图形。

```html
<canvas id="myCanvas" width="500" height="400">
  您的浏览器不支持 canvas。
</canvas>

<script>
  const canvas = document.getElementById('myCanvas')
  const ctx = canvas.getContext('2d')

  // 填充矩形（红色）
  ctx.fillStyle = '#FF0000'
  ctx.fillRect(20, 20, 150, 100)        // (x, y, width, height)

  // 空心矩形（蓝色边框）
  ctx.strokeStyle = '#0000FF'
  ctx.strokeRect(200, 20, 150, 100)

  // 绘制路径（三角形）
  ctx.beginPath()
  ctx.moveTo(100, 150)
  ctx.lineTo(200, 250)
  ctx.lineTo(50, 250)
  ctx.closePath()
  ctx.fillStyle = 'green'
  ctx.fill()
  ctx.strokeStyle = 'black'
  ctx.stroke()

  // 绘制圆形
  ctx.beginPath()
  ctx.arc(350, 200, 50, 0, Math.PI * 2) // (x, y, radius, startAngle, endAngle)
  ctx.fillStyle = 'yellow'
  ctx.fill()
  ctx.stroke()

  // 绘制文字
  ctx.font = '20px Arial'
  ctx.fillStyle = 'black'
  ctx.fillText('Canvas 示例', 300, 350)  // (text, x, y)

  // 绘制图片
  const img = document.getElementById('myImage')
  ctx.drawImage(img, 10, 10)
</script>
```

---

### `<svg>` 可缩放矢量图形

用 XML 描述 2D 图形，放大不失真，常用于图标、Logo 和地图。

```html
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <!-- 圆形 -->
  <circle cx="100" cy="100" r="50" stroke="black" stroke-width="3" fill="red" />
  <!-- 矩形 -->
  <rect x="150" y="50" width="100" height="100" stroke="blue" stroke-width="3" fill="green" />
  <!-- 文字 -->
  <text x="50" y="180" font-family="Arial" font-size="20" fill="black">SVG 示例</text>
</svg>
```

:::tip Canvas vs SVG 对比
| | Canvas | SVG |
|---|---|---|
| 描述方式 | JavaScript 绘制像素 | XML 描述矢量图形 |
| 缩放 | 放大会失真 | 无限缩放不失真 |
| 事件绑定 | 需手动计算坐标 | 每个元素可直接绑定事件 |
| DOM 操作 | 无法直接操作图形元素 | 每个图形都是 DOM 节点 |
| 适用场景 | 游戏、动画、图像处理 | 图标、地图、矢量插图 |
:::

---

### `<video>` 视频 / `<audio>` 音频

提供多个 `<source>` 来增强浏览器兼容性，浏览器会自动选择第一个支持的格式。

```html
<!-- 视频，controls 显示播放控件 -->
<video width="420" controls>
  <source src="video.mp4" type="video/mp4">
  <source src="video.ogg" type="video/ogg">
  您的浏览器不支持 HTML5 video。
</video>

<!-- 音频 -->
<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
  <source src="audio.ogg" type="audio/ogg">
  您的浏览器不支持 audio 元素。
</audio>
```

| 常用属性 | 说明 |
|---|---|
| `controls` | 显示播放控件（播放/暂停/音量/进度条） |
| `autoplay` | 自动播放（需配合 `muted` 才能在大多数浏览器生效） |
| `loop` | 循环播放 |
| `muted` | 静音 |
| `poster` | 视频封面图（仅 `<video>` 支持） |

---

### `<input>` 新类型

HTML5 为 `<input>` 新增了多种 `type`，浏览器会自动提供对应 UI 和格式验证：

| `type` 值 | 用途 | 特点 |
|---|---|---|
| `color` | 颜色选择器 | 返回十六进制颜色值 |
| `date` | 日期选择器 | 返回 `YYYY-MM-DD` |
| `datetime-local` | 日期时间选择器 | 本地时间，无时区 |
| `email` | 邮箱输入 | 提交时自动验证格式 |
| `number` | 数字输入 | 支持 `min`、`max`、`step` |
| `range` | 滑动条 | 支持 `min`、`max`、`step` |
| `search` | 搜索框 | 通常有清除按钮 |
| `tel` | 电话号码 | 移动端自动调起数字键盘 |
| `url` | URL 输入 | 提交时自动验证格式 |
| `file` | 文件上传 | 支持 `multiple`、`accept` |

---

### `<datalist>` 输入建议列表

输入框 + 下拉候选的组合，用户可以直接输入也可以从列表选择：

```html
<input list="browsers" placeholder="选择或输入浏览器">

<datalist id="browsers">
  <option value="Chrome">
  <option value="Firefox">
  <option value="Safari">
  <option value="Edge">
</datalist>
```

---

### `<output>` 输出结果

用于显示计算或操作的实时结果：

```html
<form oninput="result.value = parseInt(a.value) + parseInt(b.value)">
  <input type="number" id="a" name="a" value="0"> +
  <input type="number" id="b" name="b" value="0"> =
  <output name="result" for="a b">0</output>
</form>
```

---

### 表单新属性

```html
<!-- autocomplete：浏览器自动填充（on/off） -->
<form action="/submit" autocomplete="on">
  <input type="text" name="fname">
  <input type="email" name="email" autocomplete="off">  <!-- 单独关闭 -->
</form>

<!-- novalidate：提交时跳过浏览器内置验证（常用于自定义验证逻辑） -->
<form action="/submit" novalidate>
  <input type="email" name="email">
  <input type="submit">
</form>

<!-- autofocus：页面加载时自动聚焦该输入框 -->
<input type="text" name="username" autofocus>

<!-- form 属性：让表单外的 input 也归属于指定表单 -->
<form id="myForm" action="/submit">
  <input type="text" name="fname">
  <input type="submit">
</form>
<!-- 在 form 标签外，但通过 form 属性绑定到 myForm，提交时会一并提交 -->
<input type="text" name="lname" form="myForm">
```

---

### `<math>` 数学标记语言

原生支持数学公式渲染，浏览器支持程度不一，**生产环境建议用 KaTeX 或 MathJax**：

```html
<!-- 渲染 a² + b² = c² -->
<math xmlns="http://www.w3.org/1998/Math/MathML">
  <mrow>
    <msup><mi>a</mi><mn>2</mn></msup>
    <mo>+</mo>
    <msup><mi>b</mi><mn>2</mn></msup>
    <mo>=</mo>
    <msup><mi>c</mi><mn>2</mn></msup>
  </mrow>
</math>
```

---

### Geolocation 地理定位

```html
<button onclick="getLocation()">获取我的位置</button>
<p id="demo"></p>

<script>
function getLocation() {
  if (!navigator.geolocation) {
    document.getElementById("demo").textContent = "该浏览器不支持地理定位。"
    return
  }
  navigator.geolocation.getCurrentPosition(showPosition, showError)
}

function showPosition(position) {
  document.getElementById("demo").innerHTML =
    "纬度：" + position.coords.latitude +
    "<br>经度：" + position.coords.longitude
}

function showError(error) {
  const messages = {
    [error.PERMISSION_DENIED]:    "用户拒绝了定位请求。",
    [error.POSITION_UNAVAILABLE]: "位置信息不可用。",
    [error.TIMEOUT]:              "请求超时。",
    [error.UNKNOWN_ERROR]:        "未知错误。",
  }
  document.getElementById("demo").textContent = messages[error.code] ?? "未知错误。"
}
</script>
```

---

## 四、本地存储

浏览器端的键值存储方案，无需服务器，数据保存在用户本地。

```js
// 检测是否支持
if (typeof Storage !== "undefined") {
  console.log("支持本地存储")
} else {
  console.log("不支持，请升级浏览器")
}
```

### localStorage vs sessionStorage

| | localStorage | sessionStorage |
|---|---|---|
| **生命周期** | 永久保存，需手动删除 | 关闭标签页/窗口后自动清除 |
| **作用范围** | 同源所有标签页共享 | 仅当前标签页 |
| **容量上限** | 约 5MB | 约 5MB |
| **适用场景** | 用户偏好、主题、语言设置 | 临时表单数据、一次性会话状态 |

```js
// ── localStorage ──────────────────────────────────

localStorage.setItem("theme", "dark")                         // 存储
const theme = localStorage.getItem("theme")                   // 读取 → "dark"
localStorage.removeItem("theme")                              // 删除单个
localStorage.clear()                                          // 清空全部

// 存储对象（需序列化）
const user = { name: "张三", age: 25 }
localStorage.setItem("user", JSON.stringify(user))

// 读取对象（需反序列化）
const savedUser = JSON.parse(localStorage.getItem("user"))
console.log(savedUser.name)  // "张三"

// ── sessionStorage 用法完全相同 ────────────────────
sessionStorage.setItem("token", "abc123")
const token = sessionStorage.getItem("token")
```

---

## 五、Web Workers

Web Worker 让 JavaScript 在**后台线程**中运行，不阻塞主线程（UI 线程），解决耗时计算导致页面卡顿的问题。

:::tip 类比理解
可以把 Web Worker 理解为前端的"子线程"：主线程负责 UI 渲染和用户交互，Worker 线程专门处理耗时计算任务，两者通过 `postMessage` 通信，互不干扰。
:::

**`index.html`（主线程）：**

```html
<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <title>Web Worker 示例</title>
</head>
<body>
  <button id="startSort">开始排序（100万数据）</button>
  <p id="status">点击按钮开始，排序期间页面仍可正常交互</p>

  <script>
    const worker = new Worker('worker.js')
    const status = document.getElementById('status')

    // 接收 Worker 返回的结果
    worker.onmessage = function(event) {
      const sorted = event.data
      status.textContent = `排序完成！最小值：${sorted[0]}，最大值：${sorted[sorted.length - 1]}`
    }

    document.getElementById('startSort').onclick = function() {
      status.textContent = '后台排序中，页面仍可正常操作...'
      // 生成 100 万个随机数，发送给 Worker 处理
      const largeArray = Array.from(
        { length: 1_000_000 },
        () => Math.floor(Math.random() * 1_000_000)
      )
      worker.postMessage(largeArray)
    }
  </script>
</body>
</html>
```

**`worker.js`（Worker 线程）：**

```js
// Worker 中没有 window 和 DOM，只负责纯计算
onmessage = function(event) {
  const sorted = event.data.sort((a, b) => a - b)
  postMessage(sorted)  // 排序完成，将结果发回主线程
}
```

:::warning 运行限制
Worker 受同源策略限制，**不能**直接用 `file://` 协议打开 HTML 文件测试，需通过本地 HTTP 服务：
```shell
npx http-server .
```
:::

---

## 六、WebSocket

WebSocket 是 HTML5 提供的**全双工通信协议**，在单个 TCP 连接上实现浏览器与服务器的双向实时通信。

:::tip WebSocket vs 传统轮询
| | Ajax 轮询 | WebSocket |
|---|---|---|
| 连接方式 | 每次请求重新建立 | 一次握手，持久连接 |
| HTTP 头开销 | 每次都携带大量 Headers | 握手后数据帧极小 |
| 实时性 | 取决于轮询间隔 | 毫秒级实时推送 |
| 服务器压力 | 高（大量无效请求） | 低 |
| 适用场景 | 低频数据刷新 | 聊天室、游戏、实时协同 |
:::

> **AJAX 轮询是"一问一答"的模式，反复建立/断开连接**。而 **WebSocket 则是先用 HTTP 发起握手**（`GET /ws`），**握手成功后协议升级**，之后用红色箭头表示的 WebSocket 协议**进行双向通信，连接持续不断开**。
> ![20260310-HTML5-WebSocket.png](/public/images/20260310-HTML5-WebSocket.png)


**`index.html`（前端）：**

```html
<input id="msgInput" type="text" placeholder="输入消息">
<button onclick="sendMessage()">发送</button>
<pre id="chatLog"></pre>

<script>
  const ws = new WebSocket('ws://localhost:8080/chat')

  ws.onopen    = ()    => console.log('连接已建立')
  ws.onclose   = ()    => console.log('连接已关闭')
  ws.onerror   = (err) => console.error('WebSocket 错误:', err)
  ws.onmessage = (event) => {
    document.getElementById('chatLog').textContent += event.data + '\n'
  }

  function sendMessage() {
    const msg = document.getElementById('msgInput').value
    if (msg.trim()) ws.send(msg)
  }
</script>
```

**Spring Boot 后端：**

::: code-group

```xml [pom.xml]
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

```java [ChatWebSocketHandler.java]
@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    // 存储所有活跃连接
    private final Set<WebSocketSession> sessions =
        Collections.synchronizedSet(new HashSet<>());

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.add(session);
        System.out.println("新连接：" + session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message)
            throws Exception {
        String payload = message.getPayload();
        // 广播给所有连接的客户端
        for (WebSocketSession s : sessions) {
            if (s.isOpen()) {
                s.sendMessage(new TextMessage(
                    "客户端 " + session.getId() + " 说：" + payload
                ));
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session);
        System.out.println("连接关闭：" + session.getId());
    }
}
```

```java [WebSocketConfig.java]
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new ChatWebSocketHandler(), "/chat")
                .setAllowedOrigins("*");  // 生产环境请限制为具体域名
    }
}
```

:::

---

## 七、SSE 服务器发送事件

SSE（Server-Sent Events）是基于 HTTP 的**服务器单向推送**技术，服务器通过持久连接持续向客户端推送数据，**客户端无法通过 SSE 向服务器发送消息**。

**`index.html`（前端）：**

```html
<div id="result"></div>

<script>
  const source = new EventSource("http://127.0.0.1:8080/sse")

  // 接收默认消息
  source.onmessage = function(event) {
    document.getElementById("result").innerHTML += event.data + "<br>"
  }

  // 接收自定义命名事件
  source.addEventListener("custom-event", function(event) {
    console.log("自定义事件数据：", event.data)
  })

  source.onerror = function() {
    console.log("连接异常，浏览器将自动尝试重连...")
  }
</script>
```

**`server.js`（Node.js，通过 `node server.js` 启动）：**

```js
const http = require('http')

http.createServer((req, res) => {
  // 允许跨域
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.url === '/sse') {
    // SSE 必须设置 Content-Type 为 text/event-stream
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    })

    res.write('data: 连接已建立！\n\n')

    // 每 2 秒推送一次当前时间
    const timer = setInterval(() => {
      res.write(`data: 当前时间：${new Date().toLocaleTimeString()}\n\n`)
    }, 2000)

    // 客户端断开时清理定时器，防止内存泄漏
    req.on('close', () => clearInterval(timer))

  } else {
    res.writeHead(404)
    res.end('<h1>404 Not Found</h1>')
  }

}).listen(8080, () => console.log('SSE 服务已启动：http://localhost:8080'))
```

## 八、 SSE vs WebSocket vs Ajax轮询 

Ajax 轮询、SSE、WebSocket 是 **Web 实时通信** 的三种主要方案，按演进顺序理解更清晰。

| | Ajax | SSE | WebSocket |
|---|---|---|---|
| **通信方向** | 客户端单向请求 | 单向（服务器 → 客户端） | 双向 |
| **连接方式** | 每次重新建立 HTTP 连接 | 一次连接，持久保持 | 握手升级后持久连接 |
| **协议** | 标准 HTTP | 标准 HTTP/HTTPS | 独立的 WS/WSS 协议 |
| **服务器主动推送** | ❌ 不支持 | ✅ 支持 | ✅ 支持 |
| **客户端发送数据** | ✅ 支持 | ❌ 不支持 | ✅ 支持 |
| **断线重连** | 需手动实现 | 浏览器**自动**重连 | 需手动实现 |
| **数据格式** | 任意（JSON 等） | 纯文本 | 文本或二进制 |
| **带宽开销** | 高（每次携带完整 Header） | 低 | 极低（帧头仅 2~10 字节） |
| **代理兼容性** | 好 | 好（基于 HTTP） | 部分代理/防火墙可能拦截 |
| **实现复杂度** | 低 | 低 | 中 |
| **适用场景** | 低频数据刷新、兼容旧环境 | 新闻推送、股价、日志流、进度通知 | 聊天室、游戏、协同编辑 |

:::tip 如何选型？
- 只需**服务器推送**，不需要客户端发消息 → 优先选 **SSE**（更简单，HTTP 原生支持）
- 需要**双向实时通信** → 选 **WebSocket**
- 场景简单、数据更新不频繁、需要兼容老旧环境 → **Ajax 轮询**也够用
  :::
