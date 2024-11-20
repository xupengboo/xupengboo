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
