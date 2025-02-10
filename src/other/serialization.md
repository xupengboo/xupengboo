---
title: 序列化与反序列化
order: 3
---

## 什么是序列化与反序列化？

序列化和反序列化是数据存储和传输中的重要概念。

**序列化**（Serialization）是将数据结构或对象转化为可存储或传输的格式的过程。例如，将一个 Python 对象转换为字节流，以便存储在文件中，或者发送通过网络传输。常见的序列化格式有 JSON、XML、Pickle（Python专用）等。

**反序列化**（Deserialization）则是序列化的逆过程，即将序列化后的数据恢复为原始的对象或数据结构。例如，从一个存储在磁盘上的 JSON 文件中读取数据并将其转换为 Python 对象。

举个简单的例子：

1. **序列化**：将 Python 字典转换为 JSON 格式的字符串。

   ```python
   import json
   data = {'name': 'Alice', 'age': 25}
   serialized_data = json.dumps(data)
   print(serialized_data)  # 输出: '{"name": "Alice", "age": 25}'
   ```

2. **反序列化**：将 JSON 格式的字符串转换回 Python 字典。

   ```python
   deserialized_data = json.loads(serialized_data)
   print(deserialized_data)  # 输出: {'name': 'Alice', 'age': 25}
   ```

通过序列化和反序列化，我们可以将数据跨进程、跨设备或跨网络传输，或者将其持久化存储。

:::tip
每种RPC协议都应该要有对应的序列化协议。例如：Java RMI 的Java对象序列化流协议（Java Object Serialization Stream Protocol）、Web Service 的 XML 序列化、众多轻量级RPC支持的 JSON 序列化等等。
:::