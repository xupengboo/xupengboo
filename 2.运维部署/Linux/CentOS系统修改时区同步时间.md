# 时区修改

```shell
# 查看当前时区
timedatectl

# 上海时间
sudo timedatectl set-timezone Asia/Shanghai

# 安装同步时间软件
sudo yum install ntpdate # or sudo yum install ntp 
# 启动服务
sudo systemctl start ntpd.service
sudo systemctl enable ntpd.service
# 检查状态
ntpq -p
```

