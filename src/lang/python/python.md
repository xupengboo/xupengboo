---
title: Python 基础
order: 1
---

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

# pop：pop out 弹出
arr = [1, 2, 3, 4]
last_element = arr.pop()  # 移除并返回最后一个元素
print(last_element)  # 输出 4
print(arr)  # 输出 [1, 2, 3]
arr.pop(0)     # 删除第一个元素 O(n)

list1 = [1, 2, 3]
list2 = [4, 5, 6]

# extend方法：扩展列表
# extend 和 append 区别：
list1.append(list2)
print(list1)  # 输出: [1, 2, 3, [4, 5, 6]]

list1 = [1, 2, 3]
list1.extend(list2)
print(list1)  # 输出: [1, 2, 3, 4, 5, 6]
```

### 2.2 元组 Tuple

一般用来 **存储常量或配置数据（搭配解包）、函数返回值**：

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

以下是针对元组的特性以及使用场景：

1. 不可变性

- 特点：元组一旦创建，其内容不可修改（不可增删改元素）。

- 作用：

  - 保证数据的完整性和安全性，防止意外修改。
  - **适合存储常量或配置数据**。

- 示例：

  ```python
  config = ("localhost", 8080)
  # config[0] = "127.0.0.1"  # 会报错，元组不可修改
  ```

2. 性能优势

- 特点：**元组比列表更轻量，占用内存更少，访问速度更快**。

- 作用：

  - 适合存储大量不可变数据，提升程序性能。

- 示例：

  ```python
  import sys
  my_list = [1, 2, 3]
  my_tuple = (1, 2, 3)
  print(sys.getsizeof(my_list))  # 列表占用内存 88
  print(sys.getsizeof(my_tuple)) # 元组占用内存 64
  ```

3. 作为字典的键

- 特点：元组是不可变的，因此**可以作为字典的键，而列表则不行**。

- 作用：

  - 适合存储复合键（如坐标、日期等）。

- 示例：

  ```python
  locations = {(1, 2): "New York", (3, 4): "London"}
  print(locations[(1, 2)])  # 输出 "New York"
  ```

4. 函数返回值

- 特点：元组可以打包多个值，**作为函数的返回值**。

- 作用：

  - 方便返回多个结果，无需创建新的数据结构。

- 示例：

  ```python
  def get_user_info():
      return "Alice", 25, "Developer"
  
  name, age, job = get_user_info()  # 解包元组
  print(name, age, job)
  ```

5. 解包操作

- 特点：**元组支持解包**，可以方便地将元素赋值给多个变量。

- 作用：

  - 简化代码，提高可读性。

- 示例：

  ```python
  point = (3, 5)
  x, y = point  # 解包
  print(x, y)
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
    
# 判断 dict 某个属性是否存在
## 方式一：
my_dict = {"name": "Alice", "age": 25}
if "name" in my_dict:
    print("'name' 存在")
if "gender" not in my_dict:
    print("'gender' 不存在")
## 方式二：适用于设置默认值
my_dict = {"name": "Alice", "age": 25}
if my_dict.get("gender") is None:
    print("'gender' 不存在")
if my_dict.get("gender", "default") == "default":
    print("'gender' 不存在")

## 方式三： 适用于校验key
my_dict = {"name": "Alice", "age": 25}
if "age" in my_dict.keys():
    print("'age' 存在")
```

### 2.4 集合 Set

集合（Set）是一种 **无序且不重复** 的数据结构，常用于**去重、成员检测（快速判断元素是否存在）和数学集合运算**。以下是 Set 的特性：

- **无序性**：集合中的元素没有固定顺序。
- **唯一性**：集合中的元素不可重复。
- **可变性**：集合可以动态增删元素（但元素本身必须是不可变的，如数字、字符串、元组）。
- **高效性**：集合基于哈希表实现，查找、插入、删除操作的平均时间复杂度为 O(1)*O*(1)。

```python
# 创建一个集合
numbers = {1, 2, 3, 4, 5}
empty_set = set()   # 创建空集合

# 添加元素
numbers.add(6)
print(numbers)

# 删除元素
numbers.remove(2)
print(numbers)

# 集合运算
set1 = {1, 2, 3}
set2 = {3, 4, 5}   
print(set1.union(set2)); print(set1 | set2);  # 并集
print(set1.intersection(set2)); print(set1 & set2);  # 交集
print(set1.difference(set2)); print(set1 - set2);  # 差集    
print(set1 ^ set2); print(set1.symmetric_difference(set2)); # 对称差集

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

## 3. Python 条件循环

### 3.1 条件控制

```python
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
```

### 3.2 循环语句

```python
# 1. while 循环语句
n = 100 
sum = 0 
counter = 1

while counter <= n:
    sum = sum + counter
    counter = counter + 1

print("The sum is:", sum)

# 2. for 循环语句
str = "Hello, World!"
for var in str.split(", "):
    print(var)
else:
    print("The loop is over.")

# 3. range( 开始值, 结束值, 步长) 函数
for i in range(10):
    print(i)

# 4. break 语句
for i in range(10):
    if i == 5:
        break
    print(i)

# 5. continue 语句
for i in range(10):
    if i == 5:
        continue
    print(i)

# 6. pass 语句：pass是空语句，是为了保持程序结构的完整性。
for i in range(10):
    pass
```

## 4. Python 迭代器和生成器

### 4.1 迭代器

```python
# 迭代是访问 集合元素 的一种方式。
## 迭代器有两个基本的方法：iter() 和 next()。

# 1. iter() 方法
list = [1, 2, 3, 4, 5]
iter_list = iter(list) # 创建一个迭代器对象
print(next(iter_list)) # 输出迭代器的第一个元素
print(next(iter_list)) # 输出迭代器的第二个元素
print(next(iter_list)) # 输出迭代器的第三个元素    

list2 = [1, 2, 3, 4, 5]
iter_list2 = iter(list2) # 创建一个迭代器对象
for i in iter_list2:
    print(i, end=' ') # 输出迭代器的每个元素

# 2. next() 方法
# next() 方法用于获取迭代器的下一个元素，当迭代器没有更多的元素时，抛出 StopIteration 异常。
import sys 
list = [1, 2, 3, 4, 5]
iter_list = iter(list) # 创建一个迭代器对象
while True:
    try:
        print(next(iter_list)) # 输出迭代器的每个元素
    except StopIteration:
        print('Iteration is stopped.')
        break

# 3. 创建迭代器
## 把一个类作为一个迭代器使用需要在类中实现两个方法 __iter__() 与 __next__() 。
class MyNumbers:
    def __iter__(self):
        self.a = 1
        return self
    def __next__(self):
        if self.a <= 20:
            x = self.a
            self.a += 1
            return x
        else:
            raise StopIteration
myclass = MyNumbers()
myiter = iter(myclass)
for x in myiter:
  print(x, end=' ')
```



### 4.2 生成器

```python
# 生成器（Generator）是一种特殊的迭代器，通过 惰性求值（lazy evaluation）的方式生成值。这意味着生成器可以逐个地产生数据，而不是一次性将所有数据加载到内存中，因此非常适合处理大规模数据或无限序列。
# 生成器两种方式创建：
# 1. 使用 yield 关键字的函数 
def my_generator():
    yield 1
    yield 2
    yield 3
gen = my_generator()
print(next(gen))  # 1
print(next(gen))  # 2   
print(next(gen))  # 3

# 2. 使用生成器表达式
gen = (x**2 for x in range(10))
print(next(gen))  # 0
print(next(gen))  # 1
print(next(gen))  # 4
print(next(gen))  # 9  

'''
生成器的应用场景:
(1) 大数据处理
生成器能高效地处理大文件或大规模数据集，而不会一次性加载所有内容到内存。
(2) 无限序列
生成器可以创建无限序列，适合需要逐步生成数据的场景。
(3) 数据流的管道处理
生成器可以将多个生成器串联起来，形成数据流处理的管道。
'''
```

## 5. Python 函数 和 lambda

### 5.1 函数

```python
# 函数
def my_function1(x, y):
    return x + y
print(my_function1(2, 3)) # Output: 5

# 函数的默认参数
def my_function2(x, y=3):
    return x + y
print(my_function2(2)) # Output: 5

# 函数的不定长参数
def my_function3(a, *args):
    temp = list(args)
    temp.append(a)
    print(temp)
    return sum(temp)
a = 1
print(my_function3(a, 2, 3, 4)) # Output: 10
```

### 5.2 lambda 函数

```python
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
```

## 6. Python  装饰器

### 6.1  装饰器

```python
# 1. 装饰器（类似于Java中的注解，但Python中没有注解） 可以标识 函数和类 。
def decorator(func):
    # wrapper：包装原始函数，扩展功能。
    # (*args, **kwargs)：适配所有函数的参数形式。
    def wrapper(*args, **kwargs):
        print("装饰器开始执行，参数为：" + str(args) + ","+ str(kwargs))
        result = func(*args, **kwargs)
        print("装饰器结束执行，执行结果为：" + str(result))
        return result
    return wrapper

@decorator
def my_func(a, b):
    print("my_func执行了")
    return a + b

print(my_func(1, 2))

'''
用途：
- 日志记录
- 权限校验
- 性能统计
- 缓存机制
'''

# 2. 带参数的装饰器
def repeat(times):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(times):
                func(*args, **kwargs)
            return 
        return wrapper
    return decorator

@repeat(3)
def say_hello():
    print("Hello!")

say_hello()

# 3. 多个装饰器的叠加
def decorator1(func):
    def wrapper(*args, **kwargs):
        print("decorator1开始执行")
        result = func(*args, **kwargs)
        print("decorator1结束执行")
        return result
    return wrapper

def decorator2(func):
    def wrapper(*args, **kwargs):
        print("decorator2开始执行")
        result = func(*args, **kwargs)
        print("decorator2结束执行")
        return result
    return wrapper

@decorator1
@decorator2
def my_func(a, b):
    print("my_func执行了")
    return a + b

print(my_func(1, 2))
```

### 6.2 内置装饰器

```python
# 1. 内置装饰器
class MyClass:
    # @staticmethod定义静态方法
    @staticmethod
    def static_method():
        print("This is a static method.")

    # @classmethod定义类方法
    @classmethod
    def class_method(cls):
        print("This is a class method.")

    # @property将方法变为属性
    @property
    def name(self):
        return "This is a property."

MyClass.static_method()
obj = MyClass()
obj.class_method()
print(obj.name)

# 2. 装饰器中的 functools.wraps 作用：保留原函数的元信息（例如：函数名 和 文档字符串）
from functools import wraps
def decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print("执行装饰器逻辑")
        return func(*args, **kwargs)
    return wrapper

@decorator
def my_func():
    """这是原始函数的文档字符串"""
    print("执行原始函数")

print(my_func.__name__) # 原函数的名称
print(my_func.__doc__) # 原函数的文档字符串
```

## 7. Python 输入 输出

### 7.1  输入输出

```python
# 输入 input()
name = input("请输入你的名字：")

# 输出 print()
print(f"你好，{name}!")

# 例如：打印九九乘法表
for i in range(1, 10):
    for j in range(1 , i + 1):
        print(f'{i} * {j} = {i * j}', end='\t')
    print()

# 读取多行输入
import sys
print("请输入多行文本（按 Ctrl + D 或 Ctrl + Z 结束输入）：")
data = sys.stdin.read()
print(f'你输入了：\n{data}')
```

### 7.2 文件IO

```python
# 文件 I/O 读写操作（open()方法，打开一个文件）
# 1. 写入文件
with open("output.txt", "w") as file:
    file.write("Hello, world!")
    file.write("\n")
    file.write("This is a test file.")

# 2. 读取文件
with open("output.txt", "r") as file:
    for line in file:
        print(line.strip())

"""
文件操作方法及描述：

1. file.close()
   关闭文件。关闭后文件不能再进行读写操作。

2. file.flush()
   刷新文件内部缓冲，直接把内部缓冲区的数据立刻写入文件，而不是被动的等待输出缓冲区写入。

3. file.fileno()
   返回一个整型的文件描述符(file descriptor FD 整型)，可以用在如 os 模块的 read 方法等一些底层操作上。

4. file.isatty()
   如果文件连接到一个终端设备返回 True，否则返回 False。

5. file.next()
   Python 3 中的 File 对象不支持 next() 方法。
   返回文件下一行。

6. file.read([size])
   从文件读取指定的字节数，如果未给定或为负则读取所有。

7. file.readline([size])
   读取整行，包括 "\n" 字符。

8. file.readlines([sizeint])
   读取所有行并返回列表，若给定 sizeint > 0，返回总和大约为 sizeint 字节的行，
   实际读取值可能比 sizeint 较大，因为需要填充缓冲区。

9. file.seek(offset[, whence])
   移动文件读取指针到指定位置。
   - offset: 偏移量。
   - whence: 起始位置，可选值：
     0 表示从文件开头计算（默认）。
     1 表示从当前位置计算。
     2 表示从文件末尾计算。

10. file.tell()
    返回文件当前位置。

11. file.truncate([size])
    从文件的首行首字符开始截断，截断文件为 size 个字符，
    无 size 表示从当前位置截断；截断之后后面的所有字符被删除。
    注意：Windows 系统下的换行代表 2 个字符大小。

12. file.write(str)
    将字符串写入文件，返回的是写入的字符长度。

13. file.writelines(sequence)
    向文件写入一个序列字符串列表，如果需要换行则要自己加入每行的换行符。
"""
```

## 8. Python 错误和异常处理

### 8.1 错误 Error

```python
"""
错误 程序运行时无法处理的严重问题：
- SyntaxError：语法错误，代码语法不符合Python语法规则。
- TypeError：数据类型错误，函数参数类型不匹配。
- IndexError：列表索引超出范围。
- KeyError：字典中不存在指定的键。
- ImportError：导入模块失败。
- IndentationError：代码缩进错误。


- NameError：变量名、函数名、模块名没有定义。
- ValueError：数值计算错误，比如字符串转换为整数。
- IOError：文件操作错误，比如文件不存在、读写失败等。
- AttributeError：对象没有该属性。
- RuntimeError：运行时错误，比如内存溢出、栈溢出等。
- NotImplementedError：尚未实现的方法。
- SystemExit：程序退出。
- KeyboardInterrupt：用户中断程序。
- GeneratorExit：生成器退出。
- StopIteration：迭代器没有更多的值。
- ArithmeticError：数学计算错误，比如除零错误。
- FloatingPointError：浮点数计算错误。
- OverflowError：数值运算超出最大限制。
- ZeroDivisionError：除数为零。
- AssertionError：断言失败。
- SystemError：系统错误。
- NotImplementedError：尚未实现的方法。
"""
```

### 8.2  异常 Exception

```python
# 1. 异常处理：
try:
    res = 10 / 0
except ZeroDivisionError as e:
    print(f'捕获异常：{e}')

# 2. 多个异常处理：
try:
    value = int('abc')
    result = 10 / 0
except ValueError:
    print(f'ValueError捕获异常')
except ZeroDivisionError:
    print(f'ZeroDivisionError捕获异常')

# 3. raise 抛出异常 [raise 翻译：上升、举起、唤起、引起]
def check_age(age):
    if age < 0:
        raise ValueError('年薪不能为负数')
    print(f'年龄检查通过，年龄为{age}岁')

try:
    check_age(-10)
except ValueError as e:
    print(f'捕获异常：{e}')

# 4. 自定义异常
class MyException(Exception):
    pass

try:
    raise MyException('自定义异常')
except MyException as e:
    print(f'捕获自定义异常：{e}')

# 5. else 和 finally 块
try:
    value = int("123")
    print("转换成功")
except ValueError:
    print(f'转换失败')
else: 
    print(f'没有捕获到异常')
finally:
    print(f'执行清理操作')
```

## 10. Python 面向对象

### 10.1 共有属性和私有属性

```python
# 1. 公有属性：是默认的类属性，可以被类内部和外部直接访问呢。
class MyClassPublic:
    public_attr = 100 # 公有属性

print(MyClassPublic.public_attr)


# 2. 私有属性：通过在属性名前添加下划线'__'定义。私有属性只能在类的内部访问，外部不能直接访问。 
class MyClassPrivate:
    __private_attr = 200 # 私有属性
    
    # 提访问类的私有属性
    @staticmethod
    def get_private_attr():
        return MyClassPrivate.__private_attr

try:
    print(MyClassPrivate.__private_attr)
except AttributeError as e:
    print(f"异常信息：{e}")

print(MyClassPrivate.get_private_attr())
"""
类型	    命名规则	       访问范围	                                  示例
公有属性	无下划线或单下划线	类内和类外均可访问	                        public_attr
私有属性	双下划线开头	    类内可访问，类外通过 Name Mangling 访问   	__private_attr
"""
```

### 10.2 面向对象

```python
# 1. 定义
class Person:
    # 初始化方法
    def __init__(self, name, age):
        self.name = name 
        self.age = age 
    # 定义方法
    def greet(self):
        print("Hello, my name is " + self.name + " and I am " + str(self.age) + " years old.")

person1 = Person("Alice", 25)
person1.greet()

# 2. 封装
class BankAccount:
    def __init__(self, account_holder, balance):
        self.__account_holder = account_holder
        self.__balance = balance

    def get__balance(self):
        return self.__balance
    
    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
            return f'Deposited {amount}. New balance is {self.__balance}'
        return 'Invalid amount'

account = BankAccount('Alice', 1000)
print(account.get__balance())
print(account.deposit(500))

# 3. 继承
## 定义父类
class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return f'{self.name} makes a sound.'
## 定义子类
class Dog(Animal):
    def speak(self):
        return f'{self.name} barks.'
class Cat(Animal):
    def speak(self):
        return f'{self.name} meows.'
## 使用子类
dog = Dog("Rex")
cat = Cat("Kitty")
print(dog.speak())
print(cat.speak())

# 4. 多态
def animal_sound(animal):
    return animal.speak()

dog = Dog("Rex")
cat = Cat("Kitty")
animal_sound(dog)
animal_sound(cat)

# 5. 总结
"""
面向对象的优点
1. 代码复用性： 使用继承和多态减少重复代码。
2. 代码可读性： 类和对象的划分使程序结构清晰。
3. 代码扩展性： 通过继承和方法重写扩展功能。
4. 数据安全性： 封装提高了数据的保护能力。
"""
```

## 11. Python 标准库

### 11.1 单元测试

```python
# unittest 单元测试框架。
import unittest

class TestExample(unittest.TestCase):
    def test_addition(self):
        self.assertEqual(1 + 1, 2)

if __name__ == '__main__':
    unittest.main()
```

### 11.2 压缩与归档

```python
# tarfile 操作 TAR 文件。
import tarfile 

# 创建 TAR 文件
with tarfile.open("test.tar.gz", "w") as tar:
    tar.add("example.txt")

# 解压TAR文件
with tarfile.open("test.tar.gz", "r") as tar:
    tar.extractall("output_dir")
```

```python
# zipfile 操作ZIP文件。
import zipfile 

# 创建 ZIP 文件
with zipfile.ZipFile("example.zip", "w") as z:
    z.write("example.txt")

# 解压 ZIP 文件
with zipfile.ZipFile("example.zip", "r") as z:
    z.extractall("output_folder")
```

### 11.3  多线程与多进程

```python
# multiprocessing 多进程处理。
from multiprocessing import Process

def print_numbers():
    for i in range(5):
        print(i)

if __name__ == '__main__':
    process = Process(target=print_numbers)
    process.start()
```

```python
# threading 多线程处理。
import threading

def print_numbers():
    for i in range(5):
        print(i)

thread = threading.Thread(target=print_numbers)
thread.start()
```

### 11.4  操作系统相关

```python
# os 提供操作系统接口。
import os 

# 获取当前目录
print(os.getcwd())

# 创建文件夹
os.mkdir('new_folder')

# 删除文件夹
os.rmdir('new_folder')
```

```python
# shutil 高级文件操作，如复制和删除。
import shutil

# 复制文件
shutil.copyfile('test.txt', 'test_copy.txt')  # 复制文件

# 删除目录及其内容
shutil.rmtree('test_dir')  # 删除目录及其内容
```

```python
# 提供与 Python 解释器相关的功能。
import sys

# 打印系统路径
print(sys.path)

# 获取Python版本
print(sys.version)
```

### 11.5 数学与数字处理

```python
# decimal 处理高精度浮点运算。
from decimal import Decimal

# 高精度计算
print(Decimal('0.1') + Decimal('0.2'))
```

```python
# fractions 处理分数。
from fractions import Fraction

# 分数计算
print(Fraction(1, 3) + Fraction(2, 3))
```

```python
# math 提供数学函数。
import math

# 计算平方根
print(math.sqrt(16))

# 计算阶乘
print(math.factorial(5))
```

```python
# random 生成随机数。
import random 

# 随机选择
print(random.choice(['apple', 'banana', 'orange']))

# 随机数
print(random.random())

# 随机整数
print(random.randint(1, 10))
```

### 11.6 数据格式化

data.csv：

```csv
name,age,gender
Alice,25,female
```

```python
# csv 处理CSV文件。
import csv

# 写入CSV
with open("data.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["name", "age", "gender"])
    writer.writerow(["Alice", 25, "female"])

# 读取CSV
with open("data.csv", "r") as f:
    reader = csv.reader(f)
    for row in reader:
        print(row)
```

```python
# json 处理JSON数据。
import json

# 字典转JSON
data = {"name": "Alice", "age": 20}
json_str = json.dumps(data)
print(json_str)

# JSON转字典
json_str = '{"name": "Bob", "age": 30}'
data = json.loads(json_str)
print(data)
```

```python
# pickle 序列化Python对象。
import pickle

# 序列化
data = {"name": "Alice", "age": 25}

with open("data.pkl", "wb") as f:
    pickle.dump(data, f)

# 反序列化
with open("data.pkl", "rb") as f:
    data = pickle.load(f)
    print(data)
```

### 11.7 数据结构操作

```python
# array 提供数组操作。
import array

# 创建数组
arr = array.array('i', [1, 2, 3, 4, 5])
print(arr)
```

```python
# collections 提供特殊数据类型
from collections import Counter, defaultdict, namedtuple

# 计数
print(Counter('hello world'))

# 默认字典
d = defaultdict(int)
d["a"] += 1
print(d)

# 命名元组
Point = namedtuple("Point", "x y")
p = Point(10, 20)
print(p.x, p.y)
```

```python
# heapq 提供堆排序功能。
import heapq 

# 最小堆
nums = [5, 2, 8, 1]
heapq.heapify(nums)
print(heapq.heappop(nums))
```

### 11.8 文件处理

```python
# glob 文件路径匹配。
import glob

# 查询所有 `.txt` 文件。
print(glob.glob('*.txt'))
```

```python
# os 和 os.path 文件操作。
import os 

# 判断文件是否存在
print(os.path.exists('test.txt'))
# 获取文件大小
print(os.path.getsize('test.txt'))
```

```python
# pathlib 面向对象的路径操作。
from pathlib import Path

# 创建路径对象
p = Path("output.txt")

# 判断文件是否存在
print(p.exists())
```

### 11.9 时间与日期处理

```python
# calendar 处理日历。
import calendar

# 打印某个月的日历
print(calendar.month(2024, 11))
```

```python
# datetime 处理日期和时间。
from datetime import datetime

# 获取当前时间
now = datetime.now()
print(now)

# 格式化日期和时间
print(now.strftime('%Y-%m-%d %H:%M:%S'))
```

```python
# time 提供时间相关功能。
import time

# 获取当前时间戳
print(time.time())

# 暂停2秒
time.sleep(2)
```

### 11.10 正则表达式

```python
# regex 正则表达式用于匹配。
import re 

# re.match(pattern, string)
result = re.match(r'\d+', '123abc')
if result:
    print(result.group())

# re.search(pattern, string)
result = re.search(r'\d+', 'abc123xyz')
if result:
    print(result.group())

# re.findall(pattern, string)
result = re.findall(r'\d+', '123abc456def')
if result:
    print(result)

# re.finditer(pattern, string)
result = re.finditer(r'\d+', '123abc456def')
if result:
    for match in result:
        print(match.group())

# re.sub(pattern, repl, string, count=0)
result = re.sub(r'\d+', 'x', '123abc456def')
if result:
    print(result)

# re.split(pattern, string, maxsplit=0)
result = re.split(r'\d+', '123abc456def')
if result:
    print(result)
```

### 11.12 网络编程

```python
# http.server 简单的HTTP服务器。
from http.server import HTTPServer, SimpleHTTPRequestHandler

# 创建服务器
server = HTTPServer(('localhost', 8000), SimpleHTTPRequestHandler)
print('服务器已启动，监听端口 8000')
server.serve_forever()
```

```python
# socket 低级网络接口
import socket 

# 获取主机名
print(socket.gethostname())

# 获取本机IP地址
print(socket.gethostbyname(socket.gethostname()))
```

```python
# urllib 处理URL请求。
from urllib import request

# 下载页面内容
response = request.urlopen("https://www.baidu.com")
print(response.read().decode('utf-8'))
```

### 11.13 BeautifulSoup 解析HTML、XML

```python
# 例如：爬取网站首页上的文章标题和链接并保存到csv文件中。
import requests
from bs4 import BeautifulSoup
import csv

url = "https://www.网站.net/"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6',
    'Connection': 'keep-alive',
}

response = requests.get(url, headers=headers)
if response.status_code != 200:
    print(f'请求失败, 状态码为{response.status_code}, 返回结果为：{response.text}')



'''
BeautifulSoup 将 HTML 或 XML 文档解析为一个类似于 DOM 树的结构。你可以通过访问这个树的节点来操作和查询网页内容。
- find()：返回第一个匹配的元素。
- find_all()：返回所有匹配的元素（列表形式）。
- select()：使用 CSS 选择器来查找元素。
'''
# 解析网页内容
soup = BeautifulSoup(response.text, "html.parser")
# 匹配返回结果
articles = soup.find_all('a')


articles_data = []
for article in articles:
    title = article.get_text()
    link  = article.get('href')
    articles_data.append([title, link])
# 将数据保存到csv文件中
with open('articles.csv', mode='w', newline='', encoding='utf-8') as files:
    writer = csv.writer(files)
    writer.writerow(['Title','Link'])
    writer.writerows(articles_data)
print("爬取完成")
```

