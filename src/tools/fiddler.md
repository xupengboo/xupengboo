---
title: Fiddler 抓包工具
order: 2
icon: hugeicons:tools
---

# Fiddler 使用

Fiddler 是一款强大的网络抓包工具，主要用于 HTTP/HTTPS 协议的调试。

## 1. 下载Fiddler

官方下载：https://www.telerik.com/download/fiddler

注意点：

1. fiddler 只能抓取 Http 和 Https 协议。

## 2. 配置Fiddler抓取Https协议

默认fiddler是不开启https协议的，需要配置一下，打开捕获Https协议：

1. 进入 Tools 里面的 Options。

 ![image-20241124152859162](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241124152859162.png)

2. 勾选 捕获HTTPS连接 。

![image-20241124153019820](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241124153019820.png)

## 3. Fiddler 工具使用（PC端）

### 1. 基础操作

1. 左下角 `Capturing` 代表，正在抓包。

![image-20241124153626350](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241124153626350.png)



2. 左下角 还有个 `All Processes` 捕获哪些流量包。

- `All Processes`：捕获所有进程的包（一般就是这台电脑所有的包）。
- `Web Browsers`：捕获网页浏览器的包。
- `Non-Browser`：捕获非浏览器的包。
- `Hide All`：隐藏所有。

![image-20241124154101630](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241124154101630.png)

3. 如何移除包。

- `Remove All`：全部移除。 **`Ctrl + X` 快捷键，全部清除**。 
-  `Images`：移除图片。
- `CONNECTS`：移除请求连接。
- `Non-200s`：移除请求状态不是200的所有连接。
- `Non-Browser`：移除非浏览器的连接。



![image-20241124163111155](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241124163111155.png)

4. 可以根据 图标 ，判断这是一个什么请求。

![image-20241128090931011](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241128090931011.png)

### 2. 抓包过程

#### 2.1 如何抓取当前操作的包？

只抓取当前操作步骤的包，可能会抓到多个包。步骤很简单：

1. 打开抓包，例如：抓取浏览器的包，左下角就要选择 `Web Browsers` 。
2. 通过 `X` 清除包。 **`Ctrl + X` 快捷键，全部清除**。 
3. 操作一下，要抓取的事件。（例如：抓取某个按钮的点击后，发送的请求事件。）
4. 抓取后，点击下面的 `Capturing` ，关闭 捕获状态。
5. 查看抓取到了多少个包（左下角能看到），分析即可。



#### 2.2 如何从一大堆包中，抓取到想要的包？

通过移除包，拿到自己想要得包：

- 例如：移除图片、Non-200s、Non-Browser等等情况的。

![image-20241124163111155](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241124163111155.png)



## 4. 移动端抓包

Fiddler抓取移动端包的原理：做fiddler代理，代理联网。

原本：客户端（电脑、手机等） =》 互联网（直接联网） =》服务器。

![image-20241128090434940](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241128090434940.png)

代理抓包：**客户端（电脑、手机等）=》fiddler代理（代理联网）=》互联网 =》 服务器**。 

![image-20241128090426035](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241128090426035.png)

具体步骤：

1. **确保手机和电脑需要在同一个局域网**，可以才采取以下几种情况，保证手机和电脑都在同一个局域网：

- 手机和电脑连接同一个 WIFI 就行。
- 电脑通过网线连接到无线路由，手机连接这个无线路由的WIFI。
- 电脑开一个热点，手机连接这个热点。

2. **配置fiddler代理配置**。

第一步：点击 Tools =》 options，找到 Connections 。

- 能够选的全都勾选上，点击 OK ，代理配置完成。

![image-20241125132452389](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241125132452389.png)

第二步：`cmd` 输入 `ipconfig` 查看电脑的IP地址。这样 `IP:端口(8888) ` 就可以访问fiddler的代理地址了。

![image-20241125132900921](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241125132900921.png)

![image-20241125133141936](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241125133141936.png)

第三步：配置手机的代理配置。

1. 打开手机的设置，找到WIFI。
2. 在你当前连接的 WIFI 里面找到高级设置。

![image-20241127182836466](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241127182836466.png)

3. 在高级里面找到代理，选择 手动 ，配置主机名、端口即可。

- 主机名：对应电脑的 IP地址。
- 端口：对应电脑fiddler 暴露的端口。

![image-20241127184301830](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241127184301830.png)

4. 重新连接 WIFI。

5. 使用手机浏览器访问 `http://主机IP:端口`，就可以下载证书。

- 在浏览器上，点击 `download the FiddlerRoot certificate` ，下载证书。

- 下载证书之后，点击证书，进行安装即可。（不同手机可能会有不同限制）

![image-20241127185257549](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241127185257549.png)

6. 安装成功后，移动端代理抓包就配置完成了。这时候访问百度，就不会提示证书不安全了。
