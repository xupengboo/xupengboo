# 列表推导式 语法格式：
## [表达式 for 变量 in 可迭代对象 if 条件]

# 创建一个平方列表
squares = [x**2 for x in range(1,6)]
print(squares)

# 待条件的列表推导
even_squares = [x**2 for x in range(1, 11) if x % 2 == 0]
print(even_squares)
