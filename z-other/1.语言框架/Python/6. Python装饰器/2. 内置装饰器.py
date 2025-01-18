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