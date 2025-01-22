---
title: Vue 嵌入多个 axios
order: 5
---

## Vue 嵌入多个 axios

项目要做部分隔离，对接其他项目，可能会用到多个 `axios`，这样既不会影响原系统，还可以对接要对接的系统。

1. 先将多个不同的 `axios`实例 创建出来：

![image-20241023162820821](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241023162820821.png)

2. 之后，在 `main.js` 中引入，这多个`axios` 实例。

![image-20241023163003855](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241023163003855.png)

3. 一般项目中，会有 `api` 目录，来管理所有的请求，这样我们就可以根据不同的项目，按照目录进行拆分管理即可。

![image-20241023163223189](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241023163223189.png)

4. 对应项目，引入对应的axios实例，即可。

```js
// api 目录，引入当前项目的axios
import request from '@/axios';

export const modelList = (current, size, params) => {
  return request({
    url: '/xxx/model/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    },
  });
};

// api-srm 目录，引入对接的第三方项目的axios实例
import requestSrm from '@/axios-srm';

export const modelView = params => {
  return requestSrm({
    url: '/xxx/model-view',
    method: 'get',
    params,
  });
};
```

5. 通过 Vue的开发代理，只要同域名，`axios`没有做单独的配置操作（例如：访问其他地址【容易造成跨域，一般还是和当前同一个地址】），也是同样适用的。

- 通过一些特殊方式，例如：前缀、匹配规则等等控制他们。

![image-20241023163809191](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20241023163809191.png)



