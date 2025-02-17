---
title: Kibana 可视化管理平台
order: 3
---

## 1. 索引模板

索引模板，可以让一些其他组件，例如：Logstash ，根据这个匹配规则匹配对应模板，根据这个模板来创建索引。

![image-20250217183913813](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250217183913813.png)

## 2. 索引声明周期策略

可以声明索引生命周期策略，去**定期管理日志**（一般进行删除），也可以通过索引管理手动删除。

![image-20250217184145601](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250217184145601.png)


## 3. 索引模式
声明索引模式，并且设置默认值：

![image-20250217183508888](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250217183508888.png)

索引模式，配置后可以在`discover` 中继续宁查看。

![image-20250217183707421](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250217183707421.png)

