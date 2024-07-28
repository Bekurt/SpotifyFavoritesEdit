import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios'

axios.defaults.baseURL = 'https://accounts.spotify.com'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.config.errorHandler = (err) => console.log('UNCOUGHT ERROR', err)

app.mount('#app')
