import { createApp } from 'vue'
import App from './App.vue'
// 引入ant design 和主题模式, dark暗黑主题
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.dark.css'

// 全局引入antd图标
import * as Icons from '@ant-design/icons-vue'
// 引入router
import router from './router'

const app = createApp(App)

// 引入图标，i是组件名，Icons[i] 是具体的组件
for (const i in Icons) {
        app.component(i, Icons[i])
}
app.use(router)
app.use(Antd)
app.mount('#app')

