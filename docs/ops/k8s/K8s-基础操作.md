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

## 3. 常用命令

```shell
# 查询某个 node 下面的 Pod 信息。
kubectl get pods -n procure -o wide  | grep k8s-node1
```

- `-o` = `--output`：指定 **输出格式**

- `wide`：宽格式 / 扩展格式（比默认输出多显示几列关键信息）





