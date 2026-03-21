# OpenClaw 源码解析计划

## 目标

这份计划的目标不是“把仓库每个文件都看完”，而是 7 天内建立对 OpenClaw 主干架构的高置信理解，达到下面这个标准：

- 能讲清楚 OpenClaw 的启动链、CLI 装配方式、Gateway 职责边界、Agent 执行主路径、Channel/Plugin 接入模型。
- 能根据一个功能点大致定位应该去哪个模块看代码。
- 能安全地做一个小改动，并运行相关测试验证。
- 能分辨哪些模块是主干，哪些模块是大量实现细节或渠道特化代码。

## 可行性判断

结论：7 天内“完全透彻到覆盖所有渠道、所有测试、所有平台细节”不现实；但 7 天内“吃透核心主干并能开始有效贡献”是可行的。

可行的前提：

- 每天至少投入 3 到 5 小时。
- 不按目录平铺阅读，而是沿真实执行路径学习。
- 只深挖 1 个代表性 channel/plugin，不试图在第一周吃完所有 `extensions/`。
- 每天都做输出，而不是只看不写。

不建议的目标：

- 第一周试图读完所有 `src/agents/**/*.ts`。
- 第一周试图覆盖所有平台端代码：`apps/macos`、`apps/ios`、`apps/android`、`ui`。
- 第一周试图全面掌握每个渠道的接入细节。

## 学习方法

全程按这条主干链学习：

`openclaw.mjs` -> `src/entry.ts` -> `src/cli/run-main.ts` -> `src/cli/program/build-program.ts` -> `src/cli/program/command-registry.ts` -> `src/commands/*` -> `src/agents/agent-command.ts` -> `src/gateway/server.impl.ts` -> `src/channels/plugins/*` -> `extensions/<某个插件>`

每天固定做 4 件事：

1. 先读主文件，再顺着 import 看 2 到 4 个关键依赖。
2. 画一张小图，记录“输入 -> 处理 -> 输出”。
3. 写一个 200 到 500 字总结，回答当天的核心问题。
4. 用命令或测试做一次最小验证。

## Day 1 启动链和总览

### 目标

搞清楚 OpenClaw 从命令行启动时，入口如何分层，为什么它不只是一个普通 CLI。

### 必读文件

- `README.md`
- `VISION.md`
- `openclaw.mjs`
- `src/entry.ts`
- `src/index.ts`
- `src/cli/run-main.ts`
- `src/cli/program/build-program.ts`

### 重点问题

- `openclaw.mjs` 为什么只做 Node 版本检查和 dist 入口分发？
- `src/entry.ts` 和 `src/index.ts` 分别承担什么责任？
- `runCli()` 在启动前做了哪些环境准备？
- 为什么 `buildProgram()` 只搭 Commander 骨架，不直接把所有命令全部写死？

### 当日产出

- 画出启动链流程图。
- 写出“入口层职责边界”总结。

### 验收标准

- 你能口头说明 `openclaw.mjs`、`src/entry.ts`、`src/cli/run-main.ts` 三者差异。
- 你能解释 lazy registration 在这个 CLI 里存在的原因。

## Day 2 CLI 命令注册与业务入口

### 目标

搞清楚一个命令从 Commander 注册到真正执行业务逻辑的路径。

### 必读文件

- `src/cli/program/command-registry.ts`
- `src/cli/program/register.onboard.ts`
- `src/cli/program/register.message.ts`
- `src/cli/program/register.status-health-sessions.ts`
- `src/commands/onboard.ts`
- `src/commands/message.ts`
- `src/commands/status.command.ts`

### 重点问题

- `registerCoreCliByName()` 如何按需注册主命令？
- `onboard`、`message`、`status` 这三类命令分别代表什么类型的业务入口？
- 命令层和业务层如何分离？
- 哪些逻辑是参数解析，哪些逻辑是真正业务处理？

### 建议执行

- 实际运行一次 `pnpm openclaw --help`
- 实际运行一次 `pnpm openclaw status --help`
- 实际运行一次 `pnpm openclaw message --help`

### 当日产出

- 写一份“命令注册模式”说明。
- 列出 3 个你觉得最典型的 CLI 入口。

### 验收标准

- 你能说清楚一个子命令是在哪里注册、在哪里调用、在哪里落到真正实现上的。

## Day 3 Onboard、配置与用户第一条路径

### 目标

理解项目最重要的用户进入路径：onboarding、配置、workspace、基础安全前置。

### 必读文件

- `src/commands/onboard.ts`
- `src/commands/onboard-interactive.ts`
- `src/commands/onboard-non-interactive.ts`
- `src/wizard/setup.ts`
- `src/config/config.ts`
- `SECURITY.md`

### 重点问题

- 为什么这个项目强推 `onboard`？
- interactive 和 non-interactive 两条路径如何分工？
- config snapshot、migration、validation 大致怎么组织？
- 安全模型中，哪些默认策略是必须先建立认知的？

### 当日产出

- 写出 onboarding 的主流程。
- 总结 5 条最重要的安全/配置默认值。

### 验收标准

- 你能解释“为什么 onboarding 不是附属功能，而是主产品路径的一部分”。

## Day 4 Gateway 主干

### 目标

理解 Gateway 为什么是 control plane，以及它在系统里真正负责什么。

### 必读文件

- `src/gateway/server.impl.ts`
- `src/gateway/server-channels.ts`
- `src/gateway/server-methods.ts`
- `src/gateway/server-ws-runtime.ts`
- `src/gateway/server-startup.ts`
- `docs/gateway/index.md`
- `docs/concepts/architecture.md`

### 重点问题

- Gateway 持有哪些全局状态？
- 它如何加载 channel plugins？
- WebSocket、methods、channel manager 之间怎么配合？
- Gateway 与 CLI、agent、Web UI 的关系是什么？

### 当日产出

- 画一张 Gateway 组件图。
- 写出“Gateway 不负责什么”。

### 验收标准

- 你能解释为什么仓库文档反复强调 Gateway 是 control plane。

## Day 5 Agent 执行主路径

### 目标

读懂 agent 一次运行时的核心链路，包括 session、transcript、模型执行、fallback。

### 必读文件

- `src/agents/agent-command.ts`
- `src/agents/cli-runner.ts`
- `src/agents/pi-embedded.ts`
- `src/agents/pi-embedded-runner/session-manager-init.ts`
- `src/config/sessions/transcript.ts`
- `docs/concepts/agent.md`
- `docs/concepts/session.md`

### 重点问题

- `agent-command.ts` 为什么这么核心？
- `runCliAgent()` 和 `runEmbeddedPiAgent()` 各自承担什么角色？
- `SessionManager.open(...)` 说明 transcript 是怎样的模型？
- session store、workspace、agent identity 如何关联？

### 当日产出

- 写一份“agent 一次运行的时序图”。
- 总结 session/transcript 的数据流。

### 验收标准

- 你能说清楚一次 agent run 至少经过哪些关键步骤。

## Day 6 Channel Plugin 模型

### 目标

理解 OpenClaw 如何把不同消息渠道抽象成统一插件契约。

### 必读文件

- `src/channels/plugins/types.plugin.ts`
- `src/channels/plugins/types.ts`
- `src/channels/plugins/registry.ts`
- `src/channels/plugins/index.ts`
- `extensions/matrix/src/channel.ts`
- `extensions/matrix/index.ts`
- `src/plugin-sdk/core.ts`

### 为什么选 Matrix

- 结构完整。
- 能看到 config、security、threading、messaging、directory、actions 等能力拼装。
- 代表性强，但比某些历史渠道更容易形成整体认知。

### 重点问题

- `ChannelPlugin` 的最小契约是什么？
- `registry` 如何让 Gateway 和 commands 看到所有渠道？
- channel capability 与具体 adapter 的关系是什么？
- 一个新渠道接入时，大致要补哪些面？

### 当日产出

- 写一张“ChannelPlugin 接口地图”。
- 列出新增一个渠道最少要实现的能力点。

### 验收标准

- 你能看一个新插件目录，大致判断它接到了系统的哪些面。

## Day 7 测试、验证与第一次改动

### 目标

把前 6 天的理解转成一次真实的小改动和验证，形成闭环。

### 必读文件

- 你前 6 天读过模块对应的 `*.test.ts`
- `docs/help/testing.md`
- `package.json`

### 建议做的小改动

- 调整某个 `status` 文案或格式。
- 给 `message` 或 `onboard` 某条分支补一个更清晰的输出。
- 给某个已有 helper 补测试。

### 建议命令

- `pnpm test -- src/commands/status.test.ts`
- `pnpm test -- src/commands/message.test.ts`
- `pnpm test -- src/commands/onboard.test.ts`
- 如果改到了 agent 或 gateway，改为对应的精确测试路径

### 当日产出

- 一次真实提交前说明，包含：
- 你改了什么
- 为什么改
- 改动落在哪条执行路径上
- 如何验证

### 验收标准

- 你能独立定位改动点，不靠全局模糊搜索乱试。
- 你能把改动和主干架构联系起来讲清楚。

## 每天建议时间分配

- 30 分钟：回顾昨天结论，确认今天问题。
- 90 分钟：精读主文件。
- 60 分钟：顺着 import 补上下文。
- 30 分钟：跑命令或看测试验证。
- 30 分钟：写总结和问题清单。

如果每天只有 2 小时：

- 保留主文件阅读。
- 保留总结输出。
- 压缩验证和扩展阅读。
- 第 7 天不做改动，改成做定位练习。

## 第一周不要深挖的区域

- `apps/macos`
- `apps/ios`
- `apps/android`
- `ui`
- 所有你暂时不准备接触的 channel 实现
- 过深的 docs i18n 流程
- 发布、打包、Parallels 测试基础设施

这些不是不重要，而是它们会迅速把你的认知带离主干。

## 第一周结束时你应该能回答的问题

- OpenClaw 的启动入口为什么是分层的？
- CLI 的 lazy command registration 是如何工作的？
- Gateway 为什么被定义为 control plane？
- agent 执行时 session/transcript 是如何组织的？
- ChannelPlugin 为什么是这个项目最关键的扩展抽象之一？
- 如果要新增一个命令、修一个 agent bug、加一个渠道能力，你该先去哪几层找？

## 学习风险与应对

### 风险 1：陷入文件海

应对：

- 只沿执行路径读。
- 每天只选 1 个主问题。
- 不把“看过很多文件”等同于“理解系统”。

### 风险 2：只看不验证

应对：

- 每天至少跑一次命令或一次测试。
- 每天输出一张图或一段总结。

### 风险 3：过早深挖某个局部实现

应对：

- 第 1 周优先主干。
- 只挑 1 个代表性插件深读。

## 建议的学习记录模板

每天可以按下面格式记录：

```md
# Day X

## 今天回答的问题

-

## 读过的核心文件

-

## 我现在的理解

-

## 仍然不确定的点

-

## 明天要验证什么

-
```

## 最后建议

第一周的正确目标不是“记住所有目录”，而是建立稳定的脑内地图。

只要你在 7 天后能做到下面三件事，这个计划就算成功：

- 能从用户命令一路追到业务实现。
- 能从 Gateway 追到 agent 和 channels。
- 能安全完成一个小改动并验证。
