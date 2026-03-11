---
title: Dockerfile 构建
outline: deep
---

# Dockerfile 构建

> Dockerfile 是构建 Docker 镜像的文本配置文件，每条指令对应镜像中的一层。流水线部署中几乎都会涉及，掌握常用指令和多阶段构建是核心。

---

## 一、常用指令速查

| 指令 | 说明 | 示例 |
|---|---|---|
| `FROM` | 指定基础镜像（必须是第一条指令） | `FROM node:18-alpine` |
| `WORKDIR` | 设置工作目录，不存在会自动创建 | `WORKDIR /app` |
| `COPY` | 复制文件到镜像，支持 `--from` 跨阶段 | `COPY . .` |
| `ADD` | 类似 COPY，额外支持解压 tar 和远程 URL | `ADD app.tar.gz /app` |
| `RUN` | 构建时执行命令（每条 RUN 新增一层） | `RUN npm install` |
| `CMD` | 容器启动时的默认命令（可被 `docker run` 覆盖） | `CMD ["nginx", "-g", "daemon off;"]` |
| `ENTRYPOINT` | 容器入口命令（不会被覆盖，参数追加到后面） | `ENTRYPOINT ["java", "-jar"]` |
| `EXPOSE` | 声明容器监听的端口（仅文档作用，需 `-p` 映射） | `EXPOSE 8080` |
| `ENV` | 设置环境变量 | `ENV NODE_ENV=production` |
| `ARG` | 构建时传入的变量（`docker build --build-arg`） | `ARG APP_VERSION=1.0` |
| `VOLUME` | 声明挂载点（运行时挂载，构建时写入无效） | `VOLUME /data` |
| `LABEL` | 添加元数据标签（替代已废弃的 MAINTAINER） | `LABEL maintainer="your@email.com"` |

:::tip CMD vs ENTRYPOINT
- `CMD`：默认命令，`docker run` 后接参数会**替换** CMD
- `ENTRYPOINT`：固定入口，`docker run` 后接参数会**追加**到 ENTRYPOINT 后
- 推荐组合使用：`ENTRYPOINT` 定命令，`CMD` 定默认参数
  :::

---

## 二、多阶段构建

多阶段构建（Multi-stage Build）通过多个 `FROM` 分阶段构建，**只将最终需要的产物复制到运行镜像**，大幅减小最终镜像体积。

```
构建阶段（含编译工具链，体积大）
    └─ COPY --from=build → 运行阶段（仅含运行时，体积小）
```

---

## 三、实战案例

### 前端项目（Vue + Nginx）

```dockerfile
# ── 阶段一：构建 ──────────────────────────────────────────
FROM node:18-alpine AS build

WORKDIR /app

# 先单独复制 package*.json，利用 Docker 层缓存：
# 只要依赖没变，npm install 层就不会重新执行
COPY package*.json ./
RUN npm install

# 再复制源码并打包
COPY . .
RUN npm run build:prod

# ── 阶段二：运行 ──────────────────────────────────────────
FROM nginx:alpine

LABEL maintainer="your@email.com"

# 自定义 Nginx 配置（按需提供）
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf

# 从构建阶段复制打包产物（注意：--from=build 取的是上一阶段，不是宿主机）
COPY --from=build /app/dist /usr/share/nginx/html/

# HTTP：80，HTTPS：443（按实际协议选择）
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

:::tip 关于 EXPOSE 端口
- 使用 HTTP 协议 → `EXPOSE 80`
- 使用 HTTPS 协议 → `EXPOSE 443`
- EXPOSE 本身只是**声明**，实际端口映射需要在 `docker run -p` 中指定
  :::

---

### 后端项目（Spring Boot + Maven）

```dockerfile
# ── 阶段一：Maven 构建 ────────────────────────────────────
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# 先复制 pom.xml 和自定义 settings.xml，利用缓存跳过重复下载依赖
COPY pom.xml settings.xml ./
# 下载依赖（源码未变时此层可复用缓存）
RUN mvn -s settings.xml dependency:go-offline -B

# 再复制各模块源码
COPY xupengboo-admin     ./xupengboo-admin
COPY xupengboo-common    ./xupengboo-common
COPY xupengboo-framework ./xupengboo-framework
COPY xupengboo-system    ./xupengboo-system

# 打包（跳过测试加速构建）
RUN mvn -s settings.xml clean package -DskipTests

# ── 阶段二：运行 ──────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine

LABEL maintainer="your@email.com"

WORKDIR /app

# 将 jar 重命名为固定名称，避免版本号变化导致 ENTRYPOINT 失效
COPY --from=build /app/xupengboo-admin/target/*.jar app.jar

# JVM 参数建议通过环境变量传入，方便运行时动态调整
ENV JAVA_OPTS="-Xms256m -Xmx512m"

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar -Dspring.profiles.active=${SPRING_PROFILE:-prod} app.jar"]
```

:::tip Jar 包名问题
Maven 打包后 jar 包名通常带版本号（如 `xupengboo-admin-1.2.0.jar`），直接 `COPY *.jar app.jar` 统一重命名为 `app.jar`，ENTRYPOINT 就不需要随版本修改。
:::

:::tip JVM 参数建议
通过 `ENV` 或 `docker run -e JAVA_OPTS="-Xmx1g"` 传入，不要硬编码在 ENTRYPOINT 里，方便不同环境调整内存配置。
:::

---

### Redis 自定义配置

```dockerfile
FROM redis:7-alpine

LABEL maintainer="your@email.com"

# 创建工作目录
WORKDIR /etc/redis

# 复制自定义 redis.conf 到容器（在声明 VOLUME 之前完成文件写入）
COPY docker/redis/redis.conf ./redis.conf

# 声明挂载点（运行时持久化数据目录）
# 注意：VOLUME 声明之后对该路径的写操作在构建时不生效，
# 所以配置文件要在 VOLUME 之前 COPY 进来
VOLUME /data

EXPOSE 6379

ENTRYPOINT ["redis-server", "/etc/redis/redis.conf"]
```

:::warning VOLUME 与文件写入的顺序问题
`VOLUME` 声明之后，在 Dockerfile 中对该挂载路径的任何写操作（`COPY`、`RUN`）都**不会生效**。
务必在 `VOLUME` 指令**之前**完成所有需要写入的文件操作。
:::

---

## 四、COPY 指令详解

COPY 是 Dockerfile 里最容易混淆的指令，核心规则：

```
COPY <宿主机路径>  <容器路径>       # 从宿主机复制到容器
COPY --from=阶段名 <阶段路径> <容器路径>  # 从上一构建阶段复制
```

### 常见场景对比

```dockerfile
# ✅ 从宿主机复制所有文件到容器工作目录
COPY . .

# ✅ 从宿主机复制指定文件
COPY package*.json ./
COPY nginx.conf /etc/nginx/nginx.conf

# ✅ 多阶段构建：从 build 阶段的产物复制（不是宿主机！）
COPY --from=build /app/dist /usr/share/nginx/html/

# ❌ 常见错误：误以为可以 COPY 容器内已生成的文件
# 如果 dist 是容器内 npm run build 生成的，不能这样写：
# COPY dist /usr/share/nginx/html/    ← 会去宿主机找 dist，通常不存在！

# ✅ 正确做法：用 RUN 执行容器内移动命令，或用多阶段 --from
RUN mv /app/dist/* /usr/share/nginx/html/
```

### `.` 的含义

```dockerfile
WORKDIR /app

COPY . .
# 等价于：将宿主机当前构建上下文目录下的所有文件，复制到容器的 /app 目录
# 第一个 . → 宿主机：构建上下文（即 docker build 命令执行的目录）
# 第二个 . → 容器：当前 WORKDIR，即 /app
```

---

## 五、常用优化技巧

### 利用层缓存加速构建

```dockerfile
# ✅ 推荐：先复制依赖文件，再复制源码
# 依赖不变时，npm install 层直接走缓存
COPY package*.json ./
RUN npm install
COPY . .

# ❌ 不推荐：源码变了就会重新 npm install，浪费时间
COPY . .
RUN npm install
```

### 使用 .dockerignore

在项目根目录创建 `.dockerignore`，排除不需要打包进镜像的文件，减少构建上下文大小：

```
node_modules
dist
.git
.env
*.log
target
```

### 合并 RUN 减少镜像层数

```dockerfile
# ❌ 每条 RUN 新增一层
RUN apt-get update
RUN apt-get install -y curl
RUN rm -rf /var/lib/apt/lists/*

# ✅ 合并为一条，减少层数并清理缓存
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*
```

### 优先选择 Alpine 镜像

```dockerfile
# 标准镜像（~1GB）
FROM node:18

# Alpine 版本（~50MB），体积缩小 20 倍
FROM node:18-alpine
```
