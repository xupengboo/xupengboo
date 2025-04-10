---
title: Spring Cloud 认证架构
order: 2
icon: material-symbols:cloud
---

## 架构图

```md
 客户端
   │
   │ 携带 JWT
   ▼
 Gateway（网关）─────┬─ 校验 Token 签名/过期时间
                   │
                   │ 无效：返回 401
                   │
                   │ 有效：转发请求
                   ▼
           业务服务（如 User-Service）
                   │
                   │ 解析 JWT，提取权限
                   │
                   │ 校验权限（如 user:read）
                   │
                   ▼
                返回数据
```

