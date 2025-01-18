import comp from "D:/project/xupengboo/docs/.vuepress/.temp/pages/code/vue/vue-nginx.html.vue"
const data = JSON.parse("{\"path\":\"/code/vue/vue-nginx.html\",\"title\":\"如何给Vue项目配置好一个nginx.conf文件？\",\"lang\":\"zh-cn\",\"frontmatter\":{},\"headers\":[],\"git\":{},\"filePathRelative\":\"code/vue/vue-nginx.md\"}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
