# lambda 函数  
add = lambda x, y : x + y
print(add(2, 3))

# 1. 与 map() 结合 映射
nums = [1,2,3,4,5]
squared_nums = list(map(lambda x: x**2, nums))
print(squared_nums)

# 2. 与 filter() 结合 过滤
nums = [1,2,3,4,5]
even_nums = list(filter(lambda x: x % 2 == 0 , nums))
print(even_nums)

# 3. 与 sorted() 结合 排序
nums = ['apple', 'banana', 'orange', 'pear', 'grape']
sorted_nums = sorted(nums, key=lambda word: len(word))
print(sorted_nums)

# 4. 与 reduce() 结合 计算
from functools import reduce
nums = [1,2,3,4,5]
product = reduce(lambda x, y: x*y, nums)
print(product)

'''
Lambda 函数：
    1. 适用于简单的、临时的计算任务。
    2. 一行表达式，无需显式定义函数名。
'''