# xupengboo

## install

可以通过 命令行接口 的 --config 选项来指定配置文件：
```bash
vuepress dev docs --config docs/.vuepress/config.ts
vuepress dev docs --config docs/.vuepress/other-config.ts
```

Frontmatter：Frontmatter 必须在 Markdown 文件的顶部，并且被包裹在一对三短划线中间。


什么是 markdown-it ？
markdown-it 是一个非常流行的 Markdown 解析器，它将 Markdown 格式的文本转换为 HTML（或其他格式）输出。它是一个基于 JavaScript 的库，常用于 Web 应用程序中处理和渲染 Markdown 内容。由于其高性能和可扩展性，markdown-it 广泛用于许多前端框架、博客引擎、以及其他需要处理 Markdown 的应用程序中。


config.ts配置: [https://ecosystem.vuejs.press/zh/themes/default/config.html](https://ecosystem.vuejs.press/zh/themes/default/config.html)


部署：
```shell
chmod +x startup.sh
```
```shell
docker build -t xupengboo:2.0.0 .
docker rm -f xupengboo
docker run -d -p 80:80 --name xupengboo xupengboo:2.0.0

# 如果你确认这些镜像不再需要，可以使用以下命令来删除所有的悬挂镜像：
docker image prune -f
# 该命令会删除所有没有标签的镜像。如果你想要更细粒度的控制，也可以指定只删除悬挂镜像：
docker image prune -a -f
```

icon 获取：https://icon-sets.iconify.design/


评论系统：https://giscus.app/zh-CN

logo设计：https://ai.logo123.com/

## build 【后续采用】

1. 笔者以 Markdown 形式写好文章，上传到Github提供的代码仓库。
2. Travis-CI 提供持续集成，检测仓库发生变化，触发VuePress编译活动，生成静态页面和目录。
- Travis-CI 通过项目配置一个 .travis.yml 文件，来指定编译环境、安装依赖、编译命令等。
- 编译完成后，Travis-CI 将编译后的静态页面和目录推送到 GitHub Pages。
3. 然后推送回 GitHub Pages
- https://pages.github.com/
- 可以修改为自己的域名地址。
4. 再触发国内的 CDN 缓存刷新。
- 考虑使用：阿里云、七牛云、腾讯云的CDN缓存加速。


