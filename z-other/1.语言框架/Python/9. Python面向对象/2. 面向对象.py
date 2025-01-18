# 1. 定义
class Person:
    # 初始化方法
    def __init__(self, name, age):
        self.name = name 
        self.age = age 
    # 定义方法
    def greet(self):
        print("Hello, my name is " + self.name + " and I am " + str(self.age) + " years old.")

person1 = Person("Alice", 25)
person1.greet()

# 2. 封装
class BankAccount:
    def __init__(self, account_holder, balance):
        self.__account_holder = account_holder
        self.__balance = balance

    def get__balance(self):
        return self.__balance
    
    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
            return f'Deposited {amount}. New balance is {self.__balance}'
        return 'Invalid amount'

account = BankAccount('Alice', 1000)
print(account.get__balance())
print(account.deposit(500))

# 3. 继承
## 定义父类
class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return f'{self.name} makes a sound.'
## 定义子类
class Dog(Animal):
    def speak(self):
        return f'{self.name} barks.'
class Cat(Animal):
    def speak(self):
        return f'{self.name} meows.'
## 使用子类
dog = Dog("Rex")
cat = Cat("Kitty")
print(dog.speak())
print(cat.speak())

# 4. 多态
def animal_sound(animal):
    return animal.speak()

dog = Dog("Rex")
cat = Cat("Kitty")
animal_sound(dog)
animal_sound(cat)

# 5. 总结
"""
面向对象的优点
1. 代码复用性： 使用继承和多态减少重复代码。
2. 代码可读性： 类和对象的划分使程序结构清晰。
3. 代码扩展性： 通过继承和方法重写扩展功能。
4. 数据安全性： 封装提高了数据的保护能力。
"""