---
title: DolphinScheduler 工具
outline: deep
---

# DolphinScheduler 工具

**Apache DolphinScheduler** 是一个分布式、易扩展的可视化 DAG 工作流任务调度平台，专为大数据场景设计，支持多种任务类型（Shell、Python、Spark、Flink、DataX 等）的调度与编排。

> 📖 官方文档：https://dolphinscheduler.apache.org/zh-cn/docs/3.2.2/guide/homepage
>
> 🐙 GitHub：https://github.com/apache/dolphinscheduler/tree/3.2.2-release

---

## 一、部署方式

### 方式一：Docker 单节点（Standalone）

适合**本地学习和快速验证**，以 3.2.2 版本 + PostgreSQL 外部存储为例。

:::warning Standalone 默认使用 H2 内存数据库
H2 数据库数据存在内存中，**服务重启后数据全部丢失**。生产环境请务必切换为 PostgreSQL 或 MySQL 外部存储。
:::

**Step 1 — 启动 PostgreSQL**

```shell
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
  -e POSTGRES_USER=root \
  -e POSTGRES_DB=postgres \
  -v /opt/postgresql/data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:latest
```

**Step 2 — 初始化数据库**

```sql
CREATE DATABASE dolphinscheduler;
CREATE USER ds_user PASSWORD 'your_password';
ALTER DATABASE dolphinscheduler OWNER TO ds_user;
ALTER SYSTEM SET listen_addresses = '*';
```

**Step 3 — 导入初始化 SQL**

下载并执行 [PostgreSQL 初始化 SQL 脚本](https://raw.githubusercontent.com/apache/dolphinscheduler/3.2.2/dolphinscheduler-dao/src/main/resources/sql/dolphinscheduler_postgresql.sql)。

:::tip 权限提示
导入脚本时请使用 `ds_user` 账号执行，避免出现对象权限问题。
:::

![初始化SQL导入示意](/public/images/image-20250403175146326.png)

**Step 4 — 提取默认配置文件**

先启动一个临时容器，把必要的配置和依赖复制出来：

```shell
# 启动临时容器
docker run --name dolphinscheduler-standalone-server \
  -p 12345:12345 -p 25333:25333 \
  -d apache/dolphinscheduler-standalone-server:3.2.2

# 将配置和依赖复制到宿主机
docker cp dolphinscheduler-standalone-server:/opt/dolphinscheduler/conf/ /opt/dolphinscheduler/conf/
docker cp dolphinscheduler-standalone-server:/opt/dolphinscheduler/libs/ /opt/dolphinscheduler/libs/

# 复制完成后可删除临时容器
docker rm -f dolphinscheduler-standalone-server
```

**Step 5 — 正式启动**

```shell
docker run --name dolphinscheduler \
  -p 12345:12345 -p 25333:25333 \
  -v /opt/dolphinscheduler/conf:/opt/dolphinscheduler/conf \
  -v /opt/dolphinscheduler/libs:/opt/dolphinscheduler/libs \
  -e SPRING_DATASOURCE_URL="jdbc:postgresql://192.168.10.66:5432/dolphinscheduler" \
  -e SPRING_DATASOURCE_USERNAME=ds_user \
  -e SPRING_DATASOURCE_PASSWORD=${DS_PASSWORD} \
  -e SPRING_PROFILES_ACTIVE=postgresql \
  -d apache/dolphinscheduler-standalone-server:3.2.2
```

启动后访问：`http://localhost:12345/dolphinscheduler`，默认账号密码 `admin / dolphinscheduler123`。

---

### 方式二：二进制安装

> 官方文档：[单机部署指南](https://dolphinscheduler.apache.org/zh-cn/docs/3.2.2/guide/installation/standalone)

**下载并启动：**

```shell
# 下载二进制包
curl -O -L https://dlcdn.apache.org/dolphinscheduler/3.2.2/apache-dolphinscheduler-3.2.2-bin.tar.gz

# 解压
tar -xvzf apache-dolphinscheduler-*-bin.tar.gz
chmod -R 755 apache-dolphinscheduler-*-bin
cd apache-dolphinscheduler-*-bin

# 启动
bash ./bin/dolphinscheduler-daemon.sh start standalone-server
```

**配置外部数据库（环境变量方式）：**

```bash
export DATABASE=postgresql
export SPRING_PROFILES_ACTIVE=${DATABASE}
export SPRING_DATASOURCE_URL="jdbc:postgresql://192.168.10.66:5432/dolphinscheduler"
export SPRING_DATASOURCE_USERNAME=ds_user
export SPRING_DATASOURCE_PASSWORD=your_password   # 建议从安全配置中读取
```

**服务管理命令：**

```bash
# 启动
bash ./bin/dolphinscheduler-daemon.sh start standalone-server
# 停止
bash ./bin/dolphinscheduler-daemon.sh stop standalone-server
# 查看状态
bash ./bin/dolphinscheduler-daemon.sh status standalone-server
```

---

## 二、集成 DataX

> DataX 是阿里开源的异构数据源离线同步工具，与 DolphinScheduler 集成后可在调度平台中可视化配置和触发数据同步任务。

### 1. 构建集成镜像

官方镜像不含 Python 2 和 Maven（DataX 运行所需），需要自定义 Dockerfile：

```dockerfile
# 基于官方镜像扩展
FROM apache/dolphinscheduler-standalone-server:3.2.2

# 安装 Python 2.7（DataX 依赖）
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        python2.7 \
        ca-certificates \
        curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 安装 Maven 3.9.6
ENV MAVEN_VERSION=3.9.6
ENV MAVEN_HOME=/opt/maven

RUN curl -L https://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz \
    | tar -xz -C /opt && \
    mv /opt/apache-maven-${MAVEN_VERSION} /opt/maven && \
    ln -s /opt/maven/bin/mvn /usr/bin/mvn

# 将 python2.7 设为默认 python
RUN ln -sf /usr/bin/python2.7 /usr/bin/python
```

构建镜像：

```shell
docker build -t dolphinscheduler-datax:3.2.2 .
```

### 2. 启动容器（挂载 DataX 目录）

```shell
docker run --name dolphinscheduler \
  -p 12345:12345 -p 25333:25333 \
  -v /opt/datax:/opt/datax \
  -v /opt/dolphinscheduler/conf:/opt/dolphinscheduler/conf \
  -v /opt/dolphinscheduler/libs:/opt/dolphinscheduler/libs \
  -e SPRING_DATASOURCE_URL="jdbc:postgresql://192.168.10.66:5432/dolphinscheduler" \
  -e SPRING_DATASOURCE_USERNAME=ds_user \
  -e SPRING_DATASOURCE_PASSWORD=${DS_PASSWORD} \
  -e SPRING_PROFILES_ACTIVE=postgresql \
  -d dolphinscheduler-datax:3.2.2
```

### 3. 配置环境管理

在 DolphinScheduler 管理后台 → **安全中心 → 环境管理** 中，新建一个环境并填入以下变量：

```shell
export PYTHON_LAUNCHER=/usr/bin/python
export DATAX_LAUNCHER=/opt/datax/bin/datax.py
export JAVA_HOME=/opt/java/openjdk
export PATH=$JAVA_HOME/bin:$PATH
```

![环境管理配置](/public/images/image-20250407151604853.png)

创建完成后，在任务配置中关联该环境即可：

![任务关联环境](/public/images/image-20250407151720741.png)

:::tip 为什么要在 DS 中单独配置环境变量？
DolphinScheduler 执行任务时，会将任务配置和环境管理中的变量**写入生成的执行脚本**，而不会继承容器或宿主机的全局环境变量。

因此，哪怕宿主机上已经配置了 `DATAX_LAUNCHER`，DS 任务执行时也不会自动读取。**必须在 DS 环境管理中显式声明**，才能保证任务脚本包含完整的路径和环境配置。
:::
