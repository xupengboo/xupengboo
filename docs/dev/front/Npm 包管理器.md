---
title: Npm 包管理器
---

# Npm 包管理器

包管理器是前端开发的基础工具，负责安装、更新、删除项目依赖，并通过 `package.json` 管理依赖版本。

## 速查对比

| | npm | yarn | pnpm | npx |
|---|---|---|---|---|
| **定位** | Node.js 自带 | npm 替代方案 | 高性能包管理器 | 命令执行工具 |
| **安装速度** | 一般 | 快 | 最快 | — |
| **磁盘占用** | 高（重复存储） | 高 | 极低（硬链接共享） | — |
| **锁文件** | `package-lock.json` | `yarn.lock` | `pnpm-lock.yaml` | — |
| **Monorepo** | 支持（较弱） | Workspaces | Workspaces（更优） | — |
| **推荐场景** | 通用 / 兼容性优先 | 老项目维护 | 新项目首选 | 临时运行工具包 |

:::tip 如何选择
- **新项目**：优先用 `pnpm`，速度快、省磁盘
- **老项目**：保持原有的包管理器不变，避免锁文件冲突
- **临时执行工具**：用 `npx`，无需全局安装
  :::

---

## npm

**官方文档**：https://docs.npmjs.com/

Node.js 自带的包管理器，安装 Node.js 时自动安装，是整个 JavaScript 生态的基础。

### 常用命令

```bash
# 初始化项目
npm init -y

# 安装依赖
npm install axios          # 安装到 dependencies
npm install vite -D        # 安装到 devDependencies
npm install -g http-server # 全局安装

# 卸载依赖
npm uninstall axios

# 更新依赖
npm update

# 运行脚本
npm run dev
npm run build

# 查看已安装的包
npm list
npm list -g  # 全局安装的包

# 查看包信息
npm info axios
```

### 配置镜像源

```bash
# 查看当前镜像源
npm config get registry

# 切换到淘宝镜像（推荐，解决国内下载慢）
npm config set registry https://registry.npmmirror.com

# 恢复官方源（发布包时需要切回）
npm config set registry https://registry.npmjs.org
```

### 配置代理（解决超时）

本地开启代理工具（如 Clash，默认端口 7890）后执行：

```bash
npm config set proxy http://127.0.0.1:7890
npm config set https-proxy https://127.0.0.1:7890
```

用完后删除代理：

```bash
npm config delete proxy
npm config delete https-proxy
```

---

## yarn

**官方文档**：https://yarnpkg.com/

Facebook 出品的包管理器，诞生之初是为了解决早期 npm 速度慢、锁文件不稳定的问题，目前仍在大量老项目中使用。

```bash
# 安装 yarn
npm install -g yarn

# 查看版本
yarn -v
```

### 常用命令

```bash
# 初始化项目
yarn init -y

# 安装所有依赖
yarn install

# 安装指定包
yarn add axios             # 安装到 dependencies
yarn add vite -D           # 安装到 devDependencies
yarn global add http-server # 全局安装

# 卸载包
yarn remove axios

# 运行脚本
yarn dev
yarn build

# 更新依赖
yarn upgrade
```

### 配置镜像源

```bash
# 切换到淘宝镜像
yarn config set registry https://registry.npmmirror.com

# 恢复官方源
yarn config set registry https://registry.yarnpkg.com
```

### 配置代理

```bash
yarn config set proxy http://127.0.0.1:7890
yarn config set https-proxy https://127.0.0.1:7890

# 删除代理
yarn config delete proxy
yarn config delete https-proxy
```

---

## pnpm

**官方文档**：https://pnpm.io/zh/

全称 **performant npm**，通过**硬链接**将依赖存储在全局仓库并在项目间共享，彻底解决了 npm / yarn 重复下载、磁盘浪费的问题，是目前新项目的首选包管理器。

```bash
# 安装 pnpm
npm install -g pnpm

# 查看版本
pnpm -v
```

### 常用命令

pnpm 命令与 npm 基本一致，可以无缝切换：

```bash
# 安装所有依赖
pnpm install

# 安装指定包
pnpm add axios             # 安装到 dependencies
pnpm add vite -D           # 安装到 devDependencies
pnpm add -g http-server    # 全局安装

# 卸载包
pnpm remove axios

# 运行脚本
pnpm dev
pnpm build

# 更新依赖
pnpm update
```

### 配置镜像源

```bash
pnpm config set registry https://registry.npmmirror.com
```

### 为什么比 npm 快？

```
npm / yarn 的依赖结构：
project-a/node_modules/lodash  ← 完整复制
project-b/node_modules/lodash  ← 完整复制（重复占用磁盘）

pnpm 的依赖结构：
~/.pnpm-store/lodash           ← 只存一份
project-a/node_modules/lodash  ← 硬链接（几乎不占额外空间）
project-b/node_modules/lodash  ← 硬链接（几乎不占额外空间）
```

:::tip
多个项目共用同一份依赖文件，100 个项目安装同一个版本的 lodash，磁盘里只存一份。
:::

---

## npx

**官方文档**：https://docs.npmjs.com/cli/v10/commands/npx

npm 5.2+ 自带的**命令执行工具**，可以直接运行 npm 包中的命令，无需提前全局安装。执行完毕后不会在本地留下任何文件。

### 常用场景

**临时运行工具，不全局安装**

```bash
# 不需要 npm install -g create-vue，直接运行
npx create-vue my-project

# 创建 React 项目
npx create-react-app my-app

# 运行指定版本的工具
npx vite@4.0.0
```

**执行本地 node_modules 中的命令**

```bash
# 等同于 ./node_modules/.bin/vite
npx vite

# 等同于 ./node_modules/.bin/eslint
npx eslint src/
```

**运行远程脚本（谨慎使用）**

```bash
# 直接运行 GitHub 上的脚本
npx github:user/repo
```

:::warning
运行来源不明的远程脚本存在安全风险，使用前确认来源可信。
:::

:::tip npx vs npm 全局安装
- `npm install -g xxx`：长期使用的工具（如 nrm、http-server）
- `npx xxx`：偶尔使用或只需运行一次的工具（如脚手架）
  :::
