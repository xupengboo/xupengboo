export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"D:/project/xupengboo/docs/.vuepress/.temp/pages/index.html.js"), meta: {"title":"xupengboo"} }],
  ["/code/vite/import.html", { loader: () => import(/* webpackChunkName: "code_vite_import.html" */"D:/project/xupengboo/docs/.vuepress/.temp/pages/code/vite/import.html.js"), meta: {"title":"import.meta.env.xxx 作用"} }],
  ["/code/vue/Avuejs.html", { loader: () => import(/* webpackChunkName: "code_vue_Avuejs.html" */"D:/project/xupengboo/docs/.vuepress/.temp/pages/code/vue/Avuejs.html.js"), meta: {"title":"Avue js 简化开发"} }],
  ["/code/vue/vue-mult-axios.html", { loader: () => import(/* webpackChunkName: "code_vue_vue-mult-axios.html" */"D:/project/xupengboo/docs/.vuepress/.temp/pages/code/vue/vue-mult-axios.html.js"), meta: {"title":"同一个Vue项目使用多个axios实例"} }],
  ["/code/vue/vue-nginx.html", { loader: () => import(/* webpackChunkName: "code_vue_vue-nginx.html" */"D:/project/xupengboo/docs/.vuepress/.temp/pages/code/vue/vue-nginx.html.js"), meta: {"title":"如何给Vue项目配置好一个nginx.conf文件？"} }],
  ["/code/vue/VuePress.html", { loader: () => import(/* webpackChunkName: "code_vue_VuePress.html" */"D:/project/xupengboo/docs/.vuepress/.temp/pages/code/vue/VuePress.html.js"), meta: {"title":""} }],
  ["/code/vue/VueUse.html", { loader: () => import(/* webpackChunkName: "code_vue_VueUse.html" */"D:/project/xupengboo/docs/.vuepress/.temp/pages/code/vue/VueUse.html.js"), meta: {"title":"VueUse 工具库"} }],
  ["/ops/docker/docker-compose.html", { loader: () => import(/* webpackChunkName: "ops_docker_docker-compose.html" */"D:/project/xupengboo/docs/.vuepress/.temp/pages/ops/docker/docker-compose.html.js"), meta: {"title":"Docker Compose 安装"} }],
  ["/ops/docker/docker-pull-image-error.html", { loader: () => import(/* webpackChunkName: "ops_docker_docker-pull-image-error.html" */"D:/project/xupengboo/docs/.vuepress/.temp/pages/ops/docker/docker-pull-image-error.html.js"), meta: {"title":"解决国内镜像无法访问的问题"} }],
  ["/ops/docker/docker-single-node.html", { loader: () => import(/* webpackChunkName: "ops_docker_docker-single-node.html" */"D:/project/xupengboo/docs/.vuepress/.temp/pages/ops/docker/docker-single-node.html.js"), meta: {"title":"mvn、jdk安装"} }],
  ["/ops/docker/docker-use.html", { loader: () => import(/* webpackChunkName: "ops_docker_docker-use.html" */"D:/project/xupengboo/docs/.vuepress/.temp/pages/ops/docker/docker-use.html.js"), meta: {"title":"Docker基础知识"} }],
  ["/ops/docker/dockerfile.html", { loader: () => import(/* webpackChunkName: "ops_docker_dockerfile.html" */"D:/project/xupengboo/docs/.vuepress/.temp/pages/ops/docker/dockerfile.html.js"), meta: {"title":"如何写一个Dockerfile文件？"} }],
  ["/ops/docker/install.html", { loader: () => import(/* webpackChunkName: "ops_docker_install.html" */"D:/project/xupengboo/docs/.vuepress/.temp/pages/ops/docker/install.html.js"), meta: {"title":"一、Docker 简介"} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"D:/project/xupengboo/docs/.vuepress/.temp/pages/404.html.js"), meta: {"title":""} }],
]);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateRoutes) {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
  }
  if (__VUE_HMR_RUNTIME__.updateRedirects) {
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ routes, redirects }) => {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  })
}
