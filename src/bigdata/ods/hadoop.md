---
title: Hadoop 集群使用
order: 1
icon: mdi:bash
date: 2025-04-14 10:00:00
tags:
  - 大数据
  - Hadoop
categories:
  - 大数据
---

:::info

**Hadoop** 是一个开源的 **分布式计算与存储框架**，设计用于在廉价硬件集群上处理海量数据（从 TB 到 PB 级）。其核心思想是通过 **横向扩展（Scale-out）** 而非纵向升级硬件来应对大数据挑战，提供高容错性、高吞吐量的数据处理能力。它是 **大数据生态的基石**。

|     核心组件      |                             作用                             |
| :---------------: | :----------------------------------------------------------: |
|     **HDFS**      | 分布式文件系统，将数据分块存储在多台机器上，提供高可靠性和扩展性。 |
|     **YARN**      | 资源管理框架，统一调度集群资源（CPU、内存），支持多种计算引擎（如 MapReduce、Spark）。 |
|   **MapReduce**   | 分布式计算模型，通过 `Map` 和 `Reduce` 阶段处理数据，适合批处理任务。 |
| **Hadoop Common** | 基础工具库，为其他组件提供通用功能（如配置管理、文件系统抽象）。 |



`NameNode` Web UI：http://hadoop102:9870/  （端口 `9870` 是 Hadoop 3.x 以后的 `NameNode` 默认 Web UI 端口，Hadoop 2.x 用的是 `50070`。），主要功能：查看 HDFS 的健康状况，包括：

- 文件系统概要（容量使用情况、文件块信息）
- 活跃的 `DataNode` 列表和状态
- HDFS 报错和警告信息
- 块副本状态等

 `MapReduce` `JobHistory` Server 的 Web UI：http://hadoop102:19888 （端口 `19888` 是 `JobHistory` Server 的默认访问端口。），主要功能：查看 **已经完成的 MapReduce 任务的历史记录**，包括：

- 各个作业（job）的状态（成功、失败）

- 作业的详细执行过程（map数、reduce数）

- 每个 task 的耗时、日志、异常信息

`ResourceManager` 的 Web UI（YARN 集群资源管理器，端口 `8088` 是 `ResourceManager` 的默认 Web 访问端口。）：http://hadoop103:8088 ，主要功能：查看当前集群上的 **应用程序（如 MapReduce、Spark 等）资源使用和调度情况**，包括：

- 正在运行和已完成的应用列表
- 各 `NodeManager` 节点的资源使用情况（CPU、内存）
- 队列管理（Queue）、调度器状态
- 整体集群资源总览

:::

## 一、HDFS 常用指令

### 1. 常用命令
```shell
hdfs dfs -ls / # 查看目录
hdfs dfs -put input.txt /user/hadoop/input # 上传
hdfs dfs -get /hdfs/path/to/file /local/destination/path # 下载
hdfs dfs -cat /hdfs/path/to/file # 查看文件
hdfs dfs -mkdir /hdfs/path/to/directory # 创建目录
hdfs dfs -rm /hdfs/path/to/file          # 删除文件
hdfs dfs -rm -r /hdfs/path/to/directory # 递归删除目录
```

### 2. 查看 HDFS 文件

```shell
# zcat 用来解压 gzip 文件
hadoop fs -cat /base_province/* | zcat 
3       山西    1       140000  CN-14   CN-SX   2021-12-14 00:00:00     \N
4       内蒙古  1       150000  CN-15   CN-NM   2021-12-14 00:00:00     \N
5       河北    1       130000  CN-13   CN-HE   2021-12-14 00:00:00     \N
6       上海    2       310000  CN-31   CN-SH   2021-12-14 00:00:00     \N
7       江苏    2       320000  CN-32   CN-JS   2021-12-14 00:00:00     \N
8       浙江    2       330000  CN-33   CN-ZJ   2021-12-14 00:00:00     \N
```

