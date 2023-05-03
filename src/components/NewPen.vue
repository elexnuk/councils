<script setup>
import PenSelect from "./PenSelect.vue";
import PenModal from "./PenModal.vue";

import "./../jscolor.min";
import { nextTick, onMounted, reactive, ref, watch } from "vue";
import { drawState } from "../draw";

let createPenOpen = ref(false);

let newPen = reactive({
    label: "Pen",
    primaryColour: "#DDDDDD"
});

let emit = defineEmits(["create"]);

onMounted(() => {
    jscolor.install();
});

watch(createPenOpen, () => {
    nextTick(() => {   
        jscolor.install(window.document.body);
    });
});

function clearModal() {
    newPen.label = "Pen";
    newPen.primaryColour = "#DDDDDD";
}

</script>

<template>

    <PenSelect primary-colour="#475569" no-edit @selected="createPenOpen = true;">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    </PenSelect>


    <PenModal :open="createPenOpen" @close="createPenOpen = false; clearModal();">
        <template v-slot:header>
            <span class=" font-thin text-2xl">Create New Pen:</span>
        </template>
        <template v-slot:body>
            
            <div class="w-full my-2 flex flex-row justify-start gap-2 items-center">
                <PenSelect :label="newPen.label" :primary-colour="newPen.primaryColour" no-edit disabled></PenSelect>
                
                <div class="flex flex-row gap-2">
                    <input type="text" class="px-2 py-2 border border-black shadow-inner rounded-lg text-lg w-20"
                        @input="event => newPen.label = event.target.value"
                        :value="newPen.label"
                    >

                    <input
                        class="py-2 px-4 w-32 cursor-pointer border border-black transition-all focus:ring-4 ring-blue-200 rounded-lg"
                        :value="newPen.primaryColour"
                        @input="event => newPen.primaryColour = event.target.value"
                        data-jscolor=""
                    >
                </div>
            </div>

            <div class="w-full flex flex-row gap-2 justify-end">
                <button class="p-3 bg-green-500 text-white font-semibold text-lg rounded-lg" @click="createPenOpen = false; drawState.addPen(newPen.label, newPen.primaryColour); clearModal();">
                    Create
                </button>

                <button class="p-3 bg-red-500 text-white font-semibold text-lg rounded-lg" @click="createPenOpen = false; clearModal();">
                    Cancel
                </button>
            </div>

        </template>
    </PenModal>

</template>

<style scoped>

</style>