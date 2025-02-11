---
title: WebService 学习应用
order: 3
icon: hugeicons:tools
---

# WebService 学习

## 1. Web Service 基础知识

- **什么是 Web Service**：Web Service 提供了一个跨平台、跨语言的标准化接口，通常基于 HTTP 协议，允许通过网络将信息和服务开放给其他系统调用。
- **架构**：主要是基于服务的架构（SOA），通过面向服务的方式实现业务功能的模块化。
- **应用场景**：通常用于不同平台和语言的系统间通信、系统集成，如企业 ERP 系统与 CRM 系统数据互通等。



## 2. Web Service 核心协议

Web Service 的核心协议主要包括 **SOAP**、WSDL 和 UDDI：

- **SOAP（Simple Object Access Protocol，重点）**：基于 XML 的通信协议，定义了在 HTTP、SMTP 等协议上传输消息的格式。SOAP 支持远程调用，是一种与语言无关的通信方式。
- WSDL（Web Services Description Language）：基于 XML 的描述语言，用于定义 Web 服务的接口，包括服务的位置、调用方法和返回格式。WSDL 是 Web 服务的接口描述文件。
- UDDI（Universal Description, Discovery and Integration）：一个基于 XML 的标准注册机制，允许服务的查找、注册和信息存储。UDDI 是 Web 服务的一个可选部分，较少使用。



## 3. Web Service 开发

常见的 Web Service 开发框架包括：

- **Java**：可以使用 JAX-WS（Java API for XML Web Services）开发 SOAP Web 服务，使用 JAX-RS 开发 RESTful Web 服务。



## 4. 传统 Web Service 技术（如 SOAP）和 RESTful API 的主要区别

- **SOAP Web Service**：使用 XML 格式传递消息，通过 WSDL 描述服务和接口，适合于复杂的跨平台集成。
- **RESTful Web Service**：使用 HTTP 方法和 JSON 格式传递数据，架构更简单，更适合前后端分离的现代 Web 应用。



## 5. SOAP Web Service 

SoapUI工具：https://www.soapui.org/downloads/soapui/

通过SoapUI，构建对应得WSDL文件请求，测试即可，测试成功整体过程迁移到代码上面，结果格式替换调试。

