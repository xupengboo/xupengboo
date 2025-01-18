# HBase

HBase 是基于 Hadoop 的分布式数据库，依赖于 Hadoop 的 HDFS 存储和 YARN 资源管理。

# 前提

搭建 HBase 前提条件：**Hadoop 集群已成功配置和启动。**

# 1. 下载并安装 `HBase` 

HBase 官方：[https://hbase.apache.org/](https://hbase.apache.org/)

去官方，下载合适的 HBase 版本。

解压到合适的目录中，例如：`/usr/local/hbase`。

注意，HBase 要与 Hadoop 有版本对应关系：

```shell
src：（source）源码：包含源代码，通常用于开发和自定义。
bin：（binary）二进制：包含已经编译好的二进制文件和可执行命令，用户通常用来操作框架。

这里，我们的 Hadoop 用3.x.x版本，所以要用 hadoop3-bin ：
- hadoop3-bin (sha512 asc)：这个包是专为与 Hadoop 3.x 版本兼容的 HBase 所准备的二进制文件。它包含了与 Hadoop 3.x 集群兼容的特定 HBase 版本的二进制文件。
```

![image-20241211171812853](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241211171812853.png)



1. 下载  [hbase-2.6.1-hadoop3-bin.tar.gz](https://dlcdn.apache.org/hbase/2.6.1/hbase-2.6.1-hadoop3-bin.tar.gz) 压缩包

```shell
# 解压压缩包
tar -zxvf hbase-2.6.1-hadoop3-bin.tar.gz
# 转移到 `/usr/local/hbase`下面
mv hbase-2.6.1-hadoop3 /usr/local/hbase
```



# 2. 配置 HBase

1. 配置 `hbase-env.sh` 

```shell
cd /usr/local/hbase/conf
vi hbase-env.sh
# 将 JAVA_HOME 配置成自己本地的JAVA_HOME环境 `echo $JAVA_HOME` 可以查看。
export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk
```

2. 配置 `hbase-site.xml`

```shell
vi /usr/local/hbase/conf/hbase-site.xml
```

```xml
<configuration>
    
    <!-- 由于我们是分布式节点启动，所以这里一定要改为 true，不然无法启动！ -->
    <property>
        <name>hbase.cluster.distributed</name>
        <value>true</value>
    </property>
    
    <!-- HBase Master 和 RegionServer 绑定的地址 -->
    <property>
        <name>hbase.master</name>
        <value>hbase://vm-01:16000</value>
    </property>

    <!-- HBase 使用的 ZooKeeper 集群 -->
    <property>
        <name>hbase.zookeeper.quorum</name>
        <value>vm-01,vm-02,vm-03</value> 
    </property>

    <!-- 默认的 ZooKeeper 客户端端口 -->
    <property>
        <name>hbase.zookeeper.property.clientPort</name>
        <value>2181</value> 
    </property>

    <!-- HBase 根目录 -->
    <property>
        <name>hbase.rootdir</name>
        <value>hdfs://vm-01:9000/hbase</value> <!-- 存储在 HDFS 中 -->
    </property>

    <!-- Zookeeper 的根节点 -->
    <property>
        <name>zookeeper.znode.parent</name>
        <value>/hbase</value>
    </property>

    <!-- 启用 HBase Master 和 RegionServer -->
    <property>
        <name>hbase.master.port</name>
        <value>16000</value>
    </property>

    <property>
        <name>hbase.regionserver.port</name>
        <value>16020</value>
    </property>

</configuration>
```

3. 确保 使用的 `hdfs://vm-01:9000` 是你 Hadoop集群中 HDFS的 `core-site.xml` 和 `hdfs-site.xml` 配置。

# 3.  配置 ZooKeeper （HBase 需要依赖 ZooKeeper）

## 3.1 下载并安装 ZooKeeper 

1. HBase 需要使用 ZooKeeper 来协调集群中的节点，因此，需要启动一个ZooKeeper集群。现在，在HBase 集群的每一台虚拟机上启动 ZooKeeper。
2. 下载并解压 ZooKeeper 

```shell
tar -xzvf apache-zookeeper-3.8.4-bin.tar.gz
mv apache-zookeeper-3.8.4-bin /usr/local/zookeeper
```

> 注意：版本对应，这里使用 [apache-zookeeper-3.8.4-bin.tar.gz](https://www.apache.org/dyn/closer.lua/zookeeper/zookeeper-3.8.4/apache-zookeeper-3.8.4-bin.tar.gz) 来进行操作。

## 3.2 配置 ZooKeeper 集群

1. ZooKeeper 默认使用 `conf/zoo_sample.cfg` 文件作为配置模板。将其复制为 `zoo.cfg`。

```shell
cd /usr/local/zookeeper/conf/
cp zoo_sample.cfg zoo.cfg
```

2. 编辑 `zoo.cfg` 文件，配置如下内容：

```properties
# 基本配置
tickTime=2000 
initLimit=10
syncLimit=5
dataDir=/usr/local/zookeeper/data 
clientPort=2181
maxClientCnxns=60
# 注意：以上大部分配置已存在，需要替换就行

# 集群服务器列表
server.1=vm-01:2888:3888
server.2=vm-02:2888:3888
server.3=vm-03:2888:3888

# tickTime：ZooKeeper 服务器与客户端之间或服务器之间心跳的基本时间单位，单位为毫秒。
# initLimit：Follower 节点连接 Leader 节点的初始化时间，单位为 tickTime 的倍数。
# syncLimit：Leader 和 Follower 之间同步的最大时间，单位为 tickTime 的倍数。
# dataDir：ZooKeeper 保存数据的目录，需要为每台虚拟机单独创建。
# clientPort：客户端连接 ZooKeeper 集群的端口，默认是 2181。
# server.X：X 是每个节点的唯一编号；2888 是节点通信端口；3888 是选举端口。
```

3. 为每个节点设置 `myid` 文件]

- 在 `dataDir`（比如 `/usr/local/zookeeper/data`）中，为每个虚拟机创建一个名为 `myid` 的文件，用于标识节点编号。内容为 `zoo.cfg` 中配置的 `server.X` 的编号：

在 vm-01：

```shell
mkdir -p /usr/local/zookeeper/data
echo "1" > /usr/local/zookeeper/data/myid
```

在 vm-02：

 ```shell
mkdir -p /usr/local/zookeeper/data
echo "2" > /usr/local/zookeeper/data/myid
 ```

在 vm-03：

 ```shell
mkdir -p /usr/local/zookeeper/data
echo "3" > /usr/local/zookeeper/data/myid
 ```

4. 启动 ZooKeeper 集群

```shell
# 1. 启动 ZooKeeper 
cd /usr/local/zookeeper/bin
./zkServer.sh start

# 2. 查看ZooKeeper状态
./zkServer.sh status

# 3. 停止 ZooKeeper
./zkServer.sh stop

# 4. 重启 ZooKeeper 
./zkServer.sh restart
```

5. 验证集群是否访问成功。

```shell
# 1. 通过客户端连接 ZooKeeper ：
./zkCli.sh -server 192.168.10.68:2181
# 2. 执行一些简单命令验证：
ls /
create /test "HelloZooKeeper"
get /test
```

# 4. 启动 HBase 集群

1. 先在 主节点 `vm-01`  上 执行 `./start-hbase.sh`：

```shell
cd /usr/local/hbase/bin
./start-hbase.sh
```

2. 后在 从节点 `vm-02` 和 `vm-03` 上 执行 `./start-hbase.sh`：

```shell
./start-hbase.sh
```

> 提示：HBase 在第一次启动时需要通过 hbase init 操作将集群的元数据存储在 ZooKeeper 中（包括 /hbase/hbaseid 节点）。
>
> - `usr/local/zookeeper/bin/zkCli.sh` 执行 `ls /hbase` 查看。

# 5. 检测 HBase 集群是否启动成功

1. 所有节点运行 `jps` 命令：

- HBase Master：应该看到 `HMaster` 进程。
- RegionServer：应该看到 `HRegionServer` 进程。

```shell
jps
```

2. 检查 日志：

```shell
# master
tail -f /usr/local/hbase/logs/hbase-root-master-vm-01.log
tail -f /usr/local/hbase/logs/hbase-root-master-vm-01.out
# regionServer
tail -f /usr/local/hbase/logs/hbase-root-regionserver-vm-02.log
tail -f /usr/local/hbase/logs/hbase-root-regionserver-vm-02.out
```

3. 使用 HBase Shell 检查集群状态：

```shell
# 启动 HBase Shell ：
/usr/local/hbase/bin/hbase shell
# 检查集群状态
hbase:001:0> status
1 active master, 2 backup masters, 3 servers, 0 dead, 0.6667 average load
Took 1.3920 seconds
```

# 6. 访问 HBase Web UI

HBase 提供了一个 Web UI，可以在浏览器中查看集群的状态。

- HBase Master Web UI：访问 `http://<hbase-master-hostname>:16010`（例如 `http://vm-01:16010`）。
  - 你可以查看集群的整体状态、各个 RegionServer 的信息以及其他集群指标。
- HBase RegionServer Web UI：访问 `http://<regionserver-hostname>:16030`（例如 `http://vm-02:16030`）。
  - 你可以查看 RegionServer 的详细信息，例如 Region 分布、内存使用情况等。

# 7. 向 HBase 中写入数据并读取

```shell
# 进入 HBase Shell 
hbase shell

# 创建一个表： 在 HBase Shell 中，创建一个表：
create 'test_table', 'cf1'

# 插入数据： 插入一些数据：
put 'test_table', 'row1', 'cf1:name', 'John'

# 查询数据： 查询数据：
get 'test_table', 'row1'
```

至此，HBase集群搭建成功。



















