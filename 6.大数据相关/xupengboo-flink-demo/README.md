# xupengboo-flink-demo

> demo案例，基于Flink实现的实时数据处理。

# 1. 前提条件
- Flink节点或集群 1.14.6 【也可以是其他版本，需要修改对应的 `pom.xml` 依赖。】
- Java 1.8
- Maven 3.x.x

# 2. 部署到Flink集群

```bash
# 编译打包
mvn clean package
# 上传到Flink集群
flink run -c com.xupengboo.flink.App xupengboo-flink-demo-1.0-SNAPSHOT.jar
```

# 3. 查看
Flink 提供了 Web UI，用于监控集群和作业状态。

访问 Flink Web UI
在浏览器中打开：
```bash
http://<JobManager_IP>:8082
```

可以看到：
- 集群资源使用情况（TaskManager 状态）。
- 当前运行的作业及其状态。
- 作业的详细信息（任务分布、执行时间、吞吐量）。

