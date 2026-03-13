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

<table>
<tr>
<td width="33%" valign="top">

### 💻 软件开发

**🛠️ 开发工具箱**
- NVM 使用指南
- 包管理器速查
- Node 实用工具
- GitHub 图床配置

**🏗️ 架构基础**
- RESTful API 规范
- Web Service
- CAP 定理
- 四种编程范式

**📐 算法 & 数据结构**
- 时间 / 空间复杂度

**☕ Java 生态**
- Flowable 工作流引擎

**🐍 Python**
- Python 实用工具库

**🌐 前端开发**
- HTML / HTML5 全览
- CSS 速查手册
- Vue 生态工具速览

</td>
<td width="33%" valign="top">

### 🖥️ 运维与数据

**🐳 Docker**
- 环境安装
- Dockerfile 构建

**☸️ Kubernetes**
- Rancher 安装与使用

**🛠️ 服务器 & 中间件**
- Linux 基础
- CentOS 运维手册
- 制作启动U盘

**🗄️ 数据库**
- MySQL 核心速查

**📊 大数据**
- DolphinScheduler 调度工具

</td>
<td width="33%" valign="top">

### 🖥️ 运维与数据（续）

**🔍 日志系统**
- ELK Stack 概览与部署
- Logstash 数据管道

**☁️ 云服务**
- 微信云托管

<br/>

### 🤖 AI 大模型

> 持续建设中 ...

</td>
</tr>
</table>

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
