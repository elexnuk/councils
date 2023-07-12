import { createApp } from 'vue'
import './style.css'

import App from './App.vue'
import Parliament from "./pages/Parliament.vue";
import Councils from "./pages/Councils.vue";

import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    { 
        path: "/:boundaryName?", 
        name: "parliament", 
        component: Parliament,
        meta: {
            base: "/"
        }
    },
    { 
        path: "/councils/:councilName?/:boundaryName?", 
        name: "councils", 
        component: Councils,
        meta: {
            base: "/councils/"
        }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

const app = createApp(App);
app.use(router);
app.mount("#app");