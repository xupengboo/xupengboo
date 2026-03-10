---
title: Flowable 工作流引擎
outline: deep
---

# Flowable 工作流引擎

## 一、工作流基础

### 什么是工作流

工作流是对业务流程的抽象与建模，通过引擎驱动流程按照预定的规则自动流转。专门的工作流框架（如 **Camunda**、**Activiti**、**Flowable**）提供了设计、执行和监控工作流的完整能力，可与 Spring Boot 等技术无缝集成。

### 工作流的三种分类

| 类型 | 特点 | 适用场景 |
|---|---|---|
| **内存工作流** | 无需持久化，无状态，调用完即结束 | 用户询价、查看商品详情等只读业务 |
| **状态机工作流** | 持久化每个节点状态，支持自动重试 | 支付回调、开通权益等需要补偿的业务 |
| **人工工作流** | 在状态机基础上增加外部人工触发节点 | 审批流、多级签核等人工参与的业务 |

:::tip 选型建议
- 只读、无副作用 → **内存工作流**
- 需要失败重试/补偿 → **状态机工作流**
- 需要人工审批节点 → **人工工作流**（Flowable 主要解决这类场景）
  :::

### 工作流的价值

> 工作流用的好，业务可维护、业务可视化，对后来者学习和维护的成本都很低。流程清晰了，异常分支的考虑、错误节点的重试、异常节点告警、超时配置，系统就具备很强的鲁棒性。

---

## 二、Flowable 介绍

### 核心特性

**Flowable** 由 Activiti 项目分支演变而来，是一个用 Java 编写的**轻量级、开源 BPM（业务流程管理）引擎**。

- 基于 **BPMN 2.0** 国际标准，非技术人员也能参与流程设计
- 以 **JAR 包**形式嵌入，支持 Java SE、Tomcat、Spring Boot、JBoss 等所有 Java 环境
- 内置流程设计器（Flowable Modeler / Flowable UI）

:::warning 版本要求
**Flowable 7.x** 基于 **JDK 17**，集成 Spring Boot 时需要 **Spring Boot 3.x** 及以上版本。

如果项目是 Spring Boot 2.x，请使用 Flowable **6.x** 版本。
:::

| 资源 | 链接 |
|---|---|
| 官方文档 | https://www.flowable.com/open-source/docs/oss-introduction |
| 中文文档 | https://tkjohn.github.io/flowable-userguide/ |
| 英文文档 | https://www.flowable.org/docs/userguide/index.html |

### BPMN 2.0 协议

**BPMN 2.0**（Business Process Model and Notation 2.0，业务流程模型和符号）是业务流程建模的国际标准，定义了一套图形化符号体系。

理解 BPMN 2.0 的核心元素是使用 Flowable 的前提：

| 元素类型 | 常见元素 | 说明 |
|---|---|---|
| **事件（Event）** | 开始事件、结束事件、中间事件 | 触发流程的起点、流程的终点、流程中的信号 |
| **任务（Task）** | 用户任务、服务任务、脚本任务 | 流程中具体的工作单元 |
| **网关（Gateway）** | 排他网关、并行网关、包容网关 | 控制流程走向的分支与汇聚节点 |
| **连线（Flow）** | 顺序流、消息流 | 连接各节点，定义流转方向和条件 |
| **泳道（Lane）** | 池、道 | 区分不同参与者/部门的责任边界 |

**常用网关对比：**

| 网关类型 | 符号特征 | 行为 |
|---|---|---|
| 排他网关（XOR） | 菱形 + X | 只走满足条件的**一条**分支 |
| 并行网关（AND） | 菱形 + + | **所有**分支同时执行，全部完成后汇聚 |
| 包容网关（OR） | 菱形 + O | 走满足条件的**一条或多条**分支 |

---

## 三、后端搭建（Spring Boot + MySQL）

### 1. 添加依赖

::: code-group

```xml [Flowable 6.x（Spring Boot 2）]
<!-- Flowable 核心依赖 -->
<dependency>
    <groupId>org.flowable</groupId>
    <artifactId>flowable-spring-boot-starter-process</artifactId>
    <version>6.7.1</version>
</dependency>

<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.29</version>
</dependency>

<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```

```xml [Flowable 7.x（Spring Boot 3）]
<!-- Flowable 7 需要 Spring Boot 3 + JDK 17 -->
<dependency>
    <groupId>org.flowable</groupId>
    <artifactId>flowable-spring-boot-starter-process</artifactId>
    <version>7.0.0</version>
</dependency>

<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <version>8.0.33</version>
</dependency>

<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```

:::

### 2. 配置文件

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/flowable_demo?useSSL=false&characterEncoding=UTF-8&serverTimezone=UTC
    username: root
    password: your_password   # 生产环境请使用环境变量或配置中心管理密码
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update        # 开发环境可用 update，生产环境建议 validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect

flowable:
  # true：启动时自动检测并创建/更新 Flowable 所需的数据库表
  # 生产环境建议设为 false，改用 Liquibase/Flyway 管理
  database-schema-update: true
  database-type: mysql
```

:::warning 安全提示
- 数据库密码**不要硬编码**在配置文件中，推荐使用 Spring 的 `${DB_PASSWORD}` 引用环境变量
- `ddl-auto: update` 和 `database-schema-update: true` 在**生产环境**中需谨慎，自动更新表结构可能影响现有数据
  :::

### 3. 手动初始化数据库表（可选）

通常配置 `database-schema-update: true` 后启动应用会自动建表。如需手动初始化：

```java
import org.flowable.engine.ProcessEngine;
import org.flowable.engine.ProcessEngineConfiguration;
import org.flowable.engine.impl.cfg.StandaloneProcessEngineConfiguration;

// 手动创建 ProcessEngine，Flowable 会自动在数据库中建表
ProcessEngineConfiguration cfg = new StandaloneProcessEngineConfiguration()
    .setJdbcUrl("jdbc:mysql://localhost:3306/flowable_demo?useUnicode=true&characterEncoding=utf8&serverTimezone=GMT%2b8&nullCatalogMeansCurrent=true")
    .setJdbcUsername("root")
    .setJdbcPassword("your_password")
    .setJdbcDriver("com.mysql.cj.jdbc.Driver")   // MySQL 8+ 使用 cj 驱动
    .setDatabaseSchemaUpdate(ProcessEngineConfiguration.DB_SCHEMA_UPDATE_TRUE);

ProcessEngine processEngine = cfg.buildProcessEngine();
```

---

## 四、Flowable Modeler 设计器搭建（前端）

### 方式一：Spring Boot 内嵌（Flowable 6.x）

**1. 依赖**

```xml
<properties>
    <flowable.version>6.7.1</flowable.version>
</properties>

<!-- Flowable 全家桶 starter -->
<dependency>
    <groupId>org.flowable</groupId>
    <artifactId>flowable-spring-boot-starter</artifactId>
    <version>${flowable.version}</version>
</dependency>

<!-- IDM：身份认证模块（提供登录） -->
<dependency>
    <groupId>org.flowable</groupId>
    <artifactId>flowable-spring-boot-starter-ui-idm</artifactId>
    <version>${flowable.version}</version>
</dependency>

<!-- Modeler：流程图设计器 -->
<dependency>
    <groupId>org.flowable</groupId>
    <artifactId>flowable-spring-boot-starter-ui-modeler</artifactId>
    <version>${flowable.version}</version>
</dependency>

<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.29</version>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

**2. 配置**

```yaml
server:
  port: 8888

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/flowable_demo?useUnicode=true&characterEncoding=UTF-8&serverTimezone=UTC
    username: root
    password: your_password
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    properties:
      hibernate:
        hbm2ddl:
          auto: update
        dialect: org.hibernate.dialect.MySQL5InnoDBDialect
    open-in-view: true

flowable:
  idm:
    app:
      admin:
        user-id: admin        # 设计器登录账号
        password: admin       # 设计器登录密码
        first-name: Admin
        last-name: User
```

**3. 启动后访问**

```
http://localhost:8888/
```

### 方式二：Docker 部署 Flowable UI（推荐）

```bash
docker run -d \
  --name flowable-ui \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_URL="jdbc:mysql://host:3306/flowable?useSSL=false&characterEncoding=UTF-8" \
  -e SPRING_DATASOURCE_USERNAME=root \
  -e SPRING_DATASOURCE_PASSWORD=your_password \
  flowable/flowable-ui
```

访问 `http://localhost:8080/flowable-ui`，默认账号密码均为 `admin`。

:::tip
Docker 方式无需修改项目代码，设计器与后端服务**完全解耦**，适合团队协作使用。
:::

---

## 五、数据库表结构详解

Flowable 启动后会在数据库中自动创建约 **50+ 张表**，按前缀分为以下几组：

### `ACT_GE_*` 通用表

| 表名 | 说明 |
|---|---|
| `ACT_GE_PROPERTY` | 存储引擎全局属性，如版本信息 |
| `ACT_GE_BYTEARRAY` | 存储二进制数据：BPMN XML 文件、流程图图片、变量等 |

### `ACT_RE_*` 流程定义表（Repository）

| 表名 | 说明 |
|---|---|
| `ACT_RE_DEPLOYMENT` | 部署记录：部署时间、名称，一次部署可包含多个流程定义 |
| `ACT_RE_PROCDEF` | 流程定义元数据：标识、名称、版本号 |
| `ACT_RE_MODEL` | Flowable Modeler 中创建的流程模型（未部署的草稿） |

### `ACT_RU_*` 运行时表（Runtime）

> 流程运行期间产生的数据，**流程结束后自动清除**。

**流程实例相关：**

| 表名 | 说明 |
|---|---|
| `ACT_RU_EXECUTION` | 正在执行的流程实例和执行路径 |
| `ACT_RU_VARIABLE` | 运行时流程变量（字符串、数值、二进制对象等） |
| `ACT_RU_IDENTITYLINK` | 流程实例/任务的参与者信息（候选人、负责人等） |
| `ACT_RU_EVENT_SUBSCR` | 事件订阅信息（等待外部事件触发） |

**任务相关：**

| 表名 | 说明 |
|---|---|
| `ACT_RU_TASK` | 当前待处理的用户任务 |

**Job 相关：**

| 表名 | 说明 |
|---|---|
| `ACT_RU_JOB` | 等待/延迟执行的作业（异步任务、定时器） |
| `ACT_RU_TIMER_JOB` | 定时器任务，到达触发时间后执行 |
| `ACT_RU_DEADLETTER_JOB` | 执行失败、无法重试的死信任务，需人工处理 |
| `ACT_RU_SUSPENDED_JOB` | 被挂起的作业 |

### `ACT_HI_*` 历史表（History）

> 记录已完成的流程数据，**永久保留**（除非手动清理）。

| 表名 | 说明 |
|---|---|
| `ACT_HI_PROCINST` | 已完成流程实例：开始/结束时间、持续时长 |
| `ACT_HI_ACTINST` | 流程中每个活动节点的执行历史 |
| `ACT_HI_TASKINST` | 已完成任务的历史：开始/结束时间、分配用户 |
| `ACT_HI_VARINST` | 流程变量的历史快照 |
| `ACT_HI_IDENTITYLINK` | 任务/流程实例参与者的历史记录 |
| `ACT_HI_DETAIL` | 变量变化的详细历史记录 |
| `ACT_HI_COMMENT` | 流程/任务的历史评论 |
| `ACT_HI_ATTACHMENT` | 流程/任务的历史附件 |

### 其他表

| 表名 | 说明 |
|---|---|
| `ACT_EVT_LOG` | 引擎事件日志 |
| `ACT_PROCDEF_INFO` | 流程定义的额外元数据 |

:::tip 表前缀速记
| 前缀 | 含义 | 生命周期 |
|---|---|---|
| `GE` | General 通用 | 持久 |
| `RE` | Repository 定义 | 持久 |
| `RU` | Runtime 运行时 | 流程结束后删除 |
| `HI` | History 历史 | 永久保留 |
:::

---

## 六、SpringBoot 3 + Flowable 7 完整示例

> 参考：https://blog.csdn.net/qq_41892775/article/details/141108020

### 环境要求

| 组件 | 版本要求 |
|---|---|
| JDK | **17+** |
| Spring Boot | **3.x** |
| Flowable | **7.x** |
| MySQL | 8.x |

### 核心 API 速查

Flowable 的服务层由多个 Service 组成，注入后即可使用：

| Service | 职责 |
|---|---|
| `RepositoryService` | 管理流程定义：部署、查询、挂起/激活 |
| `RuntimeService` | 管理流程实例：启动、查询、删除、设置变量 |
| `TaskService` | 管理用户任务：查询、认领、完成、委派 |
| `HistoryService` | 查询历史数据：已完成的实例、任务、变量 |
| `ManagementService` | 管理引擎内部：Job 管理、表数据查询 |
| `IdentityService` | 管理用户和组 |

### 典型流程示例

以**请假审批流**为例，展示完整的流程生命周期：

**1. 部署流程定义**

```java
@Autowired
private RepositoryService repositoryService;

public void deployProcess() {
    repositoryService.createDeployment()
        .name("请假审批流程")
        .addClasspathResource("processes/leave-approval.bpmn20.xml")
        .deploy();
    System.out.println("流程部署成功");
}
```

**2. 启动流程实例**

```java
@Autowired
private RuntimeService runtimeService;

public void startProcess(String applicant, int days) {
    Map<String, Object> variables = new HashMap<>();
    variables.put("applicant", applicant);   // 申请人
    variables.put("days", days);             // 请假天数

    ProcessInstance instance = runtimeService
        .startProcessInstanceByKey("leaveApproval", variables);

    System.out.println("流程启动，实例ID：" + instance.getId());
}
```

**3. 查询并完成用户任务**

```java
@Autowired
private TaskService taskService;

// 查询指定用户的待办任务
public List<Task> queryTasks(String assignee) {
    return taskService.createTaskQuery()
        .taskAssignee(assignee)
        .orderByTaskCreateTime().desc()
        .list();
}

// 审批通过
public void approveTask(String taskId, boolean approved) {
    Map<String, Object> variables = new HashMap<>();
    variables.put("approved", approved);
    taskService.complete(taskId, variables);
    System.out.println("任务完成，taskId：" + taskId);
}
```

**4. 查询历史记录**

```java
@Autowired
private HistoryService historyService;

public void queryHistory(String processInstanceId) {
    HistoricProcessInstance history = historyService
        .createHistoricProcessInstanceQuery()
        .processInstanceId(processInstanceId)
        .singleResult();

    System.out.println("开始时间：" + history.getStartTime());
    System.out.println("结束时间：" + history.getEndTime());
    System.out.println("持续时长：" + history.getDurationInMillis() + "ms");
}
```

### BPMN 流程文件示例

将以下文件放入 `src/main/resources/processes/` 目录：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
             xmlns:flowable="http://flowable.org/bpmn"
             targetNamespace="http://flowable.org/bpmn">

  <process id="leaveApproval" name="请假审批流程" isExecutable="true">

    <!-- 开始事件 -->
    <startEvent id="start" name="开始"/>

    <!-- 申请人提交申请（用户任务） -->
    <userTask id="submitTask" name="提交申请"
              flowable:assignee="${applicant}"/>

    <!-- 经理审批（用户任务） -->
    <userTask id="approveTask" name="经理审批"
              flowable:assignee="manager"/>

    <!-- 排他网关：判断是否审批通过 -->
    <exclusiveGateway id="approveGateway" name="审批结果"/>

    <!-- 结束事件（审批通过） -->
    <endEvent id="endApproved" name="审批通过"/>

    <!-- 结束事件（审批拒绝） -->
    <endEvent id="endRejected" name="审批拒绝"/>

    <!-- 连线 -->
    <sequenceFlow sourceRef="start"          targetRef="submitTask"/>
    <sequenceFlow sourceRef="submitTask"     targetRef="approveTask"/>
    <sequenceFlow sourceRef="approveTask"    targetRef="approveGateway"/>
    <sequenceFlow sourceRef="approveGateway" targetRef="endApproved"
                  name="通过">
      <conditionExpression>${approved == true}</conditionExpression>
    </sequenceFlow>
    <sequenceFlow sourceRef="approveGateway" targetRef="endRejected"
                  name="拒绝">
      <conditionExpression>${approved == false}</conditionExpression>
    </sequenceFlow>

  </process>
</definitions>
```
