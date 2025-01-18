export const themeData = JSON.parse("{\"logo\":\"https://vuejs.org/images/logo.png\",\"navbar\":[{\"text\":\"首页\",\"link\":\"/\"},{\"text\":\"运维\",\"prefix\":\"ops/\",\"children\":[{\"text\":\"Docker\",\"link\":\"/ops/docker.md\"}]}],\"sidebar\":{\"/\":[{\"text\":\"编程语言\",\"children\":[{\"text\":\"vite\",\"prefix\":\"/code/vite\",\"children\":[{\"text\":\"import导入\",\"link\":\"import.md\"}]},{\"text\":\"vue\",\"prefix\":\"/code/vue\",\"children\":[{\"text\":\"avuejs\",\"link\":\"Avuejs.md\"},{\"text\":\"vue构建nginx\",\"link\":\"vue-nginx.md\"}]}]},{\"text\":\"运维部署\",\"children\":[{\"text\":\"Docker\",\"prefix\":\"/ops/docker/\",\"children\":[{\"text\":\"docker 安装\",\"link\":\"install.md\"},{\"text\":\"docker-compose 使用\",\"link\":\"docker-compose.md\"},{\"text\":\"docker 镜像问题\",\"link\":\"docker-pull-image-error.md\"},{\"text\":\"docker 单容器部署-样例\",\"link\":\"docker-single-node.md\"},{\"text\":\"docker 常用命令使用\",\"link\":\"docker-use.md\"},{\"text\":\"dockerfile 编写\",\"link\":\"dockerfile.md\"}]}]}]},\"locales\":{\"/\":{\"selectLanguageName\":\"English\"}},\"colorMode\":\"auto\",\"colorModeSwitch\":true,\"repo\":null,\"selectLanguageText\":\"Languages\",\"selectLanguageAriaLabel\":\"Select language\",\"sidebarDepth\":2,\"editLink\":true,\"editLinkText\":\"Edit this page\",\"lastUpdated\":true,\"lastUpdatedText\":\"Last Updated\",\"contributors\":true,\"contributorsText\":\"Contributors\",\"notFound\":[\"There's nothing here.\",\"How did we get here?\",\"That's a Four-Oh-Four.\",\"Looks like we've got some broken links.\"],\"backToHome\":\"Take me home\",\"openInNewWindow\":\"open in new window\",\"toggleColorMode\":\"toggle color mode\",\"toggleSidebar\":\"toggle sidebar\"}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateThemeData) {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ themeData }) => {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  })
}
