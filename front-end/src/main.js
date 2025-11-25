import { createApp } from 'vue'
import './assets/style.css'
import App from './App.vue'
import { router } from "./routes/index.js"
const app = createApp(App)
app.use(router)
app.mount('#app')
