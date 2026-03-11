---
title: MySQL 基础
outline: deep
---

# MySQL 基础

> MySQL 是目前最流行的开源关系型数据库管理系统，由 Oracle 旗下维护。本文涵盖日常开发中 MySQL 的核心知识点，从基础语法到索引原理、表分区优化。

---

## 一、数据类型速查

### 数值类型

| 类型 | 大小 | 说明 |
|---|---|---|
| `TINYINT` | 1 字节 | 极小整数（-128 ~ 127） |
| `SMALLINT` | 2 字节 | 较小整数 |
| `MEDIUMINT` | 3 字节 | 中等整数 |
| `INT` | 4 字节 | 标准整数（最常用） |
| `BIGINT` | 8 字节 | 大整数 |
| `FLOAT` | 4 字节 | 单精度浮点 |
| `DOUBLE` | 8 字节 | 双精度浮点 |
| `DECIMAL(m,d)` | 变长 | 精确小数，金融场景首选 |

### 字符串类型

| 类型 | 长度范围 | 说明 |
|---|---|---|
| `CHAR(n)` | 0~255 | 定长，不足补空格，查询快 |
| `VARCHAR(n)` | 0~65535 | 变长，按实际长度存储（最常用） |
| `TINYTEXT` | 0~255 | 微型文本 |
| `TEXT` | 0~65535 | 普通文本，适合长内容 |
| `BLOB` | 0~65535 | 二进制数据 |

:::tip CHAR vs VARCHAR
- `CHAR`：固定长度，读写快，适合长度固定的字段（如手机号、状态码）
- `VARCHAR`：变长，节省空间，适合长度不固定的字段（如用户名、地址）
  :::

### 时间类型

| 类型 | 格式 | 说明 |
|---|---|---|
| `DATE` | `YYYY-MM-DD` | 仅日期 |
| `TIME` | `HH:mm:ss` | 仅时间 |
| `DATETIME` | `YYYY-MM-DD HH:mm:ss` | 日期 + 时间（最常用） |
| `TIMESTAMP` | 同上 | 时间戳，自动记录修改时间 |
| `YEAR` | `YYYY` | 年份 |

---

## 二、DDL — 数据定义

### 数据库操作

```sql
-- 创建数据库
CREATE DATABASE IF NOT EXISTS `mydb` DEFAULT CHARSET utf8mb4;

-- 删除数据库
DROP DATABASE IF EXISTS `mydb`;

-- 切换数据库
USE `mydb`;

-- 查看所有数据库
SHOW DATABASES;
```

### 创建表

```sql
CREATE TABLE IF NOT EXISTS `user` (
    `id`          BIGINT       NOT NULL AUTO_INCREMENT  COMMENT '主键',
    `username`    VARCHAR(50)  NOT NULL                 COMMENT '用户名',
    `email`       VARCHAR(100) DEFAULT NULL             COMMENT '邮箱',
    `status`      CHAR(2)      NOT NULL DEFAULT '10'    COMMENT '状态：10正常，20禁用',
    `create_time` DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

:::tip 建表规范
- 表名、字段名用反引号 `` ` `` 包裹，避免与关键字冲突
- 每个字段都加 `COMMENT`
- `create_time` / `update_time` 推荐使用 `DEFAULT CURRENT_TIMESTAMP` 自动维护
- 字符集推荐 `utf8mb4`（支持 emoji），而非 `utf8`（MySQL 的 utf8 实际是 utf8mb3，不完整）
  :::

### 修改表结构

```sql
-- 改表名
ALTER TABLE `old_name` RENAME AS `new_name`;

-- 新增字段
ALTER TABLE `user` ADD `age` INT(3) DEFAULT NULL COMMENT '年龄';

-- 修改字段类型/约束（不改名）
ALTER TABLE `user` MODIFY `age` TINYINT DEFAULT NULL;

-- 重命名字段（同时可改类型）
ALTER TABLE `user` CHANGE `age` `user_age` INT DEFAULT NULL;

-- 删除字段
ALTER TABLE `user` DROP `user_age`;

-- 删除表
DROP TABLE IF EXISTS `user`;
```

### InnoDB vs MyISAM

| | InnoDB | MyISAM |
|---|---|---|
| 事务 | ✅ 支持 | ❌ 不支持 |
| 行锁 | ✅ 支持 | ❌ 仅表锁 |
| 外键 | ✅ 支持 | ❌ 不支持 |
| 全文索引 | ✅（5.6+） | ✅ |
| 崩溃恢复 | ✅ | 较弱 |
| 适用场景 | 绝大多数业务 | 只读/历史归档 |

> 现在几乎所有场景都应该使用 **InnoDB**，MyISAM 已是历史遗留。

---

## 三、DML — 数据操作

### INSERT

```sql
-- 单行插入（推荐显式指定字段名）
INSERT INTO `user` (`username`, `email`, `status`)
VALUES ('张三', 'zhangsan@example.com', '10');

-- 批量插入（性能更好）
INSERT INTO `user` (`username`, `email`) VALUES
    ('李四', 'lisi@example.com'),
    ('王五', 'wangwu@example.com');
```

### UPDATE

```sql
-- 更新指定行（务必加 WHERE，否则全表更新！）
UPDATE `user` SET `status` = '20' WHERE `id` = 1;

-- 更新多个字段
UPDATE `user`
SET `email` = 'new@example.com', `update_time` = NOW()
WHERE `username` = '张三';
```

### DELETE vs TRUNCATE

```sql
-- 删除指定行
DELETE FROM `user` WHERE `id` = 1;

-- 清空整张表（自增从 1 重新开始，不可回滚）
TRUNCATE TABLE `user`;
```

| | `DELETE` | `TRUNCATE` |
|---|---|---|
| 逐行删除 | ✅ | ❌（整体清空） |
| 可加 WHERE | ✅ | ❌ |
| 自增重置 | ❌ | ✅ |
| 可回滚 | ✅ | ❌ |
| 速度 | 慢 | 快 |

---

## 四、DQL — 查询语句

### 基础查询

```sql
-- 查询所有字段
SELECT * FROM `user`;

-- 查询指定字段，起别名
SELECT `id` AS 编号, `username` AS 用户名 FROM `user`;

-- 去重
SELECT DISTINCT `status` FROM `user`;

-- 条件查询
SELECT * FROM `user` WHERE `status` = '10' AND `id` > 100;

-- 模糊查询（% 匹配任意字符，_ 匹配单个字符）
SELECT * FROM `user` WHERE `username` LIKE '张%';
SELECT * FROM `user` WHERE `username` LIKE '张_';

-- IN 范围查询
SELECT * FROM `user` WHERE `id` IN (1, 2, 3);

-- NULL 查询
SELECT * FROM `user` WHERE `email` IS NULL;
SELECT * FROM `user` WHERE `email` IS NOT NULL;
```

### JOIN 联表查询

```sql
-- INNER JOIN：两表都有匹配才返回
SELECT u.id, u.username, o.amount
FROM `user` u
INNER JOIN `order` o ON u.id = o.user_id;

-- LEFT JOIN：左表全返回，右表无匹配则为 NULL
SELECT u.id, u.username, o.amount
FROM `user` u
LEFT JOIN `order` o ON u.id = o.user_id;

-- RIGHT JOIN：右表全返回
SELECT u.id, u.username, o.amount
FROM `user` u
RIGHT JOIN `order` o ON u.id = o.user_id;
```

| JOIN 类型 | 返回结果 |
|---|---|
| `INNER JOIN` | 两表都匹配的行 |
| `LEFT JOIN` | 左表全部 + 右表匹配（无匹配为 NULL） |
| `RIGHT JOIN` | 右表全部 + 左表匹配（无匹配为 NULL） |

:::tip MySQL 不支持 FULL OUTER JOIN
可以用 `LEFT JOIN UNION RIGHT JOIN` 模拟：
```sql
SELECT * FROM a LEFT JOIN b ON a.id = b.id
UNION
SELECT * FROM a RIGHT JOIN b ON a.id = b.id;
```
:::

### 排序、分页、分组

```sql
-- 排序：ASC 升序（默认），DESC 降序
SELECT * FROM `user` ORDER BY `create_time` DESC;

-- 分页：LIMIT 起始偏移, 每页条数
SELECT * FROM `user` LIMIT 0, 10;   -- 第1页
SELECT * FROM `user` LIMIT 10, 10;  -- 第2页
-- 公式：LIMIT (page - 1) * pageSize, pageSize

-- 分组 + 聚合
SELECT `status`, COUNT(*) AS 数量, AVG(`age`) AS 平均年龄
FROM `user`
GROUP BY `status`
HAVING 数量 > 10;
```

:::tip WHERE vs HAVING
- `WHERE`：在分组**前**过滤原始数据，不能用聚合函数
- `HAVING`：在分组**后**过滤聚合结果，可以用聚合函数
  :::

### 聚合函数

| 函数 | 说明 |
|---|---|
| `COUNT(*)` | 统计行数（含 NULL） |
| `COUNT(字段)` | 统计非 NULL 行数 |
| `SUM(字段)` | 求和 |
| `AVG(字段)` | 平均值 |
| `MAX(字段)` | 最大值 |
| `MIN(字段)` | 最小值 |

### SELECT 完整语法顺序

```sql
SELECT [DISTINCT] 字段/表达式
FROM 表名
[JOIN 表名 ON 条件]
[WHERE 过滤条件]
[GROUP BY 分组字段]
[HAVING 分组后过滤]
[ORDER BY 排序字段 ASC|DESC]
[LIMIT 偏移, 条数]
```

---

## 五、事务与 ACID

### ACID 四大特性

| 特性 | 说明 | 典型问题 |
|---|---|---|
| **原子性 Atomicity** | 事务内的操作要么全成功，要么全回滚 | - |
| **一致性 Consistency** | 事务前后数据的完整性约束保持一致 | - |
| **隔离性 Isolation** | 多事务并发时互不干扰 | 脏读、不可重复读、幻读 |
| **持久性 Durability** | 事务提交后数据永久保存，不会丢失 | - |

### 隔离级别与并发问题

| 隔离级别 | 脏读 | 不可重复读 | 幻读 |
|---|---|---|---|
| READ UNCOMMITTED | ✅ 会发生 | ✅ 会发生 | ✅ 会发生 |
| READ COMMITTED | ❌ | ✅ 会发生 | ✅ 会发生 |
| REPEATABLE READ | ❌ | ❌ | ✅ 会发生（MySQL InnoDB 通过 MVCC 基本解决） |
| SERIALIZABLE | ❌ | ❌ | ❌ |

> MySQL InnoDB 默认隔离级别为 **REPEATABLE READ**。

### 事务使用

```sql
-- 关闭自动提交
SET autocommit = 0;

-- 开启事务
START TRANSACTION;

-- 业务操作
UPDATE `account` SET `balance` = `balance` - 500 WHERE `id` = 1;
UPDATE `account` SET `balance` = `balance` + 500 WHERE `id` = 2;

-- 提交（成功时）
COMMIT;

-- 或回滚（失败时）
ROLLBACK;

-- 恢复自动提交
SET autocommit = 1;
```

---

## 六、索引

### 索引类型

| 类型 | 说明 |
|---|---|
| **主键索引** `PRIMARY KEY` | 唯一标识一行，不可为 NULL，每表只能有一个 |
| **唯一索引** `UNIQUE` | 保证列值唯一，允许 NULL（多行 NULL 不违反唯一性） |
| **普通索引** `INDEX` | 加速查询，无唯一性约束 |
| **全文索引** `FULLTEXT` | 用于全文检索（InnoDB 5.6+ 支持） |
| **复合索引** | 多列组合，遵循最左匹配原则 |

### 索引操作语法

```sql
-- 创建索引
CREATE INDEX idx_username ON `user`(`username`);
CREATE UNIQUE INDEX uk_email ON `user`(`email`);

-- 复合索引
CREATE INDEX idx_status_time ON `user`(`status`, `create_time`);

-- 查看索引
SHOW INDEX FROM `user`;

-- 删除索引
DROP INDEX idx_username ON `user`;

-- ALTER TABLE 方式添加
ALTER TABLE `user` ADD INDEX idx_username(`username`);
```

### B 树 vs B+ 树

MySQL InnoDB 索引底层使用 **B+ 树**，而非 B 树。

| 对比项 | B 树 | B+ 树 |
|---|---|---|
| 数据存储位置 | 所有节点（含内部节点）都存数据 | 只有叶子节点存数据，内部节点只存 key |
| 叶子节点关联 | 独立，无相互引用 | 叶子节点通过链表相连 |
| 查询稳定性 | 不稳定（可能在内部节点就命中） | 稳定（每次查询都需要到叶子节点） |
| 范围查询 | 需要中序遍历，效率低 | 直接遍历叶子链表，效率高 |
| IO 次数 | 相对较多 | 相对较少（内部节点只存 key，层数更低） |

:::warning 常见误区
B 树和 B+ 树都是**多路平衡查找树**，不是二叉树（每个节点可以有多个子节点）。
:::

**聚簇索引 vs 非聚簇索引：**

| | 聚簇索引 | 非聚簇索引（二级索引） |
|---|---|---|
| 叶子节点内容 | 完整行数据 | 主键值（需回表查完整数据） |
| 数量 | 每表只有一个（主键） | 可以有多个 |
| 查询效率 | 直接命中 | 需要回表（覆盖索引可避免） |

### 最左匹配原则

对于复合索引 `(a, b, c)`：

```sql
-- ✅ 可以用到索引
WHERE a = 1
WHERE a = 1 AND b = 2
WHERE a = 1 AND b = 2 AND c = 3

-- ❌ 跳过了最左列 a，索引失效
WHERE b = 2
WHERE b = 2 AND c = 3

-- ⚠️ 范围查询之后的列无法使用索引
WHERE a = 1 AND b > 2 AND c = 3
-- a 和 b 用到了索引，c 未使用
```

### 索引失效场景

```sql
-- ❌ 在索引列上使用函数
WHERE YEAR(create_time) = 2024

-- ❌ 隐式类型转换（字段是 VARCHAR，传入 INT）
WHERE username = 123

-- ❌ LIKE 左模糊
WHERE username LIKE '%张'

-- ❌ OR 两侧有一个列没有索引
WHERE username = '张三' OR age = 18

-- ❌ NOT IN / != 通常无法走索引
WHERE status != '10'
```

### 索引原则

- 索引不是越多越好，写操作会维护所有索引，索引多了影响写性能
- 区分度低的字段不适合建索引（如性别，只有两个值）
- 频繁更新的字段慎用索引
- 优先给 WHERE、JOIN ON、ORDER BY 的字段建索引

### EXPLAIN 分析查询

```sql
EXPLAIN SELECT * FROM `user` WHERE `username` = '张三';
```

| 字段 | 关注点 |
|---|---|
| `type` | 连接类型，从好到差：`const` > `eq_ref` > `ref` > `range` > `index` > `ALL`（全表扫描） |
| `key` | 实际使用的索引（NULL 表示未使用） |
| `rows` | 预估扫描行数，越小越好 |
| `Extra` | `Using index`（覆盖索引，最优）；`Using filesort`（需要优化） |

---

## 七、大数据量处理

### 千万级表的优化策略

当单表数据量达到百万、千万级时，按以下思路逐步优化：

| 优先级 | 策略 | 说明 |
|---|---|---|
| ⭐⭐⭐ | **索引优化** | 最优先，正确的索引效果立竿见影 |
| ⭐⭐⭐ | **表分区** | 将大表物理分割，减少单次扫描范围 |
| ⭐⭐ | **读写分离** | 主从复制，将读请求分发到从库 |
| ⭐⭐ | **冷热数据分离** | 热数据存 SSD，冷数据存 HDD 或归档 |
| ⭐⭐ | **分库分表** | 水平拆分，终极方案 |
| ⭐ | **硬件升级** | 增加内存、CPU，治标不治本 |

### 百万级测试数据生成

```sql
-- 创建订单表
CREATE TABLE `co_order` (
    `co_num`       VARCHAR(100)   NOT NULL COMMENT '订单号',
    `status`       CHAR(2)        NOT NULL DEFAULT '10' COMMENT '状态：10新建，20已支付，30已完成',
    `crt_date`     CHAR(8)        DEFAULT NULL COMMENT '创建日期 yyyyMMdd',
    `crt_user_id`  VARCHAR(50)    DEFAULT NULL COMMENT '用户ID',
    `crt_user_name` VARCHAR(50)   DEFAULT NULL COMMENT '用户名',
    `product_id`   VARCHAR(50)    COMMENT '商品ID',
    `product_name` VARCHAR(50)    COMMENT '商品名称',
    `amt_sum`      DECIMAL(18,2)  DEFAULT '0.00' COMMENT '金额',

    PRIMARY KEY (`co_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 开启函数创建权限
SET GLOBAL log_bin_trust_function_creators = 1;

-- 创建批量插入函数（插入 300 万条）
DROP FUNCTION IF EXISTS add_order_num;

DELIMITER ;;
CREATE FUNCTION add_order_num() RETURNS INT
BEGIN
    DECLARE num INT DEFAULT 1000000;
    DECLARE i   INT DEFAULT 0;
    WHILE i < num DO
        INSERT INTO co_order
            (co_num, status, crt_date, crt_user_id, crt_user_name, product_id, product_name, amt_sum)
        VALUES
            (UUID(), '10', '20231125', CONCAT('zhangsan', i), CONCAT('张三', i), CONCAT('prod_zs', i), CONCAT('张三商品', i), FLOOR(RAND() * 100)),
            (UUID(), '20', '20231125', CONCAT('lisi',    i), CONCAT('李四', i), CONCAT('prod_ls', i), CONCAT('李四商品', i), FLOOR(RAND() * 100)),
            (UUID(), '30', '20231125', CONCAT('wangwu',  i), CONCAT('王五', i), CONCAT('prod_ww', i), CONCAT('王五商品', i), FLOOR(RAND() * 100));
        SET i = i + 1;
    END WHILE;
    RETURN i;
END;;
DELIMITER ;

-- 执行函数生成数据
SELECT add_order_num();
```

---

## 八、表分区

### 什么时候考虑分区？

单表数据量超过 **500 万行**且查询性能下降明显，且业务数据有明显的范围特征（按时间、按地区等），可以考虑表分区。

> 分区是将一张逻辑大表按规则拆分成多个物理存储单元，对应用层完全透明。

### 四种分区类型

| 分区类型 | 分区依据 | 适用场景 |
|---|---|---|
| **RANGE** | 列值的连续范围 | 按年份、按日期归档，可直接删除整个分区清理历史数据 |
| **LIST** | 列值的离散枚举 | 按状态、按地区等枚举字段分区 |
| **HASH** | 列值的哈希结果 | 数据均匀分布，减少热点 |
| **KEY** | 类似 HASH，但由 MySQL 计算 | 保证相同 key 写入同一分区（保证顺序性） |

:::tip 设计建议
- 时序数据 → **RANGE**（最常用，可直接 `DROP PARTITION` 清理过期数据）
- 枚举值字段 → **LIST**
- 需要均匀分布 → **HASH** 或 **KEY**
  :::

### RANGE 分区

```sql
-- 按年份分区
CREATE TABLE `orders` (
    `id`         BIGINT NOT NULL,
    `user_id`    BIGINT NOT NULL,
    `amount`     DECIMAL(10,2),
    `order_year` INT NOT NULL,
    PRIMARY KEY (`id`, `order_year`)   -- 分区列必须包含在主键中
) PARTITION BY RANGE (`order_year`) (
    PARTITION p_before_2022 VALUES LESS THAN (2022),
    PARTITION p_2022        VALUES LESS THAN (2023),
    PARTITION p_2023        VALUES LESS THAN (2024),
    PARTITION p_2024        VALUES LESS THAN (2025),
    PARTITION p_future      VALUES LESS THAN MAXVALUE
);

-- 清理 2022 年之前的历史数据（直接删分区，比 DELETE 快得多）
ALTER TABLE `orders` DROP PARTITION p_before_2022;

-- 添加新分区
ALTER TABLE `orders` ADD PARTITION (PARTITION p_2025 VALUES LESS THAN (2026));
```

### LIST 分区

```sql
-- 按订单状态分区（LIST 必须用 VALUES IN 明确列举每个值）
CREATE TABLE `order_by_status` (
    `id`     BIGINT NOT NULL,
    `status` INT NOT NULL,
    `amount` DECIMAL(10,2),
    PRIMARY KEY (`id`, `status`)
) PARTITION BY LIST (`status`) (
    PARTITION p_new       VALUES IN (10),         -- 新建
    PARTITION p_paid      VALUES IN (20),         -- 已支付
    PARTITION p_done      VALUES IN (30),         -- 已完成
    PARTITION p_cancelled VALUES IN (15, 99)      -- 取消/异常（可包含多个值）
);
```

### HASH 分区

```sql
-- 按月份均匀分为 12 个分区
CREATE TABLE `logs` (
    `id`       BIGINT NOT NULL,
    `log_date` DATE NOT NULL,
    `message`  TEXT,
    PRIMARY KEY (`id`, `log_date`)
) PARTITION BY HASH(MONTH(`log_date`))
PARTITIONS 12;
```

### RANGE COLUMNS 分区（扩展）

RANGE COLUMNS 是 RANGE 的增强版，支持多列、支持字符串和日期（不限于整数）：

```sql
CREATE TABLE `t` (
    `a` INT,
    `b` DATE,
    `c` VARCHAR(10)
) PARTITION BY RANGE COLUMNS(`b`, `a`) (
    PARTITION p0 VALUES LESS THAN ('2023-01-01', 1000),
    PARTITION p1 VALUES LESS THAN ('2024-01-01', 2000),
    PARTITION p2 VALUES LESS THAN (MAXVALUE, MAXVALUE)
);
```

### 分区管理命令

```sql
-- 查看分区信息
SELECT * FROM information_schema.PARTITIONS
WHERE TABLE_NAME = 'orders' AND TABLE_SCHEMA = 'mydb';

-- 查看表状态（含分区）
SHOW TABLE STATUS LIKE 'orders';

-- 优化分区（重建索引、压缩碎片）
OPTIMIZE TABLE `orders`;

-- 拆分分区：将 p_future 拆分为 p_2025 和 p_new_future
ALTER TABLE `orders` REORGANIZE PARTITION p_future INTO (
    PARTITION p_2025   VALUES LESS THAN (2026),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);

-- 合并分区：将 p_2022 和 p_2023 合并
ALTER TABLE `orders` REORGANIZE PARTITION p_2022, p_2023 INTO (
    PARTITION p_2022_2023 VALUES LESS THAN (2024)
);

-- 修改 HASH 分区数量（减少分区）
ALTER TABLE `logs` COALESCE PARTITION 6;
```

---

## 九、权限管理

```sql
-- 创建用户
CREATE USER 'dev_user'@'%' IDENTIFIED BY 'StrongPassword123!';

-- 授予权限（指定库）
GRANT SELECT, INSERT, UPDATE ON `mydb`.* TO 'dev_user'@'%';

-- 授予所有权限（慎用）
GRANT ALL PRIVILEGES ON *.* TO 'dev_user'@'%';

-- 查看权限
SHOW GRANTS FOR 'dev_user'@'%';

-- 撤销权限
REVOKE INSERT ON `mydb`.* FROM 'dev_user'@'%';

-- 删除用户
DROP USER 'dev_user'@'%';

-- 刷新权限（修改 mysql.user 表后需执行）
FLUSH PRIVILEGES;
```

---

## 十、备份与恢复

```bash
# 导出单个表
mysqldump -h localhost -u root -p mydb user > /backup/user.sql

# 导出整个数据库
mysqldump -h localhost -u root -p mydb > /backup/mydb.sql

# 导出多个表
mysqldump -h localhost -u root -p mydb user order > /backup/mydb_partial.sql

# 导入
mysql -u root -p mydb < /backup/mydb.sql

# 或在 MySQL 内执行
# source /backup/mydb.sql
```

:::tip 生产备份建议
- 使用 `--single-transaction` 对 InnoDB 表做一致性快照，不锁表：
  ```bash
  mysqldump --single-transaction -u root -p mydb > /backup/mydb.sql
  ```
- 定期备份并验证备份文件可恢复
- 重要系统配置**主从复制**作为实时备份
  :::

---

## 十一、三大范式

| 范式 | 要求 | 违反示例 |
|---|---|---|
| **1NF** | 每列不可再分（原子性） | 把"省市区"存在一个字段里 |
| **2NF** | 满足 1NF + 非主键列完全依赖于主键 | 联合主键(订单ID+商品ID)的表里存了只依赖订单ID的"客户名" |
| **3NF** | 满足 2NF + 非主键列之间无传递依赖 | 表里既存"部门ID"又存"部门名称"（部门名称依赖部门ID，不直接依赖主键） |

:::tip 反范式设计
高并发场景下，适当**反范式**（冗余字段）可减少 JOIN，提升查询性能。例如订单表冗余存储用户名、商品名，避免每次都关联查询。范式和性能之间需要根据业务取舍。
:::
