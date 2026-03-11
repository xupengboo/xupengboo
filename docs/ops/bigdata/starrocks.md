---
title: StarRocks
order: 7
icon: icon-park-outline:data-all
---

# StarRocks

:::info
**StarRocks**（原名 DorisDB）是一款开源 MPP（大规模并行处理）分析型数据库，专为**实时分析**和**高并发查询**设计，基于 Apache Doris 发展而来。

通过优化存储引擎、向量化执行引擎和查询优化器，StarRocks 在多表关联、复杂查询和实时数据摄取方面表现突出。

官方文档：[https://docs.starrocks.io/zh/docs/introduction/StarRocks_intro/](https://docs.starrocks.io/zh/docs/introduction/StarRocks_intro/)
:::

## 在数据架构中的角色

StarRocks 通常作为**OLAP 核心引擎**，在以下场景中承担关键角色：

| 角色 | 说明 |
|:---:|:---|
| **实时分析层** | 对接 Kafka / Flink 实时数据源，提供低延迟查询 |
| **交互式查询引擎** | 替代 Presto / ClickHouse，支持高并发即席查询 |
| **统一查询入口** | 通过联邦查询整合 Hive / Elasticsearch 等多数据源 |
| **数据服务层** | 为 BI 工具、报表系统提供高性能 API |

:::tip OLAP vs OLTP
- **OLAP**（Online Analytical Processing）：面向分析，处理复杂聚合查询，StarRocks 是典型代表
- **OLTP**（Online Transaction Processing）：面向事务，处理高频增删改，MySQL 是典型代表
:::

---

## 一、快速部署（存算分离模式）

StarRocks 存算分离架构将**数据持久化到对象存储（MinIO 等）**，**计算节点（CN）负责查询和缓存热数据**，实现存储与计算解耦。

```shell
mkdir quickstart && cd quickstart

# 下载 Docker Compose 文件
curl -O https://raw.githubusercontent.com/StarRocks/demo/master/documentation-samples/quickstart/docker-compose.yml

# 启动 StarRocks
docker compose up -d

# 检查状态
docker compose ps
```

后续配置参考官方向导：[https://docs.starrocks.io/zh/docs/quick_start/shared-data/](https://docs.starrocks.io/zh/docs/quick_start/shared-data/)

:::tip 存算分离配置要点
1. 在 StarRocks 中配置 MinIO 存储卷（Storage Volume）
2. 创建 MinIO 的 Access Key 和 Secret Key
3. 将存储卷关联到数据库/表
:::

---

## 二、连接 StarRocks

StarRocks 兼容 MySQL 协议，可直接使用 MySQL Client 连接，但**端口不同**：

```shell
# FE 节点默认端口为 9030（不是 MySQL 的 3306）
mysql -h 127.0.0.1 -P 9030 -u root
```

---

## 三、核心能力

| 核心能力 | 作用场景 | 与传统存储系统的区别 |
|:---:|:---:|:---|
| **MPP 架构** | 并行处理复杂查询，加速分析 | 传统存储（HDFS/S3）无计算能力 |
| **向量化执行引擎** | 优化 CPU 利用率，提升吞吐量 | 存储系统仅提供数据读写接口 |
| **实时数据摄入** | 支持 Kafka 流式导入 | 存储系统不具备实时处理能力 |
| **高并发查询优化** | 支持数千 QPS 的并发查询 | 存储系统无法直接支持高并发分析 |

整体 SQL 语法与 MySQL 高度兼容，核心差异在于 StarRocks 专注于**快速分析海量数据**，而非事务处理。
