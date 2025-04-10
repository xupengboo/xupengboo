---
title: 数据采集层
icon: icon-park-outline:data-all
index: true
order: 1
---

:::info
几种工具的区别，以及使用场景：

|     工具     |          核心定位          |  数据传输方式  |            典型场景            |            关键特性             |             数据源/目标              |
| :----------: | :------------------------: |:--------:| :----------------------------: | :-----------------------------: |:-------------------------------:|
|  **Flume**   |     分布式日志流式收集     | 实时 或 准实时 | 日志聚合到大存储（HDFS/HBase） | 高吞吐、事务机制、支持复杂路由  |     日志、Syslog → HDFS、Kafka等     |
|  **DataX**   |     异构数据源批量同步     |    批量    |    数据仓库ETL、数据库迁移     |  多数据源支持、数据转换能力强   |  MySQL ↔ Oracle、HDFS ↔ RDBMS等   |
| **Filebeat** |     轻量级日志文件收集     |  实时，准实时  | ELK日志监控（→Elasticsearch）  |   低资源占用、与ELK栈深度集成   |  日志文件 → Logstash/Elasticsearch  |
|  **Sqoop**   | Hadoop与关系数据库批量迁移 |    批量    |     数据库 ↔ HDFS/Hive迁移     | 基于MapReduce、结构化作数据传输 |   MySQL → HDFS、Hive → Oracle等   |
|  **Kettle**  |    企业级ETL与数据集成     |    批量    |    复杂数据清洗、跨系统整合    |  可视化设计、支持复杂转换逻辑   |     数据库/文件/API → 数据仓库/大数据平台     |
:::