# xupengboo

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
git pull origin main 
docker build -t xupengboo:2.0.0 .
docker rm -f xupengboo
docker run -d -p 80:80 --name xupengboo xupengboo:2.0.0
```

icon 获取：https://icon-sets.iconify.design/