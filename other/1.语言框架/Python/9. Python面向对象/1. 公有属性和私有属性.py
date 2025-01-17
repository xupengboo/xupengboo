# 1. 公有属性：是默认的类属性，可以被类内部和外部直接访问呢。
class MyClassPublic:
    public_attr = 100 # 公有属性

print(MyClassPublic.public_attr)


# 2. 私有属性：通过在属性名前添加下划线'__'定义。私有属性只能在类的内部访问，外部不能直接访问。 
class MyClassPrivate:
    __private_attr = 200 # 私有属性
    
    # 提访问类的私有属性
    @staticmethod
    def get_private_attr():
        return MyClassPrivate.__private_attr

try:
    print(MyClassPrivate.__private_attr)
except AttributeError as e:
    print(f"异常信息：{e}")

print(MyClassPrivate.get_private_attr())
"""
类型	    命名规则	       访问范围	                                  示例
公有属性	无下划线或单下划线	类内和类外均可访问	                        public_attr
私有属性	双下划线开头	    类内可访问，类外通过 Name Mangling 访问   	__private_attr
"""