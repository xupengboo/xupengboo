## MySQL MVVC多版本并发控制
> 参考：
> [MySQL MVVC多版本并发控制-CSDN博客](https://blog.csdn.net/weixin_45902285/article/details/126291623)
> [深入理解MySQL的MVCC原理_mysql隐藏主键_胡玉洋　的博客-CSDN博客](https://blog.csdn.net/huyuyang6688/article/details/123028254)

## 项目中，MySQL如何处理这种有千万级别量的表格？

1. **索引**: 正确地使用索引可以显著提高查询性能。分析查询语句，查找需要优化的部分，并为频繁查询的字段创建索引。但是，过多的索引可能会增加写入操作的开销，因此需要仔细权衡。
2. **分区**: 如果表格非常大，可以考虑使用分区。这可以将一个大表分成多个较小的表，这些表在逻辑上作为一个整体运作。这可以简化管理，并允许更快地执行查询。

见目录：MySQL表格分区

3. **只存储需要的字段**: 不要存储不需要的字段，这可以减少存储和查询的开销。
4. **使用适当的数据类型**: 使用最适合数据的数据类型，避免使用大的数据类型，例如VARCHAR。
5. **定期清理和优化数据**: 定期删除或归档不再需要的旧数据，这可以减少存储需求并提高查询性能。
6. **硬件升级**: 如果数据库服务器经常遇到性能问题，可能需要升级硬件，如增加RAM或更快的CPU。
7. **数据库复制**: 如果读写操作都非常频繁，可以考虑使用MySQL的主从复制。这样可以将读取请求分散到多个数据库服务器上，提高性能。
8. **数据库优化工具**: 使用像Percona或MySQLTuner这样的工具来检查和优化数据库配置。
9. **避免长时间运行的查询**: 尽量优化查询，避免长时间运行的查询。可以使用EXPLAIN命令来分析查询计划并找出性能瓶颈。
10. **分批处理**: 对于大量数据的处理，尝试分批处理，避免一次性处理所有数据。
11. **数据冷热分离**: 对于经常访问的数据和不经常访问的数据，可以分别存储在不同的存储介质上，如：SSD（Solid State Drive 固态硬盘）和HDD（Hard Disk Drive 机械硬盘）。
12. **使用NoSQL数据库**: 如果表格结构不固定或需要处理大量非结构化数据，可以考虑使用NoSQL数据库，如MongoDB或Cassandra。
## 在MySQL中，如何高效的使用 Explain 分析查询语句？
首先，项目定位到了查询慢的SQL，一般会使用下面这两个命令：
```sql
-- 使用describe查看表结构
describe table_name; 
-- 使用explain分析查询语句
explain select xxx from table_name;
```

针对explain语句，以下解释：
![image.png](https://cdn.nlark.com/yuque/0/2023/png/32707260/1700896596255-68008468-bb04-465c-8a82-003f24283c5f.png#averageHue=%23f4f3f2&clientId=u75738eea-fe0c-4&from=paste&height=189&id=u82d62784&originHeight=236&originWidth=1442&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=25359&status=done&style=none&taskId=ueec5dab1-69f7-4f38-8479-e6e91e5cfa2&title=&width=1153.6)

| 字段名 | 描述 |
| --- | --- |
| id | 查询中每个操作的序号 |
| select_type | 查询的类型。常见的值包括SIMPLE（简单查询）、PRIMARY（外层查询）、SUBQUERY（子查询）、UNION（联合查询）等。 |
| table | 表名 |
| partitions | 匹配的分区信息 |
| type | 连接类型。常见的值包括ALL（全表扫描）、index（索引扫描）、range（范围扫描）、ref（索引引用）、eq_ref（唯一索引引用）等 |
| possible_keys | 可能使用的索引列表。 |
| key | 实际使用的索引名称 |
| key_len | 使用的索引长度 |
| ref | 与索引比较的列或常量 |
| rows | MySQL估计需要扫描的行数 |
| filtered | 某个表经过搜索条件过滤后剩余记录条数的百分比 |
| Extra | 表示其他附加信息，常见的值包括Using filesort（使用文件排序）、Using temporary（使用临时表）、Using index（使用索引）等 |

```sql
# 创建两个测试表：
CREATE TABLE s1 (
  id INT AUTO_INCREMENT,
  key1 VARCHAR(100),
  key2 INT,
  key3 VARCHAR(100),
  key_part1 VARCHAR(100),
  key_part2 VARCHAR(100),
  key_part3 VARCHAR(100),
  common_field VARCHAR(100),
  PRIMARY KEY (id),
  INDEX idx_key1 (key1),
  UNIQUE INDEX idx_key2(key2),
  INDEX idx_key3(key3),
  INDEX idx_key_part(key_part1,key_part2,key_part3)
)ENGINE = INNODB CHARSET = utf8;

CREATE TABLE s2 (
  id INT AUTO_INCREMENT,
  key1 VARCHAR(100),
  key2 INT,
  key3 VARCHAR(100),
  key_part1 VARCHAR(100),
  key_part2 VARCHAR(100),
  key_part3 VARCHAR(100),
  common_field VARCHAR(100),
  PRIMARY KEY (id),
  INDEX idx_key1 (key1),
  UNIQUE INDEX idx_key2(key2),
  INDEX idx_key3(key3),
  INDEX idx_key_part(key_part1,key_part2,key_part3)
)ENGINE = INNODB CHARSET = utf8;


-- 函数返回随机字符串
DELIMITER ;;
CREATE FUNCTION `rand_string`(n INT) RETURNS varchar(255) CHARSET utf8mb4
BEGIN
    DECLARE chars_str VARCHAR(100) DEFAULT 'abcdefghijklmnopqrstuvwxyzABCDEFJHIJKLMNOPQRSTUVWXYZ';
    DECLARE return_str VARCHAR(255) DEFAULT '';
    DECLARE i INT DEFAULT 0;
    WHILE i < n DO
            SET return_str =CONCAT(return_str,SUBSTRING(chars_str,FLOOR(1+RAND()*52),1));
            SET i = i + 1;
        END WHILE;
    RETURN return_str;
END ;
DELIMITER ;

# 确保相信函数的变量log_bin_trust_function_creators为1
SELECT @@log_bin_trust_function_creators variable;
SET GLOBAL log_bin_trust_function_creators = 1;

# 向两个表格里面添加测试数据：
DELIMITER //
CREATE PROCEDURE insert_s1 (IN min_num INT (10), IN max_num INT(10))
BEGIN
    DECLARE i INT DEFAULT 0;
    SET autocommit = 0;
    REPEAT
        SET i = i + 1;
        INSERT INTO s1 VALUES((min_num + i), rand_string(6),(min_num + 30* i + 5),rand_string(6),rand_string(10),rand_string(5),rand_string(10),rand_string(10));
    UNTIL i = max_num
        END REPEAT;
    COMMIT;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE insert_s2 (IN min_num INT (10), IN max_num INT(10))
BEGIN
    DECLARE i INT DEFAULT 0;
    SET autocommit = 0;
    REPEAT
        SET i = i + 1;
        INSERT INTO s2 VALUES((min_num + i),rand_string(6),(min_num + 30* i + 5),rand_string(6),rand_string(10),rand_string(5),rand_string(10),rand_string(10));
    UNTIL i = max_num
        END REPEAT;
    COMMIT;
END //
DELIMITER ;

# 执行函数
CALL insert_s1(10001, 10000);
CALL insert_s2(10001, 10000);

select * from s1;
select * from s2;
```
> 💡参考：[https://zhuanlan.zhihu.com/p/623125075](https://zhuanlan.zhihu.com/p/623125075)

## MySQL 表格分区
### 什么情况下，考虑 表格分区？ 
项目中，经常会遇到数据量比较大的表格（百万、千万、亿），这个时候就要根据业务，考虑表格分区的设计思维了。
通过将表格的行分成多个逻辑分区，可以更快地执行涉及这些分区的查询，并降低对大量数据的访问需求。
### MySQL 分区步骤
MySQL 表格分区是一种将一个表格分成多个较小的、独立的区域，以提高查询性能和管理方便性的技术。下面是操作 MySQL 表格分区的一般步骤：

1. **确保你的 MySQL 版本支持表格分区。**MySQL 5.6 及以上版本都支持表格分区。
2. **创建表格时指定分区。**在 CREATE TABLE 语句中，使用 PARTITION BY 子句指定分区方法。常见的分区方法包括：
   - **RANGE：根据列的值的范围进行分区。**
   - **LIST：根据列的值的列表进行分区。**
   - **HASH：根据列的哈希值进行分区。**
   - **KEY：根据列的索引进行分区。**

**设计表格时，考虑好分区一般为：RANGE + LIST 、 HASH + KEY**
例如，创建一个按年份分区的顾客表格：
```sql
-- 第一种：RANGE分区 根据年份将数据进行分区处理。
CREATE TABLE customers (
   id INT,
   name VARCHAR(50),
   year INT,
   partitioned_column VARCHAR(50)
) PARTITION BY RANGE (year) (
    PARTITION p0 VALUES LESS THAN (2000),
    PARTITION p1 VALUES LESS THAN (2005),
    PARTITION p2 VALUES LESS THAN (2010),
    PARTITION p3 VALUES LESS THAN MAXVALUE
);

-- 第二种：HASH分区 根据月份将数据进行分区处理
-- 此处，是划分了12个分区。
CREATE TABLE customers (
   id INT,
   name VARCHAR(50),
   crt_date date,
   partitioned_column VARCHAR(50)
) PARTITION BY HASH(MONTH(crt_date)) 
PARTITIONS 12;

-- 第三种：LIST分区 根据顾客状态进行分区处理
CREATE TABLE customers (
   id INT,
   name VARCHAR(50),
   status char(1),
   crt_date date,
   partitioned_column VARCHAR(50)
) PARTITION BY list(status)
PARTITIONS 12;

-- 第四种：KEY分区 根据相同KEY写入同一个分区
CREATE TABLE customers (
   id INT,
   name VARCHAR(50),
   status char(1),
   crt_date date,
   partitioned_column VARCHAR(50)
) PARTITION BY key(id)
PARTITIONS 12

-- 通过下面的命令，可以将原来的12个分区改为6个分区
ALTER TABLE customers COALESCE PARTITION 6；
```

1. 插入数据时，MySQL 会自动将数据分配到相应的分区。你可以像插入普通表格一样插入数据。例如：
```sql
INSERT INTO customers (id, name, year, partitioned_column) VALUES (1, 'John Doe', 2008, 'some value');
```

2. 查询数据时，MySQL 会自动从相应的分区中获取数据。你可以像查询普通表格一样查询数据。例如：
```sql
SELECT * FROM customers WHERE year = 2008;
```

3. **调整分区。**你可以根据需要添加、删除或合并分区。例如，为顾客表格添加一个新的分区：
```sql
ALTER TABLE customers ADD PARTITION (PARTITION p4 VALUES LESS THAN (2015));
```

4. **注意监控和维护分区。**

使用 **`SHOW TABLE STATUS`** 命令：查看表格的状态和分区信息。
```sql
# 查看所有表格的状态和分区信息
show table status;
```

使用 **`OPTIMIZE TABLE`**命令：是优化表格的命令。也可以优化和修复分区**。
它的作用主要是**重建表索引，并压缩表碎片，使得数据物理排列更加紧密，从而加快查询速度**。此外，它还可以更新统计信息和缓存，从而减少数据读取次数和IO操作，大大提高数据库效率。
场景：优化删除大量数据后的表，或者对含有可变长度行的表（含有VARCHAR, BLOB或TEXT列的表）进行很多更改后的优化。一般针对特定的表格，进行周期运行。

```sql
optimize table customers;
```

使用 `ALTER TABLE ... REORGANIZE PARTITION` 命令：可以合并相邻的分区。
```sql
-- 分解分区  将p0拆分为s0和s1
ALTER TABLE customers REORGANIZE PARTITION p0 INTO (
    PARTITION s0 VALUES LESS THAN (3),
    PARTITION s1 VALUES LESS THAN (5)
);

-- 合并分区  将s0和s1合并为p0
ALTER TABLE customers REORGANIZE PARTITION s0,s1 INTO (
    PARTITION p0 VALUES LESS THAN (5)
);

-- 合并分区  将s0和s1合并为 r0 r1
ALTER TABLE customers REORGANIZE PARTITION s0,s1 INTO (
    PARTITION s0 VALUES LESS THAN (2),
    PARTITION p0 VALUES LESS THAN (5)
);
```

使用 `**ALTER TABLE ... ADD PARTITION**`** 命令：可以添加新的分区**。
```sql
alter table customers add partition (partition p5 VALUES LESS THAN (2020))
```

使用 `**ALTER TABLE ... COALESCE PARTITION**`** 命令：修改分区数量**。
```sql
-- 通过下面的命令，将原来的12个分区改为6个分区
ALTER TABLE customers COALESCE PARTITION 6；
```
### 什么场景下，具体使用什么分区？

1. **Key分区**：这种分区方式**主要用于将具有相同Key的消息写入同一个分区，以保证消息的顺序性**。例如，在订单系统中，每个订单都有一个唯一的订单号作为Key，那么具有相同订单号的消息将被写入同一个分区，保证了订单的顺序。
2. **Hash分区**：Hash分区主要用于数据结构中，主要是为了提高查询效率。在密码学中，hash算法的作用主要是用于消息摘要和签名，对整个消息的完整性进行校验。
3. **List分区**：List分区特别**适合于枚举值列的分区**，例如根据性别分区。这种分区方式能够快速定位到特定的数据分区，从而提高查询效率。
4. **Range分区**：Range分区最适合的两种场景是 **1.当我们需要删除过期或某些一类数据时，可以通过ALTER TABLE命令直接删除特定分区的数；2.当我们查询数据时，通过合理设计可以减少全表扫描，从而提高查询效率**。例如，SELECT * from t_user_main where f_id > 12可以直接扫描p2区扫描，查询数据。
### RANGE COLUMNS 用法
RANGE COLUMNS是RANGE分区的一种特殊类型，它与RANGE分区的区别如下：

1. RANGE COLUMNS不接受表达式，只能是列名。而RANGE分区则要求分区的对象是整数。
2. RANGE COLUMNS允许多个列，在底层实现上，它比较的是元祖（多个列值组成的列表），而RANGE比较的是标量，即数值的大小。
3. RANGE COLUMNS不限于整数对象，date，datetime，string都可作为分区列。
```sql
CREATE TABLE rcx (
    a INT,
    b INT,
    c CHAR(3),
    d INT
)
PARTITION BY RANGE COLUMNS(a,d,c) (
    PARTITION p0 VALUES LESS THAN (5,10,'ggg'),
    PARTITION p1 VALUES LESS THAN (10,20,'mmmm'),
    PARTITION p2 VALUES LESS THAN (15,30,'sss'),
    PARTITION p3 VALUES LESS THAN (MAXVALUE,MAXVALUE,MAXVALUE)
);
```
## 为什么 分库分表？分库分表的优缺点？
[12张图把分库分表讲的明明白白！](https://mp.weixin.qq.com/s?__biz=MzU0OTE4MzYzMw==&mid=2247547792&idx=2&sn=91a10823ceab0cb9db26e22783343deb&chksm=fbb1b26eccc63b784879f90540c8ab1731e635b30e5f4fd41de67f87a4fe055473039206f09d&scene=27)

