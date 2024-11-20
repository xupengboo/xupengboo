# 创建字符串
message = "Hello, Python!"

# 字符串切片
print(message[0:5])

# 转换大小写
print(message.upper())
print(message.lower())

# 分割和连接
words = message.split(", ")
print(words)
new_message = "-".join(words)
print(new_message)
