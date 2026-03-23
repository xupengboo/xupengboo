---
title: Node.js 常用语法与工具
outline: deep
---

# Node.js 常用语法与工具

## 一、ES6 常用数据结构

### Set — 不重复的集合

Set 是 ES6 新增的数据结构，类似数组，但**成员值唯一，自动去重**。

```js
const set = new Set([1, 2, 2, 3, 3])
console.log([...set]) // [1, 2, 3]
```

| 方法 | 说明 |
|---|---|
| `set.add(value)` | 添加一个值 |
| `set.has(value)` | 判断值是否存在，返回 boolean |
| `set.delete(value)` | 删除指定值 |
| `set.size` | 获取成员数量 |
| `set.clear()` | 清空所有成员 |

:::tip 典型应用场景
数组去重、快速判断某个值是否已存在（比 `Array.includes()` 性能更好）。
:::

---

## 二、常用 npm 工具包

### dotenv — 环境变量管理

**安装：**

```bash
npm install dotenv
```

**作用：** 读取项目根目录下的 `.env` 文件，将配置项注入到 `process.env`，避免把敏感信息（密码、密钥等）硬编码到代码里。

**使用：**

```bash
# .env 文件
DB_HOST=localhost
DB_PORT=5432
DB_PASSWORD=your_password
```

```js
// 在入口文件顶部引入，越早越好
require('dotenv').config()

console.log(process.env.DB_HOST) // localhost
```

:::warning 注意
`.env` 文件包含敏感信息，务必将其加入 `.gitignore`，不要提交到代码仓库。
:::

---

### commander — 命令行工具开发

**安装：**

```bash
npm install commander
```

**作用：** Node.js 生态中最主流的 CLI 开发库，省去手动解析 `process.argv` 的繁琐工作，自动处理参数识别、帮助文档生成、版本管理等通用逻辑，让你专注于业务本身。

**基础示例：**

```js
const { Command } = require('commander')
const program = new Command()

program
  .name('mytool')
  .description('我的命令行工具')
  .version('1.0.0')

program
  .command('serve')
  .description('启动服务')
  .option('-p, --port <port>', '指定端口', '3000')
  .action((options) => {
    console.log(`服务启动在端口：${options.port}`)
  })

program.parse()
```

```bash
# 执行效果
$ mytool serve --port 8080
服务启动在端口：8080

$ mytool --help
Usage: mytool [options] [command]
...
```

| 功能 | 原生写法 | commander |
|---|---|---|
| 读取参数 | 手动解析 `process.argv` | 自动识别 `-p`、`--port` 等 |
| 帮助文档 | 手动 `console.log` | 自动生成 `--help` |
| 版本号 | 手动判断 | 自动处理 `--version` |
| 子命令 | 手动 `if/else` | `program.command()` 声明式定义 |
