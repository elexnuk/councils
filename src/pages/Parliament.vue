<script setup>
import { drawState } from '../draw';
import { councils } from '../councils';
import { loadConfig, config_url } from '../api';


import Map from "../components/Map.vue";
import ControlNoSearch from "../components/ControlNoSearch.vue";
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

onMounted(async () => {
	councils.setCurrentCouncilName("parliament");

	await loadConfig(`${route.meta.base}${config_url}`);
	await councils.loadCouncilListing();

	councils.setCurrentCouncilName("parliament");
	drawState.loadPens();
	drawState.selectPen("Oth");

	councils.setCurrentCouncilBoundary(route.params.boundaryName);
	
});
</script>

<template>
	<div class="md:px-8 sm:px-2">
		<div class="sm:w-full sm:float-none md:w-4/12 md:float-left">
			<RouterLink to="/councils/">
				<span class=" font-mono font-semibold underline hover:no-underline text-blue-500 visited:text-fuchsia-500">[Local Boundaries]</span>
			</RouterLink>
			<!-- {{ $route.params }} -->
			<ControlNoSearch division-name="Constituency" boundary-name="Parliament" page-name=""></ControlNoSearch>
		</div>
		<div class="sm:w-full sm:float-none md:static md:w-6/12 md:float-right">
			<Map division-name="Constituency"></Map>
		</div>
	</div>
</template>