---
title: Git 使用规范
order: 1
---


## 1. 推荐写法（本人常用）

**Git 仓库命令规则**： 

- 前端：系统名-简单描述-front
- 后端：系统名-简单描述-server

**Git 提交描述**：

```powershell
docs(changelog): update change log to beta.5

其中：
● docs 则对应修改的类型
● changelog 则是影响的范围
● subject 则是对应做的事件
```

**对应的类型有**：

- build：影响构建系统或外部依赖关系的更改（示例范围：gulp，broccoli，npm）
- ci：更改我们的持续集成文件和脚本（示例范围：Travis，Circle，BrowserStack，SauceLabs）
- docs：仅文档更改
- feat：一个新功能
- fix：修复错误
- perf：改进性能的代码更改
- refactor：代码更改，既不修复错误也不添加功能
- style：不影响代码含义的变化（空白，格式化，缺少分号等）
- test：添加缺失测试或更正现有测试

## 2. 工作写法

**Git 提交描述**：

一般公司会使用一些第三方工具，例如：Jira、Ones等，通过这些看板工具来管理团队的任务。每一个任务都会有对应的任务号。

因此，这个时候提交就会规范一点：

```sql
# 类似格式 如下：
[任务卡号] xx & xx: do something 

# 举个例子，Ones格式如下：
#79612 描述内容
http://ones.xxx.com/project/#/team/HvBrmPic/task/GSCnZc5zd2dDgl8F
```

## 3. 常规写法

```sql
[任务分类] 主要修改组件（可选）：修改内容
```

示例 1，`[T] tabs: add icons` 。其中的 `T` 表示这是一个技术卡，`tabs` 表示修改的是 Tabs，`add icons` 则表示添加了图标。

示例 2，`[SkillTree] detail: add link data`。其中的 `SkillTree` 表示修改的是技能树 Tab 下的内容，`detail` 则表示修改的是详情页，`add link data` 则表示是添加了技能的数据

优点：轻松 **filter 出相应业务的内容**。

缺点：要这样做需要团队达到一致，因此付出一些额外的成本。



> 💡以上参考：[GitHub 漫游指南](https://github.phodal.com/#/chapter/Github漫游指南?id=git-提交信息及几种不同的规范)

