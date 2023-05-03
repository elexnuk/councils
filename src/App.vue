<script setup>
import { drawState } from './draw';

import Map from "./components/Map.vue";
import Controls from "./components/Controls.vue";
import { onMounted } from 'vue';

onMounted(() => {
  drawState.loadPens();
  drawState.selectPen("Oth");
});
</script>

<template>
  <div class="md:px-8 sm:px-2">
    <div class="sm:w-full sm:float-none md:w-4/12 md:float-left">
      <Controls></Controls>
    </div>
    <div class="sm:w-full sm:float-none md:w-6/12 md:float-right">
      <Map></Map>
    </div>
  </div>
</template>

<style scoped>

</style>
