---
title: 计算机 网络交互
order: 1
icon: iconoir:network
---

## 1. 基于 物理层、数据链路层、网络层 解释如何两个电脑节点如何通信。

> 推荐观看： https://www.douyin.com/user/self?from_tab_name=main&modal_id=7453855860079578395&showTab=like
>
> ![image-20250105150620589](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250105150620589.png)

理解一下几个内容：

电脑视角：

![514405e49244024989378c37988a20e](D:\其他\wx\WeChat Files\wxid_4qmmityl5mdr22\FileStorage\Temp\514405e49244024989378c37988a20e.jpg)

1. **集线器**：物理层

   

2. **交换机**：数据链路层

- Mac地址表：用于映射 Mac地址 和 交换机的端口。

![6477ac35810b2e9486a6c2f03db006a](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/6477ac35810b2e9486a6c2f03db006a.jpg)

![e44df3c062f3248622d341b57eab051](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/e44df3c062f3248622d341b57eab051.jpg)



3. **路由器**：网络层

- 路由表：用于映射 IP地址 和 路由器的端口。

![873f8773ee0a9a0f2332fbe5e6ad5ef](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/873f8773ee0a9a0f2332fbe5e6ad5ef.jpg)

![afe7c93a207f008ad94ec7ac3a791f4](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/afe7c93a207f008ad94ec7ac3a791f4.jpg)



**子网掩码**：通过 `IP` 与 `子网掩码` 进行 `与 &` 操作，判断是否在同一个子网中。

**ARP缓存表**：电脑和路由器中，都有ARP缓存表，用于缓存IP和Mac的映射关系。

![294dd9638496d55023205c4d62125d7](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/294dd9638496d55023205c4d62125d7.jpg)



## 2. 如何建立可靠的通信

> 推荐观看：https://www.douyin.com/user/self?from_tab_name=main&modal_id=7455655299286830363&showTab=like
