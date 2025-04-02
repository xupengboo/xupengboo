---
title: Elastic Stack 组件
order: 1
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

## 3. ELK Docker单机部署

1. 安装 Docker Compose 

```shell
# 指定版本安装
curl -L https://github.com/docker/compose/releases/download/1.23.1/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose

# 对二进制文件赋可执行权限
sudo chmod +x /usr/local/bin/docker-compose
```

2. 编写 `docker-compose.yml` 文件：

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
      - ES_JAVA_OPTS=-Xms512m -Xmx512m
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
      - "5044:5044"   # Filebeat 输入端口
      - "5000:5000"   # TCP 输入端口（测试用）
    volumes:
      - /opt/elk/logstash/pipeline:/usr/share/logstash/pipeline
      - /opt/elk/logstash/config:/usr/share/logstash/config
      - /opt/elk/logstash/data:/usr/share/logstash/data
      - /opt/elk/logstash/plugins:/usr/share/logstash/plugins
    environment:
      - LS_JAVA_OPTS=-Xms256m -Xmx256m
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

3. 创建相关目录：

```shell
# Elasticsearch 目录
sudo mkdir -p /opt/elk/elasticsearch/{config,data,plugins}
# Logstash 目录
sudo mkdir -p /opt/elk/logstash/{pipeline,config,data,plugins}
# Kibana 目录（如果后续需要挂载配置）
sudo mkdir -p /opt/elk/kibana/config

# 生成 elasticsearch.yml
docker run --rm elasticsearch:7.4.2 cat /usr/share/elasticsearch/config/elasticsearch.yml > /opt/elk/elasticsearch/config/elasticsearch.yml
# 将logstash相关配置文件获取出来
docker run logstash:7.4.2
docker ps # 7d0a511e1acd
docker cp 7d0a511e1acd:/usr/share/logstash/config /opt/elk/logstash/config
docker rm 7d0a511e1acd


# 创建 logstash.conf ，并且配置如下：
vi /opt/elk/logstash/pipeline/logstash.conf
input {
  tcp {
    port => 5000
    codec => json
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "logs-%{+YYYY.MM.dd}"
  }
  stdout {}
}


# 递归修改权限（解决容器启动时的权限错误）
sudo chown -R 1000:1000 /opt/elk  # Elasticsearch/Logstash 默认用户 UID 1000
sudo chmod -R 755 /opt/elk        # 确保可读可执行权限
```

4. 容器编排

```shell
# 启动所有容器
docker-compose up -d
# 查看运行状态
docker-compose ps

# 单独启动效果如下：
docker-compose up -d elasticsearch
docker-compose logs elasticsearch  # 查看是否启动成功
```

5. 测试验证：

```shell
# nc 是 netcat 的缩写，它是一个功能强大的网络工具，用于通过 TCP/UDP 协议 进行数据传输。
echo '{"message": "Test log entry"}' | nc localhost 5000

# 访问kibana，查看日志即可：
```

创建索引模式：

![image-20250402141103416](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250402141103416.png)

查看信息内容：

![image-20250402141130222](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250402141130222.png)