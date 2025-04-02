---
title: Helm 使用
order: 1
---

Helm 是 Kubernetes 的一个包管理工具，用于简化 Kubernetes 应用的部署、管理和版本控制。它通过定义、安装和升级复杂的 Kubernetes 应用，将应用及其依赖项打包为可重复使用的「charts」。Helm 主要有以下几个功能：

1. **Charts**: Helm 中的应用包被称为 "charts"。一个 chart 是描述 Kubernetes 资源的 YAML 文件和模板的集合，用户可以用它来部署复杂的应用。
2. **Release**: 当你使用 Helm 部署 chart 时，Helm 会创建一个叫做 "release" 的实例，这个 release 可以看作是 chart 在 Kubernetes 集群中的运行实例。你可以通过 Helm 对 release 进行升级、回滚、删除等操作。
3. **Values**: Charts 可以通过 `values.yaml` 文件来管理可配置参数。用户可以自定义这些值来调整应用程序的行为和配置。
4. **Helm 仓库**: Helm chart 可以托管在远程的仓库中，类似于操作系统的包管理系统中的软件仓库。用户可以从 Helm 仓库中拉取和安装 chart。

Helm 常见的使用场景包括：

- 快速安装和配置 Kubernetes 应用。
- 管理 Kubernetes 中应用的生命周期（安装、升级、回滚、卸载等）。
- 将应用和依赖项打包为一个 chart，方便团队之间的分享和复用。

通过 Helm，你可以减少手动管理 Kubernetes 资源的复杂性，从而加快应用的部署和更新流程。

:::tip Helm 与 Chart

**Helm 是专为 Kubernetes（k8s）设计的包管理工具**，其核心目标是简化 Kubernetes 应用的部署和管理。

**Helm** 是 Kubernetes 的 **包管理工具**，而 **Chart** 是 Helm 使用的 **应用包格式**。

|     概念     |              Helm（工具）               |          Chart（包格式）           |
| :----------: | :-------------------------------------: | :--------------------------------: |
|   **角色**   |       类似于 `apt/yum` 的包管理器       |    类似于 `.deb/.rpm` 的软件包     |
| **核心功能** |      安装/升级/回滚应用、管理依赖       | 定义应用所需的 Kubernetes 资源模板 |
|   **组成**   | CLI 工具 + 服务端组件 (Tiller, v2 版本) |   YAML 模板 + 元数据 + 默认配置    |

:::

## 1. 先决条件

- 安装一个 Kubernetes 集群，并且配置好 `kubectl`。
- 查看 Kubernetes 对应的 Helm [矩阵规则](https://helm.sh/docs/topics/version_skew/)。

```text
Helm：3.8.x
Kubernetes：1.20.x
```

## 2. 安装 Helm

安装 Helm 见：[https://helm.sh/docs/intro/install/](https://helm.sh/docs/intro/install/)

- 在 Kubernetes 集群中，**Helm 客户端只需安装在能访问集群的管理机器上（基于 `kubeconfig` 文件）**（例如：运维终端或 CI/CD 服务器），而所有节点（包括 Master 和 Worker）均无需安装 Helm。

```shell
# 1. 下载
wget https://get.helm.sh/helm-v3.8.2-linux-amd64.tar.gz
# 2. 解压
tar -zxvf helm-v3.8.2-linux-amd64.tar.gz
# 3. 转移
mv linux-amd64/helm /usr/local/bin/helm
# 4. 验证
helm help 
helm version --short


# 5. 卸载 helm 
rm -rf /usr/local/bin/helm
# 删除本地 Helm 配置目录
rm -rf ~/.config/helm
# 删除本地 Helm 缓存目录
rm -rf ~/.cache/helm
# 删除本地 Helm 数据目录
rm -rf ~/.local/share/helm
```

:::tip 解释一下 dnf 软件管理工具：

`dnf` 是 Fedora/RHEL/CentOS 等 Linux 发行版的包管理工具，主要用于软件安装、更新和依赖管理。

CentOS 7 及更早版本：默认使用 `yum` 作为包管理器。CentOS 8/Stream 版本：默认使用 `dnf`（取代了旧版 yum）

```shell
# 1. 手动安装 dnf（需联网）
sudo yum install -y dnf

# 2. 验证安装
which dnf
# 应输出：/usr/bin/dnf

# 3. 重建软件仓库缓存
sudo dnf clean all
sudo dnf makecache
```

:::

## 3. 配置 仓库

`charts.bitnami.com/bitnami` 是 Bitnami 维护的 **Helm Charts 官方仓库**，用于在 Kubernetes 中快速部署应用。

```shell
# 1. 添加 bitnami 仓库
helm repo add bitnami https://charts.bitnami.com/bitnami
# 2. 查看能过够安装的 charts 
helm search repo bitnami
```

## 4. Helm 相关操作

```shell
# 1. 确保我们获取的最新的 chart （更新仓库索引）
helm repo update
# 2. 查看可用 chart
helm search repo bitnami/mysql
NAME            CHART VERSION   APP VERSION     DESCRIPTION
bitnami/mysql   12.3.2          8.4.4           MySQL is a fast, reliable, scalable, and easy t...

# 3. 安装(--debug 方便失败后查询日志)
helm install mydb bitnami/mysql --version 12.3.2 --debug
```

:::tip Helm 拉取 `registry-1.docker.io` 连接被拒绝问题解决。



:::



