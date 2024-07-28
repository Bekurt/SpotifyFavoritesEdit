import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios'
import { VueQueryPlugin } from '@tanstack/vue-query'

axios.defaults.baseURL = 'https://accounts.spotify.com'

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.use(VueQueryPlugin)

app.config.errorHandler = (err) => console.log('UNCOUGHT ERROR', err)

app.mount('#app')
