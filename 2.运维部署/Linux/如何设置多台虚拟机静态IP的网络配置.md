# 如何设置CentOS服务器静态网络

1. 设置为 桥接模式(Bridged) ，确保虚拟机能够获取与宿主机相同子网和IP地址。
> 桥接模式 (Bridged Mode) 是虚拟化软件中一种常见的网络连接模式，它允许虚拟机与宿主机（物理机器）共享网络连接，并像独立的物理设备一样直接与物理网络通信。


2. 配置 静态IP地址 和 网关。

```shell
# 进入网络脚本目录
cd /etc/sysconfig/network-scripts/
# 编辑网卡配置文件
vi ifcfg-ens33
```

以下是一个ifcfg-ens33的示例配置：
```shell
TYPE="Ethernet"
PROXY_METHOD="none"
BROWSER_ONLY="no"
BOOTPROTO="static" # 设置为静态IP模式
DEFROUTE="yes"
IPV4_FAILURE_FATAL="no"
IPV6INIT="yes"
IPV6_AUTOCONF="yes"
IPV6_DEFROUTE="yes"
IPV6_FAILURE_FATAL="no"
IPV6_ADDR_GEN_MODE="stable-privacy"
NAME="ens33"
UUID="df985b36-9c09-4c7e-b30d-7af51badcaac"
DEVICE="ens33"
ONBOOT="yes"

IPADDR="172.16.92.75" # 配置静态IP地址
NETMASK="255.255.255.0" # 配置子网掩码
GATEWAY="172.16.95.254" # 配置网关（注意：不清楚网关配置的话，可以去宿主机 `ipconfig` 命令查看，以下网关的配置地址是多少。）
DNS1="8.8.8.8" # 配置DNS地址 google DNS
DNS2="8.8.4.4" # 配置DNS地址 另一个google DNS 备用
```
> 注意：不清楚网关配置的话，可以去宿主机 `ipconfig` 命令查看，以下网关的配置地址是多少。不然无法连接外网！

3. 重启网络服务

```shell
systemctl restart network
```

4. 验证静态IP地址是否生效
```shell
# 虚拟机之间能否互相ping通
ping 172.16.92.74
ping 172.16.92.75
ping 172.16.92.77

# 能否ping通外网
ping 8.8.8.8
# 或者
ping www.baidu.com
```

完全按照以上步骤，可能也会不成功，请根据实际情况调整配置。一步步来，例如：如果虚拟机之间能ping通，但ping不通外网地址，说明：网关出现问题，需要检查网关配置是否正确 或者 宿主机无法联网，检查宿主机网络情况等等。

按照出现的情况具体分析，一步步来即可。