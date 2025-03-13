---
title: C 基础
order: 1
---

## 1. 环境准备

1. 安装 C 编译器：

- UNIX / Linux 需要安装：`gcc` [`gcc -v` 查看是否安装了GCC]
- Windows 系统需要安装： `Cygwin` 或者 `MinGW-w64`

> 具体步骤：https://www.runoob.com/cprogramming/c-environment-setup.html

2. 学习工具：Vs code

- 安装 C/C++ 扩展

![image-20250105231735714](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250105231735714.png)

3. 安装 `MinGW-w64` ：

- 官方地址：https://www.mingw-w64.org/downloads/

- Window 64位：需下载 `x86_64-*` 开头的。本次下载：[x86_64-12.2.0-release-posix-seh-msvcrt-rt_v10-rev2.7z](https://github.com/niXman/mingw-builds-binaries/releases/download/12.2.0-rt_v10-rev2/x86_64-12.2.0-release-posix-seh-msvcrt-rt_v10-rev2.7z)

4. 配置 环境变量 ：

![image-20250313153138351](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250313153138351.png)

5. `cmd` 输入 `gcc --version` 检验：

![image-20250313153516209](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250313153516209.png)

6. 配置 C/C++ 插件，相关配置到已经安装的Minw64

![image-20250313160259028](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250313160259028.png)

![image-20250313160339412](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250313160339412.png)



## 2. C  基础语法

### 2.1 预处理器指令 和 `<stdio.h>` 

```c
#include <stdio.h> 

// 主函数
int main() {
    printf("Hello, World \n");
    return 0;
}
```

1. 预处理器指令：`#include`、`#define` 。
2. `<stdio.h>` 是 C 标准库中的一个头文件，全称为 `Standard Input/Output Header`，它定义了许多与输入输出相关函数类型等，例如：`printf` 等等。

### 2.2 `&` 取址运算符 作用

在 C 语言中，函数参数默认是 按值传递的，即函数接受的是变量的值，而不是变量的本身。

`&` 是取地址运算符，用于获取变量的内存地址，这样下面`scanf` 函数必须添加 ` &` 才能给 `num1`、`num2` 赋值。

```c
#include <stdio.h> 
#define PI 3.14159

// 1. 函数声明
int add(int a, int b); 

// 2. 函数定义
int add(int a, int b) {
    return a + b;
}

int main() {
    
    // 变量声明
    int num1, num2, sum;
    
    printf("Enter two integers: ");
    scanf("%d %d", &num1, &num2);

    // 3. 函数调用
    sum = add(num1, num2);
    printf("Sum：%d\n", sum);

    return 0;
}
```

>  宏定义`#define PI 3.14159`：宏是通过 `#define` 指令定义的符号常量或代码片段。

 ### 2.3 分隔符

分隔符用于分隔语句和表达式，常见的分隔符包括：

- **逗号 \**,\**** ：用于分隔变量声明或函数参数。
- **分号 \**;\**** ：用于结束语句。
- 括号：
  - 圆括号 **`()`** 用于分组表达式、函数调用。
  - 花括号 **`{}`** 用于定义代码块。
  - 方括号 **`[]`** 用于数组下标。

### 2.4 注释

```c
// 这是单行注释

/*
这是多行注释
它可以跨越多行
*/
```

### 2.5 常量

```c
const int MAX = 100;  // 整型常量
const float PI = 3.14;  // 浮点型常量
const char NEWLINE = '\n';  // 字符常量
```

### 2.6 字符串字面量

```c
char greeting[] = "Hello, World!";
```

> 在 C 语言中，字符串字面量会自动在末尾添加一个空字符（`\0`），表示字符串的结束。例如，`"Hello"` 实际上在内存中存储为 `'H' 'e' 'l' 'l' 'o' '\0'`。

### 2.7 运算符（Operators）

运算符用于执行各种操作，如算术运算、逻辑运算、比较运算等。

C 语言中的运算符种类繁多，常见的包括：

- 算术运算符：`+`, `-`, `*`, `/`, `%`
- 关系运算符：`==`, `!=`, `>`, `<`, `>=`, `<=`
- 逻辑运算符：`&&`, `||`, `!`
- 位运算符：`&`, `|`, `^`, `~`, `<<`, `>>`
- 赋值运算符：`=`, `+=`, `-=`, `*=`, `/=`, `%=`
- 其他运算符：`sizeof`, `?:`, `&`, `*`, `->`, `.`

```c
int a = 5, b = 10;
int sum = a + b;  // 使用算术运算符 +
int isEqual = (a == b);  // 使用关系运算符 ==
```

## 3. C 数据类型

### 1. 基本数据类型





2. 枚举类型：



3. void 类型：



4. 派生类型：



