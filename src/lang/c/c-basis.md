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

### 3.1 基本数据类型

1. 整数类型：

```c
char grade = 'A';          // 存储字符
signed char temperature = -5;  // 有符号小整数
unsigned char byte = 255; // 无符号（0-255）

short score = 32767;       // 短整数
int population = 2100000000;  // 默认整数
long bigNumber = 123456789L;  // 长整数
long long hugeNumber = 9223372036854775807LL; // 极大整数
```

| 类型           | 存储大小    | 值范围                                               |
| :------------- | :---------- | :--------------------------------------------------- |
| char           | 1 字节      | -128 到 127 或 0 到 255                              |
| unsigned char  | 1 字节      | 0 到 255                                             |
| signed char    | 1 字节      | -128 到 127                                          |
| int            | 2 或 4 字节 | -32,768 到 32,767 或 -2,147,483,648 到 2,147,483,647 |
| unsigned int   | 2 或 4 字节 | 0 到 65,535 或 0 到 4,294,967,295                    |
| short          | 2 字节      | -32,768 到 32,767                                    |
| unsigned short | 2 字节      | 0 到 65,535                                          |
| long           | 4 字节      | -2,147,483,648 到 2,147,483,647                      |
| unsigned long  | 4 字节      | 0 到 4,294,967,295                                   |


2. 浮点类型：

```c
// 类型如下：
float pi = 3.1415926f;    // 单精度（末尾加f）
double distance = 1.4959787e11; // 科学计数法（地球到太阳的距离，单位米）
long double preciseValue = 3.141592653589793238L; // 高精度计算

// 头文件 <float.h> 定义了关于float的宏。 
#include <stdio.h> 
#include <float.h>

int main() {
    printf("float 存储最大字节数 : %lu \n", sizeof(float));
    printf("float 最小值: %E\n", FLT_MIN );
    printf("float 最大值: %E\n", FLT_MAX );
    printf("精度值: %d\n", FLT_DIG );
    return 0;
}
```

> C 语言中的 字符串（string）不是基本数据类型，而是字符数据（char 数据）或 字符指针（char *）的形式。

| 类型        | 存储大小 | 值范围                 | 精度        |
| :---------- | :------- | :--------------------- | :---------- |
| float       | 4 字节   | 1.2E-38 到 3.4E+38     | 6 位有效位  |
| double      | 8 字节   | 2.3E-308 到 1.7E+308   | 15 位有效位 |
| long double | 16 字节  | 3.4E-4932 到 1.1E+4932 | 19 位有效位 |

`sizeof` 运算符：得到对象或类型的存储字节大小。

```c
#include <stdio.h> 
#include <limits.h>

int main() {
    printf("int 存储大小：%lu \n", sizeof(int)); // 输出：4 
    return 0;
}
```

> `#include <limits.h>` 头文件的作用是 **定义整数类型的取值范围**，包括 `char`、`short`、`int`、`long` 和 `long long` 等数据类型的最大值、最小值等常量。
>
> 在 C 语言中，**不同系统、不同编译器** 可能会使用不同的整数大小，因此 `limits.h` 提供了一组标准化的宏来确保程序能够适应不同的环境。

### 3.2  类型转换

隐式类型转换：隐式类型转换是在表达式中自动发生的，无需进行任何明确的指令或函数调用。

```c
#include <stdio.h> 

int main() {
    int i = 10;
    float f = 3.14;

    double d = i + f; // 隐式将int类型转换为double类型。
    printf("结果为：%f", d); // 注意：因为d转为了double类型，所以这里不能用 %d ，而是使用 %f 代替。
    return 0;
}
```

显示类型转换：显式类型转换需要使用强制类型转换运算符（type casting operator），它可以将一个数据类型的值强制转换为另一种数据类型的值。

```c
#include <stdio.h> 

int main() {
    double d = 3.14159;
    int i = (int) d; // 显式将double类型转换为int类型
    printf("结果为： %d", i); 
    return 0;
}
```

## 4. C 变量

变量其实只不过是程序可操作的存储区的名称。变量的名称可以由字母、数字和下划线字符组成。它必须以字母或下划线开头。大写字母和小写字母是不同的，因为 C 是大小写敏感的。

![image-20250314104432780](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250314104432780.png)

```c
int age;		// 定义整型变量
float salary;	// 定义浮点型变量
char grade;		// 定义字符型变量
int *ptr;		// 定义指针变量
int    i, j, k;  // 定义多个变量
extern int d;	 // 声明外部变量
```

在 C 语言中，如果变量没有显式初始化，那么它的默认值将取决于该变量的类型和其所在的作用域。

- 整型变量（int、short、long等）：默认值为0。
- 浮点型变量（float、double等）：默认值为0.0。
- 字符型变量（char）：默认值为'\0'，即空字符。
- 指针变量：默认值为NULL，表示指针不指向任何有效的内存地址。
- 对于全局变量和静态变量（在函数内部定义的静态变量和在函数外部定义的全局变量），它们的默认初始值为零。



`extern` 关键字使用：在一个源文件中引用另外一个源文件中定义的变量，我们只需在引用的文件中将变量加上 extern 关键字的声明即可。

例如：

- `addtwonum.c` 文件代码：

```c
#include <stdio.h>

/* 外部变量声明 */
extern int x;
extern int y;

int addtwonum() {
    return x + y;
}
```

- `test.c` 文件代码：

```c
# include <stdio.h>

/* 定义两个全局变量 */
int x = 1;
int y = 2;
int addtwonum();

int main(void) {
    int result;
    result = addtwonum();
    printf("result 为：%d\n", result);
    return 0;
}
```

将 ``addtwonum.c` 和 `test.c` 一起编译：

```powershell
$ gcc addtwonum.c test.c -o main
$ ./main
result 为: 3
```

:::tip 了解

1. **左值（lvalue）：**指向内存位置的表达式被称为左值（lvalue）表达式。左值可以出现在赋值号的左边或右边。
2. **右值（rvalue）：**术语右值（rvalue）指的是存储在内存中某些地址的数值。右值是不能对其进行赋值的表达式，也就是说，右值可以出现在赋值号的右边，但不能出现在赋值号的左边。

例如：

```c
int g = 20;
```

:::

##  5. C 常量















