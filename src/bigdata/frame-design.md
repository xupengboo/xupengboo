---
title: 大数据 整体流程
order: 1
---


## 1. 大体整体流程

**1. 数据采集**：

- 使用各种工具（如 Flume、Kafka 或自定义脚本）从外部系统采集数据，并将其送入 HDFS。
- Flume 和 Kafka 都可以处理大量的实时数据流，适合将数据传输到 HDFS。

**2. Hadoop HDFS 存储**：

- 将数据从采集阶段通过工具（如 Flume 或 Kafka）存入 HDFS。
- 你可以使用 Hadoop 命令行工具或者编写代码来执行此操作。确保数据存储在正确的目录中，并且 HDFS 集群正常运行。

**3. HBase 缓存**：

- 为了加速数据的访问，HBase 可作为缓存层。你可以通过在 HBase 中创建表格，并将来自 HDFS 的数据加载到这些表格中。
- 使用 HBase API 将数据从 HDFS 载入 HBase，并根据需求使用 HBase 查询和存储数据。

**4. 使用 Spark 和 Flink 进行数据处理和分析**：

- Spark 和 Flink 都是强大的数据处理引擎，适合批量数据处理和实时流处理。
- 你可以将数据从 HDFS 或 HBase 导入 Spark 或 Flink 进行数据分析和处理。Spark 支持批处理和流处理，Flink 则专注于流处理，适合低延迟的数据处理需求。
- Spark 可通过 Spark SQL、Spark MLlib、GraphX 等进行各种分析任务，Flink 则通过其流处理框架实现实时分析。



**数据管道建设**：设计、开发和维护大规模数据的收集、存储、处理和传输系统。常见工具包括 Apache Kafka、Flume、Spark、Hadoop 等。

**数据仓库搭建**：构建大数据存储系统，例如 HDFS、Hive、HBase、Amazon S3 等，确保数据能够有效地存储、组织和访问。

**ETL 处理**：负责数据抽取（Extract）、转化（Transform）和加载（Load）过程，确保数据能够从源头系统流入数据仓库或其他分析系统。

**优化性能**：对数据流和查询性能进行优化，确保系统能够处理大量数据并保持较高的效率。



## 2. 离线数仓 架构

数据：业务数据 和 日志文件

![image-20250113162441944](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250113162441944.png)



## 3. 实时数仓 架构



