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

:::tip

`#include <limits.h>` 头文件的作用是 **定义整数类型的取值范围**，包括 `char`、`short`、`int`、`long` 和 `long long` 等数据类型的最大值、最小值等常量。

在 C 语言中，**不同系统、不同编译器** 可能会使用不同的整数大小，因此 `limits.h` 提供了一组标准化的宏来确保程序能够适应不同的环境。

:::

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

将 `addtwonum.c` 和 `test.c` 一起编译：

```powershell
$ gcc addtwonum.c test.c -o main
$ ./main
result 为: 3
```

:::tip 了解

1. 左值（lvalue）：指向内存位置的表达式被称为左值（lvalue）表达式。左值可以出现在赋值号的左边或右边。
2. 右值（rvalue）：术语右值（rvalue）指的是存储在内存中某些地址的数值。右值是不能对其进行赋值的表达式，也就是说，右值可以出现在赋值号的右边，但不能出现在赋值号的左边。

例如：

```c
int g = 20;
```

:::

##  5. C 常量

### 5.1 整数常量

常量是固定值，在程序执行期间不会改变。这些固定的值，又叫做***字面量***。

**整数常量可以是十进制、八进制或十六进制的常量**。前缀指定基数：0x 或 0X 表示十六进制，0 表示八进制，不带前缀则默认表示十进制。

整数常量也可以带一个后缀，**后缀是 U 和 L 的组合**，U 表示无符号整数（unsigned），L 表示长整数（long）。后缀可以是大写，也可以是小写，U 和 L 的顺序任意。

```c
85         /* 十进制 */
0213       /* 八进制 */
0x4b       /* 十六进制 */
30         /* 整数 */
30u        /* 无符号整数 */
30l        /* 长整数 */
30ul       /* 无符号长整数 */
    
    
/* 以下是两个不合法的 */
078         /* 非法的：8 不是八进制的数字，八进制数的每一位只能是 0 到 7，而 8 是无效的。 */
032UU       /* 非法的：不能重复后缀 */
```

### 5.2 浮点常量

浮点常量由整数部分、小数点、小数部分和指数部分组成。可以使用小数形式或者指数形式来表示浮点常量。

例如：

```c
3.14159       /* 合法的 */
314159E-5L    /* 合法的 */
    
510E          /* 非法的：不完整的指数 */
210f          /* 非法的：没有小数或指数 */
.e55          /* 非法的：缺少整数或分数 */
```

在 C/C++ 中，浮点数可以用科学计数法（指数是用 e 或 E 引入的）表示，其格式为

```c
// 格式：<尾数>E<指数>

float a = 5.10E2;  // 表示 5.10 × 10² = 510.0
float b = 5.10E-2; // 表示 5.10 × 10⁻² = 0.0510
float c = 5E3;     // 表示 5 × 10³ = 5000.0


float d = 510E;    // 非法：E 后面没有指数
float e = 5.10E;   // 非法：E 后面没有指数
float f = 5E;      // 非法：E 后面没有指数
```

### 5.3 字符常量

字符常量是括在单引号中，例如，'x' 可以存储在 **char** 类型的简单变量中。

反斜杠，转义字符：

| 转义序列   | 含义                       |
| :--------- | :------------------------- |
| \\         | \ 字符                     |
| \'         | ' 字符                     |
| \"         | " 字符                     |
| \?         | ? 字符                     |
| \a         | 警报铃声                   |
| \b         | 退格键                     |
| \f         | 换页符                     |
| \n         | 换行符                     |
| \r         | 回车                       |
| \t         | 水平制表符                 |
| \v         | 垂直制表符                 |
| \ooo       | 一到三位的八进制数         |
| \xhh . . . | 一个或多个数字的十六进制数 |

字符常量的 ASCII 值可以通过强制类型转换转换为整数值。

```c
char myChar = 'a';
int myAsciiValue = (int) myChar; // 将 myChar 转换为 ASCII 值 97
```

### 5.4 定义常量

1. 使用 `#define` 预处理器定义常量：

```c
#define 常量名 常量值
```

2. `const` 前缀声明指定类型的常量：

```c
const 数据类型 常量名 = 常量值;
```

:::tip 这俩有啥区别？了解

\#define 与 const 这两种方式都可以用来定义常量，选择哪种方式取决于具体的需求和编程习惯。通常情况下，建议使用 const 关键字来定义常量，因为它具有类型检查和作用域的优势，而 #define 仅进行简单的文本替换，可能会导致一些意外的问题。

\#define 预处理指令和 const 关键字在定义常量时有一些区别：

- 替换机制：`#define` 是进行简单的文本替换，而 `const` 是声明一个具有类型的常量。`#define` 定义的常量在编译时会被直接替换为其对应的值，而 `const` 定义的常量在程序运行时会分配内存，并且具有类型信息。
- 类型检查：`#define` 不进行类型检查，因为它只是进行简单的文本替换。而 `const` 定义的常量具有类型信息，编译器可以对其进行类型检查。这可以帮助捕获一些潜在的类型错误。
- 作用域：`#define` 定义的常量没有作用域限制，它在定义之后的整个代码中都有效。而 `const` 定义的常量具有块级作用域，只在其定义所在的作用域内有效。
- 调试和符号表：使用 `#define` 定义的常量在符号表中不会有相应的条目，因为它只是进行文本替换。而使用 `const` 定义的常量会在符号表中有相应的条目，有助于调试和可读性。

:::

## 6. C 存储类

1. `auto` 是默认的存储类，用于声明局部变量。`auto` 变量在函数或块内定义，生命周期仅限于函数或块的执行期间。例如：

```c
#include <stdio.h>

void func() {
    auto int x = 10; // auto 是默认的，可以省略
    printf("x = %d\n", x);
}

int main() {
    func();
    return 0;
}
```



2. `register` 存储类是建议编译器将变量存储在 CPU 寄存器中，以提高访问速度。

```c
#include <stdio.h>

void func() {
    register int counter; // 建议将 counter 存储在寄存器中
    for (counter = 0; counter < 5; counter++) {
        printf("counter = %d\n", counter);
    }
}

int main() {
    func();
    return 0;
}
```



3. `static` 存储类：
   - 对于局部变量：`static` 使变量的生命周期延长到整个程序运行期间，但作用域仍为局部。
   - 对于全局变量或函数：`static` 将变量或函数的作用域限制在当前文件内（文件作用域）。

```c
#include <stdio.h>

void func() {
    static int count = 0; // static 变量，生命周期延长
    count++;
    printf("count = %d\n", count);
}

int main() {
    func();
    func();
    func();
    return 0;
}


#include <stdio.h>

static int globalVar = 100; // static 全局变量，作用域限制在当前文件内

void func() {
    printf("globalVar = %d\n", globalVar);
}

int main() {
    func();
    return 0;
}
```



4. `extern` 存储类：用于声明在其他文件中定义的全局变量或函数。`extern` 告诉编译器变量或函数的定义在其他文件中。

假设有两个文件：`file1.c` 和 `file2.c`：

```c
// file1.c
#include <stdio.h>

int globalVar = 42; // 定义全局变量
```

```c
// file2.c
#include <stdio.h>

extern int globalVar; // 声明外部变量

int main() {
    printf("globalVar = %d\n", globalVar);
    return 0;
}
```

```powershell
# 编译运行
gcc file1.c file2.c -o main
./main
```

|   存储类   |     作用域     |      生命周期      | 存储位置 |                     用途                     |
| :--------: | :------------: | :----------------: | :------: | :------------------------------------------: |
|   `auto`   |      局部      | 函数或块的执行期间 |  栈内存  |                默认的局部变量                |
| `register` |      局部      | 函数或块的执行期间 |  寄存器  |    建议将变量存储在寄存器中以提高访问速度    |
|  `static`  |   局部或文件   |  整个程序运行期间  | 静态内存 | 延长局部变量的生命周期或限制全局变量的作用域 |
|  `extern`  | 全局（跨文件） |  整个程序运行期间  | 静态内存 |              声明外部变量或函数              |

## 7. C 运算符

1. 算数运算符

| 运算符 | 描述                             | 实例             |
| :----- | :------------------------------- | :--------------- |
| +      | 把两个操作数相加                 | A + B 将得到 30  |
| -      | 从第一个操作数中减去第二个操作数 | A - B 将得到 -10 |
| *      | 把两个操作数相乘                 | A * B 将得到 200 |
| /      | 分子除以分母                     | B / A 将得到 2   |
| %      | 取模运算符，整除后的余数         | B % A 将得到 0   |
| ++     | 自增运算符，整数值增加 1         | A++ 将得到 11    |
| --     | 自减运算符，整数值减少 1         | A-- 将得到 9     |

2. 关系运算符

| 运算符 | 描述                                                         | 实例            |
| :----- | :----------------------------------------------------------- | :-------------- |
| ==     | 检查两个操作数的值是否相等，如果相等则条件为真。             | (A == B) 为假。 |
| !=     | 检查两个操作数的值是否相等，如果不相等则条件为真。           | (A != B) 为真。 |
| >      | 检查左操作数的值是否大于右操作数的值，如果是则条件为真。     | (A > B) 为假。  |
| <      | 检查左操作数的值是否小于右操作数的值，如果是则条件为真。     | (A < B) 为真。  |
| >=     | 检查左操作数的值是否大于或等于右操作数的值，如果是则条件为真。 | (A >= B) 为假。 |
| <=     | 检查左操作数的值是否小于或等于右操作数的值，如果是则条件为真。 | (A <= B) 为真。 |

3. 逻辑运算符

| 运算符 | 描述                                                         | 实例              |
| :----- | :----------------------------------------------------------- | :---------------- |
| &&     | 称为逻辑与运算符。如果两个操作数都非零，则条件为真。         | (A && B) 为假。   |
| \|\|   | 称为逻辑或运算符。如果两个操作数中有任意一个非零，则条件为真。 | (A \|\| B) 为真。 |
| !      | 称为逻辑非运算符。用来逆转操作数的逻辑状态。如果条件为真则逻辑非运算符将使其为假。 | !(A && B) 为真。  |

4. 位运算符

位运算符作用于位，并逐位执行操作。&、 | 和 ^ 的真值表如下所示

| 运算符 | 描述                                                         | 实例                                                         |
| :----- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| &      | 对两个操作数的每一位执行逻辑与操作，如果两个相应的位都为 1，则结果为 1，否则为 0。按位与操作，按二进制位进行"与"运算。运算规则：`0&0=0;    0&1=0;     1&0=0;      1&1=1;` | (A & B) 将得到 12，即为 0000 1100                            |
| \|     | 对两个操作数的每一位执行逻辑或操作，如果两个相应的位都为 0，则结果为 0，否则为 1。按位或运算符，按二进制位进行"或"运算。运算规则：`0|0=0;    0|1=1;    1|0=1;     1|1=1;` | (A \| B) 将得到 61，即为 0011 1101                           |
| ^      | 对两个操作数的每一位执行逻辑异或操作，如果两个相应的位值相同，则结果为 0，否则为 1。异或运算符，按二进制位进行"异或"运算。运算规则：`0^0=0;    0^1=1;    1^0=1;   1^1=0;` | (A ^ B) 将得到 49，即为 0011 0001                            |
| ~      | 对操作数的每一位执行逻辑取反操作，即将每一位的 0 变为 1，1 变为 0。取反运算符，按二进制位进行"取反"运算。运算规则：`~1=-2;    ~0=-1;` | (~A ) 将得到 -61，即为 1100 0011，一个有符号二进制数的补码形式。 |
| <<     | 将操作数的所有位向左移动指定的位数。左移 n 位相当于乘以 2 的 n 次方。二进制左移运算符。将一个运算对象的各二进制位全部左移若干位（左边的二进制位丢弃，右边补0）。 | A << 2 将得到 240，即为 1111 0000                            |
| >>     | 将操作数的所有位向右移动指定的位数。右移n位相当于除以 2 的 n 次方。二进制右移运算符。将一个数的各二进制位全部右移若干位，正数左补 0，负数左补 1，右边丢弃。 | A >> 2 将得到 15，即为 0000 1111                             |

5. 赋值运算符

| 运算符 | 描述                                                         | 实例                            |
| :----- | :----------------------------------------------------------- | :------------------------------ |
| =      | 简单的赋值运算符，把右边操作数的值赋给左边操作数             | C = A + B 将把 A + B 的值赋给 C |
| +=     | 加且赋值运算符，把右边操作数加上左边操作数的结果赋值给左边操作数 | C += A 相当于 C = C + A         |
| -=     | 减且赋值运算符，把左边操作数减去右边操作数的结果赋值给左边操作数 | C -= A 相当于 C = C - A         |
| *=     | 乘且赋值运算符，把右边操作数乘以左边操作数的结果赋值给左边操作数 | C *= A 相当于 C = C * A         |
| /=     | 除且赋值运算符，把左边操作数除以右边操作数的结果赋值给左边操作数 | C /= A 相当于 C = C / A         |
| %=     | 求模且赋值运算符，求两个操作数的模赋值给左边操作数           | C %= A 相当于 C = C % A         |
| <<=    | 左移且赋值运算符                                             | C <<= 2 等同于 C = C << 2       |
| >>=    | 右移且赋值运算符                                             | C >>= 2 等同于 C = C >> 2       |
| &=     | 按位与且赋值运算符                                           | C &= 2 等同于 C = C & 2         |
| ^=     | 按位异或且赋值运算符                                         | C ^= 2 等同于 C = C ^ 2         |
| \|=    | 按位或且赋值运算符                                           | C \|= 2 等同于 C = C \| 2       |

6. 杂项运算符 ↦ sizeof & 三元

| 运算符   | 描述             | 实例                                 |
| :------- | :--------------- | :----------------------------------- |
| sizeof() | 返回变量的大小。 | sizeof(a) 将返回 4，其中 a 是整数。  |
| &        | 返回变量的地址。 | &a; 将给出变量的实际地址。           |
| *        | 指向一个变量。   | *a; 将指向一个变量。                 |
| ? :      | 条件表达式       | 如果条件为真 ? 则值为 X : 否则值为 Y |

## 8. C 运算符的优先级

**完整优先级表（简版）**

| 优先级 | 运算符                                                       | 结合性 |        |        |
| :----- | :----------------------------------------------------------- | :----- | ------ | ------ |
| 最高   | `()` `[]` `.` `->` `++`(后缀) `--`(后缀)                     | 左到右 |        |        |
|        | `!` `~` `++`(前缀) `--`(前缀) `+`(正) `-`(负) `*`(解引用) `&`(取地址) `sizeof` | 右到左 |        |        |
|        | `*` `/` `%`                                                  | 左到右 |        |        |
|        | `+` `-`                                                      | 左到右 |        |        |
|        | `<<` `>>`                                                    | 左到右 |        |        |
|        | `<` `<=` `>` `>=`                                            | 左到右 |        |        |
|        | `==` `!=`                                                    | 左到右 |        |        |
|        | `&`                                                          | 左到右 |        |        |
|        | `^`                                                          | 左到右 |        |        |
|        | `                                                            | `      | 左到右 |        |
|        | `&&`                                                         | 左到右 |        |        |
|        | `                                                            |        | `      | 左到右 |
|        | `?:`                                                         | 右到左 |        |        |
|        | `=` `+=` `-=` `*=` `/=` 等                                   | 右到左 |        |        |
| 最低   | `,`                                                          | 左到右 |        |        |

:::tip 一般常用算数运算符

算数运算符：乘除模 > 加减

:::

## 9. C 判断

C 语言把任何**非零**和**非空**的值假定为 **true**，把**零**或**null** *假定为* **false***。

| 语句             | 描述                                                         |
| :--------------- | :----------------------------------------------------------- |
| if 语句          | 一个 **if 语句** 由一个布尔表达式后跟一个或多个语句组成。    |
| if...else 语句   | 一个 **if 语句** 后可跟一个可选的 **else 语句**，else 语句在布尔表达式为假时执行。 |
| 嵌套 if 语句     | 您可以在一个 **if** 或 **else if** 语句内使用另一个 **if** 或 **else if** 语句。 |
| switch 语句      | 一个 **switch** 语句允许测试一个变量等于多个值时的情况。     |
| 嵌套 switch 语句 | 您可以在一个 **switch** 语句内使用另一个 **switch** 语句。   |

三元运算符：`Exp1 ? Exp2 : Exp3;`

```c
# include <stdio.h>

/* 定义两个全局变量 */
int x = 1;
int y = 2;
int addtwonum();

int main(void) {
    int num;

    printf("输入一个数字：");
    scanf("%d", &num);

    (num % 2 == 0) ? printf("偶数") : printf("奇数");

    return 0;
}
```

## 10. C 循环

循环类型：

| 循环类型        | 描述                                                         |
| :-------------- | :----------------------------------------------------------- |
| while 循环      | 当给定条件为真时，重复语句或语句组。它会在执行循环主体之前测试条件。 |
| for 循环        | 多次执行一个语句序列，简化管理循环变量的代码。               |
| do...while 循环 | 除了它是在循环主体结尾测试条件外，其他与 while 语句类似。    |
| 嵌套循环        | 您可以在 while、for 或 do..while 循环内使用一个或多个循环。  |

循环控制语句：

| 控制语句      | 描述                                                         |
| :------------ | :----------------------------------------------------------- |
| break 语句    | 终止**循环**或 **switch** 语句，程序流将继续执行紧接着循环或 switch 的下一条语句。 |
| continue 语句 | 告诉一个循环体立刻停止本次循环迭代，重新开始下次循环迭代。   |
| goto 语句     | 将控制转移到被标记的语句。但是不建议在程序中使用 goto 语句。 |

## 11. C 函数

注意一下几点：

1. 函数如何声明。
2. 函数如何调用。

```c
#include <stdio.h>
 
/* 函数声明 */
int max(int num1, int num2);
 
int main ()
{
   /* 局部变量定义 */
   int a = 100;
   int b = 200;
   int ret;
 
   /* 调用函数来获取最大值 */
   ret = max(a, b);
 
   printf( "Max value is : %d\n", ret );
 
   return 0;
}
 
/* 函数返回两个数中较大的那个数 */
int max(int num1, int num2) 
{
   /* 局部变量声明 */
   int result;
 
   if (num1 > num2)
      result = num1;
   else
      result = num2;
 
   return result; 
}
```

函数参数：

1. 传值调用

```c
void swap(int x, int y) {
    int temp = x;
    x = y;
    y = temp;
}
```

2. 引用调用。

```c
#include <stdio.h>

// 声明 swap 函数
void swap(int *x, int *y);

int main() {
    int a = 10, b = 20;
    printf("Before swap: a = %d, b = %d\n", a, b);

    // 调用 swap 函数，传递 a 和 b 的地址
    swap(&a, &b);

    printf("After swap: a = %d, b = %d\n", a, b);
    return 0;
}

// 定义 swap 函数
void swap(int *x, int *y) {
    int temp = *x;
    *x = *y;
    *y = temp;
}
```

> 函数参数中，使用 `*` 是为了实现传址调用，让函数能够修改外部的变量。

## 12. C 作用域规则

|     作用域类型     |     声明位置     |      可见性范围      |        示例        |
| :----------------: | :--------------: | :------------------: | :----------------: |
|    **块作用域**    |    `{}` 内部     |    当前块及嵌套块    | 局部变量、循环变量 |
|   **文件作用域**   |     函数外部     | 整个文件（可跨文件） |   全局变量、函数   |
|   **函数作用域**   |   `goto` 标签    |       整个函数       |   `goto label;`    |
| **函数原型作用域** | 函数声明参数列表 |     函数原型内部     | `void foo(int x);` |

## 13. C 数组

在 C 语言中，**数组（Array）** 是一种用于存储**相同类型元素**的连续内存数据结构。通过数组，可以高效地管理大量数据，并通过下标（索引）快速访问元素。

1. 数组静态初始化：

```c
int arr1[3] = {1, 2, 3};       // 完全初始化
int arr2[5] = {1, 2};          // 部分初始化，剩余元素自动补 0
int arr3[] = {10, 20, 30};     // 长度自动推断为 3
```

> 部分初始化，剩余元素自动补 0。

2. 通过下标访问：通过 `数组名[下标]` 访问元素，下标从 **0** 开始。

3. 数组内存布局：数组元素在内存中连续地址存储，首元素地址最低。
4. 计算数组长度：

```c
int len = sizeof(arr) / sizeof(arr[0]);  // 总字节数 ÷ 单个元素字节数
```



数组与指针的关系：

- 数组名可视为指向首元素的**常量指针**：

```c
int arr[3] = {10, 20, 30};
int *p = arr;         // p 指向 arr[0]
printf("%d", *p);     // 输出 10
printf("%d", p[1]);   // 输出 20（等价于 *(p + 1)）
```

- 指针算术允许通过加减操作遍历数组。



## 14. C 枚举

枚举类型通常用于为程序中的一组相关的常量取名字，以便于程序的可读性和维护性。

如果不用枚举，我们需要使用 #define 来为每个整数定义一个别名：

```c
#define MON  1
#define TUE  2
#define WED  3
#define THU  4
#define FRI  5
#define SAT  6
#define SUN  7
```

使用 `enum` 关键字。

枚举常量的默认赋值规则

1. 第一个枚举常量：如果未显式赋值，默认值为 `0`。
2. 后续枚举常量：如果未显式赋值，默认值为前一个枚举常量的值加 `1`。

```c
#include <stdio.h>

enum DAY
{
    MON = 1,  // 显式赋值为 1
    TUE,      // 自动赋值为 2 (前一个值 + 1)
    WED,      // 自动赋值为 3
    THU,      // 自动赋值为 4
    FRI,      // 自动赋值为 5
    SAT,      // 自动赋值为 6
    SUN       // 自动赋值为 7
} day;

int main()
{
    // 遍历枚举值
    for (int i = MON; i <= SUN; i++) {
        printf("枚举元素：%d \n", i);
    }
    return 0;
}
```

## 15. C 指针

C 语言的指针非常简单，每一个变量都有一个内存位置，每一个内存位置都定义了可使用 `&` 运算符访问的地址。

指针也就是内存地址，指针变量是用来存放内存地址的变量。

这样`指针变量` 就能够去存储，其他变量的地址：

```c
#include <stdio.h>
 
int main ()
{
    int var_runoob = 10;
    int *p;              // 定义指针变量
    p = &var_runoob;
 
   printf("var_runoob 变量的地址： %p\n", p);
   return 0;
}
```

![image-20250319134025910](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250319134025910.png)

在变量声明的时候，如果没有确切的地址可以赋值，为指针变量赋一个 NULL 值是一个良好的编程习惯。赋为 NULL 值的指针被称为**空指针**。

```c
#include <stdio.h>
 
int main ()
{
   int  *ptr = NULL;
 
   printf("ptr 的地址是 %p\n", ptr  );
 
   return 0;
}
```

## 16. C 函数指针与回调函数

1. 函数指针是指向函数的指针变量。函数指针可以像一般函数一样，用于调用函数、传递参数。

```c
#include <stdio.h>

int max(int x, int y) {
    return x > y ? x : y;
}

int main(void) {
    /* p 是函数指针 */
    int (* p)(int, int) = & max; // &可以省略
    int a, b, c, d;
    printf("请输入三个数字：");
    scanf("%d,%d,%d", & a, & b,& c); // 用" , "隔离：1,2,3
    // scanf("%d %d %d", & a, & b, & c);

    /* 与直接调用函数等价， d = max(max(a, b), c) */
    d = p(p(a, b), c);
    printf("最大数字是：%d\n", d);
    return 0;
}
```

2. 回调函数是将一个函数作为参数传递给另一个函数，并在后者内部调用它。

```c
#include <stdio.h>

void printNumber(int num){
    printf("Number: %d/n", num);
}

void processNumber(int num , void (*callback)(int)) {
    callback(num); // 调用回调函数
}

int main() {
    processNumber(10, printNumber); // 将 printNumber 作为回调函数传递
    return 0;
}
```

## 17. C 字符串

在 C 语言中，字符串实际上是使用空字符 **\0** 结尾的一维字符数组。因此，**\0** 是用于标记字符串的结束。

![image-20250320174644268](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250320174644268.png)

格式如下：

```c
char str[] = "Hello";
char str[6] = {'H', 'e', 'l', 'l', 'o', '\0'};
```

C 中有大量操作字符串的函数：

| 序号 | 函数 & 目的                                                  |
| :--- | :----------------------------------------------------------- |
| 1    | **strcpy(s1, s2);** 复制字符串 s2 到字符串 s1。              |
| 2    | **strcat(s1, s2);** 连接字符串 s2 到字符串 s1 的末尾。       |
| 3    | **strlen(s1);** 返回字符串 s1 的长度。                       |
| 4    | **strcmp(s1, s2);** 如果 s1 和 s2 是相同的，则返回 0；如果 s1<s2 则返回小于 0；如果 s1>s2 则返回大于 0。 |
| 5    | **strchr(s1, ch);** 返回一个指针，指向字符串 s1 中字符 ch 的第一次出现的位置。 |
| 6    | **strstr(s1, s2);** 返回一个指针，指向字符串 s1 中字符串 s2 的第一次出现的位置。 |

```c
#include <stdio.h>
#include <string.h>
 
int main ()
{
   char str1[14] = "baidu";
   char str2[14] = "google";
   char str3[14];
   int  len ;
 
   /* 复制 str1 到 str3 */
   strcpy(str3, str1);
   printf("strcpy( str3, str1) :  %s\n", str3 );
 
   /* 连接 str1 和 str2 */
   strcat( str1, str2);
   printf("strcat( str1, str2):   %s\n", str1 );
 
   /* 连接后，str1 的总长度 */
   len = strlen(str1);
   printf("strlen(str1) :  %d\n", len );
 
   return 0;
}
```

## 18. C 结构体

C 数组允许定义可存储相同类型数据项的变量，**结构**是 C 编程中另一种用户自定义的可用的数据类型，它允许您存储不同类型的数据项。

```c
struct Person {
    char name[50];
    int age;
    float height;
};
```

:::tip C 结构体与Java 类不同。

C语言的结构体（Struct）：

- 它只能包含**数据成员**（变量），不能包含**函数成员**（方法）。

Java的类（Class）：

- 类可以包含**数据成员**（字段）和**函数成员**（方法）。

:::

## 20. C 共用体

C语言中的共用体（Union）是一种特殊的数据类型，允许在同一个内存区域存储不同的数据类型。

```c
#include <stdio.h>
#include <string.h>
 
union Data
{
   int i;
   float f;
   char  str[20];
};
 
int main( )
{
   union Data data;        
 
   data.i = 10;
   printf( "data.i : %d\n", data.i); // data.i : 10
   
   data.f = 220.5;
   printf( "data.f : %f\n", data.f); // data.f : 220.500000
   
   strcpy( data.str, "C Programming");
   printf( "data.str : %s\n", data.str); // data.str : C Programming
 
   printf( "data.i : %d\n", data.i);  // data.i : 1917853763 在这里，所有的成员都能完好输出，因为同一时间只用到一个成员。

   return 0;
}
```

::: tip

在 C 语言的共用体（Union）中，**同一时间只能有效使用一个成员**，这是由其底层内存共享机制决定的。具体原因和细节如下：

- 共用体的所有成员共享同一块内存空间，它们的起始地址相同。**物理上，所有成员的数据存储在同一个位置**。

- 写入任何一个成员的值，都会覆盖其他成员的内存内容（无论类型是否相同）。

- **设计初衷：节省内存**

:::

## 21. C 位域

**位域**（Bit Fields）是 C 语言中一种特殊的结构体成员，允许以 **位（bit）** 为单位指定成员占用的内存大小。通过位域，可以更精细地控制内存使用，适用于需要节省空间的场景（如嵌入式系统、网络协议等）。

```c
struct 结构体名 {
    // 基本语法
    type [成员名] : 位数;
};
```

- **`type`**：成员的数据类型，通常为 `unsigned int` 或 `int`（其他类型如 `char` 取决于编译器支持）。
- **`成员名`**：可省略（定义未命名的位域，用于占位）。
- **`位数`**：指定该成员占用的位数（必须 ≤ 类型总位数）。

场景案例：网络协议解析，解析IP数据包头部中的以下字段（假设前16位）：

- 版本号（4位）
- 头部长度（4位）
- 服务类型（8位）

```c
struct IPHeader {
    unsigned int version : 4;  // 版本号
    unsigned int hlen    : 4;  // 头部长度
    unsigned int tos     : 8;  // 服务类型
    // 其他字段...
};
```

例如：

```c
#include <stdio.h>

// 定义LED状态位域（8位）
struct LEDControl {
    unsigned char power   : 1;  // 电源状态（0=关，1=开）
    unsigned char mode    : 2;  // 模式（0=常亮，1=闪烁，2=呼吸）
    unsigned char color   : 3;  // 颜色（0=红，1=绿，2=蓝，3=黄，4=紫）
    unsigned char         : 2;  // 保留2位
};

int main() {
    struct LEDControl led;
    led.power = 1;   // 开启电源
    led.mode  = 2;   // 呼吸模式
    led.color = 4;   // 紫色

    printf("LED状态：\n");
    printf("电源：%s\n", led.power ? "开" : "关");
    printf("模式：%d\n", led.mode);
    printf("颜色：%d\n", led.color);
    return 0;
}
```



## 22. C 输入 & 输出

### 22.1 标准输入输出（Standard I/O）

以下是关于 **C 语言输入与输出** 的详细解释及实际案例：

C 语言通过 **标准库函数** 处理输入输出，核心头文件为 `<stdio.h>`。程序默认打开三个标准流：

- **`stdin`**：标准输入（键盘）。
- **`stdout`**：标准输出（屏幕）。
- **`stderr`**：标准错误输出（屏幕）。

1. 基础输出函数

`printf()`：格式化输出，将数据按指定格式输出到 `stdout`。

```c
int age = 25;
float height = 1.75;
printf("年龄: %d 岁，身高: %.2f 米\n", age, height);
// 输出：年龄: 25 岁，身高: 1.75 米
```

`puts()`：输出字符串，输出字符串到 `stdout`，自动追加换行符。

```c
puts("Hello, World!"); // 输出后自动换行
```

2. 基础输入函数

`scanf()`：格式化输入，从 `stdin` 读取数据并按格式解析。

```c
int num;
char name[20];
printf("输入数字和姓名：");
scanf("%d %s", &num, name); // 注意变量地址符&
printf("数字: %d, 姓名: %s\n", num, name);
```

`gets()` 和 `fgets()`：读取字符串。

- **`gets()`**：从 `stdin` 读取字符串（不检查缓冲区溢出，已弃用）。
- **`fgets()`**：更安全的替代，指定缓冲区大小。

```c
char str[50];
fgets(str, sizeof(str), stdin); // 读取最多49字符（保留末尾'\0'）
```

### 22.2 文件输入输出（File I/O）

1. **打开文件**：
   - `fopen()`：打开文件。
2. **读写文件**：
   - `fprintf()` / `fscanf()`：格式化文件读写。
   - `fread()` / `fwrite()`：二进制文件读写。
3. **关闭文件**：`fclose()`\

例如：

```c
#include <stdio.h>

int main() {
   // 写入文件
   FILE *file = fopen("test.txt", "w");

   if (file == NULL) {
      perror("文件打开失败");
      return 1;
   }

   fprintf(file, "Hello, File!!!\n");
   fclose(file);

   file = fopen("text.txt", "r");
   char buffer[100];
   fgets(buffer, sizeof(buffer), file);
   printf("文件内容: %s", buffer);
   fclose(file);
   return 0;
}
```

## 23. C 预处理器

C 预处理器在编译代码之前执行，负责对源代码进行**文本替换和条件处理**，不直接参与编译，但会修改原始代码生成“预处理后的代码”。主要功能包括：

- **宏定义（Macros）**：定义常量或函数式代码片段。
- **文件包含（File Inclusion）**：插入头文件内容。
- **条件编译（Conditional Compilation）**：根据条件决定是否编译某段代码。
- **其他指令**：如错误提示、编译器指令等。

1. 核心预处理器指令

- `#define`：定义宏。

```c
// 常量定义：
#define PI 3.14159
#define MAX_SIZE 100
// 函数宏：
#define SQUARE(x) ((x) * (x))  // 正确：用括号确保优先级
#define MAX(a, b) ((a) > (b) ? (a) : (b))
```

- `#include`：文件包含。例如：头文件

```c
#include <stdio.h>  // 标准库头文件（尖括号从系统路径查找）
#include "myheader.h" // 用户头文件（引号从当前目录查找）
```

2. 条件编译指令

- `#ifdef` / `#ifndef` / `#endif`：根据宏是否定义决定代码块是否编译。

```c
#define DEBUG_MODE  // 定义调试模式

#ifdef DEBUG_MODE
    printf("调试信息: x=%d\n", x); // 仅调试时编译
#endif
```

- `#if` / `#elif` / `#else`：基于表达式条件编译。

```c
#define VERSION 2

#if VERSION == 1
    // 版本1代码
#elif VERSION == 2
    // 版本2代码
#else
    // 默认代码
#endif
```

- 其他指令：

```c
// #undef：取消宏定义。后续代码中PI不再有效
#undef PI  

// #error：强制编译错误并显示消息。
#if !defined(C_STANDARD)
    #error "C_STANDARD未定义！"
#endif

// #pragma：向编译器传递特定指令（编译器相关）。非标准但广泛支持，防止头文件重复包含
#pragma once 
```

3. 预处理器操作符

- 字符串化操作符：`#`：将宏参数转换为字符串常量。

```c
#define STRINGIFY(x) #x
printf("%s\n", STRINGIFY(Hello)); // 输出 "Hello"
```

- 连接操作符 `##`：拼接宏参数或标识符。

```c
#define CONCAT(a, b) a##b
int num = CONCAT(12, 34); // 展开为 int num = 1234;
```

4. 预定义宏

|   **宏**   |            **描述**            |
| :--------: | :----------------------------: |
| `__LINE__` |     当前行号（整数字面量）     |
| `__FILE__` |   当前文件名（字符串字面量）   |
| `__DATE__` | 编译日期（格式 "MMM DD YYYY"） |
| `__TIME__` |  编译时间（格式 "HH:MM:SS"）   |
| `__STDC__` | 是否遵循 ANSI C 标准（1为是）  |

```c
printf("文件: %s, 行号: %d\n", __FILE__, __LINE__);
```

C 预处理器核心用途：

- 代码复用：通过头文件和宏减少重复代码。
- 条件编译：灵活控制不同平台或版本的代码。
- 常量管理：集中定义常量，便于维护。

## 24. C 强制类型转换

在 C 语言中，**强制类型转换**（Type Casting）允许程序员显式地将一种数据类型的值转换为另一种类型。

```c
int a = 10;
float b = (float)a; // 将int转为float
```

**📋 常用 ASCII 码表速查**

| **字符** | **十进制** | **十六进制** |  **解释**  |
| :------: | :--------: | :----------: | :--------: |
|   `A`    |     65     |     0x41     | 大写字母 A |
|   `a`    |     97     |     0x61     | 小写字母 a |
|   `0`    |     48     |     0x30     |   数字 0   |
|   `\n`   |     10     |     0x0A     |   换行符   |
|    ``    |     32     |     0x20     |    空格    |
|   `!`    |     33     |     0x21     |   感叹号   |
|   `@`    |     64     |     0x40     |   @符号    |

- **字母**：大写从 **65** 开始，小写从 **97** 开始，大小写差32。
- **数字**：字符 `0`=48，依次递增到 `9`=57。
- **符号**：空格（32）、换行（10）、`@`（64）等需单独记忆。
- **规律**：利用**差值法**快速计算（如大小写差32，数字差48）。

## 25. C 错误处理

在C语言中，错误处理是一个重要的编程实践，用于检测和处理程序运行时可能出现的错误。由于C语言本身没有内置的异常处理机制（如C++中的`try/catch`），因此错误处理通常通过返回值、全局变量、以及特定的错误处理函数来实现。

C 语言提供了 **perror()** 和 **strerror()** 函数来显示与 **errno** 相关的文本消息。

- `#include <errno.h>` 是 C 语言标准库中的一个头文件，用于**错误处理**。它定义了与系统或库函数调用中产生的错误相关的宏、变量和函数，帮助开发者检测和处理程序运行时的错误。

例如：

```c
#include <stdio.h>
#include <errno.h>
#include <string.h>
 
extern int errno ;
 
int main ()
{
   FILE * pf;
   int errnum;
   pf = fopen ("unexist.txt", "rb");
   if (pf == NULL)
   {
      errnum = errno;
      fprintf(stderr, "错误号: %d\n", errno);
      perror("通过 perror 输出错误");
      fprintf(stderr, "打开文件错误: %s\n", strerror( errnum ));
   }
   else
   {
      fclose (pf);
   }
   return 0;
}
```

## 26. C 递归

C 语言支持递归，即一个函数可以调用其自身。但在使用递归时，程序员需要注意定义一个从函数退出的条件，否则会进入死循环。

使用递归函数，生成一个斐波那契数列，如：

```c
#include <stdio.h>

int fibonaci(int i) {
   if (i == 0) {
      return 0;
   }
   if (i == 1) {
      return 1;
   }
   return fibonaci(i-1) + fibonaci(i-2);
}

int main () {
   int i;
   for(i = 0; i < 10; i++) {
      printf("%d\t\n", fibonaci(i));
   }
   return i;
}
```

## 27. C 可变参数

在C语言中，**可变参数**（Variable Arguments）允许函数接受数量不确定的参数。这是通过标准库 `<stdarg.h>` 中的一组宏（`va_list`、`va_start`、`va_arg`、`va_end`）实现的。可变参数常用于需要灵活处理参数的函数，例如 `printf` 和 `scanf`。

格式如下：

1. 省略号之前的那个参数是 **int**，代表了要传递的可变参数的总数。
2. 为了使用这个功能，您需要使用 **stdarg.h** 头文件，该文件提供了实现可变参数功能的函数和宏。

```c
int func(int, ... )  {
   .
   .
   .
}
 
int main() {
   func(2, 2, 3);
   func(3, 2, 3, 4);
}
```

例如：

```c
#include <stdio.h>
#include <stdarg.h>

// 计算可变参数的平均值（参数数量由第一个参数 `count` 指定）
double average(int count, ...) {
    va_list args;
    va_start(args, count);  // 初始化 args，绑定到固定参数 count

    double sum = 0;
    for (int i = 0; i < count; i++) {
        sum += va_arg(args, int);  // va_arg函数可以 逐个读取 int 类型参数 。
    }

    va_end(args);  // 清理资源
    return sum / count;
}

int main() {
    // 计算 3 个数的平均值：10, 20, 30
    printf("Average: %.2f\n", average(2, 10, 20, 30));  // 输出：Average: 20.00
    return 0;
}
```

## 28. C 内存管理

在C语言中，**内存管理**是程序设计的核心部分，直接关系到程序的性能和稳定性。C语言提供了对内存的底层控制，但同时也需要程序员手动管理内存的分配和释放。

1. 栈（Stack）

- **特点：**

  - 由编译器自动分配和释放，存储局部变量、函数参数等。
  - 内存大小固定（默认通常为几 MB），超出会导致栈溢出（Stack Overflow）。
  - 生命周期与函数调用绑定，函数结束时自动释放。

- **示例**：

  ```c
  void func() {
      int a = 10;          // 栈上分配
      char buffer[1024];    // 栈上数组（可能栈溢出风险）
  }
  ```

2. 堆（Heap）

- **特点**：

  - 由开发者手动管理（通过 `malloc`、`calloc`、`realloc`、`free`）。
  - 内存空间大（取决于系统可用内存），但需要显式释放，否则会导致内存泄漏。
  - 生命周期由开发者控制，灵活但易出错。

- **示例**：

  ```c
  int *create_array(int size) {
      int *arr = (int*)malloc(size * sizeof(int)); // 堆上分配数组
      if (arr == NULL) {
          printf("内存分配失败！");
          exit(1);
      }
      return arr; // 返回堆内存指针
  }
  
  int main() {
      int *data = create_array(100);
      // 使用data...
      free(data); // 必须手动释放
      return 0;
  }
  ```

| 序号 | 函数和描述                                                   |
| :--- | :----------------------------------------------------------- |
| 1    | **void \*calloc(int num, int size);** 在内存中动态地分配 num 个长度为 size 的连续空间，并将每一个字节都初始化为 0。所以它的结果是分配了 num*size 个字节长度的内存空间，并且每个字节的值都是 0。 |
| 2    | **void free(void \*address);** 该函数释放 address 所指向的内存块,释放的是动态分配的内存空间。 |
| 3    | **void \*malloc(int num);** 在堆区分配一块指定大小的内存空间，用来存放数据。这块内存空间在函数执行完成后不会被初始化，它们的值是未知的。 |
| 4    | **void \*realloc(void \*address, int newsize);** 该函数重新分配内存，把内存扩展到 **newsize**。 |

> 注意：void * 类型表示未确定类型的指针。C、C++ 规定 void * 类型可以通过类型转换强制转换为任何其它类型的指针。

3. 静态存储区（Static/Global Area）

- **特点**：

  - 存储全局变量、`static` 修饰的静态变量。
  - 内存生命周期持续到程序结束，默认初始化为零。

- **示例**：

  ```c
  int global_var = 42;      // 全局变量（静态区）
  
  void func() {
      static int count = 0; // 静态局部变量（只初始化一次）
      count++;
  }
  ```

4. 常量存储区（Constant Area）

- **特点**：

  - 存储字符串常量（如 `"Hello"`）和 `const` 修饰的常量。
  - 内存只读，修改会导致未定义行为（如程序崩溃）。

- **示例**：

  ```c
  const int MAX = 100;      // 常量（可能存储在只读区）
  char *str = "Hello";      // 字符串常量（不可修改）
  
  // str[0] = 'h';          // 错误！尝试修改常量区数据
  ```

## 29. C 命令行参数

执行程序时，可以从命令行传值给 C 程序。这些值被称为**命令行参数**，它们对程序很重要，特别是当您想从外部控制程序，而不是在代码内对这些值进行硬编码时，就显得尤为重要了。

例如：

```c
#include <stdio.h>

int main( int argc, char *argv[] )  
{
   if( argc == 2 )
   {
      printf("The argument supplied is %s\n", argv[1]);
   }
   else if( argc > 2 )
   {
      printf("Too many arguments supplied.\n");
   }
   else
   {
      printf("One argument expected.\n");
   }
}
```

```shell
# 命令行参数通过 main 函数的参数传递给程序。
$./a.out testing
The argument supplied is testing
```

## 30. C 安全函数

在C语言中，**安全函数**（Safe Functions）旨在替代传统的不安全函数，通过增加边界检查、错误处理等机制来避免常见的安全漏洞（如缓冲区溢出、内存泄漏、空指针解引用等）。

1. 字符串操作函数：

|      不安全函数      |          安全函数           |                          说明                          |
| :------------------: | :-------------------------: | :----------------------------------------------------: |
| `strcpy(dest, src)`  | `strncpy(dest, src, size)`  |     限制复制的最大字节数，但可能不自动添加终止符。     |
| `strcat(dest, src)`  | `strncat(dest, src, size)`  | 限制追加的字节数，但需手动确保目标缓冲区剩余空间足够。 |
| `sprintf(dest, ...)` | `snprintf(dest, size, ...)` |   限制格式化输出的最大字节数，自动截断并添加终止符。   |
|     `gets(buf)`      |  `fgets(buf, size, stdin)`  |             限制输入长度，避免缓冲区溢出。             |

2. 动态内存分配：

- 使用 `calloc` 替代 `malloc` 以初始化内存为零。
- 检查 `malloc`/`calloc` 返回值是否为 `NULL`。
- 释放内存后立即将指针置为 `NULL`，避免悬空指针。

3. 输入输出函数

- `fgets` 替代 `gets`
- `sscanf` 替代 `scanf`

> 安全函数还有很多，后续补充。










