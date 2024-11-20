# 创建一个集合
numbers = {1, 2, 3, 4, 5}

# 添加元素
numbers.add(6)
print(numbers)

# 删除元素
numbers.remove(2)
print(numbers)

# 集合运算
set1 = {1, 2, 3}
set2 = {3, 4, 5}
print(set1.union(set2))  # 并集
print(set1.intersection(set2))  # 交集
print(set1.difference(set2))  # 差集    

# 集合遍历
for num in numbers:
    print(num)