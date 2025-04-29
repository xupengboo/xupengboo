---
title: Hive 搭建
order: 5
---

:::info

:::



## 一、安装 Hive

```shell
# 1. 解压Hive压缩包
tar -zxvf /opt/software/apache-hive-3.1.3-bin.tar.gz -C /opt/module/
mv /opt/module/apache-hive-3.1.3-bin/ /opt/module/hive

# 2. 配置环境变量
sudo vim /etc/profile.d/env.sh
#HIVE_HOME
export HIVE_HOME=/opt/module/hive
export PATH=$PATH:$HIVE_HOME/bin

source /etc/profile.d/env.sh

# 3. 初始化元数据库（默认是derby数据库，也可以改成MySQL同样需要schematool操作初始化。）
bin/schematool -dbType derby -initSchema

# 4. 默认的日志在 /tmp/用户名/hive.log 下面
tail -f /tmp/用户名/hive.log
```

## 二、Derby 数据库的缺点

使用 derby 时，同一时间多个用户连接，会出现一下问题：

```shell
tail -f hive.log


Caused by: ERROR XSDB6: Another instance of Derby may have already booted the database /opt/module/hive/metastore_db.
        at org.apache.derby.iapi.error.StandardException.newException(Unknown Source)
        at org.apache.derby.iapi.error.StandardException.newException(Unknown Source)
        at org.apache.derby.impl.store.raw.data.BaseDataFileFactory.privGetJBMSLockOnDB(Unknown Source)
        at org.apache.derby.impl.store.raw.data.BaseDataFileFactory.run(Unknown Source)
...

```

原因在于Hive默认使用的元数据库为 derby。**derby数据库的特点是同一时间只允许一个客户端访问。如果多个Hive客户端同时访问，就会报错。**所以，更多的 Hive 的元数据存储一般回换为 `MySQL` 或者`PostgreSQL` 。

## 三、切换 MySQL 源数据库

1. 需要安装好对应的 MySQL 库：

![image-20250428174455094](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250428174455094.png)

2. 将对应MySQL JDBC的驱动拷贝到 Hive 的 lib 目录下：

```shell
cp /opt/software/hive/mysql-connector-j-8.0.31.jar $HIVE_HOME/lib
```

3. 在`$HIVE_HOME/conf` 目录下新建`hive-site.xml` 文件：

- `vim $HIVE_HOME/conf/hive-site.xml` 

```xml
<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>

<configuration>
    <!-- jdbc连接的URL -->
    <property>
        <name>javax.jdo.option.ConnectionURL</name>
        <value>jdbc:mysql://hadoop102:3306/metastore?useSSL=false</value>
    </property>
    
    <!-- jdbc连接的Driver-->
    <property>
        <name>javax.jdo.option.ConnectionDriverName</name>
        <value>com.mysql.jdbc.Driver</value>
    </property>
    
	<!-- jdbc连接的username-->
    <property>
        <name>javax.jdo.option.ConnectionUserName</name>
        <value>root</value>
    </property>

    <!-- jdbc连接的password -->
    <property>
        <name>javax.jdo.option.ConnectionPassword</name>
        <value>0818</value>
    </property>

    <!-- Hive默认在HDFS的工作目录 -->
    <property>
        <name>hive.metastore.warehouse.dir</name>
        <value>/user/hive/warehouse</value>
    </property>
    
    
</configuration>
```

4. 初始化 Hive 元数据库：

```shell
# 创建库
mysql -uroot -p0818
mysql> create database metastore;
Query OK, 1 row affected (0.09 sec)
mysql> quit
Bye

# 初始化 Hive 元数据库
bin/schematool -dbType mysql -initSchema -verbose
```

5. 验证元数据是否配置成功。

```shell
# 启动 Hive
bin/hive

# 使用 Hive
hive> show databases;
hive> show tables;
hive> create table student(id int, name string);
hive> insert into student values(1,"zhangsan");
hive> select * from student;
```

6. 查看 MySQL 中的元数据

```shell
mysql -uroot -p0818

mysql> show databases;
mysql> use metastore;
mysql> show tables;
```

（1）查看元数据库中存储的库信息：` select * from DBS;` 

![image-20250428182420232](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250428182420232.png)

（2）查看元数据库中存储的表信息：`select * from TBLS` 

![image-20250428182518194](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250428182518194.png)

（3）查看元数据库中存储的表中列相关信息：`select * from COLUMNS_V2;` 

![image-20250428182545749](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250428182545749.png)

## 四、Hive 的连接方式

### 1. 第一种方式：本地连接

本地连接 `bin/hive` 启动，只能本地连接。

### 2. 第二种方式：元数据服务

使用**元数据服务**的方式访问 Hive，适合第三方连接。

```shell
# 1. 配置 hive-site.xml 文件：
vi conf/hive-site.xml
<!-- 指定存储元数据要连接的地址 -->
<property>
	<name>hive.metastore.uris</name>
	<value>thrift://hadoop102:9083</value>
</property>

# 2. 启动 metastore (启动元数据服务)
hive --service metastore

# 3. 新开窗口，访问测试
bin/hive 
```

### 3. 第三种方式：通过 Hiveserver2 ，使用 JDBC 访问

Hive的`Hiveserver2` 服务的作用是提供`jdbc/odbc` 接口，为用户提供远程访问Hive数据的功能，例如用户期望在个人电脑中访问远程服务中的Hive数据，就需要用到`Hiveserver2`。

![image-20250429094704380](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250429094704380.png)

1. 启动元数据服务：`hive --service metastore`， JDBC是依赖于元数据服务的。
2. 在`hive-site.xml` 文件中添加如下配置信息：

```xml
<!-- 指定hiveserver2连接的host -->
<property>
	<name>hive.server2.thrift.bind.host</name>
	<value>hadoop102</value>
</property>

<!-- 指定hiveserver2连接的端口号 -->
<property>
	<name>hive.server2.thrift.port</name>
	<value>10000</value>
</property>
```

2. 启动 `Hiveserver2` 

```shell
bin/hive --service hiveserver2
```
> 第一次启动，时间可能很久。

3. 启动 beeline 客户端：

```shell
bin/beeline -u jdbc:hive2://hadoop102:10000 -n xupengboo
```

![image-20250429101445997](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250429101445997.png)

### 4. 后台脚本运行

正常通过下面命令，就可以后台启动了：

```bash
nohup hive --service metastore 2>&1 &
nohup hive --service hiveserver2 2>&1 &
```

也可以通过写脚本来实现：`vim $HIVE_HOME/bin/hiveservices.sh` 

```bash
#!/bin/bash

HIVE_LOG_DIR=$HIVE_HOME/logs
if [ ! -d $HIVE_LOG_DIR ]
then
	mkdir -p $HIVE_LOG_DIR
fi

#检查进程是否运行正常，参数1为进程名，参数2为进程端口
function check_process()
{
    pid=$(ps -ef 2>/dev/null | grep -v grep | grep -i $1 | awk '{print $2}')
    ppid=$(netstat -nltp 2>/dev/null | grep $2 | awk '{print $7}' | cut -d '/' -f 1)
    echo $pid
    [[ "$pid" =~ "$ppid" ]] && [ "$ppid" ] && return 0 || return 1
}

function hive_start()
{
    metapid=$(check_process HiveMetastore 9083)
    cmd="nohup hive --service metastore >$HIVE_LOG_DIR/metastore.log 2>&1 &"
    [ -z "$metapid" ] && eval $cmd || echo "Metastroe服务已启动"
    server2pid=$(check_process HiveServer2 10000)
    cmd="nohup hive --service hiveserver2 >$HIVE_LOG_DIR/hiveServer2.log 2>&1 &"
    [ -z "$server2pid" ] && eval $cmd || echo "HiveServer2服务已启动"
}

function hive_stop()
{
metapid=$(check_process HiveMetastore 9083)
    [ "$metapid" ] && kill $metapid || echo "Metastore服务未启动"
    server2pid=$(check_process HiveServer2 10000)
    [ "$server2pid" ] && kill $server2pid || echo "HiveServer2服务未启动"
}

case $1 in
"start")
    hive_start
    ;;
"stop")
    hive_stop
    ;;
"restart")
    hive_stop
    sleep 2
    hive_start
    ;;
"status")
    check_process HiveMetastore 9083 >/dev/null && echo "Metastore服务运行正常" || echo "Metastore服务运行异常"
    check_process HiveServer2 10000 >/dev/null && echo "HiveServer2服务运行正常" || echo "HiveServer2服务运行异常"
    ;;
*)
    echo Invalid Args!
    echo 'Usage: '$(basename $0)' start|stop|restart|status'
    ;;
esac
```

## 五、Hive 使用技巧

```shell
bin/hive -help
usage: hive
 -d,--define <key=value>          Variable subsitution to apply to hive
                                  commands. e.g. -d A=B or --define A=B
    --database <databasename>     Specify the database to use
 -e <quoted-query-string>         SQL from command line
 -f <filename>                      SQL from files
 -H,--help                        Print help information
    --hiveconf <property=value>   Use value for given property
    --hivevar <key=value>         Variable subsitution to apply to hive
                                  commands. e.g. --hivevar A=B
 -i <filename>                    Initialization SQL file
 -S,--silent                      Silent mode in interactive shell
 -v,--verbose                     Verbose mode (echo executed SQL to the console)
```

1. `-e` 可以不进入 hive 的交互窗口执行hql语句。

```shell
bin/hive -e "select id from student;"
```

2. `-f` 执行脚本：

```shell
bin/hive -f /opt/module/hive/datas/hivef.sql
```

3. 在 hive cli 命令窗口种，可以查看 hdfs 文件系统：

```shell
hive(default)> dfs -ls /;
```

4. 查看 hive 的所有历史命令记录：

```shell
cd /home/当前用户 # cd /root
# 查看 .hivehistory 文件：
cat .hivehistory 
```

## 六、Hive 常见的属性配置

### 1. 配置 log 存放日志位置

```shell
# 1. 修改`$HIVE_HOME/conf/hive-log4j2.properties.template` 文件名称为 `hive-log4j2.properties`
cd /opt/module/hive/conf
mv hive-log4j2.properties.template hive-log4j2.properties
# 2. 修改
vim hive-log4j2.properties
property.hive.log.dir=/opt/module/hive/logs
```

### 2. Hive 客户端显示当前库和表头

在` vim hive-site.xml` 中加入如下两个配置：

```xml
<property>
    <name>hive.cli.print.header</name>
    <value>true</value>
    <description>Whether to print the names of the columns in query output.</description>
</property>
<property>
    <name>hive.cli.print.current.db</name>
    <value>true</value>
    <description>Whether to include the current database in the Hive prompt.</description>
</property>
```













