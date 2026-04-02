
# 核心文件目录

## 1. package.json

```json
================================================================================
OpenClaw package.json 注释版
说明：此文件仅供学习参考，JSON 标准不支持注释，无法直接用于 npm/pnpm
================================================================================

{
  // ============================================================================
  // 基础信息
  // ============================================================================

  "name": "openclaw",                    // 包名，npm 发布时的唯一标识符
  "version": "2026.3.14",                // 版本号，使用日期版本格式 (YYYY.M.D)
  "description": "Multi-channel AI gateway with extensible messaging integrations",  // 包描述，显示在 npm 搜索中
  "keywords": [],                        // 关键词数组，用于 npm 搜索优化（当前为空）
  "homepage": "https://github.com/openclaw/openclaw#readme",  // 项目主页 URL
  "license": "MIT",                      // 开源许可证类型
  "author": "",                          // 作者信息（当前为空）

  // ============================================================================
  // 问题反馈 & 代码仓库
  // ============================================================================

  "bugs": {
    "url": "https://github.com/openclaw/openclaw/issues"  // Issue 反馈地址
  },
  "repository": {
    "type": "git",                       // 仓库类型
    "url": "git+https://github.com/openclaw/openclaw.git"  // Git 仓库地址
  },

  // ============================================================================
  // CLI 命令入口
  // ============================================================================

  "bin": {
    "openclaw": "openclaw.mjs"           // 安装后暴露的全局命令，执行 openclaw.mjs
  },

  // ============================================================================
  // 目录约定
  // ============================================================================

  "directories": {
    "doc": "docs",                       // 文档目录
    "test": "test"                       // 测试目录
  },

  // ============================================================================
  // 发布文件白名单
  // ============================================================================

  "files": [
    "CHANGELOG.md",                      // 变更日志
    "LICENSE",                           // 许可证
    "openclaw.mjs",                      // CLI 入口
    "README-header.png",                 // README 头图
    "README.md",                         // 说明文档
    "assets/",                           // 静态资源
    "dist/",                             // 构建产物
    "docs/",                             // 文档
    "!docs/.generated/**",               // 排除：自动生成的文档
    "!docs/.i18n/zh-CN.tm.jsonl",        // 排除：中文翻译记忆库
    "extensions/",                       // 扩展插件
    "skills/"                            // 技能配置
  ],

  // ============================================================================
  // 模块系统
  // ============================================================================

  "type": "module",                      // 使用 ESM 模块系统 (import/export)
  "main": "dist/index.js",               // 主入口文件（CommonJS 兼容导入时使用）

  // ============================================================================
  // 模块导出映射
  // 支持 import openclaw from 'openclaw' 和子路径导入
  // ============================================================================

  "exports": {
    ".": "./dist/index.js",              // 默认导出：import openclaw from 'openclaw'

    // plugin-sdk 子路径导出（每个都有类型定义和实现）
    "./plugin-sdk": {                    // 插件 SDK 主入口
      "types": "./dist/plugin-sdk/index.d.ts",
      "default": "./dist/plugin-sdk/index.js"
    },
    "./plugin-sdk/core": { ... },        // 核心功能
    "./plugin-sdk/runtime": { ... },     // 运行时
    "./plugin-sdk/telegram": { ... },    // Telegram 通道支持
    "./plugin-sdk/discord": { ... },     // Discord 通道支持
    "./plugin-sdk/slack": { ... },       // Slack 通道支持
    // ... 更多子路径导出（省略，格式相同）

    "./cli-entry": "./openclaw.mjs"      // CLI 入口点
  },

  // ============================================================================
  // 脚本命令 (pnpm run <script>)
  // ============================================================================

  "scripts": {
    // ----- 构建相关 -----
    "build": "...",                      // 完整构建流程
    "build:docker": "...",               // Docker 环境构建
    "build:plugin-sdk:dts": "...",       // 生成插件 SDK 类型声明

    // ----- 开发运行 -----
    "dev": "node scripts/run-node.mjs",  // 开发模式运行
    "start": "node scripts/run-node.mjs",// 启动 CLI
    "openclaw": "node scripts/run-node.mjs",  // 运行 openclaw 命令

    // ----- 代码检查 -----
    "lint": "oxlint --type-aware",       // Oxlint 代码检查
    "lint:fix": "...",                   // 自动修复 lint 问题
    "check": "...",                      // 完整检查（格式+类型+lint等）

    // ----- 格式化 -----
    "format": "oxfmt --write",           // 格式化代码
    "format:check": "oxfmt --check",     // 检查格式是否符合规范

    // ----- 测试 -----
    "test": "node scripts/test-parallel.mjs",  // 运行测试
    "test:coverage": "...",              // 测试覆盖率
    "test:e2e": "...",                   // 端到端测试
    "test:live": "...",                  // 真实环境测试

    // ----- Android -----
    "android:assemble": "...",           // Android Debug 构建
    "android:install": "...",            // 安装 Android Debug 包
    "android:test": "...",               // Android 单元测试

    // ----- iOS -----
    "ios:build": "...",                  // iOS 构建
    "ios:run": "...",                    // iOS 运行
    "ios:open": "...",                   // 打开 Xcode 项目

    // ----- macOS -----
    "mac:package": "...",                // 打包 macOS 应用
    "mac:open": "open dist/OpenClaw.app",// 打开 macOS 应用
    "mac:restart": "...",                // 重启 macOS Gateway

    // ----- 文档 -----
    "docs:dev": "cd docs && mint dev",   // 本地文档开发服务器
    "docs:check-links": "...",           // 检查文档链接

    // ----- 其他 -----
    "prepare": "...",                    // npm install 后自动执行（设置 git hooks）
    "prepack": "pnpm build && pnpm ui:build"  // npm pack 前执行
  },

  // ============================================================================
  // 运行时依赖（生产环境必需）
  // ============================================================================

  "dependencies": {
    // AI/LLM 相关
    "@mariozechner/pi-agent-core": "0.58.0",     // Pi Agent 核心
    "@mariozechner/pi-ai": "0.60.0",             // Pi AI 功能
    "@mariozechner/pi-coding-agent": "0.60.0",   // 编码 Agent
    "@modelcontextprotocol/sdk": "1.27.1",       // MCP SDK

    // 消息通道
    "grammy": "^1.41.1",                         // Telegram Bot 框架
    "@discordjs/voice": "^0.19.2",               // Discord 语音
    "@slack/bolt": "^4.6.0",                     // Slack Bot
    "@line/bot-sdk": "^10.6.0",                  // LINE Bot
    "@larksuiteoapi/node-sdk": "^1.59.0",        // 飞书 SDK
    "@whiskeysockets/baileys": "7.0.0-rc.9",     // WhatsApp Web

    // AWS/云服务
    "@aws-sdk/client-bedrock": "^3.1011.0",      // AWS Bedrock

    // 数据库/存储
    "@lancedb/lancedb": "^0.27.0",               // LanceDB 向量数据库

    // Web/HTTP
    "express": "^5.2.1",                         // Web 框架
    "hono": "4.12.8",                            // 轻量 Web 框架
    "ws": "^8.19.0",                             // WebSocket

    // 工具库
    "commander": "^14.0.3",                      // CLI 参数解析
    "chalk": "^5.6.2",                           // 终端颜色
    "zod": "^4.3.6",                             // 数据验证
    "@sinclair/typebox": "0.34.48",             // JSON Schema + 类型
    "ajv": "^8.18.0",                            // JSON Schema 验证

    // 其他
    "sharp": "^0.34.5",                          // 图像处理
    "playwright-core": "1.58.2",                 // 浏览器自动化
    "qrcode-terminal": "^0.12.0",                // 终端二维码
    "jiti": "^2.6.1",                            // 运行时 TypeScript
    "chokidar": "^5.0.0",                        // 文件监听
    // ... 更多依赖
  },

  // ============================================================================
  // 开发依赖（仅开发/构建时需要）
  // ============================================================================

  "devDependencies": {
    // TypeScript
    "typescript": "^5.9.3",                      // TypeScript 编译器
    "@types/node": "^25.5.0",                    // Node.js 类型定义

    // 测试
    "vitest": "^4.1.0",                          // 测试框架
    "@vitest/coverage-v8": "^4.1.0",             // 测试覆盖率
    "jsdom": "^29.0.0",                          // DOM 模拟

    // Lint/格式化
    "oxlint": "^1.56.0",                         // Oxlint 检查器
    "oxfmt": "0.41.0",                           // Oxlint 格式化器
    "jscpd": "4.0.8",                            // 重复代码检测

    // 构建工具
    "tsdown": "0.21.4",                          // TypeScript 打包器
    "tsx": "^4.21.0",                            // TypeScript 执行器

    // 前端
    "lit": "^3.3.2",                             // Web Components 框架
    "@lit/context": "^1.1.6",                    // Lit 上下文

    // 类型定义
    "@types/express": "^5.0.6",
    "@types/ws": "^8.18.1",
    "@types/markdown-it": "^14.1.2"
    // ... 更多开发依赖
  },

  // ============================================================================
  // 宿主依赖（使用者环境需提供）
  // ============================================================================

  "peerDependencies": {
    "@napi-rs/canvas": "^0.1.89",                // Canvas 绑定（可选）
    "node-llama-cpp": "3.16.2"                   // 本地 LLM（可选）
  },
  "peerDependenciesMeta": {
    "node-llama-cpp": {
      "optional": true                           // 标记为可选依赖
    }
  },

  // ============================================================================
  // 运行环境要求
  // ============================================================================

  "engines": {
    "node": ">=22.16.0"                          // Node.js 最低版本要求
  },

  // ============================================================================
  // 包管理器
  // ============================================================================

  "packageManager": "pnpm@10.23.0",              // 强制使用 pnpm 指定版本

  // ============================================================================
  // pnpm 特有配置
  // ============================================================================

  "pnpm": {
    "minimumReleaseAge": 2880,                   // 依赖发布后等待时间（分钟），防止供应链攻击

    // 强制覆盖依赖版本（解决版本冲突或安全问题）
    "overrides": {
      "hono": "4.12.8",
      "fast-xml-parser": "5.5.6",
      "minimatch": "10.2.4",
      // ... 更多覆盖
    },

    // 仅对这些包执行 postinstall 构建（加速安装）
    "onlyBuiltDependencies": [
      "@lydell/node-pty",
      "@napi-rs/canvas",
      "sharp",
      "esbuild",
      // ... 更多
    ],

    // 扩展包的依赖（修复不完整的依赖声明）
    "packageExtensions": {
      "@mariozechner/pi-coding-agent": {
        "dependencies": {
          "strip-ansi": "^7.2.0"
        }
      }
    }
  }
}

================================================================================
注释说明：
================================================================================

1. name/version/description/license
   - npm 包的基本元数据，用于发布和搜索

2. bin
   - 定义全局 CLI 命令，安装后可直接运行 `openclaw`

3. type: "module"
   - 使用 ESM 模块系统，.js 文件默认为 ES 模块而非 CommonJS

4. exports
   - 现代模块导出机制，支持：
     - 条件导出（types/default）
     - 子路径导入（openclaw/plugin-sdk）
     - 防止访问内部文件

5. dependencies vs devDependencies
   - dependencies: 运行时必需，会安装到生产环境
   - devDependencies: 仅开发时需要，生产环境不安装

6. peerDependencies
   - 插件/扩展场景常用
   - 由使用者安装，避免重复打包大型依赖

7. engines
   - 指定运行环境版本要求
   - Node.js 版本过低会报警告或错误

8. packageManager
   - Corepack 支持，确保团队使用相同版本的包管理器

9. pnpm.minimumReleaseAge
   - 安全特性：依赖发布后需等待指定时间才能安装
   - 防止恶意包抢发攻击

10. pnpm.overrides
    - 强制统一依赖版本
    - 用于解决版本冲突或修复安全漏洞

================================================================================
```

## 2. openclaw.mjs

```json
// package.json 中有一个这个，给系统 PATH 中创建 openclaw 命令（指向 openclaw.mjs ）
"bin": {
  "openclaw": "openclaw.mjs"
},

# 等同于下面的这个效果：
npm install -g openclaw
       ↓
npm 在全局 bin 目录创建链接：
 Windows: C:\Users\<用户>\AppData\Roaming\npm\openclaw.cmd
 macOS/Linux: /usr/local/bin/openclaw
       ↓
该目录已在 PATH 中，所以可以直接运行 `openclaw`
```

```plain
   # 整体启动流程如下：
   
   npm install -g openclaw
           ↓
   npm 读取 bin 配置: { "openclaw": "openclaw.mjs" }
           ↓
   在系统 PATH 中创建 openclaw 命令（指向 openclaw.mjs）
           ↓
   用户输入: openclaw gateway run
           ↓
   系统执行: node openclaw.mjs gateway run
           ↓
   openclaw.mjs 加载 dist/entry.js，运行真正的 CLI 逻辑
```



.mjs` 和 `.js` 文件的核心区别在于 **Node.js 对模块系统的解析规则**，其中 `.mjs` 是 Node.js 为明确标识 ES Modules（ESM）而引入的专用扩展名。

| 特性         | `.js` 文件                                                   | `.mjs` 文件                                                  |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 默认模块系统 | Node.js 中默认解析为 **CommonJS**（使用 `require/module.exports`） | 强制解析为 **ES Modules**（使用 `import/export`），忽略 `package.json` 配置 |
| 模块切换条件 | 需在 `package.json` 中设置 `"type": "module"` 才能切换为 ESM | 无需任何配置，直接按 ESM 解析（优先级最高）                  |
| 反向兼容     | 可通过 `package.json` 的 `"type": "commonjs"` 强制切回 CommonJS | 无法切换为 CommonJS（如需强制 CommonJS 用 `.cjs`）           |

| 特性             | CommonJS（CJS）                                      | ES Modules（ESM）                                            |
| ---------------- | ---------------------------------------------------- | ------------------------------------------------------------ |
| **设计初衷**     | 服务端（Node.js）模块化                              | 全端（浏览器 + Node.js）通用模块化                           |
| **加载时机**     | 运行时加载（执行到 `require` 才加载模块）            | 编译时解析（代码执行前先分析 import/export）                 |
| **核心语法**     | 导入：`require()`；导出：`module.exports/exports`    | 导入：`import`；导出：`export/export default`                |
| **加载方式**     | 同步加载（阻塞后续代码）                             | 异步加载（不阻塞，浏览器优先）                               |
| **路径要求**     | 可省略扩展名（如 `require('./utils')`）              | 必须带完整扩展名（如 `import './utils.js'`）                 |
| **值的绑定**     | 导入的是「值的拷贝」（一旦导入，原模块值变化不影响） | 导入的是「值的引用」（原模块值变化，导入方同步更新）         |
| **顶级 `await`** | 不支持（需包裹在异步函数中）                         | 支持（顶级 await，无需函数包裹）                             |
| **全局变量**     | 有 `__filename`/`__dirname`/`module`/`exports`       | 无这些变量（替代：`import.meta.url`）                        |
| **顶级 `this`**  | 指向模块本身（`module.exports`）                     | 指向 `undefined`（无全局 this）                              |
| **循环依赖处理** | 运行时动态处理（可能拿到不完整的模块）               | 编译时解析依赖树（更稳定，提前处理）                         |
| **JSON 加载**    | 直接 `require('./config.json')`                      | 需加断言：`import data from './config.json' assert { type: 'json' }` |

**核心代码片段，加载真正的 CLI 入口文件：**

- 接下来我们看 `./dist/entry.js` 或者 `./dist/entry.mjs`。

```js
/**
 * 加载真正的 CLI 入口
 * 
 * 尝试按顺序加载：
 * 1. ./dist/entry.js - CommonJS 格式
 * 2. ./dist/entry.mjs - ESM 格式
 * 
 * 这种设计允许构建系统输出不同格式的产物，启动器自动适配
 */
if (await tryImport("./dist/entry.js")) {
  // 成功加载 CommonJS 入口
} else if (await tryImport("./dist/entry.mjs")) {
  // 成功加载 ESM 入口
} else {
  // 两种格式都不存在，说明构建产物缺失
  throw new Error("openclaw: missing dist/entry.(m)js (build output).");
}
```

## 3.  tsdown.config.ts

`tsdown.config.ts` 是 `tsdown` 打包工具的配置文件，用于将 `TypeScript` 源码编译打包成可发布的 `JavaScript` 产物。

`./dist/entry.js` 或者 `./dist/entry.mjs` 是构建产物，源码位置可以通过 `tsdown.config.ts` 找到。

详情见：https://tsdown.dev/zh-CN/guide/

## 4. entry.ts

**核心代码片段：**

- 不难看出是调用了 `run-main.js` 中暴露出来的 `runCli` 函数 。

```js
/**
 * 运行主 CLI 或显示根级帮助
 * 
 * 这是 CLI 的最终入口点：
 * 1. 如果是帮助命令，显示帮助
 * 2. 否则，加载并运行完整的 CLI 解析器
 * 
 * @param argv - 命令行参数
 */
function runMainOrRootHelp(argv: string[]): void {
  // 尝试处理帮助快速路径
  if (tryHandleRootHelpFastPath(argv)) {
    return;
  }

  // 加载并运行主 CLI
  // runCli 会解析命令行参数，找到对应的子命令并执行
  import("./cli/run-main.js")
    .then(({ runCli }) => runCli(argv))
    .catch((error) => {
      console.error(
        "[openclaw] Failed to start CLI:",
        error instanceof Error ? (error.stack ?? error.message) : error,
      );
      process.exitCode = 1;
    });
}
```

## 5. run-main.js

核心代码，`program` 的使用：

```js
// 动态导入并构建 Commander.js 程序实例
const { buildProgram } = await import("./program.js");
const program = buildProgram();
...
// ========== 第八步：执行命令 ==========
// 解析并执行命令行参数
await program.parseAsync(parseArgv);
```

## 6. build-program.ts

```ts
import { Command } from "commander";
import { registerProgramCommands } from "./command-registry.js";
import { createProgramContext } from "./context.js";
import { configureProgramHelp } from "./help.js";
import { registerPreActionHooks } from "./preaction.js";
import { setProgramContext } from "./program-context.js";

/**
 * 构建并配置 OpenClaw CLI 主程序。
 *
 * 该函数是 CLI 程序的入口点工厂，负责：
 * 1. 创建 Commander.js Command 实例
 * 2. 创建程序上下文（包含版本、配置等信息）
 * 3. 配置帮助信息显示
 * 4. 注册预执行钩子（如版本检查、全局选项处理）
 * 5. 注册所有子命令
 *
 * @returns 配置完成的 Commander 程序实例，可直接调用 `.parse()` 执行。
 */
export function buildProgram() {
  // 创建 Commander.js 命令实例
  const program = new Command();

  // 启用位置选项支持，允许在命令行中使用位置参数
  program.enablePositionalOptions();

  // 创建程序上下文，包含运行时所需的共享信息
  // 如：程序版本、配置路径、环境变量等
  const ctx = createProgramContext();

  // 保存原始命令行参数，供后续命令解析使用
  const argv = process.argv;

  // 将上下文绑定到 program 实例上，便于后续命令访问
  setProgramContext(program, ctx);

  // 配置帮助信息的显示格式和内容
  configureProgramHelp(program, ctx);

  // 注册预执行钩子，在每个命令执行前运行
  // 用于处理全局选项（如 --version、--help 等）
  registerPreActionHooks(program, ctx.programVersion);

  // 核心步骤：
  // 注册所有 CLI 子命令（如 agents、channels、gateway 等）
  registerProgramCommands(program, ctx, argv);

  // 返回配置完成的程序实例
  return program;
}
```

























