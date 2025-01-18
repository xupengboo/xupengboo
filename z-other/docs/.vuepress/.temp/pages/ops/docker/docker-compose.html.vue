<template><div><h2 id="二进制安装" tabindex="-1"><a class="header-anchor" href="#二进制安装"><span>二进制安装</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line">//指定版本安装：</span>
<span class="line">$ <span class="token function">sudo</span> <span class="token function">curl</span> <span class="token parameter variable">-L</span> https://get.daocloud.io/docker/compose/releases/download/1.23.1/<span class="token punctuation">\</span></span>
<span class="line">docker-compose-<span class="token variable"><span class="token variable">`</span><span class="token function">uname</span> <span class="token parameter variable">-s</span><span class="token variable">`</span></span>-<span class="token variable"><span class="token variable">`</span><span class="token function">uname</span> <span class="token parameter variable">-m</span><span class="token variable">`</span></span> <span class="token operator">></span> /usr/local/bin/docker-compose</span>
<span class="line"></span>
<span class="line">//对二进制文件赋可执行权限</span>
<span class="line">$ <span class="token function">sudo</span> <span class="token function">chmod</span> +x /usr/local/bin/docker-compose</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="yum源安装" tabindex="-1"><a class="header-anchor" href="#yum源安装"><span>yum源安装</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line">$ yum <span class="token parameter variable">-y</span> <span class="token function">install</span> <span class="token function">docker-compose</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="测试安装是否成功" tabindex="-1"><a class="header-anchor" href="#测试安装是否成功"><span>测试安装是否成功</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line">$ <span class="token function">docker-compose</span> <span class="token parameter variable">--version</span></span>
<span class="line"><span class="token function">docker-compose</span> version <span class="token number">1.23</span>.1, build 1719ceb</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


