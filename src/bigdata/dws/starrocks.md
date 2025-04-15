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

## StarRocks  存算分离（简单部署）

运行以下命令启动 StarRocks 存算一体集群：

```shell
mkdir quickstart
cd quickstart
curl -O https://raw.githubusercontent.com/StarRocks/demo/master/documentation-samples/quickstart/docker-compose.yml

# 启动StarRocks
docker compose up -d

# 检查环境状态
docker compose ps
```

详情见：[https://docs.starrocks.io/zh/docs/quick_start/shared-nothing/](https://docs.starrocks.io/zh/docs/quick_start/shared-nothing/)







