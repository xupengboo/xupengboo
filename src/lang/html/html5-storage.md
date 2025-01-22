---
title: HTML 存储
order: 3
---

# HTML 存储

> 其实就是：localStorage、sessionStorage


## 检查浏览器是否支持 localStorage || sessionStorage

```js
if(typeof(Storage)!=="undefined")
{
    // 是的! 支持 localStorage  sessionStorage 对象!
    // 一些代码.....
} else {
    // 抱歉! 不支持 web 存储。
}
```



## localStorage & sessionStorage

**sessionStorage**：用于临时保存同一窗口(或标签页)的数据，在关闭窗口或标签页之后将会删除这些数据。

**localStorage**：用于长久保存整个网站的数据，保存的数据没有过期时间，直到手动去除。

```javascript
// 存储
localStorage.setItem("sitename", "菜鸟教程");
 
// 查找
document.getElementById("result").innerHTML = "网站名：" +  localStorage.getItem("sitename");
```

> Tips：一般会使用 [JSON.stringify](https://www.runoob.com/js/javascript-json-stringify.html) 来存储对象数据，[JSON.stringify](https://www.runoob.com/js/javascript-json-stringify.html) 可以将对象转换为字符串，之后我们使用 [JSON.parse](https://www.runoob.com/js/javascript-json-parse.html) 方法将字符串转换为 JSON 对象：。



