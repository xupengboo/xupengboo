---
title: 操作系统
---

## Window ISO 镜像下载

MSDN：[msdn.itellyou.cn](https://msdn.itellyou.cn/)   or   [next.itellyou.cn](https://next.itellyou.cn/)

微软官方：

> 参考：[推荐几个Windows iso镜像下载的网站](https://blog.csdn.net/B11050729/article/details/131893717)

## U盘 分区

Ventoy 支持将U盘分成两个分区：一个用于存放ISO文件（启动分区），另一个用于普通数据存储。

步骤：

1. **下载 Ventoy**：
   - 访问 [Ventoy官网](https://www.ventoy.net/) 下载适合你操作系统的版本。
2. **安装 Ventoy 到U盘**：
   - 插入U盘，运行 Ventoy 工具。
   - 选择你的U盘，点击“安装”按钮。**注意：这会格式化U盘，请提前备份数据。**
3. **分区U盘**：
   - Ventoy 会自动将U盘分成两个分区：
     - 第一个分区（Ventoy分区）：用于存放ISO文件和启动引导。
     - 第二个分区（数据分区）：用于存储普通文件。
   - 如果需要调整分区大小，可以使用磁盘管理工具（如Windows的“磁盘管理”或Linux的`GParted`）。
4. **添加ISO文件**：
   - 将操作系统的ISO文件复制到Ventoy分区。
5. **使用数据分区**：
   - 将第二个分区格式化为exFAT或NTFS（兼容Windows和Linux），用于存储普通文件。

优点：

- 简单易用，无需手动分区。
- 支持多系统启动。