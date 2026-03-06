---
title: Git 实战与团队规范
description: 涵盖 Git 核心命令、代理优化及企业级提交规范
---

# 🛠️ Git 实战经验

本指南旨在规范团队 Git 使用流程，并提供高频场景下的命令速查，帮助开发者高效管理版本。

## 1. 基础配置与身份管理

在进行任何提交之前，请确保你的身份标识已在全局或当前项目中正确配置。

```shell {title="配置命令"}
# 1. 查看当前所有配置
git config --list

# 2. 设置用户身份 (建议全局配置)
git config --global user.name "你的用户名"
git config --global user.email "你的邮箱"
```

## 2. 撤回操作 (Reset)

::: warning 风险提示
执行 reset --hard 将会物理删除所有未提交的本地修改，操作前请务必确认代码已备份。
:::

| **命令**                   | **撤回效果**               | **建议场景**                 |
| -------------------------- | -------------------------- | ---------------------------- |
| `git reset --soft HEAD~1`  | 撤销提交，保留修改和暂存区 | 仅想修改 Commit 信息         |
| `git reset --mixed HEAD~1` | 撤销提交及暂存，保留修改   | 想要重新筛选提交的文件       |
| `git reset --hard HEAD~1`  | **彻底重置**，丢弃所有修改 | 当前开发分支完全写烂，需重来 |

## 3. 网络代理优化

针对 GitHub 等平台访问受限的问题，建议按需配置代理。

### 3.1 局部与全局代理

```bash
# 查看全局代理配置
git config --global --list | findstr proxy
# 查看局部代理配置
git config --list | findstr proxy

# 推荐：仅针对当前仓库配置（不影响内网项目）
git config http.proxy http://127.0.0.1:7890
git config https.proxy https://127.0.0.1:7890

# 可选：全局代理配置
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy https://127.0.0.1:7890

# 改完了可以 `git config -l` 查看
git config -l
```

### 3.2 清理代理配置

::: tip 故障排查
如遇到连接 403 或证书报错，请先尝试清除代理配置进行自查。
:::

```bash
# 清除当前项目的代理
git config --unset http.proxy
git config --unset https.proxy

# 清除全局代理
git config --global --unset http.proxy
```

## 4. Git 协作规范

### 4.1 仓库命名建议

- **前端项目**：`系统名-简单描述-front`
- **后端项目**：`系统名-简单描述-server`

### 4.2 Commit Message 规范

推荐采用标准的 `Type(Scope): Subject` 格式。

| **类型 (Type)** | **含义**        | **示例**                           |
| --------------- | --------------- | ---------------------------------- |
| `feat`          | ✨ 新增功能      | `feat(auth): 增加短信验证码登录`   |
| `fix`           | 🐛 修复缺陷      | `fix(sidebar): 修复移动端间距异常` |
| `docs`          | 📝 仅文档修改    | `docs(git): 更新代理设置说明`      |
| `perf`          | ⚡ 性能优化      | `perf(search): 优化搜索算法耗时`   |
| `refactor`      | ♻️ 代码重构      | `refactor(db): 提取通用查询逻辑`   |
| `style`         | 💄 样式/格式修改 | `style(ui): 统一 Tab 缩进`         |

### 4.3 任务卡号关联

在团队开发中，建议在提交信息中包含任务号（如 Jira/Ones），以便回溯。

```PowerShell
# 格式：[任务号] 简短描述
[#79612] feat(tabs): add icons

# 详情链接（可选）
[http://ones.xxx.com/project/task/GSCnZc5zd2dDgl8F](http://ones.xxx.com/project/task/GSCnZc5zd2dDgl8F)
```

------

> 💡 **参考资料**：[GitHub 漫游指南](https://github.phodal.com/)

