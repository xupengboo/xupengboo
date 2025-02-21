---
title: Vmware 工具
order: 5
---

## 1. Vmware 安装

安装地址：https://softwareupdate.vmware.com/cds/vmw-desktop/ws/

Vmware 许可：https://blog.csdn.net/qq_41858698/article/details/136823185

## 2. Vmnet1 和 Vmnet8

Vmnet1 和 Vmnet8 是 VMware 虚拟机软件中虚拟网络编辑器里的两种虚拟网络。

**Vmnet1**（**仅主机模式 - Host - Only**）：Vmnet1 搭建起了虚拟机与宿主机之间的专属网络环境。在这种模式下，虚拟机就像处于一个封闭的局域网中，它能和宿主机进行通信，但无法直接访问外部网络（比如互联网）。

**Vmnet8**（**NAT 模式 - Network Address Translation， 网络地址转换**）：Vmnet8 借助宿主机的网络连接，让虚拟机能够访问外部网络。NAT 模式就像是一个代理服务器，虚拟机通过宿主机的网络接口来访问互联网，对外表现为宿主机的 IP 地址。

:::important 为什么 NAT 模式下，切换网络后并不会影响虚拟机？
在 NAT 模式下，虚拟机借助宿主机的网络连接来访问外部网络。VMware 虚拟网络编辑器会为 VMnet8（NAT 模式对应的虚拟网络）创建一个独立的虚拟子网，这个子网与宿主机所连接的物理网络是相互隔离的。虚拟机的网络通信是通过宿主机的 NAT 服务进行转发的，它只需要和宿主机上的 VMnet8 虚拟网卡进行通信，而不需要关心宿主机所连接的物理网络的具体网段。
:::

:::tip

NAT 模式下宿主机物理网卡不直接响应来自虚拟机的 ICMP 请求。所以，**当我们配置了 NAT 模式 后，虚拟机无法 ping 通 宿主机Vmnet8的IPv4地址的**。

:::