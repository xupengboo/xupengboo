---
title: DataX 工具
order: 1
icon: mdi:tools
---


##  DataX 工具简介

DataX 开源项目地址：[https://github.com/alibaba/DataX](https://github.com/alibaba/DataX)

DataX 概述：[https://github.com/alibaba/DataX/blob/master/introduction.md](https://github.com/alibaba/DataX/blob/master/introduction.md)

DataX 安装：https://github.com/alibaba/DataX/tree/master?tab=readme-ov-file#quick-start

## 1. 环境安装

```shell
# 1. jdk1.8
java -version
openjdk version "1.8.0_412"

# 2. 安装python2
sudo yum install python 
python --version
Python 2.7.5

# 3. 安装 maven3.x
sudo yum install -y maven
mvn --version
Apache Maven 3.0.5 (Red Hat 3.0.5-17)
```

## 2. DataX 部署

```shell
# 下载 DataX 工具包
curl -O -L https://datax-opensource.oss-cn-hangzhou.aliyuncs.com/202309/datax.tar.gz
# 解压
tar -zxvf datax.tar.gz
```

## 3. DataX 启动命令

```shell
# 进入 datax bin目录
cd  datax/bin
# 启动命令如下：
python datax.py {YOUR_JOB.json}
# 自检脚本：
python bin/datax.py job/job.json
```

## 4. DataX 配置模板

DataX 提供了快速生成读写插件配置模板的功能，你可以通过命令行直接生成对应 Reader（数据源）和 Writer（目标端）的 JSON 模板。

```shell
# 查看模板的格式：
python bin/datax.py -r {YOUR_READER} -w {YOUR_WRITER}
```

- `-r {READER_NAME}`：指定读取数据的插件名称（如 `mysqlreader`）。
- `-w {WRITER_NAME}`：指定写入数据的插件名称（如 `hdfswriter`）。
- 功能：**该命令会生成一个包含 `reader` 和 `writer` 基础配置的 JSON 模板，可直接作为作业配置文件的起点**。

例如：生成从 MySQL 读取数据 到 HDFS的模板：

```shell
python bin/datax.py -r mysqlreader -w hdfswriter
```

可以通过以下方式确认插件名称：

```shell
ls plugin/reader  # 查看所有Reader插件
ls plugin/writer  # 查看所有Writer插件
```









