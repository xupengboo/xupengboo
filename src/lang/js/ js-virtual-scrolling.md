# 虚拟滚动

虚拟滚动（有时称为 虚拟列表、虚拟滚动条）是 JavaScript 中的一种技术，旨在**优化大数据量的列表渲染**，尤其是当有成千上万的数据项时，直接渲染整个列表会导致性能问题。虚拟列表通过只渲染用户视口中可见的那一部分列表项，从而减少 DOM 元素的数量和内存占用，提高渲染性能。

**使用场景：只渲染可视区域内的内容来优化大数据量渲染性能的技术**。

## JS 实现简单的虚拟滚动效果

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Virtual Scrolling Example</title>
    <style>
        #container {
            height: 300px;
            overflow-y: auto;
            position: relative;
            border: 1px solid #ccc;
        }
        .item {
            height: 50px;
            box-sizing: border-box;
            border-bottom: 1px solid #e0e0e0;
            position: absolute;
            width: 100%;
            left: 0;
            display: flex;
            align-items: center;
            padding-left: 10px;
        }
    </style>
</head>
<body>

<div id="container"></div>

<script>
// 总数据项数
const totalItems = 10000;
// 每个数据项的高度
const itemHeight = 50;
// 计算视口中最多可以显示多少个数据项
const containerHeight = 300;
const visibleItemCount = Math.ceil(containerHeight / itemHeight);

// 获取容器元素
const container = document.getElementById('container');

// 创建一个空白的填充容器，用于撑开滚动条
const spacer = document.createElement('div');
spacer.style.height = `${totalItems * itemHeight}px`;
container.appendChild(spacer);

// 创建可见项的容器
const visibleItemsContainer = document.createElement('div');
container.appendChild(visibleItemsContainer);

// 渲染可见项的函数
function renderVisibleItems(scrollTop) {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(startIndex + visibleItemCount, totalItems);

    // 清空之前的可见项
    visibleItemsContainer.innerHTML = '';

    // 渲染当前视口中的数据项
    for (let i = startIndex; i < endIndex; i++) {
        const item = document.createElement('div');
        item.className = 'item';
        item.style.top = `${i * itemHeight}px`;
        item.textContent = `Item ${i + 1}`;
        visibleItemsContainer.appendChild(item);
    }
}

// 初始化渲染
renderVisibleItems(0);

// 添加滚动事件监听
container.addEventListener('scroll', () => {
    const scrollTop = container.scrollTop;
    renderVisibleItems(scrollTop);
});
</script>
</body>
</html>
```

1. 根据高度等属性，计算出滚动条的滚动大小效果。

![image-20240904140033136](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240904140033136.png)

2. 根据 **滚动监听和索引位置改变** ，来实现DOM元素切换。

![image-20240904140326919](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240904140326919.png)



## VueUse 虚拟滚动条 工具

VueUse 虚拟滚动条：[https://vueuse.nodejs.cn/core/useVirtualList/#usevirtuallist](https://vueuse.nodejs.cn/core/useVirtualList/#usevirtuallist)

![image-20240904135408561](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20240904135408561.png)

根据官方案例来就行，使用起来很简单。

