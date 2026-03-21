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

<div class="content-grid">

<div class="content-card">

### 💻 软件开发

<div class="category-section">
<strong>🛠️ 开发工具箱</strong>
<ul>
<li>NVM 使用指南</li>
<li>包管理器速查</li>
<li>Node 实用工具</li>
<li>GitHub 图床配置</li>
</ul>
</div>

<div class="category-section">
<strong>🏗️ 架构基础</strong>
<ul>
<li>RESTful API 规范</li>
<li>Web Service</li>
<li>CAP 定理</li>
<li>四种编程范式</li>
</ul>
</div>

<div class="category-section">
<strong>📐 算法 & 数据结构</strong>
<ul>
<li>时间 / 空间复杂度</li>
</ul>
</div>

<div class="category-section">
<strong>☕ Java 生态</strong>
<ul>
<li>Flowable 工作流引擎</li>
</ul>
</div>

<div class="category-section">
<strong>🐍 Python</strong>
<ul>
<li>Python 实用工具库</li>
</ul>
</div>

<div class="category-section">
<strong>🌐 前端开发</strong>
<ul>
<li>HTML / HTML5 全览</li>
<li>CSS 速查手册</li>
<li>Vue 生态工具速览</li>
</ul>
</div>

</div>

<div class="content-card">

### 🖥️ 运维与数据

<div class="category-section">
<strong>🐳 Docker</strong>
<ul>
<li>环境安装</li>
<li>Dockerfile 构建</li>
</ul>
</div>

<div class="category-section">
<strong>☸️ Kubernetes</strong>
<ul>
<li>Rancher 安装与使用</li>
</ul>
</div>

<div class="category-section">
<strong>🛠️ 服务器 & 中间件</strong>
<ul>
<li>Linux 基础</li>
<li>CentOS 运维手册</li>
<li>制作启动U盘</li>
</ul>
</div>

<div class="category-section">
<strong>🗄️ 数据库</strong>
<ul>
<li>MySQL 核心速查</li>
</ul>
</div>

<div class="category-section">
<strong>📊 大数据</strong>
<ul>
<li>DolphinScheduler 调度工具</li>
</ul>
</div>

</div>

<div class="content-card">

### 🔍 日志系统

<div class="category-section">
<strong>ELK Stack</strong>
<ul>
<li>ELK Stack 概览与部署</li>
<li>Logstash 数据管道</li>
</ul>
</div>

<div class="category-section">
<strong>☁️ 云服务</strong>
<ul>
<li>微信云托管</li>
</ul>
</div>

<div class="category-section">
<strong>🤖 AI 大模型</strong>
<div class="ai-section">
<p>🚧 持续建设中 ...</p>
<p class="ai-subtext">大模型应用、微调、部署等</p>
</div>
</div>

</div>

</div>

<style>
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin: 32px 0;
}

.content-card {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  height: 100%;
}

.content-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-color: #cbd5e1;
}

.content-card h3 {
  margin-top: 0;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #3b82f6;
  color: #1e293b;
  font-size: 1.25rem;
}

.category-section {
  margin-bottom: 20px;
}

.category-section:last-child {
  margin-bottom: 0;
}

.category-section strong {
  display: block;
  margin-bottom: 8px;
  color: #475569;
  font-size: 0.95rem;
}

.category-section ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.category-section li {
  padding: 6px 0;
  padding-left: 20px;
  position: relative;
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.4;
}

.category-section li:before {
  content: "•";
  position: absolute;
  left: 0;
  color: #3b82f6;
  font-weight: bold;
}

.category-section li:hover {
  color: #1e293b;
  transform: translateX(2px);
  transition: all 0.2s ease;
}

.ai-section {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 16px;
  margin-top: 8px;
}

.ai-section p {
  margin: 0;
  color: #0369a1;
  font-weight: 500;
}

.ai-subtext {
  font-size: 0.85rem;
  color: #0c4a6e;
  margin-top: 4px !important;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .content-card {
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
