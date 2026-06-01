---
title: StatefulSet 实战记录与一键部署
outline: deep
---

## StatefulSet 实战记录与一键部署

::: info
StatefulSet 是 Kubernetes 中管理有状态应用的核心控制器。本文记录实战中常用的部署模板、踩坑经验与一键部署方式，方便后续直接复用。
:::

## 1. 概述

### 1.1 StatefulSet vs Deployment

| 特性 | StatefulSet | Deployment |
| ---- | ----------- | ---------- |
| Pod 标识 | 稳定的、有序的（`name-0`, `name-1`...） | 随机哈希后缀（`name-xxxx-yyyy`） |
| 网络标识 | 每个 Pod 有固定 DNS 名称 | 共享 Service VIP，Pod IP 不固定 |
| 存储 | 每个 Pod 绑定独立 PV/PVC | 共享存储或无状态 |
| 启停顺序 | 有序（0→1→2 启动，2→1→0 停止） | 并行 |
| 适用场景 | 数据库、消息队列、分布式存储 | 无状态 Web 应用 |

### 1.2 适用场景

- **数据库**：MySQL、PostgreSQL、MongoDB
- **缓存**：Redis Cluster（有持久化需求）
- **消息队列**：Kafka、RabbitMQ
- **搜索引擎**：Elasticsearch
- **分布式存储**：MinIO、Ceph

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

## 3. 前置准备

```bash
# 1. 检查集群 StorageClass（动态供应需要）
kubectl get storageclass

# 2. 验证默认 StorageClass（带 default 标记的）
kubectl get storageclass | grep default

# 3. 创建目标命名空间（按需）
kubectl create namespace my-app
```

## 4. 实战案例一：Redis 主从

### 4.1 场景说明

- 部署 2 副本 Redis：`redis-0` 为主节点，`redis-1` 为从节点
- 使用 `volumeClaimTemplates` 自动管理持久存储
- 主从关系通过启动命令动态判断

### 4.2 一键部署 YAML

```yaml
---
apiVersion: v1
kind: Namespace
metadata:
  name: redis

---
apiVersion: v1
kind: ConfigMap
metadata:
  name: redis-config
  namespace: redis
data:
  REDIS_MASTER_HOST: "redis-0.redis.redis.svc.cluster.local"
  REDIS_MASTER_PORT: "6379"

---
apiVersion: v1
kind: Service
metadata:
  name: redis
  namespace: redis
spec:
  clusterIP: None
  selector:
    app: redis
  ports:
    - port: 6379
      targetPort: 6379
      protocol: TCP

---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis
  namespace: redis
spec:
  serviceName: redis
  replicas: 2
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
          image: redis:7.4
          ports:
            - containerPort: 6379
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
          command:
            - /bin/sh
            - -c
            - |
              INDEX=$(hostname | grep -o '[^-]*$')
              if [ "$INDEX" = "0" ]; then
                echo ">>> Starting Redis as Master"
                exec redis-server --appendonly yes
              else
                echo ">>> Starting Redis as Replica of $REDIS_MASTER_HOST:$REDIS_MASTER_PORT"
                exec redis-server --appendonly yes --replicaof $REDIS_MASTER_HOST $REDIS_MASTER_PORT
              fi
          volumeMounts:
            - name: redis-data
              mountPath: /data
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 512Mi
          livenessProbe:
            tcpSocket:
              port: 6379
            initialDelaySeconds: 10
            periodSeconds: 10
          readinessProbe:
            exec:
              command:
                - redis-cli
                - ping
            initialDelaySeconds: 5
            periodSeconds: 5
  volumeClaimTemplates:
    - metadata:
        name: redis-data
      spec:
        accessModes:
          - ReadWriteOnce
        resources:
          requests:
            storage: 1Gi
```

### 4.3 部署与验证

```bash
# 部署
kubectl apply -f redis-statefulset.yaml

# 查看 Pod 按序启动
kubectl get pods -n redis -w

# 查看 PVC 自动创建
kubectl get pvc -n redis

# 验证主从
kubectl exec -it redis-0 -n redis -- redis-cli info replication | grep role
# role:master

kubectl exec -it redis-1 -n redis -- redis-cli info replication | grep role
# role:slave

# 验证数据持久化
kubectl exec -it redis-0 -n redis -- redis-cli set test "hello-statefulset"
kubectl delete pod redis-0 -n redis
kubectl exec -it redis-0 -n redis -- redis-cli get test
# "hello-statefulset"  ← 数据还在，持久化生效
```

## 5. 实战案例二：MySQL 单节点

### 5.1 场景说明

- 部署单节点 MySQL 8.0
- Secret 管理密码
- 健康检查 + 资源限制
- 持久化 `/var/lib/mysql`

### 5.2 一键部署 YAML

```yaml
---
apiVersion: v1
kind: Namespace
metadata:
  name: mysql

---
apiVersion: v1
kind: Secret
metadata:
  name: mysql-secret
  namespace: mysql
type: Opaque
stringData:
  MYSQL_ROOT_PASSWORD: "Root@2024!"
  MYSQL_DATABASE: "app_db"
  MYSQL_USER: "app_user"
  MYSQL_PASSWORD: "App@2024!"

---
apiVersion: v1
kind: Service
metadata:
  name: mysql
  namespace: mysql
spec:
  clusterIP: None
  selector:
    app: mysql
  ports:
    - port: 3306
      targetPort: 3306
      protocol: TCP

---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
  namespace: mysql
spec:
  serviceName: mysql
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
          ports:
            - containerPort: 3306
          envFrom:
            - secretRef:
                name: mysql-secret
          volumeMounts:
            - name: mysql-data
              mountPath: /var/lib/mysql
          resources:
            requests:
              cpu: 250m
              memory: 512Mi
            limits:
              cpu: 1000m
              memory: 1Gi
          livenessProbe:
            exec:
              command:
                - mysqladmin
                - ping
                - -h
                - localhost
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            exec:
              command:
                - bash
                - -c
                - mysql -u root -p$MYSQL_ROOT_PASSWORD -e "SELECT 1"
            initialDelaySeconds: 10
            periodSeconds: 5
  volumeClaimTemplates:
    - metadata:
        name: mysql-data
      spec:
        accessModes:
          - ReadWriteOnce
        resources:
          requests:
            storage: 10Gi
```

### 5.3 部署与验证

```bash
# 部署
kubectl apply -f mysql-statefulset.yaml

# 查看启动状态
kubectl get pods -n mysql -w

# 连接测试
kubectl run mysql-client -it --rm --image=mysql:8.0 -n mysql -- \
  mysql -h mysql-0.mysql.mysql.svc.cluster.local -u root -p'Root@2024!' -e "SHOW DATABASES;"
```

## 6. 实战案例三：Elasticsearch 集群（简要）

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: elasticsearch
  namespace: es
spec:
  clusterIP: None
  selector:
    app: elasticsearch
  ports:
    - port: 9200
      targetPort: 9200
      name: http
    - port: 9300
      targetPort: 9300
      name: transport

---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: elasticsearch
  namespace: es
spec:
  serviceName: elasticsearch
  replicas: 3
  selector:
    matchLabels:
      app: elasticsearch
  template:
    metadata:
      labels:
        app: elasticsearch
    spec:
      containers:
        - name: elasticsearch
          image: elasticsearch:8.11.0
          ports:
            - containerPort: 9200
              name: http
            - containerPort: 9300
              name: transport
          env:
            - name: discovery.seed_hosts
              value: "elasticsearch-0.elasticsearch,elasticsearch-1.elasticsearch,elasticsearch-2.elasticsearch"
            - name: cluster.initial_master_nodes
              value: "elasticsearch-0,elasticsearch-1,elasticsearch-2"
            - name: ES_JAVA_OPTS
              value: "-Xms512m -Xmx512m"
            - name: xpack.security.enabled
              value: "false"
          volumeMounts:
            - name: es-data
              mountPath: /usr/share/elasticsearch/data
  volumeClaimTemplates:
    - metadata:
        name: es-data
      spec:
        accessModes:
          - ReadWriteOnce
        resources:
          requests:
            storage: 20Gi
```

## 7. 存储管理深入

### 7.1 动态供应（推荐）

::: tip 条件
需要集群已安装带 Provisioner 的 StorageClass（如 Rancher Local Path、Longhorn、AWS EBS、NFS CSI 等）
:::

```bash
# 查看默认 StorageClass
kubectl get storageclass

# 若没有默认 SC，可标注
kubectl patch storageclass <your-sc> -p '{"metadata":{"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
```

StatefulSet 中使用：

```yaml
  volumeClaimTemplates:
    - metadata:
        name: data
      spec:
        accessModes:
          - ReadWriteOnce
        resources:
          requests:
            storage: 10Gi
        # storageClassName 不写则使用集群默认 SC
```

### 7.2 静态 PV（手动模式）

当没有动态供应器时，需手动创建 PV：

```yaml
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: mysql-pv-0
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: /data/mysql-0
  storageClassName: manual
  persistentVolumeReclaimPolicy: Retain
```

### 7.3 PVC 在线扩容

```bash
# 1. 确认 StorageClass 支持扩容（allowVolumeExpansion: true）
kubectl get storageclass -o yaml | grep allowVolumeExpansion

# 2. 编辑 PVC 增加 storage
kubectl edit pvc redis-data-redis-0 -n redis
# 修改 spec.resources.requests.storage

# 3. 确认扩容状态
kubectl get pvc -n redis -w
```

## 8. Headless Service 详解

### 8.1 为什么要用 Headless Service

普通 Service 会将流量负载均衡到所有 Pod，但 StatefulSet 场景下往往需要**直接访问特定 Pod**（如主从同步、分片路由）。

Headless Service（`clusterIP: None`）不分配 VIP，DNS 直接解析到每个 Pod 的 IP：

```bash
# 解析 Headless Service
nslookup redis.redis.svc.cluster.local
# 输出 redis-0 和 redis-1 的独立 IP

# 解析普通 Service
nslookup nginx.default.svc.cluster.local
# 输出 ClusterIP（一个 VIP）
```

### 8.2 访问方式

| 方式 | 命令 | 说明 |
| ---- | ---- | ---- |
| 访问所有 Pod | `redis.redis.svc.cluster.local` | DNS 返回所有 Pod IP（SRV 记录） |
| 访问特定 Pod | `redis-0.redis.redis.svc.cluster.local` | 直连指定 Pod |
| 同一命名空间 | `redis-0.redis` | 省略后缀 |

## 9. 常用运维命令清单

### 9.1 状态查询

```bash
# 查看 StatefulSet 详情
kubectl describe sts <name> -n <ns>

# 查看所有 PVC 绑定情况
kubectl get pvc -n <ns> -o wide

# 查看 PV 详情
kubectl get pv
kubectl describe pv <pv-name>

# 查看 Pod 日志
kubectl logs <pod-name> -n <ns> -f
kubectl logs <pod-name> -n <ns> --previous   # 查看上一次容器的日志
```

### 9.2 扩缩容

```bash
# 扩容
kubectl scale sts redis -n redis --replicas=3

# 缩容（逆序：先删 redis-2）
kubectl scale sts redis -n redis --replicas=1

# 直接编辑 YAML
kubectl edit sts redis -n redis
```

### 9.3 滚动更新

```bash
# 更新镜像
kubectl set image sts/redis redis=redis:7.4 -n redis

# 查看更新进度
kubectl rollout status sts/redis -n redis

# 回滚
kubectl rollout undo sts/redis -n redis

# 暂停/恢复
kubectl rollout pause sts/redis -n redis
kubectl rollout resume sts/redis -n redis

# 金丝雀更新（只更新序号 ≥ 2 的 Pod）
kubectl patch sts redis -n redis -p '{"spec":{"updateStrategy":{"rollingUpdate":{"partition":2}}}}'
# 验证无误后，partition 改为 0 全部更新
```

### 9.4 调试

```bash
# 进入 Pod
kubectl exec -it <pod-name> -n <ns> -- /bin/sh

# 查看 Pod 事件
kubectl describe pod <pod-name> -n <ns>

# 测试 DNS 解析
kubectl run dns-test -it --rm --image=busybox:1.28 -n <ns> -- nslookup <service-name>
```

### 9.5 删除

```bash
# 删除 StatefulSet（保留 Pod 和 PVC）
kubectl delete sts <name> -n <ns> --cascade=orphan

# 级联删除 StatefulSet + Pod（保留 PVC）
kubectl delete sts <name> -n <ns>

# 级联删除 StatefulSet + Pod + PVC
kubectl delete sts <name> -n <ns> --cascade=all
# 然后手动删除 PVC（StatefulSet 删除不会自动删 volumeClaimTemplates 创建的 PVC）
kubectl delete pvc -l app=redis -n redis
```

## 10. 一键部署脚本

### 10.1 Redis 一键部署

```bash
#!/bin/bash
# deploy-redis.sh

set -e

NAMESPACE="redis"

echo ">>> 检查 StorageClass..."
if ! kubectl get storageclass &>/dev/null; then
    echo "错误: 集群无可用 StorageClass，请先安装！"
    exit 1
fi

echo ">>> 部署 Redis StatefulSet..."
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Namespace
metadata:
  name: ${NAMESPACE}
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: redis-config
  namespace: ${NAMESPACE}
data:
  REDIS_MASTER_HOST: "redis-0.redis.${NAMESPACE}.svc.cluster.local"
  REDIS_MASTER_PORT: "6379"
---
apiVersion: v1
kind: Service
metadata:
  name: redis
  namespace: ${NAMESPACE}
spec:
  clusterIP: None
  selector:
    app: redis
  ports:
    - port: 6379
      targetPort: 6379
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis
  namespace: ${NAMESPACE}
spec:
  serviceName: redis
  replicas: 2
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
          image: redis:7.4
          ports:
            - containerPort: 6379
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
          command:
            - /bin/sh
            - -c
            - |
              INDEX=\$(hostname | grep -o '[^-]*\$')
              if [ "\$INDEX" = "0" ]; then
                exec redis-server --appendonly yes
              else
                exec redis-server --appendonly yes --replicaof \$REDIS_MASTER_HOST \$REDIS_MASTER_PORT
              fi
          volumeMounts:
            - name: redis-data
              mountPath: /data
  volumeClaimTemplates:
    - metadata:
        name: redis-data
      spec:
        accessModes:
          - ReadWriteOnce
        resources:
          requests:
            storage: 1Gi
EOF

echo ">>> 等待 Pod Ready..."
kubectl wait --for=condition=Ready pod/redis-0 -n ${NAMESPACE} --timeout=120s
kubectl wait --for=condition=Ready pod/redis-1 -n ${NAMESPACE} --timeout=120s

echo ">>> Redis 部署完成！"
kubectl get sts,pod,pvc -n ${NAMESPACE}
```

### 10.2 MySQL 一键部署

```bash
#!/bin/bash
# deploy-mysql.sh

set -e

NAMESPACE="mysql"

echo ">>> 部署 MySQL StatefulSet..."
kubectl apply -f - <<EOF
apiVersion: v1
kind: Namespace
metadata:
  name: ${NAMESPACE}
---
apiVersion: v1
kind: Secret
metadata:
  name: mysql-secret
  namespace: ${NAMESPACE}
type: Opaque
stringData:
  MYSQL_ROOT_PASSWORD: "Root@2024!"
  MYSQL_DATABASE: "app_db"
  MYSQL_USER: "app_user"
  MYSQL_PASSWORD: "App@2024!"
---
apiVersion: v1
kind: Service
metadata:
  name: mysql
  namespace: ${NAMESPACE}
spec:
  clusterIP: None
  selector:
    app: mysql
  ports:
    - port: 3306
      targetPort: 3306
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
  namespace: ${NAMESPACE}
spec:
  serviceName: mysql
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
          ports:
            - containerPort: 3306
          envFrom:
            - secretRef:
                name: mysql-secret
          volumeMounts:
            - name: mysql-data
              mountPath: /var/lib/mysql
          resources:
            requests:
              cpu: 250m
              memory: 512Mi
            limits:
              cpu: 1000m
              memory: 1Gi
          livenessProbe:
            exec:
              command:
                - mysqladmin
                - ping
                - -h
                - localhost
            initialDelaySeconds: 30
            periodSeconds: 10
  volumeClaimTemplates:
    - metadata:
        name: mysql-data
      spec:
        accessModes:
          - ReadWriteOnce
        resources:
          requests:
            storage: 10Gi
EOF

echo ">>> 等待 MySQL Ready..."
kubectl wait --for=condition=Ready pod/mysql-0 -n ${NAMESPACE} --timeout=180s

echo ">>> MySQL 部署完成！"
kubectl get sts,pod,pvc -n ${NAMESPACE}
```

## 11. 常见问题与排错

### 11.1 Pod 一直 Pending

```bash
kubectl describe pod <pod-name> -n <ns>
```

常见原因：

| 现象 | 原因 | 解决 |
| ---- | ---- | ---- |
| `pod has unbound immediate PersistentVolumeClaims` | PVC 无法绑定 PV | 检查 StorageClass/PV 是否可用：`kubectl get pvc -n <ns>` |
| `0/3 nodes are available` | 资源不足或节点污点 | 检查节点资源：`kubectl top nodes` 和污点：`kubectl describe node` |
| `PVC is in Pending state` | 未配置 StorageClass | 检查：`kubectl get storageclass`，配置默认 SC 或手动创建 PV |

### 11.2 PV/PVC 绑定失败

```bash
# 查看 PVC 状态
kubectl get pvc -n <ns>

# 查看 PVC 详情
kubectl describe pvc <pvc-name> -n <ns>
```

常见原因：

- PVC 的 `storageClassName` 与 PV 不匹配
- PV 容量小于 PVC 请求
- 访问模式不匹配（如 PVC 要 `ReadWriteOnce`，PV 是 `ReadOnlyMany`）

### 11.3 网络标识解析失败

```bash
# 测试 DNS
kubectl run dns-test -it --rm --image=busybox:1.28 -- nslookup redis-0.redis.default.svc.cluster.local
```

常见原因：

- Headless Service 名称与 StatefulSet 的 `serviceName` 不一致
- Namespace 不在同一空间域名中
- CoreDNS Pod 异常：`kubectl get pods -n kube-system | grep coredns`

### 11.4 有序启动卡住

StatefulSet 要求前一个 Pod Running & Ready 后才启动下一个。如果卡住不动：

```bash
# 检查前一个 Pod 的 readinessProbe
kubectl describe pod <前一个pod> -n <ns>
kubectl logs <前一个pod> -n <ns>
```

可能原因：
- 前一个 Pod 健康检查未通过
- 前一个 Pod 初始化脚本失败
- 镜像拉取失败（检查 `kubectl describe pod` 的 Events）

### 11.5 PVC 残留问题

StatefulSet 删除后，`volumeClaimTemplates` 创建的 PVC **不会自动删除**：

```bash
# 查看残留 PVC
kubectl get pvc -n <ns>

# 按标签批量删除
kubectl delete pvc -l app=redis -n redis

# 或逐个删除
kubectl delete pvc redis-data-redis-0 redis-data-redis-1 -n redis
```

### 11.6 镜像拉取失败（私有仓库）

```yaml
spec:
  template:
    spec:
      imagePullSecrets:
        - name: my-registry-secret
```

```bash
# 创建镜像拉取 Secret
kubectl create secret docker-registry my-registry-secret \
  --docker-server=harbor.example.com \
  --docker-username=admin \
  --docker-password=Harbor12345 \
  -n <ns>
```

## 12. 总结

| 要点 | 说明 |
| ---- | ---- |
| **必须用 Headless Service** | `clusterIP: None`，确保每个 Pod 有独立 DNS |
| **推荐 volumeClaimTemplates** | 自动管理存储，配合动态 StorageClass 最省心 |
| **Pod 命名固定** | `<sts-name>-<序号>`格式，便于定位和调试 |
| **扩容不自动扩 PVC** | 手动 `kubectl scale` 扩容后，新 Pod 会自动创建新 PVC |
| **删除 STS 不删 PVC** | 需手动清理，防止数据误删 |

> 更多 StatefulSet 与 PV/PVC 的理论细节，参见 [Kubernetes yaml 配置 §6.7 §9](./yaml.md#_6-7-statefulset-persistentvolume-pv-persistentvolumeclaim-pvc-storageclass-资源类型)
