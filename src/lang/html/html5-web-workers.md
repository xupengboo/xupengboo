---
title: HTML5 WebWorkers 使用
order: 7
---

# Web Workers

Web Workers（类似前端 线程效果）

web worker 是运行在后台的 JavaScript，不会影响页面的性能。

当在 HTML 页面中执行脚本时，页面的状态是不可响应的，直到脚本已完成。

**web worker 是运行在后台的 JavaScript，独立于其他脚本，不会影响页面的性能。相当于一个线程，不会影响主线程的效果**。您可以继续做任何愿意做的事情：点击、选取内容等等，而此时 web worker 在后台运行。

案例，`index.html` 文件：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Web Worker Example</title>
</head>
<body>
  <h1>Sorting a Large Array with Web Worker</h1>
  
  <button id="startSort">Start Sorting</button>
  <p id="status">Click the button to start sorting</p>

  <script>
    // 获取按钮和状态显示元素
    const startSortButton = document.getElementById('startSort');
    const status = document.getElementById('status');
    
    // 创建 Web Worker 实例
    const worker = new Worker('worker.js');

    // 当 Web Worker 发送消息时处理返回结果
    worker.onmessage = function(event) {
      status.textContent = 'Sorting Completed! First element: ' + event.data[100];
    };

    // 点击按钮时开始排序任务
    startSortButton.onclick = function() {
      status.textContent = 'Sorting... Please wait';
      
      // 生成一个包含1000000个随机数的数组
      const largeArray = Array.from({ length: 1000000 }, () => Math.floor(Math.random() * 1000000));
      
      // 向 Web Worker 发送数组进行排序
      worker.postMessage(largeArray);
    };
  </script>
</body>
</html>
```

`worker.js` 文件：

```js
// Web Worker 接收到主线程的消息时处理排序任务
onmessage = function(event) {
  const largeArray = event.data;

  // 对数组进行排序
  const sortedArray = largeArray.sort((a, b) => a - b);

  // 将排序后的数组发送回主线程
  postMessage(sortedArray);
};
```

> Tips：可以通过 http-server 服务，进行启动，测试案例。
