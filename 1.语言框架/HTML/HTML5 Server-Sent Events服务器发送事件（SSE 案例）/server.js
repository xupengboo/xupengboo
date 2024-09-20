const http = require('http');

const server = http.createServer((req, res) => {
  // 设置 CORS 头，允许所有来源访问
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // 允许特定的请求方法（GET, POST, PUT, DELETE）
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  
  // 允许客户端发送特定的请求头
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  console.log(req.url)
  
    console.log(req.url === '/sse')


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
