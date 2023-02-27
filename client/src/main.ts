import { createApp } from 'vue'
import './styles/index.scss'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import BR from 'element-plus/es/locale/lang/pt-br'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus, { locale: BR, size: 'default' })
app.mount('#app')