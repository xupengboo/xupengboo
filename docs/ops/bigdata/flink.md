---
title: Flink
order: 6
icon: mdi:water-flow
---

# Flink

:::info
**Apache Flink** 是目前开源社区中唯一同时具备**高吞吐、低延迟、高性能**的分布式流式处理框架，原生支持有界流（批处理）和无界流（流处理）的统一计算模型。

官方文档：[https://flink.apache.org/](https://flink.apache.org/)
:::

---

## 一、流处理 vs 批处理

| 对比维度 | 批处理 | 流处理 |
|:---:|:---:|:---:|
| **数据特征** | 有界、持久、大量 | 无界、实时、持续 |
| **处理时机** | 全量数据到齐后处理 | 数据到达即处理 |
| **典型场景** | 离线统计、报表 | 实时监控、实时推荐 |
| **延迟** | 分钟～小时级 | 毫秒～秒级 |

### Spark vs Flink 的世界观

- **Spark**：一切由**批次**组成。实时数据是无限个微批次（Micro-batching），本质还是批处理
- **Flink**：一切由**流**组成。离线数据是有界限的流，实时数据是无界限的流，天然支持流处理

:::tip 为什么选 Flink？
| 框架 | 高吞吐 | 低延迟 | 高性能 |
|:---:|:---:|:---:|:---:|
| Flink | ✅ | ✅ | ✅ |
| Spark Streaming | ✅ | ❌（微批延迟） | ✅ |
| Storm | ❌ | ✅ | ✅ |

Flink 是三者中唯一能同时满足三个条件的框架。
:::

---

## 二、集群搭建

### 环境准备

```shell
# 确保所有节点安装 Java 8+
java -version

# 节点间配置 SSH 免密登录（参考 Hadoop 章节）
```

### 安装 Flink

```shell
# 下载（注意 Flink 与 Hadoop、Scala 的版本对应关系）
wget https://archive.apache.org/dist/flink/flink-1.14.6/flink-1.14.6-bin-scala_2.11.tgz
tar -xzvf flink-1.14.6-bin-scala_2.11.tgz
mv flink-1.14.6 /usr/local/flink/
```

### 集成 Hadoop 依赖

```shell
# 将 Hadoop 核心 Jar 包复制到 Flink lib 目录
cp $HADOOP_HOME/share/hadoop/common/hadoop-common-3.2.4.jar /usr/local/flink/lib/
cp $HADOOP_HOME/share/hadoop/hdfs/hadoop-hdfs-3.2.4.jar /usr/local/flink/lib/
cp $HADOOP_HOME/share/hadoop/client/hadoop-client-*.jar /usr/local/flink/lib/
```

### 配置 flink-conf.yaml

在**所有节点**上修改 `/usr/local/flink/conf/flink-conf.yaml`：

**JobManager 节点（vm-01）：**

```yaml
jobmanager.rpc.address: vm-01       # JobManager 主机名或 IP
jobmanager.rpc.port: 6123
jobmanager.web.port: 8082           # Web UI 端口（默认 8081，若冲突可改）
jobmanager.heap.size: 1024m
```

**TaskManager 节点（vm-02、vm-03）：**

```yaml
taskmanager.numberOfTaskSlots: 2    # 每个 TaskManager 提供的并行槽位数
taskmanager.memory.process.size: 3g
taskmanager.memory.flink.size: 2g
taskmanager.memory.jvm-metaspace.size: 256m
```

**RPC 通信配置（所有节点一致）：**

```yaml
akka.rpc.address: vm-01
akka.rpc.port: 6123
```

:::tip 高可用配置（可选）
若需要 ZooKeeper 高可用，在 `flink-conf.yaml` 中添加：
```yaml
high-availability: zookeeper
high-availability.storageDir: hdfs://vm-01:9000/flink/ha
high-availability.zookeeper.quorum: vm-01:2181,vm-02:2181,vm-03:2181
```
如果 HA 模式无法启动，可临时设置 `high-availability: none` 排查问题。
:::

### 启动集群

```shell
# 主节点 vm-01 启动 JobManager
cd /usr/local/flink/bin
./start-cluster.sh

# 从节点 vm-02、vm-03 启动 TaskManager
./taskmanager.sh start

# 访问 Web UI（查看集群状态、作业管理）
# http://vm-01:8082

# 停止集群
./stop-cluster.sh
```

### 查看集群状态

```shell
# 查看当前作业列表
./flink list

# 查看 TaskManager 节点
./flink list -y
```

---

## 三、提交作业

```shell
# 提交 Jar 作业到本地模式
flink run -m localhost:8081 /path/to/job.jar

# 提交到 YARN 集群
flink run -m yarn-cluster /path/to/job.jar

# 取消作业
flink cancel <jobId>
```
