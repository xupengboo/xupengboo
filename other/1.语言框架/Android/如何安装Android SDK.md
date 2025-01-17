# 安装 Android SDK

> Android SDK安装流程。

# 1. **安装 Java Development Kit (JDK)**

Android SDK 需要 Java 环境。首先确保你已经安装了 JDK，并且配置好了 `JAVA_HOME` 环境变量。

- [JDK 下载地址](https://www.oracle.com/java/technologies/javase-downloads.html)

安装完毕后，检查 JDK 是否成功安装：

```shell
# 查看Java版本
java -version
```

> Tips：有版本要求的，确定好下载的JDK和Android的版本是否对应，一般java大多数都是8版本。



# 2. SDK的 三个工具集

## 2.1 **Android SDK Tools（Command-line Tools） **命令行工具

- **作用**：Android SDK Tools 是 Android 开发的基础工具集，包含了一些基本的开发和管理工具，帮助开发者进行项目的构建、调试、以及设备管理等。
- 主要功能：
  - **`avdmanager`**：用于管理 Android 虚拟设备（AVD），创建、删除和列出模拟器。
  - **`sdkmanager`**：用于安装和管理 Android SDK 组件，如 SDK 平台、构建工具、系统镜像等。
  - **`lint`**：静态代码分析工具，用于检查项目中的代码质量问题。
- **命令行版本**：可以通过终端（命令提示符）来使用这些工具，适合无需 GUI（如 Android Studio）时的开发操作。
- **位置**：在 Android SDK 目录下的 `cmdline-tools/latest/bin` 目录中。

## 2.2 **Build Tools**

- **作用**：**Build Tools 是专门为 Android 应用的构建和打包提供的工具集**。它包含了一些独立于 Android Studio 的构建工具，用于编译代码、生成 APK、以及进行应用签名。
- 主要功能：
  - **`aapt`（Android Asset Packaging Tool）**：用于处理资源文件，将资源打包进 APK。
  - **`aidl`（Android Interface Definition Language）**：处理 AIDL 文件，用于在不同进程之间进行通信。
  - **`zipalign`**：优化 APK 中的资源文件，以提高应用运行时的性能。
  - **`dx` 和 `d8`**：将 Java 字节码转换为 Android 的 Dalvik 或 ART 可执行文件格式（.dex）。
  - **`apksigner`**：为 APK 文件进行签名，以便可以在 Android 设备上安装。
- **位置**：在 Android SDK 目录的 `build-tools/<version>` 中，多个版本可以共存。

## 2.3 Platform Tools 

- **作用**：Platform Tools 是与 Android 平台相关的一组工具，主要用于设备管理、调试和系统层面的操作。
- 主要工具：
  - **`adb`（Android Debug Bridge）**：用于调试 Android 设备或模拟器，可以执行设备连接、传输文件、安装 APK、捕获日志等操作。
  - **`fastboot`**：允许在设备启动加载器模式下（bootloader）直接操作设备，常用于解锁 bootloader、刷入系统镜像、恢复模式等。
  - **`systrace`**：分析 Android 系统性能的工具，用于追踪和记录系统中的各种性能指标。
- **位置**：位于 Android SDK 目录下的 `platform-tools` 目录中。

## 2.4 三个工作集 与 JDK版本的问题

Android SDK Tools（command-line tools）：

- Android SDK Tools 26.1.1 及以下：这些版本的 SDK Tools 完全兼容 Java 8。
- SDK Tools 25.x 和 24.x：这些较老版本也是兼容 Java 8 的，但你可能需要从 SDK Archive 页面手动下载。

Build Tools：

- Android SDK Build Tools 30.0.2 及以下：这些版本的构建工具是兼容 Java 8 的。随着 SDK 工具的更新，较新版本可能会要求更高版本的 JDK。

 Platform Tools：

- `platform-tools`（如 `adb` 和 `fastboot`）通常不受 JDK 版本影响，任何版本的 `platform-tools` 应该都能与 Java 8 一起工作。



# 3. **下载 Android Studio 或仅下载 SDK**

## 3.1 通过 Android Studio 安装（推荐）

Android Studio 是官方的 IDE，包含了 Android SDK、Android 模拟器以及其他开发工具。

- [下载 Android Studio](https://developer.android.com/studio)

安装 Android Studio 后，它会自动引导你下载和配置 Android SDK。

可以通过 进入 Settings 找到 Android SDK 安装和配置相关的SDK相关：SDK Platforms、SDK Tools等。

> Tips：可以修改版本，因为有时候会有版本对应问题。

![image-20240905105514924](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240905105514924.png)



## 3.2 仅下载 Android SDK（命令行工具）

如果你不需要完整的 Android Studio IDE，而只需要 Android SDK，可以下载命令行工具：

- [下载 Android SDK 命令行工具](https://developer.android.com/studio#downloads)

下载后，解压文件，并将解压路径添加到系统的 `PATH` 环境变量中。



# 3. 环境变量配置

**Windows配置：**

右键点击 “此电脑”，选择 “属性” -> “高级系统设置” -> “环境变量”。在系统变量中添加：

- **`ANDROID_HOME`，值为你的 Android SDK 安装路径**。
- **编辑 `PATH`**。

```shell
# PATH添加以下内容：
# win11 or win10
%ANDROID_HOME%\tools
%ANDROID_HOME%\platform-tools
# win7
;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools

# 注意：部分android版本，sdk目录结构不同，所以此处配置也可能不同，具体看官方。
```



# 4. **使用 SDK Manager 安装工具**

如果你安装了 Android Studio 或下载了命令行工具，使用以下命令来管理 SDK 组件：

```shell
sdkmanager --list           # 列出所有可用的 SDK 组件
sdkmanager "platform-tools" # 安装 platform-tools
sdkmanager "build-tools;30.0.3" # 安装指定版本的构建工具
```



# 5. **验证安装**

你可以通过以下命令来检查 Android SDK 是否安装正确：

```shell
# 查看版本
adb --version
```

如果正确安装，你将看到 `adb` 工具的版本信息。