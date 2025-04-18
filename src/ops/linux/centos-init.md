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

CentOS 7：
```shell
# 备份原来yum镜像源
cd /etc/yum.repos.d/
mkdir repo_bak
mv *.repo repo_bak/

# 下载其他的仓库镜像源（注意：对应CentOS系统的版本号）
# 注意是CentOS 7
# 阿里
sudo curl -o /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo 
# 网易
sudo curl -o /etc/yum.repos.d/CentOS-Base.repo http://mirrors.163.com/.help/CentOS7-Base-163.repo 

# 更新YUM源信息
sudo yum update
# 检查YUM源的速度
sudo yum repolist
# 清除系统所有的yum缓存
sudo yum clean all   
# 生成新的缓存
sudo yum makecache
```

CentOS 8（强制兼容 ）：
```bash
# 安装必要工具 
sudo yum install -y yum-utils 
 
# 添加 Docker 官方仓库（强制兼容 CentOS 8）
sudo yum-config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo  
sudo sed -i 's/\$releasever/8/g' /etc/yum.repos.d/docker-ce.repo  
 
# 安装 Docker 
sudo yum install docker-ce docker-ce-cli containerd.io  
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



## 6. CentOS 环境变量配置说明

Linux的环境变量可在多个文件中配置，如`/etc/profile` ，`/etc/profile.d/*.sh` ，`~/.bashrc` ，`~/.bash_profile` 等，下面说明上述几个文件之间的关系和区别。

bash的运行模式可分为`login shell` 和`non-login shell` 。

例如，我们通过终端，输入用户名、密码，登录系统之后，得到就是一个login shell。而当我们执行以下命令`ssh hadoop103 command` ，在 hadoop103 执行 command 的就是一个`non-login shell` 。

![image-20250418134559613](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250418134559613.png)

这两种`shell` 的主要区别在于，它们启动时会加载不同的配置文件，login shell启动时会加载`/etc/profile` ，`~/.bash_profile` ，`~/.bashrc` 。`non-login shell` 启动时会加载`~/.bashrc` 。

而在加载`~/.bashrc`（实际是`~/.bashrc` 中加载的`/etc/bashrc` ）或`/etc/profile` 时，都会执行如下代码片段，

```shell
for i in /etc/profile.d/*.sh /etc/profile.d/sh.local ; do
    if [ -r "$i" ]; then
        if [ "${-#*i}" != "$-" ]; then 
            . "$i"
        else
            . "$i" >/dev/null
        fi
    fi
done
```

因此不管是`login shell` 还是`non-login shell` ，启动时都会加载`/etc/profile.d/*.sh` 中的环境变量。

**所以，通过 `/etc/profile.d/\*.sh` 加载环境变量是推荐的做法**，尤其在多用户系统和需要统一管理全局配置的场景中。



