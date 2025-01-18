<template><div><h1 id="docker基础知识" tabindex="-1"><a class="header-anchor" href="#docker基础知识"><span>Docker基础知识</span></a></h1>
<blockquote>
<p>Tips：记录docker的一些基本知识，忘记了回过头看看。</p>
</blockquote>
<h1 id="docker常用命令" tabindex="-1"><a class="header-anchor" href="#docker常用命令"><span>Docker常用命令</span></a></h1>
<p>这个经常用于想要容器里面的某个文件时，非常好用！</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> <span class="token function">cp</span> <span class="token operator">&lt;</span>container_id<span class="token operator">></span>:/path/in/container /path/on/host</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h1 id="docker重启策略" tabindex="-1"><a class="header-anchor" href="#docker重启策略"><span>Docker重启策略</span></a></h1>
<p>当你启动一个容器时，可以通过 <code v-pre>--restart</code> 选项来设置重启策略。以下是几个常见的重启策略：</p>
<ul>
<li><code v-pre>no</code>：默认值。容器退出后不会自动重启。</li>
<li><code v-pre>always</code>：无论退出状态是什么，Docker 守护进程都会自动重启容器。</li>
<li><code v-pre>on-failure</code>：只有当容器因错误（退出代码非 0）退出时，才会自动重启。</li>
<li><code v-pre>unless-stopped</code>：只要 Docker 服务在运行，容器就会自动重启，除非手动停止容器。</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre v-pre><code><span class="line"><span class="token comment"># 例如：--restart always</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">--restart</span> always <span class="token parameter variable">-d</span> my-container</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


