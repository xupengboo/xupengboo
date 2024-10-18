# 索引生命周期管理



例如：日志管理，会将日志存储到对应索引中，logstash一般会根据日期将日志推送过来。

这样我们可以声明索引生命周期策略，多久去定期删除对应的日志信息，也可以通过索引管理手动删除。

![image-20241018104433445](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241018104433445.png)

还可以声明索引模式，并且设置默认值：

![image-20241018104403682](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241018104403682.png)