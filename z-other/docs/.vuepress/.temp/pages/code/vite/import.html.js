import comp from "D:/project/xupengboo/docs/.vuepress/.temp/pages/code/vite/import.html.vue"
const data = JSON.parse("{\"path\":\"/code/vite/import.html\",\"title\":\"import.meta.env.xxx 作用\",\"lang\":\"zh-cn\",\"frontmatter\":{},\"headers\":[],\"git\":{},\"filePathRelative\":\"code/vite/import.md\"}")
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
