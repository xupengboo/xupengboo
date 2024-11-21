# pathlib 面向对象的路径操作。
from pathlib import Path

# 创建路径对象
p = Path("output.txt")

# 判断文件是否存在
print(p.exists())