---
title: vConsole 移动端调试
---

官方地址：https://gitee.com/Tencent/vConsole

一个轻量、可拓展、针对手机网页的前端开发者调试面板。

vConsole 是框架无关的，可以在 Vue、React 或其他任何框架中使用。

现在 vConsole 是微信小程序的官方调试工具。



例如：Vue 项目，在入口文件 `main.ts` 判断当前环境，是否启用vConsole工具：

- 在 `main.ts` 中，入口文件设置以下内容：

```ts
import VConsole from 'vconsole';
const production = import.meta.env.VITE_APP_ENV === "production";
if (!environment.production) {
    new VConsole();
}
```

![image-20250206110738430](https://raw.githubusercontent.com/xupengboo/xupengboo-picture/main/img/image-20250206110738430.png)