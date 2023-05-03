<script setup>
import { onMounted, watch, ref, watchEffect } from 'vue';
import { drawState } from '../draw';

import { downloadPNG, downloadSVG, loadBoundaries } from "../map";

import * as d3 from "d3";
import { councils } from '../councils';

function exportPNG() {
    downloadPNG();
}

function exportSVG() {
    downloadSVG();
}

let focusWardName = ref("");

watch(councils.councilBoundaries, (value) => {
    console.log("change in council boundaries", value);
    loadBoundaries(councils.councilBoundaries.data, (e, feature) => {
        // Mouseover
        focusWardName.value = feature.properties.wdnm;
    }, (e, feature) => {
        // Mousedown
        drawState.wardColouring[feature.properties.wdcd] = drawState.pen.fill;
        e.target.setAttribute("fill", drawState.pen.fill);
    });
});
</script>

<template>

    <div class="flex flex-col w-full m-4">

        <div class="flex flex-row flex-wrap md:flex-nowrap justify-between w-full p-2 px-4 rounded-md text-lg">
            <h4 class="md:text-lg lg:text-xl font-thin py-3 align-middle w-full md:w-auto">
                Ward: <span class=" font-semibold">{{ focusWardName }}</span>   
            </h4>

            <div class="border border-slate-400 pl-2 pr-4 py-2 rounded-lg flex-row inline-flex gap-4 font-light w-full md:w-auto">
                <span class="pl-2 py-1 self-center">Download Map:</span>

                <button class="button" @click="exportPNG();">
                    PNG
                </button>
                <button class="button" @click="exportSVG();">
                    SVG
                </button>
            </div>
        </div>
        
        <div class=" bg-cyan-950 rounded-lg border-4 border-slate-400 shadow-lg p-2 px-4 w-full max-h-full">
            <svg xmlns="http://www.w3.org/2000/svg" id="d3-svg">
            </svg>
        </div>
    </div>

</template>

<style scoped>
.button {
    @apply px-2 py-1 rounded-lg border border-slate-700 hover:bg-slate-600 hover:text-white transition-colors duration-75 font-extralight;
}
</style>