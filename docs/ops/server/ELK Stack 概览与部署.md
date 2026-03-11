---
title: ELK Stack 概览与部署
outline: deep
---

# ELK Stack 概览与部署

> **ELK Stack**（现称 Elastic Stack）是业界最流行的日志收集与分析平台，由 Elasticsearch、Logstash、Kibana 三大核心组件组成，配合轻量级采集器 Beats 构成完整的日志链路。

---

## 一、核心组件

| 组件 | 定位 | 核心职责 |
|---|---|---|
| **Elasticsearch** | 存储 & 搜索引擎 | 分布式全文检索，RESTful API，实时分析海量数据 |
| **Logstash** | 数据处理管道 | 多源采集 → 解析转换 → 输出到 ES 或其他目标 |
| **Kibana** | 可视化平台 | 图表、仪表板、索引管理、日志检索 |
| **Filebeat** | 轻量级采集器 | 部署在应用机器上，采集日志文件发往 Logstash/ES |

```
典型日志链路：

[应用/Nginx] → Filebeat → Logstash → Elasticsearch → Kibana
                                ↑
                           (可选 Kafka 做缓冲)
```

:::tip Beats 家族
除 Filebeat（日志文件）外，还有 Metricbeat（系统指标）、Packetbeat（网络流量）、Heartbeat（服务可用性）等，按需选用。
:::

---

## 二、典型日志链路

### Web 应用（Nginx + Filebeat）

```
Nginx 日志文件
    └─ Filebeat 采集
        └─ (可选 Kafka 缓冲)
            └─ Logstash 解析/转换
                └─ Elasticsearch 存储
                    └─ Kibana 展示
```

### 微服务（Spring Boot + Kafka）

```
Spring Boot + Logback → Kafka Topic
                            └─ Logstash 消费
                                └─ Elasticsearch
                                    └─ Kibana
```

---

## 三、Docker Compose 单机部署

### 1. 创建目录结构

```shell
# Elasticsearch
sudo mkdir -p /opt/elk/elasticsearch/{config,data,plugins}
# Logstash
sudo mkdir -p /opt/elk/logstash/{pipeline,config,data,plugins}
# Kibana
sudo mkdir -p /opt/elk/kibana/config

# 统一设置权限（ES/Logstash 默认 UID 1000）
sudo chown -R 1000:1000 /opt/elk
sudo chmod -R 755 /opt/elk
```

### 2. 提取默认配置文件

```shell
# 提取 Elasticsearch 默认配置
docker run --rm elasticsearch:7.4.2 \
  cat /usr/share/elasticsearch/config/elasticsearch.yml \
  > /opt/elk/elasticsearch/config/elasticsearch.yml

# 提取 Logstash 默认配置（后台启动，复制后删除）
docker run -d --name logstash-tmp logstash:7.4.2
docker cp logstash-tmp:/usr/share/logstash/config /opt/elk/logstash/config
docker rm -f logstash-tmp
```

### 3. 编写 Logstash Pipeline

```shell
vi /opt/elk/logstash/pipeline/logstash.conf
```

```ruby
input {
  # 接收 Filebeat 推送的日志
  beats {
    port => 5044
    tags => ["beats_input"]
  }

  # 接收 TCP 直接推送（测试用）
  tcp {
    port => 5000
    codec => plain
    tags => ["tcp_input"]
  }
}

filter {
  mutate {
    remove_field => ["@version", "input"]  # 清理冗余字段
  }

  # 根据来源打标
  if "beats_input" in [tags] {
    mutate { add_field => { "log_source" => "filebeat" } }
  }
  if "tcp_input" in [tags] {
    mutate { add_field => { "log_source" => "tcp" } }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "raw-logs-%{log_source}-%{+YYYY.MM.dd}"
  }
  # stdout {}  # 调试时打开，生产建议关闭
}
```

### 4. 编写 docker-compose.yml

```yaml
version: '3'
services:
  elasticsearch:
    image: elasticsearch:7.4.2
    container_name: elasticsearch
    ports:
      - "9200:9200"
      - "9300:9300"
    environment:
      - discovery.type=single-node
      - ES_JAVA_OPTS=-Xms512m -Xmx1g
    volumes:
      - /opt/elk/elasticsearch/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml
      - /opt/elk/elasticsearch/data:/usr/share/elasticsearch/data
      - /opt/elk/elasticsearch/plugins:/usr/share/elasticsearch/plugins
    networks:
      - elk-network

  logstash:
    image: logstash:7.4.2
    container_name: logstash
    ports:
      - "5044:5044"   # Filebeat 输入
      - "5000:5000"   # TCP 输入（测试用）
    volumes:
      - /opt/elk/logstash/pipeline:/usr/share/logstash/pipeline
      - /opt/elk/logstash/config:/usr/share/logstash/config
      - /opt/elk/logstash/data:/usr/share/logstash/data
    environment:
      - LS_JAVA_OPTS=-Xms256m -Xmx512m
    depends_on:
      - elasticsearch
    networks:
      - elk-network

  kibana:
    image: kibana:7.4.2
    container_name: kibana
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    depends_on:
      - elasticsearch
    networks:
      - elk-network

networks:
  elk-network:
    driver: bridge
```

### 5. 启动与验证

```shell
# 启动全部服务
docker-compose up -d

# 查看状态
docker-compose ps

# 查看各服务日志
docker-compose logs -f elasticsearch
docker-compose logs -f logstash

# 验证 ES 是否正常
curl http://localhost:9200

# 发送测试日志（nc = netcat）
echo '{"message": "hello elk"}' | nc localhost 5000
```

```shell
# 常用管理命令
docker-compose stop          # 停止（保留容器和数据）
docker-compose down          # 停止并删除容器（保留数据卷）
docker-compose down -v       # 停止并删除容器和数据卷（慎用）
```

访问 Kibana：`http://localhost:5601`

---

## 四、Filebeat 采集日志

Filebeat 部署在**应用所在机器**，负责采集日志文件并转发。

### 安装

```shell
# 版本必须与 ELK 其他组件一致！
curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-7.4.2-linux-x86_64.tar.gz
tar -zxvf filebeat-7.4.2-linux-x86_64.tar.gz
cd filebeat-7.4.2-linux-x86_64
```

### 配置 filebeat.yml

```yaml
filebeat.inputs:
  - type: filestream
    enabled: true             # 默认 false，必须显式开启
    paths:
      - /var/log/*.log
      - /var/log/nginx/access.log

# 方式一：直接发往 Elasticsearch（轻量，无需 Logstash）
# output.elasticsearch:
#   hosts: ["localhost:9200"]

# 方式二：发往 Logstash（推荐，可做数据清洗）
output.logstash:
  hosts: ["localhost:5044"]
```

### 启动

```shell
sudo ./filebeat -e -c filebeat.yml
```

### 验证

```shell
# 写入测试日志，观察 Kibana 中是否有新数据
echo "test log $(date)" >> /var/log/test.log
```

:::tip Filebeat vs Logstash 选择
| | Filebeat | Logstash |
|---|---|---|
| 资源占用 | 极低（Go 编写） | 较高（JVM） |
| 数据处理 | 基础过滤 | 强大的解析/转换能力 |
| 适用场景 | 边缘采集、资源受限环境 | 需要复杂数据处理时 |

常见组合：**Filebeat 采集 → Logstash 处理 → ES 存储**
:::

---

## 五、Kibana 使用指南

访问 `http://localhost:5601` 进入 Kibana 控制台。

### 索引模式（Index Pattern）

索引模式让 Kibana 知道去 ES 的哪些索引里查数据。

**创建步骤**：`Management` → `Stack Management` → `Index Patterns` → `Create index pattern`

输入匹配规则（如 `raw-logs-*`），选择时间字段（通常是 `@timestamp`）即可。

创建后在 `Discover` 页面可实时搜索和查看日志。

![索引模式](/public/images/image-20250217183508888.png)

### 索引模板（Index Template）

提前在 ES 中定义索引的字段映射（mapping）和配置（settings），Logstash 创建新索引时会自动应用匹配的模板。

**作用**：统一字段类型、控制分片数、设置分词器等。

`Stack Management` → `Index Management` → `Index Templates`

![索引模板](/public/images/image-20250217183913813.png)

### 索引生命周期策略（ILM）

对日志数据按生命周期自动管理，常见策略：

| 阶段 | 说明 |
|---|---|
| **Hot** | 活跃写入阶段，高性能存储 |
| **Warm** | 不再写入，但仍需查询 |
| **Cold** | 访问极少，可降低资源 |
| **Delete** | 超过保留期自动删除 |

`Stack Management` → `Index Lifecycle Policies`

![ILM策略](/public/images/image-20250217184145601.png)
