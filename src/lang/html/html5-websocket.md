---
title: HTML5 WebSocket 使用
order: 6
icon: akar-icons:html-fill
---

# HTML5 WebSocket

WebSocket 是 HTML5 开始提供的一种在单个 TCP 连接上进行**全双工通讯的协议**。

在 WebSocket API 中，浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接，并进行双向数据传输。

传统的一些网站推送技术，使用的技术是Ajax轮询。这种传统的模式带来很明显的缺点，即浏览器需要不断的向服务器发出请求，然而HTTP请求可能包含较长的头部，其中真正有效的数据可能只是很小的一部分，显然这样会浪费很多的带宽等资源。**HTML5 定义的 WebSocket 协议，能更好的节省服务器资源和带宽，并且能够更实时地进行通讯。**

![image-20240912092015069](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240912092015069.png)



聊天室案例，`index.html` ：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebSocket 聊天室</title>
</head>
<body>
    <h1>WebSocket 聊天室</h1>
    <div>
        <input id="messageInput" type="text" placeholder="输入消息..." />
        <button onclick="sendMessage()">发送</button>
    </div>
    <div>
        <h2>聊天记录：</h2>
        <pre id="chatLog"></pre>
    </div>

    <script>
        // 连接到 WebSocket 服务器
        const ws = new WebSocket('ws://localhost:8080/chat');

        // 监听 WebSocket 打开事件
        ws.onopen = function() {
            console.log('WebSocket 连接已打开');
        };

        // 监听 WebSocket 消息事件
        ws.onmessage = function(event) {
            console.log('收到服务器消息:', event.data);
            document.getElementById('chatLog').textContent += event.data + '\n';
        };

        // 发送消息到服务器
        function sendMessage() {
            const message = document.getElementById('messageInput').value;
            ws.send(message);
        }

        // 监听 WebSocket 错误事件
        ws.onerror = function(error) {
            console.error('WebSocket 错误:', error);
        };

        // 监听 WebSocket 关闭事件
        ws.onclose = function() {
            console.log('WebSocket 连接已关闭');
        };
    </script>
</body>
</html>
```

通过 `SpringBoot `实现后台，`WebSocket` 通信服务：

1. 引入 `WebSocket` 依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

2. 定义一个 `WebSocket Handler` 继承类：

```java
package com.itholmes.demo.websocket;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

/**
 * @Author xupengboo
 * @Date 2024/9/12 9:25
 * @Describe
 */
public class ChatWebSocketHandler extends TextWebSocketHandler {

    // 用于存储所有客户端连接
    private final Set<WebSocketSession> sessions = Collections.synchronizedSet(new HashSet<>());

    // 当客户端连接时触发
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        System.out.println("新连接：" + session.getId());
    }

    // 当收到客户端消息时触发
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        System.out.println("收到消息：" + payload);

        // 将消息广播给所有连接的客户端
        for (WebSocketSession webSocketSession : sessions) {
            if (webSocketSession.isOpen()) {
                webSocketSession.sendMessage(new TextMessage("客户端 " + session.getId() + " 说：" + payload));
            }
        }
    }

    // 当连接关闭时触发
    @Override
    public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) throws Exception {
        sessions.remove(session);
        System.out.println("连接关闭：" + session.getId());
    }

}
```

3. 配置 `WebSocketConfigurer` 类：

```java
package com.itholmes.demo.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

/**
 * @Author xupengboo
 * @Date 2024/9/12 9:26
 * @Describe
 */
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // 注册 WebSocket 处理器和路径
        registry.addHandler(new ChatWebSocketHandler(), "/chat")
                .setAllowedOrigins("*");  // 允许跨域
    }

}
```

4. 启动服务，配合前端测试即可。

