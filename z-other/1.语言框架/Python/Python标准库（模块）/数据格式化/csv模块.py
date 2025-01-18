# csv 处理CSV文件。
import csv

# 写入CSV
with open("data.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["name", "age", "gender"])
    writer.writerow(["Alice", 25, "female"])

# 读取CSV
with open("data.csv", "r") as f:
    reader = csv.reader(f)
    for row in reader:
        print(row)