# Vue 的实用工具库

## 1. VueUse 

官方地址：https://vueuse.nodejs.cn/

VueUse ：可以被看作是 Vue 生态系统中的一个 **扩展工具库**。

使用场景，例如：

1. **通过使用元素 `useWindowSize` 实现PC端与移动端自适应页面切换效果**。

```vue
<script setup lang="ts">
import {useWindowSize} from "@vueuse/core";
import {computed, ref} from "vue";
import Screen from "@/pages/Screen.vue";
import PhoneTheme from "@/pages/PhoneTheme.vue";
import {useAuthService} from "@/service/AuthService";
import dd from "dingtalk-jsapi";

// 使用 useWindowSize() 传感器 来获取宽度，进而判断效果。
const {width: screenWidth} = useWindowSize();

const authService = useAuthService()
const authSuccess = ref(false);
if (dd.env.platform != "notInDingTalk") {
  authService.loginByDingTalkCode().then(res => {
    authSuccess.value = true;
    console.log("loginByDingTalkCode success", res);
  })
} else {
  authSuccess.value = true;
}

// 通过判断宽度的size来，来显示不同页面。
const themeType = computed(() => {
  if (screenWidth.value > 735) {
    return "pc";
  } else {
    return "phone";
  }
})
</script>

<template>
  <template v-if="authSuccess">
    <template v-if="themeType === 'pc'">
      <Screen/>
    </template>
    <template v-else>
      <PhoneTheme/>
    </template>
  </template>
</template>

<style scoped lang="scss">
</style>
```

> 优点：能够动态监听页面的变化。



