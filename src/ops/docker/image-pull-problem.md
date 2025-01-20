---
title: 镜像仓库地址
order: 6
---

# 镜像仓库地址

相关 Docker 镜像源：

- https://www.coderjia.cn/archives/dba3f94c-a021-468a-8ac6-e840f85867ea

配置 `docker` 镜像源：

```shell
vi /etc/docker/daemon.json
```

之后把下面的代码贴进去：

```json
{
	"registry-mirrors": [
        "https://docker.m.daocloud.io", 
        "https://noohub.ru", 
        "https://huecker.io", 
        "https://dockerhub.timeweb.cloud", 
        "https://docker.rainbond.cc"
    ]
}
```

`esc` 键，退出编辑模式。

`:wq` 保存。 

```shell
systemctl restart docker
```
