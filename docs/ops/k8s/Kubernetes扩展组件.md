# Kubernetes 扩展组件

> **K8s 采用插件化架构，核心只做最基础的容器编排，其他所有能力都通过扩展组件实现。**扩展组件非常重要，是几乎每个是生产机必备的组件。

## 1. Ingress Controller（Nginx Ingress）

集群的 "统一入口大门"，替代 NodePort 管理所有 HTTP/HTTPS 流量。

- 用 NodePort 暴露服务，每个服务占一个端口，最多只能开 30000-32767 这 2768 个端口，生产环境根本不够用。

- Ingress 可以用 **同一个 IP + 端口** ，通过不同域名转发到不同服务（比如 `nacos.xupengboo.com` 到 Nacos，`api.xupengboo.com` 到微服务）

- 原生支持 HTTPS、负载均衡、限流、熔断、重写等功能



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

新版的k8s中，系统资源的采集使用 Metrics-server ，可以通过Metrics采集节点和Pod的内存、磁盘、CPU和网络的使用率。

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

## 4. Dashboard





## 5. KeepAlived 和 HAProxy





