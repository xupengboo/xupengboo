# Hbase

HBase 是基于 Hadoop 的分布式数据库，依赖于 Hadoop 的 HDFS 存储和 YARN 资源管理。

# 前提

搭建 HBase 前提条件：**Hadoop 集群已成功配置和启动。**

# 1. 下载并安装 `HBase` 

HBase 官方：[https://hbase.apache.org/](https://hbase.apache.org/)

去官方，下载合适的 HBase 版本。

解压到合适的目录中，例如：`/usr/local/hbase`。

注意，HBase 要与 Hadoop 有版本对应关系：

```shell
src：（source）源码：包含源代码，通常用于开发和自定义。
bin：（binary）二进制：包含已经编译好的二进制文件和可执行命令，用户通常用来操作框架。

这里，我们的 Hadoop 用3.x.x版本，所以要用 hadoop3-bin ：
hadoop3-bin (sha512 asc)：这个包是专为与 Hadoop 3.x 版本兼容的 HBase 所准备的二进制文件。它包含了与 Hadoop 3.x 集群兼容的特定 HBase 版本的二进制文件。
```

![image-20241211171812853](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241211171812853.png)



1. 下载  [hbase-2.6.1-hadoop3-bin.tar.gz](https://dlcdn.apache.org/hbase/2.6.1/hbase-2.6.1-hadoop3-bin.tar.gz) 压缩包

```shell
# 解压压缩包
tar -zxvf hbase-2.6.1-hadoop3-bin.tar.gz
# 转移到 `/usr/local/hbase`下面
mv hbase-2.6.1-hadoop3 /usr/local/hbase
```



