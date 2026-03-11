---
title: Spark
order: 5
icon: mdi:lightning-bolt
---

# Spark

:::info
**Apache Spark** 是一个开源的大规模数据处理引擎，以**内存计算**为核心，比 Hadoop MapReduce 快数十倍，同时支持批处理、流处理、SQL、机器学习等多种场景。

官方文档：[https://spark.apache.org/](https://spark.apache.org/)
:::

---

## 一、集群搭建

### 环境准备

```shell
# 检查 Java（需要 1.8+）
java -version

# 检查 Scala（Spark 依赖 Scala）
scala -version
```

版本对应关系：**Spark、Hadoop、HBase、Scala 之间存在版本兼容性要求**，务必提前查阅对应版本矩阵。

本文使用：`spark-3.5.3-bin-hadoop3`

### 安装 Spark

```shell
wget https://dlcdn.apache.org/spark/spark-3.5.3/spark-3.5.3-bin-hadoop3.tgz
tar -zxvf spark-3.5.3-bin-hadoop3.tgz
sudo mv spark-3.5.3-bin-hadoop3 /usr/local/spark
```

### 配置环境变量

```shell
vi ~/.bashrc
# 追加：
export SPARK_HOME=/usr/local/spark
export SPARK_MASTER_HOST=vm-01      # 主节点地址
export PATH=$SPARK_HOME/bin:$PATH

source ~/.bashrc
```

### 配置 spark-env.sh

```shell
cp $SPARK_HOME/conf/spark-env.sh.template $SPARK_HOME/conf/spark-env.sh
vi $SPARK_HOME/conf/spark-env.sh

export SPARK_MASTER_HOST=vm-01
export SPARK_LOCAL_DIRS=/usr/local/spark/local
export SPARK_WORKER_DIR=/usr/local/spark/worker
export HADOOP_CONF_DIR=/usr/local/hadoop/etc/hadoop
```

### 配置 spark-defaults.conf

```shell
cp $SPARK_HOME/conf/spark-defaults.conf.template $SPARK_HOME/conf/spark-defaults.conf
```

```properties
# HDFS 地址
spark.hadoop.fs.defaultFS=hdfs://vm-01:9000

# YARN ResourceManager 配置
spark.hadoop.yarn.resourcemanager.address=vm-01:8032
spark.hadoop.yarn.resourcemanager.scheduler.address=vm-01:8030
spark.hadoop.yarn.resourcemanager.resource-tracker.address=vm-01:8031
```

### 同步 Hadoop / HBase 配置

```shell
cp $HADOOP_HOME/etc/hadoop/core-site.xml $SPARK_HOME/conf/
cp $HADOOP_HOME/etc/hadoop/hdfs-site.xml $SPARK_HOME/conf/
cp /usr/local/hbase/conf/hbase-site.xml $SPARK_HOME/conf/
```

### 启动集群

```shell
# 主节点启动 Master
$SPARK_HOME/sbin/start-master.sh

# 工作节点启动 Worker
$SPARK_HOME/sbin/start-worker.sh spark://vm-01:7077

# Web UI（默认 8080，被占用会自动换端口，检查日志确认）
# http://vm-01:8080
```

---

## 二、交互式使用

### PySpark

```shell
# 启动 PySpark 交互式 Shell
pyspark
```

```python
# 读取本地文件
textFile = spark.read.text("file:///root/data/word.txt")
textFile.count()
textFile.first()

# 读取 HDFS 文件
textFile = spark.read.text("hdfs://vm-01:9000/user/spark/input/input.txt")
textFile.count()   # 12
textFile.first()   # Row(value='hello world hadoop spark ')
```

### Spark Shell（Scala）

```shell
spark-shell
```

```scala
val textFile = spark.read.text("hdfs://vm-01:9000/user/spark/input/input.txt")
textFile.count()   // 12
textFile.first()   // [hello world hadoop spark ]
```

> `spark-shell` 主要用于调试和测试，不建议在生产环境直接使用。

---

## 三、项目开发

生产环境通常使用 IDE（IntelliJ IDEA）和构建工具（Maven / SBT）开发 Spark 项目，再打包提交到集群。

本机开发环境要求：

| 工具 | 版本 |
|:---:|:---:|
| Java | 1.8 或 11 |
| Scala | 2.12.x |
| Python | 3.x |

### Java 项目

**1. 添加 Maven 依赖**

```xml
<dependency>
  <groupId>org.apache.spark</groupId>
  <artifactId>spark-core_2.12</artifactId>
  <version>3.5.3</version>
</dependency>
```

**2. 编写 Spark 程序**

```java
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import java.util.Arrays;
import java.util.List;

public class SparkExample {
  public static void main(String[] args) {
    SparkConf conf = new SparkConf()
        .setAppName("SparkExample")
        .setMaster("local[*]");     // 本地调试用 local，提交集群时去掉这行
    JavaSparkContext sc = new JavaSparkContext(conf);

    JavaRDD<Integer> rdd = sc.parallelize(Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10));
    List<Integer> result = rdd.map(n -> n * n)
                              .filter(n -> n % 2 == 0)
                              .collect();
    result.forEach(System.out::println);

    sc.stop();
  }
}
```

**3. 打包并提交**

```shell
# 本地模式（测试）
spark-submit --class com.spark.SparkExample --master local[2] app.jar

# 集群模式（YARN）
spark-submit --class com.spark.SparkExample --master yarn \
  --deploy-mode cluster app.jar
```

### Python 项目

```shell
# 安装 pyspark
pip install pyspark -i https://pypi.tuna.tsinghua.edu.cn/simple
```

```python
from pyspark import SparkConf, SparkContext

conf = SparkConf().setAppName("PythonSpark").setMaster("local[*]")
sc = SparkContext(conf=conf)

rdd = sc.parallelize(range(1, 11))
result = rdd.map(lambda n: n * n).filter(lambda n: n % 2 == 0).collect()
for n in result:
    print(n)

sc.stop()
```

```shell
# 提交到 YARN 集群
spark-submit --master yarn --deploy-mode cluster /opt/spark_job.py
```

---

## 四、配置 Python 环境（集群节点）

集群节点需要统一的 Python 环境，推荐使用 `pyenv` 管理多版本。

```shell
# 安装依赖
yum install -y git gcc zlib-devel bzip2-devel readline-devel \
  sqlite-devel openssl-devel xz-devel libffi-devel

# 安装 pyenv
git clone https://github.com/pyenv/pyenv.git ~/.pyenv

# 配置环境变量
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(pyenv init -)"' >> ~/.bashrc
source ~/.bashrc

# 安装指定 Python 版本
pyenv install 3.7.7
pyenv global 3.7.7
python --version
```

:::tip 加速下载
官方源下载 Python 源码很慢，可手动下载压缩包放入 `~/.pyenv/cache/` 目录，pyenv 会自动识别跳过下载直接安装。
:::
