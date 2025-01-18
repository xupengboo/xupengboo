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