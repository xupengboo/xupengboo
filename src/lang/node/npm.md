---
title: Npm 包管理器
order: 1
---

## npm (Node Package Manager)

npm是 Node.js 的包管理工具，随 Node.js 一起安装（安装 Node.js 时会自动安装 npm）。

功能包括：
- 📦 管理第三方模块：安装、更新、删除代码依赖（如 Express、React 等）。
- 📂 管理项目依赖：通过 package.json 记录项目所需的包及其版本。
- 🛠️ 执行脚本：通过 npm run 运行自定义命令（如启动服务、打包代码等）。

:::tip
**Node.js 是 JavaScript 的运行时环境，而 npm 是 Node.js 的包管理器**，两者协同工作，共同支持 JavaScript 生态的开发。
:::

## 配置 npm 和 yarn 代理，解决超时问题

本地启动 `clash` ，之后根据其端口配置即可：（默认：7890）

```bash
yarn config set proxy http://127.0.0.1:7890
yarn config set https-proxy https://127.0.0.1:7890

npm config set proxy http://127.0.0.1:7890
npm config set https-proxy https://127.0.0.1:7890
```

删除代理：
```bash
npm config delete proxy
npm config delete https-proxy
```

