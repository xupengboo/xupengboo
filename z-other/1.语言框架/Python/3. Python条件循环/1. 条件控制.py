# 1. if 语句
x = 10 
if x > 0:
    print("x is 整数")
elif x < 0:
    print("x is 负数")
else:
    print("x is 0")

# 2. 多条件判断
if x > 0 and x < 20:
    print("x 在 0 到 20 之间")
else:
    print("x 不在 0 到 20 之间")

# 3. 单行条件判断
x = 10 
print("x 是整数") if x > 0 and x % 1 == 0 else print("x 不是整数")

