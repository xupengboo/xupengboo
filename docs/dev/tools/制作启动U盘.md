---
title: 制作启动U盘
outline: deep
---

# 制作启动U盘

> 重装系统或部署服务器的第一步：下载 ISO 镜像 → 制作启动U盘 → 从U盘引导安装。

---

## 一、ISO 镜像下载

### Windows 系统

| 来源 | 地址 | 说明 |
|---|---|---|
| 微软官方 | https://www.microsoft.com/zh-cn/software-download | 官方工具直接下载，最权威 |
| MSDN I Tell You | https://next.itellyou.cn | 收录 Windows / Office / Server 各版本原版镜像，资源最全 |

:::tip 推荐 next.itellyou.cn
包含 Windows 10/11、Server 各版本及众多 Linux 发行版的原版 ISO，用磁力链接或 BT 下载，速度快且文件可信度高。
:::

### Linux 系统

| 发行版 | 推荐下载地址 |
|---|---|
| CentOS 7 | https://mirrors.aliyun.com/centos/7.9.2009/isos/x86_64/ |
| Ubuntu | https://mirrors.aliyun.com/ubuntu-releases/ |
| Debian | https://mirrors.aliyun.com/debian-cd/ |
| Rocky Linux（CentOS 替代） | https://mirrors.aliyun.com/rockylinux/ |

:::info CentOS 8 已 EOL
CentOS 8 于 2021 年 12 月 31 日停止维护，阿里云等镜像站已下线相关文件。
如需 CentOS 8 风格的系统，推荐替代方案：
- **Rocky Linux** — CentOS 原班团队主导，100% 兼容 RHEL
- **AlmaLinux** — 同样 RHEL 兼容，社区活跃
  :::

---

## 二、Ventoy 制作多系统启动U盘

[Ventoy](https://www.ventoy.net/) 是目前最推荐的启动U盘制作工具，核心优势是**把 ISO 文件直接拷进去就能启动**，支持同时放多个系统镜像，启动时用菜单选择。

### 与传统工具对比

| | Ventoy | Rufus / UltraISO |
|---|---|---|
| 多系统支持 | ✅ 无限个 ISO | ❌ 每次只能写一个 |
| 添加新系统 | 直接复制 ISO 文件 | 需要重新写盘 |
| U盘同时存普通文件 | ✅ 可以 | ❌ 空间全被占用 |
| 操作难度 | 极简 | 较简单 |

### 安装步骤

**Step 1 — 下载 Ventoy**

前往 [Ventoy Releases](https://github.com/ventoy/Ventoy/releases) 下载最新版本：
- Windows：下载 `ventoy-x.x.xx-windows.zip`
- Linux：下载 `ventoy-x.x.xx-linux.tar.gz`

**Step 2 — 安装 Ventoy 到U盘**

:::warning U盘数据会被清空
安装 Ventoy 会格式化U盘，请提前备份U盘中的数据。
:::

打开 `Ventoy2Disk.exe`（Windows）或运行 `sudo sh Ventoy2Disk.sh -I /dev/sdX`（Linux），选择U盘，点击安装。

安装完成后U盘会出现一个名为 **`Ventoy`** 的分区，用于存放 ISO 文件。

**Step 3 — 可选：预留普通数据分区**

如果希望U盘同时能存普通文件，在安装前通过 Ventoy 工具配置预留空间：

`选项` → `分区配置` → 设置底部预留空间大小（如预留 16GB 给普通文件）

安装完成后，用磁盘管理工具（Windows 磁盘管理 / Linux `GParted`）将预留空间格式化为 **exFAT**（Windows/Linux/macOS 通用）。

**Step 4 — 拷入 ISO 文件**

将下载好的 ISO 文件直接复制到 **`Ventoy`** 分区根目录，支持建子文件夹分类管理：

```
Ventoy 分区/
├── windows/
│   ├── Win11_23H2_x64.iso
│   └── Win10_22H2_x64.iso
└── linux/
    ├── CentOS-7.9-x86_64-DVD.iso
    └── ubuntu-22.04-live-server-amd64.iso
```

**Step 5 — 从U盘启动**

插入U盘，重启电脑，**在出现主板 Logo 时**按快捷键进入启动菜单，选择U盘启动。

各品牌进入启动菜单的快捷键：

| 品牌 | 快捷键 |
|---|---|
| Dell | F12 |
| HP | F9 / Esc |
| Lenovo（联想） | F12 / F10 |
| ASUS（华硕） | F8 / Esc |
| Gigabyte（技嘉） | F12 |
| MSI（微星） | F11 |
| 其他 / 通用 | F2 / Del 进 BIOS 后手动调启动顺序 |

:::tip 找不到快捷键？
开机时屏幕底部通常会短暂显示"Press F12 to select boot device"等提示，注意观察。如果速度太快来不及按，可以在 Windows 的"高级启动"中重启到 UEFI 固件设置。
:::

进入 Ventoy 启动菜单后，选择需要安装的系统 ISO，按回车即可开始安装。
