## 先认识认识下面几个常用命令
**lsblk 命令**：查看设备列表，也就是能看到系统盘和数据盘一般为：vda（系统盘）、vdb（数据盘）等等
```powershell
lsblk

"ls" 是 "list" 的缩写： lsblk 可以理解为 "list block devices" 的缩写，表示列出块设备的信息。
"blk" 是 "block" 的缩写： 命令的结尾部分 "blk" 意味着块设备，即磁盘和分区。
```
**mount 命令**：挂载

```powershell
# 单独执行mount是查看所有挂载信息
mount
# 添加读写权限，将/dev/vdb挂载到/mydata/mnt/data# 
sudo mount -o rw /dev/vdb /mydata/mnt/data

mount 英文翻译就是 "挂载" 好记忆。
```
**mkfs.ext4 命令**：可以理解为格式化，例如：将数据盘格式化为什么类型的文件。
```powershell
# 用于创建 ext4 文件系统的命令
mkfs.ext4 /dev/vdb

mkfs 表示 "make file system"，即创建文件系统。
ext4 表示 "Fourth Extended Filesystem"，是 Linux 中的一种常见的文件系统。
```
**df -h 命令**：用于显示文件系统的磁盘空间使用情况。可以看到不同分区的情况。
```powershell
df -h 

df 就是 "disk free" 磁盘空闲
-h 选项表示以人类可读的格式显示磁盘空间信息
```
du -sh 命令：用于查看目录或文件的磁盘使用情况。添加数据盘多数是因为磁盘爆满了，知道这个命令就可以查看某些文件哪些是比占用空间较大的文件。

```powershell
# 用于查看磁盘使用情况的命令。
du -sh 

"du" 是 "disk usage(英文直译：习惯、用法)" 的缩写： 将 du 记忆为 "disk usage"，表示它是用于查看磁盘使用情况的命令。
"s" 是 "summary" 的缩写： -s 选项表示 "summary"，它让 du 以汇总的方式显示目录的总大小。
"h" 是 "human-readable" 的缩写： -h 选项表示 "human-readable"，以易读的方式显示文件大小，将字节转换为更易理解的单位（例如，KB、MB、GB）。
```



## 数据盘挂载系统盘步骤

认识了上面的几个命令，就可以开始挂载数据盘了。

1. 执行lsblk命令，查看设备信息。

![image.png](https://cdn.nlark.com/yuque/0/2024/png/32707260/1705285659107-5d0a8d59-75b9-4ee5-8443-6940c0f9d95d.png#averageHue=%232c201e&clientId=ua672623f-b44a-4&from=paste&height=100&id=u265e30cb&originHeight=125&originWidth=1077&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=26530&status=done&style=none&taskId=u20029773-ce3e-4431-a164-df533d5e1c0&title=&width=861.6)

根据上面内容就得知了，以下信息：
首先，我有两个盘，一个vda是系统盘（目前有一个分区叫vda1），另一个是购买的vdb数据盘。
重点是：vdb 200G的数据盘，没有对应的挂载点，压根没用起来！

2. 执行df -h命令，查看文件系统的磁盘空间使用情况。

![image.png](https://cdn.nlark.com/yuque/0/2024/png/32707260/1705285842127-126f8287-1cda-4e62-8484-776506e161ab.png#averageHue=%2322201f&clientId=ua672623f-b44a-4&from=paste&height=192&id=u045818e2&originHeight=240&originWidth=1097&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=31251&status=done&style=none&taskId=uf1f6f98a-b155-489f-abb4-87b58961792&title=&width=877.6)

确实没有vdb的相关文件信息。

3. 执行mkfs.ext4 /dev/vdb ，文件类型和目录 看你的选择和自己盘位置所在。
- 这个命令等于格式化，所以如果vdb有文件的话，最好是**提前备份一下**。

- 如果格式化过，可以执行：blkid /dev/vdb 命令 看下有没有内容输出，如果没有内容输出说明这个盘可能没用过。![image.png](https://cdn.nlark.com/yuque/0/2024/png/32707260/1705286256283-aa010ad5-b0ab-4d9d-a6b8-ddc59fac4648.png#averageHue=%23292624&clientId=ua672623f-b44a-4&from=paste&height=65&id=HZ6Hm&originHeight=81&originWidth=465&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=8465&status=done&style=none&taskId=u27a62ce4-d9a0-402c-99a2-6d68a3ca46f&title=&width=372)

  

  ![image.png](https://cdn.nlark.com/yuque/0/2024/png/32707260/1705286280056-a543c020-87af-4fec-b093-6c051294dc32.png#averageHue=%23232120&clientId=ua672623f-b44a-4&from=paste&height=243&id=u11efe0b3&originHeight=304&originWidth=809&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=33926&status=done&style=none&taskId=u61534c3e-926e-415f-b399-3c18efd8cb2&title=&width=647.2)

4. 格式化后，执行 `mount /dev/vdb /mydata/mnt/data`进行挂载即可。
5. 通过mount 命令 或者 df -h 命令查看挂载是否成功。

![image.png](https://cdn.nlark.com/yuque/0/2024/png/32707260/1705286391080-c8013f7c-91a6-4b1c-8c3a-588207cbbbe5.png#averageHue=%23282321&clientId=ua672623f-b44a-4&from=paste&height=274&id=ub75d6894&originHeight=342&originWidth=1142&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=60302&status=done&style=none&taskId=u46c4418d-941c-4e4d-b63d-b22ddc82667&title=&width=913.6)

这样就完事了。 

6. 提一点，有些人会遇到如下问题：

![image.png](https://cdn.nlark.com/yuque/0/2024/png/32707260/1705286449708-bff26d42-d638-407c-a79f-b712d23285d2.png#averageHue=%232e2b26&clientId=ua672623f-b44a-4&from=paste&height=70&id=u9267b900&originHeight=87&originWidth=600&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=11838&status=done&style=none&taskId=uedda3ccc-c56a-44c3-99d8-715b0362a5f&title=&width=480)

只读 和 不知道文件类型的问题，我是因为没有执行 第3步 ，没有格式化系统盘的文件类型， 才有这个问题的出现，解决办法就是 参考一下 第3步 解决。