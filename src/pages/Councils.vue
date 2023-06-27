<script setup>
import { drawState } from '../draw';

import Map from "../components/Map.vue";
import Controls from "../components/Controls.vue";
import { onMounted } from 'vue';

onMounted(() => {
  drawState.loadPens();
  drawState.selectPen("Oth");
});
</script>

<template>
  <div class="md:px-8 sm:px-2">
    <div class="sm:w-full sm:float-none md:w-4/12 md:float-left">
      <a href="/" class=" font-mono font-semibold underline hover:no-underline text-blue-500 visited:text-fuchsia-500">[Parliament Boundaries]</a>
      <Controls division-name="Ward" boundary-name="Council" page-name="Councils"></Controls>
    </div>
    <div class="sm:w-full sm:float-none md:w-6/12 md:float-right">
      <Map division-name="Ward"></Map>
    </div>
  </div>
</template>

<style scoped>

</style>
