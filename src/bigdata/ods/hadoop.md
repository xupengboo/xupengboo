---
title: Hadoop 集群使用
order: 1
icon: mdi:bash
date: 2025-04-14 10:00:00
tags:
  - 大数据
  - Hadoop
categories:
  - 大数据
---

## HDFS 常用指令

```shell
hdfs dfs -ls / # 查看目录
hdfs dfs -put input.txt /user/hadoop/input # 上传
hdfs dfs -get /hdfs/path/to/file /local/destination/path # 下载
hdfs dfs -cat /hdfs/path/to/file # 查看文件
hdfs dfs -mkdir /hdfs/path/to/directory # 创建目录
hdfs dfs -rm /hdfs/path/to/file          # 删除文件
hdfs dfs -rm -r /hdfs/path/to/directory # 递归删除目录
```

## 查看 HDFS 文件

```shell
# zcat 用来解压 gzip 文件
hadoop fs -cat /base_province/* | zcat 
3       山西    1       140000  CN-14   CN-SX   2021-12-14 00:00:00     \N
4       内蒙古  1       150000  CN-15   CN-NM   2021-12-14 00:00:00     \N
5       河北    1       130000  CN-13   CN-HE   2021-12-14 00:00:00     \N
6       上海    2       310000  CN-31   CN-SH   2021-12-14 00:00:00     \N
7       江苏    2       320000  CN-32   CN-JS   2021-12-14 00:00:00     \N
8       浙江    2       330000  CN-33   CN-ZJ   2021-12-14 00:00:00     \N
```

