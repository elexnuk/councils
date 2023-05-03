import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { councils } from "./councils"
import { loadConfig } from './api';

loadConfig().then(() => {
    councils.loadCouncilListing();
});

createApp(App).mount('#app')
