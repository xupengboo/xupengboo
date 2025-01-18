// Web Worker 接收到主线程的消息时处理排序任务
onmessage = function(event) {
  const largeArray = event.data;

  // 对数组进行排序
  const sortedArray = largeArray.sort((a, b) => a - b);

  // 将排序后的数组发送回主线程
  postMessage(sortedArray);
};
