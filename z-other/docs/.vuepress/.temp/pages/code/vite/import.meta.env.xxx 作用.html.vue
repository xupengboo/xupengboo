<template><div><h1 id="import-meta-env-xxx-作用" tabindex="-1"><a class="header-anchor" href="#import-meta-env-xxx-作用"><span><code v-pre>import.meta.env.xxx</code> 作用</span></a></h1>
<p><code v-pre>import.meta.env.VITE_APP_API</code> 是 Vite 中用于访问环境变量的一种方式。</p>
<p>通过 <code v-pre>import.meta.env</code>，可以获取在 Vite 项目中定义的环境变量值，通常用于根据不同环境（如开发、测试、生产）动态设置项目中的一些配置。</p>
<h1 id="作用与使用场景" tabindex="-1"><a class="header-anchor" href="#作用与使用场景"><span>作用与使用场景</span></a></h1>
<ol>
<li><strong>动态配置 API 接口</strong>：例如，可以在 <code v-pre>.env</code> 文件中定义不同的 API 基础 URL (<code v-pre>VITE_APP_API</code>)，从而在不同环境中访问不同的接口地址。</li>
<li><strong>环境隔离</strong>：在开发、测试、生产环境下，可以使用不同的配置文件，如 <code v-pre>.env.development</code>、<code v-pre>.env.production</code>，从而将环境变量分开管理，保证数据和行为的环境隔离。</li>
<li><strong>保护敏感数据</strong>：一些敏感信息（如密钥、API 地址）可以使用环境变量方式引入，而不是直接硬编码在代码中，确保项目配置灵活、敏感数据保护更好。</li>
</ol>
<p>例如：</p>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre v-pre><code><span class="line"><span class="token keyword">const</span> apiBaseUrl <span class="token operator">=</span> <span class="token keyword">import</span><span class="token punctuation">.</span>meta<span class="token punctuation">.</span>env<span class="token punctuation">.</span><span class="token constant">VITE_APP_API</span><span class="token punctuation">;</span> <span class="token comment">// 根据环境自动获取API URL</span></span>
<span class="line"></span>
<span class="line"><span class="token function">fetch</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>apiBaseUrl<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">/users</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span></span>
<span class="line">  <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">response</span> <span class="token operator">=></span> response<span class="token punctuation">.</span><span class="token function">json</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">  <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">data</span> <span class="token operator">=></span> console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">  <span class="token punctuation">.</span><span class="token function">catch</span><span class="token punctuation">(</span><span class="token parameter">error</span> <span class="token operator">=></span> console<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="注意事项" tabindex="-1"><a class="header-anchor" href="#注意事项"><span>注意事项</span></a></h1>
<ul>
<li><strong>在 Vite 中，所有用户自定义的环境变量名称需要以 <code v-pre>VITE_</code> 前缀开头，例如 <code v-pre>VITE_APP_API</code>。</strong></li>
<li>环境变量的值会在项目构建时写入，因此动态修改 <code v-pre>.env</code> 文件后，需重新启动开发服务器或重新构建项目才能生效。</li>
</ul>
<p><img src="https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241014092344340.png" alt="image-20241014092344340"></p>
</div></template>


