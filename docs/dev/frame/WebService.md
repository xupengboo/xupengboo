---
title: Web Service
outline: deep
---

# Web Service

## 一、什么是 Web Service？

**Web Service** 是一种基于**开放标准**（HTTP、XML）的跨平台、跨语言的远程服务调用机制，允许不同操作系统、不同编程语言的系统通过网络互相调用对方的功能。

:::tip 类比理解
可以把 Web Service 理解为一份"网络上的合同"：服务提供方用 **WSDL** 写清楚"我能做什么、怎么调用"，调用方按照合同发送 **SOAP** 消息，双方都用 **XML** 说话，语言和平台不同也没关系。
:::

**典型应用场景：**

- 企业内部系统集成（ERP ↔ CRM ↔ OA）
- 跨公司、跨平台数据互通（银行、政府、医疗等对接）
- 遗留系统改造（老系统对外暴露 Web Service 接口）

---

## 二、核心协议

Web Service 体系由三个核心协议构成，常被称为 **"Web Service 三剑客"**：

| 协议 | 全称 | 作用 |
|---|---|---|
| **SOAP** | Simple Object Access Protocol | 定义消息格式和传输规范（**重点**） |
| **WSDL** | Web Services Description Language | 描述服务接口：有哪些方法、参数、返回值 |
| **UDDI** | Universal Description, Discovery and Integration | 服务注册与发现（实际项目中很少使用） |

### SOAP

SOAP 是基于 **XML** 的通信协议，可以运行在 HTTP、SMTP 等多种传输协议之上。一条 SOAP 消息由固定结构组成：

```
SOAP Message
├── Envelope（信封，根元素，必须）
│   ├── Header（头部，可选，用于认证、事务等元数据）
│   └── Body（主体，必须，包含实际请求/响应数据）
│       └── Fault（错误信息，仅在出错时出现）
```

**SOAP 请求报文示例（查询天气）：**

```xml
POST /WeatherService HTTP/1.1
Host: api.example.com
Content-Type: text/xml; charset=utf-8
SOAPAction: "getWeather"

<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope
  xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:tns="http://example.com/weather">

  <soap:Header>
    <!-- 可选：认证信息 -->
    <tns:Auth>
      <tns:Token>abc123token</tns:Token>
    </tns:Auth>
  </soap:Header>

  <soap:Body>
    <tns:getWeather>
      <tns:city>北京</tns:city>
    </tns:getWeather>
  </soap:Body>

</soap:Envelope>
```

**SOAP 响应报文示例：**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <getWeatherResponse>
      <city>北京</city>
      <temperature>25°C</temperature>
      <weather>晴</weather>
    </getWeatherResponse>
  </soap:Body>
</soap:Envelope>
```

### WSDL

WSDL 是 Web Service 的**接口描述文件**，用 XML 格式定义了服务的完整信息，相当于服务的"使用说明书"。

WSDL 文件的核心结构：

| 元素 | 说明 |
|---|---|
| `<types>` | 数据类型定义（基于 XML Schema） |
| `<message>` | 消息格式定义（请求/响应的参数） |
| `<portType>` | 操作接口定义（有哪些方法） |
| `<binding>` | 绑定协议（SOAP 绑定） |
| `<service>` | 服务地址（实际访问的 URL） |

:::tip
通常不需要手写 WSDL，框架（如 JAX-WS）会根据代码**自动生成**。访问 `http://服务地址?wsdl` 即可查看。
:::

### UDDI

UDDI 是一个集中式的服务注册中心，理论上可以在上面发布和发现 Web Service，类似"服务黄页"。但在实际项目中几乎不使用，了解概念即可。

---

## 三、SOAP vs RESTful API

现代项目中 RESTful API 已基本取代 SOAP，但老系统改造和政企对接场景仍大量使用 SOAP。

| 对比维度 | SOAP Web Service | RESTful API |
|---|---|---|
| **消息格式** | 只能用 XML | 通常用 JSON，也支持 XML 等 |
| **传输协议** | HTTP、SMTP 等多种 | 仅 HTTP/HTTPS |
| **接口描述** | WSDL（强制，自动生成） | OpenAPI/Swagger（可选） |
| **调用方式** | POST + XML 消息体 | GET/POST/PUT/DELETE |
| **错误处理** | SOAP Fault（标准化） | HTTP 状态码（约定俗成） |
| **安全标准** | WS-Security（企业级） | HTTPS + JWT/OAuth2 |
| **性能** | 较重（XML 体积大） | 较轻（JSON 更紧凑） |
| **学习成本** | 高 | 低 |
| **适用场景** | 金融、政府、医疗等企业级对接 | 现代 Web/移动端应用 |

---

## 四、Java 开发 Web Service（JAX-WS）

Java 官方提供 **JAX-WS**（Java API for XML Web Services）用于开发 SOAP Web Service，Spring Boot 集成后使用更加简便。

### 服务端实现

**1. 引入依赖（Spring Boot）：**

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web-services</artifactId>
</dependency>

<!-- 或使用 Apache CXF（企业项目更常用） -->
<dependency>
    <groupId>org.apache.cxf</groupId>
    <artifactId>cxf-spring-boot-starter-jaxws</artifactId>
    <version>3.5.5</version>
</dependency>
```

**2. 定义服务接口（`@WebService`）：**

```java
import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebService;

@WebService                         // 声明这是一个 Web Service
public interface WeatherService {

    @WebMethod                      // 声明这是一个可调用的方法
    String getWeather(@WebParam(name = "city") String city);
}
```

**3. 实现服务：**

```java
import javax.jws.WebService;
import org.springframework.stereotype.Component;

@Component
@WebService(serviceName = "WeatherService",    // 服务名
            endpointInterface = "com.example.WeatherService")
public class WeatherServiceImpl implements WeatherService {

    @Override
    public String getWeather(String city) {
        // 实际业务逻辑
        return city + "：晴，25°C";
    }
}
```

**4. 注册服务端点（Apache CXF 方式）：**

```java
import org.apache.cxf.jaxws.EndpointImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import javax.xml.ws.Endpoint;

@Configuration
public class WebServiceConfig {

    @Bean
    public Endpoint weatherEndpoint(WeatherServiceImpl weatherService) {
        EndpointImpl endpoint = new EndpointImpl(weatherService);
        endpoint.publish("/weather");   // 访问路径：/services/weather
        return endpoint;
    }
}
```

启动后访问 `http://localhost:8080/services/weather?wsdl` 即可查看自动生成的 WSDL 文件。

---

### 客户端调用

**方式一：根据 WSDL 自动生成客户端代码（推荐）**

```bash
# 使用 wsimport 工具（JDK 自带）生成客户端代码
wsimport -keep -verbose http://localhost:8080/services/weather?wsdl
```

生成代码后直接调用：

```java
WeatherService_Service service = new WeatherService_Service();
WeatherService port = service.getWeatherServiceImplPort();
String result = port.getWeather("北京");
System.out.println(result);  // 北京：晴，25°C
```

**方式二：Apache CXF JaxWsProxyFactoryBean（Spring 项目推荐）**

```java
import org.apache.cxf.jaxws.JaxWsProxyFactoryBean;

JaxWsProxyFactoryBean factory = new JaxWsProxyFactoryBean();
factory.setServiceClass(WeatherService.class);
factory.setAddress("http://localhost:8080/services/weather");

WeatherService client = (WeatherService) factory.create();
String result = client.getWeather("上海");
```

---

## 五、调试工具：SoapUI

**SoapUI** 是 Web Service 开发中最常用的测试工具，可以直接通过 WSDL 生成测试请求，无需写代码即可验证服务是否正常。

下载地址：https://www.soapui.org/downloads/soapui/

**基本使用流程：**

1. 新建项目 → 输入 WSDL 地址（如 `http://localhost:8080/services/weather?wsdl`）
2. SoapUI 自动解析 WSDL，生成所有接口的请求模板
3. 填入参数，点击发送，查看返回的 XML 响应
4. 测试通过后，将请求报文格式迁移到代码中实现

:::tip 工作流建议
开发 SOAP 接口时推荐的流程：

**服务端**：写代码 → 启动服务 → 用 SoapUI 验证 WSDL 和返回格式

**客户端**：先用 SoapUI 确认请求格式和响应结构 → 再用 `wsimport` 或 CXF 生成调用代码
:::
