# Docker基础知识

> Tips：记录docker的一些基本知识，忘记了回过头看看。



# Docker常用命令
这个经常用于想要容器里面的某个文件时，非常好用！
```shell
docker cp <container_id>:/path/in/container /path/on/host
```



# Docker重启策略

当你启动一个容器时，可以通过 `--restart` 选项来设置重启策略。以下是几个常见的重启策略：

- `no`：默认值。容器退出后不会自动重启。
- `always`：无论退出状态是什么，Docker 守护进程都会自动重启容器。
- `on-failure`：只有当容器因错误（退出代码非 0）退出时，才会自动重启。
- `unless-stopped`：只要 Docker 服务在运行，容器就会自动重启，除非手动停止容器。

```shell
# 例如：--restart always
docker run --restart always -d my-container
```

