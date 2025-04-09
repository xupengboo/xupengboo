---
title: Flink 集群搭建
order: 4
icon: ant-design:cluster-outlined
---


## `Flink` 集群搭建

# 1. 准备工作

1. 确保所有节点安装了 `Java8` 或更高版本 。

```bash
java -version
```

2. 确保节点之间，都能通过`SSH`登录成功，可以配置免密`SSH`。
3. 下载 `Flink` ，官方地址： https://flink.apache.org/downloads/

```bash
# 这里我下载的是 1.14.6 版本，注意：Flink与hadoop、yarn、hdfs有对应的版本呢要求。
https://archive.apache.org/dist/flink/flink-1.14.6/
```

## 2. 安装`Flink`

1. 解压 `Flink` ：

```bash
tar -xzvf flink-1.14.6-bin-scala_2.11.tgz
mv flink-1.14.6 /usr/local/flink/
```

2. 将  `Hadoop` 依赖包加入 `Flink` ：

- 可以去，`hadoop` 目录下面的 `share` 目录，查找 `Jar` 依赖。 
- 包括：`hadoop-common-3.x.x.jar` 或者 `hadoop-hdfs-3.x.x.jar` 。

```bash
cp /opt/hadoop-3.2.4/share/hadoop/common/hadoop-common-3.2.4.jar /usr/local/flink/lib/
cp /opt/hadoop-3.2.4/share/hadoop/hdfs/hadoop-hdfs-3.2.4.jar /usr/local/flink/lib/
cp /opt/hadoop-3.2.4/share/hadoop/client/hadoop-client-*.jar /usr/local/flink/lib/
```

## 3. 配置 `Flink`

在所有机器（`vm-01`、`vm-02`、`vm-03`）上，修改 `Flink` 配置文件。

1. 配置 `flink-conf.yaml`： 打开 `/usr/local/flink/conf/flink-conf.yaml` 配置文件，并进行修改：

   - `JobManager` 配置（`vm-01`）： 在 `vm-01` 上，将 `jobmanager.rpc.address` 设置为 `vm-01` 的 IP 地址或主机名，其他节点（`vm-02`、`vm-03`）需要使用这个地址来连接到 `JobManager` 。

     ```yaml
     jobmanager.rpc.address: vm-01  # JobManager IP 或主机名
     jobmanager.rpc.port: 6123
     jobmanager.web.port: 8082  # JobManager Web UI 端口
     jobmanager.heap.size: 1024m  # 根据需要调整内存大小
     ```

   - `TaskManager` 配置（`vm-02` 和 `vm-03`）： 在 `vm-02` 和 `vm-03` 上，配置 `taskmanager.numberOfTaskSlots` 为每个 `TaskManager` 节点提供的并发槽位数。例如：

     ```yaml
     taskmanager.numberOfTaskSlots: 2  # 每个 TaskManager 提供的槽位数
     taskmanager.heap.size: 2g  # 根据需要调整内存大小
     taskmanager.memory.flink.size: 2g # 设置 Flink 内存大小
     taskmanager.memory.process.size: 3g  # 设置 TaskManager 总内存
     taskmanager.memory.jvm-metaspace.size: 256m # JVM Metaspace
     ```

   - `akka.rpc` 配置

   ```yaml
   akka.rpc.address: vm-01
   akka.rpc.port: 6123
   ```

   - 配置 `ZooKeeper` 高可用（可选）： 如果你想启用高可用性（HA），你需要配置 `Flink` 使用 `ZooKeeper` 作为协调器：

     ```yaml
     high-availability: zookeeper
     high-availability.zookeeper.quorum: vm-01:2181,vm-02:2181,vm-03:2181
     
     # TODO 高可用为何使用不了，暂时配置为 none 禁用
     high-availability: none
     high-availability.storageDir: hdfs://vm-01:9000/flink/ha
     high-availability.zookeeper.quorum: vm-01:2181,vm-02:2181,vm-03:2181
     ```

2. 确保所有配置文件一致： 

   - 确保 `flink-conf.yaml` 文件在所有节点上配置一致，尤其是 `jobmanager.rpc.address` 和 `taskmanager.numberOfTaskSlots` 配置项。

## 4. 启动 `Flink` 集群

在 `vm-01` 上，启动 `JobManager` ：

```bash
cd /usr/local/flink/bin
# 启动
./start-cluster.sh
# 关闭
./stop-cluster.sh
```

在 `vm-02`、`vm-03` 上，启动 `TaskManager` ：

```bash
./taskmanager.sh start 设置 Flink 内存大小
```

## 5. 查看集群状态

访问，对应的 `vm-01:8082` （默认：8081，但端口冲突配置成了8082）

```bash
# 通过 Flink 提供的 flink list 命令查看作业状态
./flink list
# 列出集群中的 TaskManager 节点。
flink list -y
```







