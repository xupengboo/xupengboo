# 搭建Hadoop集群

步骤：数据采集 → Hadoop HDFS 存储 → HBase 缓存 → 使用 Spark 和 Flink 进行数据处理和分析。

# 环境准备

虚拟机角色分配
VM 1：主节点，**运行 NameNode 和 ResourceManager**。
VM 2：从节点，**运行 DataNode 和 NodeManager**。
VM 3：从节点，**运行 DataNode 和 NodeManager**。

hadoop版本：hadoop-3.2.4

创建一个 Hadoop 专用用户。

> **Hadoop 默认不建议使用 `root` 用户运行服务，而是推荐使用普通用户**。

```shell
# 添加 hadoop 用户
adduser hadoop
# 设置 hadoop 密码
passwd hadoop
# 赋予安装目录权限
chown -R hadoop:hadoop /usr/local/hadoop
# 切换用户
su - hadoop 
```
> 为什么要先创建好用户？
>
> - 如果一开始用 root 用户，后面在创建的话，之前已经配置好的内容，需要重新配置一边，因为不同用户不同环境。例如：`.bashrc` 文件、`ssh` 免密登录。
>
> 也可以设置特定环境变量，临时使用 `root` 用户，但不推荐。

三台服务器都配置 阿里镜像源：

```shell
curl -o /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-7.repo
# 或
wget -O /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-7.repo
# 这俩都行

cat CentOS-Base.repo
sudo yum clean all
sudo yum makecache
```




# 1. 下载并安装JDK

```shell
# 检查是否安装了java，若没有需要先安装JDK，注意版本一般都是1.8
java -version 
# 安装可以直接去官方下载对应的压缩包，还可以通过yum or apt-get命令安装等等。
```

# 2.  配置静态网络

见：[如何设置CentOS服务器静态网络](https://github.com/xupengboo/xupengboo/blob/master/2.%E8%BF%90%E7%BB%B4%E9%83%A8%E7%BD%B2/Linux/%E5%A6%82%E4%BD%95%E8%AE%BE%E7%BD%AE%E5%A4%9A%E5%8F%B0%E8%99%9A%E6%8B%9F%E6%9C%BA%E9%9D%99%E6%80%81IP%E7%9A%84%E7%BD%91%E7%BB%9C%E9%85%8D%E7%BD%AE.md)


# 3. 配置 `/etc/hosts` 文件：
```shell
192.168.10.68 vm-01
192.168.10.69 vm-02
192.168.10.70 vm-03
```

# 3. 配置各个节点 ssh 免密登录

为了让 Hadoop 节点之间可以通信，**主节点需要能够无密码登录到其他从节点**。

在 所有节点 上执行以下命令：
```shell
# 生成密钥对， 不需要设置密码
ssh-keygen -t rsa

# 复制公钥到其他节点
ssh-copy-id hadoop@localhost # 为了让 localhost 也支持免密登录，配置 localhost 免密登录
ssh-copy-id hadoop@192.168.10.68  # 复制到 vm-01
ssh-copy-id hadoop@192.168.10.69  # 复制到 vm-02
ssh-copy-id hadoop@192.168.10.70  # 复制到 vm-03

# 通过连接，检查是否能够免密操控：
ssh root@192.168.10.68
ssh root@192.168.10.69
ssh root@192.168.10.70
```


# 4. 下载和安装hadoop。
```shell
cd /opt
# 选择合适的hadoop版本
wget https://downloads.apache.org/hadoop/common/hadoop-3.2.4/hadoop-3.2.4.tar.gz
# 解压
tar -xzvf hadoop-3.2.4.tar.gz
# /usr/local通常被用作本地软件安装目录。
mv hadoop-3.2.4 /usr/local/hadoop
```

# 5. 去`vi ~/.bashrc`中 配置环境变量。
```shell
# ~/.bashrc是一个 Bash shell（Bourne - Again Shell）的配置文件。 
# 当你安装了一个新的软件，并且希望在命令行中能够方便地访问这个软件的可执行命令，就可以在~/.bashrc文件中设置PATH环境变量。
vi ~/.bashrc

# 在文件末尾添加以下内容：
## Java环境配置
export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk
export PATH=$JAVA_HOME/bin:$PATH

## Hadoop环境配置
export HADOOP_HOME=/usr/local/hadoop
export HADOOP_CONF_DIR=$HADOOP_HOME/etc/hadoop
export PATH=$PATH:$HADOOP_HOME/bin:$HADOOP_HOME/sbin

# 重新刷新命令行环境变量。
source ~/.bashrc

# 检查环境
java -version
hadoop version
```

# 6. 配置Hadoop配置文件

在每台节点配置配置文件：

1. `core-site.xml` 配置：Hadoop的基础文件系统。
在 `$HADOOP_HOME/etc/hadoop/core-site.xml` 中配置 Hadoop 的文件系统 URI。

```shell
cd $HADOOP_HOME/etc/hadoop/core-site.xml
```

```xml
<configuration>
  <property>
    <name>fs.defaultFS</name>
    <value>hdfs://vm-01:9000</value> <!-- 这里要配置 主节点的 IP 地址， 此处为 vm-01 的 IP 地址 -->
  </property>
</configuration>
```

2. `hdfs-site.xml` 配置：HDFS 的相关参数。
```shell
vi $HADOOP_HOME/etc/hadoop/hdfs-site.xml
```

```xml
<configuration>
  <property>
    <name>dfs.replication</name>
    <value>3</value> <!-- 设置副本数 -->
  </property>
  <property>
    <name>dfs.namenode.http-address</name>
    <value>0.0.0.0:50070</value> <!-- 监听所有网络接口的 50070 端口，这样其他地址访问namenode UI也能访问通！ -->
  </property>
  <property>
    <name>dfs.namenode.name.dir</name>
    <value>file:///usr/local/hadoop/data/name</value> <!-- NameNode 数据存储目录 -->
  </property>
  <property>
    <name>dfs.datanode.data.dir</name>
    <value>file:///usr/local/hadoop/data/datanode</value> <!-- DataNode 数据存储目录 -->
  </property>
</configuration>
```

3. `yarn-site.xml` 配置：配置 YARN 的 ResourceManager 地址。
> YARN 是 Hadoop 生态系统中的一个关键组件，全称为 Yet Another Resource Negotiator，即“另一个资源协调器”。它是在 Hadoop 2.x 版本中引入的，用于实现分布式计算环境中的**资源管理和任务调度**。

```shell
vi $HADOOP_HOME/etc/hadoop/yarn-site.xml
```

```xml
<configuration>
    <!-- YARN ResourceManager 地址 -->
    <property>
        <name>yarn.resourcemanager.address</name>
        <value>vm-01:8032</value>
    </property>

    <!-- NodeManager 本地临时文件目录 -->
    <property>
        <name>yarn.nodemanager.local-dirs</name>
        <value>/usr/local/hadoop/yarn/local</value>
    </property>

    <!-- NodeManager 本地日志文件目录 -->
    <property>
        <name>yarn.nodemanager.log-dirs</name>
        <value>/usr/local/hadoop/yarn/log</value>
    </property>
</configuration>
```

4. `mapred-site.xml` 配置：配置 MapReduce 的框架。
```shell
vi $HADOOP_HOME/etc/hadoop/mapred-site.xml
```

```xml
<configuration>
  <property>
    <name>mapreduce.framework.name</name>
    <value>yarn</value> <!-- 使用 YARN 作为 MapReduce 框架 -->
  </property>
</configuration>
```

> 拓展：在 Hadoop 1.x 中，MapReduce 承担了任务调度和资源管理的职责。
>
> **在 Hadoop 2.x 中，这些职责被分离到 YARN 中**：
>
> - **YARN 负责资源管理和任务调度**。
> - **MapReduce 仅负责计算逻辑**。

# 7. 格式化HDFS

只格式化 主节点 vm-01 ：

```shell
hdfs namenode -format
```

> 为什么不格式化从节点？
>
> - 格式化是 **初始化 NameNode 的元数据存储**。
> - 从节点仅存储数据块。

# 8. 启动 Hadoop 集群

1. 启动 `HDFS` ，在 `所有节点` 上运行：

```shell
# 进入hadoop安装目录的sbin目录下面：
cd /usr/local/hadoop/sbin
# 启动hdfs
./start-dfs.sh

# 暂停使用：
./stop-dfs.sh
```

2. 启动 `YARN` ：在 `所有节点` 上运行：

```shell
# 启动yarn
./start-yarn.sh

# 暂停使用
./stop-yarn.sh
```

> `root` 用户，运行 Hadoop服务，而没有设置响应的用户环境变量会导致以下错误：

```text
[root@vm-01 hadoop]# start-dfs.sh
Starting namenodes on [vm-01]
ERROR: Attempting to operate on hdfs namenode as root
ERROR: but there is no HDFS_NAMENODE_USER defined. Aborting operation.
Starting datanodes
ERROR: Attempting to operate on hdfs datanode as root
ERROR: but there is no HDFS_DATANODE_USER defined. Aborting operation.
Starting secondary namenodes [vm-01]
ERROR: Attempting to operate on hdfs secondarynamenode as root
ERROR: but there is no HDFS_SECONDARYNAMENODE_USER defined. Aborting operation.
```

3. 整体效果如下：

```shell
[hadoop@vm-01 sbin]$ ./start-dfs.sh
Starting namenodes on [vm-01]
Starting datanodes
Starting secondary namenodes [vm-01]

[hadoop@vm-01 sbin]$ ./start-yarn.sh
Starting resourcemanager
Starting nodemanagers

[hadoop@vm-01 sbin]$ jps
11445 DataNode
11862 ResourceManager
11303 NameNode
12327 Jps
11629 SecondaryNameNode
11983 NodeManager
```

# 9. 验证集群状态

1. 通过浏览器访问 `NameNode` 和 `ResourceManager` 的 Web UI：

- 访问 NameNode Web UI：`http://192.168.10.68:50070`
- 访问 ResourceManager Web UI：`http://192.168.10.68:8088`

2. 检查 HDFS 是否正常工作

```shell
hadoop fs -ls / 
```

3. 上传文件到 HDFS： 假设你有一个文件 `localfile.txt`，可以通过以下命令将文件上传到 HDFS

```shell
hadoop fs -mkdir -p /user/hadoop
hadoop fs -put localfile.txt /user/hadoop
```

4. 查看上传文件：

```shell
[hadoop@vm-01 ~]$ hadoop fs -ls /user/hadoop
Found 1 items
-rw-r--r--   3 hadoop supergroup         13 2024-12-10 23:36 /user/hadoop/localfile.txt
```



至此，一个 hadoop 集群就搭建成功了。