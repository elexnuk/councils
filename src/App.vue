<script setup>
import { drawState } from './draw';
import { councils } from './councils';
import { loadConfig } from './api';

import Map from "./components/Map.vue";
import ControlNoSearch from "./components/ControlNoSearch.vue";
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
</script>

<template>
	<RouterView></RouterView>
</template>