---
title: Hive
order: 3
icon: ant-design:cluster-outlined
---

# Hive

:::info
**Hive** 是构建在 Hadoop 生态之上的**数据仓库工具**，通过 **类 SQL 语法（HiveQL）** 将查询转换为 MapReduce/Spark 分布式任务执行，让用户无需编写底层代码即可操作海量数据。

- 实际数据文件存储在 **HDFS** 上
- 表结构、分区等**元数据**存储在独立关系型数据库（MySQL / PostgreSQL）中

官方文档：[https://cwiki.apache.org/confluence/display/Hive/LanguageManual](https://cwiki.apache.org/confluence/display/Hive/LanguageManual)
:::

## 一、架构原理

### 核心组件

| 组件 | 职责 |
|:---:|:---|
| **Metastore** | 存储元数据（表结构、分区信息、数据位置），默认 Derby，推荐 MySQL |
| **Driver** | 管理查询生命周期（编译 → 优化 → 执行） |
| **Compiler** | 将 HiveQL 转换为 MapReduce 任务的核心模块 |
| **Execution Engine** | 执行分布式任务，默认 MapReduce，可切换 Tez / Spark |

### SQL → MapReduce 转换流程

以 `SELECT department, AVG(salary) FROM employees GROUP BY department` 为例：

```
① 解析 SQL       → 词法/语法分析，生成抽象语法树（AST）
② 语义分析       → 验证表名、列名、数据类型，生成注解语法树
③ 逻辑计划       → 生成逻辑执行计划（扫描 → 聚合 → 分组）
④ 逻辑优化       → 谓词下推 / 列裁剪 / 分区裁剪 / 常量折叠
⑤ 物理计划       → 映射为 MapReduce 阶段
⑥ 执行           → 提交 Jar 到 YARN 集群运行
```

:::tip MapReduce 三阶段示意
**Map**：每个 Mapper 读取数据，提取 `(department, salary)`，计算局部均值和计数  
**Shuffle**：按 `department` 分区排序，确保相同部门数据进入同一 Reducer  
**Reduce**：汇总局部结果，计算全局平均值
:::

### Hive vs 传统数据库

| 特性 | Hive | MySQL 等传统数据库 |
|:---:|:---:|:---:|
| **数据存储** | HDFS 文件，无索引 | B+ 树索引，页存储 |
| **计算模型** | 分布式（MapReduce/Spark） | 单机或主从 |
| **事务支持** | 有限（需手动配置 ACID） | 完整 ACID |
| **延迟** | 分钟～小时级（批处理） | 毫秒～秒级（实时） |
| **适用场景** | 离线分析、大规模聚合 | 高频事务、低延迟查询 |

---

## 二、安装与配置

### 安装 Hive

```shell
# 1. 解压
tar -zxvf apache-hive-3.1.3-bin.tar.gz -C /opt/module/
mv /opt/module/apache-hive-3.1.3-bin /opt/module/hive

# 2. 配置环境变量
sudo vim /etc/profile.d/env.sh
export HIVE_HOME=/opt/module/hive
export PATH=$PATH:$HIVE_HOME/bin
source /etc/profile.d/env.sh

# 3. 初始化元数据库（默认 Derby，仅单客户端，生产建议换 MySQL）
bin/schematool -dbType derby -initSchema

# 4. 查看日志（默认在 /tmp/用户名/hive.log）
tail -f /tmp/$(whoami)/hive.log
```

### 切换为 MySQL 元数据库（推荐）

Derby 的限制：**同一时间只允许一个客户端访问**，多客户端会报 `XSDB6` 错误。生产环境务必切换为 MySQL。

**1. 将 MySQL JDBC 驱动放入 Hive lib 目录**

```shell
cp mysql-connector-j-8.0.31.jar $HIVE_HOME/lib
```

**2. 创建 `hive-site.xml`**

```xml
<!-- $HIVE_HOME/conf/hive-site.xml -->
<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<configuration>
  <!-- MySQL 连接地址 -->
  <property>
    <n>javax.jdo.option.ConnectionURL</n>
    <value>jdbc:mysql://hadoop102:3306/metastore?useSSL=false&amp;characterEncoding=UTF-8</value>
  </property>

  <!-- MySQL 8+ 使用 cj 驱动 -->
  <property>
    <n>javax.jdo.option.ConnectionDriverName</n>
    <value>com.mysql.cj.jdbc.Driver</value>
  </property>

  <property>
    <n>javax.jdo.option.ConnectionUserName</n>
    <value>root</value>
  </property>

  <!-- 生产环境使用环境变量注入，勿硬编码密码 -->
  <property>
    <n>javax.jdo.option.ConnectionPassword</n>
    <value>${HIVE_METASTORE_PASSWORD}</value>
  </property>

  <!-- Hive 数据在 HDFS 的默认路径 -->
  <property>
    <n>hive.metastore.warehouse.dir</n>
    <value>/user/hive/warehouse</value>
  </property>
</configuration>
```

**3. 初始化元数据库**

```shell
# 在 MySQL 中创建库
mysql -uroot -p
mysql> CREATE DATABASE metastore CHARACTER SET utf8;
mysql> quit

# 初始化 Hive 元数据表
bin/schematool -dbType mysql -initSchema -verbose
```

**4. 验证**

```shell
bin/hive
hive> show databases;
hive> create table student(id int, name string);
hive> insert into student values(1, 'zhangsan');
hive> select * from student;
```

### 三种连接方式

**方式一：本地 CLI（仅本机）**

```shell
bin/hive
```

**方式二：Metastore 服务（支持第三方工具连接）**

```xml
<!-- hive-site.xml 添加 -->
<property>
  <n>hive.metastore.uris</n>
  <value>thrift://hadoop102:9083</value>
</property>
```

```shell
# 启动元数据服务
hive --service metastore
# 新窗口连接
bin/hive
```

**方式三：HiveServer2 JDBC（远程访问）**

```xml
<!-- hive-site.xml 添加 -->
<property>
  <n>hive.server2.thrift.bind.host</n>
  <value>hadoop102</value>
</property>
<property>
  <n>hive.server2.thrift.port</n>
  <value>10000</value>
</property>
```

```shell
# 先启动 metastore（HiveServer2 依赖它）
hive --service metastore &

# 启动 HiveServer2
hive --service hiveserver2 &

# beeline 客户端连接
bin/beeline -u jdbc:hive2://hadoop102:10000 -n yourUsername
```

**后台脚本启动**

```bash
nohup hive --service metastore 2>&1 &
nohup hive --service hiveserver2 2>&1 &
```

### 常用配置

```xml
<!-- 显示列名表头 -->
<property>
  <n>hive.cli.print.header</n>
  <value>true</value>
</property>
<!-- 显示当前数据库 -->
<property>
  <n>hive.cli.print.current.db</n>
  <value>true</value>
</property>
```

---

## 三、数据类型

### 基本类型

| 类别 | 类型 | 说明 | 示例 |
|:---:|:---:|:---|:---:|
| 整数 | `TINYINT` / `SMALLINT` / `INT` / `BIGINT` | 1/2/4/8 字节有符号整数 | `100` |
| 浮点 | `FLOAT` / `DOUBLE` / `DECIMAL(p,s)` | 单精度 / 双精度 / 精确小数 | `3.14` |
| 字符串 | `STRING` / `VARCHAR(n)` / `CHAR(n)` | 变长 / 有限变长 / 定长 | `'Hive'` |
| 布尔 | `BOOLEAN` | `TRUE` / `FALSE` | `TRUE` |
| 日期 | `DATE` / `TIMESTAMP` | 日期 / 时间戳 | `'2023-10-01'` |
| 二进制 | `BINARY` | 字节数组 | — |

### 复杂类型

| 类型 | 描述 | 示例 |
|:---:|:---|:---|
| `ARRAY<T>` | 同类型有序集合，下标从 0 开始 | `['Hive', 'Spark']` |
| `MAP<K,V>` | 键值对集合 | `{'age': 25}` |
| `STRUCT<f:T,...>` | 类 JSON 结构体，多字段不同类型 | `struct('Alice', 25)` |

---

## 四、DDL — 数据定义

### 数据库操作

```sql
-- 创建
CREATE DATABASE [IF NOT EXISTS] db_name [COMMENT '注释'] [LOCATION 'hdfs_path'];

-- 查看
SHOW DATABASES [LIKE 'prefix*'];
DESCRIBE DATABASE EXTENDED db_name;

-- 修改
ALTER DATABASE db_name SET DBPROPERTIES (key=value);
ALTER DATABASE db_name SET LOCATION 'new_path';

-- 删除
DROP DATABASE [IF EXISTS] db_name;          -- 只能删空库
DROP DATABASE [IF EXISTS] db_name CASCADE;  -- 强制删除含表的库

-- 切换
USE db_name;
```

### 表操作

:::tip 内部表 vs 外部表
| 特性 | 内部表（Managed） | 外部表（External） |
|:---:|:---:|:---:|
| 数据控制权 | Hive 管理，`DROP` 时**同时删数据** | 仅管理元数据，`DROP` 时**保留数据** |
| 创建语法 | 默认，无需额外关键字 | 必须加 `EXTERNAL` |
| 适用场景 | 临时/中间数据 | 生产核心数据，多引擎共享 |
:::

```sql
-- 建表（完整语法）
CREATE [EXTERNAL] TABLE [IF NOT EXISTS] [db.]table_name (
  col_name data_type [COMMENT '列注释'],
  ...
)
[COMMENT '表注释']
[PARTITIONED BY (part_col data_type, ...)]
[CLUSTERED BY (col) INTO n BUCKETS]
[ROW FORMAT DELIMITED FIELDS TERMINATED BY ',']
[STORED AS ORC]
[LOCATION 'hdfs_path'];

-- 查看
SHOW TABLES [LIKE 'prefix*'];
DESCRIBE FORMATTED table_name;   -- 查看详细信息

-- 修改
ALTER TABLE t RENAME TO new_t;
ALTER TABLE t ADD COLUMNS (new_col STRING);
ALTER TABLE t CHANGE old_col new_col STRING;

-- 删除 / 清空
DROP TABLE [IF EXISTS] table_name;
TRUNCATE TABLE table_name;        -- 仅支持内部表
```

---

## 五、DML — 数据操作

### 数据导入

```sql
-- 从本地文件加载
LOAD DATA LOCAL INPATH '/opt/data/student.txt' INTO TABLE student;

-- 从 HDFS 加载（原文件被移走）
LOAD DATA INPATH '/user/hdfs/student.txt' INTO TABLE student;

-- 从查询结果插入
INSERT INTO TABLE target SELECT col1, col2 FROM source WHERE condition;
INSERT OVERWRITE TABLE target SELECT * FROM source;   -- 覆盖写入

-- 创建表同时加载数据
CREATE TABLE target AS SELECT * FROM source;
```

### 数据导出

```sql
-- 导出到 HDFS
INSERT OVERWRITE DIRECTORY '/user/hive/output/'
ROW FORMAT DELIMITED FIELDS TERMINATED BY ','
SELECT * FROM student;

-- 导出到本地
INSERT OVERWRITE LOCAL DIRECTORY '/tmp/output/'
SELECT * FROM student;

-- 通过 Shell 导出
hive -e 'SELECT * FROM default.student;' > /opt/output.txt

-- EXPORT / IMPORT（跨集群迁移）
EXPORT TABLE student TO '/user/hive/export/student';
IMPORT TABLE student_new FROM '/user/hive/export/student';
```

### 分区操作

```sql
-- 静态分区插入
INSERT OVERWRITE TABLE logs PARTITION (dt='20231001')
SELECT user_id, event FROM source WHERE dt='20231001';

-- 动态分区（分区列放查询列最后）
SET hive.exec.dynamic.partition.mode=nonstrict;
INSERT OVERWRITE TABLE logs PARTITION (dt)
SELECT user_id, event, order_date AS dt FROM raw_orders;

-- 刷新分区（直接上传文件到 HDFS 后执行）
MSCK REPAIR TABLE logs;
-- 或手动添加
ALTER TABLE logs ADD PARTITION (dt='20231001');
```

---

## 六、查询语法

```sql
SELECT [ALL | DISTINCT] col1, col2, ...
FROM table
[WHERE condition]
[GROUP BY col_list]
[HAVING condition]
[ORDER BY col_list]         -- 全局排序，单 Reduce，性能低
[SORT BY col_list]          -- 每个 Reduce 内部排序，并行处理
[DISTRIBUTE BY col_list]    -- 控制数据分发到哪个 Reduce
[LIMIT n]
```

| 排序关键字 | 排序范围 | 性能 | 适用场景 |
|:---:|:---:|:---:|:---:|
| `ORDER BY` | 全局有序 | 低（单 Reduce） | 最终结果需严格排序 |
| `SORT BY` | Reduce 内有序 | 高（并行） | 中间结果排序 |
| `DISTRIBUTE BY` | 控制分发，不排序 | 高 | 配合 SORT BY 使用 |
| `CLUSTER BY` | 分发 + 同字段排序 | 中 | 等价于 DISTRIBUTE BY + SORT BY |

---

## 七、分区 & 分桶

### 分区（Partitioning）

按列值将数据划分为不同子目录，查询时自动跳过无关分区，**减少数据扫描量**。

```sql
-- 按日期分区
CREATE TABLE logs (user_id STRING, event STRING)
PARTITIONED BY (dt STRING)
STORED AS ORC;

-- 存储路径：/warehouse/logs/dt=2023-10-01/data.orc
```

### 分桶（Bucketing）

按列的哈希值将数据均匀分配到固定数量的桶（文件），**优化 JOIN 和采样性能**。

```sql
-- 按 user_id 分为 4 个桶
CREATE TABLE users (user_id STRING, name STRING)
CLUSTERED BY (user_id) INTO 4 BUCKETS
STORED AS ORC;

-- 采样查询
SELECT * FROM users TABLESAMPLE (BUCKET 1 OUT OF 4 ON user_id);
```

:::tip 分区 vs 分桶
- **分区**：用于低基数列（日期、地区），物理划分目录，适合大范围过滤
- **分桶**：用于高基数列（user_id、order_id），均匀分布文件，适合 JOIN 和聚合
- **实际场景**：先分区（按日期）再分桶（按 user_id），结合两者优势
:::

---

## 八、常用内置函数

```sql
-- 查看所有函数
SHOW FUNCTIONS;
DESC FUNCTION EXTENDED function_name;

-- 空值处理
SELECT nvl(comm, 0) FROM emp;           -- 空则替换为 0

-- 条件判断
SELECT CASE WHEN sal > 5000 THEN '高' ELSE '低' END FROM emp;
SELECT IF(sal > 5000, '高', '低') FROM emp;

-- 展开数组/Map（UDTF）
SELECT user_id, key, value
FROM user_profiles
LATERAL VIEW explode(profile) tmp AS key, value;
```

---

## 九、使用技巧

```shell
# 不进入交互窗口直接执行 HQL
bin/hive -e "SELECT id FROM student;"

# 执行 SQL 文件
bin/hive -f /opt/scripts/init.sql

# 在 Hive CLI 中操作 HDFS
hive> dfs -ls /;

# 查看历史命令
cat ~/.hivehistory
```
