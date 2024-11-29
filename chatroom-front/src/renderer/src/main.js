import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/el-icon.css'

import router from '@/router'

const app = createApp(App).use(router)
app.use(ElementPlus)
app.mount('#app')
