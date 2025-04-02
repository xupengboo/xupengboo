---
title: Filebeat 使用
order: 2
---

## 1. Filebeat 

Filebeat 是 Elastic Stack 中的轻量级日志采集工具，用于收集、转发日志文件到 Logstash、Elasticsearch 等目的地。

## 2. Filebeat 文件直接上传

1. 下载 或者 启动 Filebeat
- 官方地址：https://www.elastic.co/cn/downloads/beats/filebeat
- 注意版本：必须与整个ELK技术栈一致才行！
```shell
# 下载 Filebeat linux版本：
curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-7.4.2-linux-x86_64.tar.gz
# 解压
tar -zxvf filebeat-7.4.2-linux-x86_64.tar.gz
```

2. 配置 Filebeat
```yaml
# 配置输入（日志文件路径）
filebeat.inputs:
  - type: filestream
    enabled: true            # 启用（注意：默认是false）
    paths:
      - /var/log/*.log          # 监控所有.log文件
      - /var/log/nginx/access.log  # 监控Nginx访问日志

# 配置输出（发送到Elasticsearch）
# output.elasticsearch:
#   hosts: ["localhost:9200"]
#   username: "elastic"
#   password: "your_password"

# 或发送到Logstash
output.logstash:
  hosts: ["localhost:5044"]
```

3. 启动 Filebeat
```shell
sudo ./filebeat -e -c filebeat.yml
```

4. 验证 Filebeat

```shell
echo "测试测试测试" >> test.log
```

## 3. Filebeat Nginx日志上传



