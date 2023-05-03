import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { councils } from "./councils"

councils.loadCouncilListing();

createApp(App).mount('#app')
