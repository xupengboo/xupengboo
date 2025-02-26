---
title: Ubuntu 设置静态IP地址
order: 7
---

在 Ubuntu 中配置静态 IP 地址，通常是通过修改网络配置文件来完成的。**Ubuntu 20.04 及其以后版本使用 `netplan` 来管理网络配置**。下面是配置静态 IP 地址的步骤：

## 1. 打开网络配置文件

首先，找到 `netplan` 配置文件，通常位于 `/etc/netplan/` 目录下，文件名一般以 `.yaml` 结尾。例如：

```bash
cd /etc/netplan
ls
```

你可能会看到类似 `00-installer-config.yaml` 的文件，打开该文件进行编辑：

```bash
bash


复制编辑
sudo nano 00-installer-config.yaml
```

## 2. 编辑配置文件

在文件中，你将看到类似以下内容：

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp3s0:
      dhcp4: true
```

`enp3s0` 是网络接口的名称，根据你的系统可能有所不同，可以通过运行 `ip link` 或 `ifconfig` 命令来查看网络接口的名称。

为了配置静态 IP 地址，需要将 `dhcp4` 设置为 `false`，并手动配置静态 IP 地址。修改后的内容如下：

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

- `addresses`：静态 IP 地址和子网掩码（`/24` 对应 `255.255.255.0`）。
- `gateway4`：设置默认网关。
- `nameservers`：设置 DNS 服务器地址。

## 3. 应用配置

保存文件后，退出编辑器，然后运行以下命令来应用新的网络配置：

```bash
sudo netplan apply
```

如果配置正确，你的网络接口就会使用静态 IP 地址。

## 4. 验证配置

你可以使用以下命令来验证静态 IP 地址是否成功配置：

```bash
ip addr show
```

或者：

```bash
ifconfig
```

检查输出中对应接口的 IP 地址是否已更新为你配置的静态 IP。

如果有任何问题，可以通过查看系统日志来排查：

```bash
journalctl -u systemd-networkd
```

这样，你就完成了 Ubuntu 上静态 IP 配置。
