---
title: Hadoop
order: 2
icon: mdi:elephant
---

# Hadoop

:::info
**Hadoop** 是一个开源的**分布式计算与存储框架**，设计用于在廉价硬件集群上处理海量数据（TB 到 PB 级）。核心思想是通过**横向扩展（Scale-out）**应对大数据挑战，提供高容错、高吞吐的数据处理能力，是**大数据生态的基石**。

官方文档：[https://hadoop.apache.org/](https://hadoop.apache.org/)
:::

## 核心组件

| 组件 | 作用 |
|:---:|:---|
| **HDFS** | 分布式文件系统，将数据分块存储在多台机器上，提供高可靠性和扩展性 |
| **YARN** | 资源管理框架，统一调度集群资源（CPU、内存），支持多种计算引擎 |
| **MapReduce** | 分布式计算模型，通过 Map 和 Reduce 阶段批量处理数据 |
| **Hadoop Common** | 基础工具库，为其他组件提供通用功能（配置管理、文件系统抽象等） |

## Web UI 端口速查

| 服务 | 默认端口 | 访问地址示例 | 主要功能 |
|:---:|:---:|:---:|:---|
| NameNode（Hadoop 3.x） | **9870** | `http://hadoop102:9870` | HDFS 健康状态、DataNode 列表、块副本信息 |
| NameNode（Hadoop 2.x） | 50070 | `http://hadoop102:50070` | 同上（旧版） |
| ResourceManager（YARN） | 8088 | `http://hadoop103:8088` | 应用程序资源调度、NodeManager 状态 |
| JobHistory Server | 19888 | `http://hadoop102:19888` | 已完成 MapReduce 任务历史记录 |

:::warning Hadoop 3.x 端口变更
Hadoop 3.x 将 NameNode Web UI 端口从 `50070` 改为 `9870`，配置文件中注意区分版本。
:::

---

## 一、集群搭建

### 环境规划

本文以 3 台虚拟机为例，Hadoop 版本 **3.2.4**：

| 节点 | 角色 | 运行进程 |
|:---:|:---:|:---:|
| vm-01 | 主节点 | NameNode、ResourceManager |
| vm-02 | 从节点 | DataNode、NodeManager |
| vm-03 | 从节点 | DataNode、NodeManager |

:::tip 为什么要创建专用 Hadoop 用户？
Hadoop 默认不建议用 `root` 运行服务。若一开始用 root，后续切换用户时已配置好的 `.bashrc`、SSH 免密登录等都需要重新配置，代价很高。
:::

```shell
# 创建 hadoop 专用用户
adduser hadoop
passwd hadoop
chown -R hadoop:hadoop /usr/local/hadoop
su - hadoop
```

### Step 1 — 配置镜像源（三台节点均执行）

```shell
curl -o /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-7.repo
sudo yum clean all && sudo yum makecache
```

### Step 2 — 安装 JDK

```shell
# 检查是否已安装，Hadoop 需要 JDK 1.8+
java -version
```

### Step 3 — 配置静态网络 & hosts

```shell
# /etc/hosts 三台节点统一配置
192.168.10.68 vm-01
192.168.10.69 vm-02
192.168.10.70 vm-03
```

### Step 4 — 配置 SSH 免密登录（三台均执行）

主节点需要无密码登录从节点，以便 Hadoop 控制脚本统一启停集群。

```shell
# 生成密钥对
ssh-keygen -t rsa   # 一路回车，不设密码

# 将公钥分发到所有节点（含自身）
ssh-copy-id hadoop@localhost
ssh-copy-id hadoop@192.168.10.68
ssh-copy-id hadoop@192.168.10.69
ssh-copy-id hadoop@192.168.10.70

# 验证免密登录
ssh root@192.168.10.68
```

### Step 5 — 下载并安装 Hadoop

```shell
cd /opt
wget https://downloads.apache.org/hadoop/common/hadoop-3.2.4/hadoop-3.2.4.tar.gz
tar -xzvf hadoop-3.2.4.tar.gz
mv hadoop-3.2.4 /usr/local/hadoop
```

### Step 6 — 配置环境变量

```shell
vi ~/.bashrc
# 在文件末尾追加：

## Java
export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk
export PATH=$JAVA_HOME/bin:$PATH

## Hadoop
export HADOOP_HOME=/usr/local/hadoop
export HADOOP_CONF_DIR=$HADOOP_HOME/etc/hadoop
export PATH=$PATH:$HADOOP_HOME/bin:$HADOOP_HOME/sbin

source ~/.bashrc

# 验证
hadoop version
```

### Step 7 — 配置 Hadoop 配置文件（三台节点均配置）

**① core-site.xml** — 基础文件系统

```xml
<!-- $HADOOP_HOME/etc/hadoop/core-site.xml -->
<configuration>
  <property>
    <name>fs.defaultFS</name>
    <value>hdfs://vm-01:9000</value>  <!-- 主节点地址 -->
  </property>
</configuration>
```

**② hdfs-site.xml** — HDFS 参数

```xml
<configuration>
  <property>
    <name>dfs.replication</name>
    <value>3</value>  <!-- 副本数，建议与 DataNode 数量一致 -->
  </property>
  <property>
    <name>dfs.namenode.http-address</name>
    <value>0.0.0.0:9870</value>  <!-- Hadoop 3.x 默认端口为 9870 -->
  </property>
  <property>
    <name>dfs.namenode.name.dir</name>
    <value>file:///usr/local/hadoop/data/name</value>
  </property>
  <property>
    <name>dfs.datanode.data.dir</name>
    <value>file:///usr/local/hadoop/data/datanode</value>
  </property>
</configuration>
```

**③ yarn-site.xml** — YARN 资源管理

```xml
<configuration>
  <property>
    <name>yarn.resourcemanager.address</name>
    <value>vm-01:8032</value>
  </property>
  <property>
    <name>yarn.nodemanager.local-dirs</name>
    <value>/usr/local/hadoop/yarn/local</value>
  </property>
  <property>
    <name>yarn.nodemanager.log-dirs</name>
    <value>/usr/local/hadoop/yarn/log</value>
  </property>
  <!-- 启用 MapReduce Shuffle 辅助服务 -->
  <property>
    <name>yarn.nodemanager.aux-services</name>
    <value>mapreduce_shuffle</value>
  </property>
</configuration>
```

**④ mapred-site.xml** — MapReduce 框架

```xml
<configuration>
  <property>
    <name>mapreduce.framework.name</name>
    <value>yarn</value>  <!-- 使用 YARN 调度 MapReduce -->
  </property>
  <property>
    <name>yarn.app.mapreduce.am.env</name>
    <value>HADOOP_MAPRED_HOME=/usr/local/hadoop</value>
  </property>
  <property>
    <name>mapreduce.map.env</name>
    <value>HADOOP_MAPRED_HOME=/usr/local/hadoop</value>
  </property>
  <property>
    <name>mapreduce.reduce.env</name>
    <value>HADOOP_MAPRED_HOME=/usr/local/hadoop</value>
  </property>
</configuration>
```

:::tip Hadoop 1.x vs 2.x 架构变化
Hadoop 1.x 中 MapReduce 同时承担计算和资源调度。  
**Hadoop 2.x 起**，YARN 独立承担资源管理和任务调度，MapReduce 仅负责计算逻辑，架构更清晰。
:::

### Step 8 — 格式化 HDFS（仅主节点 vm-01）

```shell
# 只需在主节点执行一次，初始化 NameNode 元数据
hdfs namenode -format
```

> 从节点只存储数据块，无需格式化。

### Step 9 — 启动集群

```shell
cd /usr/local/hadoop/sbin

# 启动 HDFS
./start-dfs.sh

# 启动 YARN
./start-yarn.sh

# 验证进程（主节点应看到以下6个进程）
jps
# 11445 DataNode
# 11862 ResourceManager
# 11303 NameNode
# 11629 SecondaryNameNode
# 11983 NodeManager
# 12327 Jps
```

:::warning root 用户启动报错
若用 root 用户启动，会报 `ERROR: but there is no HDFS_NAMENODE_USER defined`。  
解决方案：切换为 hadoop 专用用户，或在 `hadoop-env.sh` 中显式声明环境变量（不推荐）。
:::

### Step 10 — 验证集群

```shell
# 访问 Web UI
# NameNode:       http://192.168.10.68:9870
# ResourceManager: http://192.168.10.68:8088

# 验证 HDFS 是否正常
hadoop fs -ls /

# 上传测试文件
hadoop fs -mkdir -p /user/hadoop
hadoop fs -put localfile.txt /user/hadoop

# 查看上传结果
hadoop fs -ls /user/hadoop
```

---

## 二、HDFS 常用命令

### 基础操作

```shell
hdfs dfs -ls /                          # 查看目录
hdfs dfs -mkdir /path/to/dir            # 创建目录
hdfs dfs -put input.txt /user/hadoop/   # 上传文件（本地 → HDFS）
hdfs dfs -get /hdfs/path /local/path    # 下载文件（HDFS → 本地）
hdfs dfs -cat /hdfs/path/to/file        # 查看文件内容
hdfs dfs -rm /hdfs/path/to/file         # 删除文件
hdfs dfs -rm -r /hdfs/path/to/dir       # 递归删除目录
```

### 查看压缩文件

```shell
# zcat 用于解压 gzip 文件后查看内容
hadoop fs -cat /base_province/* | zcat
# 3    山西    1    140000    CN-14    CN-SX    2021-12-14 00:00:00    \N
# 4    内蒙古  1    150000    CN-15    CN-NM    2021-12-14 00:00:00    \N
```
