---
title: RESTful API 设计规范
---

# RESTful API 设计规范

**REST**（Representational State Transfer，表述性状态转移）是一种基于 HTTP 协议的架构风格，通过**资源（Resource）** 与**标准 HTTP 方法**来实现客户端与服务端的交互，是目前 Web API 设计的主流规范。

---

## 一、核心原则

### 资源为中心

一切数据或服务均抽象为**资源**（如用户、订单、商品），每个资源由唯一的 URI 标识。

```
/users/123        → ID 为 123 的用户
/users/123/orders → 该用户的所有订单
```

### 统一接口

使用标准 HTTP 方法操作资源，禁止在 URI 中使用动词：

| HTTP 方法 | 语义         | 示例                     |
| :-------- | :----------- | :----------------------- |
| `GET`     | 获取资源     | `GET /users/123`         |
| `POST`    | 创建资源     | `POST /users`            |
| `PUT`     | 全量更新资源 | `PUT /users/123`         |
| `PATCH`   | 部分更新资源 | `PATCH /users/123`       |
| `DELETE`  | 删除资源     | `DELETE /users/123`      |

### 无状态

服务端**不保存**客户端的会话状态，每次请求须携带完整的认证信息。

```http
GET /users/123
Authorization: Bearer <token>
```

### 资源表述

资源可以 JSON、XML 等多种格式返回，客户端通过 `Accept` 头指定：

```http
GET /users/123
Accept: application/json
```

### HATEOAS（超媒体驱动）

响应中包含相关资源的链接，客户端可通过链接自主发现可用操作：

```json
{
  "id": 123,
  "name": "John",
  "links": [
    { "rel": "self",   "href": "/users/123" },
    { "rel": "orders", "href": "/users/123/orders" }
  ]
}
```

:::tip
HATEOAS 在实际项目中并非强制要求，可根据团队规范决定是否实现。
:::

---

## 二、URI 设计规则

**使用名词复数形式，不含动词：**

```
✅ GET /users
❌ GET /getUsers
```

**层级关系用 `/` 表达资源归属：**

```
/users/123/orders/456   → 用户 123 下的订单 456
```

**过滤、分页、排序使用查询参数：**

```
/users?role=admin&sort=name,desc&page=1&size=20
```

**版本号放在 URI 最前端：**

```
/v1/users
/v2/users
```

:::warning 常见 URI 误区
| 错误写法 | 正确写法 |
|---|---|
| `/getUsers` | `/users` |
| `/users/delete/123` | `DELETE /users/123` |
| `/api/v1/getUserById/123` | `/v1/users/123` |
:::

---

## 三、HTTP 方法语义

| 方法     | 幂等 | 安全 | 说明                           |
| :------- | :--- | :--- | :----------------------------- |
| `GET`    | ✅   | ✅   | 只读，不改变资源状态           |
| `POST`   | ❌   | ❌   | 每次调用可能创建不同的资源     |
| `PUT`    | ✅   | ❌   | 需提交完整数据，多次结果一致   |
| `PATCH`  | ❌   | ❌   | 只提交修改字段，谨慎保证幂等   |
| `DELETE` | ✅   | ❌   | 多次删除同一资源，结果一致     |

:::info 概念说明
- **幂等性**：多次执行相同操作，结果与执行一次相同。
- **安全性**：操作不会修改资源状态（仅读取）。
:::

---

## 四、HTTP 状态码

### 2xx 成功

| 状态码      | 含义             | 适用场景              |
| :---------- | :--------------- | :-------------------- |
| `200 OK`    | 请求成功         | GET / PUT / PATCH     |
| `201 Created` | 资源创建成功   | POST                  |
| `204 No Content` | 成功但无返回体 | DELETE              |

### 4xx 客户端错误

| 状态码               | 含义       | 适用场景               |
| :------------------- | :--------- | :--------------------- |
| `400 Bad Request`    | 请求参数错误 | 字段缺失、格式非法    |
| `401 Unauthorized`   | 未认证     | 未携带或 Token 失效    |
| `403 Forbidden`      | 无权限     | 已认证但无操作权限     |
| `404 Not Found`      | 资源不存在 | URI 对应资源未找到     |
| `405 Method Not Allowed` | 方法不允许 | 对该资源使用了不支持的 HTTP 方法 |
| `409 Conflict`       | 资源冲突   | 重复创建、版本冲突     |
| `422 Unprocessable Entity` | 语义错误 | 请求格式正确但业务校验失败 |

### 5xx 服务端错误

| 状态码                      | 含义         | 适用场景           |
| :-------------------------- | :----------- | :----------------- |
| `500 Internal Server Error` | 服务端异常   | 代码报错、未捕获异常 |
| `502 Bad Gateway`           | 网关错误     | 上游服务无响应     |
| `503 Service Unavailable`   | 服务不可用   | 服务维护或过载     |

:::warning
❌ 不要所有接口都返回 `200`，再通过响应体里的 `code` 字段区分成功与失败——这会破坏 HTTP 语义，并导致监控、日志、网关等基础设施无法正确工作。
:::

---

## 五、设计示例：用户管理 API

| 操作         | 方法     | URI            | 请求体                            |
| :----------- | :------- | :------------- | :-------------------------------- |
| 获取用户列表 | `GET`    | `/users`       | —                                 |
| 创建用户     | `POST`   | `/users`       | `{ "name": "John", "age": 30 }`   |
| 获取单个用户 | `GET`    | `/users/123`   | —                                 |
| 全量更新用户 | `PUT`    | `/users/123`   | `{ "name": "John", "age": 31 }`   |
| 部分更新用户 | `PATCH`  | `/users/123`   | `{ "age": 31 }`                   |
| 删除用户     | `DELETE` | `/users/123`   | —                                 |

**请求 / 响应示例：**

::: code-group

```http [创建用户]
POST /v1/users
Content-Type: application/json

{
  "name": "John",
  "age": 30
}
```

```http [响应]
HTTP/1.1 201 Created
Location: /v1/users/123

{
  "id": 123,
  "name": "John",
  "age": 30
}
```

:::

---

## 六、常见误区

::: details ❌ 滥用 POST 完成所有操作
```
POST /users/delete/123   ❌
DELETE /users/123        ✅
```
:::

::: details ❌ URI 中混入动词
```
/getUsers        ❌
/updateUser/123  ❌

/users           ✅
/users/123       ✅
```
:::

::: details ❌ 忽略状态码语义，全部返回 200
```json
// ❌ 错误做法：HTTP 状态码 200，通过 code 区分错误
{ "code": 404, "message": "用户不存在" }

// ✅ 正确做法：HTTP 状态码 404
HTTP/1.1 404 Not Found
{ "message": "用户不存在" }
```
:::

::: details ❌ URI 层级过深
```
/api/v1/getUserById/123/getOrders   ❌
/v1/users/123/orders                ✅
```
:::

---

## 七、适用场景

**适合 RESTful 的场景：**
- 对外开放的公共 API
- 资源型服务（用户、商品、订单等 CRUD）
- 需要跨平台调用（Web、移动端、第三方）

**不适合 RESTful 的场景：**

| 场景           | 推荐方案          |
| :------------- | :---------------- |
| 实时通信（聊天）| WebSocket        |
| 复杂事务操作   | RPC（gRPC 等）    |
| 灵活数据查询   | GraphQL           |