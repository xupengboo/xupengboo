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