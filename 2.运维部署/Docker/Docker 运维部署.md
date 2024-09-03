## mvn、jdk安装
[centos7下安装Maven_centos7安装maven-CSDN博客](https://blog.csdn.net/qq_38738510/article/details/105567513)
[CentOS7 安装jdk8教程_centos7安装jdk8-CSDN博客](https://blog.csdn.net/codedz/article/details/124044974)

## 部署自定义网络
```powershell
# 1. 创建自定义网络。
docker network create itholmes_network
# 2. 通过以下方式绑定网络 或者 创建时，--network itholmes_network
docker network connect itholmes_network mysql
docker network disconnect itholmes_network mysql
# 3. 重启
docker restart container_name
```
## Dockerfile 写法
```dockerfile
# 基础镜像
FROM  openjdk:8-jre
# author
MAINTAINER ruoyi

# 挂载目录
VOLUME /home/ruoyi
# 创建目录
RUN mkdir -p /home/ruoyi
# 指定路径
WORKDIR /home/ruoyi
# 复制jar文件到路径
COPY ./jar/ruoyi-auth.jar /home/ruoyi/ruoyi-auth.jar
# 启动认证服务
ENTRYPOINT ["java","-jar","ruoyi-auth.jar"]
```
## docker Swarm 跨宿主机通讯
[跨宿主机- 如何实现 Docker 容器的通讯？（Docker-Swarm）_docker swarm 访问宿主机 add-host-CSDN博客](https://blog.csdn.net/adparking/article/details/119140418)
> 💡Tips：work节点一开始不会刷新出来在manager节点创建的network，之后某个容器服务声明以后才能构建。

## 中间服务器 搭建
### MySQL
```powershell
# Mysql 8版本：
docker run -d -p 3306:3306 --privileged=true \
-v /itholmes/mysql/log:/var/log/mysql \
-v /itholmes/mysql/data:/var/lib/mysql \
-v /itholmes/mysql/conf:/etc/mysql/conf.d \
-e MYSQL_ROOT_PASSWORD=0818 --name mysql mysql:8.0.34

# Mysql 5版本：
docker run -p 3306:3306 --privileged=true --name mysql \
-v /mydata/mysql/log:/var/log/mysql \
-v /mydata/mysql/data:/var/lib/mysql \
-v /mydata/mysql/conf:/etc/mysql \
-e MYSQL_ROOT_PASSWORD=0818 \
-d mysql:5.7

# 参数说明
# -p 3306:3306：将容器的 3306 端口映射到主机的 3306 端口
# -v /mydata/mysql/conf:/etc/mysql：将配置文件夹挂载到主机
# -v /mydata/mysql/log:/var/log/mysql：将日志文件夹挂载到主机
# -v /mydata/mysql/data:/var/lib/mysql/：将配置文件夹挂载到主机
# -e MYSQL_ROOT_PASSWORD=root：初始化 root 用户的密码
```
```shell
# vi /mydata/mysql/conf/my.cnf
[client]
default-character-set=utf8
[mysql]
default-character-set=utf8
[mysqld]
init_connect='SET collation_connection = utf8_unicode_ci' init_connect='SET NAMES utf8' character-set-server=utf8
collation-server=utf8_unicode_ci
skip-character-set-client-handshake
skip-name-resolve
```
**docker5.7部署，无法进入MySQL服务内部问题：**
**1、先进去容器中安装vim工具**
```powershell
docker exec -it mysql bash
apt-get update
apt-get -y install vim
```
**2、修改/etc/mysql/conf.d/docker.cnf文件，添加：skip-grant-tables**
```latex
[mysqld]
skip-host-cache
skip-name-resolve
skip-grant-tables
```
**3、退出，重启mysql容器**
```powershell
docker restart mysql
```
**4、再次进入容器mysql -uroot -p进入mysql后**
```sql
mysql> use mysql;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed

mysql> update mysql.user set authentication_string = password("root1234") where user="root";
Query OK, 2 rows affected, 1 warning (0.00 sec)
Rows matched: 2  Changed: 2  Warnings: 1

mysql> exit
```
**5、删除/etc/mysql/conf.d/docker.cnf文件中添加的skip-grant-tables，在重启容器**
**6、再次进入mysql就正常了。**

**下载包过慢：**
[docker容器中下载vim指令的速度特别慢，解决方案-CSDN博客](https://blog.csdn.net/qq_41739987/article/details/117875020)
**docker部署mysql5.7异常：**
[docker部署mysql5.7后登录时出现Access denied for user ‘root‘@‘localhost‘ (using password: YES)的解决方法-CSDN博客](https://blog.csdn.net/weixin_48226988/article/details/112681407)

### Redis
```powershell
# Redis 容器卷配置
docker run -p 6379:6379 --name redis -v /itholmes/redis/data:/data \
-v /itholmes/redis/conf/redis.conf:/etc/redis/redis.conf \
-d redis redis-server /etc/redis/redis.conf
```
### ES
```powershell
# 安装es docker
docker pull elasticsearch:7.4.2
# 提供可视化 可视化检索数据
docker pull kibana:7.4.2 

# 查看安装还有多少内存
free -m

# 挂载的 配置和数据存储 目录
mkdir -p /mydata/elasticsearch/config
mkdir -p /mydata/elasticsearch/data
# 配置elasticsearch的配置文件，
# 作用：http.host参数用于指定Elasticsearch HTTP服务的绑定地址。当设置为0.0.0.0时，表示Elasticsearch将监听所有可用的网络接口，包括本地回环地址（localhost）和外部网络接口。
echo "http.host: 0.0.0.0" >> /mydata/elasticsearch/config/elasticsearch.yml

# 9200端口：接受Rest API请求端口。
# 9300端口：分布式集群状态下的通信接口
# -e "discovery.type=single-node"：指定单节点模式
# -e ES_JAVA_OPTS="-Xms64m -Xmx128m"：指定初始占用内存 和 最大占用内存，必须指定，不然占死内存。
docker run --name elasticsearch -p 9200:9200 -p 9300:9300 \
-e "discovery.type=single-node" \
-e ES_JAVA_OPTS="-Xms64m -Xmx128m" \
-v /mydata/elasticsearch/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml \
-v /mydata/elasticsearch/data:/usr/share/elasticsearch/data \
-v /mydata/elasticsearch/plugins:/usr/share/elasticsearch/plugins \
-d elasticsearch:7.4.2

# docker启动失败，查看日志
docker logs 应用名

# 安装过程可能遇到 elasticsearch accessdenied问题，那是文件目录权限问题
chmod -R 777 /mydata/elasticsearch

# 重新启动elasticsearch
docker start elasticsearch 

# -e ELASTICSEARCH_HOSTS：指定elasticsearch的ip地址和api端口号
docker run --name kibana \
-e ELASTICSEARCH_HOSTS=http://192.168.154.132:9200 \
-p 5601:5601 \
-d kibana:7.4.2

# 注意：这里启动后是一个小linux容器，所以，此处没办法去应用在hosts文件配置的域名解析，需要用真实的IP或公共域名

# 同样通过logs命令，排除安装失败问题
docker logs kibana
```
### Nginx
```powershell
# 1. 先下载一个nginx，方便获取/etc/nginx目录下的配置文件。
docker run -p 80:80 --name nginx -d nginx:1.10
# 将容器中的/etc/nginx 复制当前目录。
docker container cp nginx:/etc/nginx .
# 将其改为conf文件，用来映射conf文件。
mv nginx/ conf/

# 2. 创建nginx容器
docker run -p 80:80 --name nginx \
-v /itholmes/nginx/html:/usr/share/nginx/html \
-v /itholmes/nginx/logs:/var/log/nginx \
-v /itholmes/nginx/conf:/etc/nginx \
--network itholmes_network \
-d nginx:1.10

# 3. 访问对应ip:80 ，测试是否安装成功。

# 4. 进入nginx/html目录下，创建es目录，放置es词典器。
mkdir es
cd es
# 在es目录下面，创建一个fenci.txt文件：可以输入一些测试词语、张三等等。
vi fenci.txt
```
### RabbitMQ
```powershell
# 1. 启动 rabbitmq:management 容器
docker run -d --name rabbitmq -p 5671:5671 -p 5672:5672 \
-p 4369:4369 -p 25672:25672 -p 15671:15671 -p 15672:15672 rabbitmq:management
# 2. 自动重启
docker update rabbitmq --restart=always
```
### Nacos
```powershell
# 1. 创建配置目录
mkdir -p /itholmes/nacos/logs/                      #新建logs目录
mkdir -p /itholmes/nacos/conf/						#新建conf目录

# 2. 先启动一个案例，把配置等全部拿过来
docker run -p 8848:8848 --name nacos -d nacos/nacos-server:v2.0.4

# 3. 将配置复制出来
docker cp nacos:/home/nacos/logs/ /itholmes/nacos/
docker cp nacos:/home/nacos/conf/ /itholmes/nacos/

# 4. 移除旧的nacos
docker rm -f nacos

# 5. 启动新的nacos
docker run -d \
  --name nacos \
  -p 8848:8848  -p 9848:9848 -p 9849:9849 \
  --privileged=true \
  -e JVM_XMS=512m \
  -e JVM_XMX=512m \
  -e MODE=standalone \
  -v /itholmes/nacos/logs/:/home/nacos/logs \
  -v /itholmes/nacos/conf/:/home/nacos/conf \
  --restart=always \
nacos/nacos-server:v2.0.4

# 推荐v2.0.4，新版本2.2之后可能需要鉴权  -e NACOS_AUTH_ENABLE=true  操作。
虽然能启动起来，但是启动的无法进行登录操作，应该不是我想要的nacos系统，可能版本不对。

```
### Tomcat
```powershell
# tomcat安装
docker run -id --name=c_tomcat \
-p 8080:8080 \
-v $PWD:/usr/local/tomcat/webapps \
tomcat 

# -p 8080:8080：将容器的8080端口映射到主机的8080端口
# -v $PWD:/usr/local/tomcat/webapps：将主机中当前目录挂载到容器的webapps
```
### Jenkins
```powershell
docker run -u root --name jenkins \ 
	--memory 512m --memory-swap=512m \ 
  # --rm \ 推出容器自动删除，一般考虑释放存储
  -d -p 8080:8080 -p 50000:50000 \
  -v $JENKINS_HOME/jenkins-data:/var/jenkins_home \
  -v $JENKINS_HOME/docker.sock:/var/run/docker.sock \
  jenkinsci/blueocean
```
### Gitlab
```powershell
export GITLAB_HOME=/itholmes/gitlab

sudo docker run --detach \
  --hostname gitlab.fh.com \
  --publish 8000:443 --publish 8001:80 --publish 8002:22 \
  --name gitlab \
  --restart always \
  --memory 5g \
 	--memory-swap=6g \
  --volume $GITLAB_HOME/config:/etc/gitlab \
  --volume $GITLAB_HOME/logs:/var/log/gitlab \
  --volume $GITLAB_HOME/data:/var/opt/gitlab \
  --shm-size 256m \
  registry.gitlab.cn/omnibus/gitlab-jh:latest
```
### Rancher
```powershell
sudo docker run -d --privileged \
	--restart=unless-stopped \ 
  --name rancher \
  -p 80:80 -p 443:443 -p 2379:2379 \
  -v /itholmes/rancher:/var/lib/rancher/ \ 
  rancher/rancher:v2.5.12
```
