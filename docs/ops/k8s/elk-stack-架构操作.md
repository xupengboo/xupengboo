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

> 注意：对于生产级部署，请忽略下方单机部署，依次按照文中 `ES → Kibanna → Logstash → FileBeat` 依次部署。

::: tip 为了方便接触学习，可以直接通过下面 Docker Compose 单机部署 一套出来即可：

1. 创建目录结构

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

2. 提取默认配置文件

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

3. 编写 Logstash Pipeline

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

4. 编写 docker-compose.yml

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

5. 启动与验证

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

1. **基于 Logback + Kafka Topic 方式，推送日志到ELK：**

```shell
Spring Boot + Logback → Kafka Topic
                            └─ Logstash 消费
                                └─ Elasticsearch
                                    └─ Kibana
```

2. **在 Kubernetes 环境下，还可以通过 `Filebeat`  挂载宿主机的标准日志路径来采集容器的标准输出（stdout）：**

![PixPin_2026-07-08_17-39-24.png](/public/images/PixPin_2026-07-08_17-39-24.png)

> **Kubernetes 节点的 Pod 日志路径主要包含以下三类（彼此间存在软链接关联）：**
>
> 1. 首选入口：`/var/log/containers/`（软链接目录）
> 2. 核心目录：`/var/log/pods/`（K8S 标准路径）
> 3. 运行时底层（仅限 Docker 运行时）：`/var/lib/docker/containers/`

---

## 三、基于 Compose 部署 ELK

1. **ES 配置文件：**

- `es-master.yml` 、`es-slave1.yml` 、`es-slave2.yml` 文件

```yaml
# 集群名称
cluster.name: es-cluster
# 节点名称
node.name: es-master
# 是否可以成为master节点
node.master: true
# 是否允许该节点存储数据,默认开启
node.data: false
# 网络绑定
network.host: 0.0.0.0
# 设置对外服务的http端口
http.port: 9200
# 设置节点间交互的tcp端口
transport.port: 9300
# 集群发现
discovery.seed_hosts:
  - es-master
  - es-slave1
  - es-slave2
# 手动指定可以成为 mater 的所有节点的 name 或者 ip，这些配置将会在第一次选举中进行计算
cluster.initial_master_nodes:
  - es-master
# 支持跨域访问
http.cors.enabled: true
http.cors.allow-origin: "*"
# 安全认证
xpack.security.enabled: false
#http.cors.allow-headers: "Authorization"
```

```yml
# 集群名称
cluster.name: es-cluster
# 节点名称
node.name: es-slave1
# 是否可以成为master节点
node.master: true
# 是否允许该节点存储数据,默认开启
node.data: true
# 网络绑定
network.host: 0.0.0.0
# 设置对外服务的http端口
http.port: 9201
# 设置节点间交互的tcp端口
#transport.port: 9301
# 集群发现
discovery.seed_hosts:
  - es-master
  - es-slave1
  - es-slave2
# 手动指定可以成为 mater 的所有节点的 name 或者 ip，这些配置将会在第一次选举中进行计算
cluster.initial_master_nodes:
  - es-master
# 支持跨域访问
http.cors.enabled: true
http.cors.allow-origin: "*"
# 安全认证
xpack.security.enabled: false
#http.cors.allow-headers: "Authorization"
```

```yaml
# 集群名称
cluster.name: es-cluster
# 节点名称
node.name: es-slave2
# 是否可以成为master节点
node.master: true
# 是否允许该节点存储数据,默认开启
node.data: true
# 网络绑定
network.host: 0.0.0.0
# 设置对外服务的http端口
http.port: 9202
# 设置节点间交互的tcp端口
#transport.port: 9302
# 集群发现
discovery.seed_hosts:
  - es-master
  - es-slave1
  - es-slave2
# 手动指定可以成为 mater 的所有节点的 name 或者 ip，这些配置将会在第一次选举中进行计算
cluster.initial_master_nodes:
  - es-master
# 支持跨域访问
http.cors.enabled: true
http.cors.allow-origin: "*"
# 安全认证
xpack.security.enabled: false
#http.cors.allow-headers: "Authorization"
```

2. **`filebeat.yaml` 文件**

```yaml
filebeat.inputs:
  - type: log
    enabled: true
    paths:
      # 当前目录下的所有.log文件
      - /home/project/elk/logs/*.log
    multiline.pattern: ^\[
    multiline.negate: true
    multiline.match: after
  - type: tcp
    enabled: true
    max_message_size: 10MiB
    host: "0.0.0.0:9000"

filebeat.config.modules:
  path: ${path.config}/modules.d/*.yml
  reload.enabled: false

setup.template.settings:
  index.number_of_shards: 1

setup.dashboards.enabled: false

setup.kibana:
  host: "http://kibana:5601"

# 不直接传输至ES
#output.elasticsearch:
# hosts: ["http://es-master:9200"]
# index: "filebeat-%{[beat.version]}-%{+yyyy.MM.dd}"

output.logstash:
  hosts: ["logstash:5044"]

processors:
  - add_host_metadata: ~
  - add_cloud_metadata: ~
```

3. **`kibana.yml` 文件**

```yml
# 服务端口
server.port: 5601
# 服务IP
server.host: "0.0.0.0"
# ES
elasticsearch.hosts: ["http://es-master:9200"]
# 汉化
i18n.locale: "zh-CN"
```

4. **`logstash.yml` 、`logstash-filebeat.conf` 文件**

```yaml
# 服务IP
http.host: "0.0.0.0"
# ES
xpack.monitoring.elasticsearch.hosts: [ "http://es-master:9200" ]

xpack.monitoring.enabled: true

xpack.management.enabled: false

```

```json
input {
    # 来源beats
    beats {
        # 端口
        port => "5044"
    }
}
# 分析、过滤插件，可以多个
filter {
    grok {
        match => { "message" => "%{COMBINEDAPACHELOG}"}
    }
    geoip {
        source => "clientip"
    }
}
output {
    # 选择elasticsearch
    elasticsearch {
        hosts => ["http://es-master:9200"]
        index => "%{[@metadata][beat]}-%{[@metadata][version]}-%{+YYYY.MM.dd}"
    }
}
```

5. **`docker-compose.yml` 文件（核心文件）：**

```yaml
version: "3"
services:
  es-master:
    container_name: es-master
    hostname: es-master
    image: elasticsearch:7.1.1
    restart: always
    ports:
      - 9200:9200
      - 9300:9300
    volumes:
      - ./elasticsearch/master/conf/es-master.yml:/usr/share/elasticsearch/config/elasticsearch.yml
      - ./elasticsearch/master/data:/usr/share/elasticsearch/data
      - ./elasticsearch/master/logs:/usr/share/elasticsearch/logs
    environment:
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"

  es-slave1:
    container_name: es-slave1
    image: elasticsearch:7.1.1
    restart: always
    ports:
      - 9201:9200
      - 9301:9300
    volumes:
      - ./elasticsearch/slave1/conf/es-slave1.yml:/usr/share/elasticsearch/config/elasticsearch.yml
      - ./elasticsearch/slave1/data:/usr/share/elasticsearch/data
      - ./elasticsearch/slave1/logs:/usr/share/elasticsearch/logs
    environment:
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"

  es-slave2:
    container_name: es-slave2
    image: elasticsearch:7.1.1
    restart: always
    ports:
      - 9202:9200
      - 9302:9300
    volumes:
      - ./elasticsearch/slave2/conf/es-slave2.yml:/usr/share/elasticsearch/config/elasticsearch.yml
      - ./elasticsearch/slave2/data:/usr/share/elasticsearch/data
      - ./elasticsearch/slave2/logs:/usr/share/elasticsearch/logs
    environment:
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"

  es-head:
    container_name: es-head
    image: mobz/elasticsearch-head:5
    restart: always
    ports:
      - 9100:9100
    depends_on:
      - es-master
      - es-slave1
      - es-slave2

  kibana:
    container_name: kibana
    hostname: kibana
    image: kibana:7.1.1
    restart: always
    ports:
      - 5601:5601
    volumes:
      - ./kibana/conf/kibana.yml:/usr/share/kibana/config/kibana.yml
    environment:
      - elasticsearch.hosts=http://es-master:9200
    depends_on:
      - es-master
      - es-slave1
      - es-slave2

  filebeat:
    # 容器名称
    container_name: filebeat
    # 主机名称
    hostname: filebeat
    # 镜像
    image: docker.elastic.co/beats/filebeat:7.1.1
    # 重启机制
    restart: always
    # 持久化挂载
    volumes:
      - ./filebeat/conf/filebeat.yml:/usr/share/filebeat/filebeat.yml
      # 映射到容器中[作为数据源]
      - ./logs:/home/project/elk/logs
      - ./filebeat/logs:/usr/share/filebeat/logs
      - ./filebeat/data:/usr/share/filebeat/data
    # 将指定容器连接到当前连接，可以设置别名，避免ip方式导致的容器重启动态改变的无法连接情况
    links:
      - logstash
    ports:
      - 9000:9000
    # 依赖服务[可无]
    depends_on:
      - es-master
      - es-slave1
      - es-slave2

  logstash:
    container_name: logstash
    hostname: logstash
    image: logstash:7.1.1
    command: logstash -f ./conf/logstash-filebeat.conf
    restart: always
    volumes:
      # 映射到容器中
      - ./logstash/conf/logstash-filebeat.conf:/usr/share/logstash/conf/logstash-filebeat.conf
      - ./logstash/conf/logstash.yml:/usr/share/logstash/config/logstash.yml
    ports:
      - 5044:5044
    depends_on:
      - es-master
      - es-slave1
      - es-slave2
```

## 四、基于 Kubernetes 集群部署 ELK

### 1. 搭建 ES 集群

3 节点 master + data 混合模式

- 3 个节点（都是 Master 和 Data）
- 日志量不算特别夸张
- K8s 学习环境
- 甚至小型生产环境

![PixPin_2026-07-10_09-07-53.png](/public/images/PixPin_2026-07-10_09-07-53.png)

![PixPin_2026-07-10_09-27-26.png](/public/images/PixPin_2026-07-10_09-27-26.png)

倘若，日志量很大（比如每天几十 GB、上百 GB），需要考虑多个节点，并且将其拆成：

- 3个专用 Master 节点

- 3个专用 Data 节点

![PixPin_2026-07-10_09-26-27.png](/public/images/PixPin_2026-07-10_09-26-27.png)



## 五、Filebeat 采集日志（二进制安装）

`Filebeat` 部署在 **应用所在机器（所以，一般k8s集群中，会采用 DaemonSet 的资源方式部署）**，负责采集日志文件并转发。

1. 安装

```shell
# 版本必须与 ELK 其他组件一致！
curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-7.4.2-linux-x86_64.tar.gz
tar -zxvf filebeat-7.4.2-linux-x86_64.tar.gz
cd filebeat-7.4.2-linux-x86_64
```

2. 配置 filebeat.yml

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

3. 启动

```shell
sudo ./filebeat -e -c filebeat.yml
```

4. 验证

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

## 六、Kibana 使用指南

访问 `http://localhost:5601` 进入 Kibana 控制台。

### 1. 索引模式（Index Pattern）

索引模式让 Kibana 知道去 ES 的哪些索引里查数据。

**创建步骤**：`Management` → `Stack Management` → `Index Patterns` → `Create index pattern`

输入匹配规则（如 `raw-logs-*`），选择时间字段（通常是 `@timestamp`）即可。

创建后在 `Discover` 页面可实时搜索和查看日志。

![索引模式](/public/images/image-20250217183508888.png)

### 2. 索引模板（Index Template）

提前在 ES 中定义索引的字段映射（mapping）和配置（settings），Logstash 创建新索引时会自动应用匹配的模板。

**作用**：统一字段类型、控制分片数、设置分词器等。

`Stack Management` → `Index Management` → `Index Templates`

![索引模板](/public/images/image-20250217183913813.png)

### 3. 索引生命周期策略（ILM）

对日志数据按生命周期自动管理，常见策略：

| 阶段 | 说明 |
|---|---|
| **Hot** | 活跃写入阶段，高性能存储 |
| **Warm** | 不再写入，但仍需查询 |
| **Cold** | 访问极少，可降低资源 |
| **Delete** | 超过保留期自动删除 |

`Stack Management` → `Index Lifecycle Policies`

![ILM策略](/public/images/image-20250217184145601.png)
