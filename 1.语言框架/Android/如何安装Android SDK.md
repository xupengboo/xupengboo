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

# 2. **下载 Android Studio 或仅下载 SDK**



## 选项 1：通过 Android Studio 安装（推荐）

Android Studio 是官方的 IDE，包含了 Android SDK、Android 模拟器以及其他开发工具。

- [下载 Android Studio](https://developer.android.com/studio)

安装 Android Studio 后，它会自动引导你下载和配置 Android SDK。



## 选项 2：仅下载 Android SDK（命令行工具）

如果你不需要完整的 Android Studio IDE，而只需要 Android SDK，可以下载命令行工具：

- [下载 Android SDK 命令行工具](https://developer.android.com/studio#downloads)

下载后，解压文件，并将解压路径添加到系统的 `PATH` 环境变量中。



# 3. 环境变量配置

**Windows配置：**

右键点击 “此电脑”，选择 “属性” -> “高级系统设置” -> “环境变量”。在系统变量中添加：

- `ANDROID_HOME`，值为你的 Android SDK 安装路径。
- 编辑 `PATH`，添加 `;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools`。



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