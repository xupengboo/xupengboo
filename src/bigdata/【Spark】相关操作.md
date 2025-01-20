---
title: Spark 相关操作
order: 3
---

## 一、配置 Python 环境

配置 Python3 环境依赖：

```bash
yum install -y git gcc zlib-devel bzip2 bzip2-devel readline-devel sqlite sqlite-devel openssl-devel xz xz-devel libffi-devel
```

安装 `pyenv` 工具：

```shell
# pyenv 工具：方便Python的多个版本切换。
git clone https://github.com/pyenv/pyenv.git ~/.pyenv
```

配置 环境变量：

```bash
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(pyenv init -)"' >> ~/.bashrc

source ~/.bashrc
```

安装 python 指定版本

```bash
pyenv install 3.7.7

# 1. 安装可能会比较慢，这边推荐一个快一点的方法
# 先在浏览器把python-3.7.7的包下载下来
# https://www.python.org/ftp/python/3.7.7/Python-3.7.7.tar.xz
# 2. 然后把压缩包上传到 
mkdir /root/.pyenv/cache/
mv Python-3.7.7.tar.xz /root/.pyenv/cache/
# 3. 因为pyenv install 3.7.7会先查看cache中是否存在，有就直接安装，不用再去拉取
# 再次安装就行
pyenv install 3.7.7
# 4.选择python3.7.7
pyenv global 3.7.7
# 5. 检查 python版本呢
python --version
```

## 二、pyspark 编程

启动 `pyspark` ：

```bash
pyspark
```

![image-20241217155535815](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241217155535815.png)

例如：读取文件 操作。

```python
# 读取文件（本地）
textFile = spark.read.text("file:///root/spark-shell-test/word.txt")
# 计数
textFile.count()
# 获取第一行
textFile.first()

# 读取文件（hdfs）
>>> textFile = spark.read.text("hdfs://vm-01:9000/user/spark/input/input.txt")
>>> textFile.count()
12
>>> textFile.first()
Row(value='hello world hadoop spark ')
```

> 官方：https://spark.apache.org/docs/3.4.3/quick-start.html ， 多看官方 Scala 和 Python 使用。

## 三、Spark-Shell 工具

`spark-shell` 是运用 `Scala` 语言，可通过 `spark-shell` 命令直接启动。

```scala
# 读取文件
scala> var textFile = spark.read.text("hdfs://vm-01:9000/user/spark/input/input.txt")
textFile: org.apache.spark.sql.DataFrame = [value: string]

scala> textFile.count()
res0: Long = 12

scala> textFile.first()
res1: org.apache.spark.sql.Row = [hello world hadoop spark ]
```

> 注意：`spark-shell` 主要用于测试，不建议直接在生产环境中使用 `spark-shell` 。

## 四、IDE 和 构建工具

在生产环境中，通常会使用 **IDE（如 IntelliJ IDEA 或 Visual Studio Code）和构建工具（如 Maven 或 SBT）来开发和管理 Spark 项目**。

本机电脑上，要有对应的环境安装：

```bash
java：1.8，11
scala：2.12.19
python：3.10
```

主要通过三种方式来管理 Spark 项目：Java 项目、Scala 项目、Python 项目。



### 1. Java 项目

1. 创建一个 Maven 项目，通过 `maven-archetype-quickstart` 骨架：

![image-20241217164340421](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241217164340421.png)

```shell
# 也可以直接用命令：
mvn archetype:generate -DgroupId=com.spark -DartifactId=spark-test-java -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
```

2. 添加 Spark 依赖：（注意：对应的 Spark 版本）

```xml
<dependency>
    <groupId>org.apache.spark</groupId>
    <artifactId>spark-core_2.12</artifactId>
    <version>3.5.3</version>
</dependency>
```

3. 构建 测试类 SparkTestExample ：

```java
package com.spark;

import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;

import java.util.Arrays;
import java.util.List;

/**
 * @Author xupengboo
 * @Date 2024/12/17 16:49
 * @Describe
 */
public class SparkTestExample {

    public static void main(String[] args) {
        // 创建SparkConf配置对象
        SparkConf conf = new SparkConf().setAppName("SparkBasicExample").setMaster("local[*]");
        // 创建JavaSparkContext
        JavaSparkContext sc = new JavaSparkContext(conf);
        // 创建一个简单的JavaRDD
        JavaRDD<Integer> rdd = sc.parallelize(Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10));
        // 应用map转换操作
        JavaRDD<Integer> squares = rdd.map(num -> num * num);
        // 应用filter转换操作
        JavaRDD<Integer> evenSquares = squares.filter(num -> num % 2 == 0);
        // 执行行动操作collect，收集结果到驱动程序
        List<Integer> evenSquaresCollected = evenSquares.collect();
        // 打印结果
        evenSquaresCollected.forEach(System.out::println);
        // 关闭SparkSession
        sc.stop();
    }

}
```

4. 将该项目打包，并且将该 jar包 ，移到对应 Spark集群环境，提交作业：

```shell
# 提交作业
## local[2]：表示使用 本地模式（即单机模式）运行 Spark 作业，[2] 指定使用的 CPU 核心数。
spark-submit --class com.spark.SparkTestExample --master local[2] spark-test-java-1.0-SNAPSHOT.jar

## spark://vm-01:7077：集群模式。
spark-submit --class com.spark.SparkTestExample --master spark://vm-01:7077 spark-test-java-1.0-SNAPSHOT.jar
```

![image-20241217170517082](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241217170517082.png)

5. 查看结果，测试完成。



### 2. Python 项目

1. 创建项目，安装 `pyspark` 库。

```bash
 pip install pyspark -i https://pypi.tuna.tsinghua.edu.cn/simple # 清华镜像
 # -i： 自定义的 Python 包镜像源。
```

案例 `SparkTestPy.py` 如下：

```python
from pyspark import SparkConf, SparkContext

def main():
	# 创建SparkConf配置对象
	conf = SparkConf().setAppName("App").setMaster("local[*]")
	# 创建sparkContext
	sc = SparkContext(conf=conf)
	#创建一个简单的RDD
	rdd = sc.parallelize(range(1,11))
	#应用map转换操作
	squares = rdd.map(lambda num:num * num)
	#应用filter转换操作
	even_squares =squares.filter(lambda num: num % 2 ==0)
	#执行行动操作collect，收集结果到驱动程序
	even_squares_collected=even_squares.collect()
	#打印结果
	for num in even_squares_collected:
		print(num)
	# 定制SparkContext
	sc.stop()

if __name__ == "__main__":
	main()
```

`Python` 不支持本地运行，写好后上传到集群中执行即可。

提交作业：

```bash
# local[8]：本地模式，8个CPU核心。
# deploy-mode：指定作业部署模式，对于Python应用程序，通常使用 cluster 模式。
spark-submit --master yarn --deploy-mode cluster /opt/SparkTestPy.py
```



## 3. Scala 项目

> 借鉴于：[Spark实操学习](https://blog.csdn.net/m0_70405779/article/details/141532710?ops_request_misc=&request_id=&biz_id=102&utm_term=%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8Spark%E5%91%A2%EF%BC%9F&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduweb~default-0-141532710.nonecase&spm=1018.2226.3001.4187)

