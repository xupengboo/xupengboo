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