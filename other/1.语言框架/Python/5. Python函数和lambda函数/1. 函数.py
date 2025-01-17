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

