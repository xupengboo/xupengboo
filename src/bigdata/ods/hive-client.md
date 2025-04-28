---
title: Hive 搭建
order: 5
---

:::info

:::



## 1. 安装 Hive

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
```

## 2. derby 数据库的缺点

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

## 3. 切换 MySQL 源数据库

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





