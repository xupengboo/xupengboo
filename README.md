# 📚 xupengboo

> 记录和分享学习过程、知识和经验的地方。在这里，我汇总了编程语言、技术问题解决方案和使用经验等等，旨在帮助自己和他人不断进步。

[![GitHub stars](https://img.shields.io/github/stars/xupengboo/xupengboo?style=flat-square)](https://github.com/xupengboo/xupengboo/stargazers)
[![GitHub license](https://img.shields.io/github/license/xupengboo/xupengboo?style=flat-square)](https://github.com/xupengboo/xupengboo/blob/main/LICENSE)
[![Auto Deploy](https://img.shields.io/github/actions/workflow/status/xupengboo/xupengboo/deploy.yml?label=deploy&style=flat-square)](https://github.com/xupengboo/xupengboo/actions)

---

## 🌐 访问地址

| 平台 | 地址 |
|------|------|
| GitHub | [github.com/xupengboo/xupengboo](https://github.com/xupengboo/xupengboo) |
| Gitee  | [gitee.com/xupengboo/xupengboo](https://gitee.com/xupengboo/xupengboo) |

---

## 🛠️ 技术栈

- **文档框架**：[VitePress](https://vitepress.dev/) — 基于 Vue 3 的静态站点生成器
- **部署方式**：Docker + Nginx
- **CI/CD**：GitHub Actions 自动构建、部署，并同步至 Gitee

---

## 🚀 自动化流程

每次向 `main` 分支提交代码后，会自动触发以下流程：

```
push to main
     ↓
GitHub Actions
     ↓
① SSH 连接服务器，拉取代码并构建 Docker 镜像
     ↓
② Docker 启动新容器（Nginx 对外提供访问）
     ↓
③ 调用 Gitee API，触发仓库镜像同步
```

---

## 📁 项目结构

```
xupengboo/
├── .github/
│   └── workflows/       # GitHub Actions 工作流配置
├── docs/                # VitePress 文档内容
├── Dockerfile           # Docker 构建文件
├── nginx.conf           # Nginx 配置
├── package.json         # 项目依赖
└── .gitignore
```

---

## 🏃 本地运行

```bash
# 安装依赖
npm install

# 启动本地开发服务
npm run docs:dev

# 构建静态文件
npm run docs:build
```

---

## 📄 License

本项目基于 [Apache-2.0](./LICENSE) 协议开源。