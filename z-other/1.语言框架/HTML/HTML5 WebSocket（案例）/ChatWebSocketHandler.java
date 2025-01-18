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
