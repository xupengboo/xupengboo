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

## 3. Kubectl Create 操作

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

## 4. Pod 操作

### 4.1 Pod 探针（Probe）

**`Startup Probe（启动探针）`：K8s 1.16 后引入，为了解决应用启动特别慢。**

- 启动期间， 只执行StartupProbe， 等 Startup 成功后， 才开始 Liveness 和 Readiness 。

```yaml
startupProbe:
  httpGet:
    path: /actuator/health
    port: 8080
  failureThreshold: 30
  periodSeconds: 10
```

**`Liveness Probe（存活探针）` ：判断容器是不是已经"死掉"了**

```yaml
# 以 HTTP 方式为例：
livenessProbe:
  httpGet:
    path: /actuator/health
    port: 8080
  initialDelaySeconds: 30      # 启动30秒后开始检查
  periodSeconds: 10		       # 每10秒检查一次   
```

**`Readiness Probe（就绪探针）` ：**

```bash
kubectl get pod
NAME      READY
nginx     1/1  （此处 READY 就是 Readiness 的状态， 如果失败： 0/1）
```

```yaml
# 以 HTTP 方式为例：
readinessProbe:
  httpGet:
    path: /actuator/health
    port: 8080
  periodSeconds: 5
```



**K8s支持三种检测方法。**

1. **HTTP 方式：**

- 适合：**`SpringBoot`**、`Nacos`、`Prometheus`、`Grafana`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: springboot-demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: springboot-demo
  template:
    metadata:
      labels:
        app: springboot-demo
    spec:
      containers:
      - name: springboot-demo
        image: springboot-demo:latest
        ports:
        - containerPort: 8080
        
        # 存活探针
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
            scheme: HTTP
          initialDelaySeconds: 60
          periodSeconds: 10
          timeoutSeconds: 3
          failureThreshold: 3
        # 就绪探针
        readinessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
            scheme: HTTP
          initialDelaySeconds: 30
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 2
          
# 等同于 curl http://PodIP:8080/actuator/health 
```

2. **TCP 探针：**

- 适用于：`MySQL`、`Redis`、`Kafka`、`RabbitMQ`、`Elasticsearch` 等。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:7
        ports:
        - containerPort: 6379
	    
	    # 存活探针
        livenessProbe:
          tcpSocket:
            port: 6379
          initialDelaySeconds: 20
          periodSeconds: 10
          timeoutSeconds: 3
          failureThreshold: 3
	    # 就绪探针
        readinessProbe:
          tcpSocket:
            port: 6379
          periodSeconds: 5
          timeoutSeconds: 3
# 等同于 telnet PodIP 6379
```

3. **Exec 探针：**

- 适用于：特殊业务检查、非 HTTP 服务、需要执行命令判断状态

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: mysql:8.0

        env:
        - name: MYSQL_ROOT_PASSWORD
          value: "123456"

	    # 存活探针：
        livenessProbe:
          exec:
            command:
            - sh
            - -c
            - "pgrep mysqld"
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
        # 就绪探针：
        readinessProbe:
          exec:
            command:
              - sh
              - -c
              - mysqladmin ping -h 127.0.0.1 -uroot -p123456
# 等同于： bash 命令的执行
```

### 4.2 Pod 镜像拉取策略和重启策略

```yaml
...
    containers:
    - name: app
      image: harbor.xxx.com/test/demo:v1
      imagePullPolicy: IfNotPresent
```

| 策略         | 行为                               | 本地有镜像 | 本地无镜像 | 适用场景                 | 推荐度 |
| ------------ | ---------------------------------- | ---------- | ---------- | ------------------------ | ------ |
| Always       | 每次启动都从镜像仓库检查并拉取镜像 | 仍会拉取   | 拉取       | 开发测试环境、latest标签 | ⭐⭐⭐    |
| IfNotPresent | 本地存在镜像则直接使用，否则拉取   | 直接使用   | 拉取       | 生产环境（最常用）       | ⭐⭐⭐⭐⭐  |
| Never        | 只使用本地镜像，绝不拉取           | 直接使用   | 启动失败   | 离线环境、内网环境       | ⭐⭐     |



### 4.3 Pod 其他操作

1. **查询某个 node 下面的 Pod 信息。**

```shell
# 查询某个 node 下面的 Pod 信息。
kubectl get pods -n procure -o wide  | grep k8s-node1
```

- `-o` = `--output`：指定 **输出格式**

- `wide`：宽格式 / 扩展格式（比默认输出多显示几列关键信息）



## 5. RS 操作

Replication Controller（复制控制器，RC）和 ReplicaSet（复制集，RS）是两种简单部署Pod的方式。

**ReplicaSet 是支持基于集合的标签选择器的下一代 Replication Controller ，它主要用作 Deployment 协调创建、删除和更新Pod，和Replication Controller 唯一的区别是，ReplicaSet支持标签选择器。**

![PixPin_2026-06-23_16-32-03.png](/public/images/PixPin_2026-06-23_16-32-03.png)

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: nginx-rs
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.28
        ports:
        - containerPort: 80
```



## 6. Deployment 操作 

### 6.1 Deploy 基础操作

**Deployment 通过 ReplicaSet 管理Pod，可以查看此Deployment当前对应的ReplicaSet：**

```shell
[root@k8s-master ~]# kubectl get rs -l app=nginx -A
NAMESPACE       NAME               DESIRED   CURRENT   READY   AGE
study-ingress   nginx-785999d887   1         1         1       9d
```

> ReplicaSet的命名格式为[DEPLOYMENT-NAME]-[POD-TEMPLATE-HASH-VALUE]POD-TEMPLATE-HASH- VALUE，是自动生成的，不用手动指定。

1. **`rollout status`: Deployment 默认采用「滚动更新」策略**：不会一次性把所有旧 Pod 删掉，而是逐步启动新 Pod → 新 Pod 就绪后 → 再销毁一个旧 Pod，循环往复直到全部替换完成，保证发布过程中业务不中断。`rollout status` 就是全程跟踪这个替换过程，不用你反复手动执行 kubectl get pods 去刷状态。

```shell
kubectl rollout status deployment/nginx -nstudy-ingress
# deployment "nginx" successfully rolled out
```

2. **`rollout history`: 查看发布历史记录**

```shell
kubectl rollout history deployment/nginx -nstudy-ingress
# deployment.apps/nginx
# REVISION  CHANGE-CAUSE
# 1         <none>
```

3. **`set image`**: 假如更新某个Pod的image（例如：Nginx），并且使用 `--record` 记录当前更改的参数（后期回滚时可以查看到对应的信息）：

```shell
kubectl set image deployment nginx-deployment nginx=nginx:1.9.1 --record
deployment.extensions/nginx-deployment image updated
```

> 也可以使用 `edit` 命令，直接编辑Deployment修改镜像。

### 6.2 Deploy 回滚步骤

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

2. **使用 `kubectl rollout undo` 回滚上一个版本。**

```shell
kubectl rollout undo deploy nginx-deploy
```

3. **使用 `kubectl rollout `, 通过 `--to-revision=2（histroy查看）` 回滚指定版本。**

```shell
kubectl rollout undo deploy nginx-deploy --to-revision=2
```

### 6.3 Deploy 扩充步骤

**`kubectl scale`: 扩缩容**，支持操作四类控制器：`deployment / statefulset / replicaset / replicationcontroller`

```shell
# 按照名字来
kubectl scale deploy nginx-deploy --replicas=5

# 按照 资源完整 API 标识 
kubectl scale deployment.v1.apps/nginx-deployment --replicas=5
# apps：API 组（工作负载组，Deployment 归属 apps）
# v1：API 版本
# deployment：资源类型
# nginx-deployment：deploy名称
```

### 6.4 Deploy 暂停恢复

使用 Deployment 暂停功能，**临时禁用更新操作**，对 Deployment 进行多次**修改后再进行更新**。

- **`kubectl rollout pause`: 暂停更新操作**
- **`kubectl rollout resume`: 恢复更新操作**

```bash
# 1. 暂停更新操作
kubectl rollout pause deployment/nginx-deployment

...
可以直接进行多次修改，无须暂停更新，kubectl set命令一般会集成在CICD流水线中
...

# 2. 恢复更新操作
kubectl rollout resume deployment.v1.apps/nginx-deployment
```

## 7. StatefulSet 操作

### 7.1 sts 基础概念

**StatefulSet（有状态集，缩写为sts）常用于部署有状态的且需要有序启动的应用程序**。

StatefulSet 主要用于管理有状态应用程序的工作负载API对象。比如在生产环境中，可以部署 ElasticSearch集群、MongoDB集群 或者 需要持久化的 RabbitMQ集群、Redis集群、Kafka集群 和 ZooKeeper集群 等。

**StatefulSet创建的 Pod 一般使用 Headless Service（无头服务）进行通信**，和普通的 Service 的区别在于 **Headless Service 没有ClusterIP，它使用 Endpoint 进行互相通信**。

YAML 案例，如下：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  ports:
  - port: 80
    name: web
  clusterIP: None
  selector:
    app: nginx
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web
spec:
  serviceName: "nginx"
  replicas: 2
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
        ports:
        - containerPort: 80
          name: web
```

### 7.2 sts 扩容和缩容










## . Service 操作

```shell
# 一键自动创建 Service，不用你手写 YAML，直接把 Deployment 暴露给集群内部 Ingress 使用。
kubectl expose deploy backend-api --port 80 -n study-ingress

# 假设：构建了一个 backedn-api 的 deployment 
kubectl create deploy backend-api --image=registry.xxx.aliyuncs.com/nginx:backend-api -n study-ingress
```

| 字段               | 含义                                      |
| ------------------ | ----------------------------------------- |
| `kubectl expose`   | K8s 专用命令：**给工作负载创建 Service**  |
| `deploy`           | 缩写 = `Deployment`（你要暴露的资源类型） |
| `backend-api`      | 你要暴露的 **Deployment 名称**            |
| `--port 80`        | 生成的 Service 端口 = 80                  |
| `-n study-ingress` | 在 `study-ingress` 命名空间执行           |





## . api-resources 操作

```shell
# 查看你的 Kubernetes 集群，到底支持创建哪些资源（对象，例如：Pod、Service、Ingress、Deployment 这些东西，集群认不认识、能不能用。）
kubectl api-resources

# 例如：查看当前集群是否支持 ingress 资源
kubectl api-resources | grep ingress
```
