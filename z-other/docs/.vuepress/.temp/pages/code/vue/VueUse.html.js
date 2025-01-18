import comp from "D:/project/xupengboo/docs/.vuepress/.temp/pages/code/vue/VueUse.html.vue"
const data = JSON.parse("{\"path\":\"/code/vue/VueUse.html\",\"title\":\"VueUse 工具库\",\"lang\":\"zh-cn\",\"frontmatter\":{},\"headers\":[],\"git\":{},\"filePathRelative\":\"code/vue/VueUse.md\"}")
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
