---
title: Gitlab Prometheus导致的磁盘空间不足问题
order: 3
icon: mdi:git
---


## 解决Gitlab Prometheus导致的磁盘空间不足问题

用docker搭建了一个gitlab服务，已经建立了多个项目上传，但是突然有一天就503了。
`df -TH`查看系统盘，发现已经Used 100%爆满了。。。

> 💡Tips：`/dev/vda1`目录是系统盘目录。

![image-20240912163903343](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240912163903343.png)

去云服务器上面看，短短半个月就占满了整个系统盘。。。

![image-20240912163923153](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240912163923153.png)

然后，看了看gitlab容器卷挂载目录data中，有一个prometheus目录居然占了29G，百度了一下，原来这个是用来监控的。。。所以，内容一直堆积堆积，导致磁盘满了。。。

GitLab中的 Prometheus 解释如下：
GitLab中的Prometheus是一个用于监控和报警的开源系统，它能够收集并汇总时间序列数据，用于检测异常。同时，GitLab还提供了一些关于Prometheus的基础功能，包括数据聚合、存储时间等。这些功能可以帮助用户更好地了解其系统运行状况，并及时发现和解决潜在问题。

`/var/opt/gitlab/prometheus/data`是 [Prometheus](https://so.csdn.net/so/search?q=Prometheus&spm=1001.2101.3001.7020) 生成的监控数据文件，可参考文档 Monitoring GitLab with Prometheus。

![image-20240912163940757](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240912163940757.png)

**解决办法：**

1. **先备份一下**，云服务器购买个存储库，备份一下，临时的话可以用先`按需计费`省钱。
2. 因为，我已经备份了，所以我就可以肆无忌惮的删一点。就把`gitlab/data/prometheus/data/wal`里面的一大文件删了一部分，保证gitlab的服务能启动起来。

![image-20240912164007987](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240912164007987.png)

> 💡Tips：可能因为系统盘已经爆满，项目启动不起来，可以手动删除wal目录下面的一些大文件，先让磁盘有些空余，保险起见还是要提前备份一下。

3. **修改一下`gitlab/config/gitlab.rb `配置文件。**

周期默认是15d是15天，意思是15天后重新记录。此处，我就改为了1d也就是1天。

![image-20240912164031924](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240912164031924.png)

也可以直接把prometheus禁用了。

```shell
prometheus['enable'] = false
```
> 💡参考：[gitlab prometheus占用磁盘过大-腾讯云开发者社区-腾讯云](https://cloud.tencent.com/developer/article/2146262)

4. 再次，重启项目docker restart gitlab 就healthy启动了。

![image-20240912164050864](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240912164050864.png)

系统盘也释放了很多。

![image-20240912164109711](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240912164109711.png)

