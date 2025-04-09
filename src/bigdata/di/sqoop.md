---
title: Sqoop 工具
date: 2025-04-07 10:00:00
tags:
- 大数据
- Sqoop
categories:
- 大数据
order: 2
icon: mdi:tools
---

:::info

Sqoop（**SQL-to-Hadoop**） 是 Apache 开源的工具，专门用于在 Hadoop 生态系统（如 HDFS、Hive、HBase） 和 关系型数据库（如 MySQL、Oracle） 之间高效传输批量数据。**专注于关系型数据库 ↔ Hadoop** 。

Apache Sqoop 项目已于 2021 年 6 月停止维护，并被移至 Apache Attic。这意味着官方不再对 Sqoop 进行更新或提供支持。Apache Attic 是 Apache 软件基金会（ASF）设立的一个存储库，专门用于存放那些已停止活跃开发或维护的项目。

官方地址：[https://sqoop.apache.org/](https://sqoop.apache.org/)

下载地址：[https://archive.apache.org/dist/sqoop/](https://archive.apache.org/dist/sqoop/)

:::

## 一、安装 Hadoop 客户端

由于 Sqoop 独立安装到一台服务上面，所以需要在独立服务器上安装 Hadoop 的客户端。

1. 配置 `/etc/hosts` 文件。

```shell
192.168.10.68 vm-01
192.168.10.69 vm-02
192.168.10.70 vm-03
```

2. 下载以及安装 Hadoop 客户端。（按照之前 Hadoop 集群安装 章节部署的集群操作）。

```shell
cd /opt
# 选择合适的hadoop版本，要与Hadoop集群匹配
wget https://downloads.apache.org/hadoop/common/hadoop-3.2.4/hadoop-3.2.4.tar.gz
# 解压
tar -xzvf hadoop-3.2.4.tar.gz
# /usr/local通常被用作本地软件安装目录。
mv hadoop-3.2.4 /usr/local/hadoop
```

3. 配置相关文件：

- `core-site.xml` ：

```xml
<configuration>
    <property>
        <name>fs.defaultFS</name>
        <value>hdfs://vm-01:9000</value> <!-- 这里是主节点的 IP 地址， 此处为 vm-01 的 IP 地址 -->
    </property>
</configuration>
```

- `hdfs-site.xml`：

```xml
<configuration>
  <property>
    <name>dfs.nameservices</name>
    <value>mycluster</value>
  </property>
  <property>
    <name>dfs.ha.namenodes.mycluster</name>
    <value>nn1</value>
  </property>
  <property>
    <name>dfs.namenode.rpc-address.mycluster.nn1</name>
    <value>vm-01:8020</value>
  </property>
</configuration>
```

- `yarn-site.xml`：

```xml
<configuration>
<!-- Site specific YARN configuration properties -->
    <!-- YARN ResourceManager 地址 -->
    <property>
        <name>yarn.resourcemanager.address</name>
        <value>vm-01:8032</value>
    </property>
</configuration>
```

- `mapred-site.xml` ：

```xml
<configuration>
  <property>
    <name>mapreduce.framework.name</name>
    <value>yarn</value> <!-- 使用 YARN 作为 MapReduce 框架 -->
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

4. 执行命令校验：

```shell
hadoop fs -ls /  # 应返回远程 HDFS 根目录列表

# 注意：我们并不是要创建一个hadoop子节点，仅仅是个客户端，所以不用启动hadoop的start相关脚本，可通过jps查看。
```

## 二、Sqoop 部署

:::tip
注意：**选择 Sqoop 的版本需要与所使用的 Hadoop 版本相匹配**，以确保两者的兼容性和稳定性。不同版本的 Sqoop 依赖于特定版本的 Hadoop，因此在部署时需要注意两者的对应关系。
:::

此处，已有的 hadoop 3.2.4，这是使用更稳定的版本： Sqoop 1.4.7。

1. 下载 Sqoop 二进制包

```shell
curl -O -L https://archive.apache.org/dist/sqoop/1.4.7/sqoop-1.4.7.bin__hadoop-2.6.0.tar.gz
mv sqoop-1.4.7.bin__hadoop-2.6.0.tar.gz /opt
cd /opt 
tar -zxvf sqoop-1.4.7.bin__hadoop-2.6.0.tar.gz
mv sqoop-1.4.7.bin__hadoop-2.6.0 sqoop

vi /etc/profile
export SQOOP_HOME=/opt/sqoop
export PATH=$PATH:$SQOOP_HOME/bin
```

2. 配置 Sqoop 

```shell
# 复制模板配置文件
cp $SQOOP_HOME/conf/sqoop-env-template.sh $SQOOP_HOME/conf/sqoop-env.sh
# 编辑 sqoop-env.sh，设置 Hadoop 路径
vi sqoop-env.sh
# 配置hadoop公共库和mapreduce的库目录
export HADOOP_COMMON_HOME=/usr/local/hadoop
export HADOOP_MAPRED_HOME=/usr/local/hadoop
```

3. 下载驱动（不同的数据库，要给Sqoop不同的依赖驱动包）

```shell
cd $SQOOP_HOME/lib/
wget https://jdbc.postgresql.org/download/postgresql-42.7.3.jar
```

4. 基本导入命令，例如：将 PostgreSQL 表中的数据导入到 HDFS 的指定目录

```shell
# 测试检查读取表格数据
sqoop eval \
  --driver org.postgresql.Driver \
  --connect jdbc:postgresql://192.168.10.66:5432/postgres \
  --username "root" \
  --password "0818" \
  --query "SELECT * FROM table_name2 LIMIT 1"
  
  
# 强制指定 HDFS 操作用户身份
export HADOOP_USER_NAME=hadoop

sqoop import \
  --verbose \
  --driver org.postgresql.Driver \
  --connect jdbc:postgresql://192.168.10.66:5432/postgres \
  --username "root" \
  --password "0818" \
  --table "table_name2" \
  --target-dir /user/sqoop \
  --delete-target-dir \
  -m 1
```

:::tip java.lang.NoClassDefFoundError: org/apache/commons/lang/StringUtils 异常修复

```shell
# 抛出：Exception in thread "main" java.lang.NoClassDefFoundError: org/apache/commons/lang/StringUtils 异常
# 解决办法：添加 commons-lang-2.6 版本，3版本不支持。
cd $SQOOP_HOME/lib
wget https://repo1.maven.org/maven2/commons-lang/commons-lang/2.6/commons-lang-2.6.jar
```

:::

成功页面 如下：

![image-20250409135801481](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250409135801481.png)

5. 下载 hadoop 中的文件，查看数据：

```shell
# 将导入成功的数据下载下来
$ hdfs dfs -get /user/sqoop /opt/temp/
$ ls
data.csv  sqoop
$ cat part-m-00000 # 数据内容
1,1,1,1,1
1,2,3,4,5
1,1,1,1,1
1,2,3,4,5
1,1,1,1,1
1,2,3,4,5
1,1,1,1,1
1,2,3,4,5
```

## 三、Sqoop 整体流程

1. **生成代码**：Sqoop 根据目标数据库表的结构，生成相应的 Java 类，用于序列化和反序列化数据。

2. **编译和打包**：生成的 Java 类会被编译并打包成一个可执行的 JAR 文件。

3. **提交作业**：Sqoop 将该 JAR 文件作为一个 MapReduce 作业提交给 YARN。

4. **任务执行**：YARN 根据集群的资源情况，分配资源并启动 MapReduce 作业的各个任务（Mapper）。每个 Mapper 通过 JDBC 从 MySQL 中读取数据，并将数据写入 HDFS。








