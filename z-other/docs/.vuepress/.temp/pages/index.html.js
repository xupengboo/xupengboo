import comp from "D:/project/xupengboo/docs/.vuepress/.temp/pages/index.html.vue"
const data = JSON.parse("{\"path\":\"/\",\"title\":\"xupengboo\",\"lang\":\"zh-cn\",\"frontmatter\":{},\"headers\":[],\"git\":{\"updatedTime\":1737106267000,\"contributors\":[{\"name\":\"xupengboo\",\"username\":\"xupengboo\",\"email\":\"417129883@qq.com\",\"commits\":2,\"url\":\"https://github.com/xupengboo\"}]},\"filePathRelative\":\"README.md\"}")
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
