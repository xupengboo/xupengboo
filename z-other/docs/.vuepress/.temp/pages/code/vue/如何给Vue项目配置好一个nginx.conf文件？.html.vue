<template><div><h1 id="如何给vue项目配置好一个nginx-conf文件" tabindex="-1"><a class="header-anchor" href="#如何给vue项目配置好一个nginx-conf文件"><span>如何给Vue项目配置好一个nginx.conf文件？</span></a></h1>
<p>一般前端项目中，会有一个docker/nginx/nginx.conf文件，用于配置DockerFile配置等。</p>
<p><img src="https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240912163324035.png" alt="image-20240912163324035"></p>
<p>那么，如何给项目写好一个nginx.conf文件，以DockerFile为例：</p>
<div class="language-Dockerfile line-numbers-mode" data-highlighter="prismjs" data-ext="Dockerfile" data-title="Dockerfile"><pre v-pre><code><span class="line"># 使用 Node.js 镜像 , as build 别名构建阶段</span>
<span class="line">FROM node:14 AS build</span>
<span class="line"># 指定构建目录</span>
<span class="line">WORKDIR /holmes-center-front</span>
<span class="line"># 复制 package.json 和 package-lock.json</span>
<span class="line">COPY package*.json ./</span>
<span class="line"># 安装项目依赖</span>
<span class="line">RUN npm install</span>
<span class="line"># 将宿主机的所有文件，放到指定的WORKDIR工作目录里面来</span>
<span class="line">COPY . .</span>
<span class="line"># 执行 npm run build:prod 命令</span>
<span class="line">RUN npm run build:prod</span>
<span class="line"></span>
<span class="line"># 使用官方的 Nginx 镜像</span>
<span class="line">FROM nginx:latest</span>
<span class="line"># 将宿主机的 nginx.conf 文件复制到容器中的 /etc/nginx/ 目录</span>
<span class="line">COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf</span>
<span class="line"># 从第一build阶段获取dist下的文件移动到容器中的 /usr/share/nginx/html/ 目录</span>
<span class="line">COPY --from=build /holmes-center-front/dist /usr/share/nginx/html/</span>
<span class="line"># 暴露 Nginx 监听的端口，一般为 80，但这里因为是https协议所以要暴露443端口！</span>
<span class="line">EXPOSE 443</span>
<span class="line"># 启动 Nginx 服务</span>
<span class="line">CMD [&quot;nginx&quot;, &quot;-g&quot;, &quot;daemon off;&quot;]</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol>
<li>首先，要有一个nginx.conf文件原型，根据自己配置的nginx版本去官方拉取、通过docker创建个容器copy一下也可以。</li>
</ol>
<ul>
<li>第一种方式：直接修改nginx.conf文件，替换nginx.conf文件，上面采用的就是这种方式，无论什么配置直接都在nginx.conf文件操作即可。</li>
<li>第二种方式：也可以通过<code v-pre>include /etc/nginx/conf.d/*.conf;</code>配置，单独配置。一般用来配置server等。
<img src="https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240912163304140.png" alt="image-20240912163304140"></li>
</ul>
<ol start="2">
<li>确定需要的配置，需要几个进程、几个server、监听的端口是多少、location该怎么配置等。</li>
</ol>
<div class="language-nginx.conf line-numbers-mode" data-highlighter="prismjs" data-ext="nginx.conf" data-title="nginx.conf"><pre v-pre><code><span class="line">user  nginx;</span>
<span class="line">worker_processes  1;</span>
<span class="line"></span>
<span class="line">error_log  /var/log/nginx/error.log warn;</span>
<span class="line">pid        /var/run/nginx.pid;</span>
<span class="line"></span>
<span class="line"></span>
<span class="line">events {</span>
<span class="line">    worker_connections  1024;</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line"></span>
<span class="line">http {</span>
<span class="line">    include       /etc/nginx/mime.types;</span>
<span class="line">    default_type  application/octet-stream;</span>
<span class="line"></span>
<span class="line">    log_format  main  '$remote_addr - $remote_user [$time_local] &quot;$request&quot; '</span>
<span class="line">                      '$status $body_bytes_sent &quot;$http_referer&quot; '</span>
<span class="line">                      '&quot;$http_user_agent&quot; &quot;$http_x_forwarded_for&quot;';</span>
<span class="line"></span>
<span class="line">    access_log  /var/log/nginx/access.log  main;</span>
<span class="line"></span>
<span class="line">    sendfile        on;</span>
<span class="line">    # tcp_nopush     on;</span>
<span class="line"></span>
<span class="line">    keepalive_timeout  65;</span>
<span class="line"></span>
<span class="line">    client_max_body_size 8M; # 根据实际情况设置更大的值</span>
<span class="line">    large_client_header_buffers 4 32k; # 根据实际情况设置更大的值</span>
<span class="line"></span>
<span class="line">    # gzip  on;</span>
<span class="line"></span>
<span class="line">    server {</span>
<span class="line">        listen       443;</span>
<span class="line">        server_name  www.holmesfront.com;</span>
<span class="line"></span>
<span class="line">        index  index.html index.htm;</span>
<span class="line">        error_page  404              /404.html;</span>
<span class="line">        error_page  500 502 503 504  /50x.html;</span>
<span class="line"></span>
<span class="line">        # 生产环境</span>
<span class="line">        location /prod-api/ {</span>
<span class="line">          # 由于报错：431 请求头过大，所以暂时注释以下内容</span>
<span class="line">          # proxy_set_header Host $http_host;</span>
<span class="line">          # proxy_set_header X-Real-IP $remote_addr;</span>
<span class="line">          # proxy_set_header REMOTE-HOST $remote_addr;</span>
<span class="line">          # proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;</span>
<span class="line">          rewrite ^/prod-api(/.*)$ $1 break;</span>
<span class="line">          # 根据 微信云托管环境变量 配置</span>
<span class="line">          proxy_pass https://www.holmesserver.com/;</span>
<span class="line">        }</span>
<span class="line"></span>
<span class="line">        location = /login {</span>
<span class="line">            return 301 /index.html;</span>
<span class="line">        }</span>
<span class="line"></span>
<span class="line">        location / {</span>
<span class="line">          root /usr/share/nginx/html;</span>
<span class="line">          try_files $uri $uri/ /index.html;</span>
<span class="line">          index  index.html index.htm;</span>
<span class="line">        }</span>
<span class="line"></span>
<span class="line">        location = /50x.html {</span>
<span class="line">            root   /usr/share/nginx/html;</span>
<span class="line">        }</span>
<span class="line"></span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    include /etc/nginx/conf.d/*.conf;</span>
<span class="line"></span>
<span class="line">}</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3">
<li>下面说几个特别容易忽视的问题：</li>
</ol>
<p><strong>端口号 和 协议</strong>：搞明白你是http还是https，一个80端口一个443端口。</p>
<ul>
<li>平时配置80端口配置多了就容易忽视。这次配置微信云托管，给予的就是443端口，无论是微信云托管、DockerFile还是Nginx.conf一般默认暴露的端口都是80端口，没注意，排查了好久。。。才发现这个问题，纯属浪费时间。</li>
</ul>
<p><strong>try_files 指令</strong>：用于在文件系统中查找文件，并在找不到文件时执行指定的操作。在上下文中，<code v-pre>try_files $uri $uri/ /index.html;</code> 的作用如下：</p>
<ul>
<li>$uri： 首先尝试匹配请求的 URI 对应的文件。如果该文件存在，Nginx会直接返回该文件。</li>
<li>$uri/： 如果上述步骤未成功，尝试查找与请求 URI 相关联的目录。如果找到目录，Nginx会尝试使用默认的索引文件（通常是 index.html）。如果找到目录并存在索引文件，Nginx会返回该文件。</li>
<li>/index.html： 如果前两步都失败，最后一步是将请求重定向到 /index.html。这通常<strong>用于单页应用（SPA）的路由，就是Vue等单页面应用用的很多</strong>，其中前端路由负责处理路径，而后端始终返回主页。</li>
</ul>
<blockquote>
<p>🚨Tips：不配置try_files，像Vue的前端路由就不会起作用，nginx配置对应的location只会检索本地或者代理服务器。</p>
</blockquote>
</div></template>


