<template><div><h1 id="解决国内镜像无法访问的问题" tabindex="-1"><a class="header-anchor" href="#解决国内镜像无法访问的问题"><span>解决国内镜像无法访问的问题</span></a></h1>
<p>推荐一个网站记录所有可以用的 Docker 镜像源：</p>
<ul>
<li>https://www.coderjia.cn/archives/dba3f94c-a021-468a-8ac6-e840f85867ea</li>
</ul>
<p>配置 <code v-pre>docker</code> 镜像源：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line"><span class="token function">vi</span> /etc/docker/daemon.json</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>之后把下面的代码贴进去：</p>
<div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json" data-title="json"><pre v-pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">	<span class="token property">"registry-mirrors"</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">        <span class="token string">"https://docker.m.daocloud.io"</span><span class="token punctuation">,</span> </span>
<span class="line">        <span class="token string">"https://noohub.ru"</span><span class="token punctuation">,</span> </span>
<span class="line">        <span class="token string">"https://huecker.io"</span><span class="token punctuation">,</span> </span>
<span class="line">        <span class="token string">"https://dockerhub.timeweb.cloud"</span><span class="token punctuation">,</span> </span>
<span class="line">        <span class="token string">"https://docker.rainbond.cc"</span></span>
<span class="line">    <span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>esc</code> 键，退出编辑模式。</p>
<p><code v-pre>:wq</code> 保存。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line">systemctl restart <span class="token function">docker</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>目前，唯一个有效的能够拉去镜像的配置。</p>
</div></template>


