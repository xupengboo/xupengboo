# Spark 集群

# 1. 下载并安装  `Scala `

检查 Java ：

```shell
# 检查是否安装java
java -version
# 没有则需要安装一下，这里就不再重复了。
```

1.  下载 Scala 压缩包：

- 官方下载地址：https://www.apache.org/dyn/closer.lua/spark/spark-3.5.3/spark-3.5.3-bin-hadoop3.tgz

```shell
# 检查是否已经安装scala
scala -version 
```

> 注意：还是要注意版本问题，Spark、Hadoop 和 HBase 之间是有版本兼容性的要求的。

2. 解压 并将其转移到合适位置：

```shell
wget https://dlcdn.apache.org/spark/spark-3.5.3/spark-3.5.3-bin-hadoop3.tgz
tar -zxvf spark-3.5.3-bin-hadoop3.tgz
sudo mv spark-3.5.3-bin-hadoop3 /usr/local/spark
```

3. 配置 Spark 环境变量：

- 在 `~/.bashrc` 或 `/etc/profile` 文件中加入以下内容：

```shell
export SPARK_HOME=/usr/local/spark
export PATH=$SPARK_HOME/bin:$PATH
export SPARK_MASTER_HOST=vm-01  # 设置为主节点地址

source ~/.bashrc
```

# 2. 配置 Spark 与 Hadoop 集成

1. 配置 `spark-env.sh`

- 在 `$SPARK_HOME/conf` 目录下，复制 `spark-env.sh.template` 为 `spark-env.sh`：

```shell
cp $SPARK_HOME/conf/spark-env.sh.template $SPARK_HOME/conf/spark-env.sh
```
- 然后编辑 spark-env.sh 文件，配置如下：
```shell
vi spark-env.sh

export SPARK_MASTER_HOST=vm-01  # 设置主节点地址
export SPARK_LOCAL_DIRS=/usr/local/spark/local  # Spark 本地存储目录
export SPARK_WORKER_DIR=/usr/local/spark/worker  # Spark 工作节点的本地存储目录
export HADOOP_CONF_DIR=/usr/local/hadoop/etc/hadoop  # Hadoop 配置文件目录
```

2. 配置 `spark-defaults.conf` 
 - 复制 `spark-defaults.conf.template` 为 `spark-defaults.conf` 文件：

```shell
cp $SPARK_HOME/conf/spark-defaults.conf.template $SPARK_HOME/conf/spark-defaults.conf
```

   -  在 `spark-defaults.conf` 中，加入以下配置，确保 Spark 能够与 Hadoop 集群协作：
```shell
# HDFS 配置
spark.hadoop.fs.defaultFS=hdfs://vm-01:9000

# YARN 资源管理相关配置
spark.hadoop.yarn.resourcemanager.address=vm-01:8032
spark.hadoop.yarn.resourcemanager.scheduler.address=vm-01:8030
spark.hadoop.yarn.resourcemanager.resource-tracker.address=vm-01:8031
spark.hadoop.yarn.nodemanager.address=vm-01:8040

# 本地存储和日志目录
spark.hadoop.yarn.nodemanager.local-dirs=/usr/local/hadoop/yarn/local
spark.hadoop.yarn.nodemanager.log-dirs=/usr/local/hadoop/yarn/log
```

3. 将 Hadoop 配置文件（`core-site.xml` 和 `hdfs-site.xml`） 和 HBase 配置文件（`hbase-site.xml`）复制到 `$SPARK_HOME/conf/` 目录下：

```shell
cp $HADOOP_HOME/etc/hadoop/core-site.xml $SPARK_HOME/conf/
cp $HADOOP_HOME/etc/hadoop/hdfs-site.xml $SPARK_HOME/conf/
cp /usr/local/hbase/conf/hbase-site.xml $SPARK_HOME/conf/
```

# 3. 启动Spark集群

1. 在主节点 `vm-01` 上，运行以下命令启动 Spark Master：

```bash
$SPARK_HOME/sbin/start-master.sh
```

2. 在每个工作节点（`vm-02`, `vm-03`）上，运行以下命令启动 Spark Worker：
```bash
$SPARK_HOME/sbin/start-worker.sh spark://vm-01:7077
```

3. 访问 `http://vm-01:8080/` 默认是 8080 端口。	

> 注意：如果 8080 占用，他会换成其他端口，可以去日志查看一下。

# 4. 提交 Spark 作业

```bash
spark-submit --master yarn --deploy-mode cluster /opt/Spark计算文本里面词汇个数.py
```

> TODO：Python以及JAVA环境存在问题。

