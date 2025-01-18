import comp from "D:/project/xupengboo/docs/.vuepress/.temp/pages/code/vue/Avuejs.html.vue"
const data = JSON.parse("{\"path\":\"/code/vue/Avuejs.html\",\"title\":\"Avue js 简化开发\",\"lang\":\"zh-cn\",\"frontmatter\":{},\"headers\":[],\"git\":{},\"filePathRelative\":\"code/vue/Avuejs.md\"}")
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
