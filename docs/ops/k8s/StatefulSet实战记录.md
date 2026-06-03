---
title: StatefulSet 实战记录与一键部署
outline: deep
---

## StatefulSet 实战记录与一键部署

::: info
StatefulSet 是 Kubernetes 中管理有状态应用的核心控制器。本文记录实战中常用的部署模板、踩坑经验与一键部署方式，方便后续直接复用。
:::

## 1. 概述

| 特性 | StatefulSet | Deployment |
| ---- | ----------- | ---------- |
| Pod 标识 | 稳定的、有序的（`name-0`, `name-1`...） | 随机哈希后缀（`name-xxxx-yyyy`） |
| 网络标识 | 每个 Pod 有固定 DNS 名称 | 共享 Service VIP，Pod IP 不固定 |
| 存储 | 每个 Pod 绑定独立 PV/PVC | 共享存储或无状态 |
| 启停顺序 | 有序（0→1→2 启动，2→1→0 停止） | 并行 |
| 适用场景 | 数据库、消息队列、分布式存储 | 无状态 Web 应用 |

## 2. 核心概念速查

### 2.1 稳定网络标识

StatefulSet **必须** 配合 Headless Service（`clusterIP: None`）使用：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app
spec:
  clusterIP: None        # 关键：Headless Service
  selector:
    app: my-app
  ports:
    - port: 6379
      targetPort: 6379
```

Pod DNS 解析规则：

| 格式 | 示例 |
| ---- | ---- |
| `<pod-name>.<service-name>.<namespace>.svc.cluster.local` | `redis-0.redis.default.svc.cluster.local` |
| `<pod-name>.<service-name>.<namespace>` | `redis-0.redis.default` |
| `<pod-name>.<service-name>`（同命名空间） | `redis-0.redis` |

### 2.2 稳定持久存储

两种方式：

1. **`volumeClaimTemplates`（推荐）**：StatefulSet 自动为每个 Pod 创建专属 PVC
2. **手动 PVC**：在 `volumes` 中引用已有 PVC

### 2.3 有序部署与扩缩容

- 创建：`pod-0` → `pod-1` → `pod-2`（前一个 Running 后才创建下一个）
- 删除/缩容：`pod-2` → `pod-1` → `pod-0`（逆序）
- 滚动更新：`pod-2` → `pod-1` → `pod-0`

### 2.4 滚动更新策略

```yaml
spec:
  updateStrategy:
    type: RollingUpdate
    rollingUpdate:
      partition: 0    # 0 = 全部更新；设为 2 = 只更新序号≥2 的 Pod（金丝雀发布）
```

### 2.5 StatefulSet 遇到错误后，如何排查

```yaml
# 先看对应的 Pod Event 事件
kubectl describe pod redis-0 -n procure

# 再看下 statefulset 状态
kubectl describe statefulset redis -n procure

# 也有可能是资源不匹配导致，这个时候就要看各个node节点的资源占用情况了。
kubectl describe node kcs-yd-qk-zhaocai-k8s-test-s-djsr2
```

## 3.  MySQL（本地部署）

```yaml
# 命名空间
apiVersion: v1
kind: Namespace
metadata:
  name: procure-mysql
---
# storageclass 本地静态（no-provisioner, 无供应云厂商）
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: mysql-storage
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
reclaimPolicy: Retain
# allowVolumeExpansion: true

# 注意：no-provisioner 不支持动态供应，allowVolumeExpansion 对此类 StorageClass 无效
# 如果需要扩容本地 PV，需手动操作：1)扩容宿主机存储 2)删除 PVC 3)重建更大的 PV 4)重建 PVC 绑定
---
# mysql 配置文件
apiVersion: v1
kind: ConfigMap
metadata:
  name: mysql-config
  namespace: procure-mysql
data:
  my.cnf: |
    [mysqld]
    # 基础配置
    default_authentication_plugin=mysql_native_password  # 兼容旧版客户端
    character-set-server=utf8mb4
    collation-server=utf8mb4_unicode_ci
    init_connect='SET NAMES utf8mb4'
    
    # 性能配置（根据服务器资源调整）
    max_connections=200
    innodb_buffer_pool_size=512M
    innodb_log_file_size=128M
    innodb_flush_log_at_trx_commit=1
    sync_binlog=1
    
    # 日志配置
    slow_query_log=1
    slow_query_log_file=/var/log/mysql/slow.log
    long_query_time=2
    log_error=/var/log/mysql/error.log
---
# mysql 密钥
apiVersion: v1
kind: Secret
metadata:
  name: mysql-secret
  namespace: procure-mysql
type: Opaque
stringData:
  username: "root"
  password: "123456"
---
# mysql service headless（集群内部访问）
apiVersion: v1
kind: Service
metadata:
  name: mysql-svc
  namespace: procure-mysql
  labels:
    app: mysql-svc
spec:
  clusterIP: None
  selector:
    app: mysql
  ports:
  - port: 3306
    targetPort: 3306
---
# mysql service nodeport（集群外部访问， 开发测试）
apiVersion: v1
kind: Service
metadata:
  name: mysql-nodeport
  namespace: procure-mysql
  labels:
    app: mysql-svc
spec:
  type: NodePort
  selector:
    app: mysql
  ports:
  - port: 3306
    targetPort: 3306
    nodePort: 30306
    protocol: TCP
---
# 构建 mysql data 持久
apiVersion: v1
kind: PersistentVolume
metadata:
  name: mysql-pv-data-1
spec:
  capacity:
    storage: 90Gi
  volumeMode: Filesystem
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: mysql-storage

  local:
    path: /var/lib/paascontainer/mysql/data

  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - kcs-yd-qk-zhaocai-k8s-test-s-2pdf6
---
# 构建 mysql log 持久
apiVersion: v1
kind: PersistentVolume
metadata:
  name: mysql-pv-log-1
spec:
  capacity:
    storage: 10Gi
  volumeMode: Filesystem
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: mysql-storage

  local:
    path: /var/lib/paascontainer/mysql/log

  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - kcs-yd-qk-zhaocai-k8s-test-s-2pdf6
---
# mysql StatefulSet 核心 app
apiVersion: apps/v1
kind: StatefulSet
metadata:
  labels:
    app: mysql
  name: mysql
  namespace: procure-mysql
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mysql
  serviceName: mysql-svc

  template:
    metadata:
      labels:
        app: mysql
    spec:
      nodeSelector:
        kubernetes.io/hostname: kcs-yd-qk-zhaocai-k8s-test-s-2pdf6
      
      containers:
      - image: mysql:8.0.36
        name: mysql
        ports:
        - containerPort: 3306
          name: mysql

        env:
        - name: MYSQL_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-secret
              key: password

        resources:
          requests:
            cpu: 2
            memory: 2Gi
          limits:
            cpu: 4
            memory: 4Gi

        volumeMounts:
        - name: mysql-config
          mountPath: /etc/mysql/conf.d
        - name: mysql-data
          mountPath: /var/lib/mysql
        - name: mysql-log
          mountPath: /var/log/mysql

      volumes:
      - name: mysql-config
        configMap:
          name: mysql-config

  volumeClaimTemplates:
  - metadata:
      name: mysql-data
    spec:
      storageClassName: mysql-storage
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 90Gi

  - metadata:
      name: mysql-log
    spec:
      storageClassName: mysql-storage
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi
```

::: warning 注意点：kubelet 与本地 PV 路径限制

当 `local` PV 的 `path`（如 `/opt/data/mysql`）不在 kubelet 默认根目录 `/var/lib/kubelet` 下时，可能 `kubelet` 识别不到对应的路径，抛出`path does not exist`。

::: 

## 4. Nacos（无状态）

基于MySQL存储的无状态服务。

```yaml
# nacos app 服务（基于 MySQL ）
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nacos
  namespace: procure
  labels:
    app: nacos
spec:
  replicas: 1 
  selector:
    matchLabels:
      app: nacos
  template:
    metadata:
      labels:
        app: nacos
    spec:
      
      nodeSelector:
        kubernetes.io/hostname: kcs-yd-qk-zhaocai-k8s-test-s-djsr2
      
      containers:
      - image: nacos/nacos-server:v3.1.2
        name: nacos
        ports:
        - containerPort: 8848
          name: http
        - containerPort: 9848
          name: grpc
        - containerPort: 9849
          name: raft

        env:
        - name: MODE
          value: "standalone"
        - name: SPRING_DATASOURCE_PLATFORM
          value: "mysql"
        - name: MYSQL_SERVICE_HOST
          value: "mysql-svc.procure-mysql.svc.cluster.local"
        - name: MYSQL_SERVICE_PORT
          value: "3306"
        - name: MYSQL_SERVICE_DB_NAME
          value: "nacos"
        - name: MYSQL_SERVICE_USER
          value: "root"
        - name: MYSQL_SERVICE_PASSWORD
          value: "123456"
        - name: MYSQL_SERVICE_DB_PARAM
          value: "characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=UTC"
        - name: JVM_XMS
          value: "1g"
        - name: JVM_XMX
          value: "1g"
        - name: JVM_XMN
          value: "512m"

        - name: NACOS_AUTH_TOKEN
          value: "VGhpc0lzTXlDdXN0b21TZWNyZXRLZXkwMTIzNDU2Nzg="
        - name: NACOS_AUTH_IDENTITY_KEY
          value: "nacos"
        - name: NACOS_AUTH_IDENTITY_VALUE
          value: "nacos"

        resources:
          requests:
            cpu: 200m
            memory: 1Gi
          limits:
            cpu: 500m
            memory: 2Gi
---
# nacos service 配置
apiVersion: v1
kind: Service
metadata:
  name: nacos-nodeport
  namespace: procure
  labels:
    app: nacos-svc
spec:
  type: NodePort
  selector:
    app: nacos
  ports:
  - port: 8848
    targetPort: 8848
    nodePort: 30848
    protocol: TCP
    name: http-api
  - port: 9848
    targetPort: 9848
    nodePort: 31848
    protocol: TCP
    name: grpc-api
  - port: 8080
    targetPort: 8080
    nodePort: 30808
    protocol: TCP
    name: console-ui
```

## 5. Redis（本地部署）

```yaml
# 构建中间层 sc
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: center-storage
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
reclaimPolicy: Retain
allowVolumeExpansion: true
---
# redis service NodePort
apiVersion: v1
kind: Service
metadata:
  name: redis-nodeport
  namespace: procure
  labels:
    app: redis-svc
spec:
  type: NodePort
  selector:
    app: redis
  ports:
  - port: 6379
    targetPort: 6379
    nodePort: 30379
    protocol: TCP
    name: redis
---
# redis pv 构建
apiVersion: v1
kind: PersistentVolume
metadata:
  name: redis-pv-data-1
spec:
  capacity:
    storage: 20Gi
  volumeMode: Filesystem
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: center-storage

  local:
    path: /var/lib/paascontainer/redis/data

  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - kcs-yd-qk-zhaocai-k8s-test-s-djsr2
---
# redis statefulset app构建
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis
  namespace: procure
  labels:
    app: redis
spec:
  replicas: 1
  serviceName: redis-svc
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      nodeSelector:
        kubernetes.io/hostname: kcs-yd-qk-zhaocai-k8s-test-s-djsr2
      containers:
      - name: redis
        image: redis:7.2.4-alpine
        ports:
        - containerPort: 6379
          name: redis
        command:
        - redis-server
        - "--requirepass"
        - "123456"         
        - "--appendonly"   
        - "yes"
        - "--save"
        - "60"
        - "10000"
        resources:
          requests:
            cpu: 100m
            memory: 256Mi
          limits:
            cpu: 300m
            memory: 512Mi
        volumeMounts:
        - name: redis-data
          mountPath: /data  
  volumeClaimTemplates:
  - metadata:
      name: redis-data
    spec:
      storageClassName: center-storage
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 20Gi
```

