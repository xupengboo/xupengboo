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