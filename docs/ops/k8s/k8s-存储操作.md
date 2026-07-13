# K8s 存储操作

## 1. 云硬盘 挂载

使用云硬盘方式，需注意：
- **云硬盘不是永久属于某个 Node，而是由云存储平台管理**。
- **Pod 调度到哪个 Node，CSI Driver 就会把对应的云硬盘 Attach 到那个 Node，再由 kubelet 挂载到 Pod**。
- Pod 漂移后，**CSI Driver 会自动完成 Detach → Attach → Mount 的过程，整个过程对应用基本是透明的（除了迁移期间会有短暂等待）。**

::: tip 解释一下云硬盘的挂载原理（以 ES 云硬盘持久化存储为例）

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: es-cluster
  namespace: elk-k8s
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
        image: docker.elastic.co/elasticsearch/elasticsearch:7.1.1
        # ... 其他环境变量和端口配置 ...
        
        # 1️⃣ 在这里指定：把云硬盘挂载到容器内的 ES 数据目录
        volumeMounts:
        - name: es-data-volume              # 必须与下面的 volumeClaimTemplates 中的 name 一致
          mountPath: /usr/share/elasticsearch/data # ✨ 核心：ES 官方指定的数据存储目录

  # 2️⃣ 核心黑科技：有状态应用专用的“云硬盘自动申请模板”
  volumeClaimTemplates:
  - metadata:
      name: es-data-volume                  # 对应上面的 volumeMounts.name
    spec:
      accessModes: [ "ReadWriteOnce" ]      # 云硬盘通常只支持单节点读写
      storageClassName: "your-cloud-storage-class" # ✨ 你的云厂商提供的存储类名称（如 alicloud-disk / csi-disk 等）
      resources:
        requests:
          storage: 100Gi                    # 每块云硬盘的大小
```

把“云硬盘”想象成一个全新的、刚格式化好的 **U 盘**。这个 U 盘里现在什么都没有，只有一个根目录（我们暂且叫它 `U盘:/`）。

- **你在 YAML 里写的 `mountPath: /usr/share/elasticsearch/data`**：等于是告诉 K8s 操作系统：“请把我的 U 盘插上，并且把它盘符映射到 `/usr/share/elasticsearch/data` 这个路径下。”
- **实际效果**：当你进入容器查看 `/usr/share/elasticsearch/data` 时，你看到的其实已经是这个 U 盘的内部世界了。

所以，云硬盘自己根本不需要去创建这一长串服务目录，它的**根目录**直接就代表了 ES 的数据目录。

::: 





