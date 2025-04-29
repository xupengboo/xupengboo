---
title: Flume 工具
date: 2025-04-07 10:00:00
icon: mdi:tools
tags:
- 大数据
- Flume
categories:
- 大数据
order: 2
---

:::info

Apache Flume 是一个分布式、高可靠、高可用的系统，主要用于高效地收集、聚合和传输海量日志数据。它特别适合处理从多个数据源（如日志文件、社交媒体、传感器等）实时生成的数据流，并将这些数据**可靠地传输**到集中式存储（如 HDFS、HBase）或处理系统（如 Kafka、Spark）。

:::

以 `Flume`将数据从`Kafka`取出来，放到`HDFS`中，为例：（离线数仓采用分区表按天统计，目标路径包含一层日期）

![image-20250429171040988](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250429171040988.png)

## 1. 大体过程

`KafkaSource`、`FileChannel`、`HDFSSink`的组件配置：

```Plain Text
KafkaSource (从Kafka拉取数据)  
       ↓  
   FileChannel (数据暂存到磁盘)  
       ↓  
   HDFSSink (最终写入HDFS)
```

## 2. Flume 拦截器配置

:::info

除了Flume的安装，再个就是 拦截器 的配置，很重要：

拦截器应该实现2个功能：

+ 判断JSON格式的数据是否有效
+ 解决零点漂移问题（修改header中时间戳，与业务数据保持一致）：

零点漂移问题：就是由于中间经过多个组件原本日志文件的时间戳与Kafka Source的 header 时间戳不同，进而导致 HDFS 存储时出现偏移的问题。最后， 通过Flume拦截器解决该问题。

:::

1. Flume 拦截器，通过一个 Jar 包进行驱动：

```xml
<dependency>
    <groupId>org.apache.flume</groupId>
    <artifactId>flume-ng-core</artifactId>
    <version>1.10.1</version>
    <scope>provided</scope>
</dependency>

<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>1.2.62</version>
</dependency>
```

```java
package com.xupengboo.gmall.flume.interceptor;

/**
 * @Author xupengboo
 * @Date 2025/4/22 14:41
 * @Describe
 */
import com.alibaba.fastjson.JSONObject;
import org.apache.flume.Context;
import org.apache.flume.Event;
import org.apache.flume.interceptor.Interceptor;
import java.nio.charset.StandardCharsets;
import java.util.Iterator;

import java.util.List;
import java.util.Map;

public class TimestampInterceptor implements Interceptor {

    @Override
    public void initialize() {

    }

    @Override
    public Event intercept(Event event) {
        //1、获取header和body的数据
        Map<String, String> headers = event.getHeaders();
        String log = new String(event.getBody(), StandardCharsets.UTF_8);

        try {
            //2、将body的数据类型转成jsonObject类型（方便获取数据）
            JSONObject jsonObject = JSONObject.parseObject(log);

            //3、header中timestamp时间字段替换成日志生成的时间戳（解决数据漂移问题）
            String ts = jsonObject.getString("ts");
            headers.put("timestamp", ts);

            return event;
        } catch (Exception e) {
            e.printStackTrace();

            // 非JSON格式的会返回Null，下面再对Null进行 remove()调用。
            return null;
        }
    }

    // 将Null数据过滤掉。
    @Override
    public List<Event> intercept(List<Event> list) {
        Iterator<Event> iterator = list.iterator();
        while (iterator.hasNext()) {
            Event event = iterator.next();
            if (intercept(event) == null) {
                iterator.remove();
            }
        }
        return list;
    }

    @Override
    public void close() {

    }

    public static class Builder implements Interceptor.Builder {
        @Override
        public Interceptor build() {
            return new TimestampInterceptor();
        }

        @Override
        public void configure(Context context) {
        }
    }
}
```

> 注意：可能拦截器执行时，会出现找不到 FastJSON的包，需要手动到 `/opt/module/flume/lib`下面，将对应版本的 `FastJSON Jar`包手动下载导入一下。

2. Job配置上，也应该与对应类路径一致：

![image-20250429171323947](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250429171323947.png)

3. 将项目打包，并且将Jar包放到` /opt/module/flume/lib` 文件夹下面。

![image-20250429171507982](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250429171507982.png)