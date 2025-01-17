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