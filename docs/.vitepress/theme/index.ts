declare global { interface Window { _hmt: any[] } }

import DefaultTheme from 'vitepress/theme'
import { useRouter } from 'vitepress'
import { watch } from 'vue'
import HomeStats from './components/HomeStats.vue'
import Dreams from './components/Dreams.vue'
import MyStory from './components/MyStory.vue'
import Hobbies from './components/Hobbies.vue'
import './custom.css'

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        app.component('HomeStats', HomeStats)
        app.component('Dreams', Dreams)
        app.component('MyStory', MyStory)
        app.component('Hobbies', Hobbies)
    },
    // 全局钩子，仅网站启动时执行一次
    setup() {
        // 配置全局监听逻辑，解决SPA单页面（统计一次问题），_hmt是百度统计的全局变量
        const router = useRouter()
        watch(
            () => router.route.path,
            (path) => {
                console.log(path)
                if (typeof window !== 'undefined' && window._hmt) {
                    window._hmt.push(['_trackPageview', path])
                }
            }
        )
    },
}
