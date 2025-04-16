---
title: StarRocks 数据库
order: 1
icon: icon-park-outline:data-all
tags:
  - 大数据
  - StarRocks
categories:
  - 大数据
---

:::info
StarRocks 官方地址：[https://docs.starrocks.io/zh/docs/introduction/StarRocks_intro/](https://docs.starrocks.io/zh/docs/introduction/StarRocks_intro/)

StarRocks（原名 DorisDB）是一款开源的 MPP（大规模并行处理）分析型数据库，专为 实时分析 和 高并发查询 场景设计。它基于 Apache Doris 项目发展而来，通过优化存储引擎、执行引擎和查询优化器，显著提升了大数据场景下的查询性能，尤其在多表关联、复杂查询和实时数据摄取方面表现突出。

StarRocks 通常作为 **OLAP 核心引擎**（Online Analytical Processing，与之相对的是 **OLTP**（Online Transaction Processing）），在架构中承担以下角色：

1. 实时分析层
   - 对接 Kafka、Flink 等实时数据源，提供低延迟查询。
2. 交互式查询引擎
   - 替代 Presto、ClickHouse，支持高并发即席查询。
3. 统一查询入口
   - 通过联邦查询（如对接 Hive、Elasticsearch）整合多数据源，简化分析流程。
4. 数据服务层
   - 为 BI 工具、报表系统提供高性能 API，支撑业务决策。

:::

## 一、StarRocks  存算分离（官方傻瓜式部署）

运行以下命令启动 StarRocks 存算分离：

```shell
mkdir quickstart
cd quickstart
# 下载docker compose文件
curl -O https://raw.githubusercontent.com/StarRocks/demo/master/documentation-samples/quickstart/docker-compose.yml

# 启动StarRocks
docker compose up -d
# 检查环境状态
docker compose ps
```

后续， 见 官方一步步来即可：[https://docs.starrocks.io/zh/docs/quick_start/shared-data/](https://docs.starrocks.io/zh/docs/quick_start/shared-data/)

:::tip

StarRocks 存算分离架构的核心是**将数据以存储卷（Storage Volume）的形式持久化到 MinIO 等对象存储系统上**，同时由**计算节点（CN）负责查询和缓存热数据**，实现存储与计算的解耦。

所以，需要在 StarRocks 数据库中，配置 minio 相关的存储卷，以及相关的创建  MinIO 相关的 Access Key 和 Secret Key 。

![image-20250416160846405](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250416160846405.png)

:::




## 二、StarRocks 使用

:::tip
StarRocks 可以直接使用 MySQL Client 连接，但是端口号是 9030 （ FE节点 ）需要注意！

![image-20250416154813808](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250416154813808.png)

:::

整体效果和 MySQL 语法差不多，但是 StarRocks 核心是  **快速分析海量数据** 。

|      核心能力      |          作用场景           |         与传统存储系统的差异         |
| :----------------: | :-------------------------: | :----------------------------------: |
|    **MPP 架构**    | 并行处理复杂查询，加速分析  | 传统存储系统（如 HDFS/S3）无计算能力 |
| **向量化执行引擎** | 优化 CPU 利用率，提升吞吐量 |      存储系统仅提供数据读写接口      |
|  **实时数据摄入**  |     支持 Kafka 流式导入     |      存储系统不具备实时处理能力      |
| **高并发查询优化** |   支持数千 QPS 的并发查询   |    存储系统无法直接支持高并发分析    |







