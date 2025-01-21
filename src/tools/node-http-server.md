---
title: Node.js HTTP Server 启动本地服务
order: 5
---


使用 Node.js 和 http-server 启动（推荐）
   
如果你已经安装了 Node.js，可以使用一个非常流行的包 http-server 来启动一个本地服务器。

步骤：
1. 安装 http-server： 打开终端或命令行工具，使用 npm 安装 http-server：

```bash
npm install -g http-server
```

这将全局安装 http-server，使得你可以在任何目录下使用它。

2. 启动服务器： 在你的 index.html 文件所在的目录下，运行以下命令：

```bash
http-server
```

3. 访问页面： 默认情况下，http-server 会将你的文件托管在 http://localhost:8080，你可以在浏览器中访问这个地址来查看 index.html 文件。

可选配置：
如果你想指定不同的端口，可以使用 -p 选项：

```bash
http-server -p 3000
```

这将把服务器运行在 http://localhost:3000 上。
