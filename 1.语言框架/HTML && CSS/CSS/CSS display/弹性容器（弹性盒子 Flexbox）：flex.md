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



**换行设置**：`flex-wrap`，控制弹性项目是否换行及换行方向。

- **`nowrap`**：默认值，不换行。
- **`wrap`**：允许换行，新的行放在旧行下方。
- **`wrap-reverse`**：允许换行，新的行放在旧行上方。