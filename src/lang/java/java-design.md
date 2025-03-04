# Java 设计模式

本项目通过构建一个个maven项目梳理案例，来针对性的展示学习每一种设计模式。

构建mvn项目命令，如下：

```powershell
mvn archetype:generate -DgroupId=com.xupengboo -DartifactId=xxx -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
```

## 设计模式 介绍

设计模式是一种在软件设计中经常使用的通用解决方案，它们帮助解决常见问题并促使代码更具可维护性和可扩展性。

**Java中有23种经典的设计模式，它们分为三大类：创建型模式、结构型模式和行为型模式。**

**创建型模式（Creational Patterns）**:
1. 单例模式（Singleton Pattern）
2. 原型模式（Prototype Pattern）
3. 工厂模式（Factory Pattern）
    - 简单工厂模式（Simple Factory Pattern）
    - 工厂方法模式（Factory Method Pattern）
    - 抽象工厂模式（Abstract Factory Pattern）
4. 建造者模式（Builder Pattern）

**结构型模式（Structural Patterns）**:

1. 适配器模式（Adapter Pattern）
    - 对象适配器模式（Object Adapter Pattern）
    - 类适配器模式（Class Adapter Pattern）
2. 桥接模式（Bridge Pattern）
3. 过滤器模式（Filter Pattern）
4. 组合模式（Composite Pattern）
5. 装饰器模式（Decorator Pattern）
6. 外观模式（Facade Pattern）
7. 享元模式（Flyweight Pattern）
8. 代理模式（Proxy Pattern）

**行为型模式（Behavioral Patterns）**:
1. 责任链模式（Chain of Responsibility Pattern）
2. 命令模式（Command Pattern）
3. 解释器模式（Interpreter Pattern）
4. 迭代器模式（Iterator Pattern）
5. 中介者模式（Mediator Pattern）
6. 备忘录模式（Memento Pattern）
7. 观察者模式（Observer Pattern）
8. 状态模式（State Pattern）
10. 策略模式（Strategy Pattern）
11. 模板模式（Template Pattern）
12. 访问者模式（Visitor Pattern）



## 1. 工厂模式

官方定义：工厂模式（factory pattern）属于创建型模式，它在创建对象时提供了一种封装机制，将实际创建对象的代码与使用代码分离。

关键信息：**将实际创建对象的代码与使用代码分离**。

工厂模式包括  **简单工厂模式、工厂方法模式 和 抽象工厂模式**  。这三种模式都属于工厂模式的范畴。

**抽象工厂模式包含以下几个核心角色**：

- 抽象工厂（Abstract Factory）：声明了一组用于创建产品对象的方法，每个方法对应一种产品类型。抽象工厂可以是接口或抽象类。
- 具体工厂（Concrete Factory）：实现了抽象工厂接口，负责创建具体产品对象的实例。
- 抽象产品（Abstract Product）：定义了一组产品对象的共同接口或抽象类，描述了产品对象的公共方法。
- 具体产品（Concrete Product）：实现了抽象产品接口，定义了具体产品的特定行为和属性。

| 工厂模式                                                     | 概述                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [简单工厂模式](https://github.com/xupengboo/DesignPatterns/tree/main/%E5%B7%A5%E5%8E%82%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo/%E7%AE%80%E5%8D%95%E5%B7%A5%E5%8E%82%E6%A8%A1%E5%BC%8F) | 非常简易的创建型设计模式，它并不属于23种经典设计模式中的一种。 |
| [工厂方法模式](https://github.com/xupengboo/DesignPatterns/tree/main/%E5%B7%A5%E5%8E%82%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo/%E5%B7%A5%E5%8E%82%E6%96%B9%E6%B3%95%E6%A8%A1%E5%BC%8F) | 定义了一个用于创建对象的接口，但由子类决定要实例化的类是哪一个。工厂方法使得一个类的实例化延迟到其子类。 |
| [抽象工厂模式](https://github.com/xupengboo/DesignPatterns/tree/main/%E5%B7%A5%E5%8E%82%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo/%E6%8A%BD%E8%B1%A1%E5%B7%A5%E5%8E%82%E6%A8%A1%E5%BC%8F) | 提供了一个 接口/抽象类 用于创建相关或依赖对象的家族，而不需要明确指定具体类。抽象工厂模式是工厂方法模式的推广，它引入了多个工厂接口，用于创建一系列相关或相互依赖的产品。 |

## 2. 单例模式

官方定义：单例模式（singleton pattern）是一种创建型设计模式，它确保一个类只有一个实例，并提供了一个全局访问点来访问该实例。

关键信息： **将类的实例化过程限制为一个实例，并提供一个全局访问点** 。

单例模式包括  **懒汉式、饿汉式、双检锁、静态内部类 和 枚举方式**  。

对于单例模式要考虑以下几个问题：

- **是否懒加载**
- **线程是否安全**
- 防止反射攻击
- 防止序列化和反序列化

总结了一下，有以下几种方式：

| 序号 | 单例模式                                                     | 概述                                                         |
| :--: | ------------------------------------------------------------ | ------------------------------------------------------------ |
|  1   | [懒汉式](https://github.com/xupengboo/DesignPatterns/tree/main/%E5%8D%95%E4%BE%8B%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo/%E6%87%92%E6%B1%89%E5%BC%8F) | [线程安全，效率低](https://github.com/xupengboo/DesignPatterns/blob/main/%E5%8D%95%E4%BE%8B%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo/%E6%87%92%E6%B1%89%E5%BC%8F/%E7%BA%BF%E7%A8%8B%E5%AE%89%E5%85%A8/Singleton.java) 、 [线程不安全](https://github.com/xupengboo/DesignPatterns/blob/main/%E5%8D%95%E4%BE%8B%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo/%E6%87%92%E6%B1%89%E5%BC%8F/%E7%BA%BF%E7%A8%8B%E4%B8%8D%E5%AE%89%E5%85%A8/Singleton.java) |
|  2   | [饿汉式](https://github.com/xupengboo/DesignPatterns/blob/main/%E5%8D%95%E4%BE%8B%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo/%E9%A5%BF%E6%B1%89%E5%BC%8F/Singleton.java) | 天然线程安全，但不符合懒加载                                 |
|  3   | [双检锁/双重校验锁](https://github.com/xupengboo/DesignPatterns/blob/main/%E5%8D%95%E4%BE%8B%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo/%E5%8F%8C%E6%A3%80%E9%94%81/Singleton.java) | 线程安全、符合懒加载、效率高，性能强于1，2                   |
|  4   | [静态内部类](https://github.com/xupengboo/DesignPatterns/blob/main/%E5%8D%95%E4%BE%8B%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo/%E9%9D%99%E6%80%81%E5%86%85%E9%83%A8%E7%B1%BB/Singleton.java) | 利用静态类实现，性能强于3                                    |
|  5   | [枚举方式](https://github.com/xupengboo/DesignPatterns/blob/main/%E5%8D%95%E4%BE%8B%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo/%E6%9E%9A%E4%B8%BE/Singleton.java) | 目前，最佳方式                                               |

## 3. 建造者模式

官方定义：建造者模式（builder pattern）使用多个简单的对象一步一步构建成一个复杂的对象。这种类型的设计模式属于创建型模式，它提供了一种创建对象的最佳方式。**建造者模式适用于构建具有复杂结构的对象，其构建过程较为稳定，但对象的表示需要灵活变化的情况。**

关键信息：**多个简单的对象一步一步构建成一个复杂的对象(将一个复杂对象的构建过程与其表示相分离，使得同样的构建过程可以创建不同的表示)**。

建造者模式可以细分为：**标准建造者模式、可配置的建造者模式 和 链式调用的建造者模式**。

> 🔍Tips：可以配合 [菜鸟教程 - 建造者模式](https://www.runoob.com/design-pattern/builder-pattern.html) 来进行学习。

**建造者模式通常包含以下几个核心角色**：

- 产品类（Product）：表示被构建的复杂对象。通常包含多个部分，这些部分的具体组成可以灵活变化。

- 抽象建造者（Builder）： 声明构建产品各个部分的抽象方法，是构建过程的接口。

- 具体建造者（Concrete Builder）： 实现抽象建造者接口，负责具体的构建过程，即如何构建各个部分。

- 指导者（Director）： 负责调用具体建造者来构建产品对象，通常包含构建的具体步骤。

| 建造者模式                                                                                                                                                                                                                                    | 概述                                                         |
|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------| :----------------------------------------------------------- |
| [标准建造者模式](https://github.com/xupengboo/DesignPatterns/tree/main/%E5%BB%BA%E9%80%A0%E8%80%85%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo/%E6%A0%87%E5%87%86%E5%BB%BA%E9%80%A0%E8%80%85%E6%A8%A1%E5%BC%8F)                               | 将一个复杂对象（产品）的构建过程与其表示分离，使得同样的构建过程可以创建不同的表示 |
| [可配置的建造者模式](https://github.com/xupengboo/DesignPatterns/tree/main/%E5%BB%BA%E9%80%A0%E8%80%85%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo/%E5%8F%AF%E9%85%8D%E7%BD%AE%E7%9A%84%E5%BB%BA%E9%80%A0%E8%80%85%E6%A8%A1%E5%BC%8F)           | 允许客户端在构建产品时进行更灵活的配置，通过提供一系列的配置方法来实现。 |
| [链式调用的建造者模式](https://github.com/xupengboo/DesignPatterns/tree/main/%E5%BB%BA%E9%80%A0%E8%80%85%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo/%E9%93%BE%E5%BC%8F%E8%B0%83%E7%94%A8%E7%9A%84%E5%BB%BA%E9%80%A0%E8%80%85%E6%A8%A1%E5%BC%8F) | 通过 `return this` 实现的链式调用效果。                      |

> 🔍Tips：**建造者模式与工厂模式的区别是：建造者模式更加关注与零件装配的顺序。**

## 4. 原型模式

官方定义：原型模式（prototype-pattern）是一种创建型设计模式，其主要目的是通过复制现有对象来创建新的对象，而不是通过实例化来创建。**原型模式适用于需要创建多个相似对象，但又不想通过耗费大量时间和资源的实例化过程来创建这些对象的情况。**


关键信息：**用于创建重复的对象，同时又能保证性能**。

原型模式主要分为两种类型：**浅克隆[^1]** 和 **深克隆[^2]**，也可以说成 浅拷贝 和 深拷贝。

[^1]: 在浅克隆中，只复制对象本身和其基本数据类型的字段。对于对象内部的引用类型字段，仍然使用原始对象内部的引用。这意味着原始对象和克隆对象共享相同的引用类型字段，对其中一个对象进行修改可能会影响到另一个对象。在Java中，可以通过实现`Cloneable`接口并覆写`clone`方法来实现浅克隆。默认的`clone`方法是浅克隆的。
[^2]: 在深克隆中，不仅复制对象本身和其基本数据类型的字段，还会递归地复制对象内部的引用类型字段。这意味着原始对象和克隆对象的引用类型字段是相互独立的，对其中一个对象进行修改不会影响到另一个对象。深克隆通常需要使用序列化和反序列化、手动递归复制对象等方式来确保所有的引用类型字段都被正确复制。

原型模式核心就是 **克隆操作**。

**在 Java 中，实现 浅克隆 方式有以下几种：**

- 可以通过实现 `Cloneable` 接口并重写 `clone` 方法来实现。`Object` 类中的 `clone` 方法是一个浅拷贝方法。
- 使用拷贝构造方法：

```java
class MyClass {
    private int primitiveField;
    private AnotherObject referenceField;

    // 拷贝构造方法
    public MyClass(MyClass original) {
        this.primitiveField = original.primitiveField;
        this.referenceField = original.referenceField;
    }
}
```

**在Java中，实现 深克隆 方式有以下几种**：

- 使用序列化和反序列化。

  > 🔍注意：对象及其所有引用类型字段都需要实现 `Serializable` 接口。

- 手动递归复制

- 使用第三方库

| 原型模式                                                     | 概述                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [浅克隆（浅拷贝）](https://github.com/xupengboo/DesignPatterns/tree/main/%E5%8E%9F%E5%9E%8B%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo/%E6%B5%85%E5%85%8B%E9%9A%86) | 实现Cloneable接口，重写Clone方法。                           |
| [深克隆（深拷贝）](https://github.com/xupengboo/DesignPatterns/tree/main/%E5%8E%9F%E5%9E%8B%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo/%E6%B7%B1%E5%85%8B%E9%9A%86) | 实现Serializable接口，将对象序列化为字节流，再进而将字节流反序列化为对象。 |

## 5. 适配器模式

官方定义：适配器模式（Adapter Pattern）是作为两个不兼容的接口之间的桥梁。这种类型的设计模式属于结构型模式，它结合了两个独立接口的功能。

关键信息：**通过将一个类的接口转换成客户端期望的接口，使得原本由于接口不匹配而无法协同工作的类能够协同工作。适配器充当一个中间层，解决了不同接口之间的兼容性问题。**

适配器模式通常有两种实现方式：**类适配器模式 和 对象适配器模式**。

**适配器模式主要包含以下几个角色**：

1. 目标接口（Target）： 定义客户端代码期望的接口，是客户端通过适配器调用的接口。
2. 适配器（Adapter）： 实现目标接口，并持有一个需要被适配的对象，负责把目标接口适配为被适配者接口。
3. 被适配者（Adaptee）： 拥有一个不符合目标接口的接口，是需要被适配的类。

| 适配器模式                                                   | 概述                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [类适配器模式](https://github.com/xupengboo/design-patterns/tree/main/%E9%80%82%E9%85%8D%E5%99%A8%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo/%E7%B1%BB%E9%80%82%E9%85%8D%E5%99%A8%E6%A8%A1%E5%BC%8F) | 通过继承被适配者类来实现适配器。适配器类既继承了目标接口，又持有了被适配者类的实例。 |
| [对象适配器模式](https://github.com/xupengboo/design-patterns/tree/main/%E9%80%82%E9%85%8D%E5%99%A8%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo/%E5%AF%B9%E8%B1%A1%E9%80%82%E9%85%8D%E5%99%A8%E6%A8%A1%E5%BC%8F) | 通过组合被适配者类的实例来实现适配器。适配器类持有被适配者类的实例，并实现了目标接口。 |

**适配器缺点**：过多地使用适配器，会让系统非常零乱，不易整体进行把握。比如，明明看到调用的是 A 接口，其实内部被适配成了 B 接口的实现。

> 🔍Tips：可以配合 [菜鸟教程 - 适配器模式](https://www.runoob.com/design-pattern/adapter-pattern.html) 来进行学习。

## 6. 桥接模式

官方定义：桥接模式（bridge-pattern）是一种结构型设计模式，它将抽象部分与实现部分分离，使它们可以独立变化而互不影响。桥接模式通过组合的方式，将抽象部分和实现部分分别设计，并通过一个桥接接口（Bridge）将它们连接起来。

关键信息：**桥接模式通过组合的方式，将抽象部分和实现部分分别设计，并通过一个桥接接口（Bridge）将它们连接起来。**

桥接模式的主要目的是 **避免在抽象层次和实现层次之间使用多层继承，从而使系统更加灵活、可扩展，且更容易维护。**

这种设计模式通常用于处理多维度变化的场景，例如 在图形系统中，形状和颜色可以独立变化，桥接模式可以帮助将这两个维度分离开来。

**桥接模式主要包含以下几个角色**：

1. 抽象类（Abstraction）： 定义抽象部分的接口，并维护一个对实现部分的引用。通常包含一个桥接接口的实例。
2. 扩展抽象类（RefinedAbstraction）：扩展抽象类，实现抽象部分的具体功能。它通常通过调用桥接接口中的方法来完成工作。
3. 实现接口（Implementor）： 定义实现部分的接口，通常包含一组方法。这个接口与抽象部分的接口可以不一样，但是通过桥接接口进行连接。
4. 具体实现类（ConcreteImplementor）： 实现实现部分的具体功能。具体实现类的方法将被扩展抽象类调用，完成实际的业务逻辑。

| 桥接模式                                                     | 概述                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [桥接](https://github.com/xupengboo/design-patterns/tree/main/%E6%A1%A5%E6%8E%A5%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo) | 将抽象部分与实现部分分离，使它们都可以独立的变化。举个例子：创建不同颜色的圆形，颜色就可以理解为抽象部分，圆形就是实现部分。 |

## 7. 过滤器模式

官方定义：过滤器模式（filter-pattern）是一种结构型设计模式，它允许通过一系列条件来过滤集合中的元素，从而实现对集合的筛选和过滤。过滤器模式将过滤逻辑封装在一个独立的过滤器对象中，使得过滤条件可以独立变化，同时还能保持对集合的操作封装和简化。


关键信息：**实现对集合的筛选和过滤。**

**过滤器模式主要包含以下几个角色**：

1. 过滤器接口（Filter）： 定义了过滤器对象的接口，通常包含一个过滤方法，用于对集合进行过滤。
2. 具体过滤器类（Concrete Filter）： 实现了过滤器接口，包含了具体的过滤逻辑。不同的具体过滤器类可以实现不同的过滤条件。
3. 过滤器链（Filter Chain）： 将多个过滤器对象串联起来，形成一个过滤器链。过滤器链可以按照一定的顺序依次对集合进行过滤。
4. 目标对象（Target）： 需要被过滤的集合对象。过滤器模式通常用于对集合进行筛选和过滤。

| 过滤器模式                                                   | 概述                                                  |
| ------------------------------------------------------------ | ----------------------------------------------------- |
| [过滤器](https://github.com/xupengboo/design-patterns/tree/main/%E8%BF%87%E6%BB%A4%E5%99%A8%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo) | 实现对集合的筛选和过滤，以对 Person类 人员过滤 为例。 |

## 8. 组合模式

官方定义：组合模式（composite-pattern），又叫部分整体模式，是用于把一组相似的对象当作一个单一的对象。组合模式依据树形结构来组合对象，用来表示部分以及整体层次。这种类型的设计模式属于结构型模式，它创建了对象组的树形结构。

关键信息：**将对象组合成树形结构以表示“部分-整体”的层次结构。**

**组合模式的核心角色包括：**

- 组件（Component）： 定义了组合中的对象的接口，可以是抽象类或者接口。组件类通常包含一些用于管理子组件的方法，例如添加、删除、获取子组件等。

- 叶子节点（Leaf）： 表示组合中的叶子节点，它没有子节点。叶子类通常是组合中的最小单元，它实现了组件接口的方法。
- 容器（Composite，也可以叫做 复合节点。）： 表示组合中的容器节点，它可以包含子节点。容器类通常是组合中的非叶子节点，它实现了组件接口的方法，并且包含了一个用于保存子节点的集合。

| 组合模式                                                     | 概述                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [组合模式](https://github.com/xupengboo/design-patterns/tree/main/%E7%BB%84%E5%90%88%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo) | 以 文件系统 为例：叶子节点就是文件File，容器（复合节点）就是文件夹。 |

## 9. 装饰器模式

官方定义：装饰器模式（decorator-pattern）是一种结构型设计模式，它允许在不改变原有对象结构的情况下，动态地给对象添加新的功能。装饰器模式通过将对象包装在一个装饰器对象中，然后在装饰器对象中添加新的行为，从而实现了对原有对象的功能扩展。

关键信息：**它允许在不改变原有对象结构的情况下，动态地给对象添加新的功能（针对某个对象进行功能扩展或者包装）。**

**装饰器模式包含以下几个核心角色：**

- 抽象组件（Component）：定义了原始对象和装饰器对象的公共接口或抽象类，可以是具体组件类的父类或接口。

- 具体组件（Concrete Component）：是被装饰的原始对象，它定义了需要添加新功能的对象。

- 抽象装饰器（Decorator）：继承自抽象组件，它包含了一个抽象组件对象，并定义了与抽象组件相同的接口，同时可以通过组合方式持有其他装饰器对象。

- 具体装饰器（Concrete Decorator）：实现了抽象装饰器的接口，负责向抽象组件添加新的功能。具体装饰器通常会在调用原始对象的方法之前或之后执行自己的操作。

  | 装饰器模式                                                   | 概述                                                         |
    | ------------------------------------------------------------ | ------------------------------------------------------------ |
  | [装饰器模式](https://github.com/xupengboo/design-patterns/tree/main/%E8%A3%85%E9%A5%B0%E5%99%A8%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo) | 针对某个对象进行功能扩展或者包装，以 给咖啡 加牛奶 加糖为例，同一杯咖啡添加牛奶与不添加牛奶价格可能不同，同理加糖也是。 |

## 10. 外观模式

官方定义：外观模式（facade-pattern）是一种结构型设计模式，它提供了一个统一的接口，用来访问子系统中的一组接口。外观模式的目的是简化客户端与子系统之间的交互，通过封装子系统的复杂性，提供一个更简单的接口给客户端使用。

关键信息：**简化客户端与子系统之间的交互，通过封装子系统的复杂性，提供一个更简单的接口给客户端使用**。

**外观模式主要包含以下几个角色**：

1. 外观（Facade）： 提供了一个统一的接口，用来访问子系统中的一组接口。外观类通常包含了对子系统的一系列操作，客户端可以通过外观类来访问子系统中的功能。
2. 子系统（Subsystem）： 实现了外观类中的一系列接口，是外观模式中的具体功能实现。子系统类通常是一个或者多个类的集合，它们共同实现了某个功能。
3. 客户端（Client）： 使用外观类来访问子系统中的功能。客户端不需要知道子系统的具体实现，只需要通过外观类来调用相关的方法。

| 外观模式                                                     | 概述                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [外观模式](https://github.com/xupengboo/design-patterns/tree/main/%E5%A4%96%E8%A7%82%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo) | 以 计算机为例，外观上就是电脑，但里面的子系统有 CPU、Memory、HardDriver等，启动的时候先启动哪个再启动哪个，用户无需关心。缺点也很明显：**不符合开闭原则**！如果要改东西很麻烦。 |

## 11. 享元模式

官方定义：享元模式（flyweight-pattern）是一种结构型设计模式，它通过共享对象来减少内存中对象的数量，从而提高系统的性能和效率。享元模式将对象分为两种：内部状态（Intrinsic State）和外部状态（Extrinsic State）。内部状态是对象的固有属性，可以共享；外部状态是对象的变化属性，不可以共享。

关键信息：**通过共享对象来减少内存中对象的数量**，从而提高系统的性能和效率。

**最常见的一个案例：数据库的连接池。**

**享元模式主要包含以下几个角色**：

1. 享元工厂（Flyweight Factory）： 用于创建和管理享元对象，它通常包含一个享元对象的缓存池，用于存储共享的对象。享元工厂类可以根据外部状态来返回具体的享元对象。
2. 抽象享元（Flyweight）： 定义了享元对象的接口，通常包含一个操作方法。抽象享元类通常是一个接口或者抽象类。
3. 具体享元（Concrete Flyweight）： 实现了抽象享元接口，是具体的享元对象。具体享元类通常包含一个内部状态，用于共享。
4. 客户端（Client）： 使用享元对象的客户端。客户端通常需要提供外部状态，以便享元工厂根据外部状态返回具体的享元对象。

| 享元模式                                                     | 概述                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [享元模式](https://github.com/xupengboo/design-patterns/tree/main/%E4%BA%AB%E5%85%83%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo) | 就是通过共享对象来减少内存中对象的数量，最常见的例如：数据库的连接池。 |

## 12. 代理模式

官方定义：代理模式（Proxy Pattern）是一种结构型设计模式，它允许通过一个代理对象来控制对另一个对象的访问。代理模式通常用于在访问对象时添加一些额外的功能，例如权限控制、日志记录等。代理模式将客户端和目标对象解耦，使得客户端可以通过代理对象来访问目标对象。

关键信息：**它允许通过一个代理对象来控制对另一个对象的访问。代理模式通常用于在访问对象时添加一些额外的功能，例如权限控制、日志记录等**。

**代理模式主要包含以下几个角色**：

1. 抽象主题（Subject）： 定义了目标对象和代理对象的共同接口，通常是一个接口或者抽象类。抽象主题类通常包含一个操作方法，用于执行目标对象的功能。
2. 具体主题（Real Subject）： 实现了抽象主题接口，是代理模式中的目标对象。具体主题类通常是一个具体的类，它包含了具体的功能实现。
3. 代理（Proxy）： 实现了抽象主题接口，同时包含一个对具体主题的引用。代理类通常是一个具体的类，它通过调用具体主题的方法来实现对目标对象的访问控制。

| 代理模式                                                     | 概述                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [代理模式](https://github.com/xupengboo/design-patterns/tree/main/%E4%BB%A3%E7%90%86%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo) | 一个代理对象来控制对另一个对象，再进而扩展一些额外功能。以网络访问为例子。 |

## 13. 责任链模式

官方定义：责任链模式（Chain of Responsibility Pattern）是一种行为型设计模式，它允许多个对象都有机会处理请求，从而避免了请求的发送者和接收者之间的耦合关系。责任链模式将请求的发送者和接收者解耦，避免请求发送者与接收者耦合在一起，让多个对象都有可能接收请求，将这些对象连接成一条链，并且沿着这条链传递请求，直到有对象处理它为止。

关键信息：在这种模式中，**通常每个接收者都包含对另一个接收者的引用。如果一个对象不能处理该请求，那么它会把相同的请求传给下一个接收者**，依此类推。

案例：servlet 的 Filter、JS中的事件冒泡。

**责任链模式主要包含以下几个角色**：

1. 抽象处理者（Handler）： 定义了一个处理请求的接口，通常是一个抽象类或者接口。抽象处理者类通常包含一个指向下一个处理者的引用，用于将请求传递给下一个处理者。
2. 具体处理者（Concrete Handler）： 实现了抽象处理者接口，是责任链模式中的具体处理者。具体处理者类通常是一个具体的类，它包含了具体的处理逻辑。
3. 客户端（Client）： 发送请求的客户端。客户端通常需要创建一个责任链，并将请求发送给责任链的第一个处理者。

| 责任链模式                                                   | 概述                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [责任链模式](https://github.com/xupengboo/design-patterns/tree/main/%E8%B4%A3%E4%BB%BB%E9%93%BE%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo) | 原理：内嵌next对象，如果一个对象不能处理该请求，那么它会把相同的请求传给下一个接收者。例如：请假审批 |

## 14. 命令模式

官方定义：命令模式（Command Pattern）是一种行为型设计模式，它将请求封装成一个对象，从而使得请求的发送者和接收者解耦。命令模式允许请求的发送者和接收者之间没有直接的关联关系，而是通过一个命令对象来进行通信。

关键信息：**命令模式允许请求的发送者和接收者之间没有直接的关联关系，而是通过一个命令对象来进行通信**。

**命令模式主要包含以下几个角色**：

1. 命令（Command）： 定义了一个操作的接口，通常包含一个 `execute` 方法，通常是一个抽象类或者接口。命令类通常包含一个执行操作的方法，用于执行具体的操作。
2. 具体命令（Concrete Command）： 实现了命令接口，是命令模式中的具体命令。具体命令类通常是一个具体的类，它包含了具体的操作逻辑。
3. 接收者（Receiver）： 实现了命令接口，是命令模式中的具体接收者。接收者类通常是一个具体的类，它包含了具体的操作逻辑。
4. 调用者（Invoker）： 负责调用命令对象来执行请求。调用者类通常是一个具体的类，它包含了一个命令对象的引用，并且通过调用命令对象的方法来执行请求。

案例场景：认为是命令的地方都可以使用命令模式，比如： 1、GUI 中每一个按钮都是一条命令。 2、模拟 CMD。

| 命令模式                                                     | 概述                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [命令模式](https://github.com/xupengboo/design-patterns/tree/main/%E5%91%BD%E4%BB%A4%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo) | 将一个命令对象化，包含`execute` 方法，通过一个命令对象进行通信。例如：电视遥控器 |

## 15. 解释器模式

官方定义：解释器模式（Interpreter Pattern）提供了评估语言的语法或表达式的方式，它属于行为型模式。这种模式实现了一个表达式接口，该接口解释一个特定的上下文。**这种模式被用在 SQL 解析、符号处理引擎等**。

关键信息：**给定一个语言，定义它的文法表示，并定义一个解释器，这个解释器使用该标识来解释语言中的句子**。

**解释器模式主要包含以下几个角色**：

1. 抽象表达式（Abstract Expression）： 定义了一个解释器的接口，通常是一个抽象类或者接口。抽象表达式类通常包含一个解释方法，用于解释和执行特定的语法规则。
2. 终结符表达式（Terminal Expression）： 实现了抽象表达式接口，是解释器模式中的终结符表达式。终结符表达式类通常是一个具体的类，它包含了具体的解释和执行逻辑。
3. 非终结符表达式（Non-terminal Expression）： 实现了抽象表达式接口，是解释器模式中的非终结符表达式。非终结符表达式类通常是一个具体的类，它包含了具体的解释和执行逻辑。
4. 上下文（Context）： 包含了解释器所需要的一些全局信息，例如变量的值、函数的定义等。上下文类通常是一个具体的类，它包含了具体的全局信息。

场景案例：编译器、运算表达式计算。

| 解释器模式                                                   | 概述                                             |
| ------------------------------------------------------------ | ------------------------------------------------ |
| [解释器模式](https://github.com/xupengboo/design-patterns/tree/main/%E8%A7%A3%E9%87%8A%E5%99%A8%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo) | 解释器解释语言中的句子，例如：编译器、四则运算。 |

## 16. 迭代器模式

官方定义：迭代器模式（Iterator Pattern）是 Java 和 .Net 编程环境中非常常用的设计模式。这种模式用于顺序访问集合对象的元素，不需要知道集合对象的底层表示。

关键信息：**用于顺序访问集合对象的元素**，不需要知道集合对象的底层表示。

**迭代器模式主要包含以下几个角色**：

1. 迭代器（Iterator）： 定义了一个遍历集合的接口，通常是一个抽象类或者接口。迭代器类通常包含了一些遍历集合的方法，例如 `hasNext()`、`next()` 等。
2. 具体迭代器（Concrete Iterator）： 实现了迭代器接口，是迭代器模式中的具体迭代器。具体迭代器类通常是一个具体的类，它包含了具体的遍历逻辑。
3. 集合（Aggregate）： 定义了一个集合的接口，通常是一个抽象类或者接口。集合类通常包含了一些操作集合的方法，例如 `add()`、`remove()` 等。
4. 具体集合（Concrete Aggregate）： 实现了集合接口，是迭代器模式中的具体集合。具体集合类通常是一个具体的类，它包含了具体的集合实现。


| 迭代器模式                                                   | 概述                                           |
| ------------------------------------------------------------ | ---------------------------------------------- |
| [迭代器模式](https://github.com/xupengboo/design-patterns/tree/main/%E8%BF%AD%E4%BB%A3%E5%99%A8%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo) | 用于顺序访问集合对象的元素，例如：Java的集合。 |

## 17. 中介者模式

官方定义：中介者模式（Mediator Pattern）是一种行为型设计模式，它用于减少对象之间的直接依赖关系，从而提高系统的灵活性和可维护性。**中介者模式通过引入一个中介者对象来协调对象之间的交互，从而使得对象之间不需要直接相互通信，而是通过中介者对象来进行通信**。

关键信息：对象与对象之间存在大量的关联关系，这样势必会导致系统的结构变得很复杂，同时若一个对象发生改变，我们也需要跟踪与之相关联的对象，同时做出相应的处理。

**中介者模式主要包含以下几个角色**：

1. 中介者（Mediator）： 定义了一个中介者的接口，通常是一个抽象类或者接口。中介者类通常包含了一些协调对象之间交互的方法。
2. 具体中介者（Concrete Mediator）： 实现了中介者接口，是中介者模式中的具体中介者。具体中介者类通常是一个具体的类，它包含了具体的协调逻辑。
3. 同事类（Colleague）： 定义了一个同事的接口，通常是一个抽象类或者接口。同事类通常包含了一些操作同事的方法。
4. 具体同事类（Concrete Colleague）： 实现了同事接口，是中介者模式中的具体同事类。具体同事类通常是一个具体的类，它包含了具体的操作逻辑。

场景模式：MVC 框架，其中C（控制器）就是 M（模型）和 V（视图）的中介者。

| 中介者模式 | 概述 |
| ---------- | ---- |
| [中介者模式](https://github.com/xupengboo/design-patterns/tree/main/%E4%B8%AD%E4%BB%8B%E8%80%85%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo) | 通过引入一个中介者对象来协调对象之间的交互，例如：qq聊天室 |

## 18. 备忘录模式

官方定义：备忘录模式（memento-pattern）是一种设计模式，主要用于在不破坏封装性的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态，以便以后需要时能将该对象恢复到原先保存的状态。**备忘录模式又叫快照模式**，属于行为型模式。

关键信息：**保存一个对象的某个状态，以便在适当的时候恢复对象**。

场景模式：打游戏时存档、编辑文本的ctrl + z。

**备忘录模式主要包含以下几个角色**：

1. 发起人（Originator）角色：记录当前时刻的内部状态信息，提供创建备忘录和恢复备忘录数据的功能，实现其他业务功能。它可以访问备忘录里的所有信息，并根据这些数据恢复其内部状态。
2. 备忘录（Memento）角色：负责存储发起人的内部状态，在需要的时候提供这些内部状态给发起人。它可以防止其他对象（除了发起人）访问备忘录。
3. 管理者（Caretaker）角色：对备忘录进行管理，提供保存与获取备忘录的功能。但它不能对备忘录的内容进行访问与修改，只能将备忘录传递给其他对象。

| 备忘录模式                                                   | 概述                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [备忘录模式](https://github.com/xupengboo/design-patterns/tree/main/%E5%A4%87%E5%BF%98%E5%BD%95%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo) | 保存一个对象的某个状态，以便在适当的时候恢复对象，例如：文本编辑 |

## 19. 观察者模式

官方定义：观察者模式（observer-pattern）是一种行为型设计模式，它定义了一种一对多的依赖关系，当一个对象的状态发生改变时，其所有依赖者都会收到通知并自动更新。

关键信息：**当一个对象的状态发生改变时，其所有依赖者都会收到通知并自动更新。比如，当一个对象被修改时，则会自动通知依赖它的对象**。

场景案例：拍卖的时候，拍卖师观察最高标价，然后通知给其他竞价者竞价。

| 观察者模式                                                   | 概述                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [观察者模式](https://github.com/xupengboo/design-patterns/tree/main/%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo) | 当一个对象的状态发生改变时，其所有依赖者都会收到通知并自动更新。 |

## 20. 状态模式

官方定义：状态模式（state-pattern）是一种行为型设计模式，类的行为是基于它的状态改变的。

关键信息：**类的行为是基于它的状态改变的**。

场景案例：假设我们有一个电视遥控器的场景，遥控器有开机、关机、调频道和调音量这四个功能。但只有在开机状态下，用户才能调频道和调音量。

| 状态模式                                                     | 概述                           |
| ------------------------------------------------------------ | ------------------------------ |
| [状态模式](https://github.com/xupengboo/design-patterns/tree/main/%E7%8A%B6%E6%80%81%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo) | 类的行为是基于它的状态改变的。 |

## 21. 策略模式

官方定义：策略模式（strategy-pattern）是一种行为型设计模式，它允许在运行时根据上下文情况选择算法的行为。在策略模式定义了一系列算法或策略，并将每个算法封装在独立的类中，使得它们可以互相替换。

关键信息：**在策略模式定义了一系列算法或策略，并将每个算法封装在独立的类中，使得它们可以互相替换**。

场景案例：诸葛亮的锦囊妙计，每一个锦囊就是一个策略。旅行的出游方式，选择骑自行车、坐汽车，每一种旅行方式都是一个策略。

**策略模式主要组成部分通常包括**：

1. 环境类（Context）：持有一个Strategy的引用。
2. 抽象策略类（Strategy）：这是一个抽象角色，通常由一个接口或抽象类实现。此角色给出所有的具体策略类所需实现的接口。
3. 具体策略类（ConcreteStrategy）：包装了相关的算法或行为。

| 策略模式     | 概述                                               |
| ------------ | -------------------------------------------------- |
| [策略模式](https://github.com/xupengboo/xupengboo-design-patterns/tree/main/%E7%AD%96%E7%95%A5%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo) | 将每个算法封装在独立的类中，使得它们可以互相替换。 |

## 22. 模板模式

官方定义：模板模式（template-pattern）是一种行为性设计模式。在模板模式中，一个抽象类公开定义了执行它的方法的方式/模板。它的子类可以按需要重写方法实现，但调用将以抽象类中定义的方式进行。

关键信息：定义一个操作中的算法的骨架，而将一些步骤延迟到子类中。

场景案例：在造房子的时候，地基、走线、水管都一样，只有在建筑的后期才有加壁橱加栅栏等差异。

**模板模式主要组成部分通常包括**：

- 抽象模板角色：定义了一个或多个抽象操作，以便让子类实现。

| 模板模式                                                     | 概述                         |
| ------------------------------------------------------------ | ---------------------------- |
| [模板模式](https://github.com/xupengboo/design-patterns/tree/main/%E6%A8%A1%E6%9D%BF%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo) | 定义一个操作中的算法的骨架。 |

## 23. 访问者模式

官方定义：访问者模式（visitor-pattern）是一种行为设计模式，它主要将数据结构中的元素操作分离出来并封装成独立的类，使得在不改变数据结构的前提下，可以添加作用于这些元素的新的操作。这种模式的核心思想是将数据结构与数据操作分离，从而使得操作集合可以相对自由地演化而不影响数据结构的稳定性。

关键信息：**主要将数据结构与数据操作分离**。

**访问者模式主要组成部分通常包括**：

- 访问者（Visitor）：访问者则可以对这些不同类型的元素执行特定的操作。
- 被访问元素（Element）：被访问元素通常具有不同的类型。
- 对象结构（Object Structure）：负责存储和管理这些被访问元素，并允许访问者遍历和访问它们。

场景案例：您在朋友家做客，您是访问者，朋友接受您的访问，您通过朋友的描述，然后对朋友的描述做出一个判断，这就是访问者模式。

| 访问者模式                                                   | 概述                           |
| ------------------------------------------------------------ | ------------------------------ |
| [访问者模式](https://github.com/xupengboo/design-patterns/tree/main/%E8%AE%BF%E9%97%AE%E8%80%85%E6%A8%A1%E5%BC%8F/src/main/java/com/xupengboo) | 主要将数据结构与数据操作分离。 |



