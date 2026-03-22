<div align="center">

# 🧠 XuPengBoo's Wiki

**个人技术知识库 · 持续更新**

*开发 · 运维 · 大数据 · AI 大模型*

<br/>

[![VitePress](https://img.shields.io/badge/VitePress-1.x-646cff?style=flat-square&logo=vite&logoColor=white)](https://vitepress.dev/)
[![Node](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](./LICENSE)
[![Stars](https://img.shields.io/github/stars/xupengboo/xupengboo?style=flat-square&color=yellow)](https://github.com/xupengboo/xupengboo)
[![Last Commit](https://img.shields.io/github/last-commit/xupengboo/xupengboo?style=flat-square&color=green)](https://github.com/xupengboo/xupengboo/commits)

<br/>

[🌐 在线阅读](https://www.xupengboo.top) · [📅 最近更新](#-最近更新) · [🚀 本地运行](#-本地运行)

</div>

---

## 📚 内容导航

<div class="nav-wrapper">

<!-- 软件开发卡片 -->
<div class="nav-card dev-card">
<div class="card-header">
<span class="card-icon">💻</span>
<h3>软件开发</h3>
</div>
<div class="card-body">
<div class="nav-section">
<div class="section-title"><span class="dot"></span>🛠️ 开发工具箱</div>
<ul class="nav-list">
<li>NVM 使用指南</li>
<li>包管理器速查</li>
<li>Node 实用工具</li>
<li>GitHub 图床配置</li>
</ul>
</div>
<div class="nav-section">
<div class="section-title"><span class="dot"></span>🏗️ 架构基础</div>
<ul class="nav-list">
<li>RESTful API 规范</li>
<li>Web Service</li>
<li>CAP 定理</li>
<li>四种编程范式</li>
</ul>
</div>
<div class="nav-section">
<div class="section-title"><span class="dot"></span>📐 算法 & 数据结构</div>
<ul class="nav-list">
<li>时间 / 空间复杂度</li>
</ul>
</div>
<div class="nav-section">
<div class="section-title"><span class="dot"></span>☕ Java 生态</div>
<ul class="nav-list">
<li>Flowable 工作流引擎</li>
</ul>
</div>
<div class="nav-section">
<div class="section-title"><span class="dot"></span>🐍 Python</div>
<ul class="nav-list">
<li>Python 实用工具库</li>
</ul>
</div>
<div class="nav-section">
<div class="section-title"><span class="dot"></span>🌐 前端开发</div>
<ul class="nav-list">
<li>HTML / HTML5 全览</li>
<li>CSS 速查手册</li>
<li>Vue 生态工具速览</li>
</ul>
</div>
</div>
</div>

<!-- 运维与数据卡片 -->
<div class="nav-card ops-card">
<div class="card-header">
<span class="card-icon">🖥️</span>
<h3>运维与数据</h3>
</div>
<div class="card-body">
<div class="nav-section">
<div class="section-title"><span class="dot"></span>🐳 Docker</div>
<ul class="nav-list">
<li>环境安装</li>
<li>Dockerfile 构建</li>
</ul>
</div>
<div class="nav-section">
<div class="section-title"><span class="dot"></span>☸️ Kubernetes</div>
<ul class="nav-list">
<li>Rancher 安装与使用</li>
</ul>
</div>
<div class="nav-section">
<div class="section-title"><span class="dot"></span>🛠️ 服务器 & 中间件</div>
<ul class="nav-list">
<li>Linux 基础</li>
<li>CentOS 运维手册</li>
<li>制作启动U盘</li>
</ul>
</div>
<div class="nav-section">
<div class="section-title"><span class="dot"></span>🗄️ 数据库</div>
<ul class="nav-list">
<li>MySQL 核心速查</li>
</ul>
</div>
<div class="nav-section">
<div class="section-title"><span class="dot"></span>📊 大数据</div>
<ul class="nav-list">
<li>DolphinScheduler 调度工具</li>
</ul>
</div>
</div>
</div>

<!-- AI与云服务卡片 -->
<div class="nav-card ai-card">
<div class="card-header">
<span class="card-icon">🤖</span>
<h3>AI & 云服务</h3>
</div>
<div class="card-body">
<div class="nav-section">
<div class="section-title"><span class="dot"></span>🔍 日志系统</div>
<ul class="nav-list">
<li>ELK Stack 概览与部署</li>
<li>Logstash 数据管道</li>
</ul>
</div>
<div class="nav-section">
<div class="section-title"><span class="dot"></span>☁️ 云服务</div>
<ul class="nav-list">
<li>微信云托管</li>
</ul>
</div>
<div class="nav-section">
<div class="section-title"><span class="dot"></span>🧠 AI 大模型</div>
<div class="ai-badge">
<div class="ai-badge-content">
<span class="pulse-dot"></span>
<span>持续建设中...</span>
</div>
<p class="ai-desc">大模型应用、微调、部署</p>
</div>
</div>
</div>
</div>

</div>

<style>
.nav-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 28px;
  margin: 40px 0;
  padding: 4px;
}

.nav-card {
  position: relative;
  border-radius: 20px;
  padding: 0;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
}

/* 软件开发卡片 - 紫蓝渐变 */
.dev-card {
  background: linear-gradient(145deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.05) 100%);
  border: 1px solid rgba(99, 102, 241, 0.2);
  box-shadow: 
    0 4px 20px -4px rgba(99, 102, 241, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.dev-card:hover {
  transform: translateY(-8px) scale(1.01);
  box-shadow: 
    0 20px 40px -12px rgba(99, 102, 241, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  border-color: rgba(99, 102, 241, 0.4);
}

.dev-card .card-header {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
}

.dev-card .dot { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
.dev-card .nav-list li:hover { color: #6366f1; }

/* 运维与数据卡片 - 青绿渐变 */
.ops-card {
  background: linear-gradient(145deg, rgba(20, 184, 166, 0.08) 0%, rgba(6, 182, 212, 0.05) 100%);
  border: 1px solid rgba(20, 184, 166, 0.2);
  box-shadow: 
    0 4px 20px -4px rgba(20, 184, 166, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.ops-card:hover {
  transform: translateY(-8px) scale(1.01);
  box-shadow: 
    0 20px 40px -12px rgba(20, 184, 166, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  border-color: rgba(20, 184, 166, 0.4);
}

.ops-card .card-header {
  background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%);
}

.ops-card .dot { background: linear-gradient(135deg, #14b8a6, #06b6d4); }
.ops-card .nav-list li:hover { color: #0d9488; }

/* AI卡片 - 橙粉渐变 */
.ai-card {
  background: linear-gradient(145deg, rgba(249, 115, 22, 0.08) 0%, rgba(236, 72, 153, 0.05) 100%);
  border: 1px solid rgba(249, 115, 22, 0.2);
  box-shadow: 
    0 4px 20px -4px rgba(249, 115, 22, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.ai-card:hover {
  transform: translateY(-8px) scale(1.01);
  box-shadow: 
    0 20px 40px -12px rgba(249, 115, 22, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  border-color: rgba(249, 115, 22, 0.4);
}

.ai-card .card-header {
  background: linear-gradient(135deg, #f97316 0%, #ec4899 100%);
}

.ai-card .dot { background: linear-gradient(135deg, #f97316, #ec4899); }
.ai-card .nav-list li:hover { color: #ea580c; }

/* 卡片头部 */
.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  margin: 0;
}

.card-icon {
  font-size: 1.8rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.card-header h3 {
  margin: 0;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

/* 卡片内容 */
.card-body {
  padding: 24px;
}

.nav-section {
  margin-bottom: 20px;
}

.nav-section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  color: #374151;
  font-weight: 600;
  font-size: 0.95rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 6px;
}

.nav-list li {
  padding: 8px 12px;
  margin-left: 16px;
  color: #6b7280;
  font-size: 0.88rem;
  border-radius: 8px;
  transition: all 0.25s ease;
  cursor: default;
  position: relative;
}

.nav-list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #d1d5db;
  transition: all 0.25s ease;
}

.nav-list li:hover {
  background: rgba(0, 0, 0, 0.03);
  transform: translateX(4px);
}

.nav-list li:hover::before {
  width: 6px;
  height: 6px;
}

/* AI 建设中徽章 */
.ai-badge {
  margin-left: 16px;
  margin-top: 8px;
  padding: 14px 16px;
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(236, 72, 153, 0.08) 100%);
  border: 1px dashed rgba(249, 115, 22, 0.3);
  border-radius: 12px;
}

.ai-badge-content {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ea580c;
  font-weight: 600;
  font-size: 0.92rem;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f97316;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.ai-desc {
  margin: 8px 0 0 0;
  font-size: 0.82rem;
  color: #9ca3af;
}

/* 响应式 */
@media (max-width: 768px) {
  .nav-wrapper {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .card-body {
    padding: 20px;
  }
}
</style>

---

## 🗂️ 项目结构

```
xupengboo/
├── 📁 docs/
│   ├── ⚙️  .vitepress/config.ts     # 导航 & 侧边栏配置
│   ├── 💻 dev/                      # 软件开发
│   │   ├── tools/                   # 🛠️ 开发工具箱
│   │   ├── architecture/            # 🏗️ 架构基础
│   │   ├── algorithm/               # 📐 算法 & 数据结构
│   │   ├── java/                    # ☕ Java 生态
│   │   ├── python/                  # 🐍 Python
│   │   └── frontend/                # 🌐 前端开发
│   ├── 🖥️  ops/                     # 运维与数据
│   │   ├── docker/                  # 🐳 Docker
│   │   ├── k8s/                     # ☸️ Kubernetes
│   │   ├── server/                  # 🛠️ 服务器 & 中间件
│   │   ├── database/                # 🗄️ 数据库
│   │   ├── bigdata/                 # 📊 大数据
│   │   ├── elk/                     # 🔍 日志系统
│   │   └── cloud/                   # ☁️ 云服务
│   └── 🤖 ai/                       # AI 大模型
└── 📄 package.json
```

---

## 🚀 本地运行

```bash
# 克隆项目
git clone https://github.com/xupengboo/xupengboo.git && cd xupengboo

# 安装依赖
npm install

# 启动开发服务器 → http://localhost:5173
npm run docs:dev
```

| 命令 | 说明 |
|---|---|
| `npm run docs:dev` | 启动本地开发服务器，支持热更新 |
| `npm run docs:build` | 构建生产版本，输出到 `.vitepress/dist` |
| `npm run docs:preview` | 本地预览构建产物 |

---

## 📅 最近更新

| 文档 | 分类 | 说明 |
|---|---|---|
| CentOS 运维手册 | 🖥️ 运维 | 合并 VMware + 网络 + 磁盘挂载，补充 fstab 永久挂载步骤 |
| ELK Stack 概览与部署 | 🔍 日志 | 合并 elastic-stack + filebeat + kibana 三篇 |
| Logstash 数据管道 | 🔍 日志 | 修复 `//` 注释语法错误，补充多管道与 DLQ 配置 |
| MySQL 核心速查 | 🗄️ 数据库 | 合并索引 + 分区 + 基础三篇，修复 B树描述错误 |
| Dockerfile 构建 | 🐳 Docker | 修复废弃的 MAINTAINER，补充层缓存优化技巧 |
| Rancher 安装与使用 | ☸️ K8s | 修复 shm-size 过小、kubectl 版本写死等问题 |

---

## ✍️ 写作规范

- 📌 代码块**必须注明语言**（`bash` `java` `yaml` `nginx` 等）
- 🔒 密码 / Token 一律用 `your_password` 占位，**不提交真实凭证**
- 🎨 只使用 VitePress 支持的容器类型：`tip` `warning` `danger` `info` `details`
- 🖼️ 图片通过 **PicGo + Typora** 配置上传到本项目中 `public/images` 下，也可以外链引用。

---

<div align="center">

如果这个仓库对你有帮助，欢迎点个 ⭐ **Star** 支持一下！

</div>
