# http.server 简单的HTTP服务器。
from http.server import HTTPServer, SimpleHTTPRequestHandler

# 创建服务器
server = HTTPServer(('localhost', 8000), SimpleHTTPRequestHandler)
print('服务器已启动，监听端口 8000')
server.serve_forever()