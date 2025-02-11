---
title: RESTful 设计风格
order: 4
icon: carbon:api-1
---

RESTful 是一种基于 **REST（Representational State Transfer，表述性状态转移）** 架构风格的设计规范，主要用于构建高效、可扩展的 Web 服务。它通过 **资源（Resource）** 和 **HTTP 协议** 的标准方法来实现客户端与服务端的交互。以下是 RESTful 设计的核心要点和实现原则：

------

### **一、核心原则**

1. **资源（Resource）为中心**

   - 所有数据或服务抽象为 **资源**（如用户、订单、商品），每个资源有唯一的标识符（URI）。
   - 示例：`/users/123` 表示 ID 为 123 的用户资源。

2. **统一接口（Uniform Interface）**

   - 使用标准的 HTTP 方法操作资源：

     - `GET`：获取资源
     - `POST`：创建资源
     - `PUT`：全量更新资源
     - `PATCH`：部分更新资源
     - `DELETE`：删除资源

   - 示例：

     ```bash
     GET /users/123       # 获取用户123的信息
     DELETE /users/123    # 删除用户123
     ```

3. **无状态（Stateless）**

   - 服务端不保存客户端会话状态，每次请求必须包含所有必要信息。
   - 示例：客户端通过 `Authorization` 头传递身份认证信息，而不是依赖服务端的 Session。

4. **资源表述（Representation）**

   - 资源的表现形式可以是 JSON、XML、HTML 等，客户端通过 `Accept` 头指定需要的格式。

   - 示例：

     ```http
     GET /users/123
     Accept: application/json  # 返回JSON格式数据
     ```

5. **超媒体驱动（HATEOAS）**

   - 响应中应包含指向相关资源的链接（Hyperlinks），客户端通过链接发现和操作资源。

   - 示例：

     ```json
     {
       "id": 123,
       "name": "John",
       "links": [
         { "rel": "self", "href": "/users/123" },
         { "rel": "orders", "href": "/users/123/orders" }
       ]
     }
     ```

------

### **二、RESTful API 设计规范**

#### 1. **URI 设计规则**

- 使用名词（复数形式）表示资源，避免动词：
  - ✅ `/users`（正确）
  - ❌ `/getUsers`（错误，动词不应出现在URI中）
- 层级关系用 `/` 分隔：
  - `/users/123/orders` 表示用户123的所有订单。
- 过滤、排序参数用查询字符串（Query String）：
  - `/users?role=admin&sort=name,desc`

#### 2. **HTTP 方法语义**

| 方法   | 幂等性 | 安全性 | 典型场景                       |
| :----- | :----- | :----- | :----------------------------- |
| GET    | 是     | 是     | 获取资源                       |
| POST   | 否     | 否     | 创建资源                       |
| PUT    | 是     | 否     | 全量更新资源（需提交完整数据） |
| PATCH  | 否     | 否     | 部分更新资源（仅提交修改字段） |
| DELETE | 是     | 否     | 删除资源                       |

> **幂等性**：多次操作结果相同（如 PUT 多次更新同一资源，结果一致）。
> **安全性**：操作不改变资源状态（如 GET 只是读取）。

#### 3. **状态码（HTTP Status Codes）**

- 用标准状态码明确操作结果：

  | 状态码                    | 含义         | 场景示例       |
  | :------------------------ | :----------- | :------------- |
  | 200 OK                    | 成功         | GET/PUT 成功   |
  | 201 Created               | 资源创建成功 | POST 成功      |
  | 204 No Content            | 无返回内容   | DELETE 成功    |
  | 400 Bad Request           | 客户端错误   | 请求参数不合法 |
  | 401 Unauthorized          | 未认证       | 缺少身份凭证   |
  | 404 Not Found             | 资源不存在   | 请求的URI无效  |
  | 500 Internal Server Error | 服务端错误   | 代码异常       |

------

### **三、RESTful 示例**

#### 用户管理 API 设计

| 操作             | HTTP 方法 | URI          | 请求体示例（JSON）              |
| :--------------- | :-------- | :----------- | :------------------------------ |
| 获取所有用户     | GET       | `/users`     | -                               |
| 创建用户         | POST      | `/users`     | `{ "name": "John", "age": 30 }` |
| 获取单个用户     | GET       | `/users/123` | -                               |
| 更新用户（全量） | PUT       | `/users/123` | `{ "name": "John", "age": 31 }` |
| 更新用户（部分） | PATCH     | `/users/123` | `{ "age": 31 }`                 |
| 删除用户         | DELETE    | `/users/123` | -                               |

------

### **四、常见误区**

1. **滥用 POST**
   - ❌ 用 POST 完成所有操作（如 `POST /users/delete`）。
   - ✅ 使用 DELETE 方法删除资源。
2. **URI 包含动词**
   - ❌ `/getUsers` 或 `/updateUser`。
   - ✅ 用 HTTP 方法（GET、PUT）替代动词。
3. **忽略状态码语义**
   - ❌ 所有响应都返回 200，通过响应体传递错误信息。
   - ✅ 正确使用 4xx 和 5xx 状态码。
4. **过度设计 URI**
   - ❌ `/api/v1/getUserById/123`。
   - ✅ 简化层级：`/v1/users/123`。

------

### **五、RESTful 的适用场景**

- **需要标准化的 API**：如公共开放接口。
- **资源型服务**：如用户管理、商品目录等。
- **跨平台交互**：Web、移动端、第三方系统均可调用。

### **不适用场景**

- 实时通信（如聊天）→ 考虑 WebSocket。
- 复杂事务操作 → 考虑 RPC 风格。