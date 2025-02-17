---
title: Logstash 管道
order: 2
---

## 1. Logstash 介绍

Logstash 是 Elastic Stack 的中央数据流引擎，用于收集、丰富和统一所有数据，而不管格式或模式。

Logstash 是 开源的流式 ETL 引擎（Extract，Transform，Load  即 提取、转换、加载）。

一个整体的数据处理架构中：（Logstash 扮演一个集中收集的角色）

![image-20250214154443020](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250214154443020.png)

![image-20250214154555677](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250214154555677.png)



:::tip

**Logstash** 是基于 **Java** 编写的，具体来说，它是用 **JRuby**（Java 语言实现的 Ruby）开发的，运行在 **JVM**（Java Virtual Machine）上。Logstash 本身是一个基于 **Ruby** 的应用程序，但它依赖于 **JVM** 和一些 Java 库来提供高效的并发处理和跨平台支持。

:::

## 2.  Logstash 三层构造

**第一层 `Inputs` ：收集数据**

- 通过 `input` 插件收集和反序列化。

- `Codecs` 用来设置解码器，收集到的文件的编码方式肯定不同，可以通过设置解码器来配置。

> `input`方式 有很多，例如：Beats、TCP、UDP、HTTP、文件读取等等。
>
> **一般而言，`input` 会采取 `Kafka`、`Beats` 进行读取。**

**第二层 `Filters` ：数据处理**

- 使用 `filter` 插件来结构化、转换和充实你的数据。

> 例如：`Nginx` 日志，发送过来之后可能只是一行数据，但是这一行数据包含了 时间、请求方法、请求头等等信息，就可以通过这一步操作进行结构化以及数据转换。【简单一句话，就是将杂乱无章的数据，变得更加漂亮、架构化、更加具有表达性。】

**第三层 `Outputs` ：输出**

- 使用 `output` 插件将数据发送到 Elasticsearch 或是其他目的地。

- `Codecs` 用来进行编码。

![image-20250214160921805](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250214160921805.png)

:::info

持久化队列（保证数据可靠）：At-least-once 交付保障和基于持久化队列的自适应缓冲（先写入磁盘）。

错误事件（例如：格式转换出问题）：将错误事件发送到死信队列（dead letter queue）中，用于离线处理和重放。

:::

## 3. Pipeline Dynamics  动态管道

支持 带条件的多管道 ：

- 就像下面一样，每个管道处理不同数据源的日志。

![image-20250214161816463](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250214161816463.png)

## 4. Logstash 原理

### 4.1 基本配置和事件

一个最基本的配置：

```nginx
input {
    beats { port => 5043 }  // 客户端的beats，向当前服务5043端口推送数据来接受。
}

filter {
    mutate { lowercase => ["message"] } // 将数据含有message的数据，进行小写转换。
}

output {
    elasticsearch {} // 需要配置一个elasticsearch，将信息发送到es中。
}
```

一个事件：

- Logstash 主要的数据单元就是事件。
- 它是文档类型和JSON文档类型很相似，支持任意层次结构和类型。
- 它代表了输入数据（如日志、系统指标、数据库记录等）在 Logstash 流程中的一次处理单元。

```json
{
    "@timestamp" => 2017-09-09T01-01-01,
    "message" => "bar",
    "some_other_field" => {
        "has_complex_values" => 123
    }
}
```

### 3.4.2 Logstash 执行模型

**一个管道包含数据处理的一个逻辑流程**。大体逻辑如下：

1. 管道从 `input` 接受数据
2. 把他们发送到 `queue`
3. 然后把他们传递给 `workers` 来处理

![image-20250214164330894](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250214164330894.png)

**Pipelines 管道可以伸缩**：

- 支持多个 `inputs` 
- 支持多个 `workers` 来处理 `filter/output` 部分

![image-20250214164607672](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250214164607672.png)

**一个 Logstash 可以包含多个管道**：

- 一个 Logstash 实例通常对应单个 Logstash 进程
- 一个实例能包含多个管道在里面
- 这些管道可以分别用来处理不同的数据流

![image-20250214165136670](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250214165136670.png)

## 5. Logstash 队列和交付保障

Queue 两种队列：`In-Memory Queue` 和 `Persistent Queue`

- 默认为：`In Memory Queue（默认）` 

| 特性           | **In-Memory Queue**                          | **Persistent Queue**                      |
| -------------- | -------------------------------------------- | ----------------------------------------- |
| **存储介质**   | 内存                                         | 磁盘                                      |
| **性能**       | 更快（因为存储在内存中）                     | 较慢（磁盘操作会比内存慢）                |
| **数据持久性** | 无持久性，系统重启后数据丢失                 | 有持久性，数据不会丢失                    |
| **可靠性**     | 低（数据丢失的风险）                         | 高（即使系统崩溃，也能恢复数据）          |
| **资源消耗**   | 消耗内存，受限于机器内存容量                 | 消耗磁盘空间，受限于磁盘容量              |
| **配置复杂性** | 配置简单，默认就是内存队列                   | 配置稍复杂，需要管理磁盘空间和队列大小    |
| **适用场景**   | 高吞吐量、低延迟的数据流转（可接受数据丢失） | 需要保证数据不丢失、对可靠性要求高的场景: |

:::info 至少一次交付

![image-20250214170028896](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250214170028896.png)

:::

## 6.  Logstash 死信队列

死信队列（DLQ）：

- 有效消息根本无法传递。
- 第二次尝试处理它们还是失败。
- 这些事件可被丢弃或者记录日志，或是发送到死信队列。
- DLQ 可以晚点再次重放。【这个重放是需要手动触发的】

![image-20250214170504100](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250214170504100.png)

## 7. Logstash 使用

### 7.1 简单测试

下载 Logstash：[Download Logstash Free | Get Started Now | Elastic](https://www.elastic.co/cn/downloads/logstash)

```bash
# stdin：控制台输入，stdout：控制台输出
bin/logstash -e 'input { stdin { } } output { stdout {} }' 
```

![PixPin_2025-02-14_17-42-57](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/PixPin_2025-02-14_17-42-57.gif)

### 7.2 官方 DEMO日志

官方有提供一些 DEMO 日志：https://github.com/elastic/examples ， 可以直接使用。

采用官方 [Apache Logs](https://github.com/elastic/examples/tree/master/Common%20Data%20Formats/apache_logs) 的DEMO日志。

![image-20250215141637406](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250215141637406.png)

### 7.3 官方配置文档

1. 确定自己使用的 Logstash 版本，去找对应的文档：[Logstash Reference | Elastic](https://www.elastic.co/guide/en/logstash/index.html)

2. 可以看到 `Input plugins` 、`Output plugins`、`Filter plugins` 对应的介绍和配置使用：

![image-20250215141915085](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250215141915085.png)

:::info Grok filter plugin的使用

 **Grok filter plugin** 是一个非常常用的插件，用于从文本日志中提取结构化数据。它通过匹配文本中的模式（通常是正则表达式）来识别并提取信息，常用于处理来自不同来源的非结构化或半结构化日志数据。

例如：

```plaintext
filter {
  grok {
    match => { "message" => "%{IPV4:client_ip} - - \[%{HTTPDATE:timestamp}\] \"%{WORD:method} %{URIPATH:request} HTTP/%{NUMBER:http_version}\" %{NUMBER:status_code} %{NUMBER:bytes}" }
  }
}
```

假设，你有以下日志行：

```swift
192.168.1.1 - - [10/Feb/2025:13:55:36 +0000] "GET /index.html HTTP/1.1" 200 2326
```

你可以使用 Grok 模式来提取日志中的各个部分：

```plaintext
%{IPV4:client_ip} - - \[%{HTTPDATE:timestamp}\] "%{WORD:method} %{URIPATH:request} HTTP/%{NUMBER:http_version}" %{NUMBER:status_code} %{NUMBER:bytes}
```

:::

### 7.4 Logstash 配置案例

一个加载本地文件的 Logstash 配置：

```plaintext
input {
  file {
    path => "/path/to/your/access.log"  # 设置你的日志文件路径
    start_position => "beginning"        # 从文件开始读取
    sincedb_path => "/dev/null"          # 避免记录读取位置（适用于开发/测试）
    codec => "plain"                     # 读取为纯文本
  }
}

filter {
  # 使用 Grok 过滤器解析日志
  grok {
    match => { 
      "message" => "%{IPV4:client_ip} - - \[%{HTTPDATE:timestamp}\] \"%{WORD:method} %{URIPATH:request} HTTP/%{NUMBER:http_version}\" %{NUMBER:status_code} %{NUMBER:bytes}"
    }
  }

  # 可选：如果时间戳格式不是标准的，可以使用 date filter 来调整事件时间
  date {
    match => [ "timestamp", "dd/MMM/yyyy:HH:mm:ss Z" ]
    target => "@timestamp"  # 将解析后的时间戳设置为 Logstash 默认的 @timestamp 字段
  }

  # 可选：删除不需要的原始字段
  mutate {
    remove_field => [ "message", "timestamp" ]
  }
}

output {
  # 输出到 Elasticsearch
  elasticsearch {
    hosts => ["http://localhost:9200"]    # Elasticsearch 地址
    index => "access-log-%{+YYYY.MM.dd}"  # 根据日期生成索引
    user => "your_username"               # 如果需要认证，提供用户名
    password => "your_password"           # 如果需要认证，提供密码
  }

  # 可选：输出到控制台（便于调试）
  stdout {
    codec => rubydebug  # 将事件输出为可读的 Ruby 格式
  }
}
```

:::tip Elasticsearch 

**Logstash** 会自动创建 Elasticsearch 索引，前提是你在 `output` 配置中指定了一个索引名。如果索引不存在，Logstash 会自动在 Elasticsearch 中创建它。

细节：

- **自动创建索引**：当你指定一个索引模板（如 `access-log-%{+YYYY.MM.dd}`），Logstash 会根据该模板自动创建一个新的索引。例如，如果今天是 2025 年 2 月 15 日，索引会被创建为 `access-log-2025.02.15`。
- **索引模板**：如果你希望在创建索引时使用特定的映射（mapping）和设置（settings），可以提前在 Elasticsearch 中创建一个索引模板。Logstash 默认会根据数据类型自动选择映射，但你也可以通过 Elasticsearch API 自定义模板，以确保更复杂的映射和性能设置。

:::

`Kafka`、`Beats` 的案例：

```plaintext
input {
  # Kafka 输入配置
  kafka {
    bootstrap_servers => "kafka1:9092,kafka2:9092"  # Kafka 集群地址
    topics => ["log_topic"]                          # Kafka 主题
    group_id => "logstash_group"                      # 消费者组 ID
    auto_offset_reset => "latest"                     # 从最新消息开始消费
    codec => "json"                                  # 假设消息格式是 JSON
  }

  # Beats 输入配置
  beats {
    port => 5044  # Beats 收集器默认端口
  }
}
```

## 8. Logstash Modules 使用

Logstash 中的 **modules** 是一组预配置的配置文件和管道，用于帮助用户更轻松地处理和解析特定类型的数据。

只需要指定一些名称就能处理，简化配置，自动检测和解析。

## 9. Logstash 常用的 Filter 解析器

### 9.1 Grok filter

用于从文本日志中提取结构化数据。它通过匹配文本中的模式（通常是正则表达式）来识别并提取信息，常用于处理来自不同来源的非结构化或半结构化日志数据。

例如：

```plaintext
filter {
  grok {
    match => { "message" => "%{IPV4:client_ip} - - \[%{HTTPDATE:timestamp}\] \"%{WORD:method} %{URIPATH:request} HTTP/%{NUMBER:http_version}\" %{NUMBER:status_code} %{NUMBER:bytes}" }
  }
}
```

假设，你有以下日志行：

```swift
192.168.1.1 - - [10/Feb/2025:13:55:36 +0000] "GET /index.html HTTP/1.1" 200 2326
```

你可以使用 Grok 模式来提取日志中的各个部分：

```plaintext
%{IPV4:client_ip} - - \[%{HTTPDATE:timestamp}\] "%{WORD:method} %{URIPATH:request} HTTP/%{NUMBER:http_version}" %{NUMBER:status_code} %{NUMBER:bytes}
```

### 9.2 Date Filter

解析日期字段，将其转换为标准的时间戳格式（Epoch 时间）。特别适用于从日志中提取的日期字段，确保日期字段的一致性。

```plaintext
filter {
	date {
		match => ["timestamp_string", "ISO8601"]
	}
}
```

### 9.3 DissectFilter

一个非常高效且快速的文本解析工具。它专门用于按固定模式拆解文本数据，通常用于处理结构化且模式简单的日志数据。

性能通常优于 `grok` 。

```plaintext
filter {
	dissect {
		mapping => { "message" => "%{id} %{function->} %{server}" }
	}
}
```

### 9.4 KV Filter

用于解析键值对格式的数据（例如：`key1=value1 key2=value2`）。这对于解析如日志中的某些定制字段非常有用。

```plaintext
filter {
  kv {
    source => "message"
    field_split => " "
    value_split => "="
  }
}
```

如果 `message` 字段包含以空格分隔的键值对，`kv` 过滤器会将每对键值解析为独立的字段。

### 9.5 Mutate Filter

用于修改事件中的字段，包括重命名字段、删除字段、添加字段、转换字段类型等。

常见操作：

- `rename`：重命名字段
- `replace`：替换字段的值
- `uppercase/lowercase`：转换大小写
- `convert`：转换字段类型（例如将字符串转换为整数）

示例：

```plaintext
filter {
  mutate {
    rename => { "old_field" => "new_field" }
    lowercase => [ "username", "email" ]
    convert => { "age" => "integer" }
  }
}
```

这将重命名字段 `old_field` 为 `new_field`，将 `username` 和 `email` 字段转换为小写，并将 `age` 字段转换为整数类型。

### 9.6 其他 Filter

1. Conditional Logic （条件逻辑）：条件逻辑允许根据事件中的某些字段或条件决定是否执行特定的过滤器或输出操作。

2. GeoIP Filter（地理位置过滤器）：`geoip` 过滤器根据 IP 地址查找地理位置信息（如国家、城市、经纬度等）。它能够帮助您为 IP 地址提供位置数据。

```plaintext
filter {
    geoip {
        source => "client_ip"
        target => "geoip"
    }
}
```

​	该过滤器会查找 `client_ip` 字段中的 IP 地址，并将解析结果存储在 `geoip` 字段中。

3. User Agent Filter （用户代理过滤器）：`useragent` 过滤器用于解析 `User-Agent` 字符串，并提取浏览器、操作系统、设备类型等信息。它使得您可以对用户的设备和浏览器进行分析。

```plaintext
filter {
  useragent {
    source => "user_agent"
    target => "user_agent_info"
  }
}
```

该过滤器会解析 `user_agent` 字段，并将解析后的结果存储在 `user_agent_info` 字段中。

4. Translate Filter（翻译过滤器）：`translate` 过滤器用于将事件中的字段值映射到另一种值。它可以根据一个字段的值查找相应的翻译或值，并将其替换为新的字段值。

```plaintext
filter {
  translate {
    field => "country_code"
    destination => "country_name"
    dictionary_path => "/path/to/countries.yml"
    fallback => "unknown"
  }
}
```

​	该过滤器会根据 `country_code` 字段的值查找 `countries.yml` 字典文件中的匹配项，并将匹配的结果存储在 `country_name` 字段中。如果没有找到匹配项，则使用 `"unknown"` 作为回退值。

5. Elasticsearch Filter（Elasticsearch 过滤器）：`elasticsearch` 过滤器允许您在 Elasticsearch 中查询数据，并根据查询结果更新或修改当前事件。

```plaintext
filter {
  elasticsearch {
    hosts => ["http://localhost:9200"]
    query => "status_code:%{status}"
    fields => ["timestamp", "client_ip"]
    target => "elasticsearch_data"
  }
}
```

​	该过滤器会根据 `status_code` 字段的值在 Elasticsearch 中查询相关的数据，并将查询结果存储在 `elasticsearch_data` 字段中。

6. JDBC Streaming Filter（JDBC 流式过滤器）：`jdbc_streaming` 过滤器允许 Logstash 在执行数据处理的过程中，通过 JDBC 连接从外部数据库中查询数据并将结果添加到事件中。它是对数据库的实时流式查询，适用于需要与外部数据库交互的场景。

```plaintext
filter {
  jdbc_streaming {
    jdbc_connection_string => "jdbc:mysql://localhost:3306/mydb"
    jdbc_user => "user"
    jdbc_password => "password"
    statement => "SELECT name FROM users WHERE id = :id"
    parameters => { "id" => "user_id" }
    target => "user_info"
  }
}
```

该过滤器会通过 JDBC 连接到 MySQL 数据库，查询用户表中的 `name` 字段，并将查询结果存储在 `user_info` 字段中。

7. JDBC Static Filter（JDBC 静态过滤器）：`jdbc_static` 过滤器与 `jdbc_streaming` 类似，不过它是静态查询，即查询一次然后缓存结果。适用于那些不需要频繁更新的查询，性能相对更好。

## 10. Logstash 监控管理

默认 Logstash 是没有监控的，启用需要进行配置，启用 X-Pack 监控。

同样 kibana 也可以监控 Logstash ，也是需要启动对 Logstash 的监控支持。

## 11. Logstash 更新配置 步骤

在重新配置 Logstash 后，配置更改 **不会立刻生效**，除非你 **重启 Logstash**。

1. 修改你的 `logstash.conf` 或其他相关的配置文件。
2. **验证配置文件正确性**：

```bash
bin/logstash -t -f /opt/logstash/logstash-8.17.2/config/pipelines.yml
# -t：这个选项告诉 Logstash 检查配置文件的语法是否正确
# -f：这个选项用来指定配置文件的路径。

# 没问题会打印：Configuration OK 标识
```

3. 重启 Logstash 服务。

```bash
# docker部署：
sodu docker restart logstash
# 本地部署：
sudo systemctl restart logstash
```

4. 检查 Logstash 日志。

