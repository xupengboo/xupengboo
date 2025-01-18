<template><div><h1 id="一、docker-简介" tabindex="-1"><a class="header-anchor" href="#一、docker-简介"><span>一、Docker 简介</span></a></h1>
<p>Docker 是一个开源的容器引擎，它有助于更快地交付应用。Docker 可将应用程序和基础设施层隔离，并且能将基础设施当作程序一样进行管理。使用 Docker , 可更快地打包、测试以及部署应用程序，并可以缩短从编写到部署运行代码的周期。</p>
<ul>
<li>Docker 的官方网址链接：<a href="https://www.docker.com/" target="_blank" rel="noopener noreferrer">https://www.docker.com</a></li>
<li>Docker 的 GitHub : http://github.com/docker/docker</li>
</ul>
<blockquote>
<p>Tips：最近，镜像拉去经常超时，解决办法：https://blog.csdn.net/weixin_50160384/article/details/139861337</p>
</blockquote>
<h1 id="二、docker-的架构" tabindex="-1"><a class="header-anchor" href="#二、docker-的架构"><span>二、Docker 的架构</span></a></h1>
<p>Docker 架构包含的主要组件：</p>
<ul>
<li><code v-pre>Docker daemon ( Docker 守护进程 ）</code></li>
</ul>
<p>Docker daemon 是一个运行在宿主机 （DOCKER_HOST） 的后台进程。可通过 Docker 客户端与之通信。</p>
<ul>
<li><code v-pre>Client （Docker 客户端）</code></li>
</ul>
<p>Docker 客户端是 Docker 的用户界面，它可以接受用户命令和配置标识，并与 Docker daemon 通信。</p>
<ul>
<li><code v-pre>Images ( Docker 镜像 )</code></li>
</ul>
<p>Docker 镜像是一个只读模板，它包含创建 Docker 容器说明。它和系统安装光盘有点像 —— 使用系统安装光盘可以安装系统，同理，使用 Docker 镜像可以运行 Docker 镜像中的程序。</p>
<ul>
<li><code v-pre>Container （容器）</code></li>
</ul>
<p>容器是镜像的可运行实例。镜像和容器的关系有点类似于面向对象中，类和对象的关系。可通过 Docker API 或 CLI 命令来启动、停止和移动、删除容器。</p>
<ul>
<li><code v-pre>Registry ( 注册 )</code></li>
</ul>
<p>Docker Registry 是一个集中存储与分发镜像的服务。构建完 Docker 镜像后，就可在当前宿主机上运行。但如果想要在其他机器上运行这个镜像，就需要手动复制。此时，就可借助 Docker Registry 来避免镜像的手动复制。</p>
<p>一个 Docker Registry 可包含多个 Docker 仓库，每个仓库可包含多个镜像标签，每个标签对应一个 Docker 镜像。这跟 Maven 的仓库有点类似，如果把 Docker Registry 比作 Maven 仓库的话，那么 Docker 仓库就可理解为某 jar 包的路径，而镜像标签则可理解为 jar 包的版本号。</p>
<p>Docker Registry 可分为公有 Docker Registry 和私有 Docker Registry 。最常用的 Docker Registry 莫过于官方的 Docker Hub， 这也是默认的 Docker Registry 。Docker Hub 上存放着大量优秀的镜像，可使用 Docker 命令下载并使用。</p>
<h1 id="三、docker准备" tabindex="-1"><a class="header-anchor" href="#三、docker准备"><span>三、Docker准备</span></a></h1>
<p>Docker 官方建议将 Docker 运行在 Linux 操作系统上。当然，Docker 也支持运行在其他平台，例如 Windows、MacOS 等。</p>
<ul>
<li>安装参考官方文档：<a href="http://docs.docker.com/engine/installation/" target="_blank" rel="noopener noreferrer">http://docs.docker.com/engine/installation/</a></li>
</ul>
<h3 id="系统要求" tabindex="-1"><a class="header-anchor" href="#系统要求"><span>系统要求</span></a></h3>
<ul>
<li>Docker 运行在 CentOS 7.X 之上 （不支持内核在 3.8 以下的老版本）</li>
</ul>
<h3 id="通过以下命令查看您的-centos-内核" tabindex="-1"><a class="header-anchor" href="#通过以下命令查看您的-centos-内核"><span>通过以下命令查看您的 CentOS 内核</span></a></h3>
<p><code v-pre>uname -r</code>
需要保证Docker安装在 64 位平台</p>
<h3 id="移除非官方软件包" tabindex="-1"><a class="header-anchor" href="#移除非官方软件包"><span>移除非官方软件包</span></a></h3>
<p>Red Hat 操作系统包含了一个旧版本的 Docker 软件包，该旧版本软件包的名称是 “ docker ”，而新版本是 “ docker-engine ”。因此，如已安装该软件包，那么需要执行以下命令移除。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line">$ <span class="token function">sudo</span> yum remove <span class="token function">docker</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>Tips：执行该命令只会移除旧版本的 Docker , /var/lib/docker 目录中的内容不会被删除，因此，旧版本 Docker 所创建的镜像、容器、卷等都会保留下来。</p>
<h3 id="卸载旧版本" tabindex="-1"><a class="header-anchor" href="#卸载旧版本"><span>卸载旧版本</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line">$ <span class="token function">sudo</span> yum remove <span class="token function">docker</span> <span class="token punctuation">\</span></span>
<span class="line">                  docker-common <span class="token punctuation">\</span></span>
<span class="line">                  docker-selinux <span class="token punctuation">\</span></span>
<span class="line">                  docker-engine</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="设置-yum-源" tabindex="-1"><a class="header-anchor" href="#设置-yum-源"><span>设置 Yum 源</span></a></h3>
<p>Docker 有多种安装方式，例如 Yum 安装、PRM 包安装、Shell安装等。以下以 Yum 安装方式进行, Docker 分 Docker EE 和 Docker CE 两种版本（EE：企业版，收费的；CE：社区版，不收费）。</p>
<p>1、安装 yum-utils , 这样就能使用 yum-config-manager 工具设置 Yum 源。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line">$ <span class="token function">sudo</span> yum <span class="token function">install</span> <span class="token parameter variable">-y</span> yum-utils <span class="token punctuation">\</span></span>
<span class="line">  device-mapper-persistent-data <span class="token punctuation">\</span></span>
<span class="line">  lvm2</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2、执行以下命令，添加 Docker 的 Yum 源。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line">$ <span class="token function">sudo</span> yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>3、【可选】启用测试仓库。测试仓库包含在 docker.repo 文件中，但默认情况下禁用的。</p>
<p>如需启用测试仓库，可使用以下命令：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line">$ <span class="token function">sudo</span> yum-config-manager <span class="token parameter variable">--enable</span> docker-ce-edge</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line">$ <span class="token function">sudo</span> yum-config-manager <span class="token parameter variable">--enable</span> docker-ce-test</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>如想要禁用测试仓库，可执行以下命令：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line">$ <span class="token function">sudo</span> yum-config-manager <span class="token parameter variable">--disable</span> docker-ce-edge</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h1 id="四、安装docker" tabindex="-1"><a class="header-anchor" href="#四、安装docker"><span><strong>四、安装Docker</strong></span></a></h1>
<p>1、更新 Yum 包的索引</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line">$ <span class="token function">sudo</span> yum makecache fast</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>2、安装最新版本的 Docker</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line">$ <span class="token function">sudo</span> yum <span class="token function">install</span> docker-ce</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>3、在生产系统中，可能需要安装指定版本的 Docker ，而并不总是安装最新的版本。</p>
<p>执行以下命令，即可列出可用的 Docker 版本</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line">$ yum list docker-ce <span class="token parameter variable">--showduplicates</span> <span class="token operator">|</span> <span class="token function">sort</span> <span class="token parameter variable">-r</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>列出 Docker 版本后，可使用以下命令安装指定版本的 Docker 。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line">$ <span class="token function">sudo</span> yum <span class="token function">install</span> </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>例如：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line">$ <span class="token function">sudo</span> yum <span class="token parameter variable">-y</span> <span class="token function">install</span> docker-ce-17.09.0.ce</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>4、启动 Docker</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line">$ <span class="token function">sudo</span> systemctl start <span class="token function">docker</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>5、执行以下命令，验证安装是否正确</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line">$ <span class="token function">sudo</span> <span class="token function">docker</span> run hello-world</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>6、查看 Docker 版本</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> version</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>现在，国内docker网站是访问不通的，所以一开始就需要更换docker镜像仓库：（以阿里云的Docker仓库配置为例：）</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line"><span class="token comment"># 1. 记得先备份</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">cp</span> /etc/yum.repos.d/docker-ce.repo /etc/yum.repos.d/docker-ce.repo.bak</span>
<span class="line"><span class="token comment"># 2. 修改</span></span>
<span class="line"><span class="token function">vi</span> /etc/yum.repos.d/docker-ce.repo</span>
<span class="line"><span class="token comment">## 添加以下内容：</span></span>
<span class="line"><span class="token punctuation">[</span>docker-ce<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">name</span><span class="token operator">=</span>Docker CE Stable - <span class="token variable">$basearch</span></span>
<span class="line"><span class="token assign-left variable">baseurl</span><span class="token operator">=</span>https://mirrors.aliyun.com/docker-ce/linux/centos/7/x86_64/stable</span>
<span class="line"><span class="token assign-left variable">enabled</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line"><span class="token assign-left variable">gpgcheck</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line"><span class="token assign-left variable">gpgkey</span><span class="token operator">=</span>https://mirrors.aliyun.com/docker-ce/linux/centos/gpg</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>docker-ce-edge<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">name</span><span class="token operator">=</span>Docker CE Edge - <span class="token variable">$basearch</span></span>
<span class="line"><span class="token assign-left variable">baseurl</span><span class="token operator">=</span>https://mirrors.aliyun.com/docker-ce/linux/centos/7/x86_64/edge</span>
<span class="line"><span class="token assign-left variable">enabled</span><span class="token operator">=</span><span class="token number">0</span></span>
<span class="line"><span class="token assign-left variable">gpgcheck</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line"><span class="token assign-left variable">gpgkey</span><span class="token operator">=</span>https://mirrors.aliyun.com/docker-ce/linux/centos/gpg</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span>docker-ce-test<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">name</span><span class="token operator">=</span>Docker CE Test - <span class="token variable">$basearch</span></span>
<span class="line"><span class="token assign-left variable">baseurl</span><span class="token operator">=</span>https://mirrors.aliyun.com/docker-ce/linux/centos/7/x86_64/test</span>
<span class="line"><span class="token assign-left variable">enabled</span><span class="token operator">=</span><span class="token number">0</span></span>
<span class="line"><span class="token assign-left variable">gpgcheck</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line"><span class="token assign-left variable">gpgkey</span><span class="token operator">=</span>https://mirrors.aliyun.com/docker-ce/linux/centos/gpg</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 重新安装</span></span>
<span class="line"><span class="token function">sudo</span> yum clean all</span>
<span class="line"><span class="token function">sudo</span> yum makecache</span>
<span class="line"><span class="token function">sudo</span> yum <span class="token function">install</span> docker-ce docker-ce-cli containerd.io</span>
<span class="line">systemctl start <span class="token function">docker</span></span>
<span class="line">systemctl <span class="token builtin class-name">enable</span> <span class="token function">docker</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="五、卸载-docker" tabindex="-1"><a class="header-anchor" href="#五、卸载-docker"><span>五、卸载 Docker</span></a></h1>
<p>1、卸载 Docker 软件包</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line">$ <span class="token function">sudo</span> yum remove docker-ce</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>2、如需删除镜像、容器、卷以及自定义的配置文件，可执行以下命令</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line">$ <span class="token function">sudo</span> <span class="token function">rm</span> <span class="token parameter variable">-rf</span> /var/lib/docker</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h1 id="六、配置镜像加速器" tabindex="-1"><a class="header-anchor" href="#六、配置镜像加速器"><span>六、配置镜像加速器</span></a></h1>
<p>国内访问 Docker Hub 的速度很不稳定，有时甚至出现连接不上的情况。为 Docker 配置镜像加速器，从而解决这个问题。目前国内很多云服务商都提供了镜像加速的服务。常用的镜像加速器有：<br>
阿里云加速器、DaoCloud加速器等。<br>
以阿里云加速器为例：<br>
1、注册阿里云账号，即可在阿里云控制台（<a href="https://cr.console.aliyun.com/cn-zhangjiakou/instances/mirrors" target="_blank" rel="noopener noreferrer">https://cr.console.aliyun.com/cn-zhangjiakou/instances/mirrors</a>）<br>
2、按照提示说明，即可配置镜像加速器。</p>
<h1 id="七、ipv4转向配置" tabindex="-1"><a class="header-anchor" href="#七、ipv4转向配置"><span>七、ipv4转向配置</span></a></h1>
<p>若启动docker的时候报错：<code v-pre>WARNING IPv4 forwarding is disabled. Networking will not work</code><br>
解决方案：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line"> <span class="token function">vi</span> /etc/sysctl.conf</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>添加配置</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line"><span class="token assign-left variable">net.ipv4.ip_forward</span><span class="token operator">=</span><span class="token number">1</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>重启</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line">systemctl restart network</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>查看是否成功</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line"><span class="token function">sysctl</span> net.ipv4.ip_forward</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>如果返回为<code v-pre>net.ipv4.ip_forward = 1</code>则表示成功了</p>
</div></template>


