import { createApp } from 'vue'
import "../style.css";
import Councils from "./Councils.vue"
import { councils } from "../councils"
import { loadConfig } from '../api';

loadConfig().then(() => {
    councils.loadCouncilListing();
});

createApp(Councils).mount('#app')
