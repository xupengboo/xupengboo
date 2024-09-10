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

