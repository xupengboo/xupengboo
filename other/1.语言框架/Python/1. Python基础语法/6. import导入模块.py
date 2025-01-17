# 1. import 导入模块
import math
print(math.sqrt(25))

# 2. from...import 导入模块中的函数或变量
from math import sqrt
print(sqrt(16))

# 3. import ... as 给模块取别名
import math as m
print(m.sqrt(25))

# 4. from...import ... as 给函数或变量取别名
from math import sqrt as sq
print(sq(16))