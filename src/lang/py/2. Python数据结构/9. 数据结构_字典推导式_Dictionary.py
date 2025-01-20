# 字典推导式
listDemo = ['Google', 'Apple', 'Microsoft', 'Amazon', 'Facebook']
# 转换为新的字典，可以用字典推导式来实现。
newDict = {key: len(key) for key in listDemo}
print(newDict)