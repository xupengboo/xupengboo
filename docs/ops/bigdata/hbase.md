---
title: HBase
order: 4
icon: ant-design:cluster-outlined
---

# HBase

:::info
**HBase** 是基于 Hadoop 的分布式 NoSQL 数据库，依赖 HDFS 存储和 ZooKeeper 协调，适用于海量数据的随机、实时读写场景。

官方文档：[https://hbase.apache.org/](https://hbase.apache.org/)

**前提**：搭建 HBase 前，Hadoop 集群必须已成功启动。
:::

---

## 一、版本对应关系

HBase 与 Hadoop 之间有版本兼容性要求：

| HBase 版本 | 兼容 Hadoop | 说明 |
|:---:|:---:|:---|
| hbase-2.6.1-**hadoop3**-bin | Hadoop 3.x | 本文使用此版本 |
| hbase-2.x-**hadoop2**-bin | Hadoop 2.x | 旧版集群使用 |

下载地址：[https://dlcdn.apache.org/hbase/](https://dlcdn.apache.org/hbase/)

---

## 二、安装 HBase

```shell
# 下载并解压（以 2.6.1 + Hadoop 3 为例）
tar -zxvf hbase-2.6.1-hadoop3-bin.tar.gz
mv hbase-2.6.1-hadoop3 /usr/local/hbase
```

---

## 三、配置 HBase

### 1. hbase-env.sh

```shell
cd /usr/local/hbase/conf
vi hbase-env.sh

# 指定 JDK 路径（与 Hadoop 保持一致）
export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk
```

### 2. hbase-site.xml

```xml
<configuration>
  <!-- 分布式模式，集群部署必须为 true -->
  <property>
    <n>hbase.cluster.distributed</n>
    <value>true</value>
  </property>

  <!-- HBase Master 地址 -->
  <property>
    <n>hbase.master</n>
    <value>hbase://vm-01:16000</value>
  </property>

  <!-- ZooKeeper 集群地址 -->
  <property>
    <n>hbase.zookeeper.quorum</n>
    <value>vm-01,vm-02,vm-03</value>
  </property>

  <!-- ZooKeeper 客户端端口（默认 2181） -->
  <property>
    <n>hbase.zookeeper.property.clientPort</n>
    <value>2181</value>
  </property>

  <!-- HBase 数据存储在 HDFS 的路径 -->
  <property>
    <n>hbase.rootdir</n>
    <value>hdfs://vm-01:9000/hbase</value>
  </property>

  <!-- ZooKeeper 根节点路径 -->
  <property>
    <n>zookeeper.znode.parent</n>
    <value>/hbase</value>
  </property>

  <property>
    <n>hbase.master.port</n>
    <value>16000</value>
  </property>
  <property>
    <n>hbase.regionserver.port</n>
    <value>16020</value>
  </property>
</configuration>
```

---

## 四、配置 ZooKeeper

HBase 依赖 ZooKeeper 协调集群节点，需在每台机器上部署 ZooKeeper。

### 安装

```shell
tar -xzvf apache-zookeeper-3.8.4-bin.tar.gz
mv apache-zookeeper-3.8.4-bin /usr/local/zookeeper
```

### 配置 zoo.cfg

```shell
cd /usr/local/zookeeper/conf
cp zoo_sample.cfg zoo.cfg
vi zoo.cfg
```

```properties
tickTime=2000        # 心跳基本时间单位（毫秒）
initLimit=10         # Follower 初始化连接 Leader 的超时倍数
syncLimit=5          # Leader-Follower 同步超时倍数
dataDir=/usr/local/zookeeper/data
clientPort=2181

# 集群节点列表（2888：节点通信端口，3888：选举端口）
server.1=vm-01:2888:3888
server.2=vm-02:2888:3888
server.3=vm-03:2888:3888
```

### 设置节点 ID

每台机器分别执行（ID 与 `server.X` 中的 X 一致）：

```shell
# vm-01
mkdir -p /usr/local/zookeeper/data
echo "1" > /usr/local/zookeeper/data/myid

# vm-02
mkdir -p /usr/local/zookeeper/data
echo "2" > /usr/local/zookeeper/data/myid

# vm-03
mkdir -p /usr/local/zookeeper/data
echo "3" > /usr/local/zookeeper/data/myid
```

### 启动 ZooKeeper

```shell
cd /usr/local/zookeeper/bin

./zkServer.sh start    # 启动
./zkServer.sh status   # 查看状态（Leader/Follower）
./zkServer.sh stop     # 停止

# 验证连接
./zkCli.sh -server 192.168.10.68:2181
# 执行简单命令验证
ls /
create /test "hello"
get /test
```

---

## 五、启动 HBase 集群

```shell
cd /usr/local/hbase/bin

# 主节点 vm-01 先启动
./start-hbase.sh

# 从节点 vm-02、vm-03 依次启动
./start-hbase.sh
```

---

## 六、验证集群状态

```shell
# 查看各节点进程（主节点应有 HMaster，从节点应有 HRegionServer）
jps

# 查看日志
tail -f /usr/local/hbase/logs/hbase-*-master-vm-01.log

# HBase Shell 检查集群状态
/usr/local/hbase/bin/hbase shell
hbase> status
# 1 active master, 2 backup masters, 3 servers, 0 dead, 0.6667 average load
```

**Web UI 访问：**

| 服务 | 地址 | 内容 |
|:---:|:---:|:---|
| HBase Master | `http://vm-01:16010` | 集群整体状态、RegionServer 列表 |
| RegionServer | `http://vm-02:16030` | 单节点 Region 分布、内存使用 |

---

## 七、基础操作

```shell
# 进入 HBase Shell
hbase shell

# 创建表（cf1 为列族名）
hbase> create 'test_table', 'cf1'

# 插入数据
hbase> put 'test_table', 'row1', 'cf1:name', 'Alice'

# 查询数据
hbase> get 'test_table', 'row1'

# 扫描全表
hbase> scan 'test_table'

# 删除数据
hbase> delete 'test_table', 'row1', 'cf1:name'

# 删除表（先 disable 再 drop）
hbase> disable 'test_table'
hbase> drop 'test_table'
```
