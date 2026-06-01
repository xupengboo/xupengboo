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

## 3. 实战案例一：MySQL



```yaml
# 命名空间
apiVersion: v1
kind: Namespace
metadata:
  creationTimestamp: null
  name: procure-mysql
spec: {}
status: {}
---
# storageclass 本地静态（no-provisioner, 无供应云厂商）
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: mysql-storage
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
reclaimPolicy: Retain
allowVolumeExpansion: true
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

::: tip 注意点：

正常 kubelet 目录扫描，默认只能是`/var/lib/kubelet`下面的，如需要挂在的宿主机其他位置，需要额外配置。

:::



