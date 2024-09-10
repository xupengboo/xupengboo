# HTML 标签

![image-20240909092452259](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240909092452259.png)

# 1. `<!DOCTYPE>` 声明

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



# 2. `meta` 元数据

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



# 3. `<h1> - <h6>` 标题

```html
<!-- 声明标题 -->
<h1>这是一个标题</h1>
<h2>这是一个标题</h2>
<h3>这是一个标题</h3>
```



# 4. `<p>` 段落

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



# 5. `<a> ` 链接（也叫做 锚元素 ）

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



# 6. `<img>` 图像

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



# 7. HTML 文本格式化（字体显示）

见：https://www.runoob.com/html/html-formatting.html

![image-20240909103959622](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240909103959622.png)



# 8.  `<table>` 表格

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



# 9. `<ul>` / `<ol>` 列表

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



# 10. `<div>` / `<span>` 区块

`<div> ` 元素是块级元素，浏览器会在其前后显示折行，常见的用途是文档布局。

`<span>` 元素是内联元素，没有特定的含义。

一般配合 `css sytle` 配合使用。

# 11. `<form>` 表单

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



# 12. `<iframe>` 内嵌框架

```html
<iframe src="demo_iframe.htm" width="200" height="200"></iframe>
```



# 13. `<script>` / `<noscript>` 脚本

`<script>` 标签用于定义客户端脚本，比如 JavaScript。

`<noscript>`  标签提供无法使用脚本时的替代内容，比方在浏览器禁用脚本时，或浏览器不支持客户端脚本时。

```html
<script>
document.write("Hello World!")
</script>
<noscript>抱歉，你的浏览器不支持 JavaScript!</noscript>
```



# 14. 字符实体

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



# HTML5 标签（重点！！！）

> HTML5 现代浏览器完全支持。



