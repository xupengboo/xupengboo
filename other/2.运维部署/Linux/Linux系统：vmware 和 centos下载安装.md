# vmware 和 centos下载安装

**Vmware Workstation Pro 安装**：https://blog.csdn.net/Du_XiaoNan/article/details/136138427 （不要下载player版本，功能太少。）



**CentOS官方镜像 下载地址**：https://wiki.centos.org/Download.html

**阿里云CentOS开源镜像（7.9）下载地址**：https://mirrors.aliyun.com/centos/7.9.2009/isos/x86_64/



**CentOS切换图形化界面或命令行模式**：

```shell
# 将图形化界面切换为命令行
systemctl set-default multi-user.target
# 将命令行切换成图形化界面
systemctl set-default graphical.target

# 完成后，重启
reboot
```

