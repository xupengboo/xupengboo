---
title: Git 常用操作
order: 2
---

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

## Git 撤回提交操作

```shell
git reset --soft HEAD~1 # 撤销最近的提交，保留修改和暂存内容。
git reset --mixed HEAD~1 # 撤销最近的提交，保留修改，但取消暂存。
git reset --hard HEAD~1 # 撤销最近的提交，并丢弃所有修改（慎用）。
```







