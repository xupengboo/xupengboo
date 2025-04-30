---
title: Hive 基础使用
order: 3
icon: ant-design:cluster-outlined
date: 2025-04-14 10:00:00
tags:
  - 大数据
  - Hive
categories:
  - 大数据
---

:::info

Apache Hive 查询语法：[https://cwiki.apache.org/confluence/display/Hive/LanguageManual+Select](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+Select)

:::

## 一、Hive 数据类型

基本数据类型：

|      类别      |   类型名称   |                             描述                             |              示例              |
| :------------: | :----------: | :----------------------------------------------------------: | :----------------------------: |
|  **整数类型**  |  `TINYINT`   |             1 字节有符号整数（范围：-128 ~ 127）             |              `10`              |
|                |  `SMALLINT`  |          2 字节有符号整数（范围：-32,768 ~ 32,767）          |             `1000`             |
|                |    `INT`     |           4 字节有符号整数（范围：-2^31 ~ 2^31-1）           |            `100000`            |
|                |   `BIGINT`   |           8 字节有符号整数（范围：-2^63 ~ 2^63-1）           |         `10000000000`          |
|   **浮点型**   |   `FLOAT`    |                    单精度浮点数（4 字节）                    |            `3.14F`             |
|                |   `DOUBLE`   |                    双精度浮点数（8 字节）                    |         `3.1415926535`         |
|                |  `DECIMAL`   |       精确小数（需指定精度和标度，如 `DECIMAL(10,2)`）       |           `12345.67`           |
|  **字符串型**  |   `STRING`   |               可变长度字符串（无最大长度限制）               |         `"Hello Hive"`         |
|                | `VARCHAR(n)` |        可变长度字符串（最大长度 `n`，1 ≤ n ≤ 65535）         |            `'Hive'`            |
|                |  `CHAR(n)`   |     固定长度字符串（长度 `n`，不足补空格，1 ≤ n ≤ 255）      |            `'SQL '`            |
|  **二进制型**  |   `BINARY`   |                字节数组（存储原始二进制数据）                |          `0x1234ABCD`          |
|   **布尔型**   |  `BOOLEAN`   |                   布尔值（`TRUE`/`FALSE`）                   |             `TRUE`             |
| **日期时间型** |    `DATE`    |                  日期（格式：`YYYY-MM-DD`）                  |         `'2023-10-01'`         |
|                | `TIMESTAMP`  | 时间戳（含日期和时间，格式：`YYYY-MM-DD HH:MM:SS.fffffffff`） |    `'2023-10-01 14:30:00'`     |
|                |  `INTERVAL`  |              时间间隔（如 `INTERVAL '1' DAY`）               | `INTERVAL '1-6' YEAR TO MONTH` |

复杂数据类型（集合数据类型）：

|   类型名称    |                          描述                          |                             示例                             |
| :-----------: | :----------------------------------------------------: | :----------------------------------------------------------: |
|   **ARRAY**   |    同类型元素的有序集合，通过索引访问（从 0 开始）     |        `ARRAY<STRING>`: `['Hive', 'Spark', 'Flink']`         |
|    **MAP**    |     键值对集合（键必须为基本类型，值可为任意类型）     |        `MAP<STRING, INT>`: `{'age': 25, 'score': 90}`        |
|  **STRUCT**   | 类似 JSON 的结构体，包含多个命名字段（字段类型可不同） | `STRUCT<name:STRING, age:INT>`: `named_struct('name', 'Alice', 'age', 25)` |
| **UNIONTYPE** |    存储多个可能类型中的一个（需显式声明支持的类型）    | `UNIONTYPE<INT, STRING>`: `create_union(0, 100)` 或 `create_union(1, 'Hive')` |

例如：

1. 创建对应表格：

```sql
-- 某个表格下面的内容，如下：
songsong,bingbing_lili,xiao song:18_xiaoxiao song:19,hui long guan_beijing
yangyang,caicai_susu,xiao yang:18_xiaoxiao yang:19,chao yang_beijing

-- 对应的建立表格语句，如下：
create table test2(
    name string,
    friends array<string>,
    children map<string, int>,
    address struct<street:string, city:string>
) 
row format delimited
fields terminated by ','
collection items terminated by '_'
map keys terminated by ':'
lines terminated by '\n';
```

2. 编译一个 test 文件，上传到 hadoop 对应的 Hive 元数据文件下。

```bash
# 1. 编译一个test文件，上传到hadoop
vi test.txt
songsong,bingbing_lili,xiao song:18_xiaoxiao song:19,hui long guan_beijing
yangyang,caicai_susu,xiao yang:18_xiaoxiao yang:19,chao yang_beijing

hadoop fs -put test.txt /user/hive/warehouse/test2
```

3. 进入 Hive 查看。

```sql
hive (default)> select * from test2;
OK
test2.name      test2.friends   test2.children  test2.address
songsong        ["bingbing","lili"]     {"xiao song":18,"xiaoxiao song":19}     {"street":"hui long guan","city":"beijing"}
yangyang        ["caicai","susu"]       {"xiao yang":18,"xiaoxiao yang":19}     {"street":"chao yang","city":"beijing"}
Time taken: 0.186 seconds, Fetched: 2 row(s)
hive (default)> 
```

## 二、DDL（Data Definition Language，数据定义语言）

### 1. 数据库 操作

1. 创建数据库：

```sql
CREATE DATABASE [IF NOT EXISTS] database_name
[COMMENT database_comment]
[LOCATION hdfs_path]
[WITH DBPROPERTIES (property_name=property_value, ...)];
```

2. 查询数据库：

```sql
-- 查看所有库
SHOW DATABASES [LIKE 'identifier_with_wildcards'];
-- 例如：
show databases like 'db_hive*';

-- 查看数据库信息
DESCRIBE DATABASE [EXTENDED] db_name;
-- 例如：
desc database db_hive3;
desc database extended db_hive3;
```

3. 修改数据库

```sql
--修改dbproperties
ALTER DATABASE database_name SET DBPROPERTIES (property_name=property_value, ...);

--修改location
ALTER DATABASE database_name SET LOCATION hdfs_path;

--修改owner user
ALTER DATABASE database_name SET OWNER USER user_name;
```

4. 删除数据库

```sql
-- 删除空数据库
drop database db_hive2;

-- 删除非空数据库
drop database db_hive3 cascade;
```

5. 切换数据库

```sql
USE database_name;
```

### 2. 表 操作

:::tip

在 Hive 中，**外部表（External Table）**和**内部表（Internal Table，也称管理表/Managed Table）**是两种关键的数据管理方式，核心区别在于 **数据生命周期控制权**。

|        **特性**        |                 **内部表（Managed Table）**                  |             **外部表（External Table）**             |
| :--------------------: | :----------------------------------------------------------: | :--------------------------------------------------: |
|     **数据控制权**     |      Hive 管理数据和元数据，删除表时**同时删除数据**。       |      Hive 仅管理元数据，删除表时**保留数据**。       |
|      **创建语法**      |              默认行为，无需 `EXTERNAL` 关键字。              |           必须显式指定 `EXTERNAL` 关键字。           |
|      **存储路径**      | 默认存储在 Hive 仓库目录（`hive.metastore.warehouse.dir`）。 | 需通过 `LOCATION` 指定自定义路径（通常为共享路径）。 |
|      **适用场景**      |                临时数据、中间结果、测试环境。                | 生产环境核心数据，需多引擎（如 Spark、Impala）共享。 |
|    **数据删除风险**    |               高（`DROP TABLE` 会删除数据）。                |     低（`DROP TABLE` 仅删除元数据，数据保留）。      |
| **元数据与数据一致性** |                       Hive 自动维护。                        | 需手动同步（如通过 `MSCK REPAIR TABLE` 刷新分区）。  |

:::



1. 建立表格语句：

```sql
CREATE [EXTERNAL] TABLE [IF NOT EXISTS] [db_name.]table_name 
(
  column_name data_type [COMMENT '列注释'],
  ...
)
[COMMENT '表注释']
[PARTITIONED BY (partition_column data_type [COMMENT '分区列注释'], ...)]  -- 分区
[CLUSTERED BY (column_name, ...) [SORTED BY (column_name [ASC|DESC], ...)] INTO num_buckets BUCKETS]  -- 分桶
[ROW FORMAT row_format]  -- 指定行格式（字段、集合、映射分隔符）
[STORED AS file_format]  -- 指定存储格式（如 TEXTFILE, ORC 等）
[LOCATION 'hdfs_path']    -- 指定数据存储路径（外部表必选）
[TBLPROPERTIES (property_name=property_value, ...)]  -- 表属性（如事务表配置）
```

2. 查看表：

```sql
-- 1. 展示所有表
SHOW TABLES [IN database_name] LIKE ['identifier_with_wildcards'];
hive> show tables like 'stu*';

-- 2. 查看表信息
DESCRIBE [EXTENDED | FORMATTED] [db_name.]table_name
desc stu; -- 查看基本信息
desc formatted stu; -- 查看更多信息
```

3. 修改表：

```sql
-- 重命名表
ALTER TABLE table_name RENAME TO new_table_name

-- 修改列信息
ALTER TABLE table_name ADD COLUMNS (col_name data_type [COMMENT col_comment], ...) -- 增加列
ALTER TABLE table_name CHANGE [COLUMN] col_old_name col_new_name column_type [COMMENT col_comment] [FIRST|AFTER column_name] -- 更新列
ALTER TABLE table_name REPLACE COLUMNS (col_name data_type [COMMENT col_comment], ...) -- 替换列
```

4. 删除表：

```sql
DROP TABLE [IF EXISTS] table_name;
hive (default)> drop table stu;
```

5. 清空表：

```sql
TRUNCATE [TABLE] table_name -- 注意：truncate只能清空管理表，不能删除外部表中数据。
```

## 三、DML（Data Manipulation Language，数据操作语言）

### 1. 数据导入

1. Load 语句，可将文件导入到 Hive 表中：

```sql
hive> 
LOAD DATA [LOCAL] INPATH 'filepath' [OVERWRITE] INTO TABLE tablename [PARTITION (partcol1=val1, partcol2=val2 ...)];

-- 加载本地文件到 hive
load data local inpath '/opt/module/datas/student.txt' into table student;

-- 加载 HDFS 文件到 hive 中
load data inpath '/user/atguigu/student.txt' into table student;
```

2. 基本模式插入：

```sql
INSERT (INTO | OVERWRITE) TABLE tablename [PARTITION (partcol1[=val1], partcol2[=val2] ...)] VALUES values_row [, values_row ...]

-- insert into：以追加数据的方式插入到表或分区，原有数据不会删除。
-- insert overwrite：会覆盖表中已存在的数据。

hive (default)> insert into table  student1 values(1,'wangwu'),(2,'zhaoliu');
```

3. 将查询结果写入目标路径：

- 全量插入：

```sql
-- 覆盖写入（清空目标表数据后插入）
INSERT OVERWRITE TABLE target_table 
SELECT col1, col2, ... 
FROM source_table 
WHERE condition;

-- 追加写入（保留目标表原有数据）
INSERT INTO TABLE target_table 
SELECT col1, col2, ... 
FROM source_table 
WHERE condition;
```

- 分区插入：

```sql
-- 静态分区（明确指定分区值）
INSERT OVERWRITE TABLE target_table PARTITION (dt='20231001') 
SELECT col1, col2, ... 
FROM source_table 
WHERE dt='20231001';

-- 动态分区（根据查询结果自动分配分区）
SET hive.exec.dynamic.partition.mode=nonstrict;  -- 允许动态分区
INSERT OVERWRITE TABLE target_table PARTITION (dt) 
SELECT col1, col2, ..., dt 
FROM source_table;
```

- 多表查询插入：

```sql
-- 多表 JOIN 插入
INSERT OVERWRITE TABLE target_table 
SELECT 
  a.id, 
  a.name, 
  b.order_count 
FROM users a 
JOIN orders b 
ON a.id = b.user_id 
WHERE a.city = 'Beijing';

-- UNION ALL 合并多表插入
INSERT INTO TABLE target_table 
SELECT * FROM table1 
UNION ALL 
SELECT * FROM table2;

-- 子查询插入
INSERT OVERWRITE TABLE target_table 
SELECT 
  t1.col1, 
  t2.col2 
FROM 
  (SELECT col1 FROM source_table1 WHERE dt='20231001') t1 
JOIN 
  (SELECT col2 FROM source_table2 WHERE status=1) t2 
ON t1.key = t2.key;
```

4. 创建表格并加载数据 `as select` ：

```sql
CREATE TABLE target_table 
AS 
SELECT a.*, b.extra_field 
FROM table_a a 
LEFT JOIN table_b b 
ON a.id = b.id;
```

5. Import 导入数据：【见】 下面 Export 导出



### 2. 数据导出

1. 使用 `INSERT OVERWRITE DIRECTORY`：

```sql
-- 导出到 HDFS（默认）
INSERT OVERWRITE DIRECTORY '/user/hive/output/student'
ROW FORMAT DELIMITED FIELDS TERMINATED BY ','
STORED AS TEXTFILE
SELECT id, name FROM student;

-- 导出到本地文件系统
INSERT OVERWRITE LOCAL DIRECTORY '/tmp/student'
STORED AS CSV
SELECT * FROM student;
```

2. Hadoop命令导出到本地：

```bash
hive（default）> dfs -get /user/hive/warehouse/student/student.txt /opt/module/datas/export/student3.txt
```

3. Hive Shell 命令导出：

```sql
hive -e 'select * from default.test2;' > /opt/module/temp/test2.txt
```

4. Export 导出到HDFS上：

```sql
-- 导出全表
EXPORT TABLE student TO '/user/hive/export/student';

-- 导出分区
EXPORT TABLE logs PARTITION (dt='20231001') TO '/user/hive/export/logs_20231001';

-- 导入到新表
IMPORT TABLE student_import FROM '/user/hive/export/student';

-- 导入到外部表
IMPORT EXTERNAL TABLE student_external 
FROM '/user/hive/export/student'
LOCATION '/user/hive/warehouse/student_external';  -- 指定新路径
```

5. 使用 Sqoop 导出到关系型数据库：

```sql
sqoop export \
--connect jdbc:mysql://host:3306/db \
--username user --password pass \
--table target_table \
--export-dir /user/hive/warehouse/student \
--input-fields-terminated-by ','  # 与 Hive 表分隔符一致
```

### 3. Export 和 Import

在 Hive 中，`EXPORT` 和 `IMPORT` 是用于 **数据迁移** 和 **备份恢复** 的关键命令，支持将表数据及其元数据（如表结构、分区信息）批量导出和导入。

**export 和 import 主要用于两个 Hadoop 平台集群之间 Hive 表迁移**。

>  注意：先用 export 导出后，在将数据 Import 导入。

### 4. 清空表中数据

```sql
truncate table student;
```

## 四、查询

查询语句语法：

```sql
SELECT [ALL | DISTINCT] select_expr, select_expr, ...
  FROM table_reference       -- 从什么表查
  [WHERE where_condition]   -- 过滤
  [GROUP BY col_list]        -- 分组查询
   [HAVING col_list]          -- 分组后过滤
  [ORDER BY col_list]        -- 排序
  [CLUSTER BY col_list
    | [DISTRIBUTE BY col_list] [SORT BY col_list]
  ]
 [LIMIT number]                -- 限制输出的行数
```

> SQL 语法大致相同，大体原理如下图：
>
> ![image-20250429163335305](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250429163335305.png)

排序：

1. 全局排序（Order By）：只有一个Reduce。

```sql
select 
    * 
from emp 
order by sal;
```

2. 每个Reduce内部排序（Sort By）：

```sql
hive (default)> set mapreduce.job.reduces=3;
hive (default)> set mapreduce.job.reduces;

hive (default)> 
select 
    * 
from emp 
sort by deptno desc;
```

|     **特性**      |         `SORT BY`          |            `ORDER BY`            |
| :---------------: | :------------------------: | :------------------------------: |
|   **排序范围**    |  每个 Reduce 任务内部有序  |             全局有序             |
| **Reduce 任务数** |    多个 Reduce 任务并行    | 单个 Reduce 任务（除非分桶排序） |
|     **性能**      |       高（并行处理）       |      低（单点处理全量数据）      |
|   **适用场景**    | 需要局部排序或中间结果优化 |      需要严格全局排序的输出      |

3.  分区（Distribute By）：将数据按照指定字段的哈希值分配到不同的 **Reduce 任务**，确保相同字段值的数据进入同一个 Reduce 任务。

```sql
hive (default)> set mapreduce.job.reduces=3;
hive (default)> 
insert overwrite local directory 
'/opt/module/hive/datas/distribute-result' 
select 
    * 
from emp 
distribute by deptno 
sort by sal desc;
```

4. 分区排序（Cluster By）：等价于 `DISTRIBUTE BY + SORT BY`，即 **先按字段分发数据到 Reduce 任务，再在 Reduce 内按同一字段排序**。

```sql
-- 以下两种写法等价
hive (default)> 
select 
    * 
from emp 
cluster by deptno;


hive (default)> 
select 
    * 
from emp 
distribute by deptno 
sort by deptno;
```

|   **特性**   |       `DISTRIBUTE BY`        |         `CLUSTER BY`         |      `ORDER BY`       |
| :----------: | :--------------------------: | :--------------------------: | :-------------------: |
| **数据分布** | 按指定字段分配到 Reduce 任务 | 按指定字段分配到 Reduce 任务 |    不涉及数据分布     |
| **数据排序** |            不排序            | 按分发字段在 Reduce 内部排序 | 全局排序（单 Reduce） |
|   **性能**   |        高（并行分发）        |       中（分发+排序）        |  低（单点全局排序）   |
| **输出结果** |        Reduce 内无序         |        Reduce 内有序         |       全局有序        |
| **适用场景** |    数据分桶、聚合前预处理    |       分桶且需桶内有序       |   严格全局排序需求    |

## 五、分区 和 分桶

分区针对的是数据的存储路径，分桶针对的是数据文件。

### 1. 分区（Partitioning）

将表中的数据按 **某一列（或多个列）的值** 划分为不同的子目录（分区），每个子目录对应一个特定值。

- **本质**：基于列值对数据进行 **物理划分**，目录结构为：`/表路径/分区列=值/数据文件`。
- **常见分区列**：日期（`dt`）、地区（`region`）、类别（`category`）等低基数列（即重复值较多的列）。

示例：

按日期分区存储日志数据：

```sql
CREATE TABLE logs (
    user_id STRING,
    event STRING
) PARTITIONED BY (dt STRING);  -- 分区列 `dt`（日期）
```

实际存储路径：

```
/user/hive/warehouse/logs/dt=2023-10-01/datafile1.orc
/user/hive/warehouse/logs/dt=2023-10-02/datafile2.orc
```

优点：

- **减少数据扫描量**：查询时通过分区过滤，直接跳过无关分区。
- **优化数据管理**：可单独删除、加载或备份特定分区。

```sql
-- 删除整个分区
ALTER TABLE logs DROP PARTITION (dt='2023-10-01');

-- 删除部分数据
INSERT OVERWRITE TABLE logs PARTITION (dt='2023-10-01')
SELECT user_id, event 
FROM logs 
WHERE dt='2023-10-01' AND user_id != 'user1';  -- 过滤要保留的数据

-- 更新覆盖数据
INSERT OVERWRITE TABLE logs PARTITION (dt='2023-10-01')
SELECT 
    CASE WHEN user_id = 'user1' THEN 'user001' ELSE user_id END AS user_id, 
    event
FROM logs 
WHERE dt='2023-10-01';

-- 查看所有分区
SHOW PARTITIONS logs;
```



### 2. 分桶（Bucketing）

将表中的数据按 **某一列的哈希值** 划分为固定数量的桶（文件），每个桶对应一个文件。

- **本质**：基于哈希值对数据进行 **均匀分布**，确保相同值的数据进入同一桶。
- **常见分桶列**：高基数列（如 `user_id`、`order_id`），常用于 JOIN 或聚合操作。

示例：

按 `user_id` 分桶存储用户表：

```sql
CREATE TABLE users (
    user_id STRING,
    name STRING
) CLUSTERED BY (user_id) INTO 4 BUCKETS;  -- 分桶列 `user_id`，分为 4 个桶
```

实际存储路径：

```
/user/hive/warehouse/users/000000_0  -- 桶1（哈希值为0）
/user/hive/warehouse/users/000001_0  -- 桶2（哈希值为1）
```

优点：

- **优化 JOIN 性能**：相同分桶列的两张表进行 JOIN 时，只需匹配对应桶的数据（类似 MapReduce 的 Map 端 JOIN）。

- **数据均匀分布**：避免数据倾斜，提升并行计算效率。

- **高效采样**：可通过 `TABLESAMPLE` 快速采样特定桶的数据。

  ```sql
  SELECT * FROM users TABLESAMPLE (BUCKET 1 OUT OF 4 ON user_id);
  ```

```sql
-- 删除数据：分桶表不支持直接删除部分数据，需覆盖整个表或分桶。
INSERT OVERWRITE TABLE users
SELECT user_id, name 
FROM users 
WHERE user_id != 'user1';  -- 过滤要保留的数据


-- 更新数据：同删除操作，需覆盖数据。
INSERT OVERWRITE TABLE users
SELECT 
    CASE WHEN user_id = 'user1' THEN 'user001' ELSE user_id END AS user_id, 
    name
FROM users;
```

### 3. 先分区在分桶（实际场景）

在实际场景中，通常 **先分区再分桶**，结合两者的优势：

1. **分区过滤大范围数据**（如按日期）。
2. **分桶优化细粒度操作**（如按用户 ID JOIN）。

效果如下图：

![image-20250430095024126](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250430095024126.png)

### 4. 二级分区

在分区表的基础上，按 **多个列** 的值进行层级划分。

常见场景：

- 时间维度细化（年 → 月 → 日）。
- 地理维度细化（国家 → 省份 → 城市）。
- 业务维度细化（类别 → 子类别）。

示例：

```sql
-- 按年份（year）和月份（month）二级分区
CREATE TABLE sales (
    product_id STRING,
    amount     DOUBLE
) PARTITIONED BY (year STRING, month STRING)  -- 分区列顺序决定层级
STORED AS ORC;
```

```bash
# 得到的目录结构如下：
/user/hive/warehouse/sales/
├── year=2023/month=01/  # 2023年1月数据
├── year=2023/month=02/  # 2023年2月数据
└── year=2024/month=01/  # 2024年1月数据
```

### 5. 数据直接上传到分区目录上，如果让分区表与数据产生关联呢？

1. 解决办法一：上传数据后，修复：

```sql
MSCK REPAIR TABLE logs_external;
```

2. 解决办法二：上传数据后，添加分区：

```sql
alter table logs_external add partition(day='201709', hour='14')
```

3. 创建文件夹后，load 数据到分区：

```sql
-- 创建目录
dfs -mkdir -p /user/hive/warehouse/mydb.db/logs_external/day=20200401/hour=15;
-- load 数据导入
load data local inpath '/opt/module/hive/datas/dept_20200401.log' into table logs_external partition(day='20200401', hour='15') 
```

:::tip

倘若，load 时，没有指定分区，他也会有一个默认的分区存储：

![image-20250430153226906](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250430153226906.png)

:::

### 6. 动态分区

**动态分区（Dynamic Partitioning）** 是 Hive 中一种自动化管理分区的机制，允许根据查询结果中的字段值自动创建分区，无需手动指定每个分区的值。它特别适用于 **分区列值不固定** 或 **分区数量较多** 的场景（如按日期、地区动态生成分区）。

|         **场景**         |                 **优势**                 |
| :----------------------: | :--------------------------------------: |
|     **高频新增分区**     |       自动创建分区，无需手动维护。       |
| **分区列值未知或变化多** |        根据数据特征自动生成分区。        |
|     **减少人工操作**     | 避免为每个分区编写单独的 `INSERT` 语句。 |

启动动态分区前，需要设置以下几个参数：

|                   参数名                   |  默认值  |                             说明                             |
| :----------------------------------------: | :------: | :----------------------------------------------------------: |
|       `hive.exec.dynamic.partition`        | `false`  |            开启动态分区功能（必须设为 `true`）。             |
|     `hive.exec.dynamic.partition.mode`     | `strict` | 动态分区模式： `strict`（严格模式，需至少一个静态分区） `nonstrict`（非严格模式，允许全动态分区）。 |
|     `hive.exec.max.dynamic.partitions`     |  `1000`  |              单个查询允许创建的最大动态分区数。              |
| `hive.exec.max.dynamic.partitions.pernode` |  `100`   |    单个计算节点（如 DataNode）允许创建的最大动态分区数。     |

示例：

```sql
-- 按日期（dt）和国家（country）动态分区
CREATE TABLE sales (
    product_id STRING,
    amount     DOUBLE
) PARTITIONED BY (dt STRING, country STRING)
STORED AS ORC;

-- 从原始表导入数据（自动生成 dt 和 country 分区）
INSERT OVERWRITE TABLE sales PARTITION (dt, country)
SELECT 
    product_id, 
    amount, 
    order_date AS dt,   -- 分区字段必须放在查询列最后
    region      AS country
FROM raw_orders;
```

> 官方要求，动态分区的列，放到最后，并且排序与前者排序相同！

## 六、函数

:::tip

关于函数这块有几个概念性东西，如下：

- UDF（User-Defined Function）：单行输入 → 单行输出，用于对单行数据进行简单转换或计算。（`trim()`、`substring()、date_format()` 等等 ）

- UDAF（User-Defined Aggregation Function）：多行输入 → 单行输出，用于聚合计算（如 `sum()`、`avg()`）。

- UDTF（User-Defined Table-Generating Function）：单行输入 → 多行/多列输出，用于数据展开或复杂解析。展开数组/Map 字段（如 `explode()` ）。

:::



### 1. 系统内置函数

```sql
-- 查看系统自带的函数
show functions;

-- 显示自带的函数的用法
desc function upper;

-- 详细显示自带的函数的用法
desc function extended upper;
```

### 2. 常用的内置函数

```sql
-- 空字段赋值：nvl() 函数：
select nvl(comm, -1) from emp;

-- 条件判断函数：case when ... then ...  else ... end
select case when 1=2 then 'tom' when 2=2 then 'mary' else 'tim' end from tabl eName; 

-- if 条件判断：类似 Java 中的三元运算符
select if(10 > 5,'正确','错误'); 

-- 等等... 此处，不一一列举
```

### 3. `explore` 函数

`explore` 函数：展开 数组 / Map 字段：

```sql
-- 创建含 Map 字段的表
CREATE TABLE user_profiles (
    user_id STRING,
    profile MAP<STRING, STRING>  -- 如 {"gender":"male", "age":"25"}
);

-- 插入数据
INSERT INTO user_profiles VALUES
('user1', map('gender', 'male', 'age', '25')),
('user2', map('gender', 'female', 'age', '30'));

-- 展开 Map 为多行键值对
SELECT 
    user_id, 
    key, 
    value
FROM user_profiles
LATERAL VIEW explode(profile) tmp AS key, value;
```

### 4. 窗口函数







## 其他

### 1. 关于 count 不执行MR任务说明

![image-20250429115358387](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250429115358387.png)

以在 Hive 中执行 ``SELECT COUNT(*) FROM student;` 为例：

如果 `student` 表的行数统计信息已预先计算并存储在 Hive 元数据中，Hive 会直接读取元数据中的 `numRows` 值返回结果，完全跳过数据扫描和计算。

`SELECT COUNT(*) FROM student;` 不执行 MR 任务的核心原因是 **Hive 优先通过元数据或 Fetch Task 优化直接获取结果**，

一般这种情况会出现在，通过 HDFS 上传文件到 Hive 表的存储路径（尤其是**外部表**），如果不手动更新 Hive 元数据，会导致 `COUNT(*)` 与实际行数不一致。





