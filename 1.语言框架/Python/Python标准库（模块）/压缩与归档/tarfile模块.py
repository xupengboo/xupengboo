# tarfile 操作 TAR 文件。
import tarfile 

# 创建 TAR 文件
with tarfile.open("test.tar.gz", "w") as tar:
    tar.add("example.txt")

# 解压TAR文件
with tarfile.open("test.tar.gz", "r") as tar:
    tar.extractall("output_dir")