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