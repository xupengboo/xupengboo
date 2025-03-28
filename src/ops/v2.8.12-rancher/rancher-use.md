---
title: Rancher 安装与使用
order: 1
---

## 1. 先决条件

### 1.1 环境支持

参考官方，[Rancher 支持矩阵](https://www.suse.com/suse-rancher/support-matrix/all-supported-versions/rancher-v2-8-12/) 。

:::tip 为什么不适用CentOS系统？

CentOS 作为一款曾经广受欢迎的企业级 Linux 发行版，在开源社区和企业中扮演了重要角色。它的设计初衷是提供与 Red Hat Enterprise Linux（RHEL）高度兼容的免费版本，因此长期被用于生产环境，尤其在服务器、云计算和容器化场景中备受青睐。

:::

| 环境要求 | 版本                                                         |
| -------- | ------------------------------------------------------------ |
| Ubuntu   | [Ubuntu 22.04.4 Live Server (amd64)【专为服务器使用】](https://next.itellyou.cn/Original/#cbp=Product?ID=deb4715d-5e52-ea11-bd34-b025aa28351d) 至少 2 台（Master、Slave） |
| Rancher  | [v2.8.12](https://ranchermanager.docs.rancher.com/zh/v2.8/getting-started/overview) |
|          |                                                              |


### 1.2 环境准备

1. 配置 `/etc/hostname` 和 `/etc/hosts`
2. 配置 静态IP 

```bash
cd /etc/netplan/
ls
sudo nano 00-installer-config.yaml
```

```yaml
network:
  ethernets:
    ens33:
      dhcp4: false
      addresses:
        - 192.168.50.129/24  # 设置静态IP地址以及子网掩码(/24 对应 255.255.255.0)
      gateway4: 192.168.50.2 # 设置默认网关
      nameservers:
        addresses:
          - 8.8.8.8 		# 设置 DNS 服务器地址
          - 8.8.4.4
  version: 2
```

## 2. 安装 Rancher

1. 安装 Docker 

```shell
snap install docker
```

2. 启动 Rancher

```shell

```

