title: MySQL 基础
order: 1


# 1. ﻿初识MySQL

> 程序员岗位必备技能：MySQL

数据库(DB,DataBase) 作用：存储数据，管理数据。

linux系统，安装mysql步骤：[https://developer.aliyun.com/article/863603](https://developer.aliyun.com/article/863603)。

window系统，安装mysql步骤：[1.5 MySQL(压缩包) 安装配置](#1.5 MySQL(压缩包) 安装配置)

linux系统，开启远程访问：

- 安装完成mysql后，远程ssh访问，需要给对应用户修改配置如下：(设置为%，所有ip都可访问)

![image-20250122134559003](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122134559003.png)


## 1.2 数据库分类
关系型数据库(SQL)：就像Excel表格一样，它是有行有列的。

- Mysql, Oracle, Sql Server, DB2, SQLite
- 通过表和表之间，行和列之间的关系进行数据的存储。

非关系型数据库(Not Only SQL , NoSQL)：`{ key : value }` 

- Redis， MonDB
- 非关系型数据库是以对象存储，通过对象自身的属性来决定。


DBMS(数据库管理系统)

- 数据库的管理软件，科学有效的管理我们的数据。维护和获取数据。
- MySQL是一个关系型数据库管理系统。


## 1.3  MySQL 简介

MySQL是一个关系型数据库管理系统。

- 前世：瑞典MySQL AB公司
- 今生：属于Oracle旗下产品

MySQL是最好的RDBMS（Relational Database Management System ,关系数据库管理系统）应用软件之一。

MySQL是开源的数据库软件。

优点：体积小，速度快，总体拥有成本低。

**MySQL通常即适用于中小型网站，也适用大型网站(MySQL之所以能做大型网站，是因为有个东西叫做集群)**。

## 1.4 MySQL 安装
安装建议：

- 官网下载：https://dev.mysql.com/downloads/mysql/
 - **尽量不要使用 exe 进行安装，它会走注册表，卸载的时候很麻烦，尽可能使用压缩包安装。**


## 1.5 MySQL(压缩包) 安装配置

1. **解压** 下载下来的MySQL压缩包。
2. **配置环境变量**，只需要配置path中，mysql的bin目录下即可。
3. 在解压的MySQL目录下，**新建MySQL配置文件 my.ini，并且配置my.ini文件如下** ：

**my.ini配置信息如下**：

```my.ini
[mysqld]
#设置时区为东八区，此项设置后，在连接MySQL的时候可以不用每次都手动设置时区
default-time-zone = '+8:00'
# 设置3306端口
port=3306
# 设置mysql的安装目录，记得切换成自己的路径
basedir=D:\mysql\mysql2\mysql-8.0.27-winx64
# 设置mysql数据库的数据的存放目录
datadir=D:\mysql\mysql2\mysql-8.0.27-winx64\data
# 允许最大连接数
max_connections=200
# 允许连接失败的次数。这是为了防止有人从该主机试图攻击数据库系统
max_connect_errors=10
# 服务端使用的字符集默认为UTF8
character-set-server=utf8
# 创建新表时将使用的默认存储引擎
default-storage-engine=INNODB
# 默认使用“mysql_native_password”插件认证
default_authentication_plugin=mysql_native_password
[mysql]
# 设置mysql客户端默认字符集
default-character-set=utf8
[client]
# 设置mysql客户端连接服务端时默认使用的端口
port=3306
default-character-set=utf8
```

4. **启动管理员模式下的CMD，并将路径切换至MySQL下的bin目录，然后输入`mysqld -install`（安装mysql，这一步就是将MySQL安装到服务中）**。
>💡注意：如果，这里安装出现下面情况：
>
>![image-20250122134624451](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122134624451.png)
>说明已经安装了MySQL服务了，使用sc query mysql查看一下，也可以使用sc delete mysql删除一下服务就可以了。

5. **再输入`mysqld --initialize-insecure --user=mysql` ，进行初始化数据库**。初始化后，我们前面在my.ini设置的data就会出现在目录中，data中包括一些初始后的mysql数据库。

6. **启动MySQL，`net start mysql`（启动mysql服务），然后用命令`mysql -u root -p`(注意-p后面不要加空格，因为p是代表密码，空格算是密码一部分) 进入mysql管理页面**。

7. **进入mysql，第一件事情就是修改密码：`update mysql.user set authentication_string=password('123456') where user='root' and Host = 'localhost'`;**
	
	> 💡注意：MySQL8以上的版本，没有了 password 字段和 passwrod() 函数，所以不能使用上面的语句进行修改，而是使用alter语句进行修改：`alter user 'root'@'localhost' identified by 'newpassword'`;


9. **输入`flush privileges;`刷新权限**。
10. **修改 my.ini 文件删除最后一句skip-grant-tables,可以使用#注释掉。**
11. **重启mysql即可正常使用，net stop mysql , net start mysql**

## 1.6 SQLyog使用的 注意事项

连接数据库：(这里我连接云端的，一般的都在本地就好)

![image-20250122134650547](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122134650547.png)

创建数据库时：字符集和数据库排序选择方面（推荐）：

![image-20250122134712567](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122134712567.png)

我们 可以先查看一下数据库版本：

```sql
select version()    //查看数据库版本
```

每一个sqlyog的执行操作，本质就是对应了一个sql，可以在软件的历史记录中查看

![image-20250122134758423](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122134758423.png)

创建表： school -》table(表) -》右键创建表

![image-20250122134830960](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122134830960.png)

查看表格，添加数据：student -》 open table(打开表) 直接修改数据就好。

![image-20250122135054365](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122135054365.png)

这里还是要注意，这些sqlyog的操作，我们都可以在History(历史)中看到。

![image-20250122135240488](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122135240488.png)

## 1.7 连接数据库 和 一些基本命令
**命令行连接：**

1. `mysql -uroot -p  --连接数据库`。

2. `update mysql.user set authentication_string=password('123456') where user='root' and Host = 'localhost'`;  该语法的解释如下图：
   
   ![image-20250122135337387](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122135337387.png)
   
3. `flush privileges;` 刷新权限

- 在Mysql中，所有的语句使用 ; 结尾！

```sql
show databases; --查看所有的数据库。
mysql> use mysql(数据库名) --切换数据库。
show tables; -- 查看数据库中所有的表。
describe 表名;  --显示数据库中表的所有信息。
create database 数据库名; --创建一个数据库。
exit; --退出连接。
-- -- (sql语言本来的注释) mysql单行注释，在sqlyog里面可以用#号注释(#注释本意上还是 -- 注释)
\*   *\ -- mysql多行注释
```

- 三种程序猿

  ![image-20250122135701216](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122135701216.png)

# 2. 操作数据库

总体步骤：操作数据库 > 操作数据库中的表 > 操作数据库中表的数据 

> 💡注意：mysql的关键字不区分大小写！

## 2.1 操作数据库

1. 创建数据库


```sql
create database [if not exists] 数据库名;
-- if not exists 在这意思就是如果不存在，就创建该数据库。
```
>  💡注意：[ ]内部的都是可选的。

2. 删除数据库

```sql
drop database [if exists] 数据库名;
-- if exists 在这意思就是如果存在，就删除该数据库。
```

3. 使用数据库

```sql
use `数据库名`; -- 切换数据库
```

 如果定义的表明或者字段名是一个特殊的字符，我们在使用时，可以使用 ``(tab键上面的那个符号)来修饰。如下：

![image-20250122135724409](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122135724409.png)

![image-20250122135736959](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122135736959.png)

4. 查看数据库

```sql
show databases; -- 查看所有数据库
```

## 2.2 数据库的数据类型(列类型)

**数值**：

- tingint -- 十分小的数据，它只是占了1个字节。
- smallint -- 较小的数据，它占了2个字节。
- mediumint -- 中等大小的数据 ，它占了3个字节。
- int -- 标准的整数，占了4个字节。
- big -- 较大的数据 ，它占8个字节。
- float -- 浮点数，单精度，它占4个字节。
- double  -- 浮点数，双精度 ，它占8个字节。
- decimal -- 字符串形式的浮点数 (金融计算的时候通常使用它)

**常用的需要记住的int，float，double，decimal。**

**字符串**：
- char -- 字符串固定大小的范围：0~255(Ascii码)
- varchar -- 可变长字符串范围：0~65535 (常用的String),例如：常用的变量 String保存。
- tinytext -- 微型文本 范围：2^8 - 1 ，例如：小型博客文章
- text -- 文本串 范围：2^16 - 1 。(保存大文本)

**时间日期**：
- date -- YYYY-MM-DD 日期格式
- time -- HH:mm:ss 时间格式 
- datatime -- YYYY-MM-DD HH:mm:ss ，将上面两个格式加起来，它是最常用的。
- timestamp -- 时间戳，(1970.1.1，到现在的毫秒数。)时间戳也是最常用的。
- year -- 年份表示

**null**：

- 没有值，未知
- 注意，不要使用NULL进行运算。(如果用NULL进行运算，结果始终为NULL)


## 2.3 数据库的字段属性
**Unsigned**：
- 无符号的整数。
- 声明了该列不能声明为负数。

**zerofill**：
- 0填充的。
- 意思就是不足的位数，使用0来填充。

**自增：(auto incr)**

- 通常理解为自增，意思就是自动在上一条记录的基础上+1(默认)。
- 通常用来设计唯一的主键~index，必须是整数类型。
- 可以自定义设置主键自增的起始值和步长。

![image-20250122135754831](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122135754831.png)


**非空，NULL ，Not Null**：
- 假设设置为 not null(非空) ，如果不给它赋值就会报错！
- NULL, 如果不填写值，默认就是null。

**默认：(default)**

- 设置默认的值。
- 意思就是如果不指定该列的值，则会有默认的值取代。

另外几个字段：

![image-20250122135808029](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122135808029.png)

## 2.4 创建数据库表（命令行）
 创建语句格式要记住：
 ```sql
-- 注意点，使用英文(),表的名称和字段尽量使用``括起来。
-- AUTO_INCREMENT自增。
-- COMMENT注释最好每行都添加。
-- DEFAULT NULL意思就是默认是NULL。
-- PRIMARY KEY 主键，一般一个表只有一个唯一的主键
CREATE TABLE IF NOT EXISTS `student` (
	`id` INT(4) NOT NULL AUTO_INCREMENT COMMENT '学号',
	`name` VARCHAR(30) NOT NULL DEFAULT '匿名' COMMENT '姓名',
	`pwd` VARCHAR(30) NOT NULL DEFAULT '123456' COMMENT '密码',
	`sex` VARCHAR(2) NOT NULL DEFAULT '女' COMMENT '性别',
	`birthday` DATETIME DEFAULT NULL COMMENT '出生日期',
	`address` VARCHAR(100) DEFAULT NULL COMMENT '家庭住址',
	`email` VARCHAR(50) DEFAULT NULL COMMENT '邮箱',
	
	PRIMARY KEY (`id`) -- 可以设置在上面的id中，但是为了更明显可以直接单独定义出来。
 )ENGINE=INNODB DEFAULT CHARSET=utf8
 -- ENGINE=INNODB DEFAULT CHARSET=utf8 是来表的类型和字符集设置
 ```
 **格式**：
 ```sql
 CREATE TABLE [IF NOT EXISTS] `表名` (
	`字段名` 列类型 [属性] [索引] [注释],
	`字段名` 列类型 [属性] [索引] [注释],
	......
	`字段名` 列类型 [属性] [索引] [注释],
)[表的类型] [字符集设置] [注释]
 ```

**常用表的命令**：

- 像这些show create database/table ，都是反向操作获取创建表的命令行。

 ```sql
SHOW CREATE DATABASE school; -- 查看创建数据库的语句
SHOW CREATE TABLE student; -- 查看student数据表的定义语句
DESC student -- 显示表的结构
 ```

## 2.5 数据表的类型
```sql
engine = INNODB; -- 默认使用。
engine = MYISAM; -- 早些年使用的。
-- 在创建表的时候，这些是配合engine定义的。
```

|  | MYISAM| INNODB |
|--|--|--|
|事务支持|不支持|支持|
| 数据行锁定 | 不支持 | 支持 |
| 外键约束 | 不支持 | 支持 |
| 全文索引 | 支持 | 不支持 |
| 表空间的大小 | 较小 | 较大，约为2倍的myisam |

**MYISAM和INNODB的优缺点**：
- MYISAM -- 节约空间，速度较快。
- INNODB -- 安全性高，事务的处理，多表多用户操作。

**所有的数据库文件，在物理空间存在的位置，都在我们创建mysql的data中。一个文件夹就对应一个数据库，因此存储的本质上还是文件的存储**！

**MySQL引擎在物理文件上的区别**：
- InnoDB ，在数据库表中只有一个\*.frm文件。

  ![image-20250122135827785](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122135827785.png)

- MYISAM 对应文件:

  - \*.frm -- 表结构的定义文件。
  
  - \*.MYD -- 数据文件(data)。
  
  - \*.MYI -- 索引文件(index)。
    
    ![image-20250122135853933](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122135853933.png)

设置数据库表的字符集编码
```sql
CHARSET=utf8
```
- 不设置的话，回事mysql默认的字符集编码~Latin1(不支持中文的！！！)，因此要定义为utf8。
- 当然，我们可以设置这个默认编码，就是在my.ini中配置默认的编码：`character-set-server=uft8` 。
```sql
character-set-server=uft8
```

## 2.6 修改和删除 表

**修改表**：
- 修改表名： `ALTER TABLE 旧表名 RENAME AS 新表名`;
- 增加表的字段: `ALTER TABLE 表名 ADD 字段名 [INT(11)] [列属性]`;
- 修改表的字段(重命名，修改约束)：
	- 修改约束方式：`ALTER TABLE 表名 MODIFY 字段 [要修改的列属性(类型等)]`; 
	- 重命名方式：`ALTER TABLE 表名 CHANGE 旧字段 新字段 [要修改的列的属性(类型等)]`; 

- 删除表的字段：`ALTER TABLE 表名 DROP 字段`；

```sql
-- 修改表名： ALTER TABLE `旧表名` RENAME AS `新表名`;
ALTER TABLE `teacher` RENAME AS `teacher1`;

-- 增加表的字段: ALTER TABLE `表名` ADD 字段名 [INT(11)] [列属性];
ALTER TABLE `teacher1` ADD age INT(11);

-- 修改表的字段(重命名，修改约束)：
-- ALTER TABLE `表名` MODIFY 字段 [要修改的列属性(类型等)];  -- 修改约束方式
-- ALTER TABLE `表名` CHANGE 旧字段 新字段 [要修改的列的属性(类型等)]; -- 重命名方式
ALTER TABLE `teacher1` MODIFY age VARCHAR(11); -- 修改约束方式
ALTER TABLE `teacher1` CHANGE age age1 INT(11); -- 重命名方式

-- 删除表的字段
ALTER TABLE teacher1 DROP age
```

下面是change和modify的区别：

![image-20250122135915476](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122135915476.png)

**删除表**：

- `DROP TABLE [IF EXISTS] 表名`;

```sql
-- 删除表(如果表存在再删除)
DROP TABLE IF EXISTS teacher1;
```
**所有的创建和删除操作尽量加上判断(if exists 或者 if not exists)，以免报错**。

# 3.  MySQL 数据管理
## 3.1 外键约束(不推荐！)
**方式一：在创建表的时候，增加约束(代码操作)**

- constraint 约束 ， foreign key 外键 ，references 引用。
```sql
-- 创建grade表
CREATE TABLE `grade` (
	`gradeid` INT(10) NOT NULL AUTO_INCREMENT COMMENT '年级id',
	`gradename` VARCHAR(50) NOT NULL COMMENT '年级名称',
	
	PRIMARY KEY (`gradeid`)
)ENGINE=INNODB DEFAULT CHARSET=utf8

-- 学生表的gradeid字段，要去引用年级表的gradeid
-- 1. 定义外键key。
-- 2. 给外键添加约束(执行引用)。
CREATE TABLE IF NOT EXISTS `student` (
	`id` INT(4) NOT NULL AUTO_INCREMENT COMMENT '学号',
	`name` VARCHAR(30) NOT NULL DEFAULT '匿名' COMMENT '姓名',
	`pwd` VARCHAR(30) NOT NULL DEFAULT '123456' COMMENT '密码',
	`sex` VARCHAR(2) NOT NULL DEFAULT '女' COMMENT '性别',
	`birthday` DATETIME DEFAULT NULL COMMENT '出生日期',
	`gradeid` INT(10) `student`NOT NULL COMMENT '学生的年级',
	`address` VARCHAR(100) DEFAULT NULL COMMENT '家庭住址',
	`email` VARCHAR(50) DEFAULT NULL COMMENT '邮箱',
	
	PRIMARY KEY (`id`),
	
	KEY `FK_gradeid` (`gradeid`),
	CONSTRAINT `FK_gradeid` FOREIGN KEY (`gradeid`) REFERENCES `grade` (`gradeid`)
 )ENGINE=INNODB DEFAULT CHARSET=utf8
```

> 💡注意：删除外键关系的表的时候，必须要先删除引用别人的表(从表)，再删除被引用的表。否则报错如下：

![image-20250122135929698](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122135929698.png)

**方式二：创建表成功后，添加外键约束**

- `alter table 表 add constraint 约束名 foreign key (作为外键的列) references 那个表(哪个字段)`

```sql
-- 创建grade表
CREATE TABLE `grade` (
	`gradeid` INT(10) NOT NULL AUTO_INCREMENT COMMENT '年级id',
	`gradename` VARCHAR(50) NOT NULL COMMENT '年级名称',
	
	PRIMARY KEY (`gradeid`)
)ENGINE=INNODB DEFAULT CHARSET=utf8

-- 创建student表
CREATE TABLE IF NOT EXISTS `student` (
	`id` INT(4) NOT NULL AUTO_INCREMENT COMMENT '学号',
	`name` VARCHAR(30) NOT NULL DEFAULT '匿名' COMMENT '姓名',
	`pwd` VARCHAR(30) NOT NULL DEFAULT '123456' COMMENT '密码',
	`sex` VARCHAR(2) NOT NULL DEFAULT '女' COMMENT '性别',
	`birthday` DATETIME DEFAULT NULL COMMENT '出生日期',
	`gradeid` INT(10) NOT NULL COMMENT '学生的年级',
	`address` VARCHAR(100) DEFAULT NULL COMMENT '家庭住址',
	`email` VARCHAR(50) DEFAULT NULL COMMENT '邮箱',
	
	PRIMARY KEY (`id`)
	
 )ENGINE=INNODB DEFAULT CHARSET=utf8

 -- 创建表的时候没有外键关系：
ALTER TABLE `student` ADD CONSTRAINT `FK_gradeid` FOREIGN KEY(`gradeid`) REFERENCES `grade` (`gradeid`)
```

> 💡注意：以上的操作都是物理外键，数据库级别的外键，我们不建议使用！因为，引用过多删除表的时候很难删除！因此，我们不建议使用(避免数据库过多造成的困扰，这里了解即可~) 。

![image-20250122135940527](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122135940527.png)

## 3.2 DML语言
**数据库意义**：数据存储，数据管理。

**DML语言**：数据操作语言。

- `insert into`
- `update 表名 set 字段='value' `
- `delete from`

## 3.3 insert into 添加
**格式**：

- 插入语句(添加)：`INSERT INTO 表明 ([字段名1，字段名2 ,...]) VALUES ('值1','值2',...) , ('值1','值2',...) , ...`;

```sql
-- 插入语句(添加)
-- insert into `表明` ([字段名1，字段名2 ,...]) values ('值1','值2',...);
INSERT INTO `grade` (`gradename`) VALUES('高三三班')
```
![image-20250122140048516](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140048516.png)

如果不写表的字段，它就会一一匹配。容易报错：does't match (不匹配)。

![image-20250122140058677](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140058677.png)

![image-20250122140109557](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140109557.png)


## 3.4 update 修改
**格式**：
- `update 表名 set 字段1='new_value1', 字段2='new_value2' , ... where 条件`
```sql
-- 格式：update `表名` set `字段`='new_value' where 条件
UPDATE `student` SET `name`='匿名' WHERE id = 1;
-- 如果不设置where条件，就会默认修改全部
UPDATE `student` SET `name`='匿名';
-- 修改多个属性(字段值),逗号隔开
UPDATE `student` SET `name`='张三',`email`='123456@qq.com' WHERE id >= 2; 
```
where 运算符 ，常用的案例，如下表格：

![image-20250122140128661](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140128661.png)

> 💡注意：new_value，不一定是一个具体的值，也可以是个变量，函数调用等。如下： 

```sql
-- CURRENT_TIME 获得当前时间
UPDATE `student` SET `birthday`=CURRENT_TIME WHERE `name`='张三' AND `sex`='男'
```
![image-20250122140143764](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140143764.png)


## 3.5 delete from 删除 ，truncate 清空
格式：
- delete语法：`delete from 表名 where 条件`;

>  💡注意：一定添加条件，不添加条件就是全部删除。

```sql
-- 删除student表的全部数据,不过通过这种方式全部删除数据，我们不推荐！我们使用truncate来清空数据。
DELETE FROM `student`
-- 删除id为1的数据
DELETE FROM `student` WHERE id = 1;
```

- truncate作用：完全清空一个数据库表，表的结构和索引约束不会变！
```sql
-- 清空表的数据
TRUNCATE `student`
```

`delete from 表名`  和 `truncate 表名` 的区别

**相同点**：

- 都能删除数据，都不会删除表结构。

不同点：
- truncate -- 重新设置，自增列，计时器会归零。
- truncate -- 不会影响事务。

例如：`delete from 表名` 删除所有数据后，就不会对自动递增重新设置。

![image-20250122140206055](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140206055.png)

![image-20250122140215347](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140215347.png)

# 4. DQL查询数据
## 4.1 DQL(Data Query Language:数据查询语言)
所有的查询操作都用它 select 。

简单的查询，复杂的查询它都能做到。

在数据库中，它是最重要的，使用频率最高的。

## 4.2 指定查询字段

**格式**：

- select语句：`select 字段 as 字段别名 from 表名 表格别名`

```sql
-- 查询全部 select * from `表名`
-- select `字段` from `表名`
SELECT `id`,`name` FROM student 
-- 别名：as ，可以字段起别名，也可以给表名起别名 
SELECT `id` AS 学号,`name` AS 学生名字 FROM student AS 学生
```
![image-20250122140231576](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140231576.png)

**concat(a,b) 函数**：

```sql
-- 函数 concat(a,b),将a拼接到b上面
SELECT CONCAT('姓名:',`coll`) FROM test
-- 函数执行后的结果也是可以其别名的
SELECT CONCAT('姓名:',`coll`) AS 数字 FROM test 
```
![image-20250122140245369](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140245369.png)

**distinct 去重**：

- 作用：去除select 查询出来的结果中重复的数据，重复的数据只有一条。

```sql
-- distinct 去重，需要注意的是要将distinct放到最前面
-- select distinct `字段` [as '别名'] from `表名`
SELECT DISTINCT `coll` AS '数字' FROM test
```

select语句还可以做加减法，查看版本，查看步长，如下：

![image-20250122140259203](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140259203.png)

## 4.3 where 条件
where作用：检索数据中 符合条件 的值。

逻辑运算符：

![image-20250122140312387](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140312387.png)

模糊查询：

- 比较运算符

![image-20250122140330345](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140330345.png)
- like ，% ，_ 这三个符号的使用：

```sql
-- like, %(代表0到任意个字符), _(后面有一个字符)

-- 查询开头有王的
SELECT * FROM `student` WHERE `name` LIKE '王%';
-- 查询开头是王，几个 _符号，后面加几个字
SELECT * FROM `student` AS s WHERE `name` LIKE '王_'; 
SELECT * FROM `student` WHERE `name` LIKE '王__'
-- %xxx%，如下查询所有包含三的内容
SELECT * FROM `student` WHERE `name` LIKE '%三%'
```

- 在in的范围内查询内容：

```sql
-- 在规定的范围in内查询内容
SELECT `name`,`id` FROM `student` WHERE `id` IN (3,4,5,6)
```

- 查询为null 或 not null 的用法：

```sql
-- null：查询为null的内容
-- 查询pwd为null和空字符串的数据
SELECT * FROM `student` WHERE `pwd` IS NULL OR `pwd` = ''; 
-- not null：查询不为null的内容
SELECT * FROM `student` WHERE `pwd` IS NOT NULL
```

## 4.4 联表查询
> 💡注意：模棱两可，如果进行联表查询，两个表的字段名相同，一定要指定是那个表的，不要产生模棱两可的情况。

![image-20250122140339691](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140339691.png)

```sql
-- inner join 
SELECT s.`id`,s.`name`,r.`math`,r.`English` FROM `student` AS s 
INNER JOIN `result` AS r 
WHERE s.name = r.name

-- right join
SELECT s.`id`,s.`name`,`math`,`English` FROM `student` s 
RIGHT JOIN result r
ON s.`name` = r.`name`

-- left join
SELECT s.`id`,s.`name`,`math`,`English` FROM `student` s 
LEFT JOIN result r
ON s.`name` = r.`name`
```

| 操作       | 描述                                         |
| ---------- | -------------------------------------------- |
| inner join | 如果表中至少有一个匹配，就返回行。           |
| left join  | 会从左表中返回所有的值，即使右表中没有匹配， |
| right join | 会从右表中返回所有的值，即使左表中没有匹配， |


join on 连接查询 和 where 等值查询的区别。

- join on 是一个具体的语法。on后面跟 判断条件。
- where 就是等值查询。
- 结果两者还是相同的。

如果查询多个表中的join数据，要循环递进的查询。

自连接 ：

- 自己的表和自己的表连接。
- 核心：一张表拆分为两张一样的表即可。

```sql
-- 把一张表，分成两个表操作，下面分成了父和子栏目。
SELECT a.`categoryName` AS '父栏目',b.`categoryName` AS '子栏目' 
FROM `category` AS a,`category` AS b 
WHERE a.`categoryid` = b.`pid`
```
![image-20250122140411600](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140411600.png)
## 4.5 分页(limit) 和 排序(order by)
![image-20250122140423571](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140423571.png)

**排序**：`order by 要排序的字段 [asc/desc]` 。

```sql
SELECT s.`id`,s.`name`,`math`,`english` FROM `student` s 
LEFT JOIN result r 
ON s.`name` = r.`name`
ORDER BY `id` DESC -- 逆序显示
```

**分页**：`limit 查询起始下标 ，pageSize`。

![image-20250122140435821](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140435821.png)

## 4.6 子查询 和 嵌套查询

本质：在where语句中嵌套一个子查询语句。

![在这里插入图片描述](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140446717.png)

子查询和嵌套查询本质上就是由里到外的一个运行代码过程。

## 4.7 分组(group by) 和 过滤(having)

`group by` 通过什么字段来分组。

```sql
SELECT `name`,SUM(math) AS 数学总分, AVG(english) AS 英语平均分
FROM result AS r 
WHERE r.math >= 60 
GROUP BY `name` 
HAVING 数学总分 > 60
```

`where`和`having`的区别：
- where:
	- where是一个约束声明,使用where来约束来自数据库的数据;
	- where是在结果返回之前起作用的;
	- where中不能使用聚合函数。
- having:
	- having是一个过滤声明;
	- 在查询返回结果集以后，对查询结果进行的过滤操作;
	- 在having中可以使用聚合函数。
  

## 4.8 select 语法格式 总结
总体上，select查询语法格式为：

![image-20250122140503246](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140503246.png)

![image-20250122140511091](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140511091.png)

# 5. MySQL 函数
函数这节最好依靠官方给的文档来操作。

> 官方地址：https://dev.mysql.com/doc/refman/8.0/en/built-in-function-reference.html](https://dev.mysql.com/doc/refman/8.0/en/built-in-function-reference.html)


## 5.1 常用函数
**数学常用函数**：

```sql
-- abs(): 取绝对值
SELECT ABS(-8)

-- ceiling(): 向上取整,天花板
SELECT CEILING(4.1)

-- floor():向下取整，地板
SELECT FLOOR(4.9)

-- rand(): 返回一个0~1之间的随机数
SELECT RAND()

--  sign(): 判断一个数的符号，(注意：0是0，负数返回-1，整数返回1)
SELECT SIGN(0)
SELECT SIGN(-10)
SELECT SIGN(10)
```

**字符串常用函数**：

```sql
-- 字符串函数
-- char_length(): 返回字符串长度
SELECT CHAR_LENGTH("12356张三")

-- concat("str1","str2"): 拼接字符串
SELECT CONCAT("张三","您好啊")

-- insert(): 查询，替换
SELECT INSERT('李四，hello,world',1,2,'张三')

-- lower() ,upper(): 转大小写
SELECT LOWER('ASZXCF')
SELECT UPPER('sdfsd')

-- instr('str','s'): s在str中的索引位置
SELECT INSTR('张三123455','2')

-- replace('str','s','S'): 替换出现的指定字符串
SELECT REPLACE('你好张三，欢迎来到北京','张三','李四')

-- substr('str','1','2'): 返回指定的子字符串
SELECT SUBSTR('你好张三，欢迎来到北京','3','6') -- 注意不是3到6，而是第三个开始后面的6个。

-- reverse('str'): 反转字符串
SELECT REVERSE('你好张三，欢迎来到北京')
```
![image-20250122140522538](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140522538.png)

**时间和日期函数**：

```sql
-- 时间和日期函数
-- current_date() 和 curdate(): 获取当前日期 (仅有年月日)
SELECT CURRENT_DATE()
SELECT CURDATE()

-- now(): 获取当前时间，比较全(年月日时分秒)
SELECT NOW()

-- localtime(): 获取本地时间
SELECT LOCALTIME()

-- sysdate(): 获取系统时间
SELECT SYSDATE()

-- 单独输出年月日时分秒
SELECT YEAR(NOW())
SELECT MONTH(NOW())
SELECT DAY(NOW())
SELECT HOUR(NOW())
SELECT MINUTE(NOW())
SELECT SECOND(NOW())
```
**系统函数**：

```sql
-- 系统函数
-- system_user() 和 user(): 客户端提供的用户名和主机名
SELECT SYSTEM_USER()
SELECT USER()

-- version(): 查看mysql版本
SELECT VERSION()
```

## 5.2 聚合函数 （常用）

| 函数名称 | 描述   |
| -------- | ------ |
| count()  | 计数   |
| sum()    | 求和   |
| avg()    | 平均值 |
| max()    | 最大值 |
| min()    | 最小值 |
| ...      | ...    |

**count()函数**：

- 想查询一个表中有多少个记录，就是用count()。

```sql
-- 聚合函数
-- count(`指定列(字段)`): 查看数据的数量，但会忽略所有的null值
SELECT COUNT(`categoryName`) FROM `category`

-- count(*): 查看所有代码行，*就不会忽略null值
SELECT COUNT(*) FROM `category`

-- count(l): 将一个代码行看为 1来查询。也不会忽略null值
SELECT COUNT(1) FROM `category`
```
![image-20250122140540392](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140540392.png)

**求和，平均分，最大值，最小值**：

```sql
-- sum():求和
SELECT SUM(`pid`) AS 总和 FROM `category`

-- avg():平均分
SELECT AVG(`pid`) AS 平均分 FROM `category`

-- max():最大值
SELECT MAX(`pid`) AS 最大值 FROM `category`

-- min():最小值
SELECT MIN(`pid`) AS 最小值 FROM `category`
```

其实，使用函数大多数情况都是后面跟着列表字段，来计算整个字段的函数值。


## 5.3 数据库级别的 MD5()加密函数
**什么是MD5**？

- MD5是一种不可逆的加密算法，主要增强算法复杂度和不可逆性。
- MD5 不可逆，具体的值的md5值是一样的。

- MD5 破解网站的原理，背后有一个字典，MD5加密后的值。

```sql
-- 铭文密码
INSERT INTO `testmd5` VALUES (1,'张三','123456'),(2,'李四','123456'),(3,'王五','123456')

-- md5()函数,通过使用md5函数加密。
UPDATE `testmd5` SET pwd=MD5(pwd) -- 加密全部的密码

-- 插入的时候，进行加密。
INSERT INTO `testmd5` VALUES (4,'老鬼',MD5('123456'))

-- 如何校验：将用户传递进来的密码，进行md5加密，然后比对加密的值。
SELECT * FROM testmd5 WHERE `name` = '老鬼' AND pwd=MD5('123456')
```

对于MD5加密，我们只需要知道加密用户的密码，然后校验用户传进来的密码进行比较，就像下面一样。
```sql
-- 如何校验：将用户传递进来的密码，进行md5加密，然后比对加密的值。
SELECT * FROM testmd5 WHERE `name` = '老鬼' AND pwd=MD5('123456')
```


# 6. 事务
## 6.1 什么是事务？什么是ACID？
将一组sql放在一个批次中去执行~，要么都执行成功，要么都执行失败。

![image-20250122140550855](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140550855.png)

**ACID原则特性**：原子性(Atomicity) ，一致性(Consistency) ， 隔离性(Isolation) ，持久性(Durability) (脏读，幻读...)

一个支持事务(Transaction)的数据库，必须要具备以上四种特性，否则在事务过程(Transaction processing) 当中无法保证数据的正确性，交易过程极可能达不到交易方的要求。

**原子性(Atomicity)**：

- 要么都成功，要么都失败。

  ![image-20250122140601681](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140601681.png)

**一致性(Consistency)**：
- 事务前后的数据完整性要保证一致。

  ![image-20250122140614056](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140614056.png)



**持久性(Durability)**：
- 事务一旦提交则不可逆，被持久化到数据库中。事务如果已经提交，就不可逆了。

![image-20250122140633669](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140633669.png)

**隔离性(Isolation)**：

- 事务的隔离性是多个用户并发访问数据库时，数据库为每一个用户开启的事务，不能被其他事务的操作数据所干扰，事务之间要相互隔离。

![image-20250122140644877](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140644877.png)

**隔离所导致的一些问题**：

**脏读**：

- 指一个事务读取了另外一个事务未提交的数据。
  
  ![image-20250122140658594](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140658594.png)

**不可重复读**：
- 在一个事务内读取表中的某一行数据，多次读取结果不同。（这个不一定是错误，只是某些场合不对）
  ![image-20250122140715875](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140715875.png)

**虚读(幻读)**：
- 它是指在一个事务内读取到了别的事务插入的数据，导致前后读取数量总量不一致。
  ![image-20250122140729015](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140729015.png)

## 6.2 事务的 执行流程

`SET autocommit`用来开启或关闭事务，默认是开启。
```sql
-- 事务
-- mysql是默认开启事务自动提交的

SET autocommit = 0 -- 关闭事务
SET autocommit = 1 -- 开启事务(设置为1，为默认开启)
```

事务 执行的流程：

```sql
-- 转账
CREATE DATABASE IF NOT EXISTS `shop` CHARACTER SET utf8 COLLATE utf8_general_ci

USE shop

CREATE TABLE `account` (
	`id` INT(3) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(30) NOT NULL,
	`money` DECIMAL(9,2) NOT NULL,
	
	PRIMARY KEY (`id`) 
)ENGINE=INNODB DEFAULT CHARSET=utf8
-- innodb是支持事务的，myisem好像有点版本不支持

INSERT INTO `account` (`name`,`money`) VALUES ('A',2000.00),('B',100000.00)

-- 模拟转账：事务
SET autocommit = 0 -- 关闭自动提交

START TRANSACTION -- 开启事务

UPDATE `account` SET money=money-500 WHERE `name` = 'A' -- A减500
UPDATE `account` SET money=money+500 WHERE `name` = 'B' -- B加500

COMMIT; -- 提交事务，提交后就被持久化了，再回滚就无法回滚了。
ROLLBACK; -- 如果出错，就执行回滚。

SET autocommit = 1; -- 恢复默认值
```

![image-20250122140739943](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140739943.png)

**了解 保存点**：

```sql
SAVEPOINT 保存点名 -- 设置一个事务的保存点

ROLLBACK TO SAVEPOINT 保存点名 -- 回滚到保存点

RELEASE SAVEPOINT 保存点名 -- 删除撤销保存点
```

# 7.  索引
> MySQL官方对索引的定义为：**索引（Index）是帮助MySQL高效获取数据的数据结构**。
>

## 7.1 索引的分类
**在一个表中，主键索引只能有一个，唯一索引可以有多个**。

- 主键索引 (primary key)
   -   唯一的标识，主键的内容是不可重复，只能有一个列作为主键。
  
- 唯一索引 (unique key)
  
   - 避免重复的列出现，唯一索引可以重复，多个列都可以标识为 唯一索引。 

- 常规索引 (key/index)
   - 默认的：index，key关键字来设置。

- 全文索引 (fulltext)
  - 在特定的数据库引擎下才有(MyISAM,现在好像都有了。)
  - 快速定位数据。

**索引使用语法**：

- `alter table 表名 add 键名 index 索引名(字段名)`
- `show index from 表名 显示表中索引信息`
- `explain 分析sql执行的状况`
```sql
-- 索引的使用
-- 1，在创建表的时候给字段增加索引
-- 2，创建完毕后，增加索引

-- show index from `表名` 显示表中索引信息
SHOW INDEX FROM `student`

-- alter table `表名` add 键名 index `索引名`(`字段名`)
-- 增加一个唯一索引
ALTER TABLE `student` ADD UNIQUE INDEX `address`(`name`)
-- 增加一个全文索引
ALTER TABLE school.student ADD FULLTEXT INDEX `name`(`name`)

-- explain 分析sql执行的状况
EXPLAIN SELECT * FROM student;  -- 非全文索引

EXPLAIN SELECT * FROM student WHERE MATCH(`name`) AGAINST('张')
```

**索引使用包括**：

- 第一种：创建表的时候添加索引。
- 第二种：使用alter来修改添加索引。
- 第三种：使用：create index 索引名 on 表(`字段`)。

一般批量添加索引我们都是用第三种。

## 7.2 测试索引
测试前，准备10万条数据。

在student库中，创建一个app_user表格：
```sql
CREATE TABLE `school`.`app_user1` ( 
	`id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT, 
	`name` VARCHAR(50) DEFAULT '' COMMENT '用户名称', 
	`email` VARCHAR(50) NOT NULL COMMENT '用户邮箱', 
	`phone` VARCHAR(20) DEFAULT '' COMMENT '手机号', 
	`gender` TINYINT(4) UNSIGNED DEFAULT 0 COMMENT '性别(0:男，1:女)', 
	`password` VARCHAR(100) NOT NULL COMMENT '密码', 
	`age` TINYINT(4) DEFAULT 0 COMMENT '年龄', 
	`create_time` DATETIME DEFAULT CURRENT_TIMESTAMP, 
	`update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	
	PRIMARY KEY (`id`) 
 ) ENGINE=INNODB CHARSET=utf8 COLLATE=utf8_general_ci; 
```

我们在想要定义创建数据的时间或更新数据时的修改时间，通常会这样定义：

![image-20250122140752927](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140752927.png)


使用mysql函数插入10万条数据：
```sql
-- 插入100万条数据
DELIMITER $$ -- 写函数之前必须要写的标志
CREATE FUNCTION mock_data()
RETURNS INT
BEGIN
	DECLARE num INT DEFAULT 1000000;
	DECLARE i INT DEFAULT 0;
	
	WHILE i<num DO
		-- 插入语句
		INSERT INTO `app_user` (`name`,`email`,`phone`,`gender`,`password`,`age`)VALUES (CONCAT('用户',i),'147258369@qq.com',CONCAT('18',FLOOR(RAND()*((999999999-100000000)+100000000))),FLOOR(RAND()*2),UUID(),FLOOR(RAND()*100));		
		SET i = i+1;
	END WHILE;
	RETURN i;
END;
SELECT mock_data();
-- uuid()可以生成一个uuid码
```


给100万条数据添加索引，提高查询速度。
- 语法格式：`create 索引名 索引名 on 表(字段)`
```sql
SELECT * FROM app_user WHERE `name` = '用户9999'; -- 不加索引前执行速度为，1秒左右
EXPLAIN SELECT * FROM app_user WHERE `name` = '用户9999'; -- 不加索引前rows的数值为991749

-- id_表名_字段名
-- create 索引名 索引名 on 表(`字段`)
CREATE INDEX id_app_user_name ON app_user(`name`) -- 这条语句会给我们100w条数据都添加索引

SELECT * FROM app_user WHERE `name` = '用户9999' -- 加索引后执行速度为：0.03秒左右
EXPLAIN SELECT * FROM app_user WHERE `name` = '用户9999' -- 这里加了索引后rows的数值为1
```
**通过explain 来查看语句，可得知，不添加索引查询的rows值很高！添加索引后的值仅仅是1** 。

![image-20250122140804833](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140804833.png)

![image-20250122140817002](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140817002.png)

我们想要查看刚刚我们创建（`CREATE INDEX id_app_user_name ON app_user(name)`）的id_app_user_name，可以去indexs查看。

![image-20250122140830712](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140830712.png)

因此，索引在面对大量数据时，是非常重要的！！


## 7.3 索引原则
**索引原则**：

- 索引不是越多越好
- 不要对经常变动的数据加索引
- 小数据量的表不需要加索引
- 索引一般加在常用来查询的字段上

**索引的数据结构**

- Hash类型的索引
- Btree 和 B+tree（InnoDB默认数据结构是 B+ 树）


对于MySQL索引背后的数据结构和算法原理：[MySQL 索引原理：聚簇索引 && 匹配原则](https://github.com/xupengboo/holmes/blob/master/%E5%AD%A6%E8%AF%86%E6%AE%BF%E5%A0%82/MySQL/MySQL%20%E7%B4%A2%E5%BC%95%E5%8E%9F%E7%90%86%EF%BC%9A%E8%81%9A%E7%B0%87%E7%B4%A2%E5%BC%95%20%26%26%20%E5%8C%B9%E9%85%8D%E5%8E%9F%E5%88%99.md)


我们目前学习的是业务级别的MySQL，此外还有运维级别的MySQL。


# 8. 权限管理和备份
## 8.1 用户管理
**添加用户**：

![image-20250122140847048](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140847048.png)

**添加权限**：

![image-20250122140858014](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140858014.png)

**删除用户**：

![image-20250122140905927](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140905927.png)

**注意点**：

![image-20250122140915967](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140915967.png)

sql命令操作，添加用户和权限

- mysql数据库中有一个user表，记录着用户内容。

- sql命令操作本质上：就是对这张表进行增删改查。



**命令行创建用户，修改密码等基本操作**：

> 💡注意：mysql 8.0 版本的语法有所不同！

```sql
-- 创建用户
-- create user `用户名` identified by '密码'
CREATE USER `zhangsan` IDENTIFIED BY '123456' 

-- 修改密码(修改当前用户密码)
-- set password = password('密码')
SET PASSWORD = '123456'; -- mysql 8.0 版本后,设置密码为set password = '密码'

-- 修改密码(修改指定用户密码)
-- SET PASSWORD FOR `zhangsan` = PASSWORD('zhangsan123')
SET PASSWORD FOR zhangsan@'%' = 'zhangsan123' -- mysql 8.0 版本后,设置密码为set password or `用户名`@'对应的Host' = '密码'

-- 重命名 
-- rename user `原名字` to `新名字`
RENAME USER zhangsan TO zhangsan2
```

**赋予权限，权限管理等sql命令操作**：
```sql
-- 用户授权
-- ALL PRIVILEGES :除了给别人授权(grant)，其他都能干
GRANT ALL PRIVILEGES ON *.* TO zhangsan
-- GRANT ALL PRIVILEGES ON *.* TO zhangsan@'%' with grant option 后面的with grant option指的是赋予授予别人权限的权限 

-- 查询权限
-- show grants for `用户名` -- 查询指定用户的权限
SHOW GRANTS FOR zhangsan 
SHOW GRANTS FOR root

-- 撤销权限
-- revoke 撤销哪些权限 在那个库中撤销 给谁撤销
REVOKE ALL PRIVILEGES ON *.* FROM zhangsan

-- 删除用户
DROP USER zhangsan
```
**mysql.user表中Host为%的含义**

![image-20250122140927128](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140927128.png)

Host列指定了允许用户登录所使用的IP，比如user=root Host=192.168.1.1。这里的意思就是说root用户只能通过192.168.1.1的客户端去访问。

而%是个通配符，如果Host=192.168.1.%，那么就表示只要是IP地址前缀为“192.168.1.”的客户端都可以连接。如果Host=%，表示所有IP都有连接权限。

这也就是为什么在开启远程连接的时候，大部分人都直接把Host改成%的缘故，为了省事。


## 8.2 MySQL 备份

为什么要备份？
- 保证重要的数据不丢失。
- 数据转移。

**MySQL 数据库备份的方式**：

- 第一种方式：直接拷贝物理文件。mysql中的data文件中的数据库或表。
- 第二种方式：在类似Sqlyog的可视化工具中手动导出。
-  第三种方式：使用命令行导出 mysqldump 命令行进行导出备份。

.

第一种方式备份：就是去对应目录data下，直接拷贝对应库或表。

第二种方式备份：直接在对应的表或者库中，右键，选择备份或导出，如下：

![image-20250122140940501](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140940501.png)

**第三种方式备份**：`mysqldump 命令行`导出，最重要的！！！

```sql
# mysqldump -h 主机 -u 用户名 -p 密码 数据库名 表名 >物理磁盘位置/文件名 ，导出单个表
mysqldump -hlocalhost -uroot -p123456 school student >D:/a.sql

# mysqldump -h 主机 -u 用户名 -p 密码 数据库名 表1 表2 表3 ... >物理磁盘位置/文件名 ，导出多个表
mysqldump -hlocalhost -uroot -p123456 school student result  >D:/b.sql

# mysqldump -h 主机 -u 用户名 -p 密码 数据库名 >物理磁盘位置/文件名 ,导出数据库
mysqldump -hlocalhost -uroot -p123456 school >D:/c.sql
```
![image-20250122140951566](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122140951566.png)

有导出，就有导入。

**导入的命令行操作**：

- 格式：`source 文件路径`

```sql
-- 登录的情况下，切换到指定的数据库(如果导入的是数据库就不用切换了)
-- source 文件路径
source d:/a.sql
```
![image-20250122141000853](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122141000853.png)

# 9. 规范数据库设计
## 9.1 为什么需要设计数据库？

当数据库笔记复杂的时候，我们就需要设计！！

**糟糕的数据库设计：**

- 数据冗余，浪费空间。
- 数据插入和删除都会麻烦，容易出现异常。【屏蔽使用物理外键】
- 程序的性能差。


**良好的数据库设计：**
- 节省内存空间。
- 保证数据库的完整性。
- 方便我们开发系统。


软件开发中，关于数据库的设计
- 分析需求：分析业务和需要处理的数据库的需求。
- 概要设计：设计关系图 E-R 图。

**设计数据库大体上的一个样式：**

![image-20250122141013756](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122141013756.png)

对于mysql数据库，可以应用到 管理系统(crm)，论坛系统(bbs)，博客系统中。推荐两个前端页面框架： element ui , ant design(阿里) 。

## 9.2 三大范式

**为什么需要数据规范化？**

- 信息重复

- 更新异常
- 插入异常
  - 无法正常显示
- 删除异常
  - 丢失有效的信息

三大范式:

- 第一范式 (1NF) ：保证每一列，不可再分，就是不可分割的原子数据项。（原子性）

![image-20250122141028162](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122141028162.png)

- 第二范式 (2NF) 前提：满足第一范式；每张表只描述一件事情。

  ![image-20250122141036961](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122141036961.png)


- 第三范式 (3NF) 前提：满足第一范式和第二范式 。第三范式需要确保数据表中的每一列数据都和主键直接相关，而不能间接相关。


![image-20250122141047330](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122141047330.png)

**没必要非得符合上面的要求，见下：**

![image-20250122141058993](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122141058993.png)


至此，MySQL业务级别的内容结束。但是，想要操作好MySQL，必须还要学习如何用语言来操作，例如：JDBC。

# 10. 其他补充
1. **mysql 不能使用full [outer] join 这样的语句，Oracle或其他SQLserver是可以使用的一定注意！！！**

2. **union用法：**

- **他可以连接两个或多个数据库的内容，但是两个数据库的字段数量和字段名要相同，因为是要重叠的！**

- **因为mysql不能会使用full [outer] join这样的语句，因此可以使用union来解决这方法的问题。例如：最下面的两个full join语句，mysql不能使用，但是可以使用union与其他的语句内容拼接起来！**

![image-20250122141109035](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122141109035.png)

---

![image-20250122141117825](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250122141117825.png)



这里强调一下不同的交叉集，像这种情况：`select <字段> from [表格A] as [别名 A]  left join [表格B] as [别名 B] on A.[Key] = B.[Key] where b.[Key] is null;`

- b.[Key] is null 我们必须理解这语句的作用，如果没有这一句我们查询出来的是a表格中所有的数据，但是加上这个where条件，相当于我们将里面b.[Key] 是null的挑选出来，也就是仅仅是A表格特有的，注意这里的Key字段最好是b的主键，因为b中主键是不可能为null的。

同样，查询b独有的也是一样的。

3. mysql的varchar类型是可变的。

4. char类型就不是可变的，固定的自动用空格填补。
