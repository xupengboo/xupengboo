---
title: Git 常用操作
order: 3
---

## Git 撤回提交操作

```shell
git reset --soft HEAD~1 # 撤销最近的提交，保留修改和暂存内容。
git reset --mixed HEAD~1 # 撤销最近的提交，保留修改，但取消暂存。
git reset --hard HEAD~1 # 撤销最近的提交，并丢弃所有修改（慎用）。
```







