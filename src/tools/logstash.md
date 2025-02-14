---
title: Elastic Stack（ELK、Beats）
order: 8
icon: hugeicons:tools
---

## 1. Elastic Stack 

**Elasticsearch**

- **功能**：Elasticsearch 是一个分布式的全文搜索和分析引擎，广泛应用于**日志和数据分析**。它支持强大的搜索功能和实时数据分析，并能够处理大规模的结构化和非结构化数据。
- **特点**：它基于 Apache Lucene 库，使用 RESTful API，能够快速检索、分析和可视化海量数据，支持分布式架构、横向扩展。
- **应用场景**：日志索引和搜索、应用性能监控、网站搜索功能等。

**Kibana**

- **功能**：Kibana 是一个数据可视化工具，能够与 Elasticsearch 紧密集成，用来展示和分析存储在 Elasticsearch 中的数据。它提供了丰富的图表、仪表板、地图和可视化工具，帮助用户从数据中发现趋势和异常。
- **特点**：具有图形化界面，易于操作。用户可以通过 Kibana 创建动态的仪表板，并与团队共享分析结果。
- **应用场景**：日志分析、指标监控、业务数据展示等。

**Logstash**

- **功能**：Logstash 是一个数据收集和处理管道工具，可以从各种不同的数据源（日志文件、数据库、消息队列等）中获取数据，并对数据进行解析、过滤、转换、增强，最后将其发送到 Elasticsearch 或其他目标存储。
- **特点**：提供了丰富的插件支持，可以对数据进行灵活的格式转换（如 JSON、CSV、XML 等）。它还支持处理数据流的增量更新。
- **应用场景**：日志收集与过滤、数据格式转换、从不同来源聚合数据等。

**Beats**

- **功能**：Beats 是 Elastic Stack 中的轻量级数据收集器，专门用于在边缘设备或客户端收集数据，并将其发送到 Logstash 或 Elasticsearch。Beats 提供了多种不同的工具来收集特定类型的数据，如 Filebeat（收集日志文件）、Metricbeat（收集系统指标）、Packetbeat（收集网络流量数据）等。
- **特点**：每种 Beats 工具都针对特定类型的数据进行优化，轻量且高效。
- **应用场景**：实时日志收集、基础设施监控、网络流量分析等。

![image-20250214151625227](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250214151625227.png)

## 2. Elastic Cloud

Elastic Cloud 是 Elastic 公司提供的云服务，用于部署和管理 Elastic Stack（包括 Elasticsearch、Kibana、Logstash 等工具）。它的主要作用包括：

1. 简化部署：快速创建和管理 Elasticsearch 集群。
2. 弹性扩展：根据需求动态调整资源。
3. 高可用性：内置冗余和故障转移机制。
4. 监控与管理：提供集中化的监控和管理工具。

![image-20250214153355828](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250214153355828.png)



## 3. Logstash

### 3.1 Logstash 介绍

Logstash 是 Elastic Stack 的中央数据流引擎，用于收集、丰富和统一所有数据，而不管格式或模式。

Logstash 是 开源的流式 ETL 引擎（Extract，Transform，Load  即 提取、转换、加载）。

一个整体的数据处理架构中：（Logstash 扮演一个集中收集的角色）

![image-20250214154443020](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250214154443020.png)

![image-20250214154555677](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250214154555677.png)



:::tip

**Logstash** 是基于 **Java** 编写的，具体来说，它是用 **JRuby**（Java 语言实现的 Ruby）开发的，运行在 **JVM**（Java Virtual Machine）上。Logstash 本身是一个基于 **Ruby** 的应用程序，但它依赖于 **JVM** 和一些 Java 库来提供高效的并发处理和跨平台支持。

:::

### 3.2  Logstash 三层构造

**第一层 `Inputs` ：收集数据**

- 通过 `input` 插件收集和反序列化。

- `Codecs` 用来设置解码器，收集到的文件的编码方式肯定不同，可以通过设置解码器来配置。

> `input`方式 有很多，例如：Beats、TCP、UDP、HTTP等等。

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

### 3.3 Pipeline Dynamics  动态管道

支持 带条件的多管道 ：

- 就像下面一样，每个管道处理不同数据源的日志。

![image-20250214161816463](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250214161816463.png)

### 3.4 Logstash 原理

#### 3.4.1 基本配置和事件

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

#### 3.4.2 Logstash 执行模型

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

### 3.5 Logstash 队列和交付保障

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

### 3.6  Logstash 死信队列

死信队列（DLQ）：

- 有效消息根本无法传递。
- 第二次尝试处理它们还是失败。
- 这些事件可被丢弃或者记录日志，或是发送到死信队列。
- DLQ 可以晚点再次重放。【这个重放是需要手动触发的】

![image-20250214170504100](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250214170504100.png)

### 3.7 Logstash 使用

下载 Logstash：[Download Logstash Free | Get Started Now | Elastic](https://www.elastic.co/cn/downloads/logstash)

```bash
# stdin：控制台输入，stdout：控制台输出
bin/logstash -e 'input { stdin { } } output { stdout {} }' 
```

![PixPin_2025-02-14_17-42-57](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/PixPin_2025-02-14_17-42-57.gif)

官方有提供一些 DEMO 日志：https://github.com/elastic/examples ， 可以直接使用。

采用官方 [Apache Logs](https://github.com/elastic/examples/tree/master/Common%20Data%20Formats/apache_logs) 的DEMO日志。













