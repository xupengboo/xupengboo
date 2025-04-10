---
title: CSS 基础
order: 1
icon: fa6-brands:css
---

## 1. CSS 简介

CSS全称：`Cascading Style Sheets，层叠样式表`，是一种用于控制网页外观和布局的语言。

CSS 几个重要的概念：

1. **选择器（Selector）**：用于选择需要应用样式的 HTML 元素。
   - 如 `p` 选择所有的段落元素，`#id` 选择特定的元素，`.class` 选择具有某个类的元素。
2. **属性（Property）**：定义了需要改变的样式特征。
   - 比如 `color`（文本颜色）、`font-size`（字体大小）、`margin`（外边距）。
3. 值 (Value)：为属性提供具体的设定值。
   - 比如，`color: red;` 中，`red` 就是为 `color` 属性设定的值。
4. 层叠 (Cascading)：当多个样式规则应用于同一元素时，CSS 遵循一定的层叠规则。
   - 优先级由选择器的具体性决定。
5. 继承 (Inheritance)：某些属性如字体颜色、字体样式等会被子元素自动继承，而其他属性如边距和背景不会。

## 2. CSS 属性

### `style` 样式表 

**外部样式表**：

```html
<head>
    <!-- 引入外部样式 -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" type="text/css">
</head>
```

**内部样式表**：

```html
<style>
hr {
    color:sienna;
}
p {
    margin-left:20px;
}
body {
    background-image:url("images/back40.gif");
}
</style>
```

**内联样式表**：

```html
<p style="color:sienna;margin-left:20px">这是一个段落。</p>
```

>  优先级：**（内联样式）Inline style > （内部样式）Internal style sheet >（外部样式）External style sheet > 浏览器默认样式。**



### `background` 背景

1. **`background-color` 属性**：定义了元素的**背景颜色**。
   - `transparent`：透明（默认值）。
   - `red`、`#ff0000`、`rgb(255, 0, 0)` 等具体颜色值。

```css
div {
  background-color: #ffcc00; /* 设置背景颜色为黄色 */
}
```



2. **`background-image` 属性**：描述了元素的**背景图片（设置一个或多个背景图片）**。

   - `none`：无背景图（默认值）。

   - `url()`：指定图片的 URL。

```css
div {
  background-image: url('example.jpg'); /* 引入图片作为背景 */
}
```



3. **`background-repeat` 属性**：控制**背景图片的重复方式**。可以设置背景图片是否水平或垂直重复，或者不重复。

	- `repeat`：水平和垂直方向都重复（默认值）。
	- `repeat-x`：仅在水平方向重复。
	- `repeat-y`：仅在垂直方向重复。
	- `no-repeat`：不重复背景图片。

```css
div {
  background-image: url('example.jpg');
  background-repeat: no-repeat; /* 背景图片不重复 */
}
```



4. **`background-attachment` 属性**：定义**背景图片是随着页面的滚动而移动，还是固定不动**。

	- `scroll`：背景图片随着内容滚动（默认值）。
	- `fixed`：背景图片固定在页面上，即使内容滚动，图片位置保持不变。
	- `local`：背景图片与内容一起滚动（主要用于滚动区域）。

```css
div {
  background-image: url('example.jpg');
  background-attachment: fixed; /* 背景图片固定，不随页面滚动 */
}
```



5. **`background-position` 属性**：定义**背景图片在容器中的初始位置**。可以使用具体的数值、方向关键词或百分比来设置图片的定位。
   - `left top`、`center center`、`right bottom`：使用关键词定义图片的水平和垂直位置。
   - 数值：使用像素或百分比指定位置，比如 `50% 50%` 或 `10px 20px`。

```css
div {
  background-image: url('example.jpg');
  background-position: center center; /* 图片在容器的中央 */
}
```



### `text & font` 文本 & 字体

#### `text` 文本

1. **`color` 属性**：文本颜色。
   - 颜色名称，如 `red`、`blue`。
   - 十六进制颜色代码，如 `#ff0000`。
   - RGB、RGBA 值，如 `rgb(255, 0, 0)`。

```css
body {
    color:red;
}
h1 {
    color:#00ff00;
}
h2 {
    color:rgb(255,0,0);
}
```



2. **`text-align` 属性**：设置文本的水平对齐方式。

	- `left`：左对齐（默认）。
	- `right`：右对齐。
	- `center`：居中对齐。
	- `justify`：两端对齐，左右对齐。

```css
p {
  text-align: center; /* 文本居中对齐 */
}
```



3. **`line-height` 属性**：设置行高，即每行文本之间的间距。

	- 相对数值，如 `1.5`。
	- 绝对数值，如 `20px`。

```css
p {
  line-height: 1.5; /* 设置文本的行高为1.5倍 */
}
```



4. **`text-decoration` 属性**：设置文本的装饰效果，比如下划线、删除线等。

	- `none`：无装饰（默认值）。
	- `underline`：下划线。
	- `line-through`：删除线。
	- `overline`：上划线。

```css
p {
  text-decoration: underline; /* 给文本添加下划线 */
}
```



5. **`text-transform` 属性**：设置文本的大小写转换。

	- `none`：不进行转换（默认）。
	- `uppercase`：转换为大写。
	- `lowercase`：转换为小写。
	- `capitalize`：每个单词的首字母大写。

```css
p {
  text-transform: uppercase; /* 文本转换为大写 */
}
```



6. **`letter-spacing` 属性**：设置字符之间的间距。可以用于调整文本的视觉效果和可读性。

	- 数值，如 `2px`。

```css
p {
  letter-spacing: 2px; /* 设置字符间距为2像素 */
}
```



7. **`word-spacing` 属性**：设置单词之间的间距。与 `letter-spacing` 类似，但作用于单词之间的空格。

	- 数值，如 `2px`。

```css
p {
  word-spacing: 5px; /* 设置单词之间的间距 */
}
```



8. **`white-space` 属性**：控制文本如何处理空白符号和换行。

	- `normal`：默认，文本会根据容器宽度自动换行。
	- `nowrap`：文本不会换行，直到遇到 `<br>` 标签。
	- `pre`：空白符会保留，文本不会换行，类似于 `<pre>` 标签的效果。

```css
p {
  white-space: nowrap; /* 禁止文本换行 */
}
```



9. **`text-shadow` 属性**：给文本添加阴影效果。

```css
p {
  text-shadow: 2px 2px 4px #888; /* 设置阴影为向右下方偏移2像素，模糊度为4像素 */
}
```



10. **`text-indent` 属性**：文本缩进属性是用来指定文本的第一行的缩进。

```css
p {
    text-indent:50px; /* 第一行缩进 */
}
```



####  `font` 字体

1. **`font-size` 属性**：设置文本的大小。

	- `12px`、`16px` 等具体像素值。
	- `2em`、`1.5rem` 使用相对单位。
	- 百分比，如 `150%`。

```css
p {
  font-size: 16px; /* 设置字体大小为16像素 */
}
```



2. **`font-weight` 属性**：设置文本的粗细。

	- `normal`：默认值，标准粗细。
	- `bold`：加粗。
	- `lighter`：比父元素更细。
	- 数字，如 `100` 到 `900`。

```css
p {
  font-weight: bold; /* 设置文本加粗 */
}
```



3. **`font-style` 属性**：设置文本是否斜体

	- `normal`：正常样式（默认值）。
	- `italic`：斜体。
	- `oblique`：倾斜样式。

```css
p {
  font-style: italic; /* 设置文本为斜体 */
}
```



4. **`font-family` 属性**：定义文本的字体系列。通常设置一个字体的优先级列表，以便浏览器在无法找到第一个字体时可以回退到下一个字体。
   - 字体名称，如 `Arial`、`Times New Roman`。
   - 通用字体系列，如 `serif`、`sans-serif`、`monospace`。

```css
p {
  font-family: "Arial", sans-serif; /* 使用Arial字体，找不到则使用sans-serif */
}
```



### `link` 链接

**四个链接 样式，例如**：

- `a:link`：正常，未访问过的链接

- `a:visited`：用户已访问过的链接
- `a:hover` ：当用户鼠标放在链接上时
- `a:active` ：链接被点击的那一刻

```css
a:link { 
    color:#000000; /* 未访问链接*/
}      
a:visited {
    color:#00FF00; /* 已访问链接 */
}   
a:hover {
    color:#FF00FF; /* 鼠标移动到链接上 */
}     
a:active {
    color:#0000FF; /* 鼠标点击时 */
}    
```



当设置为若干链路状态的样式，也有一些 **顺序规则**：

- `a:hover` 必须跟在 `a:link` 和 `a:visited` 后面
- `a:active` 必须跟在 `a:hover` 后面



### `list` 列表

这里的列表就是对应了 HTML 中的 `<ol>` 有序列表 和  `<ul>` 无序列表了。



1. **`list-style-type` 属性**：定义列表项的标记类型。可以选择显示不同的符号、数字或字母作为列表项的标记。
   - `none`：没有标记。
   - `disc`：实心圆（默认值，适用于无序列表 `<ul>`）。
   - `circle`：空心圆。
   - `square`：方形标记。
   - `decimal`：数字（适用于有序列表 `<ol>`）。
   - `decimal-leading-zero`：带前导零的数字，如 `01, 02, 03`。
   - `lower-alpha`：小写字母，如 `a, b, c`。
   - `upper-alpha`：大写字母，如 `A, B, C`。
   - `lower-roman`：小写罗马数字，如 `i, ii, iii`。
   - `upper-roman`：大写罗马数字，如 `I, II, III`。

```css
ul {
  list-style-type: square; /* 设置列表项的标记为方形 */
}
```



2. **`list-style-position` 属性**：定义列表标记的位置，决定标记是位于内容外部还是内部。它主要影响标记相对于列表内容的对齐方式。
   - `outside`：标记位于列表项的外部，文本会在标记之后缩进（默认值）。
   - `inside`：标记位于列表项内容的内部，文本会与标记对齐，不缩进。

```css
ul {
  list-style-position: inside; /* 列表标记位于内容内部 */
}
```



3. **`list-style-image` 属性**：使用自定义图片作为列表项的标记代替默认的符号或数字。
   - `none`：不使用图片（默认值）。
   - `url('image-path')`：指定图片的 URL 作为标记。

```css
ul {
  list-style-image: url('star.png'); /* 使用图片作为列表项标记 */
}
```



4. **`list-style` 属性**：是一个简写属性，用于同时设置 `list-style-type`、`list-style-position` 和 `list-style-image`。**可以在一行代码中定义多个列表样式属性**。
   - 顺序：list-style-type、list-style-position、list-style-image

```css
ul {
  list-style: square inside url('star.png'); /* 使用方形标记、内部对齐、图片作为标记 */
}
```



### `table` 表格

**表格边框**：

```css
table, th, td {
    border: 1px solid black;
}
```

**`border-collapse` 属性**设置表格的边框是否被折叠成一个单一的边框或隔开

```css
table {
    border-collapse:collapse;
}
table,th, td {
    border: 1px solid black;
}
```

**`width` 和 `height` 属性**定义表格的宽度和高度。

```css
table {
    width:100%;
}
th {
    height:50px;
}
```

> Tips：就是通过 `table`、`th`、`tr`、`td` 等元素操作即可。 



### `Box Model` 盒子模型

**主要是这三个属性：margin、border、padding**

![image-20240912153525684](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240912153525684.png)

```css
div {
    width: 300px;
    border: 25px solid green;
    padding: 25px;
    margin: 25px;
}
```



### `border` 边框

| 属性                                                     | 描述                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| border-style                                                 | 用于设置元素所有边框的样式，或者单独地为各边设置边框样式。   |
| border-width                                                 | 简写属性，用于为元素的所有边框设置宽度，或者单独地为各边边框设置宽度。 |
| border-color | 简写属性，设置元素的所有边框中可见部分的颜色，或为 4 个边分别设置颜色。 |
| border | 简写属性，用于把针对四个边的属性设置在一个声明。 |

**`border-style` 属性值**：

- `none`：无边框。
- `solid`：实线边框。
- `dashed`：虚线边框（破折号）。
- `dotted`：点线边框。
- `double`：双线边框。
- `groove`：凹槽边框，效果像被雕刻的边框。
- `ridge`：凸起边框，与 `groove` 相反。
- `inset`：内嵌边框，显示为向内凹陷的边框。
- `outset`：外凸边框，显示为向外突出的边框。
- `hidden`：隐藏边框，与 `none` 类似，但用于表格布局时有区别。

**`border-width` 属性值**：

- `thin`：设置较细的边框（一般等同于 `1px`，但具体值由浏览器定义）。
- `medium`：设置中等宽度的边框（默认值，一般等同于 `3px`）。
- `thick`：设置较粗的边框（一般等同于 `5px`）。
- 自定义宽度值：使用绝对单位（如 `px`、`em`、`rem`）或百分比。

**`border-color` 属性值**：

- 颜色名称，如 `red`、`blue`、`green`。
- 十六进制颜色代码，如 `#ff0000`、`#00ff00`。
- RGB 颜色值，如 `rgb(255, 0, 0)`。
- RGBA 颜色值（支持透明度），如 `rgba(255, 0, 0, 0.5)`。
- HSL 颜色值，如 `hsl(120, 100%, 50%)`。
- `transparent`：透明颜色。

| 属性 | 描述 |
| ------------------------------------------------------------ | -------------------------------------------------- |
| border-bottom-color | 设置元素的下边框的颜色。                           |
| border-bottom-style | 设置元素的下边框的样式。                           |
| border-bottom-width | 设置元素的下边框的宽度。                           |
| border-bottom | 简写属性，用于把下边框的所有属性设置到一个声明中。 |

| 属性              | 描述                                               |
| ----------------- | -------------------------------------------------- |
| border-left-color | 设置元素的左边框的颜色。                           |
| border-left-style | 设置元素的左边框的样式。                           |
| border-left-width | 设置元素的左边框的宽度。                           |
| border-left       | 简写属性，用于把左边框的所有属性设置到一个声明中。 |

| 属性               | 描述                                               |
| ------------------ | -------------------------------------------------- |
| border-right-color | 设置元素的右边框的颜色。                           |
| border-right-style | 设置元素的右边框的样式。                           |
| border-right-width | 设置元素的右边框的宽度。                           |
| border-right       | 简写属性，用于把右边框的所有属性设置到一个声明中。 |

| 属性             | 描述                                               |
| ---------------- | -------------------------------------------------- |
| border-top-color | 设置元素的上边框的颜色。                           |
| border-top-style | 设置元素的上边框的样式。                           |
| border-top-width | 设置元素的上边框的宽度。                           |
| border-top       | 简写属性，用于把上边框的所有属性设置到一个声明中。 |

> 以上所有的属性值，都一样。



**`border-radius` 属性**：设置圆角的边框。

```css
div {
  border-radius: 10px; /* 为所有四个角设置 10px 的圆角 */
}
div {
  border-radius: 10px 20px; /* 为左右设置 10px 的圆角，上下设置为 20px 的圆角 */
}
div {
  border-radius: 10px 20px 30px 40px; /* 依次为左上角、右上角、右下角、左下角设置不同的圆角 */
}
```



### `outline` 轮廓

轮廓（outline）是绘制于元素周围的一条线，位于边框边缘的外围，可起到突出元素的作用。

**`outline-style` 属性**：设置轮廓线的样式。

- `none`：无轮廓线。

- `solid`：实线轮廓。
- `dotted`：点状轮廓。
- `dashed`：虚线轮廓。
- `double`：双线轮廓。
- `groove`：凹槽轮廓，看起来像3D效果的凹陷。
- `ridge`：脊状轮廓，看起来像3D效果的凸起。
- `inset`：内嵌效果的轮廓。
- `outset`：外凸效果的轮廓。

```css
div {
  outline-style: solid; /* 设置轮廓为实线 */
}
```



**`outline-width` 属性**：设置轮廓线的宽度。

- `thin`：细轮廓线。
- `medium`：中等宽度轮廓线（默认）。
- `thick`：粗轮廓线。



**`outline-color` 属性**：设置轮廓线的颜色。

- 颜色名称：例如 `red`、`blue`、`green`。
- 十六进制颜色值：例如 `#ff0000`（红色）。
- RGB：例如 `rgb(255, 0, 0)`（红色）。
- RGBA：例如 `rgba(255, 0, 0, 0.5)`（50% 透明的红色）。
- HSL：例如 `hsl(0, 100%, 50%)`（红色）。
- `invert`：这个值使得轮廓线颜色会反转显示背景色，确保轮廓线可见。



**`outline-offset` 属性**：设置轮廓线与元素边框之间的距离（即轮廓线的偏移量）。

- 任何合法的长度值，比如 `px`、`em`、`rem` 等。



**`outline`属性（简写）**：是 `outline-width`、`outline-style` 和 `outline-color` 的简写形式，可以在一行中同时设置这些属性。

```css
div {
  outline: 2px dashed blue; /* 设置2px的蓝色虚线轮廓 */
}
```



### `margin` 外边距 & `padding` 填充

| 属性          | 描述                                       |
| ------------- | ------------------------------------------ |
| margin-bottom | 设置元素的下外边距。                       |
| margin-left   | 设置元素的左外边距。                       |
| margin-right  | 设置元素的右外边距。                       |
| margin-top    | 设置元素的上外边距。                       |
| margin        | 简写属性。在一个声明中设置所有外边距属性。 |

```css
div {
    margin-top:100px;
    margin-bottom:100px;
    margin-right:50px;
    margin-left:50px;
    /* margin:100px 50px; */
}
```

| 属性           | 描述                                       |
| -------------- | ------------------------------------------ |
| padding-bottom | 设置元素的底部填充                         |
| padding-left   | 设置元素的左部填充                         |
| padding-right  | 设置元素的右部填充                         |
| padding-top    | 设置元素的顶部填充                         |
| padding        | 使用简写属性设置在一个声明中的所有填充属性 |

```css
div {
    padding-top:25px;
    padding-bottom:25px;
    padding-right:50px;
    padding-left:50px;
    /* padding:25px 50px; */
}
```

### css 尺寸（Dimenslon）

| 属性        | 描述                 |
| :---------- | :------------------- |
| height      | 设置元素的高度。     |
| line-height | 设置行高。           |
| max-height  | 设置元素的最大高度。 |
| max-width   | 设置元素的最大宽度。 |
| min-height  | 设置元素的最小高度。 |
| min-width   | 设置元素的最小宽度。 |
| width       | 设置元素的宽度。     |



### `display` 显示 & `visibility` 可见性

`display` 属性设置一个元素应如何显示。

`visibility` 属性指定一个元素应可见还是隐藏。



**`display:none` 或 `visibility:hidden`  的区别**：

- `visibility:hidden` ：可以隐藏某个元素，但隐藏的元素仍需占用与未隐藏之前一样的空间。
- `display:none` ：可以隐藏某个元素，且隐藏的元素不会占用任何空间。

```css
h1.hidden {
    visibility:hidden;
}
h1.hidden {
    display:none;
}
```



`display` 属性值：

- **`display:block` 块**：占用了全部宽度，前后都是换行符，例如：`<h1>`、`<p>`、`<div>`等。

```css
span {
    display:block;
}
```

![image-20240919100551285](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240919100551285.png)

- **`display:inline` 内联**：只需要必要的宽度，不强制换行，例如：`<span>`、`<a>`等。

```css
li {
	display:inline;
}
```

![image-20240919100808757](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240919100808757.png)



### `position` 定位

`position` 属性：指定了元素的定位类型。

`position` 属性值：

- **`position: static;`（默认）**：HTML 元素的默认值，即**没有定位，遵循正常的文档流对象**。

- **`position: relative;`**：**相对定位元素的定位是相对其正常位置**。（相对正常位置，进行位移操作）
- **`position: fixed;`**：**元素的位置相对于浏览器窗口是固定位置**。
- **`position: absolute;`**：**绝对定位的元素的位置相对于最近的已定位父元素**，如果元素没有已定位的父元素，那么它的位置相对于`<html>`。
- **`position: sticky;`**（粘贴，粘性定位）：基于用户的滚动位置来定位。
  - 粘性定位，效果展示：

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"> 
<style>
div.sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  padding: 5px;
  background-color: #cae8ca;
  border: 2px solid #4CAF50;
}
</style>
</head>
<body>
    
<p>尝试滚动页面。</p>
<p>注意: IE/Edge 15 及更早 IE 版本不支持 sticky 属性。</p>

<div class="sticky">我是粘性定位!</div>

<div style="padding-bottom:2000px">
  <p>滚动我</p>
  <p>来回滚动我</p>
  <p>滚动我</p>
  <p>来回滚动我</p>
  <p>滚动我</p>
  <p>来回滚动我</p>
</div>

</body>
</html>
```

![动画](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/%E5%8A%A8%E7%94%BB.gif)



### `z-index` 堆叠顺序

` z-index` 属性：指定**了一个元素的堆叠顺序**（哪个元素应该放在前面，或后面）

>  经常配合 上面的 `position` 定位使用。



### `overflow` 溢出

`overflow` 属性：可以控制内容溢出元素框时在对应的元素区间内添加滚动条。

| 值         | 描述                                                     |
| :--------- | :------------------------------------------------------- |
| visible    | 默认值。内容不会被修剪，会呈现在元素框之外。             |
| hidden     | 内容会被修剪，并且其余内容是不可见的。                   |
| **scroll** | 内容会被修剪，但是浏览器会显示滚动条以便查看其余的内容。 |
| auto       | 如果内容被修剪，则浏览器会显示滚动条以便查看其余的内容。 |
| inherit    | 规定应该从父元素继承 overflow 属性的值。                 |



### `float` 浮动

**`float`（浮动）属性：会使元素向左或向右移动，其周围的元素也会重新排列**。

| 属性  | 描述                               | 值                           |
| :---- | :--------------------------------- | :--------------------------- |
| clear | 指定不允许元素周围有浮动元素。     | left right both none inherit |
| float | 指定一个盒子（元素）是否可以浮动。 | left right none inherit      |

**重点：清除浮动 - 使用 `clear`**

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"> 
<title>菜鸟教程(runoob.com)</title> 
<style>
    .thumbnail {
        float:left;
        width:110px;
        height:90px;
        margin:5px;
    }
    .text_line {
        clear:both;
        margin-bottom:2px;
    }
</style>
</head>

<body>
    <h3>图片库</h3>
    <p>试着调整窗口,看看当图片没有足够的空间会发生什么。.</p>
    <img class="thumbnail" src="/images/klematis_small.jpg" width="107" height="90">
    <img class="thumbnail" src="/images/klematis2_small.jpg" width="107" height="80">
    <img class="thumbnail" src="/images/klematis3_small.jpg" width="116" height="90">
    <img class="thumbnail" src="/images/klematis4_small.jpg" width="120" height="90">
    <h3 class="text_line">第二行</h3>
    <img class="thumbnail" src="/images/klematis_small.jpg" width="107" height="90">
    <img class="thumbnail" src="/images/klematis2_small.jpg" width="107" height="80">
    <img class="thumbnail" src="/images/klematis3_small.jpg" width="116" height="90">
    <img class="thumbnail" src="/images/klematis4_small.jpg" width="120" height="90">
</body>
</html>
```

![浮动](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/%E6%B5%AE%E5%8A%A8.gif)

### `opacity` 透明度

`opacity` 属性用于设置元素的**透明度**，即元素及其内容的透明程度。

它的取值范围从 `0`（完全透明）到 `1`（完全不透明），中间值表示半透明状态。

`opacity` 属性值：

- `0`：完全透明，元素不可见。

- `1`：完全不透明，元素完全可见。

- 介于 `0` 和 `1` 之间的值：部分透明。例如，`0.5` 表示 50% 透明度，元素会半透明显示。

> IE8和更早版本使用： **`filter:alpha(opacity=100)`**。



### `!important` 规则 

CSS 中的 !important 规则用于增加样式的权重。

**`!important`** 与优先级无关，但它与最终的结果直接相关，使用一个 !important 规则时，此声明将覆盖任何其他声明。

> TIps：都是用了 `!important` ，更具体的，优先级更高。



注意：使用 !important 是一个坏习惯，应该尽量避免，因为这破坏了样式表中的固有的级联规则 使得调试找 bug 变得更加困难了。

## 3. CSS 选择器

**最常用的选择器类型：id选择器、class选择器、分组选择器等**，除此之外，还有：

**嵌套选择器（着重说一下，容易忘记）**，在下面的例子设置了四个样式：

- p{ }: 为所有 p 元素指定一个样式。
- .marked{ }: 为所有 class="marked" 的元素指定一个样式。
- .marked p{ }: 为所有 class="marked" 元素内的 p 元素指定一个样式。
- **p.marked{ }: 为所有 class="marked" 的 p 元素指定一个样式。**

```css
p {
    color:blue;
    text-align:center;
}
.marked {
    background-color:red;
}
.marked p {
    color:white;
}
p.marked {
    text-decoration:underline;
}
```



**后代选择器**，用于选取某元素的后代元素（所有后代元素）：

```css
div p {
  background-color: yellow;
} 
```



**子元素选择器（Child selectors）**，只能选择作为某元素**直接/一级子元素的元素**。

```css
div>p {
  background-color: yellow;
}
```



**相邻兄弟选择器（Adjacent sibling selector）**，可选择紧接在另一元素后的元素，且二者有相同父元素。

```css
div+p {
  background-color: yellow;
}
```



**后续兄弟选择器**，选取所有指定元素之后的相邻兄弟元素。

```css
div~p {
  background-color: yellow;
}
```



**属性选择器**，格式：

```html
<p title="hello">This paragraph has a title.</p>
<p>This one does not.</p>
```

```css
/* 选择所有包含 title 属性的元素 */
[title] {
    color: red;
}
```

1. **`[attribute]`**：选择带有指定属性的所有元素。
2. **`[attribute=value]`**：选择具有指定属性且值精确匹配的元素。
3. **`[attribute~=value]`**：选择具有指定属性，其值包含以空格分隔的某个特定值的元素。
4. **`[attribute|=value]`**：选择具有指定属性，其值以特定值开头，并且后面可以跟上连接符（`-`）的元素。
5. **`[attribute^=value]`**：选择具有指定属性，其值以某个特定值开头的元素。
6. **`[attribute$=value]`**：选择具有指定属性，其值以某个特定值结尾的元素。
7. **`[attribute\*=value]`**：选择具有指定属性，其值中包含某个特定子串的元素。

## 4. 常见的 CSS 框架

1. **Bootstrap**：简化了响应式设计和布局的创建。
2. **Tailwind CSS**：提供了低层次的工具类，允许开发者快速进行定制化设计。


## 5. CSS 水平 & 垂直对齐

###  布局 - 水平 & 垂直对齐

> 针对 水平 和 垂直对齐布局 总结。


### 元素居中对齐

要水平居中对齐一个元素(如 `<div>`), 可以使用 **margin: auto;** 。


### 文本居中对齐

如果仅仅是为了文本在元素内居中对齐，可以使用 **text-align: center;** 。


### 图片居中对齐

要让图片居中对齐, 可以使用 **margin: auto;** 并将它放到 **块** 元素中。


### 左右对齐（使用定位方式 或者 使用 `float` 方式）

我们可以使用 **`position: absolute;`** 属性来对齐左右元素。

我们也可以使用 **`float`** 属性来对齐左右元素。


### 垂直居中对齐（使用 padding 或者 使用 line-height）

**`padding`**  填充，例如：`padding: 70px 0;` 上下设置固定高度实现垂直效果。

**`line-height`** 设置行高，设置和 `height` 一样高，就能达到垂直居中效果。


我们还可以 **使用 `position` 和 `transform` 来设置垂直居中**：

```css
.center p {
    margin: 0;
    /* 通过设置position和transform实现 */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); /* 通过设置 x,y轴位置，实现居中效果 */
}
```


### 水平和垂直都居中 

如果要水平和垂直都居中，可以使用 **`padding`** 和 **`text-align: center`**。


## 6. CSS 伪类 & 伪元素

### CSS 伪类

> CSS伪类是用来添加一些选择器的特殊效果。

> 伪元素用于针对 **选择元素的特定部分**，而伪类用于针对 **选择处于特定状态的元素**。

**伪类的语法**：

```css
[选择器]:[伪类] {
    属性名称: 属性值;
}

selector:pseudo-class {
    property:value;
}
```

**CSS类也可以使用伪类**：

```css
selector.class:pseudo-class {
    property:value;
}
```

```css
/* 例如： */
a:link {color:#FF0000;} /* 未访问的链接 */
a:visited {color:#00FF00;} /* 已访问的链接 */
a:hover {color:#FF00FF;} /* 鼠标划过链接 */
a:active {color:#0000FF;} /* 已选中的链接 */
```

> **注意：** 在CSS定义中，a:hover 必须被置于 a:link 和 a:visited 之后，才是有效的。
>
> **注意：** 在 CSS 定义中，a:active 必须被置于 a:hover 之后，才是有效的。
>
> **注意：伪类的名称不区分大小写。**

**`:first-child` 伪类**：

- 可以使用 `:first-child` 伪类来选择父元素的第一个子元素。

例如：

```css
/* 匹配第一个 `<p>` 元素 */
p:first-child{
    color:blue;
}

/* 匹配所有<p> 元素中的第一个 <i> 元素 */
p > i:first-child
{
    color:blue;
}

/* 匹配所有作为第一个子元素的 <p> 元素中的所有 <i> 元素 */
p:first-child i {
    color:blue;
}
```

| 选择器                                                       | 示例                  | 示例说明                       |
| :----------------------------------------------------------- | :-------------------- |:---------------------------|
| [:checked](https://www.runoob.com/cssref/sel-checked.html)   | input:checked         | 选择所有选中的表单元素                |
| [:disabled](https://www.runoob.com/css/cssref/sel-disabled.html) | input:disabled        | 选择所有禁用的表单元素                |
| [:empty](https://www.runoob.com/cssref/sel-empty.html)       | p:empty               | 选择所有没有子元素的p元素              |
| [:enabled](https://www.runoob.com/cssref/sel-enable.html)    | input:enabled         | 选择所有启用的表单元素                |
| [:first-of-type](https://www.runoob.com/cssref/sel-first-of-type.html) | p:first-of-type       | 选择的每个 p 元素是其父元素的第一个 p 元素   |
| [:in-range](https://www.runoob.com/cssref/sel-in-range.html) | input:in-range        | 选择元素指定范围内的值                |
| [:invalid](https://www.runoob.com/cssref/sel-invalid.html)   | input:invalid         | 选择所有无效的元素                  |
| [:last-child](https://www.runoob.com/cssref/sel-last-child.html) | p:last-child          | 选择所有p元素的最后一个子元素            |
| [:last-of-type](https://www.runoob.com/cssref/sel-last-of-type.html) | p:last-of-type        | 选择每个p元素是其母元素的最后一个p元素       |
| [:not(selector)](https://www.runoob.com/cssref/sel-not.html) | :not(p)               | 选择所有p以外的元素                 |
| [:nth-child(n)](https://www.runoob.com/cssref/sel-nth-child.html) | p:nth-child(2)        | 选择所有 p 元素的父元素的第二个子元素       |
| [:nth-last-child(n)](https://www.runoob.com/cssref/sel-nth-last-child.html) | p:nth-last-child(2)   | 选择所有p元素倒数的第二个子元素           |
| [:nth-last-of-type(n)](https://www.runoob.com/cssref/sel-nth-last-of-type.html) | p:nth-last-of-type(2) | 选择所有p元素倒数的第二个为p的子元素        |
| [:nth-of-type(n)](https://www.runoob.com/cssref/sel-nth-of-type.html) | p:nth-of-type(2)      | 选择所有p元素第二个为p的子元素           |
| [:only-of-type](https://www.runoob.com/cssref/sel-only-of-type.html) | p:only-of-type        | 选择所有仅有一个子元素为p的元素           |
| [:only-child](https://www.runoob.com/cssref/sel-only-child.html) | p:only-child          | 选择所有仅有一个子元素的p元素            |
| [:optional](https://www.runoob.com/cssref/sel-optional.html) | input:optional        | 选择没有"required"的元素属性        |
| [:out-of-range](https://www.runoob.com/cssref/sel-out-of-range.html) | input:out-of-range    | 选择指定范围以外的值的元素属性            |
| [:read-only](https://www.runoob.com/cssref/sel-read-only.html) | input:read-only       | 选择只读属性的元素属性                |
| [:read-write](https://www.runoob.com/cssref/sel-read-write.html) | input:read-write      | 选择没有只读属性的元素属性              |
| [:required](https://www.runoob.com/cssref/sel-required.html) | input:required        | 选择有"required"属性指定的元素属性     |
| [:root](https://www.runoob.com/cssref/sel-root.html)         | root                  | 选择文档的根元素                   |
| [:target](https://www.runoob.com/cssref/sel-target.html)     | #news:target          | 选择当前活动#news元素(点击URL包含锚的名字) |
| [:valid](https://www.runoob.com/cssref/sel-valid.html)       | input:valid           | 选择所有有效值的属性                 |
| [:link](https://www.runoob.com/cssref/sel-link.html)         | a:link                | 选择所有未访问链接                  |
| [:visited](https://www.runoob.com/cssref/sel-visited.html)   | a:visited             | 选择所有访问过的链接                 |
| [:active](https://www.runoob.com/cssref/sel-active.html)     | a:active              | 选择正在活动链接                   |
| [:hover](https://www.runoob.com/cssref/sel-hover.html)       | a:hover               | 把鼠标放在链接上的状态                |
| [:focus](https://www.runoob.com/cssref/sel-focus.html)       | input:focus           | 选择元素输入后具有焦点                |
| [:first-letter](https://www.runoob.com/cssref/sel-firstletter.html) | p:first-letter        | 选择每个`<p>` 元素的第一个字母           |
| [:first-line](https://www.runoob.com/cssref/sel-firstline.html) | p:first-line          | 选择每个`<p>` 元素的第一行             |
| [:first-child](https://www.runoob.com/cssref/sel-firstchild.html) | p:first-child         | 选择器匹配属于任意元素的第一个子元素的 `<p>` 元素 |
| [:before](https://www.runoob.com/cssref/sel-before.html)     | p:before              | 在每个`<p>`元素之前插入内容             |
| [:after](https://www.runoob.com/cssref/sel-after.html)       | p:after               | 在每个`<p>`元素之后插入内容             |
| [:lang(*language*)](https://www.runoob.com/cssref/sel-lang.html) | p:lang(it)            | 为`<p>`元素的lang属性选择一个开始值       |



### CSS 伪元素

> 和伪类差不多，只不过伪元素用于针对 **选择元素的特定部分**，而伪类用于针对 **选择处于特定状态的元素**。

伪元素的语法：

```css
[选择器]:[伪元素] {
    属性名称: 属性值;
}

selector:pseudo-element {
    property:value;
}
```

CSS类也可以使用伪元素：

```css
selector.class:pseudo-element {
    property:value;
}
```

**`:first-line`** 伪元素用于向文本的**首行设置特殊样式**。

```css
p:first-line {
    color:#ff0000;
    font-variant:small-caps; /* 将文本的字体变体设置为 small-caps，即小型大写字母 */
}
```

**`:first-letter`** 伪元素用于向文本的**首字母设置特殊样式**。

```css
p:first-letter {
    color:#ff0000;
    font-size:xx-large;
}
```

**`:before`** 伪元素可以在**元素的内容前面插入新内容**。

```css
h1:before {
    content:url(smiley.gif);
}
```

**`:after`** 伪元素可以在**元素的内容之后插入新内容**。

```css
h1:after {
    content:url(smiley.gif);
}
```

| 选择器                                                       | 示例           | 示例说明                                        |
| :----------------------------------------------------------- | :------------- | :---------------------------------------------- |
| [:link](https://www.runoob.com/cssref/sel-link.html)         | a:link         | 选择所有未访问链接                              |
| [:visited](https://www.runoob.com/cssref/sel-visited.html)   | a:visited      | 选择所有访问过的链接                            |
| [:active](https://www.runoob.com/cssref/sel-active.html)     | a:active       | 选择正在活动链接                                |
| [:hover](https://www.runoob.com/cssref/sel-hover.html)       | a:hover        | 把鼠标放在链接上的状态                          |
| [:focus](https://www.runoob.com/cssref/sel-focus.html)       | input:focus    | 选择元素输入后具有焦点                          |
| [:first-letter](https://www.runoob.com/cssref/sel-firstletter.html) | p:first-letter | 选择每个`<p>` 元素的第一个字母                    |
| [:first-line](https://www.runoob.com/cssref/sel-firstline.html) | p:first-line   | 选择每个`<p>` 元素的第一行                        |
| [:first-child](https://www.runoob.com/cssref/sel-firstchild.html) | p:first-child  | 选择器匹配属于任意元素的第一个子元素的 `<p>` 元素 |
| [:before](https://www.runoob.com/cssref/sel-before.html)     | p:before       | 在每个`<p>`元素之前插入内容                       |
| [:after](https://www.runoob.com/cssref/sel-after.html)       | p:after        | 在每个`<p>`元素之后插入内容                       |
| [:lang(*language*)](https://www.runoob.com/cssref/sel-lang.html) | p:lang(it)     | 为`<p>`元素的lang属性选择一个开始值               |


## 7. CSS 图像拼合技术

CSS 图像拼合技术（CSS Sprite）是一种将**多张小图像合并为一张大图像**，然后通过 CSS 来显示其中不同部分的方法。这个技术的主要目的是**减少 HTTP 请求数量**，提高网页加载速度，尤其在网页需要大量小图标或背景图像时效果显著。

例如：将下面多个图片合并成了一个图片，通过一次请求接收到。

![image-20240919140507409](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240919140507409.png)

**通过 `background: url('img_navsprites_hover.gif') 0 -45px;` ，配置图像显示范围，来达到切换不同图像的效果。**

- **本质上，是用的 `background-position` 实现，上面也只是简写形式**。
- `url('img_navsprites_hover.gif')`作用：设置背景图像的路径，获取 `img_navsprites_hover.gif` 这个图片。

```css
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"> 
<style>
    #navlist {position:relative;}
    #navlist li{margin:0;padding:0;list-style:none;position:absolute;top:0;}
    #navlist li, #navlist a{height:44px;display:block;}

    #home{left:0px;width:46px;}
    #home{background:url('img_navsprites_hover.gif') 0 0;}
    #home a:hover{background: url('img_navsprites_hover.gif') 0 -45px;}

    #prev{left:63px;width:43px;}
    #prev{background:url('img_navsprites_hover.gif') -47px 0;}
    #prev a:hover{background: url('img_navsprites_hover.gif') -47px -45px;}

    #next{left:129px;width:43px;}
    #next{background:url('img_navsprites_hover.gif') -91px 0;} /* 左移91px */
    #next a:hover{background: url('img_navsprites_hover.gif') -91px -45px;} /* 向左移动 91 像素，向上移动 45 像素 */
</style>
</head>

<body>
    <ul id="navlist">
      <li id="home"><a href="default.asp"></a></li>
      <li id="prev"><a href="css_intro.asp"></a></li>
      <li id="next"><a href="css_syntax.asp"></a></li>
    </ul>
</body>
</html>
```

## 8. CSS 媒体类型

CSS 媒体类型（Media Types）用于指定样式表应用于哪种类型的媒体设备。通过媒体类型，**开发者可以针对不同的设备（如屏幕、打印机、移动设备等）进行定制化的样式设计**，确保网页在不同设备上具有良好的表现。

常见的 CSS 媒体类型：

- **`screen`**：针对计算机显示器、平板、智能手机等屏幕设备。

- **`print`**：用于打印时的样式，应用于打印预览和打印输出。

- **`all`**：适用于所有媒体类型。通常用于将样式表应用于所有设备。

- **`speech`**：针对屏幕阅读器和其他语音设备。



**媒体类型通常与 `@media` 规则结合使用，以便为不同的设备定义不同的样式**。

```css
/* 适用于屏幕设备 */
@media screen {
    body {
        background-color: white;
        font-size: 16px;
    }
}

/* 适用于打印设备 */
@media print {
    body {
        background-color: none;
        font-size: 12px;
    }
}
```

在 HTML 中，**你也可以通过 `media` 属性直接在 `<link>` 标签中指定样式表适用的媒体类型**：

```html
<link rel="stylesheet" href="screen.css" media="screen">
<link rel="stylesheet" href="print.css" media="print">
```



媒体类型常与 **媒体查询** 结合使用，可以更灵活地控制样式。例如，你可以根据设备的宽度、屏幕分辨率等条件来加载不同的样式表：

```css
@media screen and (max-width: 768px) {
    body {
        font-size: 14px;
    }
}
```

这个查询将针对屏幕宽度小于或等于 768 像素的设备应用不同的样式。


## 9. CSS 计数器

CSS 计数器通过一个变量来设置，根据规则递增变量。

CSS 计数器根据规则来递增变量。

CSS 计数器使用到以下几个属性：

- `counter-reset` - 创建或者重置计数器
- `counter-increment` - 递增变量
- `content` - 插入生成的内容
- `counter()` 或 `counters()` 函数 - 将计数器的值添加到元素

案例：
```html
<!DOCTYPE html>
<html>
    <head>
    <meta charset="utf-8">
    <style>
        body {
          counter-reset: section;
        }
        
        h2::before {
          counter-increment: section;
          content: "Section " counter(section) ": ";
        }
    </style>
    </head>
    <body>
        <h1>使用 CSS 计数器:</h1>
        <h2>HTML 教程</h2>
        <h2>CSS 教程</h2>
        <h2>JavaScript 教程</h2>
        
        <p><b>注意:</b> IE8 需要指定 !DOCTYPE 才可以支持该属性。</p>
    </body>
</html>
```

> 参考：https://www.runoob.com/css/css-counters.html

## 10. CSS3 新属性


### 边框

| 属性          | 说明                   | CSS  |
| :------------ | :--------------------- | :--- |
| border-image  | 使用图像创建一个边框。 | 3    |
| border-radius | 创建圆角边框。         | 3    |
| box-shadow    | 用来添加阴影。         | 3    |



### 圆角

| 属性                       | 描述                                      |
| :------------------------- | :---------------------------------------- |
| border-radius              | 所有四个边角 border-*-*-radius 属性的缩写 |
| border-top-left-radius     | 定义了左上角的弧度                        |
| border-top-right-radius    | 定义了右上角的弧度                        |
| border-bottom-right-radius | 定义了右下角的弧度                        |
| border-bottom-left-radius  | 定义了左下角的弧度                        |



### 背景

**`background-image` 属性**：可以添加多个背景图片。

```css
#example1 { 
    background-image: url(img_flwr.gif), url(paper.gif); 
    background-position: right bottom, left top; 
    background-repeat: no-repeat, repeat; 
}
/* https://www.runoob.com/try/try.php?filename=trycss3_background_multiple */
```

可以给不同的图片设置多个不同的属性：

```css
#example1 {
    background: url(img_flwr.gif) right bottom no-repeat, url(paper.gif) left top repeat;
}
```



**`background-size` 属性**：指定背景图像的大小。

```css
div {
    background:url(img_flwr.gif);
    background-size:80px 60px;
    background-repeat:no-repeat;
}
```



**`background-origin` 属性**：指定了背景图像的位置区域。

- 属性值：`content-box`， `padding-box` 和 `border-box` 区域内可以放置背景图像。

![image-20240919154318642](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240919154318642.png)



**`background-clip` 属性**：背景剪裁属性是从指定位置开始绘制。

- 属性值：同上。



### 渐变

CSS3 渐变是指在网页中使用两种或多种颜色进行平滑过渡的技术。

CSS3 支持两种类型的渐变：**线性渐变**（linear-gradient）和 **径向渐变**（radial-gradient）。

#### 线性渐变（Linear Gradient）

线性渐变是**沿着一条直线从一种颜色逐渐过渡到另一种颜色**。你可以控制渐变的角度、颜色和过渡点。

**语法**：

```css
background: linear-gradient(direction, color-stop1, color-stop2, ...);
```

- **`direction`**：指定渐变方向，可以使用角度（如 `45deg`）或关键字（如 `to right`）。
- **`color-stop1, color-stop2`**：指定颜色和可选的过渡位置（以百分比表示）。

**示例**：

```css
background: linear-gradient(to right, red, blue);
```

> **效果**：从左到右红色逐渐过渡为蓝色。

```css
background: linear-gradient(90deg, red 20%, blue 80%);
```

> **效果**：沿 90 度方向，红色占 20%，蓝色占 80%。

**常见方向**：

- `to right`：从左到右
- `to left`：从右到左
- `to bottom`：从上到下
- `to top`：从下到上
- `45deg`：45度角（从左上角到右下角）

#### 径向渐变（Radial Gradient）

径向渐变是**从一个中心点向外扩展的渐变，形状可以是圆形或椭圆形**。颜色从中心点开始逐渐向外过渡。

**语法**：

```css
background: radial-gradient(shape size at position, color-stop1, color-stop2, ...);
```

- **`shape`**：渐变的形状，可以是 `circle`（圆形）或 `ellipse`（椭圆）。
- **`size`**：控制渐变的范围，如 `closest-side`（到最接近的一边）、`farthest-side`（到最远的一边）。
- **`position`**：渐变的中心位置，默认是 `center`（可以指定为 `top left`、`bottom right` 等）。

**示例**：

```css
background: radial-gradient(circle, red, blue);
```

> **效果**：从中心点开始红色逐渐过渡到蓝色，渐变范围是一个圆形。

```css
background: radial-gradient(ellipse at center, red 20%, blue 80%);
```

> **效果**：从中心点开始的椭圆形，红色占 20%，蓝色占 80%。

#### 重复渐变（Repeating Gradients）

CSS3 还提供了重复渐变，允许你创建不断重复的渐变模式。与线性和径向渐变类似，使用 `repeating-linear-gradient` 和 `repeating-radial-gradient`。

**语法**：

```css
background: repeating-linear-gradient(direction, color-stop1, color-stop2, ...);
```

**示例**：

```css
background: repeating-linear-gradient(to right, red, blue 10%);
```

> **效果**：从左到右的红蓝渐变，每 10% 颜色重新开始过渡，形成重复的条纹效果。

```css
background: repeating-radial-gradient(circle, red, blue 10%);
```

> **效果**：从中心点开始，形成重复的红蓝圆环。



### 文本

**`text-shadow` 属性**：适用于文本阴影。

```css
h1 {
    text-shadow: 5px 5px 5px #FF0000;
}
```



**`box-shadow` 属性**：适用于盒子阴影。

```css
div {
    box-shadow: 10px 10px 5px #888888;
}
```



**`overflow` 属性**：文本溢出属性指定应向用户如何显示溢出内容。



**`word-wrap` 属性**：如果某个单词太长，不适合在一个区域内，它扩展到外面：CSS3中，**自动换行属性 **允许您强制文本换行 - 即使这意味着分裂它中间的一个字。属性值如下：

- `normal`（默认值）：单词不会被打断，长单词会超出容器边界。只有当单词之间有空格或其他合法的换行符时，内容才会换行。
- **`break-word`**：单词会在必要时断开并换行，以防止内容超出容器。当单词太长时，会在适当的位置自动将单词拆开，换到下一行。



**`word-break` 属性**：**单词拆分换行**属性指定换行规则。

- `keep-all` ： 所有单词不拆分。
- `break-all`：所有单词拆分。



### 字体

`@font-face` 规则：是 CSS 中用于定义**自定义字体**的规则。

```css
<style> 
    @font-face {
        font-family: myFirstFont;
        src: url(sansation_light.woff);
    }

    div {
        font-family:myFirstFont;
	}
</style>
```



### 转换

**`transform` 属性**：是 CSS 中用于应用 2D 或 3D 变换效果的属性，它允许你对元素进行旋转、缩放、移动、倾斜等变换，而不影响周围的元素布局。

#### 常用的 `transform` 函数

1. **`translate(x, y)`**：移动元素。

- 例如：`transform: translate(50px, 100px);` 将元素水平移动 50px，垂直移动 100px。

```css
transform: translate(50px, 100px);
```

2. **`rotate(angle)`**：旋转元素。

- 以指定角度围绕元素中心旋转。
- `angle` 可以是正值或负值，单位是 `deg`（角度）。
- 例如：`transform: rotate(45deg);` 将元素顺时针旋转 45 度。

```css
transform: rotate(45deg);
```

3. **`scale(x, y)`**：缩放元素。

- 沿水平方向和垂直方向缩放元素的大小。
- `x` 代表水平缩放比例，`y` 代表垂直缩放比例。如果只提供一个值，则表示同时缩放水平和垂直方向。
- 例如：`transform: scale(2, 1.5);` 将元素水平放大 2 倍，垂直放大 1.5 倍。

```css
transform: scale(2, 1.5);
```

4. **`skew(x, y)`**：倾斜元素。

- 将元素沿水平方向和垂直方向倾斜。
- `x` 和 `y` 表示沿水平方向和垂直方向的倾斜角度，单位为 `deg`。
- 例如：`transform: skew(20deg, 10deg);` 将元素沿水平倾斜 20 度，垂直倾斜 10 度。

```css
transform: skew(20deg, 10deg);
```

5. **`matrix(a, b, c, d, e, f)`**：应用一个 2D 变换矩阵。

- `matrix()` 函数允许同时应用多种变换（如缩放、旋转、平移）。
- 该方法较为复杂，不常用。



#### 3D 变换函数

1. **`rotateX(angle)`**：沿 X 轴旋转元素。

   ```css
   transform: rotateX(45deg);
   ```

2. **`rotateY(angle)`**：沿 Y 轴旋转元素。

   ```css
   transform: rotateY(60deg);
   ```

3. **`rotateZ(angle)`**：沿 Z 轴旋转元素（与 `rotate()` 效果相同）。

   ```css
   transform: rotateZ(30deg);
   ```

4. **`translateZ(z)`**：沿 Z 轴移动元素（即向前或向后移动元素）。

   ```css
   transform: translateZ(100px);
   ```

5. **`scaleZ(z)`**：沿 Z 轴缩放元素的大小。

   ```css
   transform: scaleZ(1.5);
   ```



#### 组合使用

多个变换可以通过空格组合在一起使用：

```css
transform: translate(50px, 100px) rotate(45deg) scale(1.5);
```



### 过渡

**`transition` 属性：过渡是元素从一种样式逐渐改变为另一种的效果**。 

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"> 
<title>菜鸟教程(runoob.com)</title>
<style> 
div
{
	width: 100px;
	height: 100px;
	background: red;
	transition: width 2s; /* 应用 width属性 的过渡时间。 */
}

div:hover
{
	width:3 00px;
}
</style>
</head>
<body>

<p><b>注意：</b>该实例无法在 Internet Explorer 9 及更早 IE 版本上工作。</p>

<div></div>

<p>鼠标移动到 div 元素上，查看过渡效果。</p>

</body>
</html>
```



| 属性                                                         | 描述                                         | CSS  |
| :----------------------------------------------------------- | :------------------------------------------- | :--- |
| [transition](https://www.runoob.com/cssref/css3-pr-transition.html) | 简写属性，用于在一个属性中设置四个过渡属性。 | 3    |
| [transition-property](https://www.runoob.com/cssref/css3-pr-transition-property.html) | 规定应用过渡的 CSS 属性的名称。              | 3    |
| [transition-duration](https://www.runoob.com/cssref/css3-pr-transition-duration.html) | 定义过渡效果花费的时间。默认是 0。           | 3    |
| [transition-timing-function](https://www.runoob.com/cssref/css3-pr-transition-timing-function.html) | 规定过渡效果的时间曲线。默认是 "ease"。      | 3    |
| [transition-delay](https://www.runoob.com/cssref/css3-pr-transition-delay.html) | 规定过渡效果何时开始。默认是 0。             | 3    |

> Tips：`transition` 是 这四个的简写属性。



### 动画

CSS3 动画是一种使用 CSS 编写的动画效果，可以为 HTML 元素添加动态、平滑的过渡效果。

通过 **`@keyframes` 规则 **定义，并结合 **`animation` 属性 **来控制动画的执行过程。

**动画的组成部分，如下：**

1. **`@keyframes`**：定义动画关键帧的规则。
2. **`animation` 属性**：用于控制动画的执行方式和时长。

例如：

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"> 
<title>菜鸟教程(runoob.com)</title> 
<style> 
div {
	width:100px;
	height:100px;
	background:red;
	position:relative;
	animation:myfirst 5s;
}

@keyframes myfirst {
	0%   {background:red; left:0px; top:0px;}
	25%  {background:yellow; left:200px; top:0px;}
	50%  {background:blue; left:200px; top:200px;}
	75%  {background:green; left:0px; top:200px;}
	100% {background:red; left:0px; top:0px;}
}

</style>
</head>
<body>

<p><b>注意:</b> 该实例在 Internet Explorer 9 及更早 IE 版本是无效的。</p>

<div></div>

</body>
</html>
```

| 属性                                                         | 描述                                                         | CSS  |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :--- |
| [animation](https://www.runoob.com/cssref/css3-pr-animation.html) | 所有动画属性的简写属性。                                     | 3    |
| [animation-name](https://www.runoob.com/cssref/css3-pr-animation-name.html) | 规定 @keyframes 动画的名称。                                 | 3    |
| [animation-duration](https://www.runoob.com/cssref/css3-pr-animation-duration.html) | 规定动画完成一个周期所花费的秒或毫秒。默认是 0。             | 3    |
| [animation-timing-function](https://www.runoob.com/cssref/css3-pr-animation-timing-function.html) | 规定动画的速度曲线。默认是 "ease"。                          | 3    |
| [animation-fill-mode](https://www.runoob.com/cssref/css3-pr-animation-fill-mode.html) | 规定当动画不播放时（当动画完成时，或当动画有一个延迟未开始播放时），要应用到元素的样式。 | 3    |
| [animation-delay](https://www.runoob.com/cssref/css3-pr-animation-delay.html) | 规定动画何时开始。默认是 0。                                 | 3    |
| [animation-iteration-count](https://www.runoob.com/cssref/css3-pr-animation-iteration-count.html) | 规定动画被播放的次数。默认是 1。                             | 3    |
| [animation-direction](https://www.runoob.com/cssref/css3-pr-animation-direction.html) | 规定动画是否在下一周期逆向地播放。默认是 "normal"。          | 3    |
| [animation-play-state](https://www.runoob.com/cssref/css3-pr-animation-play-state.html) | 规定动画是否正在运行或暂停。默认是 "running"。               | 3    |

> Tips：`animation` 是上面所有的简写属性。



### 多列

`column-count`：列数

`column-width`：列宽

`columns`：`column-width  `和 `column-count` 的简写属性

`column-gap`：列间距，格式：`column-gap: length;` （默认值为 `normal`）

`column-rule`：列之间的分割线，格式：`column-rule: width style color;`

`column-span`：跨列，格式：`column-span: none | all;`

- **`none`**：默认值，元素不跨列。
- **`all`**：元素跨所有列。



`column-fill`：填充列的方式，格式：`column-fill: auto | balance;`

- **`auto`**：列会根据内容自然填充，直到一列填满后再填充下一列。

- **`balance`**：列尽可能平衡内容。



`break-inside`：控制列内断行，格式：`break-inside: auto | avoid;`

- **`auto`**：允许中断（默认）。
- **`avoid`**：避免列内中断。



例如：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS3 多列布局示例</title>
    <style>
        /* 为文章内容设置三列布局 */
        .multicolumn {
            column-count: 3; /* 设置列数为3 */
            column-gap: 20px; /* 列与列之间的间距为20px */
            column-rule: 2px solid #ddd; /* 列之间设置一条2px宽的灰色实线 */
        }

        /* 设置标题跨列显示 */
        h2 {
            column-span: all; /* 标题跨所有列 */
        }

        /* 避免图像在列中断开 */
        img {
            break-inside: avoid; /* 防止图像在列中断开 */
            width: 100%; /* 图像宽度设为100%，适应列宽 */
        }
    </style>
</head>
<body>
    <article class="multicolumn">
        <h2>跨列的标题</h2>
        <p>CSS3 的多列布局使得可以像报纸一样排版，轻松实现多列布局。</p>
        <p>通过使用 column-count 和 column-width 属性，你可以控制列数和列宽。结合 column-gap，你可以调整列与列之间的间距。column-rule 可以为列之间添加分割线，使布局更加美观。</p>
        <p>此外，使用 column-span 属性，可以让某些元素（如标题）跨列显示。而 break-inside 属性可以防止图像或其他块级元素被拆分到不同列中。</p>
        <img src="https://via.placeholder.com/300x150" alt="示例图片">
        <p>CSS3 的多列布局功能对于文章、博客、报表等场景非常有用，能够提升内容的可读性和布局的美观度。</p>
    </article>
</body>
</html>
```

**使用多列布局的场景**

- **新闻/文章排版**：长篇文章可以按多列排版，提高可读性。
- **图片或文字布局**：将大量图片或文字进行整齐的列式展示。
- **报表或统计信息**：展示大量数据时，多列布局可以清晰地组织内容。



### 用户界面

`resize` 属性：指定一个元素是否应该由用户去调整大小。

`box-sizing` 属性：允许您以确切的方式定义适应某个区域的具体内容。

`outline-offse`t 属性：对轮廓进行偏移，并在超出边框边缘的位置绘制轮廓。



### 图片

`border-radius` 属性：圆角 或者 椭圆形图片。

`filter` 属性：图片滤镜，格式：`filter: grayscale(100%);`



支持响应式图片，例如：

```css
img {    
    max-width: 100%;  /* 宽度变化，也会跟着变化 */  
    height: auto;
}
```


### 网格布局

TODO 

https://www.runoob.com/css3/css-grid.html





