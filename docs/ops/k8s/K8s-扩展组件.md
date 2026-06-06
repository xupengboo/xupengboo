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





#### 1.2.2 YAML 安装





### 1.3 配置 Ingress 







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
