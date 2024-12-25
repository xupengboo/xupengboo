# Drios 概述

>  关于部署，直接对接官方即可：https://doris.apache.org/zh-CN/docs/install/cluster-deployment/k8s-deploy/install-doris-operator 

# Drios 实战

如何将 MySQL 数据库表格以及数据，如何同步到 Drios 上呢？

同步的核心是：将 MySQL 中的变化（插入、更新、删除操作）实时或定期传输到 Drios 中。

以下几种常见方案：

## **1. 基于 MySQL Binlog 的实时同步**

MySQL 的 Binlog（Binary Log）记录了所有数据库的更改操作，可以用来捕获数据变更并将其同步到 Drios。

1. **开启 MySQL Binlog**
   在 MySQL 配置文件中开启 Binlog：

   ```ini
   [mysqld]
   log_bin = /var/log/mysql/mysql-bin.log
   binlog_format = ROW
   server_id = 1
   ```

   - `binlog_format=ROW` 确保记录的是行级别的操作。
   - 设置 `server_id`，确保唯一。

   重启 MySQL：

   ```bash
   sudo systemctl restart mysql
   ```

2. **使用 CDC 工具捕获数据变更** 使用 CDC（Change Data Capture）工具读取 MySQL Binlog 并将数据同步到 Drios，例如：

   - **Debezium**：支持 Kafka 集成，捕获 MySQL 的变化日志。
   - **Maxwell's Daemon**：轻量级工具，支持将 Binlog 输出为 JSON 格式，方便发送到 Drios。
   - **Canal**：阿里巴巴开源的 Binlog 解析工具，专注于数据同步。

3. **编写同步程序** 将 CDC 工具捕获的数据解析后，写入 Drios。例如：

   - 使用 Spark Streaming 或 Flink 消费 Binlog 数据，并写入 Drios。
   - 编写自定义脚本，通过 Drios 的 API 或 SQL 接口同步数据。



## **2. 使用 ETL 工具进行定期同步**

如果不需要实时性，可以通过定期的 ETL（Extract, Transform, Load）流程，将 MySQL 数据导出并加载到 Drios。

1. **导出数据** 使用 MySQL 的 `mysqldump` 或者直接运行 SQL 查询，将数据导出为 CSV、JSON 等格式：

   ```bash
   mysqldump -u root -p --no-create-info database_name > data.sql
   ```

2. **转换数据**

   - 根据 Drios 的要求，将数据转换为它支持的格式（如 JSON、Protobuf 等）。
   - 可使用工具如 Python（Pandas）、Apache Nifi、Talend 进行数据转换。

3. **加载到 Drios**

   - 使用 Drios 提供的批量写入工具。
   - 或通过 Spark、Flink 等工具定期同步。
   - 

## **3. 双写策略**

在业务代码中，同时写入 MySQL 和 Drios。这种方法适合新增和修改操作不频繁的场景，但可能增加代码复杂性。

**实现方式**：

1. 修改应用代码：
   - 每次写入 MySQL 时，同时调用 Drios 的写入接口。
2. 使用中间件：
   - 使用数据中间件（如 MQ）接收写入请求，再分别写入 MySQL 和 Drios。



## **4. 数据库触发器同步**

利用 MySQL 的触发器功能，在表发生数据变化时，将变更记录到中间表或队列中，再同步到 Drios。

1. **创建触发器** 在 MySQL 表上创建触发器，记录数据变更：

   ```sql
   CREATE TRIGGER after_insert
   AFTER INSERT ON table_name
   FOR EACH ROW
   INSERT INTO sync_table (data) VALUES (NEW.data);
   ```

2. **消费变更记录** 编写程序定期读取 `sync_table` 数据并写入 Drios。



## **5. 基于流式数据管道的实时同步**

结合 Kafka、Flink 或 Spark Streaming，实现高性能的实时同步。

1. **捕获 MySQL 数据**
   - 使用 CDC 工具（如 Debezium）将 Binlog 发送到 Kafka。
2. **流式处理**
   - 使用 Flink 或 Spark Streaming 从 Kafka 读取数据。
   - 将变更数据转换为 Drios 的写入格式。
3. **写入 Drios**
   - 使用 Drios 的写入接口或 SDK，将数据写入。

## 6. 总结

**实时同步**：推荐使用 MySQL Binlog + CDC 工具（如 Debezium、Maxwell）。

**定期同步**：推荐使用 ETL 工具或批量导出+导入。

**高性能需求**：结合 Kafka、Flink 或 Spark 构建流式数据管道。