# zipfile 操作ZIP文件。
import zipfile 

# 创建 ZIP 文件
with zipfile.ZipFile("example.zip", "w") as z:
    z.write("example.txt")

# 解压 ZIP 文件
with zipfile.ZipFile("example.zip", "r") as z:
    z.extractall("output_folder")