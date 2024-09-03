# CentOS7 服务器 环境安装

> Tips：目的很简单，服务器经常切换，每次都要去部署各种各样的工具命令，忘记了还需要重新查一下，干脆直接写一篇，部署常用环境的markdown记录一下。



# 1. 配置服务器环境

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



# 2. 安装各种各样的工具

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





