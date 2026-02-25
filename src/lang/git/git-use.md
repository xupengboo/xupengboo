---
title: Git 常用操作
order: 2
---

## Git 修改配置

```shell
# 查看配置
git config --list
# 设置用户名
git config user.name "your name"
git config --global user.name "your name"
# 设置邮箱
git config user.email "your email"
git config --global user.email "your email"
```

## Git 撤回提交操作

```shell
git reset --soft HEAD~1 # 撤销最近的提交，保留修改和暂存内容。
git reset --mixed HEAD~1 # 撤销最近的提交，保留修改，但取消暂存。
git reset --hard HEAD~1 # 撤销最近的提交，并丢弃所有修改（慎用）。
```

## Git 代理配置
代理配置如下：
```bash
# http 以及 https 代理配置：
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy https://127.0.0.1:7890
```
可能很多人面临，多个git平台，此时，只需要在对应的配置即可，不用配置全局：
```bash
# 可能很多人面临，多个git平台，此时，只需要在对应的配置即可，不用配置全局。
git config http.proxy http://127.0.0.1:7890
git config https.proxy https://127.0.0.1:7890
```
改完了可以 `git config -l` 查看：
```bash
git config -l
```

清除全局代理配置（关键）：

```bash
# 查看全局代理配置
git config --global --list | findstr proxy
# 查看局部代理配置
git config --list | findstr proxy

# 清除全局 HTTP/HTTPS 代理
git config --global --unset http.proxy
git config --global --unset https.proxy
# 清除局部 HTTP/HTTPS 代理
git config --unset http.proxy
git config --unset https.proxy
```





