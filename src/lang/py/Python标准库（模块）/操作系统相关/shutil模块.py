# shutil 高级文件操作，如复制和删除。
import shutil

# 复制文件
shutil.copyfile('test.txt', 'test_copy.txt')  # 复制文件

# 删除目录及其内容
shutil.rmtree('test_dir')  # 删除目录及其内容