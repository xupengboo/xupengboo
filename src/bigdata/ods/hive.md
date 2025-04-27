---
title: Hive(类 SQL 语法)
order: 3
icon: ant-design:cluster-outlined
date: 2025-04-14 10:00:00
tags:
  - 大数据
  - Hive
categories:
  - 大数据
---


:::info

Hive 是一个基于 Hadoop 的一个数据仓库工具，可以将结构化的数据文件映射为一张表，并提供类 SQL 查询功能。

Hive 的特点：

- Hive 处理的数据存储在 `HDFS` 。

- Hive 分析数据底层的实现是 `MapReduce` 。

- 执行程序运行在 `Yarn` 上。

- Hive 有点像客户端操作，所以也不需要什么集群化处理。

Hive 的核心价值在于**将 SQL 转换为分布式任务**，并通过优化器尽可能减少 Shuffle 和数据传输。随着 Tez/Spark 等引擎的普及，Hive 已超越传统的三阶段模式，能够更高效地处理复杂查询。

**Hive** 是构建在 **Hadoop 生态系统**之上的 **数据仓库工具**，主要用于处理和分析海量结构化数据（通常为 TB/PB 级）。它的核心价值是通过 **类 SQL 语法（HiveQL）** 简化分布式计算的复杂性，让用户无需编写底层 MapReduce/Spark 代码即可操作大数据。

Hive 中存储的**实际数据文件**默认位于 **HDFS（Hadoop 分布式文件系统）**上，但 Hive 的**元数据**（如表结构、分区信息等）则存储在独立的**关系型数据库**（如 MySQL、PostgreSQL）中。

:::



## 一、Hive 核心组件

Hive 的 SQL 到 MapReduce 转换依赖以下组件：

- **Metastore**：存储元数据（表结构、分区信息、数据位置等），默认是：derby数据库，推荐使用 MySQL 。
- **Driver**：管理整个查询的生命周期（编译、优化、执行）。
- **Compiler**：将 HiveQL 转换为 MapReduce 任务的核心模块。
- **Execution Engine**：执行生成的 MapReduce 任务（默认是 MapReduce，也可以是 Tez/Spark）。

![image-20250427170807941](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250427170807941.png)



## 二、Hive 转换MR的原理

Hive 将 SQL 转换为 MapReduce 的核心流程是：（例如 `SELECT department, AVG(salary) FROM employees GROUP BY department`）

1. **解析 SQL** → 生成抽象语法树（AST）。

- 词法分析：拆分 SQL 语句为关键字、表名、列名等标记（Tokens）。
- 语法分析：验证语法结构是否符合 HiveQL 规范，生成 AST。

2. **语义分析** → 生成带有元数据信息的注解语法树（Annotated AST）

- 验证表名、列名是否存在（通过 Metastore 检查元数据）。
- 检查数据类型是否兼容（例如 `AVG(salary)` 中的 `salary` 必须是数值类型）。
- 解析函数和表达式（例如 `AVG()` 的语义）。

3. **逻辑计划**  → 逻辑执行计划。(逻辑计划示例：)

```plaintext
[SELECT]
│
└─ [GROUP BY (department)]
   │
   └─ [AGGREGATE (AVG(salary))]
      │
      └─ [TABLE SCAN (employees)]
```

4. **逻辑优化** → 优化后的逻辑计划（来减少数据量和计算复杂度）。

- 谓词下推（Predicate Pushdown）：将 `WHERE` 条件提前到数据扫描阶段，减少后续处理的数据量。
- 列剪裁（Column Pruning）：仅读取查询需要的列，减少 I/O。
- 常量折叠（Constant Folding）：提前计算常量表达式（如 `SELECT 1+2` → `3`）。
- 分区裁剪（Partition Pruning）：根据分区条件跳过无关分区。

5. **物理计划生成** → 映射为 MapReduce 任务。

- 将逻辑操作符映射为具体的 MapReduce 阶段。

6. **任务生成与执行** → 提交到 Hadoop 集群运行。

- 生成 Map 和 Reduce 的 Java 类（例如 `Mapper<LongWritable, Text, Text, IntWritable>`）。
- 配置输入输出路径（HDFS 数据地址）。
- 提交任务到 Hadoop YARN 集群执行。



:::tip MapReduce的三个阶段。

以 MapReduce 三个阶段为例，例如： `SELECT department, AVG(salary) FROM employees GROUP BY department` ：

1. Map 阶段：
   - 每个 Mapper 读取数据，提取 `(department, salary)`。
   - 对每个 `department` 计算局部平均值和计数（如 `(HR, (5000, 1))`）。
2. Shuffle 阶段：
   - 按 `department` 分区排序，确保相同部门的数据进入同一 Reducer。
3. Reduce 阶段：
   - Reducer 汇总局部结果，计算全局平均值（如 `(HR, 5000)`）。

:::



## 三、Hive 架构

![image-20250427172731061](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250427172731061.png)

1. 用户接口：Client （`CLI（command-line interface）、JDBC/ODBC。`）

2. 元数据：`Metastore`

3. 驱动器 `Driver`：

- （1）解析器（SQLParser）：将SQL字符串转换成抽象语法树（AST）

- （2）语义分析（Semantic Analyzer）：将AST进一步划分为QeuryBlock

- （3）逻辑计划生成器（Logical Plan Gen）：将语法树生成逻辑计划

- （4）逻辑优化器（Logical Optimizer）：对逻辑计划进行优化

- （5）物理计划生成器（Physical Plan Gen）：根据优化后的逻辑计划生成物理计划

- （6）物理优化器（Physical Optimizer）：对物理计划进行优化

- （7）执行器（Execution）：执行该计划，得到查询结果并返回给客户端


## 四、Hive 与 传统数据库的区别

|   **特性**   |                  **Hive**                  |      **传统数据库（如 MySQL）**      |
| :----------: | :----------------------------------------: | :----------------------------------: |
| **数据存储** | 数据以文件形式存储在 HDFS/云存储，无索引。 | 数据按页存储，支持 B+ 树索引等优化。 |
| **计算模型** |  分布式任务（MapReduce/Tez/Spark）执行。   |  单机或主从架构，直接操作本地存储。  |
| **事务支持** |      有限支持（需手动配置 ACID 表）。      |           完整 ACID 事务。           |
|   **延迟**   |          分钟到小时级（批处理）。          |         毫秒到秒级（实时）。         |
| **适用场景** |      离线分析、数据清洗、大规模聚合。      |        高频事务、低延迟查询。        |



## 五、数据加载到 Hive 表中

1. 直接关联 HDFS 路径：若 HDFS 数据已存放到 Hive 表的存储路径（如 `/user/hive/warehouse/sales`），Hive 会自动读取数据，无需额外操作。

2. 手动加载数据：使用 `LOAD DATA` 命令将 HDFS 文件加载到 Hive 表：

```sql
LOAD DATA INPATH '/user/hdfs/sales.csv' INTO TABLE sales;
```

- 此操作会将 HDFS 文件移动到 Hive 表的存储目录中（原始文件被删除）。
- 若需保留原文件，使用 `EXTERNAL TABLE` 并直接关联路径。

