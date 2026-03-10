---
title: Nginx 使用指南
outline: deep
---

# Nginx 使用指南

> Nginx（读作 "Engine-X"）是一个高性能的 **Web 服务器 / 反向代理 / 负载均衡器**，基于异步事件驱动架构，擅长处理高并发场景。

---

## 一、常用命令速查

```bash
nginx -t                  # 检查配置文件语法
nginx -s reload           # 热重载配置（不中断服务）
nginx -s stop             # 快速停止
nginx -s quit             # 优雅停止（处理完当前请求再退出）
nginx -V                  # 查看编译参数和版本

systemctl start nginx     # 启动（systemd）
systemctl reload nginx    # 热重载（systemd）
```

---

## 二、使用场景速览

| 场景 | 核心能力 | 典型用途 |
|---|---|---|
| **Web 服务器** | 静态资源托管、虚拟主机 | 博客、企业官网、CDN 边缘节点 |
| **反向代理** | 请求转发、隐藏后端 | 应用服务器前置代理 |
| **负载均衡** | 多种算法、故障转移 | 电商、微服务集群 |
| **SSL/TLS 终端** | 加解密卸载、证书管理 | HTTPS 网站、API 接入 |
| **API 网关** | 路由、限流、鉴权 | 微服务统一入口 |
| **内容缓存** | 静态/动态内容缓存 | 高流量 API、图片站 |
| **WebSocket 代理** | 长连接转发 | 实时聊天、在线游戏 |
| **流媒体服务** | RTMP / HLS 分发 | 视频直播、点播 |

---

## 三、核心场景详解

### Web 服务器

Nginx 异步事件驱动架构使其在静态资源服务上性能极强，单机可轻松支撑数万并发。

```nginx
server {
    listen 80;
    server_name example.com;

    root /var/www/html;
    index index.html;

    # 静态资源直接返回，匹配不到时返回 index.html（适合 SPA）
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存 30 天
    location ~* \.(jpg|jpeg|png|gif|css|js|ico|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

---

### 反向代理

客户端只与 Nginx 通信，后端服务对外不可见，常用于隐藏内网服务、统一入口。

```nginx
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass         http://127.0.0.1:8080;

        # 传递真实客户端信息给后端
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;

        # 超时配置
        proxy_connect_timeout 10s;
        proxy_read_timeout    60s;
    }
}
```

---

### 负载均衡

将请求分发到多个后端节点，支持多种算法。

```nginx
upstream backend {
    # 负载均衡算法（选其一，默认轮询）
    # least_conn;    # 最少连接数
    # ip_hash;       # 同一 IP 固定分配到同一节点（解决 Session 问题）

    server backend1.example.com weight=3;  # weight 越大，分配比例越高
    server backend2.example.com weight=2;
    server backend3.example.com weight=1;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
```

**三种负载均衡算法对比：**

| 算法 | 配置 | 特点 | 适用场景 |
|---|---|---|---|
| **轮询**（默认）| 无需配置 | 依次分发，可加权重 | 无状态服务 |
| **最少连接** | `least_conn` | 分配给当前连接数最少的节点 | 处理时间差异较大的请求 |
| **IP 哈希** | `ip_hash` | 同 IP 固定路由到同一节点 | 有状态服务（如 Session） |

---

### SSL/TLS 终端代理

Nginx 统一处理加解密，后端服务只需监听 HTTP，**减轻后端加密负担**。

```nginx
server {
    listen 443 ssl;
    server_name example.com;

    # 证书路径（Let's Encrypt 免费证书或商业证书）
    ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    # 推荐的安全配置
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;
    ssl_session_cache   shared:SSL:10m;

    location / {
        proxy_pass http://127.0.0.1:8080;
    }
}

# HTTP 强制跳转 HTTPS
server {
    listen 80;
    server_name example.com;
    return 301 https://$host$request_uri;
}
```

---

### API 网关 & 限流

```nginx
# 定义限流区域：每个 IP 每秒最多 10 个请求
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

server {
    listen 80;
    server_name api.example.com;

    # IP 黑白名单
    # allow 192.168.1.0/24;
    # deny all;

    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;  # 允许突发 20 个请求

        proxy_pass http://backend;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

### 内容缓存

```nginx
# 定义缓存区域
proxy_cache_path /var/cache/nginx levels=1:2
                 keys_zone=my_cache:10m
                 max_size=1g
                 inactive=60m;

server {
    listen 80;
    location /api/ {
        proxy_cache            my_cache;
        proxy_cache_valid      200 10m;   # 200 响应缓存 10 分钟
        proxy_cache_valid      404 1m;
        proxy_cache_use_stale  error timeout updating;

        add_header X-Cache-Status $upstream_cache_status;  # 便于调试：HIT/MISS

        proxy_pass http://backend;
    }
}
```

---

### WebSocket 代理

WebSocket 需要 HTTP Upgrade，Nginx 需要特别配置。

```nginx
server {
    listen 80;
    server_name ws.example.com;

    location /ws/ {
        proxy_pass          http://127.0.0.1:9000;

        # WebSocket 必须的升级头
        proxy_http_version  1.1;
        proxy_set_header    Upgrade    $http_upgrade;
        proxy_set_header    Connection "upgrade";

        proxy_set_header    Host       $host;
        proxy_read_timeout  3600s;   # 长连接保持时间
    }
}
```

---

## 四、节点宕机处理

### 默认行为（无健康检查）

Nginx 检测到某节点连接失败时，会**自动跳过该节点**，将请求转发到其他可用节点。  
若所有节点均不可用，返回 **502 Bad Gateway** 或 **504 Gateway Timeout**。

### 配置故障容忍

通过 `max_fails` + `fail_timeout` 控制节点摘除策略：

```nginx
upstream backend {
    # 30 秒内失败 3 次 → 标记宕机，暂停 30 秒后重试
    server backend1.example.com max_fails=3 fail_timeout=30s;
    server backend2.example.com max_fails=3 fail_timeout=30s;

    # 热备节点：仅在所有主节点不可用时启用
    server backup.example.com   backup;
}
```

| 参数 | 说明 |
|---|---|
| `max_fails` | 时间窗口内允许的最大失败次数，超过则标记宕机 |
| `fail_timeout` | 时间窗口长度，同时也是标记宕机后的等待恢复时间 |
| `backup` | 备用节点，主节点全部宕机时才启用 |

### 主动健康检查

:::warning
Nginx 开源版**不内置**主动健康检查，有以下两个选项：

- **Nginx Plus（商业版）**：内置 `health_check` 指令
- **开源方案**：使用 `nginx_upstream_check_module` 第三方模块

:::

```nginx
# nginx_upstream_check_module 示例
upstream backend {
    server backend1.example.com;
    server backend2.example.com;

    # 每 3 秒检查一次，连续失败 3 次标记下线，成功 2 次恢复上线
    check interval=3000 rise=2 fall=3 timeout=1000 type=http;
    check_http_send "HEAD /health HTTP/1.0\r\n\r\n";
    check_http_expect_alive http_2xx;
}
```

### 宕机处理完整流程

```
客户端请求
    │
    ▼
Nginx 负载均衡
    ├─ 节点 A（正常）→ 转发请求 ✅
    ├─ 节点 B（失败次数 < max_fails）→ 仍尝试转发
    └─ 节点 C（失败次数 ≥ max_fails）→ 跳过，等待 fail_timeout

fail_timeout 到期后
    └─ 节点 C 重新加入候选池，发一个探测请求
        ├─ 成功 → 恢复正常 ✅
        └─ 失败 → 继续标记宕机，重新计时
```