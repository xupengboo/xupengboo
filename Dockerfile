# 使用 Git 镜像，添加 Git 工具
FROM bitnami/git:2.40.0 AS git
# 指定工作目录
WORKDIR /home
# 拉取 Git 仓库（如果需要的话，可以根据需要更改 git clone 的 URL）
# RUN git clone https://github.com/xupengboo/xupengboo.git /home
RUN git clone https://gitee.com/xupengboo/xupengboo.git /home
# 使用 Node.js 镜像 , as build 别名构建阶段
FROM node:20.9.0 AS build
# 复制git文件
COPY --from=git /home /home
# 安装项目依赖
RUN npm install --registry=https://registry.npmmirror.com
# 执行 npm run build:prod 命令
RUN npm run docs:build
# 使用官方的 Nginx 镜像
FROM nginx:latest
# 将宿主机的 nginx.conf 文件复制到容器中的 /etc/nginx/ 目录
COPY nginx.conf /etc/nginx/nginx.conf
# 从第一build阶段获取dist下的文件移动到容器中的 /usr/share/nginx/html/ 目录
COPY --from=build /home/src/.vuepress/dist /usr/share/nginx/html/
# 暴露 Nginx 监听的端口，一般为 80，但这里因为是https协议所以要暴露443端口！
EXPOSE 80
# 启动 Nginx 服务
CMD ["nginx", "-g", "daemon off;"]
