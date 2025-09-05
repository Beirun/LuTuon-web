//main.ts
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import GoogleSignInPlugin  from 'vue3-google-login';

const app = createApp(App)

app.use(GoogleSignInPlugin ,{
    clientId: import.meta.env.VITE_CLIENT_ID
});

app.use(createPinia())
app.use(router)

app.mount('#app')
