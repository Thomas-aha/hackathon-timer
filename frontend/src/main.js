import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

const app = createApp(App)
app.use(router)
app.use(i18n)
app.use(Antd)
app.mount('#app') 