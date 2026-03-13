---
title: Logstash 数据管道
outline: deep
---

# Logstash 数据管道

> Logstash 是 Elastic Stack 的核心数据处理引擎，定位是**流式 ETL**（Extract / Transform / Load）。它从多种数据源收集数据，经过解析和转换，再输出到 Elasticsearch 或其他目标。
>
> 底层由 **JRuby** 编写，运行在 JVM 上，因此需要 Java 环境。

---

## 一、三层管道架构

```
数据源
  │
  ▼
┌─────────────────────────────────────────┐
│  Input（收集）                           │
│  从 Beats、Kafka、TCP、文件等读取数据     │
└───────────────────┬─────────────────────┘
                    │ 事件（Event）
                    ▼
┌─────────────────────────────────────────┐
│  Filter（处理）                          │
│  解析、转换、过滤、增强数据               │
└───────────────────┬─────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│  Output（输出）                          │
│  发送到 Elasticsearch、文件、消息队列等  │
└─────────────────────────────────────────┘
```

- **Input** — 通过 `input` 插件收集数据，`codec` 设置解码方式（plain、json、json_lines 等）
- **Filter** — 对数据进行结构化解析，把一行日志变成有意义的字段
- **Output** — 将处理结果发往目标存储，`codec` 对输出进行编码

---

## 二、事件（Event）

Logstash 中数据的基本单元是**事件**，结构类似 JSON 文档：

```json
{
  "@timestamp": "2025-02-14T01:01:01.000Z",
  "@version": "1",
  "message": "192.168.1.1 - GET /index.html 200",
  "log_source": "nginx",
  "client_ip": "192.168.1.1"
}
```

每条日志进入 Logstash 就会被封装成一个事件，经过 Filter 处理后字段不断丰富，最终输出。

---

## 三、执行模型与多管道

### 单管道流程

```
Input → Queue → Workers（Filter + Output）
```

- `input` 接收数据写入 **Queue**
- **多个 Worker 线程**并行从 Queue 取事件，执行 filter 和 output
- Worker 数量可配置（`pipeline.workers`），默认等于 CPU 核心数

### 多管道（Multi-Pipeline）

一个 Logstash 实例可以运行多条独立管道，分别处理不同数据源：

```
管道 A：Kafka → Filter（Nginx日志解析）→ ES index: nginx-logs-*
管道 B：Beats → Filter（应用日志解析）→ ES index: app-logs-*
管道 C：TCP  → Filter（审计日志）      → ES index: audit-logs-*
```

在 `pipelines.yml` 中配置多管道：

```yaml
- pipeline.id: nginx
  path.config: "/etc/logstash/conf.d/nginx.conf"
  pipeline.workers: 2

- pipeline.id: app
  path.config: "/etc/logstash/conf.d/app.conf"
  pipeline.workers: 4
```

---

## 四、队列与可靠性

### 两种队列模式

| 特性 | In-Memory Queue（默认） | Persistent Queue |
|---|---|---|
| 存储介质 | 内存 | 磁盘 |
| 性能 | 更快 | 较慢（磁盘 IO） |
| 数据持久性 | 无，重启丢失 | 有，崩溃可恢复 |
| 可靠性 | 低 | 高 |
| 适用场景 | 高吞吐、可容忍少量丢失 | 金融/审计等不允许丢数据的场景 |

启用持久化队列（在 `logstash.yml` 中）：

```yaml
queue.type: persisted
queue.max_bytes: 4gb
path.queue: /opt/logstash/queue
```

### 死信队列（DLQ）

处理失败且无法重试的事件会进入死信队列，避免阻塞正常管道：

```yaml
# logstash.yml
dead_letter_queue.enable: true
path.dead_letter_queue: /opt/logstash/dlq
```

之后可以用 `dead_letter_queue` input 插件重放这些失败事件：

```ruby
input {
  dead_letter_queue {
    path => "/opt/logstash/dlq"
    commit_offsets => true
  }
}
```

---

## 五、配置文件语法

### 基础模板

```ruby
input {
  # 输入插件配置
}

filter {
  # 过滤处理配置
}

output {
  # 输出目标配置
}
```

:::warning 注释语法
Logstash 配置文件**只支持 `#` 注释**，不支持 `//` 或 `/* */`。
:::

### 条件判断

```ruby
filter {
  if [status] == "404" {
    mutate { add_tag => ["error"] }
  } else if [status] =~ /^5/ {
    mutate { add_tag => ["server_error"] }
  }

  if "beats_input" in [tags] {
    mutate { add_field => { "log_source" => "filebeat" } }
  }
}
```

---

## 六、常用 Input 插件

```ruby
# Beats（Filebeat 推送）
input {
  beats {
    port => 5044
  }
}

# Kafka（消费消息队列）
input {
  kafka {
    bootstrap_servers => "kafka1:9092,kafka2:9092"
    topics            => ["log_topic"]
    group_id          => "logstash_group"
    auto_offset_reset => "latest"
    codec             => "json"
  }
}

# 读取本地文件
input {
  file {
    path            => "/var/log/nginx/access.log"
    start_position  => "beginning"
    sincedb_path    => "/dev/null"   # 测试时用，避免记录读取位置
    codec           => "plain"
  }
}

# TCP 直接推送（测试常用）
input {
  tcp {
    port  => 5000
    codec => plain
  }
}
```

---

## 七、常用 Filter 插件

### Grok — 正则解析非结构化日志

最常用的 Filter，通过模式（Pattern）从一行文本中提取结构化字段。

```ruby
filter {
  grok {
    match => {
      "message" => "%{IPV4:client_ip} - - \[%{HTTPDATE:timestamp}\] \"%{WORD:method} %{URIPATH:request} HTTP/%{NUMBER:http_version}\" %{NUMBER:status_code} %{NUMBER:bytes}"
    }
  }
}
```

输入：
```
192.168.1.1 - - [10/Feb/2025:13:55:36 +0000] "GET /index.html HTTP/1.1" 200 2326
```

提取结果：
```json
{
  "client_ip": "192.168.1.1",
  "timestamp": "10/Feb/2025:13:55:36 +0000",
  "method": "GET",
  "request": "/index.html",
  "status_code": "200",
  "bytes": "2326"
}
```

:::tip Grok 调试
使用 [Grok Debugger](https://grokdebugger.com/) 或 Kibana 内置的 Grok Debugger（Dev Tools → Grok Debugger）在线验证模式。
:::

### Dissect — 高性能固定格式解析

性能优于 Grok，适合**固定分隔符**的结构化日志（无需正则引擎）：

```ruby
filter {
  dissect {
    mapping => { "message" => "%{id} %{function->} %{server}" }
  }
}
```

> `->` 表示跳过多余空白符。

### Date — 时间戳标准化

将日志中的时间字符串转换为 `@timestamp`：

```ruby
filter {
  date {
    match  => ["timestamp", "dd/MMM/yyyy:HH:mm:ss Z"]
    target => "@timestamp"
  }
}
```

### Mutate — 字段变形

```ruby
filter {
  mutate {
    rename  => { "old_field" => "new_field" }         # 重命名
    convert => { "status_code" => "integer" }         # 类型转换
    lowercase => ["method", "username"]               # 转小写
    remove_field => ["message", "@version", "input"]  # 删除字段
    add_field => { "env" => "production" }            # 新增字段
  }
}
```

### KV — 键值对解析

适用于 `key1=value1 key2=value2` 格式的日志：

```ruby
filter {
  kv {
    source      => "message"
    field_split => " "    # 键值对之间的分隔符
    value_split => "="    # 键和值之间的分隔符
  }
}
```

### GeoIP — IP 地理位置

根据 IP 地址补充地理位置信息（国家、城市、经纬度）：

```ruby
filter {
  geoip {
    source => "client_ip"
    target => "geoip"
  }
}
```

### 其他常用 Filter

| Filter | 用途 |
|---|---|
| `useragent` | 解析 User-Agent 字符串，提取浏览器/OS/设备信息 |
| `translate` | 字段值映射替换（如 code → 描述文字） |
| `elasticsearch` | 从 ES 查询数据并附加到当前事件 |
| `jdbc_streaming` | 实时查询外部数据库并附加字段 |
| `jdbc_static` | 一次性查询数据库并缓存结果（适合静态字典数据） |

---

## 八、完整配置案例

### Nginx 日志解析入 ES

```ruby
input {
  file {
    path           => "/var/log/nginx/access.log"
    start_position => "beginning"
    sincedb_path   => "/dev/null"
  }
}

filter {
  # 解析 Nginx 标准日志格式
  grok {
    match => {
      "message" => "%{IPV4:client_ip} - - \[%{HTTPDATE:log_time}\] \"%{WORD:method} %{URIPATH:request} HTTP/%{NUMBER:http_version}\" %{NUMBER:status_code} %{NUMBER:bytes}"
    }
  }

  # 标准化时间戳
  date {
    match  => ["log_time", "dd/MMM/yyyy:HH:mm:ss Z"]
    target => "@timestamp"
  }

  # IP 地理位置
  geoip {
    source => "client_ip"
  }

  # 清理原始字段
  mutate {
    convert      => { "status_code" => "integer" "bytes" => "integer" }
    remove_field => ["message", "log_time"]
  }
}

output {
  elasticsearch {
    hosts    => ["http://localhost:9200"]
    index    => "nginx-access-%{+YYYY.MM.dd}"
    # user   => "elastic"       # 开启认证时取消注释
    # password => "your_pass"
  }
  # stdout { codec => rubydebug }  # 调试时打开
}
```

### Kafka + Beats 多源接入

```ruby
input {
  kafka {
    bootstrap_servers => "kafka1:9092,kafka2:9092"
    topics            => ["app_logs"]
    group_id          => "logstash_group"
    codec             => "json"
  }

  beats {
    port => 5044
  }
}

filter {
  # 按来源分别处理
  if [@metadata][kafka] {
    mutate { add_field => { "log_source" => "kafka" } }
  } else {
    mutate { add_field => { "log_source" => "filebeat" } }
  }
}

output {
  elasticsearch {
    hosts => ["http://elasticsearch:9200"]
    index => "logs-%{log_source}-%{+YYYY.MM.dd}"
  }
}
```

---

## 九、配置更新与运维

### 验证配置语法

修改配置后**先验证语法**，再重启，避免启动失败：

```bash
bin/logstash -t -f /path/to/logstash.conf
# 输出 "Configuration OK" 则通过
```

### 重启服务

```bash
# Docker 部署
docker restart logstash

# systemd 部署
sudo systemctl restart logstash

# 查看运行日志
docker logs -f logstash
sudo journalctl -u logstash -f
```

### 常用监控命令

```bash
# 查看管道状态（需开启监控 API）
curl http://localhost:9600/_node/stats/pipelines

# 查看 JVM 状态
curl http://localhost:9600/_node/stats/jvm
```

:::tip 生产环境建议
- 启用 **Persistent Queue** 防止数据丢失
- 开启 **Dead Letter Queue** 保留处理失败的事件
- `stdout` 输出仅在调试时开启，生产环境关闭
- 合理设置 `pipeline.workers` 和 `pipeline.batch.size` 调优吞吐量
  :::
