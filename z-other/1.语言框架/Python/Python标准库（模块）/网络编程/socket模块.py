# socket 低级网络接口
import socket 

# 获取主机名
print(socket.gethostname())

# 获取本机IP地址
print(socket.gethostbyname(socket.gethostname()))