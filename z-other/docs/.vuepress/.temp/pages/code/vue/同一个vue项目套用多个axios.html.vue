<template><div><h1 id="同一个vue项目使用多个axios实例" tabindex="-1"><a class="header-anchor" href="#同一个vue项目使用多个axios实例"><span>同一个Vue项目使用多个axios实例</span></a></h1>
<p>项目要做部分隔离，对接其他项目，可能会用到多个 <code v-pre>axios</code>，这样既不会影响原系统，还可以对接要对接的系统。</p>
<ol>
<li>先将多个不同的 <code v-pre>axios</code>实例 创建出来：</li>
</ol>
<p><img src="https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241023162820821.png" alt="image-20241023162820821"></p>
<ol start="2">
<li>之后，在 <code v-pre>main.js</code> 中引入，这多个<code v-pre>axios</code> 实例。</li>
</ol>
<p><img src="https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241023163003855.png" alt="image-20241023163003855"></p>
<ol start="3">
<li>一般项目中，会有 <code v-pre>api</code> 目录，来管理所有的请求，这样我们就可以根据不同的项目，按照目录进行拆分管理即可。</li>
</ol>
<p><img src="https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241023163223189.png" alt="image-20241023163223189"></p>
<ol start="4">
<li>对应项目，引入对应的axios实例，即可。</li>
</ol>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line"><span class="token comment">// api 目录，引入当前项目的axios</span></span>
<span class="line"><span class="token keyword">import</span> request <span class="token keyword">from</span> <span class="token string">'@/axios'</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token function-variable function">modelList</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">current<span class="token punctuation">,</span> size<span class="token punctuation">,</span> params</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token keyword">return</span> <span class="token function">request</span><span class="token punctuation">(</span><span class="token punctuation">{</span></span>
<span class="line">    <span class="token literal-property property">url</span><span class="token operator">:</span> <span class="token string">'/xxx/model/list'</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token literal-property property">method</span><span class="token operator">:</span> <span class="token string">'get'</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token literal-property property">params</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token operator">...</span>params<span class="token punctuation">,</span></span>
<span class="line">      current<span class="token punctuation">,</span></span>
<span class="line">      size<span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// api-srm 目录，引入对接的第三方项目的axios实例</span></span>
<span class="line"><span class="token keyword">import</span> requestSrm <span class="token keyword">from</span> <span class="token string">'@/axios-srm'</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token function-variable function">modelView</span> <span class="token operator">=</span> <span class="token parameter">params</span> <span class="token operator">=></span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token keyword">return</span> <span class="token function">requestSrm</span><span class="token punctuation">(</span><span class="token punctuation">{</span></span>
<span class="line">    <span class="token literal-property property">url</span><span class="token operator">:</span> <span class="token string">'/xxx/model-view'</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token literal-property property">method</span><span class="token operator">:</span> <span class="token string">'get'</span><span class="token punctuation">,</span></span>
<span class="line">    params<span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="5">
<li>通过 Vue的开发代理，只要同域名，<code v-pre>axios</code>没有做单独的配置操作（例如：访问其他地址【容易造成跨域，一般还是和当前同一个地址】），也是同样适用的。</li>
</ol>
<ul>
<li>通过一些特殊方式，例如：前缀、匹配规则等等控制他们。</li>
</ul>
<p><img src="https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241023163809191.png" alt="image-20241023163809191"></p>
</div></template>


