# 解决Gitlab Prometheus导致的磁盘空间不足问题

用docker搭建了一个gitlab服务，已经建立了多个项目上传，但是突然有一天就503了。
`df -TH`查看系统盘，发现已经Used 100%爆满了。。。

> 💡Tips：`/dev/vda1`目录是系统盘目录。

![image.png](https://cdn.nlark.com/yuque/0/2024/png/32707260/1704179142957-500d23e8-1228-46b5-92a2-7945ab3ae316.png#averageHue=%23302523&clientId=u2e1fae89-0414-4&from=paste&height=156&id=u2565f986&originHeight=195&originWidth=645&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=22356&status=done&style=none&taskId=u11d5d84b-6990-437b-9481-d7877fe5bd2&title=&width=516)

去云服务器上面看，短短半个月就占满了整个系统盘。。。

![image.png](https://cdn.nlark.com/yuque/0/2024/png/32707260/1704179123586-e1b323c4-96c9-4671-ab92-d7605d7c9def.png#averageHue=%23e5c192&clientId=u2e1fae89-0414-4&from=paste&height=365&id=u335403c9&originHeight=456&originWidth=717&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=29085&status=done&style=none&taskId=ub9c693e5-a930-4ca1-9636-1860da92ee9&title=&width=573.6)

然后，看了看gitlab容器卷挂载目录data中，有一个prometheus目录居然占了29G，百度了一下，原来这个是用来监控的。。。所以，内容一直堆积堆积，导致磁盘满了。。。

GitLab中的 Prometheus 解释如下：
GitLab中的Prometheus是一个用于监控和报警的开源系统，它能够收集并汇总时间序列数据，用于检测异常。同时，GitLab还提供了一些关于Prometheus的基础功能，包括数据聚合、存储时间等。这些功能可以帮助用户更好地了解其系统运行状况，并及时发现和解决潜在问题。

`/var/opt/gitlab/prometheus/data`是 [Prometheus](https://so.csdn.net/so/search?q=Prometheus&spm=1001.2101.3001.7020) 生成的监控数据文件，可参考文档 Monitoring GitLab with Prometheus。

![image.png](https://cdn.nlark.com/yuque/0/2024/png/32707260/1704179781371-6488aff0-48ca-46c8-916d-cecd292ee67c.png#averageHue=%23252321&clientId=u2e1fae89-0414-4&from=paste&height=423&id=u791ddef0&originHeight=529&originWidth=779&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=76058&status=done&style=none&taskId=ufef2c9ac-469d-40e3-ad3b-5f4035103ed&title=&width=623.2)

**解决办法：**

1. **先备份一下**，云服务器购买个存储库，备份一下，临时的话可以用先`按需计费`省钱。
2. 因为，我已经备份了，所以我就可以肆无忌惮的删一点。就把`gitlab/data/prometheus/data/wal`里面的一大文件删了一部分保证gitlab的服务能启动起来。

![image.png](https://cdn.nlark.com/yuque/0/2024/png/32707260/1704186118822-b54b3c57-aa89-45b1-bffb-a7e143ed5c6c.png#averageHue=%23272422&clientId=u3ad95638-42fe-4&from=paste&height=433&id=u9bb8b11e&originHeight=541&originWidth=855&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=59603&status=done&style=none&taskId=u712e5236-9e8b-4045-8ad5-c97ebea3c6f&title=&width=684)

3. **修改一下**`**gitlab/config/gitlab.rb **`**配置文件。**

周期默认是15d是15天，意思是15天后重新记录。此处，我就改为了1d也就是1天。

![image.png](https://cdn.nlark.com/yuque/0/2024/png/32707260/1704186297813-c24b3108-0332-4527-979b-267d1abeb119.png#averageHue=%232a2827&clientId=u3ad95638-42fe-4&from=paste&height=119&id=ub489b51a&originHeight=149&originWidth=679&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=11886&status=done&style=none&taskId=uc51f0ac9-cb0b-4a5b-8d4f-874a41ff1a8&title=&width=543.2)
也可以直接把prometheus禁用了。

```shell
prometheus['enable'] = false
```
> 💡参考：[gitlab prometheus占用磁盘过大-腾讯云开发者社区-腾讯云](https://cloud.tencent.com/developer/article/2146262)

4. 再次，重启项目docker restart gitlab 就healthy启动了。

![image.png](https://cdn.nlark.com/yuque/0/2024/png/32707260/1704185994463-31e27061-1efa-4032-8120-f168900aa44c.png#averageHue=%23ebebdd&clientId=u3ad95638-42fe-4&from=paste&height=536&id=uf62c66bd&originHeight=670&originWidth=1169&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=60241&status=done&style=none&taskId=uaa26a4cb-26a5-439f-bb5f-c14fc48f1f6&title=&width=935.2)
系统盘也释放了很多。
![image.png](https://cdn.nlark.com/yuque/0/2024/png/32707260/1704187700008-9274d7f1-8983-4c95-bd94-35df39e200f2.png#averageHue=%2325201f&clientId=u3ad95638-42fe-4&from=paste&height=169&id=u65487be9&originHeight=211&originWidth=1502&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=30597&status=done&style=none&taskId=u3bfdca01-520c-4462-933e-3f1e443e2e1&title=&width=1201.6)