# pickle 序列化Python对象。
import pickle

# 序列化
data = {"name": "Alice", "age": 25}

with open("data.pkl", "wb") as f:
    pickle.dump(data, f)

# 反序列化
with open("data.pkl", "rb") as f:
    data = pickle.load(f)
    print(data)