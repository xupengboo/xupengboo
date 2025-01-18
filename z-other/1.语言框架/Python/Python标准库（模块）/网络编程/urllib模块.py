# urllib 处理URL请求。
from urllib import request

# 下载页面内容
response = request.urlopen("https://www.baidu.com")
print(response.read().decode('utf-8'))