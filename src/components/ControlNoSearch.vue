<script setup>

import PenSelect from "./PenSelect.vue";
import PenModal from "./PenModal.vue";
import NewPen from "./NewPen.vue";
import Combobox from "./combobox/Combobox.vue";

import { computed, onMounted, ref } from 'vue';
import { drawState } from "../draw";
import { councils } from "../councils";

import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

let councilsShown = ref(true);
let pensShown = ref(true);

let props = defineProps({
    pageName: String,
    boundaryName: String,
    divisionName: String
});

let councilListing = computed(() => {
    return Object.values(councils.councilListing);
});

function changeBoundary(slug) {
    councils.setCurrentCouncilBoundary(slug);
    router.replace({ name: route.name, params: { boundaryName: slug, councilName: route.params.councilName } });
}
</script>

<template>
    
    <h1 class="text-5xl font-mono font-black text-gradient text-transparent bg-clip-text py-2 mt-3">
        Boundaries/{{ $props.pageName }}<br>
        <span class="text-3xl inline-block relative -top-5 font-semibold font-sans italic"><a href="https://elexn.uk/" target="_blank">elexn.uk</a></span><br>
    </h1>

    <div class="mt-4 px-4 py-4 w-full border border-slate-700 bg-white shadow-lg rounded-lg">
        <div class="flex flex-row justify-between">
            <h2 class="text-2xl font-light">{{ $props.boundaryName }}:</h2>
            <span class="text-2xl font-black cursor-pointer select-none self-center pl-2" @click="councilsShown = !councilsShown;">
                <svg v-if="councilsShown" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </span>
        </div>

        <Transition name="collapse">
            <div v-show="councilsShown" class="flex flex-row flex-wrap gap-2 justify-start mt-4">
                <div v-if="councils.getCurrentCouncil()"
                class="w-full italic text-sm text-gray-800"
                >
                    {{ $props.divisionName }} Boundaries for <span class=" font-semibold">{{ councils.getCurrentCouncil().name }}:</span>
                </div>
                <button 
                    v-if="councils.getCurrentCouncil()" 
                    v-for="bound in councils.getCurrentCouncil().boundaries" 
                    class="button" 
                    :class="[{ 'active': councils.currentCouncil.boundary == bound.slug }]"
                    @click="changeBoundary(bound.slug)"
                >
                    {{ bound.tag }} ({{ bound.year }})
                </button>
                <span class=" italic text-sm text-gray-800" v-else>
                    No Boundaries for {{ $props.boundaryName }} Found.
                </span>
            </div>
        </Transition>
    </div>

    <div class="mt-4 px-4 py-4 w-full border border-slate-700 bg-white shadow-lg rounded-lg">
        <div class="flex flex-row justify-between">
            <h2 class="text-2xl font-light">Pens:</h2>
            <span class="text-2xl font-black cursor-pointer select-none self-center pl-2" @click="pensShown = !pensShown;">
                <svg v-if="pensShown" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </span>
        </div>

        <Transition name="collapse">
            <div v-show="pensShown" class="flex flex-row flex-wrap gap-2 justify-start mt-4">

                <PenSelect @selected="drawState.clearPen()" 
                    primary-colour="rgba(71,85,105, 0.5)"
                    no-edit
                    :active="drawState.pen == {}"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </PenSelect>

                <PenSelect @selected="drawState.selectPen(pen.label)" v-for="pen in drawState.defaultPens" 
                    :label="pen.label" 
                    :primary-colour="pen.fill" 
                    no-edit
                    :active="drawState.pen.label == pen.label"
                >
                </PenSelect>

                <PenSelect @selected="drawState.selectPen(pen.label)" v-for="pen in drawState.customPens" 
                    :label="pen.label" 
                    :primary-colour="pen.fill" 
                    :active="drawState.pen.label == pen.label"
                >
                </PenSelect>

                <NewPen></NewPen>

            </div>
        </Transition>
    </div>
</template>

<style scoped>

.button {
    @apply font-thin text-lg px-2 py-2 border border-slate-700 rounded-lg hover:bg-slate-700 hover:text-white transition-colors duration-75
}

.button.active {
    @apply bg-slate-700 text-white ring-4 ring-blue-200
}

.text-gradient {
    background-image: linear-gradient(
        -90deg,
        #8DC63F,
        #E4003B,
        #FAA61A,
        #0087DC
    );
    background-size: 400% 400%;
    animation: bg-gradient 10s ease infinite;
}

@keyframes bg-gradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}


.collapse-enter-active {
    transition: max-height 0.5s ease;
    overflow: hidden;

    max-height: 50vh;
}

.collapse-leave-active {
    transition: max-height 0.5s ease;
    overflow: hidden;

    max-height: 0;
}

.collapse-enter-from,
.collapse-leave-to {
    max-height: 0;
}

.collapse-enter-to {
    max-height: 50vh;
}

.collapse-leave-from {
    max-height: 50vh;
}
</style>