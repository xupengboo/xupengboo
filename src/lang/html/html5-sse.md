---
title: HTML5 服务器发送事件
order: 7
icon: akar-icons:html-fill
---

# HTML5 服务器发送事件

**服务器发送事件（SSE，Server-Sent Events）** 是 HTML5 中引入的一种技术，允许服务器推送实时更新到客户端，客户端通过一个单向的持久连接接收来自服务器的事件数据。SSE 是基于 HTTP 协议的一种简单的、轻量的实时通信机制，**适合需要服务器频繁向客户端发送更新的场景，例如新闻推送、股票价格、比赛比分更新等**。

**工作原理：**

1. **客户端发起请求**：客户端通过 `EventSource` 对象向服务器发起连接。
2. **服务器保持连接并发送数据**：服务器维持这个 HTTP 连接，并以文本流的方式将事件和数据推送到客户端。
3. **客户端接收事件**：客户端监听来自服务器的事件，并根据事件类型进行相应的处理。



**SSE是单向通信（服务器主动向客户端推送数据）、SSE使用的是HTTP协议**。

**与 WebSocket 的区别**：

- SSE 是**单向通信**，服务器主动向客户端推送数据，但客户端只能接收，不能向服务器发送数据。
- WebSocket 是双向通信，客户端和服务器都可以彼此发送消息。
- SSE 使用标准的 HTTP 协议，而 **WebSocket 使用自己的协议**（独立于 HTTP 连接）。



案例，`index.html`：

```html
<!DOCTYPE html>
<html>
<body>

<h1>服务器发送事件示例</h1>
<div id="result"></div>

<script>
  // 创建一个 EventSource 对象，连接到服务器
  const source = new EventSource("http://127.0.0.1:8080/sse");

  // 监听从服务器接收到的数据事件
  source.onmessage = function(event) {
    document.getElementById("result").innerHTML += event.data + "<br>";
  };

  // 处理特定类型的事件
  source.addEventListener("custom-event", function(event) {
    console.log("收到自定义事件：", event.data);
  });

  // 处理错误
  source.onerror = function() {
    console.log("连接错误或服务器中断");
  };
</script>

</body>
</html>
```

`server.js` ，如下：

- 通过 `node server.js` 命令 ，启动 服务。

```js
const http = require('http');

const server = http.createServer((req, res) => {
  // 设置 CORS 头，允许所有来源访问 （解决跨域问题）
  res.setHeader('Access-Control-Allow-Origin', '*');
  // 允许特定的请求方法（GET, POST, PUT, DELETE）
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  // 允许客户端发送特定的请求头
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');


  // 检查请求的路径是否为 SSE 连接路径
  if (req.url === '/sse') {
    // 设置正确的响应头 Content-Type 为 'text/event-stream'
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    // 发送一个事件到客户端
    res.write('data: Hello, this is a server-sent event!\n\n');

    // 每隔2秒发送一个时间戳
    setInterval(() => {
      res.write(`data: ${new Date().toLocaleTimeString()}\n\n`);
    }, 2000);

  } else {
    // 处理其他请求
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 - 页面未找到</h1>');
  }
});

// 服务器监听的端口号
const PORT = 8080;

server.listen(PORT, () => {
  console.log(`服务器已启动，访问地址为 http://localhost:${PORT}`);
});
```

