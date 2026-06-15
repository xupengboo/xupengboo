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

### 3.1 Create 操作

```shell
# 快速基于某个镜像创建 deployment 应用
kubectl create deploy nginx-name --image=nginx:1.26 -n study-ingress

# 也可以指定固定的仓库名，来快速创建
kubectl create deploy nginx-name --image=registry.cn-xxx.aliyuncs.com/xxx/nginx:1.26 -n study-ingress
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



### 3.1 Pod 操作

```shell
# 查询某个 node 下面的 Pod 信息。
kubectl get pods -n procure -o wide  | grep k8s-node1
```

- `-o` = `--output`：指定 **输出格式**

- `wide`：宽格式 / 扩展格式（比默认输出多显示几列关键信息）



### 3.2 Service 操作


```shell
# 一键自动创建 Service，不用你手写 YAML，直接把 Deployment 暴露给集群内部 / Ingress 使用。
kubectl expose deploy backend-api --port 80 -n study-ingress

# 假设：构建了一个 backedn-api 的 deployment 
kubectl create deploy backend-api --image=registry.cn-beijing.aliyuncs.com/dotbalo/nginx:backend-api -n study-ingress
```

| 字段               | 含义                                      |
| ------------------ | ----------------------------------------- |
| `kubectl expose`   | K8s 专用命令：**给工作负载创建 Service**  |
| `deploy`           | 缩写 = `Deployment`（你要暴露的资源类型） |
| `backend-api`      | 你要暴露的 **Deployment 名称**            |
| `--port 80`        | 生成的 Service 端口 = 80                  |
| `-n study-ingress` | 在 `study-ingress` 命名空间执行           |



### 3.3 Deployment 操作

Deployment 通过 ReplicaSet 管理Pod，可以查看此Deployment当前对应的ReplicaSet：

```shell
[root@k8s-master ~]# kubectl get rs -l app=nginx -A
NAMESPACE       NAME               DESIRED   CURRENT   READY   AGE
study-ingress   nginx-785999d887   1         1         1       9d
```

> ReplicaSet的命名格式为[DEPLOYMENT-NAME]-[POD-TEMPLATE-HASH-VALUE]POD-TEMPLATE-HASH- VALUE，是自动生成的，不用手动指定。

1. `rollout status`: Deployment 默认采用「滚动更新」策略：不会一次性把所有旧 Pod 删掉，而是逐步启动新 Pod → 新 Pod 就绪后 → 再销毁一个旧 Pod，循环往复直到全部替换完成，保证发布过程中业务不中断。`rollout status` 就是全程跟踪这个替换过程，不用你反复手动执行 kubectl get pods 去刷状态。

```shell
kubectl rollout status deployment/nginx -nstudy-ingress
# deployment "nginx" successfully rolled out
```

2. `rollout history`: 查看发布历史记录
```shell
kubectl rollout history deployment/nginx -nstudy-ingress
# deployment.apps/nginx
# REVISION  CHANGE-CAUSE
# 1         <none>
```

3. `set image`: 假如更新某个Pod的image（例如：Nginx），并且使用 `--record` 记录当前更改的参数（后期回滚时可以查看到对应的信息）：
```shell
kubectl set image deployment nginx-deployment nginx=nginx:1.9.1 --record
deployment.extensions/nginx-deployment image updated
```
> 也可以使用 `edit` 命令，直接编辑Deployment修改镜像。

### 3.4 Deployment 回滚步骤

```shell
# 使用 `--record` 记录当前更改的参数（后期回滚时可以查看到对应的信息），模拟构建两个历史版本：
kubectl set image deployment nginx-deploy nginx=nginx:1.27 --record
kubectl set image deployment nginx-deploy nginx=nginx:1.28 --record
```

1. 使用 `kubectl rollout history` 查看更新历史， 查看Deployment某次更新的详细信息，**使用 `--revision` 指定某次更新的版本号**。

```shell
# kubectl rollout history deploy nginx-deploy
deployment.apps/nginx-deploy
REVISION  CHANGE-CAUSE
1         kubectl set image deployment nginx-deploy nginx=nginx:1.27 --record=true
2         kubectl set image deployment nginx-deploy nginx=nginx:1.28 --record=true
```

2. 使用 `kubectl rollout undo` 回滚上一个版本。

```shell
kubectl rollout undo deploy nginx-deploy
```

3. 使用 `kubectl rollout `, 通过 `--to-revision=2（histroy查看）` 回滚指定版本。

```shell
kubectl rollout undo deploy nginx-deploy --to-revision=2
```


### 3.5 api-resources 操作


```shell
# 查看你的 Kubernetes 集群，到底支持创建哪些资源（对象，例如：Pod、Service、Ingress、Deployment 这些东西，集群认不认识、能不能用。）
kubectl api-resources

# 例如：查看当前集群是否支持 ingress 资源
kubectl api-resources | grep ingress
```
