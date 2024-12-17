# HDFS 常用指令

```shell
hdfs dfs -ls / # 查看目录
hdfs dfs -put input.txt /user/hadoop/input # 上传
hdfs dfs -get /hdfs/path/to/file /local/destination/path # 下载
hdfs dfs -cat /hdfs/path/to/file # 查看文件
hdfs dfs -mkdir /hdfs/path/to/directory # 创建目录
hdfs dfs -rm /hdfs/path/to/file          # 删除文件
hdfs dfs -rm -r /hdfs/path/to/directory # 递归删除目录
```

# Hadoop 常用指令

