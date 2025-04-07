---
title: DolphinScheduler 工具
order: 10
icon: simple-icons:apachedolphinscheduler
---

## 1. DolphinScheduler 

以官方为准：https://dolphinscheduler.apache.org/zh-cn/docs/3.2.2/guide/homepage

Github 地址：https://github.com/apache/dolphinscheduler/tree/3.2.2-release

## 2. DolphinScheduler 部署

### 2.1 Docker 单节点启动（standalone-server）

适合学习使用，以 [3.2.2](https://github.com/apache/dolphinscheduler/tree/3.2.2-release) 版本为例，使用 PostgreSQL 作为外部存储：

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

### 2.2 二进制安装

见：[DolphinScheduler - 单机部署](https://dolphinscheduler.apache.org/zh-cn/docs/3.2.2/guide/installation/standalone)

```shell
# 下载二进制安装包
curl -O -L https://dlcdn.apache.org/dolphinscheduler/3.2.2/apache-dolphinscheduler-3.2.2-bin.tar.gz
# 解压并运行 Standalone Server
tar -xvzf apache-dolphinscheduler-*-bin.tar.gz
chmod -R 755 apache-dolphinscheduler-*-bin
cd apache-dolphinscheduler-*-bin
bash ./bin/dolphinscheduler-daemon.sh start standalone-server
```

配置环境变量，服务启动时，会根据环境变量来运行：

```bash
export DATABASE=postgresql
export SPRING_PROFILES_ACTIVE=${DATABASE}
export SPRING_DATASOURCE_URL="jdbc:postgresql://192.168.10.66:5432/dolphinscheduler"
export SPRING_DATASOURCE_USERNAME=ds_user
export SPRING_DATASOURCE_PASSWORD=0818
```

启动、停止、查看服务：
```bash
# 启动 Standalone Server 服务
bash ./bin/dolphinscheduler-daemon.sh start standalone-server
# 停止 Standalone Server 服务
bash ./bin/dolphinscheduler-daemon.sh stop standalone-server
# 查看 Standalone Server 状态
bash ./bin/dolphinscheduler-daemon.sh status standalone-server
```


## 3. 集成DataX

1. 安装 DataX ， 见：[DataX 工具 - 上一篇章]
2. 自己构建 Dockerfile 方式，集成 `python`、`java`、`mvn` 到 ds 镜像中：

```dockerfile
# 使用 DolphinScheduler 官方镜像作为基础
FROM apache/dolphinscheduler-standalone-server:3.2.2

# 安装 Python 2.7
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        python2.7 \
        ca-certificates \
        curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 手动安装 Maven 3.9.6
ENV MAVEN_VERSION=3.9.6
ENV MAVEN_HOME=/opt/maven

RUN curl -L https://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz | tar -xz -C /opt && \
    mv /opt/apache-maven-${MAVEN_VERSION} /opt/maven && \
    ln -s /opt/maven/bin/mvn /usr/bin/mvn

# 配置 Python 2.7 为默认 Python
RUN ln -sf /usr/bin/python2.7 /usr/bin/python
```

3. 启动 DolphinScheduler 时，添加 `-v /opt/datax:/opt/datax` 。

```shell
docker run --name dolphinscheduler \
  -p 12345:12345 -p 25333:25333 \
  -v /opt/datax:/opt/datax/ \
  -v /opt/dolphinscheduler/conf:/opt/dolphinscheduler/conf \
  -v /opt/dolphinscheduler/libs:/opt/dolphinscheduler/libs \
  -e SPRING_DATASOURCE_URL="jdbc:postgresql://192.168.10.66:5432/dolphinscheduler" \
  -e SPRING_DATASOURCE_USERNAME=ds_user \
  -e SPRING_DATASOURCE_PASSWORD=0818\
  -e SPRING_PROFILES_ACTIVE=postgresql \
  -d dolphinscheduler-python2-maven:3.2.2
```

4. 配置 ds 的环境管理，创建一个环境：

![image-20250407151604853](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250407151604853.png)

```shell
export PYTHON_LAUNCHER=/usr/bin/python
export DATAX_LAUNCHER=/opt/datax/bin/datax.py
export JAVA_HOME=/opt/java/openjdk
export PATH=$JAVA_HOME/bin:$PATH
```

![image-20250407151720741](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250407151720741.png)

:::tip

DolphinScheduler 在执行任务时，会根据自己内部的任务配置和环境管理，把需要的环境变量和参数写入到生成的执行脚本中，而不会简单地继承容器或宿主机的全局环境。

因此，为了确保任务执行时拥有正确的环境，**你需要在 DolphinScheduler 的环境管理中配置好相应的变量，或者在任务的自定义配置中将这些变量明确写入任务脚本**。这样生成的脚本就会包含完整的命令路径和环境配置，从而保证 DataX 或其他任务能够正确运行。

:::



