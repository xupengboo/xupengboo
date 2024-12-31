# Canal 基本使用

> 功能：主要用于数据库同步。
>
> 流程：`MySQL binlog` ->  `Canal`  -> `Kafka Topics` 
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
CREATE USER canal IDENTIFIED BY 'canal';
GRANT SELECT, REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'canal'@'%';
-- GRANT ALL PRIVILEGES ON *.* TO 'canal'@'%' ;
FLUSH PRIVILEGES;
```

# 2. 下载安装部署 Canal

```bash
# 下载 canal, 访问 release 页面 , 选择需要的包下载, 如以 1.1.7 版本为例
wget https://github.com/alibaba/canal/releases/download/canal-1.1.7/canal.deployer-1.1.7.tar.gz
wget https://github.com/alibaba/canal/releases/download/canal-1.1.7/canal.admin-1.1.7.tar.gz
# wget https://github.com/alibaba/canal/releases/download/canal-1.1.7/canal.adapter-1.1.7.tar.gz

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

# 3. 安装 Canal Admin UI

1. 解压 `canal admin` 

```bash
tar -zxvf canal.admin-1.1.7.tar.gz -C canal_admin
```

2. 修改配置文件

```bash
vim application.yml
```

![image-20241230165901919](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241230165901919.png)

3. 初始化 `admin_manager` 数据库：（在 conf 目录【 `/opt/canal/canal_admin/conf`】下面 ：有个 `admin_manager` ）

```bash
mysql -uroot -p -h数据库的ip
# 导入初始化SQL
source conf/canal_manager.sql
```

4. 进入 `bin` 目录下，启动 `canal admin` 服务

```bash
./startup.sh
```

5. 访问 `http://center-server:8089/` ，查看 UI 页面。

- 默认，管理员账号为：`admin` / `123456` 

# 4. 配置 Canal Admin

1. 新建集群。

- 需要 zookeeper 地址。

![image-20241230170529124](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241230170529124.png)

2. 修改主配置：

![image-20241230170630607](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241230170630607.png)

3. `canal.properties` 载入模板：

![image-20241230170655520](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241230170655520.png)

模板配置，修改如下：

```properties
# IP为admin服务地址
canal.admin.manager = center-server:8089
# zookeeper配置，集群用逗号隔开，不部署canal集群可以省略
canal.zkServers = center-server:2181
# 发送方式 tcp, kafka, rocketMQ, rabbitMQ
canal.serverMode = kafka
# kafka配置，集群用逗号隔开
kafka.bootstrap.servers = center-server:9092
```

保存即可。

# 5. 部署 Canal Deploy 服务

1. 安装 Canal Deploy 服务

```bash
tar -zxvf canal.deployer-1.1.7.tar.gz -C canal_deploy
```

2. 修改 `canal_local.properties` 配置：

```bash
vim canal_local.properties
```

![image-20241230171243289](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241230171243289.png)

3. 进入 bin 目录，进行启动：

```bash
./startup.sh local
```

4. 管理页面就应该多了个 Server 服务。

![image-20241230171441821](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241230171441821.png)

# 6. 配置 监控实例 (instance)

1. 新建 `instance` 实例。

![image-20241230171622422](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241230171622422.png)

2. 载入模板：

![image-20241230171723012](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241230171723012.png)

修改配置如下：

```properties
#作为数据库slave的id，单独部署canal.deployer一定不要重复，通过admin配置方式好像不用
canal.instance.mysql.slaveId=1235
#数据库地址
canal.instance.master.address=center-server:3306
# username/password
canal.instance.dbUsername=canal
canal.instance.dbPassword=canal
# table regex监听的表名，这个配置比较重要。此配置的意思是监听testcanal库下的stu表,topic为 testcanal_stu。
canal.instance.filter.regex=testcanal\\.stu
# mq 默认 发送的topic名字 ，如果固定topic，就配置到这个就好，不用配置下面的动态
canal.mq.topic=example
# 如需动态topic则配置dynamicTopic
canal.mq.dynamicTopic=.*\\..*
# canal.mq.partition表示数据写到kafka中哪个分片中，此时数据量不大 是只放到0分区里
canal.mq.partition=0
#如果数据量大则需要配置分区数与 表名hash计算分区。官方说：会有热点表分区过大问题
#canal.mq.partitionsNum=3
#canal.mq.partitionHash=.*\\..*
```

# 7. 搭建 `KafKa` 和 `Kafdrop`

见：[Github - xupengboo - Docker单节点运维部署命令.md](https://github.com/xupengboo/xupengboo/blob/master/2.%E8%BF%90%E7%BB%B4%E9%83%A8%E7%BD%B2/Docker/3.%20Docker%E5%8D%95%E8%8A%82%E7%82%B9%E8%BF%90%E7%BB%B4%E9%83%A8%E7%BD%B2%E5%91%BD%E4%BB%A4.md#kafka)

> 学习为主，推荐，官方部署 `kafka`：https://kafka.apache.org/quickstart