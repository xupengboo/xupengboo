# 如何写一个Dockerfile文件？

现在的项目肯定都离不开docker，只要是流水线部署就会涉及Dockerfile文件，那么如何写一个正确的编写一个Dockerfile文件呢？

建议先熟悉一下Dockerfile的一些语法。

之后就是看案例：

**前端项目(Nginx) DockerFile文件**

- Vue项目，涉及node安装依赖、build打包等操作。

```dockerfile
# 使用 Node.js 镜像 , as build 别名构建阶段
FROM node:14 AS build
# 指定构建目录
WORKDIR /holmes-center-front
# 复制 package.json 和 package-lock.json
COPY package*.json ./
# 安装项目依赖
RUN npm install
# 将宿主机的所有文件，放到指定的WORKDIR工作目录里面来
COPY . .
# 执行 npm run build:prod 命令
RUN npm run build:prod

# 使用官方的 Nginx 镜像
FROM nginx:latest
# 将宿主机的 nginx.conf 文件复制到容器中的 /etc/nginx/ 目录
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
# 从第一build阶段获取dist下的文件移动到容器中的 /usr/share/nginx/html/ 目录
COPY --from=build /holmes-center-front/dist /usr/share/nginx/html/
# 暴露 Nginx 监听的端口，一般为 80，但这里因为是https协议所以要暴露443端口！
EXPOSE 443
# 启动 Nginx 服务
CMD ["nginx", "-g", "daemon off;"]
```

**后端项目 DockerFile文件**

- SpringBoot项目，涉及mvn命令执行，启动jar包等。

```dockerfile
# 选择构建用基础镜像。如需更换，请到[dockerhub官方仓库](https://hub.docker.com/_/java?tab=tags)自行选择后替换。
FROM maven:3.6.0-jdk-8-slim AS build
# 指定构建过程中的工作目录
WORKDIR /holmes-center-server
# 将src目录下所有文件，拷贝到工作目录中src目录下（.gitignore/.dockerignore中文件除外）
COPY holmes-admin /holmes-center-server/holmes-admin
COPY holmes-common /holmes-center-server/holmes-common
COPY holmes-framework /holmes-center-server/holmes-framework
COPY holmes-generator /holmes-center-server/holmes-generator
COPY holmes-quartz /holmes-center-server/holmes-quartz
COPY holmes-system /holmes-center-server/holmes-system
# 将pom.xml文件和settings.xml文件，拷贝到工作目录下
COPY settings.xml pom.xml /holmes-center-server/
# 自定义settings.xml, 选用国内镜像源以提高下载速度
RUN mvn -s /holmes-center-server/settings.xml -f /holmes-center-server/pom.xml clean package

# 基础镜像
FROM  openjdk:8-jre
# author
MAINTAINER holmes
# 指定路径
WORKDIR /holmes-center-server
# 复制jar文件到路径
COPY --from=build /holmes-center-server/holmes-admin/target/*.jar .
# 启动认证服务
ENTRYPOINT ["java","-jar","-Dspring.profiles.active=prod","holmes-admin.jar"]
```

**Redis DockerFile文件**

```DockerFile
# 基础镜像
FROM redis:5.0.10
MAINTAINER holmes

# 挂载目录
VOLUME /home/holmes/redis
# 创建目录
RUN mkdir -p /home/holmes/redis
# 指定路径
WORKDIR /home/holmes/redis
# 复制conf文件到路径
COPY /docker/redis/redis.conf /home/holmes/redis/redis.conf
# 启动redis服务
ENTRYPOINT ["redis-server","/home/holmes/redis/redis.conf"]
```

**下面就是说几个碰到的棘手的命令**：

**COPY 指令 作用：很简单就是复制宿主机的文件到容器中**

- **如果添加了--from=xxx，那就不一样了**，例如：

```dockerfile
# 这个指的是复制宿主机中的/holmes/dist到/usr/share/nginx/html/中。
COPY /holmes/dist /usr/share/nginx/html/

# 加上了--from=build，就是复制来自build阶段的/holmes-center-front/dist内容到/usr/share/nginx/html/下面，就不是宿主机了。
# 一般常用于多个阶段镜像构建当中，就和上面案例一样
COPY --from=build /holmes-center-front/dist /usr/share/nginx/html/
```

- **如果没添加--from=xxx，第一个参数就是指定宿主机相关文件，第二个参数是指定容器相关文件的，不要混淆**。为什么强调这个事情，因为，每次写dockerfile文件时，写着写着就混淆了，举个例子：

```dockerfile
...
# 复制 package.json 和 package-lock.json
COPY package*.json ./
# 安装项目依赖
RUN npm install
# 将宿主机的所有文件，放到指定的WORKDIR工作目录里面来
COPY . .
# 执行 npm run build:prod 命令，这样容器中就有了dist压缩目录
RUN npm run build:prod

# 前面我将dist包build出来了，但是第一印象却是用COPY来操作的，这就不对了。。。
# 错误案例：COPY dist /usr/share/nginx/html/ 这样他就去宿主机找dist文件，一般不会存在！

# 正确应该是下面的执行mv，是容器内部执行命令才对。
RUN mv dist/* /usr/share/nginx/html/
# 如果涉及多个镜像阶段，那就通过--from=xxx来操作了。
```

- **" . " 代表当前目录下所有文件**，例如：

```dockerfile
# 指定构建目录
WORKDIR /holmes
# 将当前目录下所有文件，转移holmes目录
COPY . /holmes
```

**RUN 指令**：就是执行命令。灵活运用即可，有时候也可以执行 ls、pwd命令，排除一些错误等等。
