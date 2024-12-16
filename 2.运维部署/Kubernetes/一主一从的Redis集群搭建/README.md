# 一主一从的Redis集群

> 针对Redis集群的搭建，这里只是记录一下注意点，正常直接在 `kubectl apply` 这些文件即可。



# 1. `redis-configmap.yaml` 中的 `REDIS_MASTER_HOST: "redis-0.redis"` 配置：

如果您的 Pod 名字是 `redis-0`，并且使用 Kubernetes 中的 **StatefulSet** 进行部署，那么对应的主机名（host）仍然应该是 `redis-0.redis` 而不是 `redis-0`，因为 Kubernetes 会根据 **StatefulSet** 的规则为每个 Pod 生成 DNS 名称。

在 Kubernetes 中，**StatefulSet** 会为每个 Pod 创建一个基于名称的 DNS 域名，并且采用以下格式：

```bash
<statefulset-name>-<pod-index>.<headless-service-name>
```

具体解释：

- `redis-0` 是 Pod 的名称。
- `redis` 是 **Headless Service** 的名称。
- 通过 Headless Service，Pod 的 DNS 名称为 `redis-0.redis`。

例子：

- `redis-0` Pod 的完整 DNS 名称是 `redis-0.redis`。
- `redis-1` Pod 的完整 DNS 名称是 `redis-1.redis`。

因此，在您的 `ConfigMap` 中，**如果是从节点**，配置应使用 `redis-0.redis`（主节点的 DNS 名称）作为 `REDIS_MASTER_HOST`，保持不变。



# 2. `redis-storage-class` 的使用

使用 `redis-storage-class` 更加标准化。



# 3. `headless service` 关键性角色

没有 `headless service` ，主从节点机器就无法连接，`headless service` 记录了所有与之匹配的 Pod，通过域名解析，进行对接访问：详情见：上面第一个章节。



# 4. 如何测试 Redis 集群是否搭建成功

**验证服务发现**： 通过 `kubectl exec` 进入从节点容器：

```bash
redis-cli INFO replication
```

输出中应包含：

- `role:slave`
- `master_host:redis-0.redis`

**主从同步测试**： 在主节点执行写入操作：

```bash
redis-cli SET mykey myvalue
```

在从节点验证数据同步：

```bash
redis-cli GET mykey
```

