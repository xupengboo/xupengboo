---
title: DolphinScheduler 工具
order: 10
icon: simple-icons:apachedolphinscheduler
---

## DolphinScheduler 

以官方为准：https://dolphinscheduler.apache.org/zh-cn/docs/3.2.2/guide/homepage

Github 地址：https://github.com/apache/dolphinscheduler/tree/3.2.2-release

## Docker单节点启动（standalone-server）

以 [3.2.2](https://github.com/apache/dolphinscheduler/tree/3.2.2-release) 版本为例，使用 PostgreSQL 作为外部存储：

:::tip
Standalone server 使用 H2 数据库作为其元数据存储数据，这是为了上手简单，用户在启动服务器之前不需要启动数据库。**要知道的是 H2 数据库是一个内存数据库， 服务重启server后，数据将会丢失**。
:::

1. 准备一个 PostgreSQL 数据库

```shell
docker run -d \
 --name postgres \
 -e POSTGRES_PASSWORD=0818 \
 -e POSTGRES_USER=root \
 -e POSTGRES_DB=postgres \
 -v /opt/postgresql/data:/var/lib/postgresql/data \
 -p 5432:5432 \
 postgres:latest
```

2. PostgreSQL 数据库初始化：

```sql
CREATE DATABASE dolphinscheduler;
CREATE USER ds_user PASSWORD '0818';
ALTER DATABASE dolphinscheduler OWNER TO ds_user;
ALTER SYSTEM SET listen_addresses = '*';
```

3. SQL初始化：[PostgreSQL 初始化SQL脚本](https://raw.githubusercontent.com/apache/dolphinscheduler/3.2.2/dolphinscheduler-dao/src/main/resources/sql/dolphinscheduler_postgresql.sql) ，部署到上面的库中，注意：要使用对应账号来导入脚本，不然容易出现权限问题。

![image-20250403175146326](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250403175146326.png)

4. 提前将 `dolphinscheduler-standalone-server` 必要的一些配置以及依赖复制出来。

```shell
# 用来获取
docker run --name dolphinscheduler-standalone-server -p 12345:12345 -p 25333:25333 -d apache/dolphinscheduler-standalone-server:3.2.2

# 复制出必要文件出来：
docker cp dolphinscheduler-standalone-server:/opt/dolphinscheduler/conf/ /opt/dolphinscheduler/conf/
docker cp dolphinscheduler-standalone-server:/opt/dolphinscheduler/libs/ /opt/dolphinscheduler/libs/
```

5. 启动 `dolphinscheduler-standalone-server` 

```shell
docker run --name dolphinscheduler \
  -p 12345:12345 -p 25333:25333 \
  -v /opt/dolphinscheduler/conf:/opt/dolphinscheduler/conf \
  -v /opt/dolphinscheduler/libs:/opt/dolphinscheduler/libs \
  -e SPRING_DATASOURCE_URL="jdbc:postgresql://192.168.10.66:5432/dolphinscheduler" \
  -e SPRING_DATASOURCE_USERNAME=ds_user \
  -e SPRING_DATASOURCE_PASSWORD=0818\
  -e SPRING_PROFILES_ACTIVE=postgresql \
  -d apache/dolphinscheduler-standalone-server:3.2.2
```

