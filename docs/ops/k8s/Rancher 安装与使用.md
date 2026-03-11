---
title: Rancher 安装与使用
outline: deep
---

# Rancher 安装与使用

> Rancher 是一个开源的 Kubernetes 多集群管理平台，提供可视化界面，大幅降低 K8s 的运维门槛。

:::warning 版本说明
本文以 **Rancher v2.5.14** 为例。该版本已于 2023 年 EOL，建议新项目使用 **v2.8+** 或 **v2.9+**，API 和界面略有差异，操作思路一致。

版本兼容性参考：[Rancher 支持矩阵](https://www.suse.com/suse-rancher/support-matrix/all-supported-versions/)
:::

---

## 一、前提条件

| 要求 | 说明 |
|---|---|
| Docker | 所有节点版本必须一致 |
| 关闭 swap | `sudo swapoff -a` 并注释 `/etc/fstab` 中的 swap 行 |
| 禁用 SELinux | `sudo setenforce 0`，并修改 `/etc/selinux/config` 永久生效 |
| 时间同步 | 各节点时间必须一致，否则证书验证会失败 |
| 开放端口 | 443、80、6443、2379-2380、10250-10252 等 |

---

## 二、搭建 Rancher 服务

单节点部署（适合测试/开发环境），一条命令即可：

```bash
docker run -d \
  --name rancher \
  --restart unless-stopped \
  --privileged \
  -v /opt/rancher/lib/kubelet:/var/lib/kubelet \
  -v /opt/rancher/lib/rancher:/var/lib/rancher \
  -v /opt/rancher/log:/var/log \
  -v /opt/rancher/lib/cni:/var/lib/cni \
  -p 1443:443 \
  --security-opt label=disable \
  --shm-size 1g \
  rancher/rancher:v2.5.14
```

:::tip 参数说明
- `--privileged`：Rancher 需要特权模式来管理 K8s 组件
- `--shm-size 1g`：共享内存建议至少 1g，过小会导致 Rancher 运行异常
- `-p 1443:443`：将容器 443 端口映射到宿主机 1443，避免与已有服务冲突
- `-v` 挂载目录：持久化数据，容器重启后不丢失
  :::

启动后访问：`https://<宿主机IP>:1443`，首次登录会提示设置管理员密码。

---

## 三、搭建 K8s 集群

### 切换中文界面

右上角用户头像 → `Preferences` → `Language` → 选择简体中文。

![切换中文](https://github.com/user-attachments/assets/fe75ab50-c8c1-4679-ae34-e32a164b4913)

### 创建集群步骤

1. 首页点击 `添加集群` → 集群类型选择 **自定义**（自己的服务器节点）
2. 填写集群名称、K8s 版本等基础信息，点击下一步
3. 根据节点角色（etcd / Control Plane / Worker）勾选对应选项，复制生成的命令
4. 在对应节点上执行该命令，节点会自动注册到集群
5. 等待集群初始化完成（通常需要 5~15 分钟）

:::tip 初始化期间的报红提示
集群创建过程中会有一些红色警告，这是正常现象，组件还在拉取和启动中，耐心等待会自动消除。真正需要关注的是节点长时间处于 `NotReady` 状态。
:::

---

## 四、部署服务

### 操作路径

`集群` → `项目/命名空间` → 进入目标项目 → `部署服务`

![进入项目](https://github.com/user-attachments/assets/097b47a1-2065-4e00-8fdc-d1a73ab013be)

![部署服务入口](https://github.com/user-attachments/assets/8ab67a5d-aedf-4ea0-89bd-81d70e3859bb)

### 配置项说明

部署服务的配置项和 Docker 参数基本一一对应：

| Rancher 配置项 | 对应 Docker 参数 |
|---|---|
| 镜像 | `docker run <image>` |
| 环境变量 | `-e KEY=VALUE` |
| 端口映射 | `-p 宿主机端口:容器端口` |
| 数据卷 | `-v 宿主机路径:容器路径` |
| 缩放策略 | 副本数 / 自动扩缩容 |

![服务配置](https://github.com/user-attachments/assets/8b8b9088-ed61-4890-95b1-2ab650138427)

:::info Rancher「项目」是什么？
**项目（Project）是 Rancher 独有的概念**，K8s 原生并没有这个层级。它是对多个命名空间（Namespace）的逻辑分组，方便按团队或业务进行权限管理，不影响 K8s 本身的运行。
:::

---

## 五、配置 kubectl

Rancher 控制台内置了 kubectl，但**在宿主机命令行直接执行 kubectl 需要额外配置**。

### Step 1 — 安装 kubectl

```bash
# 查询当前集群使用的 kubectl 版本（在 Rancher 控制台终端执行）
kubectl version

# 在宿主机下载对应版本（将 v1.x.x 替换为实际版本号）
curl -LO https://dl.k8s.io/release/v1.x.x/bin/linux/amd64/kubectl

# 验证完整性
curl -LO https://dl.k8s.io/release/v1.x.x/bin/linux/amd64/kubectl.sha256
echo "$(cat kubectl.sha256) kubectl" | sha256sum --check
# 输出 "kubectl: OK" 表示验证通过

# 安装到系统路径
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# 验证安装
kubectl version --client
```

:::warning kubectl 版本必须与集群一致
kubectl 客户端版本和 K8s 集群版本最多允许差一个小版本，版本差距过大会出现 API 不兼容问题。先在 Rancher 控制台执行 `kubectl version` 确认集群版本再下载。
:::

### Step 2 — 配置 kubeconfig

`kubeconfig` 是 kubectl 访问集群的凭证文件，包含集群地址、用户证书等信息。

在 Rancher 界面复制 kubeconfig 内容：

![复制 kubeconfig](https://github.com/user-attachments/assets/65600033-cbad-4f0a-8cc5-d9a9be92fd60)

保存到本地：

```bash
mkdir -p ~/.kube
vim ~/.kube/config
# 将复制的内容粘贴保存
```

### Step 3 — 验证

```bash
# 查看集群节点
kubectl get nodes

# 查看所有命名空间的 Pod
kubectl get pods -A
```

:::tip Rancher 内置向导
Rancher 界面里有完整的 kubectl 配置引导（集群页面右上角 → `Kubeconfig 文件`），步骤和上面完全一致，也会自动提示 kubectl 版本。
:::

![Rancher kubectl 向导](https://github.com/user-attachments/assets/9f7be508-d7b5-4d60-a507-545c7d06fd83)

---

## 六、Rancher 宕机处理

**Rancher 是管理面，不是数据面。** Rancher 服务宕机不会影响 K8s 集群本身的运行，已部署的服务照常运行，只是暂时无法通过 Rancher 界面管理。

处理步骤：

```bash
# 1. 查看 Rancher 容器状态
docker ps -a | grep rancher

# 2. 查看日志排查原因
docker logs rancher --tail 100

# 3. 尝试重启
docker restart rancher

# 4. 如果容器异常，删除重建（数据已挂载到宿主机，不会丢失）
docker rm rancher
# 重新执行第二章的 docker run 命令
```

Rancher 宕机期间，通过已配置好的 kubectl 直接管理集群：

```bash
# 查看节点状态
kubectl get nodes

# 查看 Pod 状态
kubectl get pods -A

# 重启某个 Deployment
kubectl rollout restart deployment/<name> -n <namespace>
```

---

## 七、K8s 核心概念速查

:::info Pod、Container 与 Docker 的关系

| 概念 | 说明 |
|---|---|
| **Docker 容器** | 单进程模型，通常一个容器跑一个主进程 |
| **Pod** | K8s 的最小调度单位，可包含一个或多个容器 |
| **Pod 内多容器** | 容器之间是**平行关系**，共享网络（同一 IP）和存储卷，但进程互相隔离 |

Pod 内多容器的典型模式：
- **Sidecar**：主容器 + 辅助容器（如日志采集 agent、流量代理）
- **Init Container**：主容器启动前先跑初始化容器（如数据库迁移、配置下发）

简单记忆：**Pod 是一组共享网络的容器的集合**，不是嵌套关系。
:::

---

## 八、证书轮换

### 问题现象

Rancher v2.5.x 默认证书有效期为 **1 年**，到期后 `kubectl` 连接会报类似如下错误：

```
Unable to connect to the server: x509: certificate has expired or is not yet valid:
current time 2025-07-28T14:13:45+08:00 is after 2025-07-25T08:32:16Z
```

![证书过期错误](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250728143814303.png)

**原因**：Kubernetes 集群内部证书（API Server、etcd 等）已过期，导致所有基于 TLS 的通信失败。

### 解决步骤（Rancher v2.5.x）

官方参考：https://docs.rancher.cn/docs/rancher2.5/trending-topics/certificate-rotation/_index/

```bash
# 1. 进入 Rancher 容器内部
docker exec -it <容器ID> bash

# 2. 删除旧的 K3s 服务证书 Secret
#    注意：此操作会强制删除旧证书，可能导致短暂服务中断
kubectl --insecure-skip-tls-verify \
  -n kube-system delete secret k3s-serving

kubectl --insecure-skip-tls-verify \
  -n cattle-system delete secret serving-cert

# 3. 删除动态证书文件，K3s 将在下次启动时自动重新生成
rm -f /var/lib/rancher/k3s/server/tls/dynamic-cert.json

# 4. 触发证书更新：访问 Rancher API 强制刷新
#    将 <IP:端口> 替换为你访问 Rancher 的实际地址（如 192.168.1.100:1443）
curl --insecure -sfL https://<IP:端口>/v3

# 5. 退出容器
exit

# 6. 重启 Rancher 容器使证书生效
docker restart <容器ID>
```

执行完成后，等待 1~2 分钟再次执行 `kubectl get nodes` 验证是否恢复正常。

:::warning 操作注意事项
- 步骤 2 删除 Secret 会导致**短暂服务中断**，建议在业务低峰期操作
- 操作前确认已有可用的 kubectl 访问方式（宿主机已配好 kubeconfig）
- 多节点集群中，证书轮换后各节点 kubelet 会自动重新申请证书，可通过 `kubectl get csr` 查看状态
  :::

:::tip 如何避免证书到期
Rancher **v2.6+** 支持自动证书轮换，升级新版本可彻底规避此问题。暂时无法升级的话，建议设置日历提醒，在证书到期前 1 个月手动执行轮换。
:::

---

## 九、高可用（HA）模式

### 单节点 vs HA 模式对比

| | 单节点（Docker 部署） | 高可用（HA）模式 |
|---|---|---|
| 部署难度 | 简单，一条命令 | 复杂，需要先有 K8s 集群 |
| 容错能力 | 无，宕机即不可用 | 有，多副本自动接管 |
| 数据存储 | 容器内 SQLite | 外部数据库（MySQL / PostgreSQL） |
| 扩展性 | 差，集群多了会卡顿 | 好，支持水平扩展 |
| 适用场景 | 开发、测试、中小型团队 | 生产环境、大规模集群管理 |

### HA 架构说明

HA 模式下，Rancher 以 **Helm Chart** 形式部署在一个专用 K8s 集群（称为 **Bootstrap 集群**）中，多个 Rancher Pod 同时运行，通过外部数据库共享状态：

```
                    ┌─────────────────────────────┐
                    │      Bootstrap K8s 集群      │
用户 → 负载均衡 →   │  Rancher Pod × 3            │
                    │  （Helm 部署，多副本）        │
                    └──────────┬──────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │  外部数据库          │
                    │  MySQL / PostgreSQL  │
                    └─────────────────────┘
                               │ 管理
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
         业务集群 A        业务集群 B        业务集群 C
```

### HA 部署基本步骤

```bash
# 前提：已有一个可用的 K8s 集群作为 Bootstrap 集群

# 1. 安装 Helm（如未安装）
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# 2. 添加 Rancher Helm 仓库
helm repo add rancher-stable https://releases.rancher.com/server-charts/stable
helm repo update

# 3. 创建命名空间
kubectl create namespace cattle-system

# 4. 安装 cert-manager（Rancher 依赖它管理 TLS 证书）
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.crds.yaml
helm repo add jetstack https://charts.jetstack.io
helm repo update
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace

# 5. 安装 Rancher
helm install rancher rancher-stable/rancher \
  --namespace cattle-system \
  --set hostname=<你的域名或IP> \
  --set replicas=3 \
  --set bootstrapPassword=<初始管理员密码>

# 6. 等待部署完成
kubectl -n cattle-system rollout status deploy/rancher
```

:::tip Bootstrap 集群选型建议
- 推荐使用 **K3s** 或 **RKE2** 搭建 Bootstrap 集群，轻量且专为 Rancher 优化
- Bootstrap 集群建议 **3 个节点**以保证 etcd 高可用
- Bootstrap 集群本身不建议再用 Rancher 管理，避免循环依赖
  :::

---

## 十、Rancher vs KubeSphere

两者都是 K8s 管理平台，但定位不同，选型前需了解核心差异。

### 核心区别

| | Rancher | KubeSphere |
|---|---|---|
| **运行方式** | 独立服务，不依赖现有 K8s | 必须运行在已有 K8s 集群上 |
| **创建集群** | ✅ 可以（RKE / K3s） | ❌ 不能，只管理已有集群 |
| **多集群管理** | ✅ 核心功能 | ✅ v3.0+ 支持，非核心定位 |
| **多租户** | 基础支持（用户/组/角色） | 深度支持（工作空间/项目/角色体系） |
| **DevOps / CI/CD** | ❌ 不内置，依赖外部集成 | ✅ 内置流水线 |
| **服务网格（Istio）** | 支持，需手动集成 | ✅ 内置图形化管理 |
| **监控告警** | 依赖 Prometheus，需配置 | ✅ 内置，开箱即用 |
| **界面风格** | 简洁，运维导向 | 现代化，开发者友好 |

### 选型建议

**选 Rancher：**
- 需要统一管理多个不同环境的 K8s 集群（混合云、多云）
- 团队以运维为主，核心诉求是**快速搭建和纳管集群**
- 资源有限，不想引入额外平台层开销

**选 KubeSphere：**
- 已有 K8s 集群，需要一个功能完整的上层开发者平台
- 团队有 DevOps 需求，需要内置 CI/CD 和可视化流水线
- 需要精细化的多租户管理

:::tip 两者不互斥
实际上可以用 **Rancher 管理集群基础设施**，在集群内部署 **KubeSphere** 提供开发者平台能力，两者分工合作，各司其职。
:::
