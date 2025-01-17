import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'

import sidebar from './sidebar-option'
import navbar from './navbar-option'

export default defineUserConfig({
  bundler: viteBundler(),
  theme: defaultTheme({
    logo: 'https://vuejs.org/images/logo.png',
    navbar,
    sidebar,
  }),
  lang: 'zh-cn',
  title: 'xupengboo',
  description: '这是我的第一个 VuePress 网站',
})
