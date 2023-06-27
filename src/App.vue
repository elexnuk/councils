<script setup>
import { drawState } from './draw';
import { councils } from './councils';

import Map from "./components/Map.vue";
import ControlNoSearch from "./components/ControlNoSearch.vue";
import { onMounted } from 'vue';

onMounted(() => {
  councils.setCurrentCouncilName("parliament");
  drawState.loadPens();
  drawState.selectPen("Oth");
});
</script>

<template>
  <div class="md:px-8 sm:px-2">
    <div class="sm:w-full sm:float-none md:w-4/12 md:float-left">
      <a href="/councils/" class=" font-mono font-semibold underline hover:no-underline text-blue-500 visited:text-fuchsia-500">[Local Boundaries]</a>
      <ControlNoSearch division-name="Constituency" boundary-name="Parliament" page-name=""></ControlNoSearch>
    </div>
    <div class="sm:w-full sm:float-none md:static md:w-6/12 md:float-right">
      <Map division-name="Constituency"></Map>
    </div>
  </div>
</template>

<style scoped>

</style>
