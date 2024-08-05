## Oracle 存储过程
1. **`CREATEOR REPLACE PROCEDURE [procedure_name] IS ... `**主体格式：
- **`IS`**：用于分隔存储过程的头部声明部分和主体逻辑部分的开始。  
- **`CREATE OR REPLACE PROCEDURE`**：用于创建或替换已存在的存储过程。

![image](https://github.com/user-attachments/assets/5010896d-e440-4c42-a754-ec9018782c74)

2. **`SELECT ... INTO 变量名`**：在 Oracle PL/SQL 中，**`SELECT ... INTO`**语句用于将查询结果存储到一个或多个变量中。  

![image (1)](https://github.com/user-attachments/assets/bafa3a8a-7b73-4c91-bc38-ef9d7ba614ac)

3. **`FOR UPDATE`**：此子句将锁定符合 WHERE 条件的行，以便在事务中更新这些行的数据。在数据库中执行 FOR UPDATE 时，会锁定选中的行，以防止其他事务并发修改这些行。

![image (2)](https://github.com/user-attachments/assets/ab5eebae-b51d-47e9-aa85-1c9f9da785d1)

4. **`||`**是字符串连接操作符  。

![image (3)](https://github.com/user-attachments/assets/980f9389-b8ec-4dd2-be34-8f27b329e4af)

5. **`:=`**是赋值操作符。

![image (4)](https://github.com/user-attachments/assets/da0bd2ae-3fc1-4e0a-a06f-78e76171da61)

6. **`RETURNING 子句`**：RETURNING 子句用于获取 INSERT、UPDATE 或 DELETE 操作影响的行，并返回指定列的值 ，一般配合`into`使用。

![image (5)](https://github.com/user-attachments/assets/47bce111-a8e3-4692-a112-b7f26dfa67e5)

7. **`sql%rowcount`**： 是一个 SQL 内置的伪列，它用于获取最近一个 SQL 语句影响的行数。在 PL/SQL 中，可以通过 sql%rowcount 来获取上一个 SQL 语句执行后受影响的行数，并将这个值赋给一个变量。  

![image (6)](https://github.com/user-attachments/assets/f69018b7-e18f-4f68-82c3-5f4cac95c3be)
> 💡Tips： "内置的伪列"（pseudo column）指的是一类特殊的列，它们不是实际存储在表中的数据列，而是由数据库系统提供的特殊值或信息。这些伪列在 SQL 查询中可以像普通列一样使用，但它们的值通常是根据当前执行的上下文或者特定规则计算得到的，而不是存储在表中的实际数据。  

8. **`BEGIN ... END`**：是用来定义一个块（block）的语法结构  ， 这个块可以包含一系列的语句和程序逻辑，类似于其他编程语言中的代码块或者函数体。  
- 逻辑分组 ：BEGIN ... END 可以将多条语句组织在一起，形成一个逻辑上的整体。 这些语句可以是变量声明、条件判断、循环、SQL 操作等，用于完成特定的任务或逻辑流程。  
- **错误处理**：BEGIN ... END 块经常用于实现错误处理逻辑。通过捕获和处理异常，可以在 BEGIN 块中编写可能触发异常的代码，然后在 EXCEPTION 块中定义异常处理方式。  
- **事务控制**：BEGIN ... END 块可以作为事务的一部分。在块的开始和结束之间执行的 SQL 操作，将作为一个原子操作提交或回滚，以确保数据的一致性和完整性。  
9. **`%TYPE`**：是一个类型属性限定符，它可以用来声明一个变量、参数或表列的数据类型，以确保数据类型的一致性，并且在数据模型发生变化时可以自动同步更新。  
- 还包括：**`BAS_ITEM%ROWTYPE（某一行）`**、**`SYS_REFCURSOR（某个游标类型）` **等等。

![image (7)](https://github.com/user-attachments/assets/d11aa7a6-f63a-4d2b-b86c-c58351ccc142)

