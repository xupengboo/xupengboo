---
title: Nvm 使用
order: 1
---

# NVM

NVM（Node Version Manager）是 Node.js 的版本管理工具，可以在同一台机器上安装并随时切换多个 Node.js 版本，非常适合同时维护多个项目的开发场景。

## 1. 安装

:::warning 安装前提
安装 NVM **之前**，请先卸载系统中已有的 Node.js，否则可能产生路径冲突。
:::

**Windows**

前往 [nvm-windows Releases](https://github.com/coreybutler/nvm-windows/releases) 下载最新的 `.exe` 安装包，按向导安装即可。

**macOS / Linux**

参考 [官方文档](https://github.com/nvm-sh/nvm/blob/master/README.md)，执行官方安装脚本：

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

**验证安装**

打开新的终端（CMD / PowerShell / bash），执行：

```bash
nvm version
```

输出版本号即表示安装成功。

---

## 2. 配置镜像源

nvm-windows 安装目录下的 `settings.txt` 是配置文件，示例见下：

```txt
root: D:\env\nvm\nvm
path: D:\env\nvm\nodejs
node_mirror: https://npmmirror.com/mirrors/node/
npm_mirror: https://npmmirror.com/mirrors/npm/
```

| 配置项 | 说明 |
|---|---|
| `root` | nvm 自身的安装目录 |
| `path` | Node.js 的安装路径（切换版本时会修改此处的软链接） |
| `node_mirror` | Node.js 下载镜像，使用 npmmirror（淘宝镜像） |
| `npm_mirror` | npm 下载镜像 |

:::tip
也可以通过命令行方式设置镜像，效果一致：
```bash
nvm node_mirror https://npmmirror.com/mirrors/node/
nvm npm_mirror  https://npmmirror.com/mirrors/npm/
```
:::

---

## 3. 常用命令

### 版本管理

```bash
# 查看所有可安装的远程版本
nvm list available   # Windows 专用
nvm ls-remote        # macOS / Linux 专用

# 安装指定版本
nvm install 20.11.0

# 安装最新 LTS 版本
nvm install --lts

# 卸载指定版本
nvm uninstall 20.11.0

# 切换到指定版本（当前终端生效）
nvm use 20.11.0

# 查看当前使用的版本
nvm current

# 查看本地已安装的所有版本
nvm list
```

### 别名管理（macOS / Linux 专用）

:::warning
以下命令仅适用于 **macOS / Linux** 版本的 nvm，nvm-windows 不支持。
:::

```bash
# 设置默认版本（新开终端时自动使用）
nvm alias default 20.11.0

# 创建自定义别名
nvm alias <别名> <版本号>

# 删除别名
nvm unalias <别名>
```

### 其他命令

```bash
# 显示 nvm 自身版本
nvm version

# 查看当前架构（32位 / 64位）
nvm arch

# 启用 / 禁用 nvm 版本管理（Windows 专用）
nvm on
nvm off

# 显示或设置 nvm 根目录
nvm root [path]
```
