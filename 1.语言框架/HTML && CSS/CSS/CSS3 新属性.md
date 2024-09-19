# CSS3 新属性

> 记住一下新属性的作用效果。

# 边框

| 属性          | 说明                   | CSS  |
| :------------ | :--------------------- | :--- |
| border-image  | 使用图像创建一个边框。 | 3    |
| border-radius | 创建圆角边框。         | 3    |
| box-shadow    | 用来添加阴影。         | 3    |



# 圆角

| 属性                       | 描述                                      |
| :------------------------- | :---------------------------------------- |
| border-radius              | 所有四个边角 border-*-*-radius 属性的缩写 |
| border-top-left-radius     | 定义了左上角的弧度                        |
| border-top-right-radius    | 定义了右上角的弧度                        |
| border-bottom-right-radius | 定义了右下角的弧度                        |
| border-bottom-left-radius  | 定义了左下角的弧度                        |



# 背景

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



# 渐变

**线性渐变 - 从上到下（默认情况下）**

```css
#grad {
    background-image: linear-gradient(#e66465, #9198e5);
}
```

**线性渐变 - 从左到右**

```css
#grad {
  height: 200px;
  background-image: linear-gradient(to right, red , yellow);
}
```

**线性渐变 - 对角**

```css
#grad {
  height: 200px;
  background-image: linear-gradient(to bottom right, red, yellow);
}
```

> 不常用，TODO https://www.runoob.com/css3/css3-gradients.html





