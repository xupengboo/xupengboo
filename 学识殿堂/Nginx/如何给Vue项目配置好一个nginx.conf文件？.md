# 如何给Vue项目配置好一个nginx.conf文件？

一般前端项目中，会有一个docker/nginx/nginx.conf文件，用于配置DockerFile或者Jenkins等等配置。

![image](https://github.com/ITholmes/hello-world/assets/70437837/ffdc4da0-3ba9-4817-8560-541be2cad5fa)

那么，如何给项目写好一个nginx.conf文件，以DockerFile为例：
```Dockerfile
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

1. 首先，要有一个nginx.conf文件原型，根据自己配置的nginx版本去官方拉取、通过docker创建个容器copy一下也可以。
- 第一种方式：直接修改nginx.conf文件，替换nginx.conf文件，上面采用的就是这种方式，无论什么配置直接都在nginx.conf文件操作即可。
- 第二种方式：也可以通过`include /etc/nginx/conf.d/*.conf;`配置，单独配置。一般用来配置server等。
![image](https://github.com/ITholmes/hello-world/assets/70437837/4aac2c7d-5db1-48b6-bc26-000658837b99)

2. 确定自己配置，需要几个server、监听的端口是多少、location该怎么配置等。
```nginx.conf
user  nginx;
worker_processes  1;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    # tcp_nopush     on;

    keepalive_timeout  65;

    client_max_body_size 8M; # 根据实际情况设置更大的值
    large_client_header_buffers 4 32k; # 根据实际情况设置更大的值

    # gzip  on;

    server {
        listen       443;
        server_name  holmes-center-front-86714-6-1323419690.sh.run.tcloudbase.com;

        index  index.html index.htm;
        error_page  404              /404.html;
        error_page  500 502 503 504  /50x.html;

        # 生产环境
        location /prod-api/ {
          # 由于报错：431 请求头过大，所以暂时注释以下内容
          # proxy_set_header Host $http_host;
          # proxy_set_header X-Real-IP $remote_addr;
          # proxy_set_header REMOTE-HOST $remote_addr;
          # proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          rewrite ^/prod-api(/.*)$ $1 break;
          # 根据 微信云托管环境变量 配置
          proxy_pass https://holmes-center-server-86714-6-1323419690.sh.run.tcloudbase.com/;
        }

        location = /login {
            return 301 /index.html;
        }

        location / {
          root /usr/share/nginx/html;
          try_files $uri $uri/ /index.html;
          index  index.html index.htm;
        }

        location = /50x.html {
            root   /usr/share/nginx/html;
        }

    }

    include /etc/nginx/conf.d/*.conf;

}
```

3. 下面说几个特别容易忽视的问题：

**端口号 和 协议**：搞明白你是http还是https，一个80端口一个443端口，平时配置80端口配置多了就容易忽视。这次配置微信云托管，给予的就是443端口，但是无论微信云托管、DockerFile、Nginx.conf一般默认暴露的端口都是80端口，没注意，排查了好久。。。才发现这个问题，纯属浪费时间。

**try_files 指令用于在文件系统中查找文件，并在找不到文件时执行指定的操作。**
在上下文中，`try_files $uri $uri/ /index.html;` 的作用如下：
- $uri： 首先尝试匹配请求的 URI 对应的文件。如果该文件存在，Nginx会直接返回该文件。
- $uri/： 如果上述步骤未成功，尝试查找与请求 URI 相关联的目录。如果找到目录，Nginx会尝试使用默认的索引文件（通常是 index.html）。如果找到目录并存在索引文件，Nginx会返回该文件。
- /index.html： 如果前两步都失败，最后一步是将请求重定向到 /index.html。这通常**用于单页应用（SPA）的路由，就是Vue等单页面应用用的很多**，其中前端路由负责处理路径，而后端始终返回主页。
> 🚨Tips：不配置try_files，像Vue的前端路由就不会起作用，nginx配置对应的location只会检索本地或者代理服务器。

