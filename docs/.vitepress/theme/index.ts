import DefaultTheme from 'vitepress/theme'
import HomeStats from './components/HomeStats.vue'
import './custom.css'

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        app.component('HomeStats', HomeStats)
    }
}
