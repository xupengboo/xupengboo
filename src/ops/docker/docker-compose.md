---
title: Docker Compose 安装
order: 5
---

## 1. 二进制安装
```shell
# 指定版本安装
curl -L https://github.com/docker/compose/releases/download/1.23.1/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose

# 对二进制文件赋可执行权限
sudo chmod +x /usr/local/bin/docker-compose
```
:::tip
Docker Compose 其他版本：https://github.com/docker/compose/releases
:::

## 2. yum源安装
```shell
yum -y install docker-compose
```

## 3. 测试安装是否成功

```shell
docker-compose --version
docker-compose version 1.23.1, build 1719ceb
```
