---
title: Node 实用工具
---

# Node 实用工具

收录基于 Node.js 的常用命令行工具与辅助工具，与框架无关，适用于任何前端项目。

## 工具速查表

| 工具 | 用途 | 官网 |
|---|---|---|
| [http-server](#http-server) | 本地静态文件服务器 | https://github.com/http-party/http-server |
| [nrm](#nrm) | npm 镜像源管理 | https://github.com/Pana/nrm |
| [npm-check-updates](#ncu) | 依赖版本升级检测 | https://github.com/raineorshine/npm-check-updates |
| [cross-env](#cross-env) | 跨平台环境变量设置 | https://github.com/kentcdodds/cross-env |
| [rimraf](#rimraf) | 跨平台删除文件 / 目录 | https://github.com/isaacs/rimraf |
| [concurrently](#concurrently) | 并行运行多个命令 | https://github.com/open-cli-tools/concurrently |

---

## http-server

**官方文档**：https://github.com/http-party/http-server

基于 Node.js 的**零配置本地静态文件服务器**，一条命令即可将任意目录托管为可访问的 HTTP 服务，常用于本地预览构建产物（`dist` 目录）或快速共享静态页面。

```bash
npm install -g http-server
```

**常用参数**

```bash
# 在当前目录启动，默认端口 8080
http-server

# 指定目录（常用：预览构建产物）
http-server ./dist

# 指定端口
http-server -p 3000

# 开启 CORS（跨域请求）
http-server --cors

# 开启 HTTPS（需提供证书）
http-server --ssl --cert cert.pem --key key.pem
```

:::tip 最常见的使用场景
执行 `npm run build` 后，用 `http-server dist` 在本地验证生产包是否正常，比直接部署到服务器再排查问题效率高得多。
:::

:::warning
`http-server` 仅适合**本地开发和测试**，不要用于生产环境部署。
:::

---

## nrm

**官方文档**：https://github.com/Pana/nrm

**npm 镜像源管理工具**，可以快速切换 npm 的下载源，解决国内下载慢的问题，免去每次手动修改 `.npmrc` 的麻烦。

```bash
npm install -g nrm
```

**常用命令**

```bash
# 查看所有可用镜像源（带 * 的为当前使用的源）
nrm ls

# 切换到淘宝镜像
nrm use taobao

# 切换回官方源
nrm use npm

# 测试各镜像源的响应速度
nrm test

# 添加自定义私有源（如公司内网镜像）
nrm add <名称> <地址>
```

:::tip
国内开发日常用 `taobao` 源，发布 npm 包前切回 `npm` 官方源，避免发布失败。
:::

---

## ncu

**官方文档**：https://github.com/raineorshine/npm-check-updates

**依赖版本升级检测工具**，扫描 `package.json` 并列出所有可升级的依赖，支持一键更新到最新版本。

```bash
npm install -g npm-check-updates
```

**常用命令**

```bash
# 检测所有可升级的依赖（只查看，不修改）
ncu

# 将 package.json 中的版本号全部更新到最新
ncu -u

# 只升级指定包
ncu -u axios vue

# 只升级补丁版本（不升级大版本，较安全）
ncu --target patch
```

:::warning
`ncu -u` 只修改 `package.json`，之后还需要手动执行 `npm install` 才能实际安装新版本。大版本升级（如 `vue 2 → 3`）可能有破坏性变更，建议逐个确认。
:::

---

## cross-env

**官方文档**：https://github.com/kentcdodds/cross-env

**跨平台环境变量设置工具**。Windows 的 `set`、Mac/Linux 的 `export` 语法不同，直接写在 `package.json` 的 `scripts` 里会导致跨平台失败，`cross-env` 统一解决这个问题。

```bash
npm install -D cross-env
```

```json
// package.json
{
  "scripts": {
    // ❌ 只在 Mac/Linux 有效
    "build:prod": "NODE_ENV=production vite build",

    // ✅ 跨平台均可用
    "build:prod": "cross-env NODE_ENV=production vite build",
    "build:test": "cross-env NODE_ENV=test API_URL=https://test-api.com vite build"
  }
}
```

---

## rimraf

**官方文档**：https://github.com/isaacs/rimraf

**跨平台删除工具**，相当于 Linux 的 `rm -rf`。Windows 不支持 `rm -rf`，用 `rimraf` 可以在所有平台上安全地删除文件和目录。

```bash
npm install -D rimraf
```

```json
// package.json — 常见用法：构建前清空 dist 目录
{
  "scripts": {
    "clean": "rimraf dist",
    "build": "rimraf dist && vite build"
  }
}
```

:::tip
Node.js 14.14+ 原生支持 `fs.rm`，现代项目也可以用 `node --experimental-vm-modules` 替代，但 `rimraf` 兼容性更好，老项目用它更稳妥。
:::

---

## concurrently

**官方文档**：https://github.com/open-cli-tools/concurrently

**并行运行多个命令的工具**。开发时常需要同时启动前端 dev server 和后端 mock server，`concurrently` 可以在一个终端里同时运行，并用不同颜色区分各命令的输出。

```bash
npm install -D concurrently
```

```json
// package.json
{
  "scripts": {
    // 同时启动前端和 mock 服务
    "dev": "concurrently \"vite\" \"node mock/server.js\"",

    // 加上 --names 区分输出来源，--kill-others 任一进程退出时一并终止其他进程
    "dev": "concurrently --names \"VITE,MOCK\" --kill-others \"vite\" \"node mock/server.js\""
  }
}
```

输出效果：
```
[VITE]  VITE v5.0.0  ready in 300ms
[MOCK]  Mock server running at http://localhost:3001
```
