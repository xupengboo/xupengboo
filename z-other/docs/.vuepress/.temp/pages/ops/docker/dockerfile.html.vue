<template><div><h1 id="如何写一个dockerfile文件" tabindex="-1"><a class="header-anchor" href="#如何写一个dockerfile文件"><span>如何写一个Dockerfile文件？</span></a></h1>
<p>现在的项目肯定都离不开docker，只要是流水线部署就会涉及Dockerfile文件，那么如何写一个正确的编写一个Dockerfile文件呢？</p>
<p>建议先熟悉一下Dockerfile的一些语法。</p>
<p>之后就是看案例：</p>
<p><strong>前端项目(Nginx) DockerFile文件</strong></p>
<ul>
<li>Vue项目，涉及node安装依赖、build打包等操作。</li>
</ul>
<div class="language-docker line-numbers-mode" data-highlighter="prismjs" data-ext="docker" data-title="docker"><pre v-pre><code><span class="line"><span class="token comment"># 使用 Node.js 镜像 , as build 别名构建阶段</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">FROM</span> node:14 <span class="token keyword">AS</span> build</span></span>
<span class="line"><span class="token comment"># 指定构建目录</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">WORKDIR</span> /holmes-center-front</span></span>
<span class="line"><span class="token comment"># 复制 package.json 和 package-lock.json</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> package*.json ./</span></span>
<span class="line"><span class="token comment"># 安装项目依赖</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">RUN</span> npm install</span></span>
<span class="line"><span class="token comment"># 将宿主机的所有文件，放到指定的WORKDIR工作目录里面来</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> . .</span></span>
<span class="line"><span class="token comment"># 执行 npm run build:prod 命令</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">RUN</span> npm run build:prod</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用官方的 Nginx 镜像</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">FROM</span> nginx:latest</span></span>
<span class="line"><span class="token comment"># 将宿主机的 nginx.conf 文件复制到容器中的 /etc/nginx/ 目录</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> docker/nginx/nginx.conf /etc/nginx/nginx.conf</span></span>
<span class="line"><span class="token comment"># 从第一build阶段获取dist下的文件移动到容器中的 /usr/share/nginx/html/ 目录</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> <span class="token options"><span class="token property">--from</span><span class="token punctuation">=</span><span class="token string">build</span></span> /holmes-center-front/dist /usr/share/nginx/html/</span></span>
<span class="line"><span class="token comment"># 暴露 Nginx 监听的端口，一般为 80，但这里因为是https协议所以要暴露443端口！</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">EXPOSE</span> 443</span></span>
<span class="line"><span class="token comment"># 启动 Nginx 服务</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">CMD</span> [<span class="token string">"nginx"</span>, <span class="token string">"-g"</span>, <span class="token string">"daemon off;"</span>]</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>后端项目 DockerFile文件</strong></p>
<ul>
<li>SpringBoot项目，涉及mvn命令执行，启动jar包等。</li>
</ul>
<div class="language-docker line-numbers-mode" data-highlighter="prismjs" data-ext="docker" data-title="docker"><pre v-pre><code><span class="line"><span class="token comment"># 选择构建用基础镜像。如需更换，请到[dockerhub官方仓库](https://hub.docker.com/_/java?tab=tags)自行选择后替换。</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">FROM</span> maven:3.6.0-jdk-8-slim <span class="token keyword">AS</span> build</span></span>
<span class="line"><span class="token comment"># 指定构建过程中的工作目录</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">WORKDIR</span> /holmes-center-server</span></span>
<span class="line"><span class="token comment"># 将src目录下所有文件，拷贝到工作目录中src目录下（.gitignore/.dockerignore中文件除外）</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> holmes-admin /holmes-center-server/holmes-admin</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> holmes-common /holmes-center-server/holmes-common</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> holmes-framework /holmes-center-server/holmes-framework</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> holmes-generator /holmes-center-server/holmes-generator</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> holmes-quartz /holmes-center-server/holmes-quartz</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> holmes-system /holmes-center-server/holmes-system</span></span>
<span class="line"><span class="token comment"># 将pom.xml文件和settings.xml文件，拷贝到工作目录下</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> settings.xml pom.xml /holmes-center-server/</span></span>
<span class="line"><span class="token comment"># 自定义settings.xml, 选用国内镜像源以提高下载速度</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">RUN</span> mvn -s /holmes-center-server/settings.xml -f /holmes-center-server/pom.xml clean package</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 基础镜像</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">FROM</span>  openjdk:8-jre</span></span>
<span class="line"><span class="token comment"># author</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">MAINTAINER</span> holmes</span></span>
<span class="line"><span class="token comment"># 指定路径</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">WORKDIR</span> /holmes-center-server</span></span>
<span class="line"><span class="token comment"># 复制jar文件到路径</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> <span class="token options"><span class="token property">--from</span><span class="token punctuation">=</span><span class="token string">build</span></span> /holmes-center-server/holmes-admin/target/*.jar .</span></span>
<span class="line"><span class="token comment"># 启动认证服务</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">ENTRYPOINT</span> [<span class="token string">"java"</span>,<span class="token string">"-jar"</span>,<span class="token string">"-Dspring.profiles.active=prod"</span>,<span class="token string">"holmes-admin.jar"</span>]</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>Redis DockerFile文件</strong></p>
<div class="language-DockerFile line-numbers-mode" data-highlighter="prismjs" data-ext="DockerFile" data-title="DockerFile"><pre v-pre><code><span class="line"># 基础镜像</span>
<span class="line">FROM redis:5.0.10</span>
<span class="line">MAINTAINER holmes</span>
<span class="line"></span>
<span class="line"># 挂载目录</span>
<span class="line">VOLUME /home/holmes/redis</span>
<span class="line"># 创建目录</span>
<span class="line">RUN mkdir -p /home/holmes/redis</span>
<span class="line"># 指定路径</span>
<span class="line">WORKDIR /home/holmes/redis</span>
<span class="line"># 复制conf文件到路径</span>
<span class="line">COPY /docker/redis/redis.conf /home/holmes/redis/redis.conf</span>
<span class="line"># 启动redis服务</span>
<span class="line">ENTRYPOINT [&quot;redis-server&quot;,&quot;/home/holmes/redis/redis.conf&quot;]</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>下面就是说几个碰到的棘手的命令</strong>：</p>
<p><strong>COPY 指令 作用：很简单就是复制宿主机的文件到容器中</strong></p>
<ul>
<li><strong>如果添加了--from=xxx，那就不一样了</strong>，例如：</li>
</ul>
<div class="language-docker line-numbers-mode" data-highlighter="prismjs" data-ext="docker" data-title="docker"><pre v-pre><code><span class="line"><span class="token comment"># 这个指的是复制宿主机中的/holmes/dist到/usr/share/nginx/html/中。</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> /holmes/dist /usr/share/nginx/html/</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 加上了--from=build，就是复制来自build阶段的/holmes-center-front/dist内容到/usr/share/nginx/html/下面，就不是宿主机了。</span></span>
<span class="line"><span class="token comment"># 一般常用于多个阶段镜像构建当中，就和上面案例一样</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> <span class="token options"><span class="token property">--from</span><span class="token punctuation">=</span><span class="token string">build</span></span> /holmes-center-front/dist /usr/share/nginx/html/</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><strong>如果没添加--from=xxx，第一个参数就是指定宿主机相关文件，第二个参数是指定容器相关文件的，不要混淆</strong>。为什么强调这个事情，因为，每次写dockerfile文件时，写着写着就混淆了，举个例子：</li>
</ul>
<div class="language-docker line-numbers-mode" data-highlighter="prismjs" data-ext="docker" data-title="docker"><pre v-pre><code><span class="line">...</span>
<span class="line"><span class="token comment"># 复制 package.json 和 package-lock.json</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> package*.json ./</span></span>
<span class="line"><span class="token comment"># 安装项目依赖</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">RUN</span> npm install</span></span>
<span class="line"><span class="token comment"># 将宿主机的所有文件，放到指定的WORKDIR工作目录里面来</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> . .</span></span>
<span class="line"><span class="token comment"># 执行 npm run build:prod 命令，这样容器中就有了dist压缩目录</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">RUN</span> npm run build:prod</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 前面我将dist包build出来了，但是第一印象却是用COPY来操作的，这就不对了。。。</span></span>
<span class="line"><span class="token comment"># 错误案例：COPY dist /usr/share/nginx/html/ 这样他就去宿主机找dist文件，一般不会存在！</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 正确应该是下面的执行mv，是容器内部执行命令才对。</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">RUN</span> mv dist/* /usr/share/nginx/html/</span></span>
<span class="line"><span class="token comment"># 如果涉及多个镜像阶段，那就通过--from=xxx来操作了。</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><strong>&quot; . &quot; 代表当前目录下所有文件</strong>，例如：</li>
</ul>
<div class="language-docker line-numbers-mode" data-highlighter="prismjs" data-ext="docker" data-title="docker"><pre v-pre><code><span class="line"><span class="token comment"># 指定构建目录</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">WORKDIR</span> /holmes</span></span>
<span class="line"><span class="token comment"># 将当前目录下所有文件，转移holmes目录</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> . /holmes</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>RUN 指令</strong>：就是执行命令。灵活运用即可，有时候也可以执行 ls、pwd命令，排除一些错误等等。</p>
</div></template>


