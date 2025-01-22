---
title: Python 基础
order: 1
---

# Python 基础

## 1. Python 基础语法

### 1.1 保留字

```python
PS D:\project\self\xupengboo\1.语言框架\Python> python                   
Python 3.12.4 (tags/v3.12.4:8e8a4ba, Jun  6 2024, 19:30:16) [MSC v.1940 64 bit (AMD64)] on win32
Type "help", "copyright", "credits" or "license" for more information.
>>> import keyword 
>>> keyword.kwlist
['False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'im
```

### 1.2 注释

 Python 解释器会忽略 注释。

```python
# 注释会被 Python 解释器忽略。

# 单行注释

'''
多行注释
'''

"""
多行注释
"""
```

### 1.3 行与缩进

Python 最具特色的就是使用缩进来表示代码块，不需要使用大括号 `{ }` 。 

```python
# python最具特色的就是使用缩进来表示代码块，不需要使用大括号 {} 

if True:   
    print("Hello, world!")  # 缩进表示代码块，这里是if语句的主体部分
else:
    print("Goodbye, world!")  # 这里是else语句的主体部分

print("I'm outside the if-else block.")
```

### 1.4 多行语句

使用 `反斜杠 \`  实现多行语句 

在  `[]` ,  `{}` , 或  `()` 中的多行语句，不需要使用 `反斜杠 \` 。

```python
# 使用反斜杠 \ 实现多行语句
total = 1 + 2 + \
        3 + 4 + \
        5 + 6 + \
        7 + 8
print(total)

# 在 [], {}, 或 () 中的多行语句，不需要使用反斜杠 \ 
my_list = [1, 2, 3,
           4, 5, 6,
           7, 8, 9]
print(my_list)
```

### 1.5 同一行显示多条语句

同一行显示多条语句：

```python
# 同一行显示多条语句
import sys; x = 'hello'; sys.stdout.write(x + '\n')
```

### 1.6 import 导入模块

```python
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
```

### 1.7  命令行参数

```bash
python -h
# usage: python [option] ... [-c cmd | -m mod | file | -] [arg] ...
# Options and arguments (and corresponding environment variables):
# -c cmd : program passed in as string (terminates option list)
# -d     : debug output from parser (also PYTHONDEBUG=x)
# -E     : ignore environment variables (such as PYTHONPATH)
# -h     : print this help message and exit

# [ etc. ]
```



## 2. Python 数据结构

### 2.1 列表 List

```python
# 创建一个列表
fruits = ['apple', 'banana', 'orange', 'grape', 'pear']

# 访问元素
print(fruits[0])

# 添加元素
fruits.append('peach')
print(fruits)

# 插入元素
fruits.insert(2, 'watermelon')
print(fruits)

# 删除元素
fruits.remove('banana')

# 遍历列表
for fruit in fruits:
    print(fruit)
```

### 2.2 元组 Tuple

```python
# 创建一个元组
numbers = (1,2,3,4,5)

# 访问元素
print(numbers[2]) 

# 解包元组
a,b,c,d,e = numbers
print(a,b,c,d,e) 

# 检查元素是否存在
print(3 in numbers)
```

### 2.3 字典 Dictionary

```python
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
```

### 2.4 集合 Set

```python
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
```

### 2.5  字符串 String

```python
# 创建字符串
message = "Hello, Python!"

# 字符串切片
print(message[0:5])

# 转换大小写
print(message.upper())
print(message.lower())

# 分割和连接
words = message.split(", ")
print(words)
new_message = "-".join(words)
print(new_message)
```

### 2.6 整数 Int

```python
# 整数int
a = 10      # 正整数
b = -20     # 负整数
c = 0       # 零

a = 3.14    # 浮点数
b = -2.718  # 负浮点数
c = 0.0     # 零
d = 1e3     # 科学计数法表示的整数

a = 2 + 3j   # 复数，实部为2，虚部为3
b = 1 - 4j   # 复数，实部为1，虚部为-4


# type() 函数检查变量的类型，确认它是 int、float 还是 complex 类型
a = 10
print(type(a))   # <class 'int'>
b = 3.14 
print(type(b))   # <class 'float'>
c = 1 + 1j
print(type(c))   # <class 'complex'>    


# 浮点数转整数
x = 3.14
y = int(x)
print(y)  # 输出: 3

# 整数转浮点数
a = 5
b = float(a)
print(b)  # 输出: 5.0

# 整数转复数
c = complex(a)
print(c)  # 输出: (5+0j)
```

### 2.7 布尔 Bool

```python
# 布尔类型bool
a = True
b = False
print(type(a))

# 布尔类型的整数表现
print(int(True))
print(int(False))

# 使用bool()函数将其他类型转换为布尔类型
print(bool(0))         # False
print(bool(42))        # True
print(bool(''))        # False
print(bool('Python'))  # True
print(bool([]))        # False
print(bool([1, 2, 3])) # True


# 布尔值在控制流中的应用
if True:
    print("This will always print")
   
if not False:
    print("This will also always print")
```

### 2.8 列表推导式

```python
# 列表推导式 语法格式：
## [表达式 for 变量 in 可迭代对象 if 条件]

# 创建一个平方列表
squares = [x**2 for x in range(1,6)]
print(squares)

# 待条件的列表推导
even_squares = [x**2 for x in range(1, 11) if x % 2 == 0]
print(even_squares)
```

### 2.9 字典推导式 

```python
# 字典推导式
listDemo = ['Google', 'Apple', 'Microsoft', 'Amazon', 'Facebook']
# 转换为新的字典，可以用字典推导式来实现。
newDict = {key: len(key) for key in listDemo}
print(newDict)
```

### 2.10 集合推导式

```python
# 集合推导式
setNew = {i**2 for i in range(1, 11) if i % 2 == 0}
print(setNew)
```

### 2.11 元组推导式

```python
# 元组推导式
a = (x for x in range(10) if x % 2 == 0)
print(a)    # 返回的是生成器对象
print(tuple(a))    # 将生成器对象转换为元组
```





