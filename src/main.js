import { createApp } from 'vue'
import './style.css'
import App from './App.vue'


//Import el store
import store from './store/indexStore';

createApp(App)
.use(store)
.mount('#app');
