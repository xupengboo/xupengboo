# 弹性容器（弹性盒子 Flexbox）：flex

**弹性容器**：使用 `display: flex;` 或 `display: inline-flex;` 定义。

- `display: flex;` 使元素成为块级弹性容器。
- `display: inline-flex;` 使元素成为内联弹性容器。



**轴方向**：

- **主轴（Main Axis）**：定义内容的主要排列方向，从 `main start` 到 `main end`。
- **交叉轴（Cross Axis）**：与主轴垂直的方向，从 `cross start` 到 `cross end`。



**轴的方向设置**：

**`flex-direction`**：定义主轴的方向。

- **`row`**：主轴为水平方向，交叉轴为垂直方向。
- **`column`**：主轴为垂直方向，交叉轴为水平方向。
- **`row-reverse`**：主轴为水平方向，但从右到左排列。

![image-20240830150606946](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240830150606946.png)

- **`column-reverse`**：主轴为垂直方向，但从下到上排列。

![image-20240830150627853](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240830150627853.png)



**主轴上的排列方式**：**`justify-content`**，控制弹性项目在主轴上的排列方式。

- **`center`**：项目居中对齐。
- **`space-around`**：每个项目两侧的间隔相等，项目与容器边缘有间距。
- **`space-between`**：项目两端对齐，项目之间的间隔相等。
- **`flex-start`**：项目从主轴的起点开始对齐。
- **`flex-end`**：项目从主轴的终点开始对齐。



**交叉轴上的排列方式**：**`align-items`**，控制弹性项目在交叉轴上的排列方式。

- **`center`**：项目在交叉轴上居中对齐。
- **`flex-start`**：项目在交叉轴起点对齐。
- **`flex-end`**：项目在交叉轴终点对齐。
- **`baseline`**：项目基于第一行文字的基线对齐。
- **`stretch`**：默认值，项目在交叉轴上拉伸以填满容器。



**换行设置**：**`flex-wrap`**，控制弹性项目是否换行及换行方向。

- **`nowrap`**：默认值，不换行。
- **`wrap`**：允许换行，新的行放在旧行下方。
- **`wrap-reverse`**：允许换行，新的行放在旧行上方。



**控制多行的对齐：`align-content` 属性**，用于控制多行的对齐方式，如果只有一行则不会起作用。



**排序设置：`order` 属性**，设置弹性子元素排列顺序，**用整数值来定义排列顺序，数值小的排在前面。可以为负值**。

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"> 
<style> 
.flex-container {
    display: -webkit-flex;
    display: flex;
    width: 400px;
    height: 250px;
    background-color: lightgrey;
}

.flex-item {
    background-color: cornflowerblue;
    width: 100px;
    height: 100px;
    margin: 10px;
}

.first {
    -webkit-order: -1;
    order: -1; /* 设置元素排序 */
}
</style>
</head>
<body>

<div class="flex-container">
  <div class="flex-item">flex item 1</div>
  <div class="flex-item first">flex item 2</div>
  <div class="flex-item">flex item 3</div>  
</div>

</body>
</html>
```



**`align-self` 属性**，用于设置弹性元素自身在侧轴（纵轴）方向上的对齐方式。

```css
.flex-item {
    background-color: cornflowerblue;
    width: 60px;
    min-height: 100px;
    margin: 10px;
}
 
.item1 {
    -webkit-align-self: flex-start;
    align-self: flex-start;
}
.item2 {
    -webkit-align-self: flex-end;
    align-self: flex-end;
}
 
.item3 {
    -webkit-align-self: center;
    align-self: center;
}
 
.item4 {
    -webkit-align-self: baseline;
    align-self: baseline;
}
 
.item5 {
    -webkit-align-self: stretch;
    align-self: stretch;
}
```

![image-20240920105455739](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240920105455739.png)

**`flex` 属性**：用于指定弹性子元素如何分配空间。

```css
.flex-item {
    background-color: cornflowerblue;
    margin: 10px;
}
 
.item1 {
    -webkit-flex: 2;
    flex: 2;
}
 
.item2 {
    -webkit-flex: 1;
    flex: 1;
}
 
.item3 {
    -webkit-flex: 1;
    flex: 1;
}
```

![image-20240920105620797](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240920105620797.png)



