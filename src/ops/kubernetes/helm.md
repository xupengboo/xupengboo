---
title: Helm 介绍
order: 4
---

## Helm 介绍

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