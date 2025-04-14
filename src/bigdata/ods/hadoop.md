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


