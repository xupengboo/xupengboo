---
title: Maven 基本使用
order: 1
icon: simple-icons:apachemaven
---

## 1. Maven 依赖的存放位置

Maven 下载的依赖会默认存放在本地仓库（Local Repository），本地仓库的默认路径为：

- **Windows**: `C:\Users\你的用户名\.m2\repository`
- **Linux/macOS**: `~/.m2/repository`

这个路径可以在 `settings.xml` 中修改，例如：

```xml
<settings>
    <localRepository>D:/maven-repo</localRepository>
</settings>
```

## 2. Maven 使用哪个 `settings.xml`？

Maven 启动时会查找 `settings.xml` 配置文件，查找顺序如下：

1. 用户级 `settings.xml`

   （优先级更高）：

   - 默认路径：`~/.m2/settings.xml`（Windows 为 `C:\Users\你的用户名\.m2\settings.xml`）

2. 全局 `settings.xml`

   （优先级较低）：

   - Maven 安装目录的 

     ```
     conf/settings.xml
     ```

     ，通常位于：

     - Windows: `C:\Program Files\Apache Software Foundation\apache-maven-xxx\conf\settings.xml`
     - Linux/macOS: `/usr/share/maven/conf/settings.xml` 或 `/etc/maven/settings.xml`

如果用户级 `settings.xml` 存在，它会覆盖全局 `settings.xml` 的配置。

如果你有多个 `settings.xml`，可以通过 **命令行参数** 指定要使用的 `settings.xml` 文件：

```sh
mvn clean install --settings /path/to/custom-settings.xml
```