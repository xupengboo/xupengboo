---
title: Rancher 高可用（HA）模式
order: 33
---

## 1. Docker 启动的单节点 Rancher 服务

对于 Rancher ，大多数用到的是通过 Docker 单节点部署，进行拓展，但这种方式仅适用于 开发、测试、中小型场合。

单节点 Rancher 弊端：

- 单节点模式虽然简单，但缺乏容错能力。
- 随着业务的拓展，单个节点的 Rancher 必然难以为继，甚至由于管理集群太多出现卡顿等情况。
- 单节点 Rancher 数据是存储到容器内部的 `sqlite` 数据库中的，无法通过外部数据库，例如：`MySQL` 存储。

所以，一般生产环境，建议使用高可用模式，将 Rancher 部署到 Kubernetes 集群中，并启用冗余实例。

高可用（HA）模式就可以配置外部 MySQL作为存储。

## 2. 高可用（HA）模式

在高可用（HA）模式下部署 Rancher 时，需要一个 Kubernetes 集群作为前提条件。这是因为 Rancher 在这种模式下是以 Kubernetes 的应用（通常是 Helm Chart 的方式）部署的。在这种设置中：

1. **Rancher 的运行环境**：Rancher 自己运行在一个 Kubernetes 集群中，该集群为其提供高可用和容错能力。
2. **管理其他集群**：部署的 Rancher 实例可以用于管理多个其他 Kubernetes 集群，包括它自身所在的 Kubernetes 集群或其他外部集群（例如云端或本地部署的 Kubernetes 集群）。
3. **高可用性**：通过 Kubernetes 的控制平面和 Rancher 的服务架构，Rancher 实现了高可用性。如果一个 Rancher 实例不可用，其他实例可以接管其功能。

这种架构使得 Rancher 更加可靠，并可以利用 Kubernetes 本身的自动恢复机制来增强服务的稳定性。

::: tip
这个前置 Kubernetes 集群 ，也被称为 `Bootstrap 集群` 。Rancher 的所有服务（如 API 服务、Web UI 等）将作为多个 Pod 部署在这个集群中。
:::

Rancher 的 HA 模式需要一个 **外部数据库**（推荐 MySQL 或 PostgreSQL）来存储其配置信息和状态数据。







