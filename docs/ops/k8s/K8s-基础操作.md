Kubernetes 基础操作



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
kubectl create deploy nginx-name --image=nginx:1.26 -n xupengboo

# 也可以指定固定的仓库名，来快速创建
kubectl create deploy nginx-name --image=registry.cn-xxx.aliyuncs.com/xxx/nginx:1.26 -n xupengboo
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

### 6.1 deploy 基础操作

**Deployment 通过 ReplicaSet 管理Pod，可以查看此Deployment当前对应的ReplicaSet：**

```shell
[root@k8s-master ~]# kubectl get rs -l app=nginx -A
NAMESPACE       NAME               DESIRED   CURRENT   READY   AGE
xupengboo   nginx-785999d887   1         1         1       9d
```

> ReplicaSet的命名格式为[DEPLOYMENT-NAME]-[POD-TEMPLATE-HASH-VALUE]POD-TEMPLATE-HASH- VALUE，是自动生成的，不用手动指定。

1. **`rollout status`: Deployment 默认采用「滚动更新」策略**：不会一次性把所有旧 Pod 删掉，而是逐步启动新 Pod → 新 Pod 就绪后 → 再销毁一个旧 Pod，循环往复直到全部替换完成，保证发布过程中业务不中断。`rollout status` 就是全程跟踪这个替换过程，不用你反复手动执行 kubectl get pods 去刷状态。

```shell
kubectl rollout status deployment/nginx -nxupengboo
# deployment "nginx" successfully rolled out
```

2. **`rollout history`: 查看发布历史记录**

```shell
kubectl rollout history deployment/nginx -nxupengboo
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

### 6.2 deploy 回滚步骤

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

### 6.3 deploy 扩充步骤

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

### 6.4 deploy 暂停恢复

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

1. **扩容或缩容：`kubectl scale sts web --replicas=5`** 

```bash
kubectl get sts
NAME   READY   AGE
web    2/2     21h

kubectl scale sts web --replicas=5
statefulset.apps/web scaled
```

2. **命令动态查看：`kubectl get pods -w -l app=nginx`** 

- `--selector`，简写 `-l` ：根据 Pod 的标签过滤，只查询匹配标签的资源。
- `--watch `，     简写 `-w` ：持续监听资源变化，实时刷新输出。

```yaml
[root@k8s-master ~]# kubectl get pods -w -l app=nginx
NAME    READY   STATUS    RESTARTS   AGE
web-0   1/1     Running   1          21h
web-1   1/1     Running   1          21h
web-2   1/1     Running   0          108s
web-3   1/1     Running   0          79s
web-4   1/1     Running   0          70s
```

### 7.3 sts 更新策略

| 更新策略                    | 是否自动更新 Pod | 更新触发方式                                                 | 更新顺序                                                     | 是否支持灰度更新               | 适用场景                                                     | 备注                                                         |
| --------------------------- | ---------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `RollingUpdate`             | 是               | 修改 StatefulSet 的 Pod 模板后自动触发                       | 按 **Pod 编号从大到小** 更新，例如 `mysql-2 -> mysql-1 -> mysql-0` | 支持（配合 `partition`）       | MySQL、Redis、Kafka、Elasticsearch 等有状态服务的常规升级    | **默认策略**，前一个 Pod Ready 后才会继续更新下一个          |
| `OnDelete`                  | 否               | 修改 StatefulSet 后 **不会自动更新**，必须手动删除 Pod 才会按新模板重建 | 由你手动删除哪个 Pod 决定                                    | 不支持自动灰度，但可以人工控制 | 需要严格人工控制升级顺序的场景，例如数据库主从切换、中间件升级 | 适合“先切主、再删从、最后删主”这种场景                       |
| `RollingUpdate + partition` | 是（部分 Pod）   | 修改 StatefulSet 后自动更新，但只更新 **序号 >= partition** 的 Pod | 仍然按 **Pod 编号从大到小** 更新                             | 支持                           | 灰度升级、先升级从节点、保留主节点不动                       | 常用于主从架构，例如先更新 `mysql-1/mysql-2`，保留 `mysql-0` |

**常见配置示例：**

1. **默认滚动更新**

```yaml
spec:
  updateStrategy:
    type: RollingUpdate
```

2. **灰度更新（保留 xxx-0 不动）**

- **分段更新 将会使 StatefulSet 中其余的所有Pod（序号小于分区）保持当前版本，只更新序号大于等于分区的Pod，利用此特性可以简单实现金丝雀发布（灰度发布）**

```yaml
spec:
  updateStrategy:
    type: RollingUpdate
    rollingUpdate:
      partition: 3
# partition分区，分段更新（金丝雀发布）
```

3. **手动更新**

```yaml
spec:
  updateStrategy:
    type: OnDelete
```

### 7.4 sts 删除

| 删除方式                    | 常用命令                                        | StatefulSet 对象 | Pod                                     | PVC        | 适用场景                                          | 备注                                                    |
| --------------------------- | ----------------------------------------------- | ---------------- | --------------------------------------- | ---------- | ------------------------------------------------- | ------------------------------------------------------- |
| 级联删除（默认）            | `kubectl delete sts mysql`                      | 删除             | 一般会一起删除                          | 不一定删除 | 正常下线 StatefulSet 服务                         | Pod 是否删除取决于级联；PVC 是否删除取决于 PVC 保留策略 |
| 级联删除（显式 foreground） | `kubectl delete sts mysql --cascade=foreground` | 删除             | 一起删除，通常先删 Pod 再删 StatefulSet | 不一定删除 | 想明确按前台级联删除资源                          | 行为上和默认删除很接近，重点是“先处理子资源再删父资源”  |
| 非级联删除（orphan）        | `kubectl delete sts mysql --cascade=orphan`     | 删除             | **保留**                                | 保留       | 想保留现有 Pod 做排障 / 临时脱离 StatefulSet 控制 | Pod 会继续运行，但不再受 StatefulSet 管理               |



## 8. DaemonSet 操作

### 8.1 ds 基础概念

**DaemonSet（守护进程集，缩写为ds）和守护进程类似，它在符合匹配条件的节点上均部署一个Pod。**

DaemonSet 确保全部（或者某些符合条件）节点上运行一个Pod副本 。当有新节点加入集群时，也会为它们新增一个Pod，当节点从集群中移除时，这些Pod也会被回收，删除DaemonSet将会删除它创建的所有Pod。

### 8.2 ds 场景案例

| 场景分类            | 典型用途                                        | 常见组件/案例                              | 为什么适合 DaemonSet                                         |
| ------------------- | ----------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------ |
| 日志采集            | 采集每台节点上的容器日志、系统日志              | Filebeat、Fluent Bit、Fluentd、Vector      | 每个节点都有自己的容器日志和系统日志，需要每台机器部署一个采集器 |
| 节点监控            | 采集 CPU、内存、磁盘、网络、inode 等主机指标    | Node Exporter、Datadog Agent、Zabbix Agent | 节点指标是每台机器本地的数据，需要每台节点都运行监控 Agent   |
| 网络插件            | 负责 Pod 网络通信、路由、iptables/ipvs、eBPF 等 | Calico、Flannel、Cilium、kube-proxy        | 每个节点都要参与 Pod 网络通信，所以每台节点都要运行网络组件  |
| 存储插件            | 节点级卷挂载、存储接入、本地磁盘管理            | CSI Node Plugin、Ceph CSI、Longhorn        | 每个节点都可能挂载卷或处理本地存储逻辑，因此需要节点级插件   |
| Ingress / 边缘入口  | 在指定入口节点直接监听 80/443，对外提供访问入口 | Ingress Nginx（某些裸机/边缘场景）         | 希望每个入口节点都跑一个 Ingress Pod，对外提供统一入口       |
| GPU / 硬件插件      | 向 Kubernetes 注册 GPU、网卡、FPGA 等硬件资源   | NVIDIA Device Plugin                       | 只有在有 GPU 的节点上部署一个插件，K8s 才能识别该节点的 GPU 能力 |
| 安全巡检 / 主机安全 | 采集主机安全事件、运行时审计、入侵检测          | Falco、Wazuh Agent、安全巡检 Agent         | 安全事件很多发生在宿主机层面，所以每台节点都要运行安全 Agent |
| 节点清理 / 节点维护 | 清理临时文件、巡检磁盘、同步配置、预热镜像      | 自定义 node-cleaner、运维巡检脚本          | 每个节点都需要执行本地清理或维护任务，适合节点级常驻服务     |

**以 日志采集 案例：**

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: logging
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: filebeat
  namespace: logging
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: filebeat-config
  namespace: logging
data:
  filebeat.yml: |
    filebeat.inputs:
      - type: container
        paths:
          - /var/log/containers/*.log

    processors:
      - add_kubernetes_metadata:
          host: ${NODE_NAME}
          matchers:
            - logs_path:
                logs_path: "/var/log/containers/"

    output.elasticsearch:
      hosts: ["http://elasticsearch.logging.svc.cluster.local:9200"]

    setup.ilm.enabled: false
---
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: filebeat
  namespace: logging
  labels:
    app: filebeat
spec:
  selector:
    matchLabels:
      app: filebeat
  template:
    metadata:
      labels:
        app: filebeat
    spec:
      serviceAccountName: filebeat
      containers:
        - name: filebeat
          image: docker.elastic.co/beats/filebeat:8.14.0
          imagePullPolicy: IfNotPresent
          securityContext:
            runAsUser: 0
          env:
            - name: NODE_NAME
              valueFrom:
                fieldRef:
                  fieldPath: spec.nodeName
          volumeMounts:
            - name: varlog
              mountPath: /var/log
            - name: varlibdockercontainers
              mountPath: /var/lib/docker/containers
              readOnly: true
            - name: filebeat-config
              mountPath: /usr/share/filebeat/filebeat.yml
              subPath: filebeat.yml
      volumes:
        - name: varlog
          hostPath:
            path: /var/log
        - name: varlibdockercontainers
          hostPath:
            path: /var/lib/docker/containers
        - name: filebeat-config
          configMap:
            name: filebeat-config
```

### 8.3 ds 更新和回滚

```bash
# DaemonSet 更新
kubectl edit ds/<daemonset-name>
kubectl patch ds/<daemonset-name> -p=<strategic-merge-patch>

# 查看更新状态
kubectl rollout status ds/<daemonset-name>

# 列出所有修订版本
kubectl rollout history daemonset <daemonset-name>

# 回滚指定版本
kubectl rollout undo daemonset <daemonset-name> --to-revision=<revision>
```

## 9. CronJob 操作

### 9.1 cj 基础概念

**CronJob（计划任务，缩写为cj）**

CronJob（计划任务，缩写为cj）用于以时间为基准周期性地执行任务，这些自动化任务和运行在Linux或UNIX系统上的 CronJob 一样。

**CronJob对于创建定期和重复任务非常有用，例如执行备份任务、周期性调度程序接口、发送电子邮件等。**

### 9.2 cj 基础操作

```bash
# 1. 创建 CronJob（定时周期任务）
kubectl create cronjob hello \
  --schedule="*/1 * * * *" \
  --image=busybox \
  -- /bin/sh -c "date; echo Hello from the Kubernetes cluster"

# 2. 创建一次性 Job
kubectl create job hello \
  --image=busybox \
  -- /bin/sh -c "date; echo Hello from the Kubernetes cluster"
 
# 3. 查看 cronjob
kubectl get cronjob # kubectl get cj
NAME    SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
hello   */1 * * * *   False     0        <none>          9s

# 4. 删除 cronjob
kubectl delete cronjob hello
```

**CronJob 每次调用任务的时候会创建一个 Job，Job 会创建一个名为 `JOB_NAME-xxx` 的Pod执行命令，成功执行完任务后：**


```bash
[root@k8s-master rc]# kubectl get jobs
NAME               COMPLETIONS   DURATION   AGE
hello-1782288300   1/1           4s         2m41s
hello-1782288360   1/1           6s         101s
hello-1782288420   1/1           5s         41s
```

## 10. 标签与选择器 

### 10.1 label 、selector  基础概念

**标签（label）是给资源“贴名字/贴分类”。 选择器（selector）是“按标签找资源”。**

- Service 就是 “ 通过选择器把流量转发给符合标签的 Pod ” 。

```yaml
# 标签定义：
labels:
  app: nginx
  env: prod
  version: v1
  
# 选择器定义：
selector:
  app: nginx
```

### 10.2 label 定义标签

```bash
# 1. 定义标签：key=value
kubectl label node k8s-slave01 region=subnet7
node/k8s-slave01 labeled

# 2. 通过选择器对其筛选
kubectl get no -l region=subnet7
NAME          STATUS   ROLES    AGE   VERSION
k8s-slave01   Ready    worker   8d    v1.20.15

# 3. 也可以更新 svc 的标签内容：
kubectl get svc -n xupengboo
NAME          TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
nginx         ClusterIP   10.43.210.129   <none>        80/TCP    18d
# 可以一口气标记多个label标签。
kubectl label svc nginx -n xupengboo env=test version=v1
service/nginx labeled
```

::: tip 如何查看某些资源的标签有哪些？

方式 1：`kubectl get ... --show-labels`：直接在列表里把标签显示出来。

方式 2：`kubectl describe ...`：看某个具体资源的详细信息，里面会有 `Labels`。

方式 3：`kubectl get ... -o yaml`：直接看资源 YAML，里面的 `metadata.labels` 最清楚。

方式 4：`kubectl get ... -L 标签名`：只展示你关心的某几个标签列，最适合日常排查。 

:::

### 10.3 label 修改标签

**通过 `--overwrite` 标签，来重写标签：**

```bash
# 1. 先获取
kubectl get svc --show-labels -nxupengboo
NAME          TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE   LABELS
nginx         ClusterIP   10.43.210.129   <none>        80/TCP    18d   env=test,version=v2

# 2. 修改标签
kubectl label svc nginx -nxupengboo version=v3 --overwrite
service/nginx labeled

# 3. 后对比
kubectl get svc --show-labels -nxupengboo
NAME          TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE   LABELS
nginx         ClusterIP   10.43.210.129   <none>        80/TCP    18d   env=test,version=v3
```

### 10.4 label 删除标签

**有时候也会需要删除某资源的标签，在 label 的key名后面加一个减号即可删除：**

```bash
# 删除标签：
kubectl label svc nginx -nxupengboo version-
```



## 11. Service 操作

::: tip service 效果图：

![PixPin_2026-06-24_18-07-46](/public/images/PixPin_2026-06-24_18-07-46.png)

:::

### 11.1 svc 基础概念

Service 四种类型：

- `ClusterIP`：在集群内部使用，默认值，只能从集群中访问。

- `NodePort`：在所有安装了Kube-Proxy的节点上打开一个端口，此端口可以代理至后端Pod，可以通过NodePort从集群外部访问集群内的服务，格式为NodeIP:NodePort。

- `LoadBalancer`：使用云提供商的负载均衡器公开服务，成本较高。

- `ExternalName`：通过返回定义的CNAME别名，将 Service 映射到可被 DNS 解析的其他域名，需要1.7或更高版本kube-dns的支持。

```yaml
kind: Service
apiVersion: v1
metadata:
  name: my-service
spec:
  selector:
    app: myapp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
```

---

**`kubectl expose` 用法：将已有的工作负载（Deployment、Pod、ReplicaSet 等）快速暴露为一个新的 Service（服务）资源。**

```shell
# 一键自动创建 Service，不用你手写 YAML，直接根据 Deployment 构建出对应的 Service 服务。
kubectl expose deploy <deployment-name> --port 80 -n xupengboo

# 假设：构建了一个 backedn-api 的 deployment 
kubectl create deploy backend-api --image=registry.xxx.aliyuncs.com/nginx:backend-api -n xupengboo
```

| 字段                | 含义                                      |
| ------------------- | ----------------------------------------- |
| `kubectl expose`    | K8s 专用命令：**给工作负载创建 Service**  |
| `deploy`            | 缩写 = `Deployment`（你要暴露的资源类型） |
| `<deployment-name>` | 你要暴露的 **Deployment 名称**            |
| `--port 80`         | 生成的 Service 端口 = 80                  |
| `-n xupengboo`      | 在 `xupengboo` 命名空间执行               |



### 11.3 Endpoint 与 Service 

情况一：有选择器的 Service 

- **创建一个带有选择器的 Service 后，集群会在该 Service 所在的 Namespace 下自动创建一个同名的 Endpoint（缩写 ep）。**

- **这个Endpoint（缩写为ep）记录了选择器匹配到的Pod的IP地址和端口。**

```bash
[root@k8s-master ~]#  kubectl get ep -nprocure 
NAME             ENDPOINTS                                                  AGE
blade-gateway    10.238.252.46:80                                           6d15h
nacos-nodeport   10.238.252.28:8848,10.238.252.28:9848,10.238.252.28:8080   23d
redis-nodeport   10.238.252.32:6379                                         23d
saber3           10.238.155.110:80                                          6d17h
```



情况二：没有选择器的 Service 

- **由于这个Service没有选择器，就不会创建相关的 Endpoints 对象，可以手动创建一个同名的Endpoints（同名的 Service 和Endpoints 会自动建立链接）**

- 有时需要通过Service代理集群外部服务时，**可以创建一个没有 Selector 字段的Service，之后再手动创建 Endpoint 添加外部服务即可，以下情况均可使用无选择器的Service。**

> Endpoint IP地址不能是loopback（127.0.0.0/8）、link-loca（l169.254.0.0/16）或者link-local多播地址（224.0.0.0/24）。

### 11.4 ExternalName Service 类型

ExternalName Service 是 Service 的特例，它没有选择器，也没有定义任何端口和 Endpoint ，它通过返回该外部服务的别名来提供服务。

例如：可以定义一个Service，后端设置为一个外部域名，这样通过Service的名称即可访问该域名。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mysql-db
  namespace: study
spec:
  type: ExternalName
  externalName: db-xxx.mysql.rds.aliyuncs.com  # 外部服务的真实域名
```

### 11.5 svc 代理模式

**iptables** 是 Linux 系统内核原生的网络数据包处理工具，也是 Kubernetes Service 实现流量转发的核心底层技术之一，你可以把它通俗理解成 Linux 服务器自带的「网络规则处理器」。

iptables 是线性逐条匹配规则，当集群里 Service 数量达到几百上千个时，节点上的 iptables 规则会有上万条，匹配和更新的效率都会大幅下降。而 ipvs 是内核专门的负载均衡模块，用哈希表匹配规则，性能更稳定，所以**生产环境大规模集群更推荐 ipvs 模式**。

## 12. ConfigMap 操作

### 12.1 cm 基础概念

ConfigMap 中的数据是以 **键-值对（key-value pair）** 的形式保存的：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-config
  namespace: xupengboo
data:
  # 文件名作为 key，文件内容作为 value（用 | 保留换行格式）
  default.conf: |
    server {
        listen 80;
        server_name localhost;

        location / {
            root /usr/share/nginx/html;
            index index.html index.htm;
        }

        location /api {
            proxy_pass http://backend-api:80;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }

  # 可以同时放多个配置文件
  nginx.conf: |
    user nginx;
    worker_processes auto;
    error_log /var/log/nginx/error.log warn;
    pid /var/run/nginx.pid;

    events {
        worker_connections 1024;
    }

    http {
        include /etc/nginx/mime.types;
        default_type application/octet-stream;
        sendfile on;
        keepalive_timeout 65;
        include /etc/nginx/conf.d/*.conf;
    }
```

**使用 kubectl 创建一个 ConfigMap 的命令格式：**

```bash
 kubectl create configmap <map-name> <data-source>
 
 # map-name：ConfigMap的名称。
 # data-source：数据源，可以是数据的目录、文件或字符值。
```

### 12.2 cm 目录创建

`--from-file=conf` 根据目录创建 cm 。

```bash
# 根据目录进行创建
kubectl create configmap test-config --from-file=conf -n xupengboo

cat conf/ui.properties
color.good=purple
color.bad=yellow

cat conf/user.properties
username=xupengboo
password=1234

# 查看 cm 信息
kubectl get cm test-config -nxupengboo -oyaml
apiVersion: v1
data:
  user.properties: |
    username=xupengboo
    password=1234
  ui.properties: |
    color.good=purple
    color.bad=yellow
kind: ConfigMap
...
```

### 12.3 cm 文件创建

`--from-file=conf/user.properties`：基于文件创建 ConfigMap

```bash
kubectl create cm test-config2 --from-file=conf/user.properties -n xupengboo
configmap/test-config2 created

# 也可以使用--from-file多次传入参数以从多个数据源创建ConfigMap
kubectl create cm test-config3 --from-file=conf/user.properties --from-file=conf/ui.properties -n xupengboo
configmap/test-config3 created
```

### 12.4 cm ENV 文件创建

**`key=value` 形式的数据，此类文件可以当作某个应用的环境变量配置**，此时可以使用`--from-env-file` 从 ENV 文件创建 ConfigMap：

`--from-env-file=conf/user.properties`：构建 ENV 文件

```bash
kubectl create cm test-env-config --from-env-file=conf/user.properties
configmap/test-env-config created

kubectl get cm test-env-config -oyaml
apiVersion: v1
data:
  password: "1234"
  username: xupengboo
kind: ConfigMap
...
```

```bash
# 少量的内容，可以通过 --from-literal 进行快速创建。
kubectl create configmap special-config --from-literal=special.how=very --from-literal=special.type=charm
```

## 13. Secret 操作

### 13.1 Secret 基础概念

**ConfigMap 主要用于非安全的数据，与其对应的是 Secret 对象类型，用来保存敏感信息，例如密码、令牌和SSH Key，将这些信息放在Secret中比较安全和灵活。**

| 命令案例                                                     | Secret 分类     | type 字段值                           | 核心说明                                                     | 典型适用场景                                                 | 关键特性                                                     |
| ------------------------------------------------------------ | --------------- | ------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `kubectl create secret generic mysecret --from-literal=username=admin --from-literal=password=123456` | 通用不透明密钥  | `Opaque`                              | 默认类型，支持存储任意自定义敏感数据，内容以 base64 编码存储 | 存储业务自定义的账号密码、API 密钥、加密密钥、配置敏感项等任意键值对数据 | 最灵活通用，无格式约束；`data` 字段值需 base64 编码，也可使用 `stringData` 字段直接写入明文 |
| 通常由系统自动创建，手动创建：`kubectl create secret generic my-sa-token --type=kubernetes.io/service-account-token` | 服务账号令牌    | `kubernetes.io/service-account-token` | 用于标识 Kubernetes 服务账号（ServiceAccount）的 API 访问令牌 | Pod 访问 Kubernetes API Server 时的身份认证；系统会自动为每个 ServiceAccount 创建对应 Secret | 默认自动挂载到 Pod 的 `/var/run/secrets/kubernetes.io/serviceaccount` 路径；固定包含 `token`、`ca.crt`、`namespace` 三个键 |
| `kubectl create secret docker-registry myregistrykey --docker-server=DOCKER_REGISTRY_SERVER --docker-username=DOCKER_USER --docker-password=DOCKER_PASSWORD --docker-email=DOCKER_EMAIL` | Docker 仓库认证 | `kubernetes.io/dockerconfigjson`      | 适配 Docker 新版 `~/.docker/config.json` 格式的镜像仓库认证凭据 | Harbor、Docker Hub 私有库、阿里云镜像服务等私有镜像仓库的拉取认证，是当前主流用法 | `data` 中固定键为 `.dockerconfigjson`；支持专用子命令快速创建 |
| `kubectl create secret generic my-basic-auth --type=kubernetes.io/basic-auth --from-literal=username=admin --from-literal=password=123456` | 基础认证密钥    | `kubernetes.io/basic-auth`            | 专门用于存储 HTTP 基础认证（Basic Auth）的用户名与密码       | Nginx 基础认证、内部服务接口鉴权、需要 Basic Auth 的第三方服务访问 | `data` 固定包含 `username` 和 `password` 两个键；语义化强，便于统一管理基础认证类凭据 |
| `kubectl create secret generic my-ssh-key --type=kubernetes.io/ssh-auth --from-file=ssh-privatekey=~/.ssh/id_rsa` | SSH 认证密钥    | `kubernetes.io/ssh-auth`              | 专门存储 SSH 身份认证的私钥文件                              | Git 仓库 SSH 协议拉取代码、服务器 SSH 免密登录、SFTP 服务认证等场景 | `data` 固定键为 `ssh-privatekey`，存储 SSH 私钥的 base64 内容 |
| `kubectl create secret tls my-tls-secret --cert=./tls.crt --key=./tls.key` | TLS 证书密钥    | `kubernetes.io/tls`                   | 专门存储 TLS 证书与私钥对                                    | Ingress 资源的 HTTPS 加密、服务端 TLS 证书配置、服务双向认证场景 | `data` 固定包含 `tls.crt`（证书文件）和 `tls.key`（私钥文件）；支持专用子命令快速创建 |
| 通常由 kubeadm 自动生成，手动创建需指定完整 token 字段，生产不建议手动构造 | 集群引导令牌    | `bootstrap.kubernetes.io/token`       | Kubernetes 集群引导阶段的节点接入令牌                        | kubeadm 集群初始化时，新节点执行 `kubeadm join` 加入集群的身份认证 | 生命周期短，仅用于集群搭建阶段；包含 `token-id`、`token-secret` 等固定字段，支持过期自动失效 |

### 13.2 Secret 基础操作

```bash
cat username.txt
admin
cat password.txt
123123

# 1. 构建 secret 密钥
kubectl create secret generic db-user-pass --from-file=./username.txt --from-file=./password.txt

# 2. 查看 secret 密钥
kubectl get secret db-user-pass -oyaml
apiVersion: v1
data:
  password.txt: MTIzMTIz
  username.txt: YWRtaW4K
kind: Secret

# 3. 解码 secret 密钥
echo "MTIzMTIz" | base64 --decode
123123
```

### 13.3 Secret 文件挂载

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    # 挂载目录 
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
      readOnly: true
  # 挂载 secret 
  volumes:
  - name: foo
    secret:
      secretName: mysecret 
```

### 13.4 Secret 环境变量

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-env-pod
spec:
  containers:
  - name: mycontainer
    image: redis
    env:
      - name: SECRET_USERNAME
        valueFrom:
          # Secret 作为环境变量
          secretKeyRef:
            name: mysecret
            key: username
      - name: SECRET_PASSWORD
        valueFrom:
          # Secret 作为环境变量
          secretKeyRef:
            name: mysecret
            key: password
  restartPolicy: Never
```



## 14. ConfigMap 与 Secret 注意点

### 14.1 SubPath 实现精准挂载

`subPath` 是 Kubernetes 中 `volumeMounts` 的字段，用来解决**整卷挂载会覆盖容器目标目录原有文件**的问题，实现「精准挂载单个文件 / 子目录，不破坏目录原有内容」。

- 用 `subPath` ：卷里的单个文件 → 只覆盖目标目录里的对应文件，其他文件不受影响

```yaml
# 会覆盖 /etc/foo 下面的所有内容
volumeMounts:
- name: foo
  mountPath: "/etc/foo"
  readOnly: true
volumes:
- name: foo
  secret:
    secretName: mysecret
   
# 使用 subPath 实现精准挂载
volumeMounts:
- name: foo
  mountPath: "/etc/foo/username"  # 容器内的目标文件完整路径
  subPath: "username"             # Secret/Volume 中对应的 key 名
  readOnly: true
- name: foo
  mountPath: "/etc/foo/password"
  subPath: "password"
  readOnly: true
volumes:
- name: foo
  secret:
    secretName: mysecret
```

### 14.2 Secret 与 ConfigMap 文件替换

`kubectl replace -f -` ：**通过文件创建的 Secret 和 ConfigMap 不能被直接替换**，但是通过 YAML 文件创建可以被替换，所以先使用`dry-run -oyaml` 生成YAML文件，再进行 `replace` 即可实现热更新，该方法可以用于其他资源类型，通过YAML文件替换已经创建的资源也是可以的。

> 管道 + `kubectl replace -f -`
>
> - 管道 `|`：把前面生成的 YAML 内容，作为后面命令的输入。
> - `kubectl replace -f -` 里的 `-` 是约定写法：表示从 **标准输入** 读取资源定义，而不是从本地文件读取。

```bash
# 初始创建
kubectl create secret generic mysecret --from-literal=username=admin --from-literal=password=123456

# 一行命令完成全量替换
kubectl create secret generic mysecret \
  --from-literal=username=admin \
  --from-literal=password=654321 \
  --dry-run=client -o yaml \
  | kubectl replace -f -
```

## api-resources 操作

```shell
# 查看你的 Kubernetes 集群，到底支持创建哪些资源（对象，例如：Pod、Service、Ingress、Deployment 这些东西，集群认不认识、能不能用。）
kubectl api-resources

# 例如：查看当前集群是否支持 ingress 资源
kubectl api-resources | grep ingress
```
