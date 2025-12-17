---
title: Java 常用运维命令
order: 1
icon: iconoir:network
---

## 1. Window 杀死后台Java进行
```shell
> jps
33776 RemoteJdbcServer
75424 SrmApplication
92496
72740
30152
77160 SrmApplication
84056 Jps
38060 RemoteJdbcServer
41740 Launcher

> tasklist | findstr /i java
taskkill /F /PID 75424
成功: 已终止 PID 为 75424 的进程。
```

