# 元组推导式
a = (x for x in range(10) if x % 2 == 0)
print(a)    # 返回的是生成器对象
print(tuple(a))    # 将生成器对象转换为元组