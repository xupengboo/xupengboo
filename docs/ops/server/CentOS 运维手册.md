---
title: CentOS 运维手册
outline: deep
---

# CentOS 运维手册

> 记录 CentOS 服务器从初始化到日常运维的常用操作，包括环境配置、网络设置、磁盘挂载等，避免每次重复查找。

---

## 一、系统初始化

### 下载安装

- VMware Workstation Pro 安装：[参考教程](https://blog.csdn.net/Du_XiaoNan/article/details/136138427)（推荐 Pro 版，Player 版功能有限）
- CentOS 官方镜像：https://wiki.centos.org/Download.html
- 阿里云镜像（CentOS 7.9，国内速度快）：https://mirrors.aliyun.com/centos/7.9.2009/isos/x86_64/

### 配置 yum 国内镜像源

::: code-group

```bash [CentOS 7]
# 备份原有源
cd /etc/yum.repos.d/
mkdir repo_bak && mv *.repo repo_bak/

# 切换为阿里云镜像源
sudo curl -o /etc/yum.repos.d/CentOS-Base.repo \
  http://mirrors.aliyun.com/repo/Centos-7.repo

# 清理缓存并重建
sudo yum clean all
sudo yum makecache

# 验证源可用性
sudo yum repolist
```

```bash [CentOS 8]
# CentOS 8 已 EOL，需强制兼容模式
sudo sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-*.repo
sudo sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' \
  /etc/yum.repos.d/CentOS-*.repo
sudo yum clean all && sudo yum makecache
```

:::

:::warning 关于 `yum update`
`sudo yum update` 会更新所有系统软件包，可能导致内核或关键组件版本变动。**生产环境慎用**，建议改为 `yum update <指定包名>` 只更新必要的包。
:::

### 安装常用工具

```bash
# 文本编辑器
sudo yum install -y vim

# 网络工具包（含 ping）
sudo yum install -y iputils

# 远程连接测试
sudo yum install -y telnet

# 网络诊断工具（含 netstat、ifconfig）
sudo yum install -y net-tools

# 一次性安装全部
sudo yum install -y vim iputils telnet net-tools
```

### 时区设置

```bash
# 查看当前时区
timedatectl

# 设置为上海时区（UTC+8）
sudo timedatectl set-timezone Asia/Shanghai

# 安装 NTP 时间同步服务
sudo yum install -y ntp

# 启动并设置开机自启
sudo systemctl start ntpd
sudo systemctl enable ntpd

# 验证同步状态（看到 * 标记表示已同步）
ntpq -p
```

### 图形界面 ↔ 命令行切换

```bash
# 切换为命令行模式（节省内存，服务器推荐）
sudo systemctl set-default multi-user.target

# 切换为图形界面模式
sudo systemctl set-default graphical.target

# 重启生效
reboot
```

---

## 二、环境变量配置

### 配置文件说明

Linux 环境变量涉及多个配置文件，加载时机取决于 Shell 类型：

| 文件 | 作用范围 | 加载时机 |
|---|---|---|
| `/etc/profile` | 全局 | login shell 启动时 |
| `/etc/profile.d/*.sh` | 全局 | login shell 和 non-login shell 都会加载 |
| `~/.bash_profile` | 当前用户 | login shell 启动时 |
| `~/.bashrc` | 当前用户 | non-login shell 启动时 |

:::tip 推荐做法
**将全局环境变量写入 `/etc/profile.d/` 下的独立 `.sh` 文件**（如 `/etc/profile.d/myenv.sh`）。

原因：无论是 login shell 还是 non-login shell，启动时都会执行 `/etc/profile.d/*.sh`，覆盖所有场景（包括 SSH 执行远程命令、脚本调用等），是最可靠的全局配置方式。
:::

### login shell vs non-login shell

```
登录终端（输入用户名密码）→ login shell
    加载顺序：/etc/profile → /etc/profile.d/*.sh → ~/.bash_profile → ~/.bashrc

SSH 执行命令（ssh host command）→ non-login shell
    加载顺序：~/.bashrc → /etc/profile.d/*.sh
```

### 示例：配置 Java 环境变量

```bash
# 创建独立配置文件（推荐）
sudo vim /etc/profile.d/java.sh
```

```bash
export JAVA_HOME=/usr/local/jdk17
export PATH=$JAVA_HOME/bin:$PATH
```

```bash
# 立即生效（当前 shell）
source /etc/profile.d/java.sh
```

---

## 三、网络配置：设置静态 IP

### NAT 模式 vs 桥接模式

| | 桥接模式（Bridged） | NAT 模式 |
|---|---|---|
| 网络位置 | 虚拟机直接接入物理网络，相当于独立设备 | 虚拟机通过宿主机做网络转换 |
| IP 地址 | 与宿主机**同网段**的独立 IP | 虚拟专用网段（如 192.168.x.x） |
| 外网访问 | 直接访问 | 通过宿主机 NAT 转发 |
| 被外部访问 | ✅ 可以 | ❌ 默认不行（需端口转发） |
| 适用场景 | 需要被局域网其他设备访问 | 只需访问外网，不需要被访问 |

### 桥接模式配置静态 IP

```bash
# 进入网络脚本目录
cd /etc/sysconfig/network-scripts/

# 编辑网卡配置（网卡名以实际为准，常见有 ens33、eth0）
sudo vim ifcfg-ens33
```

```ini
TYPE="Ethernet"
BOOTPROTO="static"      # 改为 static（默认 dhcp）
NAME="ens33"
DEVICE="ens33"
ONBOOT="yes"            # 开机自动启用

# 静态 IP 配置
IPADDR="172.16.92.75"       # 静态 IP 地址
NETMASK="255.255.255.0"     # 子网掩码
GATEWAY="172.16.95.254"     # 网关（在宿主机执行 ipconfig 查看）
DNS1="8.8.8.8"              # 主 DNS（Google）
DNS2="8.8.4.4"              # 备用 DNS
```

```bash
# 重启网络服务
sudo systemctl restart network
```

:::tip 网关怎么查？
在宿主机（Windows）执行 `ipconfig`，找到对应网卡的"默认网关"字段，填入即可。网关配错是无法访问外网的最常见原因。
:::

**验证连通性：**

```bash
# 虚拟机之间互 ping
ping 172.16.92.74

# ping 外网 IP（不依赖 DNS）
ping 8.8.8.8

# ping 域名（需要 DNS 正常）
ping www.baidu.com
```

排查思路：
- 虚拟机互 ping 不通 → 检查 IP 和子网掩码配置
- 能 ping 通 IP 但 ping 不通域名 → DNS 配置有问题
- 能 ping 通虚拟机但 ping 不通外网 → 网关配置有问题，或宿主机本身无法上网

### NAT 模式配置静态 IP

NAT 模式基于 **VMnet8** 虚拟网卡配置，和桥接模式步骤相同，但网关有所不同：

![VMnet8 配置](/public/images/image-20250221000813087.png)

:::tip NAT 模式网关特殊说明
- VMnet8 的 IP（如 `192.168.50.1`）是宿主机地址，**不是网关**
- NAT 模式的网关是 VMware 内置虚拟 NAT 设备，通常为子网的**第 2 个地址**（如 `192.168.50.2`）
- 可在 VMware → 编辑 → 虚拟网络编辑器 中查看和修改子网配置

![虚拟网络编辑器](/public/images/image-20250418095215573.png)
:::

---

## 四、磁盘挂载

### 常用命令速查

| 命令 | 说明 | 示例 |
|---|---|---|
| `lsblk` | 查看块设备列表（系统盘/数据盘） | `lsblk` |
| `df -h` | 查看已挂载分区的使用情况 | `df -h` |
| `du -sh <目录>` | 查看目录占用空间 | `du -sh /var/log` |
| `mkfs.ext4` | 格式化为 ext4 文件系统 | `mkfs.ext4 /dev/vdb` |
| `mount` | 挂载设备 | `mount /dev/vdb /data` |
| `blkid` | 查看设备的 UUID 和文件系统类型 | `blkid /dev/vdb` |

### 挂载步骤

**Step 1 — 查看设备**

```bash
lsblk
```

输出示例：
```
NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
vda    253:0    0   50G  0 disk
└─vda1 253:1    0   50G  0 part /
vdb    253:16   0  200G  0 disk        ← 数据盘，无挂载点
```

**Step 2 — 确认数据盘状态**

```bash
# 查看是否已有文件系统（有输出说明格式化过，无输出说明是空盘）
blkid /dev/vdb
```

**Step 3 — 格式化（新盘必做，有数据请先备份）**

```bash
# 格式化为 ext4 文件系统
sudo mkfs.ext4 /dev/vdb
```

:::warning 格式化会清空数据
`mkfs.ext4` 相当于重新格式化，执行前确认数据盘上没有需要保留的数据，或提前备份。
:::

**Step 4 — 创建挂载目录并挂载**

```bash
# 创建挂载目录
sudo mkdir -p /data

# 临时挂载（重启后失效）
sudo mount /dev/vdb /data

# 验证挂载是否成功
df -h | grep /data
```

**Step 5 — 设置开机自动挂载（关键！）**

:::warning 必须配置 /etc/fstab
`mount` 命令只是临时挂载，**重启后会失效**。必须将挂载信息写入 `/etc/fstab` 才能永久生效。
:::

```bash
# 获取数据盘的 UUID（推荐用 UUID，比设备名更稳定）
blkid /dev/vdb
# 输出示例：/dev/vdb: UUID="a1b2c3d4-..." TYPE="ext4"
```

```bash
# 编辑 /etc/fstab
sudo vim /etc/fstab
```

在文件末尾添加一行：

```
# <设备UUID>                              <挂载点>  <文件系统>  <挂载选项>  <dump>  <pass>
UUID=a1b2c3d4-xxxx-xxxx-xxxx-xxxxxxxxxxxx  /data     ext4        defaults    0       2
```

```bash
# 验证 fstab 配置是否正确（不重启测试）
sudo mount -a

# 再次确认挂载成功
df -h
```

### 常见问题

**问题：挂载时报"只读文件系统"或"不知道文件类型"**

```bash
# 原因：未格式化，或格式化类型不对
# 解决：重新执行格式化
sudo mkfs.ext4 /dev/vdb
sudo mount /dev/vdb /data
```

**问题：`df -h` 看不到数据盘**

```bash
# 确认设备是否存在
lsblk

# 确认是否已挂载
mount | grep vdb
```

**问题：磁盘快满了，找出占用大的目录**

```bash
# 查看根目录下各子目录大小
du -sh /* 2>/dev/null | sort -rh | head -10

# 查看某目录下的详情
du -sh /var/* | sort -rh | head -10
```
