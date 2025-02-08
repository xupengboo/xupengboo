---
title: CentOS 环境安装
order: 2
---

:::note
由于服务器经常切换，每次都要去部署各种各样的工具命令，忘记了还需要重新查一下，干脆直接写一篇文章记录一下。
:::

## 1. CentOS 下载

VMware Workstation Pro 安装：https://blog.csdn.net/Du_XiaoNan/article/details/136138427 （不要下载player版本，功能太少。）

CentOS官方镜像 下载地址：https://wiki.centos.org/Download.html

阿里云CentOS开源镜像（7.9）下载地址：https://mirrors.aliyun.com/centos/7.9.2009/isos/x86_64/



## 2. 配置服务器环境

1. 配置yum源

```shell
# 备份原来yum镜像源
cd /etc/yum.repos.d/
mkdir repo_bak
mv *.repo repo_bak/

# 下载其他的仓库镜像源
sudo curl -o /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo # 阿里
sudo curl -o /etc/yum.repos.d/CentOS-Base.repo http://mirrors.163.com/.help/CentOS7-Base-163.repo # 网易
sudo curl -o /etc/yum.repos.d/CentOS-Base.repo https://mirrors.tuna.tsinghua.edu.cn/help/centos7/ # 清华

# 更新YUM源信息
sudo yum update
# 检查YUM源的速度
sudo yum repolist
# 清除系统所有的yum缓存
sudo yum clean all   
# 生成新的缓存
sudo yum makecache
```



## 3. 安装各种各样的工具

```shell
# 安装vim
sudo yum install vim 

# 安装iputils（包括：ping）
sudo yum install iputils

# 安装telnet
sudo yum install telnet

# 安装net-tools（包括：netstat、ifconfig）
sudo yum install net-tools
```



## 4. 时区修改

```shell
# 查看当前时区
timedatectl

# 上海时间
sudo timedatectl set-timezone Asia/Shanghai

# 安装同步时间软件
sudo yum install ntpdate # or sudo yum install ntp 
# 启动服务
sudo systemctl start ntpd.service
sudo systemctl enable ntpd.service
# 检查状态
ntpq -p
```



## 5. CentOS切换图形化页面或命令行模式

```bash
# 将图形化界面切换为命令行
systemctl set-default multi-user.target
# 将命令行切换成图形化界面
systemctl set-default graphical.target

# 完成后，重启
reboot
```

