# 文件 I/O 读写操作（open()方法，打开一个文件）
# 1. 写入文件
with open("output.txt", "w") as file:
    file.write("Hello, world!")
    file.write("\n")
    file.write("This is a test file.")

# 2. 读取文件
with open("output.txt", "r") as file:
    for line in file:
        print(line.strip())

"""
文件操作方法及描述：

1. file.close()
   关闭文件。关闭后文件不能再进行读写操作。

2. file.flush()
   刷新文件内部缓冲，直接把内部缓冲区的数据立刻写入文件，而不是被动的等待输出缓冲区写入。

3. file.fileno()
   返回一个整型的文件描述符(file descriptor FD 整型)，可以用在如 os 模块的 read 方法等一些底层操作上。

4. file.isatty()
   如果文件连接到一个终端设备返回 True，否则返回 False。

5. file.next()
   Python 3 中的 File 对象不支持 next() 方法。
   返回文件下一行。

6. file.read([size])
   从文件读取指定的字节数，如果未给定或为负则读取所有。

7. file.readline([size])
   读取整行，包括 "\n" 字符。

8. file.readlines([sizeint])
   读取所有行并返回列表，若给定 sizeint > 0，返回总和大约为 sizeint 字节的行，
   实际读取值可能比 sizeint 较大，因为需要填充缓冲区。

9. file.seek(offset[, whence])
   移动文件读取指针到指定位置。
   - offset: 偏移量。
   - whence: 起始位置，可选值：
     0 表示从文件开头计算（默认）。
     1 表示从当前位置计算。
     2 表示从文件末尾计算。

10. file.tell()
    返回文件当前位置。

11. file.truncate([size])
    从文件的首行首字符开始截断，截断文件为 size 个字符，
    无 size 表示从当前位置截断；截断之后后面的所有字符被删除。
    注意：Windows 系统下的换行代表 2 个字符大小。

12. file.write(str)
    将字符串写入文件，返回的是写入的字符长度。

13. file.writelines(sequence)
    向文件写入一个序列字符串列表，如果需要换行则要自己加入每行的换行符。
"""
