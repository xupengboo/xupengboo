# Canal 基本使用

> 功能：主要用于数据库同步。
>
> 推荐参考官方：
>
> - 本地 安装：https://github.com/alibaba/canal/wiki/QuickStart 【学习采用】
> - 基于Docker 安装：https://github.com/alibaba/canal/wiki/Docker-QuickStart

![image-20241226101247282](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241226101247282.png)

# 1. 准备工作

1. 确保 MySQL 已启用 `Binlog` ：

```mysql
# 确保你已经在 MySQL 中正确配置并启用了二进制日志（Binlog）。可以通过以下命令检查：
SHOW VARIABLES LIKE 'log_bin';
SHOW VARIABLES LIKE 'binlog_format';
SHOW VARIABLES LIKE 'server_id';
# log_bin: 应为 ON
# binlog_format: 推荐设置为 ROW
# server_id: 必须唯一（对于多实例）
```
> 注意：如果MySQL是Docker配置的，可以去对一个的容器卷配置一个 `default.cnf`  ：、
>
> - `-v /itholmes/mysql/conf:/etc/mysql/conf.d` ： 在这个下面创建一个 `default.cnf` ，这样MySQL启动的时候，也会默认加载该配置中的内容。配置内容，如下：
>
> ```bash
> [mysqld]
> log-bin=mysql-bin # 开启 binlog
> binlog-format=ROW # 选择 ROW 模式
> server_id=1 # 配置 MySQL replaction 需要定义，不要和 canal 的 slaveId 重复
> bind-address = 0.0.0.0
> ```


2. 创建 Canal 用户并授予权限：

- Canal 需要一个专用的 MySQL 用户，并且需要对数据库的 Replication 权限。

```mysql
CREATE USER 'canal'@'%' IDENTIFIED BY '0818';
GRANT REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'canal'@'%';
GRANT SELECT ON performance_schema.* TO 'canal'@'%'; # 授予 canal 用户对 performance_schema 的访问权限
FLUSH PRIVILEGES;
```

# 2. 下载安装部署 Canal

```bash
# 下载 canal, 访问 release 页面 , 选择需要的包下载, 如以 1.1.7 版本为例
wget https://github.com/alibaba/canal/releases/download/canal-1.1.7/canal.deployer-1.1.7.tar.gz
wget https://github.com/alibaba/canal/releases/download/canal-1.1.7/canal.adapter-1.1.7.tar.gz
https://github.com/alibaba/canal/releases/download/canal-1.1.7/canal.admin-1.1.7.tar.gz

# 创建本地 canal目录
mkdir /usr/local/canal

# 解压缩
tar -zxvf canal.deployer-1.1.7.tar.gz -C /usr/local/canal
```

| 文件名                 | 功能           | 主要作用                             | 适用场景                               |
| ---------------------- | -------------- | ------------------------------------ | -------------------------------------- |
| `canal.adapter-1.1.7`  | 数据同步适配器 | 同步增量数据到目标存储系统。         | 数据集成（如 MySQL → Elasticsearch）。 |
| `canal.admin-1.1.7`    | 管理与监控平台 | 管理和监控 Canal Server 和 Adapter。 | 集中化管理多个 Canal 实例。            |
| `canal.deployer-1.1.7` | 核心服务模块   | 捕获 MySQL 的 `binlog` 增量数据。    | CDC 系统的基础模块。                   |
| `canal.example-1.1.7`  | 示例与模板     | 快速上手与验证配置。                 | 测试和学习使用。                       |

> 选择组件时，可以根据实际需求：
>
> - 仅做数据捕获：只需要 `canal.deployer`。
>
> - 需要同步到目标系统：需要 `canal.deployer` + `canal.adapter`。
>
> - 需要管理和监控：增加 `canal.admin`。

# 3. 配置 Canal

讲一讲 Canal 的 `destination` ：

- 在 Canal 中，多个 `destination` 可以同时存在，每个 `destination` 对应一个特定的 MySQL 实例或数据库。这使得 Canal 可以从多个 MySQL 实例或数据库中同步数据。

- 每个 `destination` 的配置是独立的，因此你可以根据需要配置不同的数据库连接、表、过滤器等。

配置修改 `canal.properties` ：

```bash
vi conf/example/instance.properties


```

# 4. 查看 Canal 是否正常启动

1. 看日志，看 Canal 下面的 `log` 日志信息。

![image-20241226133611637](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241226133611637.png)

2. MySQL执行：`SHOW PROCESSLIST;` 检查 Canal 是否有活跃的 `Binlog` 订阅：

```sql
SHOW PROCESSLIST;

| Id   | User  | Host         | db   | Command | Time | State | Info                |
| 1234 | canal | 192.168.1.1  | NULL | Binlog Dump | 120  | Waiting for master to send event |
```

3. 启动 Canal 客户端：

```bash
/usr/local/canal/bin/./canal-adapter.sh
```



