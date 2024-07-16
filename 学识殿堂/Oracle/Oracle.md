## Oracle 存储过程
1. **`CREATEOR REPLACE PROCEDURE [procedure_name] IS ... `**主体格式：
- **`IS`**：用于分隔存储过程的头部声明部分和主体逻辑部分的开始。  
- **`CREATE OR REPLACE PROCEDURE`**：用于创建或替换已存在的存储过程。  

![image.png](https://cdn.nlark.com/yuque/0/2024/png/32707260/1720753915103-dc77c0cf-ab4b-416d-9d93-095c3fdc312b.png#averageHue=%23191919&clientId=u3303c194-8f3f-4&from=paste&height=987&id=QZv8O&originHeight=987&originWidth=1467&originalType=binary&ratio=1&rotation=0&showTitle=false&size=112063&status=done&style=none&taskId=u7c816ef0-99b6-4a01-9f44-0b899c2ed58&title=&width=1467)

2. **`SELECT ... INTO 变量名`**：在 Oracle PL/SQL 中，**`SELECT ... INTO`**语句用于将查询结果存储到一个或多个变量中。  

![image.png](https://cdn.nlark.com/yuque/0/2024/png/32707260/1720751791746-50c73edd-4374-4144-8826-855e0395e7d8.png#averageHue=%23848484&clientId=u90ad6183-2839-4&from=paste&height=317&id=u0a3cc100&originHeight=317&originWidth=1485&originalType=binary&ratio=1&rotation=0&showTitle=false&size=31188&status=done&style=none&taskId=u3c15ed76-439b-455e-97aa-fdc037bae2c&title=&width=1485)

3. **`FOR UPDATE`**：此子句将锁定符合 WHERE 条件的行，以便在事务中更新这些行的数据。在数据库中执行 FOR UPDATE 时，会锁定选中的行，以防止其他事务并发修改这些行。

![image.png](https://cdn.nlark.com/yuque/0/2024/png/32707260/1720751772222-a69f429c-dbf3-481a-8ff2-25927248c089.png#averageHue=%234d4d4d&clientId=u90ad6183-2839-4&from=paste&height=1143&id=u930e3c07&originHeight=1143&originWidth=1155&originalType=binary&ratio=1&rotation=0&showTitle=false&size=132651&status=done&style=none&taskId=u67ccc690-797e-4ed5-b2a6-a6ae32c162b&title=&width=1155)

4. **`||`**是字符串连接操作符  。

![image.png](https://cdn.nlark.com/yuque/0/2024/png/32707260/1720752148261-ec6e6b4b-34fd-4692-b50f-cef0c5a52e84.png#averageHue=%23f2f2f2&clientId=u90ad6183-2839-4&from=paste&height=257&id=uf563c746&originHeight=257&originWidth=1219&originalType=binary&ratio=1&rotation=0&showTitle=false&size=35525&status=done&style=none&taskId=u1a0950a1-5794-491e-978c-924849c0314&title=&width=1219)

5. **`:=`**是赋值操作符。

![image.png](https://cdn.nlark.com/yuque/0/2024/png/32707260/1720752433282-08f355f5-5e5b-4b39-b5ee-3d5f6c80b822.png#averageHue=%234b4b4b&clientId=u3303c194-8f3f-4&from=paste&height=219&id=u4ab2c5ed&originHeight=219&originWidth=1459&originalType=binary&ratio=1&rotation=0&showTitle=false&size=17245&status=done&style=none&taskId=uf4e0265b-da8c-4b9e-a50a-26ec55e5a19&title=&width=1459)

6. **`RETURNING 子句`**：RETURNING 子句用于获取 INSERT、UPDATE 或 DELETE 操作影响的行，并返回指定列的值 ，一般配合`into`使用。

![image.png](https://cdn.nlark.com/yuque/0/2024/png/32707260/1720752988036-931fcd0a-34f3-4def-b096-3b342be94d1f.png#averageHue=%23332b2a&clientId=u3303c194-8f3f-4&from=paste&height=415&id=u7ecada0b&originHeight=415&originWidth=951&originalType=binary&ratio=1&rotation=0&showTitle=false&size=62951&status=done&style=none&taskId=u20f66a10-2a7d-48d9-9d3c-cd1f90e9473&title=&width=951)

7. **`sql%rowcount`**： 是一个 SQL 内置的伪列，它用于获取最近一个 SQL 语句影响的行数。在 PL/SQL 中，可以通过 sql%rowcount 来获取上一个 SQL 语句执行后受影响的行数，并将这个值赋给一个变量。  

![image.png](https://cdn.nlark.com/yuque/0/2024/png/32707260/1720753097829-09f8a4a0-38e8-4be2-9d3f-81c61600e29f.png#averageHue=%23171616&clientId=u3303c194-8f3f-4&from=paste&height=859&id=uf09a16a3&originHeight=859&originWidth=1433&originalType=binary&ratio=1&rotation=0&showTitle=false&size=86872&status=done&style=none&taskId=u57c696e2-ce27-4d84-8513-651f4638a2c&title=&width=1433)
> 💡Tips： "内置的伪列"（pseudo column）指的是一类特殊的列，它们不是实际存储在表中的数据列，而是由数据库系统提供的特殊值或信息。这些伪列在 SQL 查询中可以像普通列一样使用，但它们的值通常是根据当前执行的上下文或者特定规则计算得到的，而不是存储在表中的实际数据。  

8. **`BEGIN ... END`**：是用来定义一个块（block）的语法结构  ， 这个块可以包含一系列的语句和程序逻辑，类似于其他编程语言中的代码块或者函数体。  
- 逻辑分组 ：BEGIN ... END 可以将多条语句组织在一起，形成一个逻辑上的整体。 这些语句可以是变量声明、条件判断、循环、SQL 操作等，用于完成特定的任务或逻辑流程。  
- **错误处理**：BEGIN ... END 块经常用于实现错误处理逻辑。通过捕获和处理异常，可以在 BEGIN 块中编写可能触发异常的代码，然后在 EXCEPTION 块中定义异常处理方式。  
- **事务控制**：BEGIN ... END 块可以作为事务的一部分。在块的开始和结束之间执行的 SQL 操作，将作为一个原子操作提交或回滚，以确保数据的一致性和完整性。  
9. **`%TYPE`**：是一个类型属性限定符，它可以用来声明一个变量、参数或表列的数据类型，以确保数据类型的一致性，并且在数据模型发生变化时可以自动同步更新。  
- 还包括：**`BAS_ITEM%ROWTYPE（某一行）`**、**`SYS_REFCURSOR（某个游标类型）` **等等。

![image.png](https://cdn.nlark.com/yuque/0/2024/png/32707260/1720755679970-f9b461d3-d9d6-4489-8198-998a4afb76d4.png#averageHue=%23352d2c&clientId=u27b24bbb-1077-4&from=paste&height=495&id=u966152a4&originHeight=495&originWidth=981&originalType=binary&ratio=1&rotation=0&showTitle=false&size=108393&status=done&style=none&taskId=uc1cd0e78-666f-461b-8581-07f51a13866&title=&width=981)
## Oracle 函数

