# json 处理JSON数据。
import json

# 字典转JSON
data = {"name": "Alice", "age": 20}
json_str = json.dumps(data)
print(json_str)

# JSON转字典
json_str = '{"name": "Bob", "age": 30}'
data = json.loads(json_str)
print(data)
