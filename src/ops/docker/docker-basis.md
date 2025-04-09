---
title: Docker 基础知识
order: 2
---

## 一、Docker 常用命令

1. 复制：

```bash
# 复制容器中的文件，到宿主机中，这个经常用于想要容器里面的某个文件时，非常好用！
docker cp <container_id>:/path/in/container /path/on/host
```

2. 标签：

```bash
# 为已有的 Docker 镜像打上新的标签（Tag）。标签是镜像的一个标识，可以用来管理和区分不同版本的镜像。通过 docker tag，你可以为同一个镜像创建多个不同的标签或名字，从而让你更灵活地管理镜像。
docker tag <source-image> <target-image>
# 例如：
docker tag node:14 node:latest
```

3. 查看 Docker 占用空间情况，适合排查因 Docker 导致的磁盘占用问题。

   ```bash
   $ docker system df
   TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
   Images          3         1         1.328GB   1.312GB (98%)
   Containers      1         0         1.093kB   1.093kB (100%)
   Local Volumes   9         0         2.908GB   2.908GB (100%)
   Build Cache     242       0         28.34GB   28.34GB
   ```

4. 清理 构建镜像时产生的缓存文件：（只清理构建缓存（更安全））

```shell
$ docker builder prune
# docker builder prune 主要是用来清理 构建镜像时产生的缓存文件，并不会删除实际的镜像、容器或数据卷。
```

![image-20250409145804944](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250409145804944.png)



## 二、Docker 清理 overlay2 目录

如果 `/var/lib/docker/overlay2` 占用了大量磁盘空间，可以考虑以下方法：

- 一般 docker 相关资源规划不当，就会造成overlay2目录堆积拥堵。

1. **清理不再使用的容器**：

   ```bash
   docker container prune
   ```

2. **删除未使用的镜像**：

   ```bash
   docker image prune
   ```

3. **删除所有未使用的资源**：

   ```bash
   docker system prune -a
   ```

4. **查看空间占用**： 使用 `du` 命令查看 `/var/lib/docker/overlay2` 的大小：

   ```bash
   sudo du -sh /var/lib/docker/overlay2
   ```

5. **手动删除未使用的容器和镜像**：如果某些容器或镜像已经不再需要，可以使用 `docker rm` 和 `docker rmi` 删除它们。

## 三、Docker 重启策略

当你启动一个容器时，可以通过 `--restart` 选项来设置重启策略。以下是几个常见的重启策略：

- `no`：默认值。容器退出后不会自动重启。
- `always`：无论退出状态是什么，Docker 守护进程都会自动重启容器。
- `on-failure`：只有当容器因错误（退出代码非 0）退出时，才会自动重启。
- `unless-stopped`：只要 Docker 服务在运行，容器就会自动重启，除非手动停止容器。

```shell
# 例如：--restart always
docker run --restart always -d my-container
```

## 四、Docker 配置容器日志等

配置 `/etc/docker/daemon.json` ：

```json
{
   "log-driver": "json-file", 	 # 设置日志驱动为 json-file
   "log-opts": {			    
      "max-size": "10m",		# 限制单个日志文件的最大大小为 10MB
      "max-file": "3"		    # 保留最多 3 个日志文件
   },
   "registry-mirrors": [
        "https://docker-0.unsee.tech"
   ]
}
```

