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
