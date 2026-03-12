import DefaultTheme from 'vitepress/theme'
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
    }
}
