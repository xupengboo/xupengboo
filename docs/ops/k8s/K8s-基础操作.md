# Kubernetes 基础操作



## 1. K8s 中心化架构

K8s 采用严格的 "中心化架构"，所有组件都不能直接互相通信，也不能直接访问数据库（etcd），**所有交互必须通过 apiserver 中转**。

```plain
┌─────────┐  ┌────────────────┐  ┌────────────────────────────┐  ┌──────────┐
│ kubectl │  │ kube-scheduler │  │ kube-controller-manager    │  │ kubelet  │
└────┬────┘  └──────┬─────────┘  └──────────┬─────────────────┘  └────┬─────┘
     │              │                       │                         │
     └──────────────┼───────────────────────┘─────────────────────────┘
                    │
                    v
            ┌───────────────┐
            │ kube-apiserver │  <-- 唯一的交互入口
            └───────┬───────┘
                    │
                    v
            ┌───────────────┐
            │     etcd      │  <-- 集群唯一的数据存储
            └───────────────┘
```



## 2. K8s 污点

Master 节点默认不允许部署非系统 Pod 可以通过删除污点的方式允许部署。

1. **查看污点**：

```shell
# 通过 -l 标签选择器， 筛选node更加高效
kubectl describe node -l node-role.kubernetes.io/master= | grep -B3 Taints
...
Taints:             node-role.kubernetes.io/master:NoSchedule

# 直接查看某个node节点的配置
kubectl describe node kcs-yd-qk-zhaocai-k8s-test-m-r8dlq -A | grep -C3 Taints
...
Taints:             node-role.kubernetes.io/master:NoSchedule
...
```

命令参数详解：

- `-l` ：`--selector` （标签选择器） 在 `kubectl describe node -l node-role.kubernetes.io/master=`  中，只选择带有 `node-role.kubernetes.io/master` 标签的节点（即集群主控节点）进行描述。
- `-B3` ：`--before-context=3`（前导上下文），用于控制匹配结果的输出范围。在 `grep -B3 Taints` 中，显示包含 `Taints` 关键词的行，同时额外显示匹配行之前的 3 行内容（B = Before）

2. **添加污点：**

```shell
# 也可以直接选择对应的 node ，添加污点
kubectl taint nodes master01 node-role.kubernetes.io/master:NoSchedule
```

3. **删除污点：(加个 - 就行。)**

```shell
# 通过 -l 选择器，删除污点
kubectl taint node -l node-role.kubernetes.io/master node-role.kubernetes.io/master:NoSchedule-
```

## 3.  常用命令

```shell
# 查询某个 node 下面的 Pod 信息。
kubectl get pods -n procure -o wide  | grep k8s-node1
```

- `-o` = `--output`：指定 **输出格式**

- `wide`：宽格式 / 扩展格式（比默认输出多显示几列关键信息）



```shell
# 快速基于某个镜像创建 deployment 应用
kubectl create deploy nginx-name --image=registry.cn-beijing.aliyuncs.com/dotbalo/nginx:l.15.12 -n study-ingress
```



```bash
# kubectl create --dry-run 快速生成基础模板（最常用）
kubectl create <资源类型> <资源名称> [必要参数] --dry-run=client -o yaml > 输出文件.yaml

# 1. 生成Deployment模板（最常用）
kubectl create deployment nginx-deploy --image=nginx:1.27 --replicas=3 --port=80 --dry-run=client -o yaml > deployment.yaml

# 2. 生成Service模板（ClusterIP类型）
kubectl create service clusterip nginx-svc --tcp=80:80 --dry-run=client -o yaml > service-clusterip.yaml

# 3. 生成Service模板（NodePort类型）
kubectl create service nodeport nginx-svc --tcp=80:80 --node-port=30080 --dry-run=client -o yaml > service-nodeport.yaml

# 4. 生成ConfigMap模板（从文件）
kubectl create configmap app-config --from-file=app.properties --dry-run=client -o yaml > configmap.yaml

# 5. 生成Secret模板（Opaque类型）
kubectl create secret generic db-secret --from-literal=username=admin --from-literal=password=123456 --dry-run=client -o yaml > secret.yaml

# 6. 生成ServiceAccount模板
kubectl create serviceaccount my-sa --dry-run=client -o yaml > sa.yaml

# 7. 生成Namespace模板
kubectl create namespace my-namespace --dry-run=client -o yaml > namespace.yaml
```

- `--dry-run=client`：只在本地计算生成YAML，**不会实际创建任何资源**
- `-o yaml`：指定输出格式为YAML
- `> 文件名.yaml`：将输出重定向保存到文件



```shell
# 查看你的 Kubernetes 集群，到底支持创建哪些资源（对象，例如：Pod、Service、Ingress、Deployment 这些东西，集群认不认识、能不能用。）
kubectl api-resources

# 例如：查看当前集群是否支持 ingress 资源
kubectl api-resources | grep ingress
```

