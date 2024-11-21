# collections 提供特殊数据类型
from collections import Counter, defaultdict, namedtuple

# 计数
print(Counter('hello world'))

# 默认字典
d = defaultdict(int)
d["a"] += 1
print(d)

# 命名元组
Point = namedtuple("Point", "x y")
p = Point(10, 20)
print(p.x, p.y)