---
title: HTML 标签
order: 2
icon: akar-icons:html-fill
---

# HTML 标签

![image-20240909092452259](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240909092452259.png)

## 1. `<!DOCTYPE>` 声明

`<!DOCTYPE>` 声明，作用是告诉浏览器使用哪种 HTML 规范来解析网页。不同版本，对应的声明方式不同。

```html
<!-- HTML5 声明 -->
<!DOCTYPE html>

<!-- HTML4 声明 -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">

<!-- HTML1 声明 -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
```



## 2. `meta` 元数据

`<meta>` 标签在 HTML 中用于**提供有关网页的元数据**，通常不会直接显示在页面上，但可以影响网页的表现和搜索引擎优化（SEO）。

例如：

```html
<!-- 声明网页的字符编码，中文网页要用UTF-8，一些浏览器默认为 gbk --> 
<meta charset="UTF-8">
<meta charset="gbk">

<!-- 提供网页的简短描述，通常显示在搜索引擎的搜索结果中（会影响搜索引擎的点击率） -->
<meta name="description" content="This is a description of the webpage">

<!-- 提供与网页内容相关的关键字，便于搜索引擎索引。 -->
<meta name="keywords" content="HTML, CSS, JavaScript">

<!-- 控制网页在移动设备上的显示方式。 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- 每隔一段时间（例如 30 秒）自动刷新页面。 -->
<meta http-equiv="refresh" content="30">
```



## 3. `<h1> - <h6>` 标题

```html
<!-- 声明标题 -->
<h1>这是一个标题</h1>
<h2>这是一个标题</h2>
<h3>这是一个标题</h3>
```



## 4. `<p>` 段落

```html
<!-- 声明一个段落 -->
<p>这是一个段落。</p>
```

`<p>` 标签是有一些特殊之处的：

1. **不能嵌套其他 块级元素**：如果试图在 `<p>` 内插入块级元素，浏览器会自动结束当前的 `<p>` 标签并开始新的块级元素，可能导致布局错乱。

```html
<!-- 如实际编码内容如下： -->
<p>This is a paragraph <div>This div is inside the paragraph</div></p>
<!-- 浏览器会解析为下面内容： -->
<p>This is a paragraph</p>
<div>This div is inside the paragraph</div>
```

2. `<p>` 标签可以**包含内联元素**：如 `<span>`、`<a>`、`<strong>`、`<em>` 等

```html
<p>This is a <strong>bold</strong> word and an <a href="#">example link</a>.</p>
```

3.  `<p>` 标签 **空白处理**：多个连续空格和换行符会被 HTML 自动压缩为一个空格。

```html
<p>This    is     a     test.</p>
<!-- 浏览器解析为：This is a test.-->
```



## 5. `<a> ` 链接（也叫做 锚元素 ）

```HTML
<a href="https://www.runoob.com">这是一个链接</a>

```

`<a>` 标签常用的特殊属性：

1. `href` 属性：超链接所指向的 URL。

- 要知道：**绝对URL、相对 URL、锚链接、JavaScript调用** 等方式。

```html
<!-- 绝对URL：指向的是完整的网络地址。 -->
<a href="https://www.example.com">Visit Example</a>

<!-- 相对 URL：相对于当前网页或当前网站的链接（相对路径）。 -->
<a href="/example">Visit Example</a>

<!-- 锚链接：锚链接用于链接到当前页面或其他页面中的特定位置，通常与 id 属性配合使用。 -->
<a href="#section1">Go to Section 1</a>
<div id="section1">Section 1</div>

<!-- JavaScript 调用： -->
<a href="javascript:alert('Hello World!');">Do Nothing</a>

<!-- 图像链接，如下： -->
<a href="https://www.example.com">
  <img src="example.jpg" alt="示例图片">
</a>


<!-- 
还有：
	mailto: 用于创建一个指向电子邮件地址的链接，点击后会打开用户的默认邮件客户端，。
	tel: 用于创建一个指向电话号码的链接，点击后会在支持的设备上启动电话拨号功能。
-->
```

2.  `target` 属性：常用 `_blank` 和 `_self`

```html
<!-- _blank：在新标签/窗口中打开的链接，或指向下载文件的链接**，应说明在跟踪链接时将发生什么。 -->
<a target="_blank" href="https://www.wikipedia.org">
  Wikipedia（将在新标签页中打开）
</a>

<!-- _self：当前页面加载。（默认） -->
<a target="_self" href="https://www.wikipedia.org">
  Wikipedia（将在当前签页中打开）
</a>
```

3. `download` 属性：**用于在用户点击链接时触发文件下载，而不是直接在浏览器中打开文件**。**注意：只适用于 当前网页同源 的文件**。

```html
<!-- 如果不指定，文件会使用链接中的原始文件名。此处使用 file.pdf -->
<a href="file.pdf" download>Download PDF</a>

<!-- 可以为下载的文件指定一个默认的文件名：newname.png -->
<a href="image.png" download="newname.png">Download Image</a>
```



## 6. `<img>` 图像

```html
<img src="pulpit.jpg" alt="Pulpit rock" width="304" height="228">
```

`src` 属性：嵌入的图片的路径。

`alt` 属性：对图像的文本描述。

`height（高度）`  属性：用于设置图像的高度。

`width（宽度）` 属性：用于设置图像的宽度。

**图像链接，如下**：

```html
<a href="https://www.example.com">
  <img src="example.jpg" alt="示例图片">
</a>
```



## 7. HTML 文本格式化（字体显示）

见：https://www.runoob.com/html/html-formatting.html

![image-20240909103959622](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240909103959622.png)



## 8.  `<table>` 表格

```html
<table>
  <thead>
    <tr>
      <th>列标题1</th>
      <th>列标题2</th>
      <th>列标题3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>行1，列1</td>
      <td>行1，列2</td>
      <td>行1，列3</td>
    </tr>
    <tr>
      <td>行2，列1</td>
      <td>行2，列2</td>
      <td>行2，列3</td>
    </tr>
  </tbody>
</table>
```

> **`tr`**：`tr` 是 table row 的缩写，表示表格的一行。
>
> **`td`**：`td` 是 table data 的缩写，表示表格的数据单元格。
>
> **`th`**：`th` 是 table header的缩写，表示表格的表头单元格。



## 9. `<ul>` / `<ol>` 列表

```html
<!-- 无序列表：unordered list -->
<ul>
<li>Coffee</li>
<li>Milk</li>
</ul>

<!-- 有序列表：ordered list -->
<ol>
<li>Coffee</li>
<li>Milk</li>
</ol>
```



## 10. `<div>` / `<span>` 区块

`<div> ` 元素是块级元素，浏览器会在其前后显示折行，常见的用途是文档布局。

`<span>` 元素是内联元素，没有特定的含义。

一般配合 `css sytle` 配合使用。

## 11. `<form>` 表单

```html
<form action="/" method="post">
    <!-- 文本输入框 -->
    <label for="name">用户名:</label>
    <input type="text" id="name" name="name" required>

    <br>

    <!-- 密码输入框 -->
    <label for="password">密码:</label>
    <input type="password" id="password" name="password" required>

    <br>

    <!-- 单选按钮 -->
    <label>性别:</label>
    <input type="radio" id="male" name="gender" value="male" checked>
    <label for="male">男</label>
    <input type="radio" id="female" name="gender" value="female">
    <label for="female">女</label>

    <br>

    <!-- 复选框 -->
    <input type="checkbox" id="subscribe" name="subscribe" checked>
    <label for="subscribe">订阅推送信息</label>

    <br>

    <!-- 下拉列表 -->
    <label for="country">国家:</label>
    <select id="country" name="country">
        <option value="cn">CN</option>
        <option value="usa">USA</option>
        <option value="uk">UK</option>
    </select>

    <br>

    <!-- 提交按钮 -->
    <input type="submit" value="提交">
</form>
```



## 12. `<iframe>` 内嵌框架

```html
<iframe src="demo_iframe.htm" width="200" height="200"></iframe>
```



## 13. `<script>` / `<noscript>` 脚本

`<script>` 标签用于定义客户端脚本，比如 JavaScript。

`<noscript>`  标签提供无法使用脚本时的替代内容，比方在浏览器禁用脚本时，或浏览器不支持客户端脚本时。

```html
<script>
document.write("Hello World!")
</script>
<noscript>抱歉，你的浏览器不支持 JavaScript!</noscript>
```



## 14. 字符实体

| 显示结果 | 描述        | 实体名称            | 实体编号  |
| :------- | :---------- | :------------------ | :-------- |
|          | 空格        | `&nbsp;`            | `&#160;`  |
| <        | 小于号      | `&lt;`              | `&#60;`   |
| >        | 大于号      | `&gt;`              | `&#62;`   |
| &        | 和号        | `&amp;`             | `&#38;`   |
| "        | 引号        | `&quot;`            | `&#34;`   |
| '        | 撇号        | `&apos; (IE不支持)` | `&#39;`   |
| ￠       | 分          | `&cent;`            | `&#162;`  |
| £        | 镑          | `&pound;`           | `&#163;`  |
| ¥        | 人民币/日元 | `&yen;`             | `&#165;`  |
| €        | 欧元        | `&euro;`            | `&#8364;` |
| §        | 小节        | `&sect;`            | `&#167;`  |
| ©        | 版权        | `&copy`;            | `&#169;`  |
| ®        | 注册商标    | `&reg;`             | `&#174;`  |
| ™        | 商标        | `&trade;`           | `&#8482;` |
| ×        | 乘号        | `&times;`           | `&#215;`  |
| ÷        | 除号        | `&divide;`          | `&#247;`  |



## HTML5 标签（重点！！！）

> HTML5 现代浏览器完全支持。



## 1. `<canvas>` 画布

`<canvas>` 元素用于图形的绘制，通过脚本 (通常是JavaScript)来完成.

`<canvas>` 标签只是图形容器，您**必须使用脚本来绘制图形**。

`<canvas>` 基本使用：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Canvas Demo</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        #myCanvas {
            border: 1px solid black; /* 给 canvas 添加边框，方便观察区域 */
        }
    </style>
</head>
<body>

<h1>HTML5 Canvas 示例</h1>
<canvas id="myCanvas" width="500" height="400">您的浏览器不支持 HTML5 canvas 元素。</canvas>

<script>
    // 获取 canvas 元素
    const canvas = document.getElementById('myCanvas');
    
    // 获取 canvas 的 2D 上下文（context）
    const ctx = canvas.getContext('2d');
    
    // 设置填充颜色为红色
    ctx.fillStyle = '#FF0000';
    // 绘制一个红色矩形，参数：x, y, width, height
    ctx.fillRect(20, 20, 150, 100); 
    // 详细解释：fillRect 用于绘制填充的矩形，第一个参数是 x 轴坐标，第二个是 y 轴坐标，接下来是宽度和高度
    
    // 设置描边颜色为蓝色
    ctx.strokeStyle = '#0000FF';
    // 绘制一个蓝色边框的矩形
    ctx.strokeRect(200, 20, 150, 100);
    // 详细解释：strokeRect 用于绘制空心矩形，类似于 fillRect，但只有边框
    
    // 绘制路径
    ctx.beginPath(); // 开始新的路径
    ctx.moveTo(100, 150); // 将画笔移动到指定位置
    ctx.lineTo(200, 250); // 从当前位置画一条线到 (200, 250)
    ctx.lineTo(50, 250);  // 从当前位置画一条线到 (50, 250)
    ctx.closePath(); // 闭合路径（回到起点）
    
    // 填充路径
    ctx.fillStyle = 'green'; // 设置填充颜色为绿色
    ctx.fill(); // 填充形状
    
    // 绘制路径边框
    ctx.strokeStyle = 'black'; // 设置描边颜色为黑色
    ctx.stroke(); // 绘制路径边框
    
    // 绘制圆形
    ctx.beginPath(); 
    ctx.arc(350, 200, 50, 0, Math.PI * 2); // 参数：x, y, 半径, 起始角度, 结束角度（以弧度计算）
    ctx.fillStyle = 'yellow'; // 设置填充颜色为黄色
    ctx.fill(); // 填充圆形
    ctx.stroke(); // 绘制圆形的边框
    
    // 绘制文本
    ctx.font = '20px Arial'; // 设置字体
    ctx.fillStyle = 'black'; // 设置文本颜色
    ctx.fillText('Canvas 示例', 300, 350); // 在画布上绘制文本
    // 详细解释：fillText 的第一个参数是文本内容，第二和第三个参数是文本的 x 和 y 坐标
</script>

</body>
</html>
```

`<canvas>` **图像**：

```js
var c=document.getElementById("myCanvas");
var ctx=c.getContext("2d");
# 图像引入
var img=document.getElementById("scream");
ctx.drawImage(img,10,10);
```



## 2. `<svg>` 可缩放矢量图形

与 `<canvas>` 区别：

- SVG 是一种使用 XML 描述 2D 图形的语言，一般地图采用 `<svg>`  。

- Canvas 通过 JavaScript 来绘制 2D 图形。

案例：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SVG Example</title>
</head>
<body>

    <h2>Simple SVG Example</h2>

    <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <!-- 绘制一个圆 -->
        <circle cx="100" cy="100" r="50" stroke="black" stroke-width="3" fill="red" />
        
        <!-- 绘制一个矩形 -->
        <rect x="150" y="50" width="100" height="100" stroke="blue" stroke-width="3" fill="green" />

        <!-- 添加文本 -->
        <text x="50" y="180" font-family="Verdana" font-size="20" fill="black">This is SVG!</text>
    </svg>

</body>
</html>
```



## 3. `<math>` MathML（数学标记语言）

像数学上一些常用的标记性语言，就可以通过这个实现。

```html
<!DOCTYPE html>
<html>
   <head>
      <meta charset="UTF-8">
      <title>菜鸟教程(runoob.com)</title>
   </head>
        
   <body>
        
      <math xmlns="http://www.w3.org/1998/Math/MathML">
                
         <mrow>
            <msup><mi>a</mi><mn>2</mn></msup>
            <mo>+</mo>
                                
            <msup><mi>b</mi><mn>2</mn></msup>
            <mo>=</mo>
                                
            <msup><mi>c</mi><mn>2</mn></msup>
         </mrow>
                        
      </math>
                
   </body>
</html>
```



![image-20240911135042987](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240911135042987.png)

还可以通过引入第三方库实现上面效果。

```html
<!DOCTYPE html>
<html>
   <head>
      <meta charset="UTF-8">
      <title>菜鸟教程(runoob.com)</title>
      <script type="text/javascript" src="https://static.jyshare.com/assets/js/mathml/mspace.js"></script>
   </head>
        
   <body>
      <math xmlns="http://www.w3.org/1998/Math/MathML">
                
         <mrow>
            <mi>A</mi>
            <mo>=</mo>
                        
            <mfenced open="[" close="]">
                        
               <mtable>
                  <mtr>
                     <mtd><mi>x</mi></mtd>
                     <mtd><mi>y</mi></mtd>
                  </mtr>
                                        
                  <mtr>
                     <mtd><mi>z</mi></mtd>
                     <mtd><mi>w</mi></mtd>
                  </mtr>
               </mtable>
               
            </mfenced>
         </mrow>
      </math>
      
   </body>
</html>
```

![image-20240911135052002](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240911135052002.png)



## 4. 拖放





## 5. `Geolocation` 地理定位

```html
<!DOCTYPE html>
<html>
<head> 
<meta charset="utf-8"> 
<title>菜鸟教程(runoob.com)</title> 
</head>
<body>
<p id="demo">点击按钮获取您当前坐标（可能需要比较长的时间获取）：</p>
<button onclick="getLocation()">点我</button>
<script>
var x=document.getElementById("demo");
    
function getLocation() {
	if (navigator.geolocation)
	{
		navigator.geolocation.getCurrentPosition(showPosition,showError);
	}
	else
	{
		x.innerHTML="该浏览器不支持定位。";
	}
}
    
function showPosition(position) {
	x.innerHTML="纬度: " + position.coords.latitude + 
	"<br>经度: " + position.coords.longitude;	
}
    
function showError(error) {
	switch(error.code) {
		case error.PERMISSION_DENIED:
			x.innerHTML="用户拒绝对获取地理位置的请求。"
			break;
		case error.POSITION_UNAVAILABLE:
			x.innerHTML="位置信息是不可用的。"
			break;
		case error.TIMEOUT:
			x.innerHTML="请求用户地理位置超时。"
			break;
		case error.UNKNOWN_ERROR:
			x.innerHTML="未知错误。"
			break;
	}
}
</script>
</body>
</html>
```

![image-20240911152316965](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240911152316965.png)

## 6. `<video> ` 视频

`<video> `元素提供了 播放、暂停和音量控件来控制视频

```html
<!DOCTYPE html> 
<html> 
<head> 
<meta charset="utf-8"> 
<title>菜鸟教程(runoob.com)</title> 
</head>
<body> 

<div style="text-align:center"> 
  <button onclick="playPause()">播放/暂停</button> 
  <button onclick="makeBig()">放大</button>
  <button onclick="makeSmall()">缩小</button>
  <button onclick="makeNormal()">普通</button>
  <br> 
  <video id="video1" width="420">
    <source src="mov_bbb.mp4" type="video/mp4">
    <source src="mov_bbb.ogg" type="video/ogg">
    您的浏览器不支持 HTML5 video 标签。
  </video>
</div> 

<script> 
var myVideo=document.getElementById("video1"); 

function playPause()
{ 
	if (myVideo.paused) 
	  myVideo.play(); 
	else 
	  myVideo.pause(); 
} 

	function makeBig()
{ 
	myVideo.width=560; 
} 

	function makeSmall()
{ 
	myVideo.width=320; 
} 

	function makeNormal()
{ 
	myVideo.width=420; 
} 
</script> 

</body> 
</html>
```

![image-20240911152742855](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240911152742855.png)

## 7. `<audio>` 音频

```html
<!DOCTYPE html>
<html>
<head> 
<meta charset="utf-8"> 
<title>菜鸟教程(runoob.com)</title> 
</head>
<body>

<audio controls>
  <source src="horse.ogg" type="audio/ogg">
  <source src="horse.mp3" type="audio/mpeg">
您的浏览器不支持 audio 元素。
</audio>

</body>
</html>
```



## 8. `<input>` 表单输入框

多了许多不同类型，例如：color、date、email、datetime等等。

类型详情【见】：https://www.runoob.com/html/html5-form-input-types.html



## 9. `<datalist>` 、`<keygen>`、 `<output>`新表单元素

`<datalist>` 元素规定输入域的选项列表，类似好多组件里面的Select。

```html
<input list="browsers">
 
<datalist id="browsers">
  <option value="Internet Explorer">
  <option value="Firefox">
  <option value="Chrome">
  <option value="Opera">
  <option value="Safari">
</datalist>
```

![image-20240911165437824](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240911165437824.png)



`<keygen>` 加密相关，了解即可，快弃用了。



`<output>` 主要用于显示计算或操作的结果。

```html
<form oninput="result.value = parseInt(a.value) + parseInt(b.value)">
  <label for="a">First number:</label>
  <input type="number" id="a" name="a">
  
  <label for="b">Second number:</label>
  <input type="number" id="b" name="b">
  
  <output name="result" for="a b">0</output>
</form>
```

![image-20240911170221464](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240911170221464.png)



## 10. `<form>` 表单 新属性

**`autocomplete` 属性**：用于指定浏览器是否应该为表单或表单中的某个输入字段**提供自动填充功能**。

```html
<!--  autocomplete 属性为 "on"（开），但是 e-mail 自动为“off”（关） -->
<form action="demo-form.php" autocomplete="on">
    
  First name:<input type="text" name="fname"><br>
  Last name: <input type="text" name="lname"><br>
    
<!--  autocomplete 属性为 "on"（开），但是 e-mail 自动为“off”（关） -->
  E-mail: <input type="email" name="email" autocomplete="off"><br>
  <input type="submit">
</form>
```

![image-20240911170633495](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240911170633495.png)

**`novalidate ` 属性**：设置浏览器不对表单进行验证。

```html
<form action="demo-form.php" novalidate>
  E-mail: <input type="email" name="user_email">
  <input type="submit">
</form>
```



**`autofocus` 属性**：让 "First name" input 输入域 **在页面载入时自动聚焦**。

```html
<!DOCTYPE html>
<html>
<head> 
<meta charset="utf-8"> 
<title>菜鸟教程(runoob.com)</title> 
</head>
<body>

<form action="demo-form.php">
  First name: <input type="text" name="fname" autofocus><br>
  Last name: <input type="text" name="lname"><br>
  <input type="submit">
</form>
<p><strong>注意：</strong> Internet Explorer 9及更早 IE 版本不支持 input 标签的 autofocus 属性。</p>

</body>
</html>
```



## 11. `<input>` 输入域 新属性

**`form` 属性**：位于form表单外的 input 字段引用了 HTML form (该 input 表单**仍然属于form表单的一部分**)

```html
<form action="demo-form.php" id="form1">
  First name: <input type="text" name="fname"><br>
  <input type="submit" value="提交">
</form>
 
<!-- 通过form属性： -->
Last name: <input type="text" name="lname" form="form1">
```

**`list` 属性**：list 属性规定输入域的 datalist。datalist 是输入域的选项列表。

```html
<input list="browsers">
<datalist id="browsers">
    <option value="Internet Explorer">
    <option value="Firefox">
    <option value="Chrome">
    <option value="Opera">
    <option value="Safari">
</datalist>
```

**height 和 width 属性、min 和 max 属性、multiple 属性、pattern 属性、placeholder 属性、required 属性、step 属性** 等等比较常用的。

> [见]：https://www.runoob.com/html/html5-form-attributes.html



## 12. 语义元素

`<section>` 标签定义文档中的节（section、区段）。比如章节、页眉、页脚或文档中的其他部分。

`<article>` 标签定义独立的内容。

`<nav> ` 标签定义导航链接的部分。

`<aside>` 标签定义页面主区域内容之外的内容（比如侧边栏）。

`<header>` 元素描述了文档的头部区域

`<footer>` 元素描述了文档的底部区域.



`<figure>` 标签规定独立的流内容（图像、图表、照片、代码等等）。

`<figcaption>` 标签定义 `<figure>` 元素的标题.

![img](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/html5-layout.jpg)



