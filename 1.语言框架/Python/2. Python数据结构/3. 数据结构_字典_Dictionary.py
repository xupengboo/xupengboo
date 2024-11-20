# 创建一个字段
student = {'name': 'join', 'age': '20', 'major': 'Computer Science'}

# 访问字典中的值
print(student['name'])

# 添加或更新键值对
student['age'] = 21
student['grade'] = "A"
print(student)

# 删除键值对
del student['grade']
print(student)

# 遍历键值对
for key, value in student.items(): 
    print(f"{key}: {value}")

