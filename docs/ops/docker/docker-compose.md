---
title: Docker Compose 安装
description: 本文介绍了 Docker Compose 的安装方法。
keywords: Docker Compose
---

## 二进制安装
~~~shell
//指定版本安装：
$ sudo curl -L https://get.daocloud.io/docker/compose/releases/download/1.23.1/\
docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose

//对二进制文件赋可执行权限
$ sudo chmod +x /usr/local/bin/docker-compose
~~~
## yum源安装
~~~shell
$ yum -y install docker-compose
~~~
## 测试安装是否成功
~~~shell
$ docker-compose --version
docker-compose version 1.23.1, build 1719ceb
~~~
