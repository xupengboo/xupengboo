---
title: Vue 生态工具速览
---

# Vue 生态工具速览

收录 Vue 开发中常用的工具库与组件库，便于快速查阅和选型。

## 工具速查表

| 工具                                                         | 类型         | 适用场景              | 官网                                |
| ------------------------------------------------------------ | ------------ | --------------------- | ----------------------------------- |
| [Element Plus](https://claude.ai/chat/a6350b76-f106-4700-8410-644e62ce8799#element-plus) | UI 组件库    | PC 端中后台           | https://element-plus.org            |
| [Naive UI](https://claude.ai/chat/a6350b76-f106-4700-8410-644e62ce8799#naive-ui) | UI 组件库    | PC 端，TS 友好        | https://www.naiveui.com             |
| [Vant](https://claude.ai/chat/a6350b76-f106-4700-8410-644e62ce8799#vant) | UI 组件库    | 移动端 H5             | https://vant-ui.github.io/vant      |
| [AVue](https://claude.ai/chat/a6350b76-f106-4700-8410-644e62ce8799#avue) | 低代码组件库 | 快速搭建 CRUD 后台    | https://avuejs.com                  |
| [Pinia](https://claude.ai/chat/a6350b76-f106-4700-8410-644e62ce8799#pinia) | 状态管理     | 全局状态共享（Vue 3） | https://pinia.vuejs.org             |
| [Vuex](https://claude.ai/chat/a6350b76-f106-4700-8410-644e62ce8799#vuex) | 状态管理     | 全局状态共享（Vue 2） | https://vuex.vuejs.org              |
| [Vue Router](https://claude.ai/chat/a6350b76-f106-4700-8410-644e62ce8799#vue-router) | 路由管理     | SPA 路由控制          | https://router.vuejs.org            |
| [Axios](https://claude.ai/chat/a6350b76-f106-4700-8410-644e62ce8799#axios) | HTTP 请求    | 接口请求封装          | https://axios-http.com              |
| [VueUse](https://claude.ai/chat/a6350b76-f106-4700-8410-644e62ce8799#vueuse) | 工具函数库   | 组合式 API 工具集     | https://vueuse.nodejs.cn            |
| [ECharts](https://claude.ai/chat/a6350b76-f106-4700-8410-644e62ce8799#echarts) | 图表库       | 数据可视化 / 大屏     | https://echarts.apache.org          |
| [Swiper](https://claude.ai/chat/a6350b76-f106-4700-8410-644e62ce8799#swiper) | 轮播组件     | 滑动 / 轮播交互       | https://www.swiperjs.net            |
| [GSAP](https://claude.ai/chat/a6350b76-f106-4700-8410-644e62ce8799#gsap) | 动画库       | 复杂动效 / 页面过渡   | https://gsap.com                    |
| [VeeValidate](https://claude.ai/chat/a6350b76-f106-4700-8410-644e62ce8799#veevalidate) | 表单验证     | 复杂表单校验          | https://vee-validate.logaretm.com   |
| [Vue I18n](https://claude.ai/chat/a6350b76-f106-4700-8410-644e62ce8799#vue-i18n) | 国际化       | 多语言支持            | https://vue-i18n.intlify.dev        |
| [NProgress](https://claude.ai/chat/a6350b76-f106-4700-8410-644e62ce8799#nprogress) | 进度条       | 路由跳转加载进度      | https://ricostacruz.com/nprogress   |
| [vConsole](https://claude.ai/chat/a6350b76-f106-4700-8410-644e62ce8799#vconsole) | 调试工具     | 移动端 H5 调试        | https://github.com/Tencent/vConsole |

------

## Element Plus

**官方文档**：https://element-plus.org/zh-CN/

基于 Vue 3 的**企业级 UI 组件库**，由饿了么前端团队维护，是国内中后台项目最主流的选择。提供 70+ 高质量组件，覆盖表单、表格、弹窗、导航等所有常见场景。

```bash
npm install element-plus
// main.js — 全量引入
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
app.use(ElementPlus)
```

:::tip 按需引入 推荐配合 `unplugin-auto-import` + `unplugin-vue-components` 实现自动按需引入，减少打包体积。 :::

------

## Naive UI

**官方文档**：https://www.naiveui.com/zh-CN/

Vue 3 的**现代化 UI 组件库**，由尤雨溪推荐，提供 90+ 组件，完整支持 TypeScript，主题定制能力强，无需额外引入 CSS 文件（全量 JS-in-CSS）。

```bash
npm install naive-ui
```

:::tip 与 Element Plus 的区别 Naive UI 对 TypeScript 支持更好，主题定制更灵活；Element Plus 生态更成熟、使用更广泛。两者按团队习惯选择即可。 :::

------

## Vant

**官方文档**：https://vant-ui.github.io/vant/

专为**移动端**打造的 Vue 组件库，轻量、高性能，提供 60+ 组件，覆盖电商、支付、表单等移动端常见场景，是 H5 / 移动端项目的首选。

```bash
npm install vant
```

------

## VueUse

**官方文档**：https://vueuse.nodejs.cn/

Vue 生态中的**组合式工具函数库**，基于 Composition API 封装了大量实用的工具函数，涵盖传感器、浏览器、状态、动画等场景，开箱即用。

**常用示例 — `useWindowSize`**：监听窗口尺寸变化，实现 PC 端与移动端页面自适应切换。

```vue
<script setup lang="ts">
import { useWindowSize } from "@vueuse/core";
import { computed } from "vue";

const { width: screenWidth } = useWindowSize();

// 根据宽度判断当前终端类型
const themeType = computed(() => screenWidth.value > 735 ? "pc" : "phone");
</script>

<template>
  <Screen v-if="themeType === 'pc'" />
  <PhoneTheme v-else />
</template>
```

:::tip `useWindowSize` 能**动态监听**窗口尺寸变化，无需手动绑定 `resize` 事件。 :::

------

## Pinia

**官方文档**：https://pinia.vuejs.org/zh/

Vue 3 官方推荐的**状态管理库**，是 Vuex 的替代方案。API 更简洁，完整支持 TypeScript，天然支持组合式 API 风格，并支持开发者工具调试。

```bash
npm install pinia
// stores/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({ name: '', token: '' }),
  getters: {
    isLogin: (state) => !!state.token,
  },
  actions: {
    setUser(name, token) {
      this.name = name
      this.token = token
    }
  }
})
<!-- 组件中使用 -->
<script setup>
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
</script>
```

:::tip 持久化 配合 `pinia-plugin-persistedstate` 插件可一行代码实现状态持久化到 `localStorage`。 :::

------

## Vuex

**官方文档**：https://vuex.vuejs.org/zh/

Vue 2 时代的**官方状态管理库**，与 Pinia 定位完全一致，核心概念为 `state`、`mutations`、`actions`、`getters`。Vue 3 项目推荐直接使用 Pinia，Vuex 主要用于维护老项目。

```bash
npm install vuex@3  # Vue 2 用 v3
npm install vuex@4  # Vue 3 用 v4（兼容过渡用，新项目建议 Pinia）
// store/index.js（Vue 2 写法）
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    name: ''
  },
  mutations: {
    // 同步修改 state，必须通过 mutations
    SET_USER(state, payload) {
      state.token = payload.token
      state.name  = payload.name
    }
  },
  actions: {
    // 异步操作，再提交 mutation
    async login({ commit }, credentials) {
      const res = await loginApi(credentials)
      commit('SET_USER', res.data)
    }
  },
  getters: {
    isLogin: state => !!state.token
  }
})
```

:::tip Pinia vs Vuex 对比

|            | Vuex                      | Pinia                    |
| ---------- | ------------------------- | ------------------------ |
| 适用版本   | Vue 2（v3） / Vue 3（v4） | Vue 3                    |
| 修改状态   | 必须通过 `mutations`      | 直接修改或通过 `actions` |
| TypeScript | 支持较弱                  | 完整支持                 |
| 模块化     | 需手动配置 `modules`      | 每个 store 天然独立      |
| 代码量     | 较多（需写 mutations）    | 更简洁                   |

新项目统一用 **Pinia**，老 Vue 2 项目继续用 **Vuex**。 :::

------

## Vue Router

**官方文档**：https://router.vuejs.org/zh/

Vue 官方**路由管理库**，支持动态路由、嵌套路由、路由守卫、懒加载等功能，是构建 SPA 应用的标配。

```bash
npm install vue-router
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('@/views/Home.vue') },
  { path: '/about', component: () => import('@/views/About.vue') },
  // 需要登录才能访问的页面
  { path: '/dashboard', component: () => import('@/views/Dashboard.vue'), meta: { requiresAuth: true } },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
// 路由守卫 — 登录拦截
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isLoggedIn()) return '/login'
})
```

------

## Axios

**官方文档**：https://axios-http.com/zh/

最流行的 **HTTP 请求库**，支持 Promise、拦截器、请求取消、自动转换 JSON 等特性，Vue 项目中几乎是标配。

```bash
npm install axios
// src/axios.js — 封装实例
import axios from 'axios'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
})

// 请求拦截器 — 自动附加 Token
request.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 响应拦截器 — 统一错误处理
request.interceptors.response.use(
  res => res.data,
  err => {
    if (err.response?.status === 401) router.push('/login')
    return Promise.reject(err)
  }
)

export default request
```

------

## AVue

**官方文档**：https://avuejs.com/

基于 Vue + Element UI 封装的**低代码组件库**，通过 JSON 配置驱动 UI，极大简化了中后台表单、表格等场景的开发工作量。

**核心组件**：

| 组件        | 说明                                 |
| ----------- | ------------------------------------ |
| `avue-form` | 表单组件，JSON 配置即可生成完整表单  |
| `avue-crud` | 增删改查组件，覆盖绝大多数列表页场景 |
| `avue-data` | 数据可视化组件                       |

:::tip 适合快速搭建管理后台，减少重复的 CRUD 页面开发。 :::

------

## Swiper

**官方文档**：https://www.swiperjs.net/

**精品案例**：https://www.swiperjs.net/demo/pc-best.html

功能强大的**轮播 / 滑动组件**，支持多种切换动效，适用于 Banner 轮播、图片画廊、全屏滑动等场景，Vue 项目可直接通过 `swiper/vue` 集成使用。

------

## ECharts

**官方文档**：https://echarts.apache.org/zh/index.html

Apache 开源的**数据可视化图表库**，功能最全面的图表解决方案，支持折线图、柱状图、饼图、地图、3D 图表等数十种图表类型，在大屏可视化场景中广泛使用。

```bash
npm install echarts
npm install vue-echarts  # Vue 封装版，更易用
<script setup>
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([BarChart, GridComponent, CanvasRenderer])

const option = {
  xAxis: { data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  yAxis: {},
  series: [{ type: 'bar', data: [120, 200, 150, 80, 70] }]
}
</script>

<template>
  <VChart :option="option" style="height: 300px" />
</template>
```

------

## GSAP

**官方文档**：https://gsap.com/

专业级 **JavaScript 动画库**，可以对任何 DOM 元素、CSS 属性、SVG 做流畅的动画处理，在需要复杂动效（如页面过渡、视差滚动、逐帧动画）时是首选。

```bash
npm install gsap
<script setup>
import { gsap } from 'gsap'
import { onMounted, ref } from 'vue'

const box = ref(null)

onMounted(() => {
  // 入场动画：从左侧淡入
  gsap.from(box.value, { x: -100, opacity: 0, duration: 0.8, ease: 'power2.out' })
})
</script>

<template>
  <div ref="box" class="box">Hello GSAP</div>
</template>
```

:::tip GSAP 免费版已能覆盖绝大多数动效需求，付费插件（ScrollTrigger、MorphSVG 等）可实现更复杂的滚动驱动动画。 :::

------

## VeeValidate

**官方文档**：https://vee-validate.logaretm.com/v4/

Vue 3 生态中最主流的**表单验证库**，基于 Composition API，支持与 `yup`、`zod` 等 Schema 验证库配合使用，适合复杂表单场景。

```bash
npm install vee-validate yup
<script setup>
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    email: yup.string().required('邮箱不能为空').email('邮箱格式不正确'),
    password: yup.string().required('密码不能为空').min(6, '密码至少 6 位'),
  })
})

const { value: email, errorMessage: emailError } = useField('email')
const { value: password, errorMessage: passwordError } = useField('password')

const onSubmit = handleSubmit(values => console.log(values))
</script>

<template>
  <form @submit="onSubmit">
    <input v-model="email" placeholder="邮箱" />
    <span>{{ emailError }}</span>
    <input v-model="password" type="password" placeholder="密码" />
    <span>{{ passwordError }}</span>
    <button type="submit">登录</button>
  </form>
</template>
```

------

## Vue I18n

**官方文档**：https://vue-i18n.intlify.dev/

Vue 官方推荐的**国际化（i18n）解决方案**，支持多语言切换、日期 / 数字格式化、复数处理等，适合需要多语言支持的项目。

```bash
npm install vue-i18n
// src/i18n/index.js
import { createI18n } from 'vue-i18n'

export default createI18n({
  locale: 'zh-CN',
  fallbackLocale: 'en',
  messages: {
    'zh-CN': { hello: '你好', welcome: '欢迎使用 {name}' },
    'en':    { hello: 'Hello', welcome: 'Welcome to {name}' },
  }
})
<template>
  <!-- 基础用法 -->
  <p>{{ $t('hello') }}</p>
  <!-- 插值 -->
  <p>{{ $t('welcome', { name: 'Vue App' }) }}</p>
</template>
```

------

## NProgress

**官方文档**：https://ricostacruz.com/nprogress/

页面**顶部加载进度条**工具，轻量无依赖。通常配合 Vue Router 的路由守卫使用，在页面跳转时自动显示 / 隐藏进度条，提升用户体验，是中后台项目的标配。

```bash
npm install nprogress
// router/index.js
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 可选：自定义配置
NProgress.configure({ showSpinner: false })

router.beforeEach(() => {
  NProgress.start()
})

router.afterEach(() => {
  NProgress.done()
})
```

:::tip 通过修改 CSS 可自定义进度条颜色：

```css
#nprogress .bar { background: #your-color; }
```

:::

------

## vConsole

**官方文档**：https://github.com/Tencent/vConsole

腾讯开源的**移动端调试面板**，在手机浏览器上模拟 PC 控制台，支持查看 Log 日志、Network 请求、Storage 存储、Element 结构等，开发移动端 H5 时必备。

```bash
npm install vconsole
// main.js — 仅在开发环境加载，避免生产环境暴露调试信息
if (import.meta.env.DEV) {
  const VConsole = (await import('vconsole')).default
  new VConsole()
}
```

:::warning 注意 务必只在**开发 / 测试环境**中启用 vConsole，不要带到生产环境，否则会在页面右下角显示调试入口。 :::
