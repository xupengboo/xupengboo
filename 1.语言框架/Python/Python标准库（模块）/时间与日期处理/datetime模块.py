# datetime 处理日期和时间。
from datetime import datetime

# 获取当前时间
now = datetime.now()
print(now)

# 格式化日期和时间
print(now.strftime('%Y-%m-%d %H:%M:%S'))