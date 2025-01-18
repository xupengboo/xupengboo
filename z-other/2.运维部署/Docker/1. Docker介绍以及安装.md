## 一、Docker 简介

Docker 是一个开源的容器引擎，它有助于更快地交付应用。Docker 可将应用程序和基础设施层隔离，并且能将基础设施当作程序一样进行管理。使用 Docker , 可更快地打包、测试以及部署应用程序，并可以缩短从编写到部署运行代码的周期。
* Docker 的官方网址链接：[https://www.docker.com](https://www.docker.com/)
* Docker 的 GitHub : http://github.com/docker/docker  



> Tips：最近，镜像拉去经常超时，解决办法：https://blog.csdn.net/weixin_50160384/article/details/139861337




## 二、Docker 的架构

Docker 架构包含的主要组件：

* `Docker daemon ( Docker 守护进程 ）`

Docker daemon 是一个运行在宿主机 （DOCKER\_HOST） 的后台进程。可通过 Docker 客户端与之通信。

* `Client （Docker 客户端）`

Docker 客户端是 Docker 的用户界面，它可以接受用户命令和配置标识，并与 Docker daemon 通信。

* `Images ( Docker 镜像 )`

Docker 镜像是一个只读模板，它包含创建 Docker 容器说明。它和系统安装光盘有点像 —— 使用系统安装光盘可以安装系统，同理，使用 Docker 镜像可以运行 Docker 镜像中的程序。

* `Container （容器）`

容器是镜像的可运行实例。镜像和容器的关系有点类似于面向对象中，类和对象的关系。可通过 Docker API 或 CLI 命令来启动、停止和移动、删除容器。

* `Registry ( 注册 )`

Docker Registry 是一个集中存储与分发镜像的服务。构建完 Docker 镜像后，就可在当前宿主机上运行。但如果想要在其他机器上运行这个镜像，就需要手动复制。此时，就可借助 Docker Registry 来避免镜像的手动复制。

一个 Docker Registry 可包含多个 Docker 仓库，每个仓库可包含多个镜像标签，每个标签对应一个 Docker 镜像。这跟 Maven 的仓库有点类似，如果把 Docker Registry 比作 Maven 仓库的话，那么 Docker 仓库就可理解为某 jar 包的路径，而镜像标签则可理解为 jar 包的版本号。

Docker Registry 可分为公有 Docker Registry 和私有 Docker Registry 。最常用的 Docker Registry 莫过于官方的 Docker Hub， 这也是默认的 Docker Registry 。Docker Hub 上存放着大量优秀的镜像，可使用 Docker 命令下载并使用。





## 三、Docker准备

Docker 官方建议将 Docker 运行在 Linux 操作系统上。当然，Docker 也支持运行在其他平台，例如 Windows、MacOS 等。
* 安装参考官方文档：[http://docs.docker.com/engine/installation/](http://docs.docker.com/engine/installation/)

### 系统要求

* Docker 运行在 CentOS 7.X 之上 （不支持内核在 3.8 以下的老版本）

### 通过以下命令查看您的 CentOS 内核
`uname -r`
需要保证Docker安装在 64 位平台

### 移除非官方软件包

Red Hat 操作系统包含了一个旧版本的 Docker 软件包，该旧版本软件包的名称是 “ docker ”，而新版本是 “ docker-engine ”。因此，如已安装该软件包，那么需要执行以下命令移除。

~~~shell
$ sudo yum remove docker
~~~

Tips：执行该命令只会移除旧版本的 Docker , /var/lib/docker 目录中的内容不会被删除，因此，旧版本 Docker 所创建的镜像、容器、卷等都会保留下来。

### 卸载旧版本

~~~shell
$ sudo yum remove docker \
                  docker-common \
                  docker-selinux \
                  docker-engine
~~~

### 设置 Yum 源

Docker 有多种安装方式，例如 Yum 安装、PRM 包安装、Shell安装等。以下以 Yum 安装方式进行, Docker 分 Docker EE 和 Docker CE 两种版本（EE：企业版，收费的；CE：社区版，不收费）。

1、安装 yum-utils , 这样就能使用 yum-config-manager 工具设置 Yum 源。

~~~shell
$ sudo yum install -y yum-utils \
  device-mapper-persistent-data \
  lvm2
~~~

2、执行以下命令，添加 Docker 的 Yum 源。

~~~shell
$ sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
~~~

3、【可选】启用测试仓库。测试仓库包含在 docker.repo 文件中，但默认情况下禁用的。

如需启用测试仓库，可使用以下命令：

~~~shell
$ sudo yum-config-manager --enable docker-ce-edge
~~~

~~~shell
$ sudo yum-config-manager --enable docker-ce-test
~~~

如想要禁用测试仓库，可执行以下命令：

~~~shell
$ sudo yum-config-manager --disable docker-ce-edge
~~~




## **四、安装Docker**

1、更新 Yum 包的索引

~~~shell
$ sudo yum makecache fast
~~~

2、安装最新版本的 Docker

~~~shell
$ sudo yum install docker-ce
~~~

3、在生产系统中，可能需要安装指定版本的 Docker ，而并不总是安装最新的版本。

执行以下命令，即可列出可用的 Docker 版本

~~~shell
$ yum list docker-ce --showduplicates | sort -r
~~~

列出 Docker 版本后，可使用以下命令安装指定版本的 Docker 。

~~~shell
$ sudo yum install 
~~~

例如：

~~~shell
$ sudo yum -y install docker-ce-17.09.0.ce
~~~

4、启动 Docker

~~~shell
$ sudo systemctl start docker
~~~

5、执行以下命令，验证安装是否正确

~~~shell
$ sudo docker run hello-world
~~~

6、查看 Docker 版本

~~~shell
docker version
~~~



现在，国内docker网站是访问不通的，所以一开始就需要更换docker镜像仓库：（以阿里云的Docker仓库配置为例：）

```shell
# 1. 记得先备份
sudo cp /etc/yum.repos.d/docker-ce.repo /etc/yum.repos.d/docker-ce.repo.bak
# 2. 修改
vi /etc/yum.repos.d/docker-ce.repo
## 添加以下内容：
[docker-ce]
name=Docker CE Stable - $basearch
baseurl=https://mirrors.aliyun.com/docker-ce/linux/centos/7/x86_64/stable
enabled=1
gpgcheck=1
gpgkey=https://mirrors.aliyun.com/docker-ce/linux/centos/gpg

[docker-ce-edge]
name=Docker CE Edge - $basearch
baseurl=https://mirrors.aliyun.com/docker-ce/linux/centos/7/x86_64/edge
enabled=0
gpgcheck=1
gpgkey=https://mirrors.aliyun.com/docker-ce/linux/centos/gpg

[docker-ce-test]
name=Docker CE Test - $basearch
baseurl=https://mirrors.aliyun.com/docker-ce/linux/centos/7/x86_64/test
enabled=0
gpgcheck=1
gpgkey=https://mirrors.aliyun.com/docker-ce/linux/centos/gpg

# 3. 重新安装
sudo yum clean all
sudo yum makecache
sudo yum install docker-ce docker-ce-cli containerd.io
systemctl start docker
systemctl enable docker
```




## 五、卸载 Docker

1、卸载 Docker 软件包

~~~shell
$ sudo yum remove docker-ce
~~~

2、如需删除镜像、容器、卷以及自定义的配置文件，可执行以下命令

~~~shell
$ sudo rm -rf /var/lib/docker
~~~




## 六、配置镜像加速器

国内访问 Docker Hub 的速度很不稳定，有时甚至出现连接不上的情况。为 Docker 配置镜像加速器，从而解决这个问题。目前国内很多云服务商都提供了镜像加速的服务。常用的镜像加速器有：  
阿里云加速器、DaoCloud加速器等。  
以阿里云加速器为例：  
1、注册阿里云账号，即可在阿里云控制台（[https://cr.console.aliyun.com/cn-zhangjiakou/instances/mirrors](https://cr.console.aliyun.com/cn-zhangjiakou/instances/mirrors)）  
2、按照提示说明，即可配置镜像加速器。





## 七、ipv4转向配置
若启动docker的时候报错：`WARNING IPv4 forwarding is disabled. Networking will not work`  
解决方案：

~~~shell
 vi /etc/sysctl.conf
~~~

添加配置

~~~shell
net.ipv4.ip_forward=1
~~~

重启

~~~shell
systemctl restart network
~~~

查看是否成功

~~~shell
sysctl net.ipv4.ip_forward
~~~

如果返回为`net.ipv4.ip_forward = 1`则表示成功了
