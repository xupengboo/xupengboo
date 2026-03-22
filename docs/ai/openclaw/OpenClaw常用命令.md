
# OpenClaw 常用命令

## 常用命令

```bash
# 帮助查看命令
openclaw --help

# 查看 OpenClaw 版本
openclaw --version

# 启动终端图形界面（推荐）
openclaw tui

# 更新 OpenClaw 到最新版本
openclaw update

# 管理技能
openclaw skills list    # 查看已安装技能
openclaw skills install <skill-url>  # 安装新技能
openclaw skills remove <skill-name>  # 移除技能

# gateway 服务管理
openclaw gateway run/start/stop/restart/status

# 查看日志
openclaw logs --follow

```

## OpenClaw 相关配置

修改全局默认工作区路径：

```bash
# 无空格路径直接写
openclaw config set agents.defaults.workspace D:\openclaw\workspace

# 路径含空格时，用双引号包裹
openclaw config set agents.defaults.workspace "D:\我的项目\openclaw工作区"

# 查看配置是否写入成功
openclaw config get agents.defaults.workspace

# 直接将当前CMD所在目录（D:\cmd）设为临时工作区，启动Gateway
openclaw gateway start --force --set agents.defaults.workspace=%CD%
```

## OpenClaw 模型配置

```bash
# 查看模型相关的配置信息
openclaw models --help

# 查看当前模型列表
openclaw models list

# 添加模型
openclaw models auth --help
openclaw models auth add

# 切换模型
openclaw models set glm-5


```

## OpenClaw 多智能体操作

多智能体独立工作区（同一个Gateway下，多个Agent隔离）
```bash
# 查看当前已有的智能体列表
openclaw agents list

# 查看 agents 的正确参数（不同版本会有不同的命令，例如：创建agent有的是create，有的是add）
openclaw agents --help

# 创建一个名为dev_agent的智能体，专属工作区为D:\GitHub\xupengboo
openclaw agents add --workspace D:\GitHub\xupengboo --non-interactive dev_agent

# 查看所有智能体，验证是否已经正常创建
openclaw agents list

# 单条指令模式（适合脚本 / 一次性任务）
openclaw agent --agent dev_agent --message "输出你当前的工作目录绝对路径"

# 切换某一个智能体
openclaw tui # 或者 openclaw chat
> /agent # 上下切换即可

# 查看某个agent的配置信息
openclaw config get agents


# 重新配置太麻烦的话，也可以删除Agent，然后重新添加
## 删除某个agent
openclaw agents delete dev_agent
## 重新添加agent
openclaw agents add --workspace D:\GitHub --non-interactive dev_agent
```
