---
title: Python 环境
outline: deep
---

# Python 环境配置

> 记录 Python 开发环境的常用配置命令，持续补充中。

## pip 镜像源配置

### 设置阿里云镜像源（推荐）

```bash
pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/
```

### 其他常用镜像源

```bash
# 清华大学
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple/

# 腾讯云
pip config set global.index-url https://mirrors.cloud.tencent.com/pypi/simple/

# 中国科技大学
pip config set global.index-url https://pypi.mirrors.ustc.edu.cn/simple/
```

### 查看当前镜像源配置

```bash
pip config list
```

### 临时使用镜像源（不修改全局配置）

```bash
pip install 包名 -i https://mirrors.aliyun.com/pypi/simple/
```

### 通过 requirements.txt 安装依赖（指定镜像源）

```bash
pip install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple/
```
