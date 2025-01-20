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
