<template><div><h1 id="mvn、jdk安装" tabindex="-1"><a class="header-anchor" href="#mvn、jdk安装"><span>mvn、jdk安装</span></a></h1>
<p><a href="https://blog.csdn.net/qq_38738510/article/details/105567513" target="_blank" rel="noopener noreferrer">CentOS7安装Maven_centos7安装maven-CSDN博客</a></p>
<p><a href="https://blog.csdn.net/codedz/article/details/124044974" target="_blank" rel="noopener noreferrer">CentOS7安装jdk8教程_centos7安装jdk8-CSDN博客</a></p>
<h1 id="部署自定义网络" tabindex="-1"><a class="header-anchor" href="#部署自定义网络"><span>部署自定义网络</span></a></h1>
<div class="language-powershell line-numbers-mode" data-highlighter="prismjs" data-ext="powershell" data-title="powershell"><pre v-pre><code><span class="line"><span class="token comment"># 1. 创建自定义网络。</span></span>
<span class="line">docker network create itholmes_network</span>
<span class="line"><span class="token comment"># 2. 通过以下方式绑定网络 或者 创建时，--network itholmes_network</span></span>
<span class="line">docker network connect itholmes_network mysql</span>
<span class="line">docker network disconnect itholmes_network mysql</span>
<span class="line"><span class="token comment"># 3. 重启</span></span>
<span class="line">docker restart container_name</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="dockerfile-写法" tabindex="-1"><a class="header-anchor" href="#dockerfile-写法"><span>Dockerfile 写法</span></a></h1>
<div class="language-docker line-numbers-mode" data-highlighter="prismjs" data-ext="docker" data-title="docker"><pre v-pre><code><span class="line"><span class="token comment"># 基础镜像</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">FROM</span>  openjdk:8-jre</span></span>
<span class="line"><span class="token comment"># author</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">MAINTAINER</span> ruoyi</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 挂载目录</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">VOLUME</span> /home/ruoyi</span></span>
<span class="line"><span class="token comment"># 创建目录</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">RUN</span> mkdir -p /home/ruoyi</span></span>
<span class="line"><span class="token comment"># 指定路径</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">WORKDIR</span> /home/ruoyi</span></span>
<span class="line"><span class="token comment"># 复制jar文件到路径</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">COPY</span> ./jar/ruoyi-auth.jar /home/ruoyi/ruoyi-auth.jar</span></span>
<span class="line"><span class="token comment"># 启动认证服务</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">ENTRYPOINT</span> [<span class="token string">"java"</span>,<span class="token string">"-jar"</span>,<span class="token string">"ruoyi-auth.jar"</span>]</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="docker-swarm-跨宿主机通讯" tabindex="-1"><a class="header-anchor" href="#docker-swarm-跨宿主机通讯"><span>docker Swarm 跨宿主机通讯</span></a></h1>
<p><a href="https://blog.csdn.net/adparking/article/details/119140418" target="_blank" rel="noopener noreferrer">跨宿主机- 如何实现 Docker 容器的通讯？（Docker-Swarm）_docker swarm 访问宿主机 add-host-CSDN博客</a></p>
<blockquote>
<p>💡Tips：work节点一开始不会刷新出来在manager节点创建的network，之后某个容器服务声明以后才能构建。</p>
</blockquote>
<h1 id="docker中间服务器-搭建" tabindex="-1"><a class="header-anchor" href="#docker中间服务器-搭建"><span>docker中间服务器 搭建</span></a></h1>
<h2 id="mysql" tabindex="-1"><a class="header-anchor" href="#mysql"><span>MySQL</span></a></h2>
<div class="language-powershell line-numbers-mode" data-highlighter="prismjs" data-ext="powershell" data-title="powershell"><pre v-pre><code><span class="line"><span class="token comment"># Mysql 8版本：</span></span>
<span class="line">docker run <span class="token operator">-</span>d <span class="token operator">-</span>p 3306:3306 <span class="token operator">--</span>privileged=true \</span>
<span class="line"><span class="token operator">--</span>restart unless-stopped \</span>
<span class="line"><span class="token operator">-</span>v <span class="token operator">/</span>itholmes/mysql/log:<span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>log/mysql \</span>
<span class="line"><span class="token operator">-</span>v <span class="token operator">/</span>itholmes/mysql/<span class="token keyword">data</span>:<span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>lib/mysql \</span>
<span class="line"><span class="token operator">-</span>v <span class="token operator">/</span>itholmes/mysql/conf:<span class="token operator">/</span>etc/mysql/conf<span class="token punctuation">.</span>d \</span>
<span class="line"><span class="token operator">-</span>e MYSQL_ROOT_PASSWORD=0818 <span class="token operator">--</span>name mysql mysql:8<span class="token punctuation">.</span>0<span class="token punctuation">.</span>34</span>
<span class="line"></span>
<span class="line"><span class="token comment"># Mysql 5版本：</span></span>
<span class="line">docker run <span class="token operator">-</span>p 3306:3306 <span class="token operator">--</span>privileged=true <span class="token operator">--</span>name mysql \</span>
<span class="line"><span class="token operator">--</span>restart unless-stopped \</span>
<span class="line"><span class="token operator">-</span>v <span class="token operator">/</span>mydata/mysql/log:<span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>log/mysql \</span>
<span class="line"><span class="token operator">-</span>v <span class="token operator">/</span>mydata/mysql/<span class="token keyword">data</span>:<span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>lib/mysql \</span>
<span class="line"><span class="token operator">-</span>v <span class="token operator">/</span>mydata/mysql/conf:<span class="token operator">/</span>etc/mysql \</span>
<span class="line"><span class="token operator">-</span>e MYSQL_ROOT_PASSWORD=0818 \</span>
<span class="line"><span class="token operator">-</span>d mysql:5<span class="token punctuation">.</span>7</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 参数说明</span></span>
<span class="line"><span class="token comment"># -p 3306:3306：将容器的 3306 端口映射到主机的 3306 端口</span></span>
<span class="line"><span class="token comment"># -v /mydata/mysql/conf:/etc/mysql：将配置文件夹挂载到主机</span></span>
<span class="line"><span class="token comment"># -v /mydata/mysql/log:/var/log/mysql：将日志文件夹挂载到主机</span></span>
<span class="line"><span class="token comment"># -v /mydata/mysql/data:/var/lib/mysql/：将配置文件夹挂载到主机</span></span>
<span class="line"><span class="token comment"># -e MYSQL_ROOT_PASSWORD=root：初始化 root 用户的密码</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote>
<p><strong>注意：MySQL 在<code v-pre>/etc/mysql/conf.d</code>目录下创建自定义的<code v-pre>.cnf</code>文件来补充<code v-pre>my.cnf</code>的配置。不直接修改主配置文件（如<code v-pre>/etc/mysql/my.cnf</code>）。</strong></p>
</blockquote>
<p>mysql5的my.ini配置信息如下：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line"><span class="token comment"># vi /mydata/mysql/conf/my.cnf</span></span>
<span class="line"><span class="token punctuation">[</span>client<span class="token punctuation">]</span></span>
<span class="line">default-character-set<span class="token operator">=</span>utf8</span>
<span class="line"><span class="token punctuation">[</span>mysql<span class="token punctuation">]</span></span>
<span class="line">default-character-set<span class="token operator">=</span>utf8</span>
<span class="line"><span class="token punctuation">[</span>mysqld<span class="token punctuation">]</span></span>
<span class="line"><span class="token assign-left variable">init_connect</span><span class="token operator">=</span><span class="token string">'SET collation_connection = utf8_unicode_ci'</span> <span class="token assign-left variable">init_connect</span><span class="token operator">=</span><span class="token string">'SET NAMES utf8'</span> character-set-server<span class="token operator">=</span>utf8</span>
<span class="line">collation-server<span class="token operator">=</span>utf8_unicode_ci</span>
<span class="line">skip-character-set-client-handshake</span>
<span class="line">skip-name-resolve</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>mysql8的my.ini配置信息如下：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line"><span class="token comment"># vi /mydata/mysql/conf/my.cnf</span></span>
<span class="line"><span class="token punctuation">[</span>mysqld<span class="token punctuation">]</span></span>
<span class="line"><span class="token comment">#设置时区为东八区，此项设置后，在连接MySQL的时候可以不用每次都手动设置时区</span></span>
<span class="line">default-time-zone <span class="token operator">=</span> <span class="token string">'+8:00'</span></span>
<span class="line"><span class="token comment"># 设置3306端口</span></span>
<span class="line"><span class="token assign-left variable">port</span><span class="token operator">=</span><span class="token number">3306</span></span>
<span class="line"><span class="token comment"># 设置mysql的安装目录，记得切换成自己的路径</span></span>
<span class="line"><span class="token assign-left variable">basedir</span><span class="token operator">=</span>D:<span class="token punctuation">\</span>mysql<span class="token punctuation">\</span>mysql2<span class="token punctuation">\</span>mysql-8.0.27-winx64</span>
<span class="line"><span class="token comment"># 设置mysql数据库的数据的存放目录</span></span>
<span class="line"><span class="token assign-left variable">datadir</span><span class="token operator">=</span>D:<span class="token punctuation">\</span>mysql<span class="token punctuation">\</span>mysql2<span class="token punctuation">\</span>mysql-8.0.27-winx64<span class="token punctuation">\</span>data</span>
<span class="line"><span class="token comment"># 允许最大连接数</span></span>
<span class="line"><span class="token assign-left variable">max_connections</span><span class="token operator">=</span><span class="token number">200</span></span>
<span class="line"><span class="token comment"># 允许连接失败的次数。这是为了防止有人从该主机试图攻击数据库系统</span></span>
<span class="line"><span class="token assign-left variable">max_connect_errors</span><span class="token operator">=</span><span class="token number">10</span></span>
<span class="line"><span class="token comment"># 服务端使用的字符集默认为UTF8</span></span>
<span class="line">character-set-server<span class="token operator">=</span>utf8</span>
<span class="line"><span class="token comment"># 创建新表时将使用的默认存储引擎</span></span>
<span class="line">default-storage-engine<span class="token operator">=</span>INNODB</span>
<span class="line"><span class="token comment"># 默认使用“mysql_native_password”插件认证</span></span>
<span class="line"><span class="token assign-left variable">default_authentication_plugin</span><span class="token operator">=</span>mysql_native_password</span>
<span class="line"><span class="token punctuation">[</span>mysql<span class="token punctuation">]</span></span>
<span class="line"><span class="token comment"># 设置mysql客户端默认字符集</span></span>
<span class="line">default-character-set<span class="token operator">=</span>utf8</span>
<span class="line"><span class="token punctuation">[</span>client<span class="token punctuation">]</span></span>
<span class="line"><span class="token comment"># 设置mysql客户端连接服务端时默认使用的端口</span></span>
<span class="line"><span class="token assign-left variable">port</span><span class="token operator">=</span><span class="token number">3306</span></span>
<span class="line">default-character-set<span class="token operator">=</span>utf8</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>docker5.7部署，无法进入MySQL服务内部问题：</strong></p>
<p><strong>1、先进去容器中安装vim工具</strong></p>
<div class="language-powershell line-numbers-mode" data-highlighter="prismjs" data-ext="powershell" data-title="powershell"><pre v-pre><code><span class="line">docker exec <span class="token operator">-</span>it mysql bash</span>
<span class="line">apt-get update</span>
<span class="line">apt-get <span class="token operator">-</span>y install vim</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>2、修改/etc/mysql/conf.d/docker.cnf文件，添加：skip-grant-tables</strong></p>
<div class="language-latex line-numbers-mode" data-highlighter="prismjs" data-ext="latex" data-title="latex"><pre v-pre><code><span class="line"><span class="token punctuation">[</span>mysqld<span class="token punctuation">]</span></span>
<span class="line">skip-host-cache</span>
<span class="line">skip-name-resolve</span>
<span class="line">skip-grant-tables</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>3、退出，重启mysql容器</strong></p>
<div class="language-powershell line-numbers-mode" data-highlighter="prismjs" data-ext="powershell" data-title="powershell"><pre v-pre><code><span class="line">docker restart mysql</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p><strong>4、再次进入容器mysql -uroot -p进入mysql后</strong></p>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql" data-title="sql"><pre v-pre><code><span class="line">mysql<span class="token operator">></span> <span class="token keyword">use</span> mysql<span class="token punctuation">;</span></span>
<span class="line">Reading <span class="token keyword">table</span> information <span class="token keyword">for</span> completion <span class="token keyword">of</span> <span class="token keyword">table</span> <span class="token operator">and</span> <span class="token keyword">column</span> names</span>
<span class="line">You can turn <span class="token keyword">off</span> this feature <span class="token keyword">to</span> get a quicker startup <span class="token keyword">with</span> <span class="token operator">-</span>A</span>
<span class="line"></span>
<span class="line"><span class="token keyword">Database</span> changed</span>
<span class="line"></span>
<span class="line">mysql<span class="token operator">></span> <span class="token keyword">update</span> mysql<span class="token punctuation">.</span><span class="token keyword">user</span> <span class="token keyword">set</span> authentication_string <span class="token operator">=</span> password<span class="token punctuation">(</span><span class="token string">"root1234"</span><span class="token punctuation">)</span> <span class="token keyword">where</span> <span class="token keyword">user</span><span class="token operator">=</span><span class="token string">"root"</span><span class="token punctuation">;</span></span>
<span class="line">Query OK<span class="token punctuation">,</span> <span class="token number">2</span> <span class="token keyword">rows</span> affected<span class="token punctuation">,</span> <span class="token number">1</span> warning <span class="token punctuation">(</span><span class="token number">0.00</span> sec<span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">Rows</span> <span class="token keyword">matched</span>: <span class="token number">2</span>  Changed: <span class="token number">2</span>  <span class="token keyword">Warnings</span>: <span class="token number">1</span></span>
<span class="line"></span>
<span class="line">mysql<span class="token operator">></span> <span class="token keyword">exit</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>5、删除/etc/mysql/conf.d/docker.cnf文件中添加的skip-grant-tables，在重启容器</strong>
<strong>6、再次进入mysql就正常了。</strong></p>
<p><strong>下载包过慢：</strong>
<a href="https://blog.csdn.net/qq_41739987/article/details/117875020" target="_blank" rel="noopener noreferrer">docker容器中下载vim指令的速度特别慢，解决方案-CSDN博客</a>
<strong>docker部署mysql5.7异常：</strong>
<a href="https://blog.csdn.net/weixin_48226988/article/details/112681407" target="_blank" rel="noopener noreferrer">docker部署mysql5.7后登录时出现Access denied for user ‘root‘@‘localhost‘ (using password: YES)的解决方法-CSDN博客</a></p>
<h2 id="redis" tabindex="-1"><a class="header-anchor" href="#redis"><span>Redis</span></a></h2>
<div class="language-powershell line-numbers-mode" data-highlighter="prismjs" data-ext="powershell" data-title="powershell"><pre v-pre><code><span class="line"><span class="token comment"># Redis 容器卷配置</span></span>
<span class="line">docker run <span class="token operator">-</span>p 6379:6379 <span class="token operator">--</span>name redis <span class="token operator">-</span>v <span class="token operator">/</span>itholmes/redis/<span class="token keyword">data</span>:<span class="token operator">/</span><span class="token keyword">data</span> \</span>
<span class="line"><span class="token operator">-</span>v <span class="token operator">/</span>itholmes/redis/conf/redis<span class="token punctuation">.</span>conf:<span class="token operator">/</span>etc/redis/redis<span class="token punctuation">.</span>conf \</span>
<span class="line"><span class="token operator">-</span>d redis redis-server <span class="token operator">/</span>etc/redis/redis<span class="token punctuation">.</span>conf</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 进化版</span></span>
<span class="line">docker run <span class="token operator">-</span>d \</span>
<span class="line"><span class="token operator">--</span>name redis \</span>
<span class="line"><span class="token operator">-</span>p 6379:6379 \</span>
<span class="line"><span class="token operator">--</span>restart unless-stopped \</span>
<span class="line"><span class="token operator">--</span>memory 256m \</span>
<span class="line"><span class="token operator">--</span>memory-swap 512m \</span>
<span class="line"><span class="token operator">-</span>v <span class="token operator">/</span>opt/redis/<span class="token keyword">data</span>:<span class="token operator">/</span><span class="token keyword">data</span> \</span>
<span class="line"><span class="token operator">-</span>v <span class="token operator">/</span>opt/redis/conf/redis<span class="token punctuation">.</span>conf:<span class="token operator">/</span>etc/redis/redis<span class="token punctuation">.</span>conf \</span>
<span class="line">redis redis-server <span class="token operator">/</span>etc/redis/redis<span class="token punctuation">.</span>conf</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="es" tabindex="-1"><a class="header-anchor" href="#es"><span>ES</span></a></h2>
<div class="language-powershell line-numbers-mode" data-highlighter="prismjs" data-ext="powershell" data-title="powershell"><pre v-pre><code><span class="line"><span class="token comment"># 安装es docker</span></span>
<span class="line">docker pull elasticsearch:7<span class="token punctuation">.</span>4<span class="token punctuation">.</span>2</span>
<span class="line"><span class="token comment"># 提供可视化 可视化检索数据</span></span>
<span class="line">docker pull kibana:7<span class="token punctuation">.</span>4<span class="token punctuation">.</span>2 </span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看安装还有多少内存</span></span>
<span class="line">free <span class="token operator">-</span>m</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 挂载的 配置和数据存储 目录</span></span>
<span class="line">mkdir <span class="token operator">-</span>p <span class="token operator">/</span>mydata/elasticsearch/config</span>
<span class="line">mkdir <span class="token operator">-</span>p <span class="token operator">/</span>mydata/elasticsearch/<span class="token keyword">data</span></span>
<span class="line"><span class="token comment"># 配置elasticsearch的配置文件，</span></span>
<span class="line"><span class="token comment"># 作用：http.host参数用于指定Elasticsearch HTTP服务的绑定地址。当设置为0.0.0.0时，表示Elasticsearch将监听所有可用的网络接口，包括本地回环地址（localhost）和外部网络接口。</span></span>
<span class="line"><span class="token function">echo</span> <span class="token string">"http.host: 0.0.0.0"</span> >> <span class="token operator">/</span>mydata/elasticsearch/config/elasticsearch<span class="token punctuation">.</span>yml</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 9200端口：接受Rest API请求端口。</span></span>
<span class="line"><span class="token comment"># 9300端口：分布式集群状态下的通信接口</span></span>
<span class="line"><span class="token comment"># -e "discovery.type=single-node"：指定单节点模式</span></span>
<span class="line"><span class="token comment"># -e ES_JAVA_OPTS="-Xms64m -Xmx128m"：指定初始占用内存 和 最大占用内存，必须指定，不然占死内存。</span></span>
<span class="line">docker run <span class="token operator">--</span>name elasticsearch <span class="token operator">-</span>p 9200:9200 <span class="token operator">-</span>p 9300:9300 \</span>
<span class="line"><span class="token operator">-</span>e <span class="token string">"discovery.type=single-node"</span> \</span>
<span class="line"><span class="token operator">-</span>e ES_JAVA_OPTS=<span class="token string">"-Xms64m -Xmx128m"</span> \</span>
<span class="line"><span class="token operator">-</span>v <span class="token operator">/</span>mydata/elasticsearch/config/elasticsearch<span class="token punctuation">.</span>yml:<span class="token operator">/</span>usr/share/elasticsearch/config/elasticsearch<span class="token punctuation">.</span>yml \</span>
<span class="line"><span class="token operator">-</span>v <span class="token operator">/</span>mydata/elasticsearch/<span class="token keyword">data</span>:<span class="token operator">/</span>usr/share/elasticsearch/<span class="token keyword">data</span> \</span>
<span class="line"><span class="token operator">-</span>v <span class="token operator">/</span>mydata/elasticsearch/plugins:<span class="token operator">/</span>usr/share/elasticsearch/plugins \</span>
<span class="line"><span class="token operator">-</span>d elasticsearch:7<span class="token punctuation">.</span>4<span class="token punctuation">.</span>2</span>
<span class="line"></span>
<span class="line"><span class="token comment"># docker启动失败，查看日志</span></span>
<span class="line">docker logs 应用名</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 安装过程可能遇到 elasticsearch accessdenied问题，那是文件目录权限问题</span></span>
<span class="line">chmod <span class="token operator">-</span>R 777 <span class="token operator">/</span>mydata/elasticsearch</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 重新启动elasticsearch</span></span>
<span class="line">docker <span class="token function">start</span> elasticsearch </span>
<span class="line"></span>
<span class="line"><span class="token comment"># -e ELASTICSEARCH_HOSTS：指定elasticsearch的ip地址和api端口号</span></span>
<span class="line">docker run <span class="token operator">--</span>name kibana \</span>
<span class="line"><span class="token operator">-</span>e ELASTICSEARCH_HOSTS=http:<span class="token operator">/</span><span class="token operator">/</span>192<span class="token punctuation">.</span>168<span class="token punctuation">.</span>154<span class="token punctuation">.</span>132:9200 \</span>
<span class="line"><span class="token operator">-</span>p 5601:5601 \</span>
<span class="line"><span class="token operator">-</span>d kibana:7<span class="token punctuation">.</span>4<span class="token punctuation">.</span>2</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 注意：这里启动后是一个小linux容器，所以，此处没办法去应用在hosts文件配置的域名解析，需要用真实的IP或公共域名</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 同样通过logs命令，排除安装失败问题</span></span>
<span class="line">docker logs kibana</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="nginx" tabindex="-1"><a class="header-anchor" href="#nginx"><span>Nginx</span></a></h2>
<div class="language-powershell line-numbers-mode" data-highlighter="prismjs" data-ext="powershell" data-title="powershell"><pre v-pre><code><span class="line"><span class="token comment"># 1. 先下载一个nginx，方便获取/etc/nginx目录下的配置文件。</span></span>
<span class="line">docker run <span class="token operator">-</span>p 80:80 <span class="token operator">--</span>name nginx <span class="token operator">-</span>d nginx:1<span class="token punctuation">.</span>10</span>
<span class="line"><span class="token comment"># 将容器中的/etc/nginx 复制当前目录。</span></span>
<span class="line">docker container <span class="token function">cp</span> nginx:<span class="token operator">/</span>etc/nginx <span class="token punctuation">.</span></span>
<span class="line"><span class="token comment"># 将其改为conf文件，用来映射conf文件。</span></span>
<span class="line"><span class="token function">mv</span> nginx/ conf/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 创建nginx容器</span></span>
<span class="line">docker run <span class="token operator">-</span>p 80:80 <span class="token operator">--</span>name nginx \</span>
<span class="line"><span class="token operator">-</span>v <span class="token operator">/</span>itholmes/nginx/html:<span class="token operator">/</span>usr/share/nginx/html \</span>
<span class="line"><span class="token operator">-</span>v <span class="token operator">/</span>itholmes/nginx/logs:<span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>log/nginx \</span>
<span class="line"><span class="token operator">-</span>v <span class="token operator">/</span>itholmes/nginx/conf:<span class="token operator">/</span>etc/nginx \</span>
<span class="line"><span class="token operator">--</span>network itholmes_network \</span>
<span class="line"><span class="token operator">-</span>d nginx:1<span class="token punctuation">.</span>10</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 访问对应ip:80 ，测试是否安装成功。</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 进入nginx/html目录下，创建es目录，放置es词典器。</span></span>
<span class="line">mkdir es</span>
<span class="line">cd es</span>
<span class="line"><span class="token comment"># 在es目录下面，创建一个fenci.txt文件：可以输入一些测试词语、张三等等。</span></span>
<span class="line">vi fenci<span class="token punctuation">.</span>txt</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="rabbitmq" tabindex="-1"><a class="header-anchor" href="#rabbitmq"><span>RabbitMQ</span></a></h2>
<div class="language-powershell line-numbers-mode" data-highlighter="prismjs" data-ext="powershell" data-title="powershell"><pre v-pre><code><span class="line"><span class="token comment"># 1. 启动 rabbitmq:management 容器</span></span>
<span class="line">docker run <span class="token operator">-</span>d <span class="token operator">--</span>name rabbitmq <span class="token operator">-</span>p 5671:5671 <span class="token operator">-</span>p 5672:5672 \</span>
<span class="line"><span class="token operator">-</span>p 4369:4369 <span class="token operator">-</span>p 25672:25672 <span class="token operator">-</span>p 15671:15671 <span class="token operator">-</span>p 15672:15672 rabbitmq:management</span>
<span class="line"><span class="token comment"># 2. 自动重启</span></span>
<span class="line">docker update rabbitmq <span class="token operator">--</span>restart=always</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="nacos" tabindex="-1"><a class="header-anchor" href="#nacos"><span>Nacos</span></a></h2>
<div class="language-powershell line-numbers-mode" data-highlighter="prismjs" data-ext="powershell" data-title="powershell"><pre v-pre><code><span class="line"><span class="token comment"># 1. 创建配置目录</span></span>
<span class="line">mkdir <span class="token operator">-</span>p <span class="token operator">/</span>itholmes/nacos/logs/                      <span class="token comment">#新建logs目录</span></span>
<span class="line">mkdir <span class="token operator">-</span>p <span class="token operator">/</span>itholmes/nacos/conf/						<span class="token comment">#新建conf目录</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 先启动一个案例，把配置等全部拿过来</span></span>
<span class="line">docker run <span class="token operator">-</span>p 8848:8848 <span class="token operator">--</span>name nacos <span class="token operator">-</span>d nacos/nacos-server:v2<span class="token punctuation">.</span>0<span class="token punctuation">.</span>4</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 将配置复制出来</span></span>
<span class="line">docker <span class="token function">cp</span> nacos:<span class="token operator">/</span>home/nacos/logs/ <span class="token operator">/</span>itholmes/nacos/</span>
<span class="line">docker <span class="token function">cp</span> nacos:<span class="token operator">/</span>home/nacos/conf/ <span class="token operator">/</span>itholmes/nacos/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 移除旧的nacos</span></span>
<span class="line">docker <span class="token function">rm</span> <span class="token operator">-</span>f nacos</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 5. 启动新的nacos</span></span>
<span class="line">docker run <span class="token operator">-</span>d \</span>
<span class="line">  <span class="token operator">--</span>name nacos \</span>
<span class="line">  <span class="token operator">-</span>p 8848:8848  <span class="token operator">-</span>p 9848:9848 <span class="token operator">-</span>p 9849:9849 \</span>
<span class="line">  <span class="token operator">--</span>privileged=true \</span>
<span class="line">  <span class="token operator">-</span>e JVM_XMS=512m \</span>
<span class="line">  <span class="token operator">-</span>e JVM_XMX=512m \</span>
<span class="line">  <span class="token operator">-</span>e MODE=standalone \</span>
<span class="line">  <span class="token operator">-</span>v <span class="token operator">/</span>itholmes/nacos/logs/:<span class="token operator">/</span>home/nacos/logs \</span>
<span class="line">  <span class="token operator">-</span>v <span class="token operator">/</span>itholmes/nacos/conf/:<span class="token operator">/</span>home/nacos/conf \</span>
<span class="line">  <span class="token operator">--</span>restart=always \</span>
<span class="line">nacos/nacos-server:v2<span class="token punctuation">.</span>0<span class="token punctuation">.</span>4</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 推荐v2.0.4，新版本2.2之后可能需要鉴权  -e NACOS_AUTH_ENABLE=true  操作。</span></span>
<span class="line">虽然能启动起来，但是启动的无法进行登录操作，应该不是我想要的nacos系统，可能版本不对。</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="tomcat" tabindex="-1"><a class="header-anchor" href="#tomcat"><span>Tomcat</span></a></h2>
<div class="language-powershell line-numbers-mode" data-highlighter="prismjs" data-ext="powershell" data-title="powershell"><pre v-pre><code><span class="line"><span class="token comment"># tomcat安装</span></span>
<span class="line">docker run <span class="token operator">-</span>id <span class="token operator">--</span>name=c_tomcat \</span>
<span class="line"><span class="token operator">-</span>p 8080:8080 \</span>
<span class="line"><span class="token operator">-</span>v <span class="token variable">$PWD</span>:<span class="token operator">/</span>usr/local/tomcat/webapps \</span>
<span class="line">tomcat </span>
<span class="line"></span>
<span class="line"><span class="token comment"># -p 8080:8080：将容器的8080端口映射到主机的8080端口</span></span>
<span class="line"><span class="token comment"># -v $PWD:/usr/local/tomcat/webapps：将主机中当前目录挂载到容器的webapps</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="jenkins" tabindex="-1"><a class="header-anchor" href="#jenkins"><span>Jenkins</span></a></h2>
<div class="language-powershell line-numbers-mode" data-highlighter="prismjs" data-ext="powershell" data-title="powershell"><pre v-pre><code><span class="line">docker run <span class="token operator">-</span>u root <span class="token operator">--</span>name jenkins \ </span>
<span class="line">	<span class="token operator">--</span>memory 512m <span class="token operator">--</span>memory-swap=512m \ </span>
<span class="line">  <span class="token comment"># --rm \ 推出容器自动删除，一般考虑释放存储</span></span>
<span class="line">  <span class="token operator">-</span>d <span class="token operator">-</span>p 8080:8080 <span class="token operator">-</span>p 50000:50000 \</span>
<span class="line">  <span class="token operator">-</span>v <span class="token variable">$JENKINS_HOME</span><span class="token operator">/</span>jenkins-<span class="token keyword">data</span>:<span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>jenkins_home \</span>
<span class="line">  <span class="token operator">-</span>v <span class="token variable">$JENKINS_HOME</span><span class="token operator">/</span>docker<span class="token punctuation">.</span>sock:<span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>run/docker<span class="token punctuation">.</span>sock \</span>
<span class="line">  jenkinsci/blueocean</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="gitlab" tabindex="-1"><a class="header-anchor" href="#gitlab"><span>Gitlab</span></a></h2>
<div class="language-powershell line-numbers-mode" data-highlighter="prismjs" data-ext="powershell" data-title="powershell"><pre v-pre><code><span class="line">export GITLAB_HOME=<span class="token operator">/</span>itholmes/gitlab</span>
<span class="line"></span>
<span class="line">sudo docker run <span class="token operator">--</span>detach \</span>
<span class="line">  <span class="token operator">--</span>hostname gitlab<span class="token punctuation">.</span>demo<span class="token punctuation">.</span>com \</span>
<span class="line">  <span class="token operator">--</span>publish 8000:443 <span class="token operator">--</span>publish 8001:80 <span class="token operator">--</span>publish 8002:22 \</span>
<span class="line">  <span class="token operator">--</span>name gitlab \</span>
<span class="line">  <span class="token operator">--</span>restart always \</span>
<span class="line">  <span class="token operator">--</span>memory 5g \</span>
<span class="line"> 	<span class="token operator">--</span>memory-swap=6g \</span>
<span class="line">  <span class="token operator">--</span>volume <span class="token variable">$GITLAB_HOME</span><span class="token operator">/</span>config:<span class="token operator">/</span>etc/gitlab \</span>
<span class="line">  <span class="token operator">--</span>volume <span class="token variable">$GITLAB_HOME</span><span class="token operator">/</span>logs:<span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>log/gitlab \</span>
<span class="line">  <span class="token operator">--</span>volume <span class="token variable">$GITLAB_HOME</span><span class="token operator">/</span><span class="token keyword">data</span>:<span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>opt/gitlab \</span>
<span class="line">  <span class="token operator">--</span>shm-size 256m \</span>
<span class="line">  registry<span class="token punctuation">.</span>gitlab<span class="token punctuation">.</span>cn/omnibus/gitlab-jh:latest</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="rancher" tabindex="-1"><a class="header-anchor" href="#rancher"><span>Rancher</span></a></h2>
<div class="language-powershell line-numbers-mode" data-highlighter="prismjs" data-ext="powershell" data-title="powershell"><pre v-pre><code><span class="line">sudo docker run <span class="token operator">-</span>d <span class="token operator">--</span>privileged \</span>
<span class="line">	<span class="token operator">--</span>restart=unless-stopped \ </span>
<span class="line">  <span class="token operator">--</span>name rancher \</span>
<span class="line">  <span class="token operator">-</span>p 80:80 <span class="token operator">-</span>p 443:443 <span class="token operator">-</span>p 2379:2379 \</span>
<span class="line">  <span class="token operator">-</span>v <span class="token operator">/</span>itholmes/rancher:<span class="token operator">/</span><span class="token keyword">var</span><span class="token operator">/</span>lib/rancher/ \ </span>
<span class="line">  rancher/rancher:v2<span class="token punctuation">.</span>5<span class="token punctuation">.</span>12</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="kafka" tabindex="-1"><a class="header-anchor" href="#kafka"><span>kafka</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> pull bitnami/kafka:3.0</span>
<span class="line"><span class="token comment"># kafka</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--name</span> kafka-server <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--privileged</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-p</span> <span class="token number">9092</span>:9092 <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> /opt/mount/kafka/data:/bitnami <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> /opt/mount/kafka/config/server.properties:/bitnami/kafka/config/server.properties <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> /opt/mount/zookeeper/datalog:/datalog <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-v</span> /etc/localtime:/etc/localtime <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-e</span> <span class="token assign-left variable">KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE</span><span class="token operator">=</span>true <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-e</span> <span class="token assign-left variable">TZ</span><span class="token operator">=</span>Asia/Shanghai <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-e</span> <span class="token assign-left variable">ALLOW_PLAINTEXT_LISTENER</span><span class="token operator">=</span>yes <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--restart</span> always <span class="token punctuation">\</span></span>
<span class="line">  --security-opt <span class="token assign-left variable">label</span><span class="token operator">=</span>disable <span class="token punctuation">\</span></span>
<span class="line">  bitnami/kafka:3.0 <span class="token punctuation">\</span></span>
<span class="line">  /opt/bitnami/scripts/kafka/entrypoint.sh <span class="token punctuation">\</span></span>
<span class="line">  /opt/bitnami/scripts/kafka/run.sh</span>
<span class="line">  </span>
<span class="line"><span class="token comment"># 这种启动方式，必须还要有个zookeeper。</span></span>
<span class="line"><span class="token comment"># 也可以采用官方的：https://kafka.apache.org/quickstart  ， kraft模式（kafka自带的。）</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="kafdrop" tabindex="-1"><a class="header-anchor" href="#kafdrop"><span>Kafdrop</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line"> <span class="token comment"># kafdrop kafka可视化工具</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--name</span> kafdrop <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--privileged</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-p</span> <span class="token number">9999</span>:9000 <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-e</span> <span class="token assign-left variable">SERVER_SERVLET_CONTEXTPATH</span><span class="token operator">=</span>/ <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-e</span> <span class="token assign-left variable">KAFKA_BROKERCONNECT</span><span class="token operator">=</span>center-server:9092 <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-e</span> <span class="token assign-left variable">JVM_OPTS</span><span class="token operator">=</span><span class="token string">"-Xms256M -Xmx512M"</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-e</span> <span class="token assign-left variable"><span class="token environment constant">PATH</span></span><span class="token operator">=</span><span class="token string">"/opt/java/openjdk/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"</span> <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-e</span> <span class="token assign-left variable"><span class="token environment constant">LANG</span></span><span class="token operator">=</span>en_US.UTF-8 <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-e</span> <span class="token assign-left variable"><span class="token environment constant">LANGUAGE</span></span><span class="token operator">=</span>en_US:en <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-e</span> <span class="token assign-left variable"><span class="token environment constant">LC_ALL</span></span><span class="token operator">=</span>en_US.UTF-8 <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-e</span> <span class="token assign-left variable">JAVA_VERSION</span><span class="token operator">=</span>jdk-11.0.14.1+1 <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">-e</span> <span class="token assign-left variable">JAVA_HOME</span><span class="token operator">=</span>/opt/java/openjdk <span class="token punctuation">\</span></span>
<span class="line">  <span class="token parameter variable">--restart</span> always <span class="token punctuation">\</span></span>
<span class="line">  --security-opt <span class="token assign-left variable">label</span><span class="token operator">=</span>disable <span class="token punctuation">\</span></span>
<span class="line">  obsidiandynamics/kafdrop:3.30.0 <span class="token punctuation">\</span></span>
<span class="line">  /kafdrop.sh</span>
<span class="line">  </span>
<span class="line"><span class="token comment"># 只需要关系 KAFKA_BROKERCONNECT 就行。</span></span>
<span class="line"><span class="token comment"># 此外，还要配置对应 kafka 支持外部客户端连接。</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote>
<p>注意：由于docker启动后本地是无法解析自定义域名的，所以要换成IP 或者 修改容器内部的域名映射。</p>
</blockquote>
<h2 id="zookeeper" tabindex="-1"><a class="header-anchor" href="#zookeeper"><span>zookeeper</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\</span></span>
<span class="line"> <span class="token parameter variable">--name</span> zookeeper <span class="token punctuation">\</span></span>
<span class="line"> <span class="token parameter variable">--privileged</span> <span class="token punctuation">\</span></span>
<span class="line"> <span class="token parameter variable">-p</span> <span class="token number">2181</span>:2181 <span class="token punctuation">\</span></span>
<span class="line"> <span class="token parameter variable">-v</span> /opt/docker/zookeeper/conf/zoo.cfg:/conf/zoo.cfg <span class="token punctuation">\</span></span>
<span class="line"> <span class="token parameter variable">-v</span> /opt/docker/zookeeper/logs:/logs <span class="token punctuation">\</span></span>
<span class="line"> <span class="token parameter variable">-v</span> /opt/docker/zookeeper/data:/data <span class="token punctuation">\</span></span>
<span class="line"> <span class="token parameter variable">-v</span> /opt/docker/zookeeper/datalog:/datalog <span class="token punctuation">\</span></span>
<span class="line"> <span class="token parameter variable">-v</span> /etc/localtime:/etc/localtime <span class="token punctuation">\</span></span>
<span class="line"> <span class="token parameter variable">-e</span> <span class="token assign-left variable">TZ</span><span class="token operator">=</span>Asia/Shanghai <span class="token punctuation">\</span></span>
<span class="line"> <span class="token parameter variable">--restart</span> always <span class="token punctuation">\</span></span>
<span class="line"> zookeeper:3.8.0 <span class="token punctuation">\</span></span>
<span class="line"> zkServer.sh start-foreground</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


