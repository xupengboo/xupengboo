# 一主一从的MySQL集群搭建

> 一主一从数据库搭建过程解释。

# 二进制日志 

## 1. 二进制日志

二进制日志（**Binary Log**，简称 **binlog**）是 MySQL 用于记录所有更改数据库状态的事件（如插入、更新、删除操作）的日志文件。它不仅记录了数据库的更新操作，还可以用来恢复数据、实现主从复制等功能。

1.1 数据恢复

二进制日志记录了所有数据库的更改操作，它可以用来执行 **Point-in-Time Recovery (PITR)**，即在某个时间点恢复数据库到某个状态。比如，当数据库崩溃时，可以通过备份和二进制日志将数据库恢复到崩溃前的某个时刻。

1.2 主从复制

MySQL 的主从复制依赖于二进制日志。主服务器将所有的数据更改事件写入二进制日志，从服务器则读取主服务器的二进制日志并执行相同的操作，以保持数据库的一致性。主从复制的过程是：

- **主服务器**：记录所有数据修改操作（INSERT、UPDATE、DELETE）到二进制日志。
- **从服务器**：通过读取主服务器的二进制日志，将这些修改操作应用到从服务器的数据库中。

1.3 数据同步与备份

二进制日志不仅用于主从复制，还能用于数据同步。例如，在分布式系统中，可以通过读取并执行二进制日志事件，保持不同节点的数据同步。二进制日志也能用于增量备份，只备份发生变化的数据，而不是整个数据库。

1.4 审计与分析

通过分析二进制日志，可以帮助管理员追踪和审计数据库的变化。例如，您可以查看哪些查询导致了数据的修改，或者用它来进行数据库活动的分析。对于一些敏感操作，管理员可以依赖二进制日志进行追踪。

## 2. 二进制日志的配置

在 MySQL 中，二进制日志通常是通过配置文件启用的。默认情况下，二进制日志是关闭的。启用二进制日志的配置项如下：

```bash
[mysqld]
server-id = 1
bind-address = 0.0.0.0 # 允许从节点连接
# log-bin = mysql-bin # 二进制文件启动，可能一开始无法创建文件，可以一开始注释掉，先动起mysql，之后再修改过来。
# binlog-do-db = test_db # 指定特定数据库记录
```

- **log-bin**：启用二进制日志，并指定日志文件存放的位置。
- **server-id**：设置一个唯一的服务器 ID，在主从复制中，每个服务器必须有一个唯一的 `server-id`。



# 配置MySQL主从配置

**MySQL 主节点：**

在主节点上，您需要创建复制用户并配置主节点：

```sql
CREATE USER 'replica_user'@'%' IDENTIFIED BY 'password';
GRANT REPLICATION SLAVE ON *.* TO 'replica_user'@'%';
FLUSH PRIVILEGES;
SHOW MASTER STATUS;
```

**MySQL 从节点：**

在从节点上设置复制，并指定主节点信息：

```sql
CHANGE MASTER TO
  MASTER_HOST='mysql-master-0.mysql-master',
  MASTER_USER='replica_user',
  MASTER_PASSWORD='password',
  MASTER_LOG_FILE='mysql-bin.000001',  -- 使用主节点 SHOW MASTER STATUS 的值
  MASTER_LOG_POS=154;  -- 使用主节点 SHOW MASTER STATUS 的值

START SLAVE;
```

> TODO 配置从节点，暂未实现。