---
title: Kubernetes yaml配置
order: 3
---


## Kubernetes 的yaml配置文件

> Kubernetes 的 YAML 配置文件是定义和管理集群中的所有资源的关键工具。了解如何编写和使用这些配置文件对管理 Kubernetes 集群至关重要。

## 1. 基础结构

Kubernetes YAML 配置文件通常由以下几个部分组成：

- `apiVersion`: 资源使用的 API 版本。
- `kind`: 资源的类型（如 Pod、Service、Deployment 等）。
- `metadata`: 元数据，例如名称和标签。
- `spec`: 资源的具体配置，如容器的配置、选择器、服务端口等。

例如：

```yaml
# nginx-deployment.yaml
apiVersion: apps/v1  # Kubernetes API 版本
kind: Deployment  # 资源类型
metadata:
  name: nginx-deployment  # 部署名称
  labels:
    app: nginx  # 标签，用于选择 Pod
spec:
  replicas: 3  # 副本数量
  selector:
    matchLabels:
      app: nginx  # 标签选择器，用于匹配 Pod
  template:
    metadata:
      labels:
        app: nginx  # Pod 的标签
    spec:
      containers:
      - name: nginx  # 容器名称
        image: nginx:latest  # 使用的镜像
        ports:
        - containerPort: 80  # 容器暴露的端口

---
# nginx-service.yaml
apiVersion: v1  # Kubernetes API 版本
kind: Service  # 资源类型
metadata:
  name: nginx-service  # 服务名称
spec:
  type: LoadBalancer  # 服务类型（LoadBalancer 将分配一个外部 IP）
  selector:
    app: nginx  # 标签选择器，用于选择服务后端的 Pods
  ports:
    - protocol: TCP  # 协议类型
      port: 80  # 服务暴露的端口
      targetPort: 80  # 目标端口（容器内部端口）
```

## 2. kind 资源类型

| 资源类型                          | 用途（解释）                                                 |
| --------------------------------- | ------------------------------------------------------------ |
| Pod                               | Kubernetes 中的最小部署单元，包含一个或多个**容器**。        |
| Service                           | 为 Pod 提供稳定的**网络访问**抽象，支持负载均衡、服务发现等功能。 |
| Deployment                        | **管理 Pod 的声明性更新，支持滚动更新和回滚功能**。          |
| ConfigMap                         | **存储非机密的配置数据**，如环境变量、配置文件等。           |
| Secret                            | **存储敏感信息**，如密码、密钥等，避免将其暴露在 Pod 定义中。 |
| Namespace                         | 在同一 Kubernetes 集群中**创建多个虚拟集群，实现资源隔离**。 |
| PersistentVolume（PV）            | 定义一个**存储卷**，供 Pod 使用                              |
| PersistentVolumeClaim（PVC）      | Pod 使用持久存储卷的请求，**PVC 绑定到 PV**                  |
| StatefulSet                       | **管理有状态应用**，提供稳定的网络标识和持久存储。           |
| DaemonSet                         | **确保每个节点都运行一个 Pod 副本，常用于日志收集、监控等任务**。 |
| Job                               | **创建一个一次性任务，直到成功完成**。                       |
| CronJob                           | **定期执行任务**，类似于 Linux 的 cron 作业。                |
| Ingress                           | **管理外部访问服务的规则，通过 HTTP/HTTPS 提供服务**。       |
| ServiceAccount                    | 为 Pod 提供与 Kubernetes API 交互的身份，就是跟**用户要有哪些权限**效果一样。 |
| Role 和 ClusterRole               | 定义在命名空间或集群范围内的**访问权限**，**配合 ServiceAccount 使用**。 |
| RoleBinding 和 ClusterRoleBinding | 将 Role 或 ClusterRole **绑定到用户或 ServiceAccount**。     |
| HorizontalPodAutoscaler (HPA)     | **根据 CPU 或其他指标自动调整 Pod 的副本数量，自动扩缩容**。 |
| NetworkPolicy                     | **定义 Pod 之间以及 Pod 和外部之间的网络流量控制规则**。     |
| ResourceQuota                     | **限制命名空间中资源的总使用量**，例如 CPU、内存等。         |
| PodDisruptionBudget (PDB)         | 限制有多少个 Pod 可以同时被删除，用于维护时保证应用的高可用性。 |
| Volume                            | 定义一个存储卷，**用于在 Pod 中共享数据或持久化存储**。      |
| Endpoint                          | **存储一组 IP 地址，供 Service 使用**。                      |
| ReplicationController             | Kubernetes 中的一种**控制器**，用于**确保指定数量的 Pod 副本始终在运行**。 |

## 3. metadata 元数据

通过案例分析 `metadata` ：

```yaml
apiVersion: v1
kind: Pod
metadata:
  # 资源的名称。在命名空间内必须唯一。
  name: example-pod
  
  # 资源所在的命名空间，用于组织和隔离资源。
  namespace: production
  
  # 标签，用于给资源打上标签，以便于组织、选择和过滤资源。
  labels:
    app: myapp        # 通过标签标识属于 `myapp` 应用的资源。
    environment: production  # 指定资源所处的环境为生产环境。
    tier: backend     # 指定资源属于后台服务。
  
  # 注解，用于存储附加的非标识性元数据。
  annotations:
    description: "This pod runs the backend service for my application."  # 关于 Pod 的描述信息。
    createdBy: "john.doe@example.com"  # 记录创建 Pod 的人员。
    version: "v1.0.0"  # 记录 Pod 的版本信息。
  
  # 拥有者引用，定义当前资源的拥有者关系。
  ownerReferences:
    - apiVersion: apps/v1  # 所属资源的 API 版本。
      kind: Deployment    # 所属资源的类型。
      name: example-deployment  # 所属资源的名称。
      uid: 12345678-abcd-1234-efgh-56789ijklmnop  # 所属资源的唯一标识符。
  
  # Finalizers，指定在删除资源之前需要执行的操作。
  finalizers:
    - example.com/my-finalizer  # 指定的 finalizer。
  
  # 当没有提供 `name` 时，Kubernetes 会基于这个前缀生成一个唯一名称。
  generateName: example-pod-
  
  # 资源的版本号，用于并发控制。(一般k8s自动生成，无需添加)
  resourceVersion: "456789"
  
  # 资源的唯一标识符，由 Kubernetes 自动分配。(一般k8s自动生成，无需添加)
  uid: 12345678-abcd-1234-efgh-56789ijklmnop
  
  # 资源创建的时间戳，通常由 Kubernetes 自动生成。(一般k8s自动生成，无需添加)
  creationTimestamp: "2024-08-13T00:00:00Z"
  
spec:
  containers:
  - name: my-container
    image: nginx:1.17
    ports:
    - containerPort: 80
```

## 4. spec 资源规范（specification）

`spec` 定义了资源的具体配置和行为。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: example-deployment
  namespace: default
  labels:
    app: myapp
spec:
  # 定义要运行的 Pod 副本数量。例如 3 表示运行三个 Pod 实例。
  replicas: 3
  
  # 选择器用于选择和管理 Pod，必须与 Pod 模板中的标签匹配。
  selector:
    matchLabels:
      app: myapp  # 匹配标签，用于选择和管理的 Pod。
  
  # Pod 模板定义了新创建的 Pod 的规范。
  template:
    metadata:
      labels:
        app: myapp  # 与 selector 中的标签匹配，用于标识 Pod。
    
    spec:
      # 定义 Pod 中运行的容器列表。
      containers:
      - name: my-container               # 容器的名称，在 Pod 内部必须唯一。
        image: nginx:1.17                # 容器使用的 Docker 镜像。
        ports:
        - containerPort: 80             # 容器监听的端口。
        env:
        - name: ENV_VAR
          value: "example-value"       # 环境变量，用于配置容器内的应用程序。
        resources:
          requests:
            memory: "64Mi"             # 容器启动时请求的内存量。
            cpu: "250m"                # 容器启动时请求的 CPU 核心数。
          limits:
            memory: "128Mi"            # 容器允许使用的最大内存量。
            cpu: "500m"                # 容器允许使用的最大 CPU 核心数。
        volumeMounts:
        - name: my-volume
          mountPath: /data             # 将卷挂载到容器中的路径。
      
      # 定义 Pod 使用的卷。
      volumes:
      - name: my-volume
        emptyDir: {}                   # 使用 `emptyDir` 卷类型，适用于存储临时数据。
      
      # 节点选择器，根据节点标签调度 Pod。
      nodeSelector:
        disktype: ssd                  # 选择带有 `disktype: ssd` 标签的节点。
      
      # Pod 亲和性，用于指定调度规则，使 Pod 被调度到满足特定条件的节点上。
      affinity:
        podAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - myapp
            topologyKey: "kubernetes.io/hostname"  # 指定 Pod 必须调度到相同主机上。
      
      # 容忍节点上的污点，允许 Pod 被调度到标记为特定污点的节点上。
      tolerations:
      - key: "key"
        operator: "Equal"
        value: "value"
        effect: "NoSchedule"          # 容忍 `NoSchedule` 类型的污点。
      
      # Pod 的重启策略。`Always` 表示 Pod 无论失败与否都会重新启动。
      restartPolicy: Always
        
      # 终止 Pod 时，给予容器的宽限时间，单位为秒。
      terminationGracePeriodSeconds: 30  # 在 Pod 终止前的宽限时间。
      
      # 指定 Pod 的优先级类，用于影响调度顺序和资源分配。
      priorityClassName: high-priority  # 优先级类名称。
      
      # 容器的安全上下文，指定容器的用户 ID 和文件系统组 ID。
      securityContext:
        runAsUser: 1000                  # 以特定用户身份运行容器。
        fsGroup: 2000                    # 容器中所有文件的组 ID。
      
      # 是否使用宿主机网络，`false` 表示使用集群网络。
      hostNetwork: false
        
      # DNS 策略，指定如何解析 DNS 名称，`ClusterFirst` 表示优先使用集群内的 DNS 解析服务。
      dnsPolicy: ClusterFirst
```

1. **`labels` 标签 和 `selector` 选择器的关联**：

- **选择器根据资源上的标签选择资源**。
- 选择器有多种类型，包括 `matchLabels` 和 `matchExpressions`。
- `matchLabels` 是最常用的选择器类型，使用简单的标签匹配。
- `matchExpressions` 提供了更复杂的匹配规则，比如支持多种操作符（`In`, `NotIn`, `Exists`, `DoesNotExist`）

```yaml
# 定义标签
metadata:
  labels:
    app: myapp
    
---
# 选择器
spec:
  selector:
    matchLabels:
      app: myapp 
```



2. **`volumes` 卷 和 `volumeMounts` 卷挂载 的关联** ：在 Kubernetes 中，`volumes` 定义了可以使用的存储卷，而 `volumeMounts` 指定这些卷挂载到容器的路径。

- **`volumes`**：定义了一个或多个卷，可以是宿主机目录（使用 `hostPath`），临时目录（使用 `emptyDir`），持久化存储卷，ConfigMap 等。
- **`volumeMounts`**：定义了如何将 `volumes` 中的卷挂载到 **容器** 的文件系统中。容器在 Pod 内运行，因此 `volumeMounts` 定义的是如何在这个隔离的容器环境中使用 `volumes`。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: example-pod
spec:
  containers:
  - name: my-container
    image: nginx
    volumeMounts:
    - name: host-volume
      mountPath: /container/path  # 容器内的挂载路径
  volumes:
  - name: host-volume
    hostPath:
      path: /host/path  # 宿主机上的路径
      type: Directory
```



3. **`affinity` 亲和** ：是一种调度策略，用于控制 Pod 如何选择节点进行调度。

- `nodeAffinity` 用于指定 Pod 应该调度到哪些节点上。它可以替代传统的 `nodeSelector`，提供更复杂的调度规则。

```yaml
affinity:
  nodeAffinity:
    # requiredDuringSchedulingIgnoredDuringExecution: 这是一个强制性的要求。Pod 只能调度到满足指定条件的节点上。
    requiredDuringSchedulingIgnoredDuringExecution:
      nodeSelectorTerms:
      - matchExpressions:
        - key: key-name
          operator: In
          values:
          - value1
          - value2
---
affinity:
  nodeAffinity:
  	# preferredDuringSchedulingIgnoredDuringExecution: 这是一个优选要求。它表示 Pod 应该尽量调度到满足条件的节点上，但不是强制性的。如果没有满足条件的节点，Pod 仍然可以调度到其他节点。
    preferredDuringSchedulingIgnoredDuringExecution:
    - preference:
        matchExpressions:
        - key: key-name
          operator: In
          values:
          - value1
      weight: 1
```

- `podAffinity` 和 `podAntiAffinity`：这两种类型的 `affinity` 用于控制 Pod 如何与其他 Pod 关系进行调度。

```yaml
affinity:
  # podAffinity 用于将 Pod 调度到与特定 Pod 位于同一节点或同一区域的节点上。 
  podAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      labelSelector:
        matchExpressions:
        - key: app
          operator: In
          values:
          - my-app
      topologyKey: kubernetes.io/hostname
---
affinity:
  # podAntiAffinity 用于将 Pod 调度到不与特定 Pod 位于同一节点或同一区域的节点上。
  podAntiAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      labelSelector:
        matchExpressions:
        - key: app
          operator: In
          values:
          - my-app
      topologyKey: kubernetes.io/hostname
```



4. **`Taints` 污点 和 ` Tolerations`  容忍的关联** ：

- **`Taints`**：节点上的 `taints` 是一种标记，用于指定节点上的某些条件或限制，阻止 Pod 调度到这些节点上，除非 Pod 具有相应的 `tolerations`。
- **`Tolerations`**：Pod 上的 `tolerations` 是一种允许 Pod 在具有特定 `taints` 的节点上调度的机制。它们“容忍”节点上的 `taints`，使 Pod 可以被调度到这些节点上。

```shell
# 配置 node-1 节点，添加污点
kubectl taint nodes center-node01 dedicated=infra:NoSchedule
# 移除污点（特定污点除外）
kubectl taint nodes center-node01 dedicated-

# 查看某个节点是否又污点
kubectl describe node center-node01
Name:               node-1
Roles:              <none>
Labels:             beta.kubernetes.io/arch=amd64
                    beta.kubernetes.io/os=linux
                    failure-domain.beta.kubernetes.io/region=us-west-1
                    failure-domain.beta.kubernetes.io/zone=us-west-1a
                    kubernetes.io/hostname=node-1
                    node-role.kubernetes.io/worker=
Annotations:        node.alpha.kubernetes.io/ttl=0
                    scheduler.alpha.kubernetes.io/affinity: { "nodeAffinity": { "requiredDuringSchedulingIgnoredDuringExecution": { "nodeSelectorTerms": [ { "matchExpressions": [ { "key": "node.kubernetes.io/instance-type", "operator": "In", "values": [ "t2.micro" ] } ] } ] } } }
CreationTimestamp:  Fri, 13 Aug 2024 14:30:05 +0800
Taints:             dedicated=infra:NoSchedule
                    type=spot:NoExecute
...
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: example-pod
spec:
  # 配置 容忍
  tolerations:
  - key: dedicated
    operator: Equal
    value: infra
    effect: NoSchedule
  containers:
  - name: nginx
    image: nginx:latest
```

## 5. 具体介绍 kind类型 使用

### 5.1 deployment 资源类型

见 [spec 资源规范（specification）](#spec 资源规范（specification）)

### 5.2 service 资源类型

#### 5.2.1 service 注意点

**`Service`**：提供了一种稳定的访问方式来路由流量到一组 Pod。`Service` 定义了如何访问这些 Pod，并可以提供负载均衡功能。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: example-service
  namespace: default
  labels:
    app: my-app
spec:
  selector:
    app: my-app                   # 选择标签为 app=my-app 的 Pod
  ports:
  - protocol: TCP
    port: 80                      # Service 对外暴露的端口
    targetPort: 8080              # 访问 Pod 时转发到 Pod 上的端口
    name: http                    # 端口名称（可选）
  type: ClusterIP                 # 服务类型
  sessionAffinity: None           # 会话亲和性（默认为 None）
#  loadBalancerIP: 192.168.1.100  # 负载均衡器 IP（可选，仅在 type 为 LoadBalancer 时有效）
```

**`Service` 的 DNS 名称：**

- **当你创建一个 `Service` 对象时，Kubernetes 会为其分配一个 DNS 名称，通常格式为 `<service-name>.<namespace>.svc.cluster.local`。**
- 例如，如果你有一个名为 `my-service` 的 `Service`，且它位于 `default` 命名空间，你可以通过 `my-service.default.svc.cluster.local` 来访问它。可以通过 `curl` 从一个Pod访问 `my-service`：

```shell
# 验证访问是否成功
curl http://my-service.default.svc.cluster.local
```

- 在 Kubernetes 集群中，虽然使用 **完全限定域名（FQDN，Fully Qualified Domain Name）**是一种标准做法，但在一些情况下，你也可以只使用 `Service` 名称或 `<service-name>.<namespace>`。
- **如果是处于同一命名空间可以去掉 `.svc.cluster.local`，直接通过  `service-name` 名称 或 `<service-name>.<namespace>` 实现**。

> Tips：通过这种方式，每个微服务通过配置对应的域名就可以去访问了。

![image-20240813163054379](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240813163054379.png)

![image-20240813163904282](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240813163904282.png)

#### 5.2.2 service 的类型

> **Tips：所有类型的 Kubernetes Service（无论是 ClusterIP、NodePort、LoadBalancer 还是 Headless）都可以通过 `servicename.namespace.svc.cluster.local` 的形式进行内部 DNS 解析访问**。

##### 5.2.2.1 ClusterIP

`ClusterIP Service` 这是**默认的 `Service` 类型，用于在集群内部提供服务**。

使用场景

- 内部微服务间的通信。
- **不需要暴露给集群外部的服务，但是，但是也能通过`endpoint` ，代理到外部的服务中（将endpoint地址 IP改为：外部服务IP）**。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-clusterip-service  # Service 的名称
spec:
  selector:
    app: my-app  # 匹配 Pod 的标签，流量会路由到这些 Pod 上
  ports:
  - protocol: TCP
    port: 80  # Service 暴露的端口
    targetPort: 8080  # Pod 上的端口
```

##### 5.2.2.2 NodePort

`NodePort` 会在每个 Node 上打开一个指定的端口，**外部流量可以通过 `<NodeIP>:<NodePort>` 的形式访问服务**。

使用场景

- 测试环境，外部用户需要访问集群中的应用。
- 需要集群外部访问服务但不需要负载均衡器的场景。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-nodeport-service
spec:
  type: NodePort  # Service 的类型为 NodePort
  selector:
    app: my-app
  ports:
  - protocol: TCP
    port: 80  # Service 暴露的端口
    targetPort: 8080  # Pod 上的端口
    nodePort: 30007  # 在每个 Node 上暴露的端口号（30000-32767 之间的一个固定端口）
```

##### 5.2.2.3 LoadBalancer

`LoadBalancer` 是 **Kubernetes 中一种用于将集群内部的服务暴露到外部网络的 Service 类型**。创建一个负载均衡器（例如 AWS ELB、GCP GLB），并**自动分配一个公网 IP 地址或 DNS 名称，从而使外部流量通过 该公网IP或DNS名称 能够直接访问集群内的服务。**

使用场景

- 公有云环境下，需要暴露一个对外服务。
- 高可用、高流量的应用程序。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-loadbalancer-service
spec:
  type: LoadBalancer  # Service 的类型为 LoadBalancer
  selector:
    app: my-app
  ports:
  - protocol: TCP
    port: 80  # Service 暴露的端口
    targetPort: 8080  # Pod 上的端口
```

执行上面命令后，该类型 service 会获取到一个 外部IP。

```shell
# 使用以下命令来检查 Service 的状态并获取分配的公网 IP 地址
kubectl get svc my-loadbalancer-service -n default
# EXTERNAL-IP 列中的 IP 地址就是分配给该服务的公网 IP 地址。外部客户端可以通过这个 IP 地址访问 MySQL 服务。
NAME                 TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)        AGE
mysql-loadbalancer   LoadBalancer   10.0.171.239   34.123.45.67    3306:32295/TCP 5m
```

##### 5.2.2.4 ExternalName

`ExternalName` 不是实际的代理，它只是**将 DNS 查询重定向到外部域名**。这个 Service 不会创建 `ClusterIP`，也不会创建负载均衡器。

使用场景

- 当需要访问集群外的服务时。
- 轻量级的外部服务访问，不需要负载均衡功能。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-externalname-service
spec:
  type: ExternalName  # Service 的类型为 ExternalName
  externalName: example.com  # 将服务指向的外部域名
```

##### 5.2.2.5 Headless

`Headless` 用于有状态服务，或者当不需要负载均衡时。不分配 `ClusterIP`，客户端可以直接通过 DNS 解析到 Pod 的 IP 地址。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: redis-headless
  labels:
    app: redis
spec:
  clusterIP: None  # 指定为 None，表示 Headless Service
  selector:
    app: redis
  ports:
    - port: 6379
      name: redis
```



#### 5.2.3 service 和 endpoint 关联

1. **Service Selector**：当你创建一个 `Service` 时，你通常会指定一个 `selector`，它用于匹配特定标签的 Pod。**Kubernetes 控制器会根据这个 `selector` 找到匹配的 Pod，并自动创建一个与 `Service` 同名的 `Endpoint` 对象。**这个 `Endpoint` 会包含所有匹配的 Pod 的 IP 和端口信息。

2. **自动更新**：**当与 `Service` 关联的 Pod 发生变化时（例如 Pod 被删除或新增），`Endpoint` 对象会自动更新**，以确保它始终指向当前运行的 Pod。

3. **无 Selector 的 Service**：**如果 `Service` 没有定义 `selector`，Kubernetes 不会自动创建 `Endpoint`**。这种情况下，你可以**手动创建 `Endpoint` 对象，指定它应该指向哪些 Pod 或外部 IP**。



### 5.3 configmap 资源类型

configmap 就是定义添加一些配置内容：

```yaml
apiVersion: v1  # API 版本，ConfigMap 对象的 API 版本是 v1。
kind: ConfigMap  # 资源类型，这里是 ConfigMap。
metadata:
  name: example-configmap  # ConfigMap 的名称，用于唯一标识这个 ConfigMap。
  namespace: default  # ConfigMap 所在的命名空间。默认为 default。
  labels:
    app: my-app  # 标签，用于为 ConfigMap 打上标记，便于选择和管理。
data:
  # 配置文件的内容部分
  config.properties: |
    key1=value1  # 文件内容，以多行字符串形式存储。
    key2=value2
  application.yml: |
    server:
      port: 8080  # YAML 配置文件的内容，适用于复杂配置。
    logging:
      level: INFO
  mykey: myvalue  # 简单的键值对配置，直接存储值。
```

deployment类型 配置 configmap关联场景：

-  将 `ConfigMap` 挂载为卷
- 将 `ConfigMap` 数据作为环境变量
- 将 `ConfigMap` 数据作为命令行参数

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: example-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: example-app
  template:
    metadata:
      labels:
        app: example-app
    spec:
      containers:
      - name: example-container
        image: busybox
        command: ["/bin/sh"]
        args: ["-c", "echo $(MY_KEY)"] # 将 `ConfigMap` 数据作为命令行参数
        env:
        - name: MY_KEY
          valueFrom:
            configMapKeyRef:
              name: example-configmap # 将 `ConfigMap` 数据作为环境变量
              key: mykey
```

### 5.4 endpoint 资源类型

`Endpoint` 是一种资源类型，用于将一个或多个 Pod 的 IP 地址和端口信息与一个 Service 资源关联起来。**Service 是通过 `Endpoint` 来找到实际的 Pod，并将流量路由到这些 Pod 上的**。

**也就是 `Endpoints` 与 `Service` 是相互绑定配合使用的**：

- **`Service`**:  `Service` 是一个抽象层，它提供了一个稳定的 IP 地址和端口，通过负载均衡将流量分发到匹配的 Pod 上。`Service` 会自动创建和更新 `Endpoints` 对象，以确保流量路由到正确的 Pod。
- **`Endpoints`**:  `Endpoints` 对象存储 `Service` 的实际后端 Pod 的 IP 地址和端口。它被自动管理和更新，以匹配 `Service` 选择的 Pod。

一句话来说就是：**`Service` 对象通过 `Endpoints` 对象来映射到实际的 Pod。`Endpoints` 存储 `Service` 的实际后端 Pod 的 IP 地址和端口。**

```yaml
apiVersion: v1
kind: Endpoints
metadata:
  name: example-endpoints  # Endpoints 对象的名称，用于标识该对象
  namespace: default       # Endpoints 所在的命名空间，与 Service 对象的命名空间相匹配
subsets:
- addresses:
  - ip: 10.0.0.1           # Pod 的 IP 地址
    hostname: pod1         # Pod 的主机名（可选）
    targetRef:
      kind: Pod            # 目标对象的类型，这里是 Pod
      name: example-pod    # Pod 的名称
      namespace: default   # Pod 所在的命名空间
  ports:
  - port: 80               # Pod 上的端口，Service 将流量路由到这个端口
    protocol: TCP          # 使用的协议，这里是 TCP
    name: http             # 端口的名称（可选），用于标识端口
```

> Tips：一般实际项目中，不推荐修改endpoints的ip，但是也不代表不能这么干，例如：**我的 `nacos`服务 独立于k8s集群之外，我们配置了nacos的service之后，可以通过修改该service对应的endpoints的ip来指向到独立的nacos服务，同理其他独立的服务也可以这么整。**

### 5.5 secrets 资源类型

`Secrets` 在 Kubernetes 中主要用于存储和管理敏感数据。

> 注意：由于 secrets 类型经常用到 base64 ，可以通过以下命令生成 base64 编码的密码：
>
> ```bash
> echo -n 'username 或者 password' | base64
> ```

1. **`Opaque` ：默认类型，表示这是一个用户定义的通用秘密，数据存储在 `data` 字段中**。

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: my-opaque-secret    # Secret 的名称
  namespace: default        # Secret 所在的命名空间
type: Opaque                # Secret 类型，表示这是一个普通的用户定义的秘密
data:
  username: dXNlcg==        # base64 编码后的用户名
  password: cGFzc3dvcmQ=    # base64 编码后的密码
stringData:
  api-key: my-api-key       # 明文数据，Kubernetes 会自动将其转换为 base64 编码
```

2. **`docker-registry`：用于存储 Docker 仓库的认证信息，以便 Kubernetes 可以从私有 Docker 仓库拉取镜像**。

```yaml
# 1. 先配置一个 Docker 配置文件，并且转成base64
{
  "auths": {
    "https://my-private-registry.example.com": {
      "username": "my-username",
      "password": "my-password",
      "email": "my-email@example.com"
    }
  }
}

# 2. 将配置文件编码为 Base64
# cat config.json | base64 # 也可以通过网络上一些base64编码工具。

# 3. 创建 Kubernetes Secret
apiVersion: v1
kind: Secret
metadata:
  name: my-docker-secret    # Secret 的名称
  namespace: default        # Secret 所在的命名空间
type: kubernetes.io/dockerconfigjson  # Secret 类型，表示这是一个 Docker 注册表的认证信息
data:
  .dockerconfigjson: eyJhdXRocyI6eyJleGFtcGxlLmNvbSI6eyJ1c2VybmFtZSI6InVzZXIiLCJwYXNzd29yZCI6InBhc3N3b3JkIiwibmFtZSI6IkRpYWdub3N0aWMiLCJlbWFpbCI6ImVtYWlsQGRpYWdub3N0aWMuY29tIn19fQ==  # base64 编码的 Docker 配置文件内容
```

3. **`service-account-token` ：自动生成的 Secret，用于与服务账户（`ServiceAccount`）关联，包含用于访问 Kubernetes API 的令牌（Token）**。

字段:

- `token`: 用于身份验证的 JWT 令牌
- `ca.crt`: Kubernetes 集群的 CA 证书
- `namespace`: 服务账户所在的命名空间

使用场景：用于 Pod 通过服务账户进行身份验证和授权。

**示例：自动生成，通常不需要用户手动创建。**

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: my-service-account-token  # Secret 的名称
  namespace: default              # Secret 所在的命名空间
type: kubernetes.io/service-account-token  # Secret 类型，表示这是一个服务账户令牌
annotations:
  kubernetes.io/service-account.name: my-service-account  # 关联的 serviceaccount 服务账户名称
data:
  token: eyJhbGciOiJSUzI1NiIsImtpZCI6IkxLZEtLSjEiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SU-sZiIu7DPxVvi77o91QlLx_yO1FdHTexOblXBlaUSKtsMnXb-2BzM8GzZXfKx4Zw1lMptOiNwT2eF6XMtZ-Vp84d6HlyH0ylV0NPA  # base64 编码的 Token
  ca.crt: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk...  # base64 编码的 CA 证书
  namespace: ZGVmYXVsdA==        # base64 编码的命名空间（默认为 default）
```

**secret 可以和很多单独类型匹配使用**，例如：Pod、Deployment、StatefulSet、DaemonSet、Job 等等。

**一般 secret 和 serviceaccount 配合使用，就像上面的 **：

```yaml
annotations:
  kubernetes.io/service-account.name: my-service-account  # 关联的 serviceaccount 服务账户名称
```

4. `basic-auth`： 用于存储 HTTP 基本认证的信息，如用户名和密码。

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: my-basic-auth          # Secret 的名称
  namespace: default           # Secret 所在的命名空间
type: kubernetes.io/basic-auth # Secret 类型，表示这是基本 HTTP 认证信息
data:
  username: dXNlcg==          # base64 编码后的用户名
  password: cGFzc3dvcmQ=      # base64 编码后的密码
```

5. `ssh-auth` ：用于存储 SSH 认证信息，如 SSH 私钥。

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: my-ssh-secret         # Secret 的名称
  namespace: default          # Secret 所在的命名空间
type: kubernetes.io/ssh-auth  # Secret 类型，表示这是 SSH 认证信息
data:
  ssh-privatekey: c2hhLXByaXZhdGUta2V5 # base64 编码的 SSH 私钥
```

6. `tls` ：用于存储 TLS 证书和密钥。

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: my-tls-secret         # Secret 的名称
  namespace: default          # Secret 所在的命名空间
type: kubernetes.io/tls       # Secret 类型，表示这是 TLS 证书和密钥
data:
  tls.crt: MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7H9OiDwAeJmjM0G6E  # base64 编码的 TLS 证书
  tls.key: MIIEogIBAAKCAQEA7dZZttJ1G3D+D5Ri74Bs2Rg9Bq0X6NzS7RXOlgBoFgC2  # base64 编码的 TLS 密钥
```

7. `bootstrap.kubernetes.io/token`：用于存储 Kubernetes 节点在启动时的注册信息。

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: my-bootstrap-token   # Secret 的名称
  namespace: kube-system     # Secret 所在的命名空间
type: bootstrap.kubernetes.io/token  # Secret 类型，表示这是节点启动时的认证信息
data:
  token-id: dG9rZW4taWQ=     # base64 编码的 Token ID
  token-secret: c2VjcmV0LXNlY3JldA==  # base64 编码的 Token Secret
  ca.crt: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk...  # base64 编码的 CA 证书
```

### 5.6 serviceaccount 资源类型

`ServiceAccount` ：是 Kubernetes 中用于管理和控制 Pod **如何与 Kubernetes API 进行身份验证和授权的一种资源类型**。**每个 Pod 默认都会与一个 `ServiceAccount` 关联**，该账户的权限定义了 Pod 可以执行的操作。

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-service-account     # ServiceAccount 的名称
  namespace: default           # ServiceAccount 所在的命名空间
secrets:                       # 关联的 Secret，用于存储此 ServiceAccount 的身份验证令牌
  - name: my-token-secret      # Secret 的名称，Kubernetes 会自动生成，并与此 ServiceAccount 关联
imagePullSecrets:              # 用于拉取私有镜像仓库中的镜像的认证信息
  - name: my-docker-secret     # Secret 的名称，包含 Docker 注册表的认证信息
automountServiceAccountToken: true  # 是否自动挂载此 ServiceAccount 的令牌到 Pod 中，默认为 true
```

> 主要要看 service-account 和 secret、镜像仓库怎么使用的。

### 5.7 StatefulSet 、PersistentVolume（PV）、PersistentVolumeClaim (PVC)、StorageClass 资源类型

**`StatefulSet` ：是 Kubernetes 中的一种控制器资源类型，用于管理有状态的应用程序**。与 `Deployment` 不同，**`StatefulSet` 专为管理那些需要持久存储和稳定网络标识的应用而设计，如数据库、分布式系统等**。

> `StatefulSet` 可以确保每个 Pod 都有一个唯一且稳定的网络标识和存储卷。

一般像 Redis、MySQL、KafKa等，这种需要持久化数据和网络标识的构建，需要使用该资源类型。



> **要整明白：StorageClass 、 PersistentVolume (PV)、 PersistentVolumeClaim (PVC)，三者的关系**。

```yaml
--- 创建 pv
apiVersion: v1
kind: PersistentVolume
metadata:
  name: redis-data-pv
  namespace: default
spec:
  accessModes:
    - ReadWriteOnce
  capacity:
    storage: 1.5Gi
  hostPath:  # 适用于本地测试环境，在生产环境中可能使用其他类型的存储（如 AWS EBS, GCE PD 等）
    path: /opt/redis/data
  storageClassName: standard  # 确保与 PVC 中的 storageClassName 匹配
  persistentVolumeReclaimPolicy: Retain

--- 创建 pvc （这一步，在这里没必要，提一下 pvc 这个概念以及效果作用。）
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: redis-data
  namespace: default
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1.5Gi  # 修改为与 PV 匹配的容量
  storageClassName: standard

--- StorageClass 存储类
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: standard
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer

--- StatefulSet 配置 (自动创建一个pvc，必须要有对应的 pv和storageclass 才能匹配绑定成功。)
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis
  namespace: default
spec:
  serviceName: "redis"
  replicas: 2  # 定义两个副本，1 个主节点和 1 个从节点
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
        image: redis:7.0.2
        ports:
        - containerPort: 6379
        volumeMounts:
        - name: redis-data
          mountPath: /data
        command: ["redis-server", "--appendonly", "yes"]
  volumeClaimTemplates:
  - metadata:
      name: redis-data
    spec:
      accessModes:
      - ReadWriteOnce
      resources:
        requests:
          storage: 1.5Gi  # 存储请求大小
      storageClassName: standard

          
--- 创建service
apiVersion: v1
kind: Service
metadata:
  name: redis
  namespace: default
  labels:
    app: redis
spec:
  ports:
  - port: 6379  # Redis 默认端口
    targetPort: 6379
    protocol: TCP
  selector:
    app: redis  # 选择标签为 app: redis 的 Pod
  clusterIP: None  # 设置为 None，这样会创建 Headless Service
```

**三者含义**：

1. **PersistentVolume（PV）**：
   - 作用：PersistentVolume 是Kubernetes中的一个资源，**代表集群中一块存储（如：本地磁盘、网络存储等）**。它是由管理员预先创建或自动动态供应的存储资源。
   - 配置：包括存储容量、访问模式、存储类型（如 `hostPath`、`nfs`、`aws-ebs` 等）、存储类（`storageClassName`）等。
   - 生命周期: PV 的生命周期由管理员控制，通常在存储后端发生变化时，PV 也会进行更新。
2. **PersistentVolumeClaim (PVC)**：
   - 作用：PersistentVolumeClaim 是**用户请求存储资源的方式**。它定义了存储的需求（如容量、访问模式）并请求 Kubernetes 提供一个合适的 PersistentVolume。
   - 配置：PVC 定义了所需的存储容量、访问模式（如 `ReadWriteOnce`、`ReadOnlyMany`）以及 `storageClassName`（存储类名称）。
   - 生命周期：PVC 的生命周期与它所绑定的 Pod 相关联。PVC 会在 Pod 删除或变更时保持不变，直到用户明确删除 PVC 或 PV。

3. **StorageClass**
   - 作用：**StorageClass 用于定义存储的类型和配置**。例如，它可以定义不同的存储供应者、参数、策略等。它允许用户在 PVC 中指定所需的存储类型，而不需要了解底层存储的具体实现。
   - 配置：包括存储供应者（如 `kubernetes.io/aws-ebs`）、参数（如 IOPS、磁盘类型）、存储策略等。
   - 生命周期：StorageClass 的生命周期由管理员控制。它定义了如何动态供应 PV，当 PVC 请求匹配 StorageClass 时，Kubernetes 会根据 StorageClass 的定义动态创建 PV。



**StorageClass 扮演一个重要角色**：

1. **PV 和 StorageClass**:
   - PersistentVolume（PV）可以定义一个 `storageClassName`，这是指定 PV 所属的 StorageClass。这可以定义 PV 的存储类型、供应者以及其他参数（例如，磁盘类型、IOPS 等）。
2. **PVC 和 StorageClass**:
   - PersistentVolumeClaim（PVC）可以指定一个 `storageClassName`，这是 PVC 请求存储的 StorageClass。PVC 会根据这个 StorageClass 的定义来匹配符合要求的 PV。



**具体匹配过程，如下**:

- **当 PVC 创建时，Kubernetes 会查找所有符合 PVC 请求的 PV。它会匹配 PVC 的 `storageClassName` 和 PV 的 `storageClassName`，以及其他要求（如容量、访问模式）。如果找到合适的 PV，Kubernetes 会将 PVC 绑定到该 PV，这样就可以配合StatefulSets了。**

### 5.8 DaemonSet 资源类型

`DaemonSet` 是 Kubernetes 中的一种控制器，**用来确保在集群中的每个（或某些特定）节点上运行一个 Pod 副本**。

它通常用于需要在所有节点上运行的系统级任务或守护进程，例如日志收集器、监控代理、网络插件等。

**DaemonSet 功能**：

- **确保每个节点上运行一个 Pod 副本**：无论集群中有多少节点，`DaemonSet` 都会确保每个节点都运行一个副本。
- **自动部署和管理**：新增节点时，`DaemonSet` 会自动在新节点上部署 Pod，移除节点时会自动清理对应的 Pod。
- **系统级任务**：适用于需要在每个节点上运行的任务，如日志收集器（例如 Fluentd）、监控代理（例如 Prometheus Node Exporter）等。

```yaml
apiVersion: apps/v1  # API 版本
kind: DaemonSet  # 资源类型为 DaemonSet
metadata:
  name: fluentd-ds  # DaemonSet 的名称
  labels:
    app: fluentd  # 标签，用于标识和选择对象
spec:
  selector:
    matchLabels:
      app: fluentd  # 用于选择控制哪些 Pods 属于这个 DaemonSet
  template:  # 定义 Pod 模板
    metadata:
      labels:
        app: fluentd  # Pod 的标签，必须与 selector 匹配
    spec:
      containers:
      - name: fluentd  # 容器名称
        image: fluent/fluentd:v1.12.0  # 使用的镜像
        resources:
          limits:
            memory: 200Mi  # 限制内存使用
            cpu: 100m  # 限制 CPU 使用
        ports:
        - containerPort: 24224  # 容器的端口
          name: forward  # 端口名称
        volumeMounts:
        - name: varlog  # 挂载的卷名称
          mountPath: /var/log  # 在容器内的挂载路径
        - name: varlibdockercontainers
          mountPath: /var/lib/docker/containers
          readOnly: true  # 只读挂载
      volumes:
      - name: varlog  # 卷名称
        hostPath:
          path: /var/log  # 主机上的路径，作为卷
      - name: varlibdockercontainers
        hostPath:
          path: /var/lib/docker/containers  # 主机上的路径，作为卷
          type: Directory  # 卷的类型
  updateStrategy:
    type: RollingUpdate  # 更新策略，滚动更新
    rollingUpdate:
      maxUnavailable: 1  # 滚动更新时最大不可用 Pod 数量
  tolerations:
  - key: node-role.kubernetes.io/master  # 忽略 master 节点的污点，允许在 master 节点上运行
    effect: NoSchedule  # 影响是 Pod 仍然可以被调度到有这个污点的节点上
```

### 5.9 Job 和 CronJob 资源类型

`Job`：**用于管理一次性任务（即批处理任务），这些任务在完成时会自动终止**。

`Job`：可以用来执行各种一次性任务，如数据库迁移、定期清理任务、生成报告等。当任务完成后，**`Job` 将报告成功，并且所有与之关联的 Pod（为了完成Job，而创建的Pod） 将被自动清除（取决于 `Job` 的配置）**。

例如：（迁移 PostgreSQL 为例）

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: db-migration-job  # Job的名称
spec:
  backoffLimit: 4  # 设置重试次数，当迁移任务失败时最多重试4次
  template:
    spec:
      containers:
      - name: migration-container  # 容器的名称
        image: postgres:13  # 使用的镜像，这里以PostgreSQL数据库为例
        env:
        - name: SOURCE_DB_URL  # 源数据库的连接字符串
          value: "postgresql://user:password@source-db:5432/source_db"
        - name: DEST_DB_URL  # 目标数据库的连接字符串
          value: "postgresql://user:password@dest-db:5432/dest_db"
        command: ["sh", "-c", "pg_dump $SOURCE_DB_URL | psql $DEST_DB_URL"]  # 在容器中执行的命令
        # 这个命令通过 pg_dump 从源数据库导出数据，然后通过 psql 将数据导入到目标数据库
      restartPolicy: Never  # 设置Pod不会自动重启，Job会处理重试逻辑
  ttlSecondsAfterFinished: 3600  # Job完成1小时后自动删除
```



`CronJob`：**用于在特定的时间间隔内定期执行任务**，工作机制类似于 Linux 系统中的 `cron` 调度器。与 `Job` 不同的是，`CronJob` 会按照指定的时间表反复创建和执行 `Job`。

例如：（以 PostgreSQL 备份为例）

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: db-backup-cronjob  # CronJob 的名称
spec:
  schedule: "0 2 * * *"  # CRON 表达式，用于定义任务执行的时间表。这里表示每天凌晨 2:00 运行任务
  jobTemplate:  # Job 的模板定义
    spec:
      backoffLimit: 3  # 重试次数。如果任务失败，最多重试 3 次
      template:
        spec:
          containers:
          - name: db-backup-container  # 容器名称
            image: postgres:13  # 使用的镜像，这里假设是 PostgreSQL 数据库
            env:
            - name: PGPASSWORD  # 环境变量，用于数据库连接的密码
              valueFrom:
                secretKeyRef:
                  name: db-secret  # 引用 Kubernetes Secret 中的密码
                  key: password
            command:  # 容器启动时执行的命令
            - "/bin/sh"
            - "-c"
            - "pg_dump -U postgres -h db-host mydb > /backup/db-backup-$(date +\\%Y\\%m\\%d).sql"  # 备份命令，将数据库备份到指定路径
            volumeMounts:  # 挂载卷
            - name: backup-volume
              mountPath: /backup  # 将备份文件保存到这个路径
          restartPolicy: OnFailure  # Pod 失败时重启策略
          volumes:
          - name: backup-volume
            persistentVolumeClaim:
              claimName: backup-pvc  # 使用 PVC 持久化存储卷
  successfulJobsHistoryLimit: 3  # 保留的成功 Job 的历史记录数
  failedJobsHistoryLimit: 1  # 保留的失败 Job 的历史记录数
```

### 5.10 Ingress 资源 和 Ingress Controller 控制器

#### 5.10.1 Ingress 资源

`Ingress`： **用于配置外部访问集群内服务的路由，也可以用在k8s内部服务做路由转发。**

通过 `Ingress`，**可以定义一组规则来控制哪些外部请求可以访问集群内部的哪些 `service服务`**，以及如何进行负载均衡、TLS（HTTPS）终止等操作。`Ingress` 允许通过一个外部 IP 地址访问多个 `service服务` ，可以通过一些配置规则等，路由到不同的 `service服务`。

例如，根据**不同的 host（域名/主机名） 以及 前缀，来路由到不同的 service 的 ingress 配置案例**：

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  # Ingress 资源的名称
  name: example-ingress
  # Ingress 资源所在的命名空间
  namespace: default
  annotations:
    # 使用 NGINX Ingress Controller 的重写目标配置
    nginx.ingress.kubernetes.io/rewrite-target: /
    # 这个注解表示将请求的路径重写为根路径（/）
spec:
  # 指定使用的 Ingress 类名，Ingress Controller 将根据这个类名处理 Ingress 资源
  ingressClassName: nginx
  rules:
  - host: example.com
    # 规则中的主机名，表示这个规则适用于针对 example.com 的请求
    http:
      paths:
      - path: /path1
        # 匹配的路径前缀为 /path1
        pathType: Prefix
        # 路径匹配类型，Prefix 表示匹配路径的前缀
        backend:
          service:
            name: service1
            # 后端服务的名称，表示匹配到这个路径时将请求转发到名为 service1 的服务
            port:
              number: 80
              # 后端服务的端口号，表示请求将转发到服务的 80 端口
      - path: /path2
        # 匹配的路径前缀为 /path2
        pathType: Prefix
        # 路径匹配类型，Prefix 表示匹配路径的前缀
        backend:
          service:
            name: service2
            # 后端服务的名称，表示匹配到这个路径时将请求转发到名为 service2 的服务
            port:
              number: 80
              # 后端服务的端口号，表示请求将转发到服务的 80 端口
  tls:
  - hosts:
    - example.com
    # 启用 TLS 终结，表示这个规则支持 HTTPS 访问
    secretName: example-tls
    # 存储 TLS 证书和私钥的秘密名称，用于加密 HTTPS 连接
```

#### 5.10.2 Ingress Controller 控制器

`Ingress Controller（Ingress Controller 控制器）`：**负责处理和管理 Ingress 资源**。它主要作用是根据 Ingress 资源中定义的规则来配置负载均衡器、路由流量，并将外部请求转发到集群内部的服务。

常见的 `Ingress 控制器` 包括:

- NGINX Ingress Controller
- Traefik
- HAProxy
- Istio Gateway（通常用于服务网格）

**默认情况下 ，Ingress Controller 会监听集群中所有的 Ingress 资源。**

不过，Kubernetes 1.18 引入了 `IngressClass` 资源，**可以通过 IngressClass 来指定特定的 Ingress Controller 处理哪些 Ingress 资源**。你可以定义多个 `IngressClass`，并**在 Ingress 资源中指定 `ingressClassName` 来将其与特定的 Controller 关联**。



以下是一个 `Nginx Ingress控制器`案例：

- Ingress 控制器通常是通过一个 `Deployment` 资源来部署和管理的。
- 本来 `Deployment` 资源里面就是包含控制前，负责管理每个Pod的生命周期等。

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: ingress-nginx  # 创建一个新的命名空间来存放 Ingress 控制器的资源

---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: nginx-ingress-serviceaccount
  namespace: ingress-nginx  # ServiceAccount 用于 NGINX Ingress 控制器的权限管理

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-ingress-controller
  namespace: ingress-nginx
spec:
  replicas: 1  # 部署一个副本来运行 Ingress 控制器
  selector:
    matchLabels:
      app: nginx-ingress-lb
  template:
    metadata:
      labels:
        app: nginx-ingress-lb
    spec:
      serviceAccountName: nginx-ingress-serviceaccount
      containers:
      - name: nginx-ingress-controller
        image: quay.io/kubernetes-ingress-controller/nginx-ingress-controller:0.47.0
        args:
        - /nginx-ingress-controller
        - --configmap=$(POD_NAMESPACE)/nginx-configuration
        env:
        - name: POD_NAME
          valueFrom:
            fieldRef:
              fieldPath: metadata.name
        - name: POD_NAMESPACE
          valueFrom:
            fieldRef:
              fieldPath: metadata.namespace
        ports:
        - name: http
          containerPort: 80  # 监听 80 端口处理 HTTP 流量
        - name: https
          containerPort: 443 # 监听 443 端口处理 HTTPS 流量
        livenessProbe:
          httpGet:
            path: /healthz
            port: 10254
          initialDelaySeconds: 10
          timeoutSeconds: 1
        readinessProbe:
          httpGet:
            path: /healthz
            port: 10254
          initialDelaySeconds: 10
          timeoutSeconds: 1

---
apiVersion: v1
kind: Service
metadata:
  name: nginx-ingress
  namespace: ingress-nginx
  labels:
    app.kubernetes.io/name: ingress-nginx
spec:
  type: LoadBalancer  # 使用外部 LoadBalancer 类型的服务（根据集群提供商可能需要调整）
  ports:
  - name: http  # 添加 name 字段，用于 HTTP 端口
    port: 80
    targetPort: 80
  - name: https  # 添加 name 字段，用于 HTTPS 端口
    port: 443
    targetPort: 443
  selector:
    app.kubernetes.io/name: ingress-nginx

---
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-configuration
  namespace: ingress-nginx
data:
  # 在这里可以配置 NGINX 的特定设置，如客户端最大请求体大小、超时设置等。
  client-body-buffer-size: "128k"
  proxy-connect-timeout: "30s"
  proxy-read-timeout: "30s"
```



#### 5.10.3 Ingress 和 Ingress Controller 二者关系

这里强调一下， **Ingress 是策略和规则的定义者（可以理解为 配置），而 Ingress Controller（Ingress Controller 控制器） 是将这些规则应用于实际流量的执行者（可以理解为 实际操作者）**。



#### 5.10.4 IngressClass 的使用

**IngressClass**：可以使用 `IngressClass` 资源来指定不同的 Ingress Controller，从而支持多种 Ingress Controller 并灵活管理流量路由。

```yaml
--- IngressClass 创建
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: nginx
spec:
  controller: k8s.io/ingress-nginx

--- 创建Ingress，并且指定使用 IngressClass的名称
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: example-ingress
  namespace: default
spec:
  # 指定使用的 IngressClass 名称
  ingressClassName: nginx
  rules:
  - host: example.com
    http:
      paths:
      - path: /path1
        pathType: Prefix
        backend:
          service:
            name: service1
            port:
              number: 80
      - path: /path2
        pathType: Prefix
        backend:
          service:
            name: service2
            port:
              number: 80
  tls:
  - hosts:
    - example.com
    secretName: example-tls

--- 创建Ingress Controller，可以通过启动参数 --ingress-class 参数来指定 IngressClassName 。
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-ingress-controller
  namespace: kube-system
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx-ingress-controller
  template:
    metadata:
      labels:
        app: nginx-ingress-controller
    spec:
      containers:
      - name: nginx-ingress-controller
        image: nginx/nginx-ingress:latest
        args:
        - /nginx-ingress-controller
        - --ingress-class=nginx # --ingress-class 参数来指定 IngressClassName
        - --default-backend-service=$(POD_NAMESPACE)/default-http-backend
```



### 5.11 serviceaccount 以及 Role、RoleBinding、ClusterRole、ClusterRoleBinding资源类型

`ServiceAccount` 是**为 Pod 分配的身份标识，用于管理 Pods 在集群中的权限**。

例如：

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-service-account
  namespace: default
```

场景案例：

1. 不同权限的 Pod 访问控制。

2. 跨命名空间访问。

3. 访问云服务。

**`ServiceAccount` 权限控制的两种情况**：

1. **同一个空间下，`ServiceAccount`、 `Role` 和 `RoleBinding`  三者关联或者绑定 实现权限控制。**

   例如，给 某个Pod 添加 针对资源类型为 Pod的资源赋予 `get`、`list`权限：

   ```yaml
   --- 创建ServiceAccount 
   apiVersion: v1
   kind: ServiceAccount
   metadata:
     name: my-service-account
     namespace: default
     
   --- 创建Role
   apiVersion: rbac.authorization.k8s.io/v1
   kind: Role
   metadata:
     namespace: default
     name: pod-reader
   rules:
   - apiGroups: [""]
     resources: ["pods"]
     verbs: ["get", "list"]
     
   --- 创建 RoleBinding （绑定 Role 和 ServiceAccount）
   apiVersion: rbac.authorization.k8s.io/v1
   kind: RoleBinding
   metadata:
     name: read-pods
     namespace: default
   subjects:
   - kind: ServiceAccount
     name: my-service-account
     namespace: default
   roleRef:
     kind: Role
     name: pod-reader
     apiGroup: rbac.authorization.k8s.io
     
   --- 创建Pod 赋予ServiceAccount
   apiVersion: v1
   kind: Pod
   metadata:
     name: my-pod
     namespace: default
   spec:
     serviceAccountName: my-service-account
     containers:
     - name: my-container
       image: nginx
   ```

   

2. **跨命名空间下，通过 `ServiceAccount` 、`ClusterRole` 和 `ClusterRoleBinding` 三者关联或者绑定实现跨空间的权限分配**。

```yaml
--- 创建ServiceAccount 
apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-service-account
  namespace: default

--- ClusterRole 创建
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: pod-manager                  # ClusterRole的名称，集群范围内唯一
rules:
- apiGroups: [""]                    # 指定API组。空字符串表示核心API组，包含Pod、Service等资源
  resources: ["pods"]                # 定义该ClusterRole可以操作的资源，这里是Pod
  verbs: ["get", "list", "delete"]   # 定义允许的操作：get, list, delete

--- ClusterRoleBinding 创建
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: bind-pod-manager                # ClusterRoleBinding的名称，集群范围内唯一
subjects:
- kind: ServiceAccount                  # 绑定的对象类型，这里是ServiceAccount
  name: my-service-account              # 被赋予权限的ServiceAccount的名称
  namespace: default                    # ServiceAccount所属的命名空间
roleRef:
  kind: ClusterRole                     # 绑定的角色类型，这里是ClusterRole
  name: pod-manager                     # 绑定的ClusterRole的名称
  apiGroup: rbac.authorization.k8s.io   # 指定ClusterRole所在的API组
```

> `my-service-account` 将拥有在所有命名空间中对 `pods` 资源执行 `get`、`list` 和 `delete` 操作的权限。**`ClusterRole` 定义了跨命名空间的权限，而 `ClusterRoleBinding` 将这些权限赋予指定的 `ServiceAccount`。**



### 5.12 HorizontalPodAutoscaler（HPA）资源类型

**HorizontalPodAutoscaler (HPA)** 是 Kubernetes 中的一个资源类型，它用于自动调整应用程序的 Pod 副本数量，以应对负载变化。

**HPA 根据 CPU 使用率、内存使用率或其他自定义指标来动态调整 Pod 的数量，从而确保应用在负载高峰期有足够的资源，而在负载低谷期节省资源。**

主要作用：

- **自动扩缩容**，HPA 通过监控指标，动态调整 Pod 副本数量。
- **基于指标的扩展**，默认情况下，HPA 使用 CPU 使用率，但可以配置为根据其他指标（如内存使用率或自定义指标）进行扩展。
- **最小和最大副本数**，可以配置 HPA 的最小和最大 Pod 副本数，以防止应用程序扩展得太大或缩小得太小。

例如，我们有一个Web服务的Deployment，通常情况下只需要运行 2 个副本，但是高峰期就需要更多的副本来处理这些流量，就可以使用 HPA 来根据 CPU 实现调整：

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-app-hpa  # HPA的名称
  namespace: default  # HPA所在的命名空间
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app-deployment  # 需要扩缩容的 Deployment 名称
  minReplicas: 2  # 最少保持2个副本
  maxReplicas: 10  # 最多扩展到10个副本
  metrics:
  - type: Resource  # 使用资源指标进行扩缩容
    resource:
      name: cpu  # 基于CPU使用率
      target:
        type: Utilization  # 指标类型，表示使用率
        averageUtilization: 50  # 如果平均CPU使用率超过50%，则开始扩展
```



### 5.13 NetworkPolicy 资源类型

**NetworkPolicy** 是 Kubernetes 中的一种资源类型，**用于控制 Pod 之间或 Pod 与其他网络实体之间的网络流量**。

说个常见的场景，**多租户场景：在多租户 Kubernetes 集群中，您可以使用 NetworkPolicy 来确保一个租户的 Pod 不会与另一个租户的 Pod 通信，从而实现网络隔离**。例如：

```yaml
--- 租户A
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: tenant-a-isolation
  namespace: tenant-a  # 应用在 tenant-a 命名空间
spec:
  podSelector: {}  # 适用于所有 Pod
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector: {}  # 允许来自 tenant-a 命名空间内的所有 Pod 的流量
  egress:
  - to:
    - podSelector: {}  # 允许流向 tenant-a 命名空间内的所有 Pod 的流量

--- 租户B
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: tenant-b-isolation
  namespace: tenant-b  # 应用在 tenant-b 命名空间
spec:
  podSelector: {}  # 适用于所有 Pod
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector: {}  # 允许来自 tenant-b 命名空间内的所有 Pod 的流量
  egress:
  - to:
    - podSelector: {}  # 允许流向 tenant-b 命名空间内的所有 Pod 的流量
```

可能有的人有疑问，明明 命名空间 已经实现隔离了，为什么还要用 NetworkPolicy 呢？

答：**命名空间（namespace）本身确实已经在逻辑上隔离了不同租户的资源（如 Pod、Service 等），但这种隔离是逻辑上的，并不能防止网络层面的交互。**在默认情况下，不同命名空间中的 Pod 仍然可以通过直接 IP 或者 Service 名称相互通信。

**NetworkPolicy 提供了一种更细粒度的控制，确保即使是在同一集群中，不同命名空间（即不同租户）的 Pod 也不能通过网络层面互相访问，进一步加强了安全隔离。**

简而言之，就是实现了 **`NetworkPolicy` 网络层的完全隔离**。



### 5.14 ResourceQuota 资源类型

`ResourceQuota` 是 Kubernetes 中的一种资源类型，**用于在命名空间级别限制和管理资源使用**。

以下是一个典型的 `ResourceQuota` YAML 配置文件，限制了某个命名空间中 CPU、内存、Pod 和存储的使用量。

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: example-quota
  namespace: example-namespace  # 应用此配额的命名空间
spec:
  hard:
    pods: "10"  # 限制此命名空间最多只能创建 10 个 Pod
    requests.cpu: "2"  # 此命名空间中所有 Pod 的 CPU 请求总和最多为 2 核
    requests.memory: "4Gi"  # 此命名空间中所有 Pod 的内存请求总和最多为 4Gi
    limits.cpu: "4"  # 此命名空间中所有 Pod 的 CPU 限制总和最多为 4 核
    limits.memory: "8Gi"  # 此命名空间中所有 Pod 的内存限制总和最多为 8Gi
    persistentvolumeclaims: "5"  # 此命名空间中最多可以创建 5 个 PVC
    requests.storage: "20Gi"  # 此命名空间中所有 PVC 的存储请求总和最多为 20Gi
```

### 5.15 PodDisruptionBudget (PDB) 资源类型

`PodDisruptionBudget (PDB)` 是 Kubernetes 中的一种资源类型，用于控制 Pod 的中断，确保在进行计划中的维护或升级（如节点重启、滚动更新）时，集群中**始终有一定数量的 Pod 处于可用状态**。

假设一个应用程序运行在 Kubernetes 集群中，有 3 个副本，并且希望在任何时候至少有 2 个副本处于可用状态，可以使用以下 PDB 配置：

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: myapp-pdb
  namespace: myapp-namespace  # 应用此 PDB 的命名空间
spec:
  minAvailable: 2  # 定义最少可用的 Pod 数量
  selector:
    matchLabels:
      app: myapp  # 选择带有 app=myapp 标签的 Pod
```

## 6. volumes 、volumeMounts 与 PV、PVC的区别

**相同点：这四个都涉及到存储**。

**不同点，如下**：

### 6.1 `volumes` 和 `volumeMounts`

- **`volumes`**:
  - `volumes` 是 Pod 的一种存储资源定义，它可以是不同类型的存储（例如 `emptyDir`、`hostPath`、`configMap`、`secret` 等）。
  - 它定义了在 Pod 中使用的存储类型和来源，例如挂载主机目录、临时目录或集群中的其他资源（如 ConfigMap、Secret 等）。
  - **`volumes` 的生命周期与 Pod 绑定：当 Pod 被删除时，`volumes` 也会随之消失（除非使用的是持久存储如 `PersistentVolume`）**。
- **`volumeMounts`**:
  - **`volumeMounts` 是指将 `volumes` 中定义的存储挂载到容器的文件系统中的某个路径**。
  - 它定义了容器中如何访问 `volumes` 中的存储。例如，将一个 `volumes` 挂载到 `/var/logs` 路径，以便容器能够在该路径下读取或写入数据。

### 6.2 `PersistentVolume (PV)` 和 `PersistentVolumeClaim (PVC)`

- **`PersistentVolume (PV)`**:

  - `PersistentVolume` 是集群管理员提供的一块持久化存储。它可以是不同类型的存储后端，例如 NFS、iSCSI、云存储（AWS EBS、GCE Persistent Disk 等）。
  - **`PV` 是独立于 Pod 的资源，生命周期可以比 Pod 更长，即使 Pod 被删除，`PV` 仍然可以保留并供其他 Pod 使用**。

- **`PersistentVolumeClaim (PVC)`**:

  - `PersistentVolumeClaim` 是**用户对存储的请求**。它请求一定大小的存储和访问模式（如 ReadWriteOnce）。
  
- `PVC` 是对 `PV` 的抽象，用户通过声明 `PVC` 来动态或静态地绑定到 `PV`。一旦绑定，Pod 就可以通过 `volume` 使用这个持久存储。
  
    
  

**关于经常碰到 `PV` 和 `PVC` 的操作**：

1. 如何知道当前 `PV` bound 哪个 `PVC`？

通过检查 **PV 的 `claimRef` 字段** 来确定该 PV 绑定到的 PVC。

```shell
kubectl describe pv <pv-name>
```

或者 直接获取 YAML 格式的完整配置：

```shell
kubectl get pv <pv-name> -o yaml
```

在输出中，关注 `claimRef` 字段，示例如下：

```yaml
spec:
  claimRef:
    namespace: my-namespace
    name: my-pvc
```

2. 如何删除 `PV` ？

1. 首先，必须解绑，将对应的 `PVC` 删除。

2. 修改 PV 的 `persistentVolumeReclaimPolicy`：

   ```bash
   kubectl edit pv <pv-name>
   ```

   将其改为：

   ```bash
   persistentVolumeReclaimPolicy: Delete
   ```

3. 删除 PV：

   ```bash
   kubectl delete pv <pv-name>
   ```





### 6.3 `volumes` 和 `volumeMounts` 与 `PVC/PV` 的关系和区别

- **关系**: `PVC` 可以在 `volumes` 中作为一种存储类型来使用。也就是说，`volumes` 可以引用一个 `PVC`，以将持久存储挂载到 Pod 中。然后，通过 `volumeMounts` 将这个存储挂载到容器的特定路径。
- **区别**:
  - 作用范围：
    - `volumes` 和 `volumeMounts` 是 Pod 内部的资源配置，通常与 Pod 的生命周期相关联。
    - `PV` 和 `PVC` 提供了持久化的存储解决方案，超出了 Pod 的生命周期，可以在不同 Pod 之间复用。
  - 使用场景：
    - **`volumes` 适合短暂或临时的数据存储需求，例如 `emptyDir`、`configMap` 或 `secret`。**
    - **`PV/PVC` 则适合需要持久存储的数据，如数据库的数据卷、日志文件等，即使 Pod 重新启动或删除，数据仍然保留。**



## 7. StatefulSet 

记录一个细节：StatefulSet 配合 PV 和 PVC 有两种方式：

1. **StatefulSet 使用 `volumeClaimTemplates` 来动态创建 `PVC`，之后自己去创建对应的PV去绑定**。

![image-20241216215214370](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241216215214370.png)


```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis
  namespace: apttm
spec:
  serviceName: "redis"
  replicas: 2  # 1主1从
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
          image: redis:7.0.2
          ports:
            - containerPort: 6379
          volumeMounts:
            - name: redis-data
              mountPath: /data
          env:
            # 从 ConfigMap 注入主节点信息
            - name: REDIS_MASTER_HOST
              valueFrom:
                configMapKeyRef:
                  name: redis-config
                  key: REDIS_MASTER_HOST
            - name: REDIS_MASTER_PORT
              valueFrom:
                configMapKeyRef:
                  name: redis-config
                  key: REDIS_MASTER_PORT
            - name: POD_INDEX
              valueFrom:
                fieldRef:
                  fieldPath: metadata.name
          command:
            - /bin/sh
            - -c
            - |
              # 根据 Pod 索引确定角色
              if [ "$(hostname | grep -o '[^-]*$')" -eq "0" ]; then
                echo "Starting Redis as Master"
                redis-server --appendonly yes
              else
                echo "Starting Redis as Replica"
                redis-server --appendonly yes --replicaof $REDIS_MASTER_HOST $REDIS_MASTER_PORT
              fi
  volumeClaimTemplates: # StatefulSet 使用 volumeClaimTemplates 来动态创建 PVC，之后自己去创建对应的PV去绑定。
    - metadata:
        name: redis-data
      spec:
        accessModes:
          - ReadWriteOnce
        resources:
          requests:
            storage: 0.5Gi
        storageClassName: redis-storage-class
```

2. **指定 `PVC` ，注意：`volumes` 要放在 spec下面，容易放错**。

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis
  namespace: apttm
spec:
  serviceName: "redis"
  replicas: 2  # 1主1从
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
          image: redis:7.0.2
          ports:
            - containerPort: 6379
          volumeMounts:
            - name: redis-data
              mountPath: /data
          env:
            - name: REDIS_MASTER_HOST
              valueFrom:
                configMapKeyRef:
                  name: redis-config
                  key: REDIS_MASTER_HOST
            - name: REDIS_MASTER_PORT
              valueFrom:
                configMapKeyRef:
                  name: redis-config
                  key: REDIS_MASTER_PORT
            - name: POD_INDEX
              valueFrom:
                fieldRef:
                  fieldPath: metadata.name
          command:
            - /bin/sh
            - -c
            - |
              # 根据 Pod 索引确定角色
              if [ "$(hostname | grep -o '[^-]*$')" -eq "0" ]; then
                echo "Starting Redis as Master"
                redis-server --appendonly yes
              else
                echo "Starting Redis as Replica"
                redis-server --appendonly yes --replicaof $REDIS_MASTER_HOST $REDIS_MASTER_PORT
              fi
      volumes: # volumes 要放在 spec下面
        - name: redis-data
          persistentVolumeClaim:
            claimName: redis-data-pvc  # 引用现有的 PVC
```

