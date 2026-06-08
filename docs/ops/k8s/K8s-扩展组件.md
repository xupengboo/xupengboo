# Kubernetes 扩展组件

> **K8s 采用插件化架构，核心只做最基础的容器编排，其他所有能力都通过扩展组件实现**。扩展组件非常重要，是几乎每个是生产机必备的组件。

## 1. Ingress Controller

### 1.1 介绍 Ingress

集群的 "统一入口大门"，替代 NodePort 管理所有 HTTP/HTTPS 流量。

- 用 NodePort 暴露服务，每个服务占一个端口，最多只能开 30000-32767 这 2768 个端口，生产环境根本不够用。

- Ingress 可以用 **同一个 IP + 端口** ，通过不同域名转发到不同服务（比如 `nacos.xupengboo.com` 到 Nacos，`api.xupengboo.com` 到微服务）

- 原生支持 HTTPS、负载均衡、限流、熔断、重写等功能

::: tip Ingress 详解

Ingress 和 Service、Deployment 等类似，也算是一个 Kubernetes的 资源对象，Deployment 是用来部署应用的，**Ingress就是实现用域名的方式访问应用**。

:::

### 1.2  安装 Ingress

Ingress 实现的方式有很多，比如 Nginx、HAProxy、Treafik 等，就 Nginx 而言，和传统服务架构用Nginx类似。

![PixPin_2026-06-04_23-02-27.png](/public/images/PixPin_2026-06-04_23-02-27.png)

**Ingress-Nginx 与 传统的 Nginx 并没有很大差别，只是不同的配置方式而已。**

| 对比项   | 宿主机 Nginx      | Ingress-Nginx      |
| -------- | ----------------- | ------------------ |
| 部署位置 | 物理服务器        | 节点 Pod 中        |
| 配置方式 | 手动改 nginx.conf | 编写 Ingress YAML  |
| 配置生成 | 人工编写          | 控制器自动生成配置 |



**Ingress Nginx Contoller 安装方式有两种：**

| 维度           | 纯 YAML 安装（kubectl apply）            | Helm 安装（包管理）                            |
| -------------- | ---------------------------------------- | ---------------------------------------------- |
| **核心定位**   | 手动操作 K8s 资源，类似「解压安装包」    | K8s 的「软件管家」，类似 Linux 的 yum/apt      |
| **操作方式**   | 直接应用单个 / 多个 YAML 文件            | 通过 Chart（应用模板）+ Values（配置参数）管理 |
| **配置管理**   | 改配置需手动编辑 YAML，易出错            | 改`values.yaml`即可，模板自动渲染              |
| **版本控制**   | 无原生版本管理，回滚需手动备份           | 自动记录 Release 历史，一键回滚                |
| **依赖管理**   | 需手动处理应用依赖（如 DB + 缓存）       | 自动管理 Chart 依赖，一键部署复杂应用          |
| **多环境适配** | 需维护多套 YAML 文件（dev/staging/prod） | 一套 Chart + 多套 Values，环境隔离             |
| **卸载清理**   | 需手动删除所有相关资源                   | 一键卸载，自动清理所有组件                     |
| **学习成本**   | 低（只需懂 kubectl 和 YAML）             | 稍高（需掌握 Chart、Values 等概念）            |
| **适用场景**   | 学习、测试、临时部署                     | 生产环境、长期维护、复杂应用                   |

#### 1.2.1  Helm 安装

> 以 helm 3.9.4 、 k8s 1.21.5 、 ingress-nginx Chart 4.0.19（官方已查，三者版本兼容）为例。

1. **安装 Helm ， 拉去版本镜像：**

```shell
# 1. 安装 Helm 
curl -LO https://get.helm.sh/helm-v3.9.4-linux-amd64.tar.gz
tar -zxvf helm-v3.9.4-linux-amd64.tar.gz
sudo mv linux-amd64/helm /usr/local/bin/helm
helm version

# 2. 添加仓库镜像
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx

# 3. 更新
helm repo update

# 4. 查询对应版本
helm search repo ingress-nginx/ingress-nginx --versions | grep 4.0.19

# 5. 拉去对应版本
helm pull ingress-nginx/ingress-nginx --version 4.0.19

# 6. 
```

2. **修改 `values.yaml`** 

```shell
# 解压
tar xf ingress-nginx-4.0.19.tgz 
# 进入目录
cd ingress-nginx/
# 编辑values.yaml
vim values.yaml

1）Controller 和 admissionWebhook 的镜像地址，需要将公网镜像同步至公司内网镜像仓库。
2）镜像的digest值注释，也可以设置为自己对应镜像地址的digest哈希值（安全性更好！更唯一）。
3）hostNetwork设置为 true，Pod会直接使用节点网络，占用节点 80/443 端口。
4）dnsPolicy设置为 ClusterFirstWithHostNet ，ClusterFirstWithHostNet 让 Pod 同时拥有：
✅ 集群内部 DNS 解析能力（访问 CoreDNS 解析服务名）
✅ 宿主机网络栈的优势（直接使用节点网络，如 ingress-nginx 占用 80/443 端口）。
5）NodeSelector添加 `ingress: "true"` ，部署至指定节点。
6）类型更改为kind: DaemonSet, 也可以是deployment。
7）将 Ingress Nginx 设置为默认的 ingressClass 。
```

![PixPin_2026-06-08_17-57-17.png](/public/images/PixPin_2026-06-08_17-57-17.png)

![PixPin_2026-06-08_18-07-28.png](/public/images/PixPin_2026-06-08_18-07-28.png)

3. **helm install 安装部署 ingress-nginx-controller**

```shell
# 安装部署
helm install ingress-nginx -n ingress-nginx .
```

倘若，helm 安装失败，可以再卸载重新安装：

- 安装失败，需要先排查 失败原因 ，一般是 Pod 异常。

```shell
# 1. 先卸载
helm uninstall ingress-nginx -n ingress-nginx
release "ingress-nginx" uninstalled
# 2. 删除角色
kubectl delete clusterrole ingress-nginx-admission --ignore-not-found
clusterrole.rbac.authorization.k8s.io "ingress-nginx-admission" deleted
# 3. 删除角色绑定
kubectl delete clusterrolebinding ingress-nginx-admission --ignore-not-found
clusterrolebinding.rbac.authorization.k8s.io "ingress-nginx-admission" deleted
# 4. 删除ns
kubectl delete ns ingress-nginx
namespace "ingress-nginx" deleted
```





#### 1.2.2 YAML 安装





### 1.3 配置 Ingress 

1. **Ingress 域名配置规则。**

```shell
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nginx-ingress
  namespace: study-ingress
spec:
  ingressClassName: nginx
  rules:
  - host: nginx.test.com
    http:
      paths:
      - backend:
          service:
            name: nginx
            port:
              number: 80
        path: /
        pathType: ImplementationSpecific
```

```shell
# kubectl 1·19 + 支持 create ingress 命令：
kubectl create ingress phone --rule=m.test.com/*=phone:80 -n study-ingress
```

2. **Ingress Nginx 域名重定向 Redirect 配置：**

- `nginx.ingress.kubernetes.io/permanent-redirect: https://www.baidu.com` 

```shell
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nginx-redirect
  namespace: study-ingress
  annotations:
  	# Ingress Nginx 域名重定向 Redirect 配置：
    nginx.ingress.kubernetes.io/permanent-redirect: https://www.baidu.com
spec:
  ingressClassName: nginx
  rules:
  - host: xupengboo
    http:
      paths:
      - backend:
          service:
            name: nginx
            port:
              number: 80
        path: /
        pathType: ImplementationSpecific
```

3. **Ingress Nginx 前后端分离 Rewrite。**

- 后端接口采用 /api 进行访问，用来区分前端和后端。
- 或者同时具有很多个后端，需要使用 /api-a 到A服务，/api-b 到B服务，但是由于A和B服务可能并没有 /api-a 和 /api-b 的路径，因此需要将/api-x重写为“/”，才可以正常到A或者B服务，否则将会出现404的报错。

```shell
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    # 匹配第二个 捕获组
    nginx.ingress.kubernetes.io/rewrite-target: /$2
  name: nginx-ingress
  namespace: study-ingress
spec:
  ingressClassName: nginx
  rules:
  - host: nginx.test.com
    http:
      paths:
      - backend:
          service:
            name: nginx
            port:
              number: 80
        path: /
        pathType: ImplementationSpecific
      - backend:
          service:
            name: backend-api
            port:
              number: 80
        # 匹配路径规则
        path: /api-a(/|$)(.*)
        pathType: ImplementationSpecific
```

::: tip 正则表达式 - 捕获组

路径写的是：`/api(/|$)(.*)`

这是一个**正则表达式**，里面有 **两个小括号（捕获组）**：

- 第 1 个括号 `(/|$)` → 对应 `$1`
- 第 2 个括号 `(.*)` → 对应 `$2`（匹配 `/api` 后面的所有内容）

`/$2` 的意思就是：**最终转发给后端的路径 = 斜杠 + 第二个捕获组的内容**

:::

4. **Ingress Nginx 错误代码重定向**， 当访问链接返回值为404、503等错误时，如何自动跳转到自定义的错误页面。

- 通过 Helm ， 配置 defaultBackend  TODO 



5. **Ingress Nginx SSL（Https）配置。**

- `http` 自动跳转到`HTTPS` 

```shell
# 构建测试密钥
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout tls.key -out tls.crt -subj "/CN=nginx.test.com"

# 配置 k8s 密钥
kubectl create secret tls ca-secret --cert=tls.crt --key=tls.key -n study-ingress

# 构建 tls 与 k8s-secret 密钥
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$2
  name: nginx-ingress
  namespace: study-ingress
spec:
  ingressClassName: nginx
  rules:
  - host: nginx.test.com
    http:
      paths:
      - backend:
          service:
            name: nginx
            port:
              number: 80
        path: /
        pathType: ImplementationSpecific
      - backend:
          service:
            name: backend-api
            port:
              number: 80
        path: /api-a(/|$)(.*)
        pathType: ImplementationSpecific
  # 配置 tls 密钥
  tls:
  - hosts:
    - nginx.test.com
    secretName: ca-secret
```



6. **`Ingress Nginx` 匹配请求头**

- 例如：可以通过请求头，来判断客户端来源，是来自手机端还是PC端，然后将其路由到指定的服务上。
- `nginx.ingress.kubernetes.io/server-snippet` ：`nginx-ingress` 控制器的专用注解，用于将原生 `NGINX` 配置片段注入到生成的 `server` 块中 `NGINX Documentation` 。

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    # 基于用户代理（User-Agent）的设备类型识别，自动将移动端访问重定向到移动版域名 
    nginx.ingress.kubernetes.io/server-snippet: |
      set $agentflag 0;
      if ($http_user_agent ~* "(Android|iPhone|Windows Phone|UC|Kindle)" ){
        set $agentflag 1;
      }
      if ( $agentflag = 1 ) {
        return 301 http://m.test.com;
      }
  name: laptop
  namespace: study-ingress
spec:
  ingressClassName: nginx
  rules:
  - host: test.com
    http:
      paths:
      - backend:
          service:
            name: laptop
            port:
              number: 80
        path: /
        pathType: ImplementationSpecific
```



7. **Ingress Nginx 基本认证**

```shell
# 安装 httpd 
yum install httpd -y

# 生成账号密码（用户admin，密码自己设）
htpasswd -c auth admin

# 创建Secret
kubectl create secret generic basic-auth --from-file=auth -n study-ingress

# 编辑
vim auth-ingress.yaml

# 应用
kubectl create -f auth-ingress.yaml
```

```yaml
# auth-ingress.yaml 文件内容：
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
  	# 需要密码认证的消息提醒。
    nginx.ingress.kubernetes.io/auth-realm: Please Input Your Username and Password
    # 指定密码文件 secret 的名称
    nginx.ingress.kubernetes.io/auth-secret: basic-auth
    # 认证类型，可以是basic和digest。
    nginx.ingress.kubernetes.io/auth-type: basic
  name: nginx-ingress-auth
  namespace: study-ingress
spec:
  ingressClassName: nginx
  rules:
  - host: auth.test.com
    http:
      paths:
      - backend:
          service:
            name: nginx
            port:
              number: 80
        path: /
        pathType: ImplementationSpecific
```

8. **Ingress Nginx 黑/白名单**

- 通过 Helm 配置 upgrade 升级 实现 TODO



9. **Ingress Nginx 速率限制**

- 有时候可能需要限制速率以降低后端压力，或者限制单个IP每秒的访问速率防止攻击，此时可以使用Nginx的ratelimit进行配置。

```shell
# 用 ApacheBench (ab) 对带 Basic 认证的 Ingress 服务做轻量压力测试
# -c 10 并发数 10， -n 100 总请求数 100
ab -c 10 -n 100 http://nginx.test.com/ | grep requests

Complete requests:      100
Failed requests:        0
Time per request:       0.184 [ms] (mean, across all concurrent requests)
Percentage of the requests served within a certain time (ms)
```

10. **使用 Nginx 实现灰度/金丝雀发布**







## 2. Calico 网络通信

**K8s 本身不自带网络功能**，必须安装 CNI（容器网络接口）插件才能让 Pod 之间、Pod 和 Service 之间正常通信。Calico 就是目前生产环境最推荐的 CNI 插件， 此外还有 Flannel 。

核心功能：

1. 给所有 Pod 分配唯一 IP 并实现全网通信

   - 每个 Pod 都会获得一个集群内唯一的 IP 地址

   - 实现 **Pod ↔ Pod**、**Pod ↔ 节点**、**Pod ↔ 外部网络** 的三层直接通信

2. 高性能网络，Calico 采用 **BGP 路由协议** 实现通信，**没有隧道封装和解封的额外开销**，性能接近物理网络。

```shell
[root@xupengboo01 ~]#  kubectl get pods -n kube-system | grep calico
calico-kube-controllers-cbc98576b-qrw5w                      1/1     Running   0          12d
calico-node-4qnxj                                            1/1     Running   0          12d
calico-node-dg7ck                                            1/1     Running   0          12d
calico-node-tjlj5                                            1/1     Running   0          12d
calico-typha-777547c9dd-d7z6j                                1/1     Running   0          12d
calico-typha-777547c9dd-qmgk5                                1/1     Running   0          12d
[root@xupengboo01 ~]#  kubectl get daemonset -n kube-system | grep calico
calico-node                 3         3         3       3            3           kubernetes.io/os=linux
```

**Rancher RKE/RKE2 集群的默认 CNI 插件是：`Canal = Flannel（负责网络通信） + Calico（负责网络策略）` 。**

```shell
[root@k8s-master ~]# kubectl get pods -n kube-system | grep canal
canal-2wdmh                                2/2     Running     10         2d12h
[root@k8s-master ~]# kubectl get daemonset -n kube-system
NAME    DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR            AGE
canal   1         1         1       1            1           kubernetes.io/os=linux   2d12h
```

## 3. Metrics 资源使用情况

在k8s中，系统资源的采集使用 Metrics-server ，可以 **通过 Metrics 采集节点和Pod的内存、磁盘、CPU和网络的使用率。**

```shell
[root@xupengboo ~]#  kubectl top node
NAME                                 CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%   
kcs-yd-qk-zhaocai-k8s-test-m-r8dlq   197m         2%     2561Mi          9%        
kcs-yd-qk-zhaocai-k8s-test-s-2pdf6   104m         2%     2098Mi          15%       
kcs-yd-qk-zhaocai-k8s-test-s-djsr2   240m         6%     3198Mi          24%       
[root@xupengboo ~]#  kubectl top po -A
NAMESPACE       NAME                                                         CPU(cores)   MEMORY(bytes)   
kube-system     calico-kube-controllers-cbc98576b-qrw5w                      2m           54Mi       
kube-system     calico-node-4qnxj                                            14m          158Mi       
kube-system     calico-node-dg7ck                                            16m          181Mi       
```

```shell
# 查看所有节点的资源使用情况
kubectl top nodes

# 查看所有命名空间下的Pod资源使用情况
kubectl top pods --all-namespaces

# 查看特定命名空间下的Pod资源使用情况
kubectl top pods -n kube-system

# 查看特定Pod中各个容器的资源使用情况
kubectl top pod <pod-name> --containers
```

## 4. KeepAlived 、 HAProxy  高可用

KeepAlived 和 HAProxy 配合主要用于一些高可用架构上， 例如：K8s的 多 master 集群。

- **HAProxy 负责 "分流量"**：是高性能的四层 / 七层负载均衡器，把请求合理分配到多个后端服务器
- **KeepAlived 负责 "不挂掉"**：是轻量级的高可用组件，解决负载均衡器本身的单点故障问题

生产级 K8s 集群架构，如下：

```plaintext
所有 K8s 组件
        |
        v
VIP: 192.168.1.100:6443  <-- KeepAlived 管理
        |
        +------------------------+
        |                        |
HAProxy-1 (master-1)      HAProxy-2 (master-2)
        |                        |
        +------------------------+
        |
        v
多个 apiserver 节点
```

## 4. Dashboard 集群可视化管理工具

Kubernetes Dashboard 是官方提供的**基于 Web 的集群可视化管理界面**，是 `kubectl` 命令行的图形化补充，让你通过浏览器直观管理集群资源、监控状态、排查故障，特别适合快速浏览和日常运维。
