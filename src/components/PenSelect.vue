<script setup>

import { drawState } from "../draw";
import "../jscolor.min";
import PenModal from "./PenModal.vue";

import { ref, computed, watch, nextTick } from "vue";

let props = defineProps({
    primaryColour: String, // if customPen = false => fill the background with this colour
    customPen: Boolean, // if true => index into customPens and draw the svg background
    label: String, // short label to put on the pen should be like 5 char max?
    disabled: Boolean,
    noEdit: Boolean,
    active: Boolean,
});

let emit = defineEmits(["edit", "delete", "selected"]);

let hover = ref(false);
let editModalOpen = ref(false);
let editNewColour = ref(props.primaryColour);
let deleteModalOpen = ref(false);

watch(editModalOpen, () => {
    nextTick(() => {
        jscolor.install();
    })
});
</script>  

<template>

    <div class="rounded-lg p-4 ring-blue-200 cursor-pointer select-none h-14 relative"
    :class="[{ 'ring-4': $props.active }, {'hover:ring-4': !$props.disabled}, {'cursor-default': $props.disabled}]"
    :style="{ backgroundColor: $props.primaryColour }"
    
    @mouseenter="hover = true;"
    @mouseleave="hover = false;"
    @click="event => emit('selected', event)"
    >

        <span v-show="!$props.disabled && !$props.noEdit && hover" class="rounded-lg bg-red-100 text-red-800 absolute -top-2 -right-2 shadow-md p-1" @click="deleteModalOpen = true;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
        </span>

        <span v-show="!$props.disabled && !$props.noEdit && hover" class="rounded-lg bg-blue-100 text-blue-800 absolute -top-2 -left-2 shadow-md p-1" @click="editModalOpen = true;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>
        </span>

        <span class="inline text-lg font-semibold text-white align-baseline">

            <slot v-if="!$props.label"></slot>

            {{ $props.label }}

        </span>
    </div>

    <PenModal v-if="!$props.disabled && !$props.noEdit" :open="editModalOpen" @close="editModalOpen = false;">
        <template v-slot:header>
            <span class="font-thin text-2xl">Edit Pen <span class="font-semibold">{{ $props.label }}</span>:</span>
        </template>
        <template v-slot:body>
            <div class="w-full my-2 flex flex-row justify-start gap-2 items-center">
                <PenSelect :label="$props.label" :primary-colour="editNewColour" no-edit disabled></PenSelect>
                
                <div class="flex flex-row gap-2">
                    <input
                        class="py-2 px-4 w-32 cursor-pointer border border-black transition-all focus:ring-4 ring-blue-200 rounded-lg"
                        :value="editNewColour"
                        @input="event => editNewColour = event.target.value"
                        data-jscolor=""
                    >
                </div>
            </div>

            <div class="w-full flex flex-row gap-2 justify-end">
                <button class="p-3 bg-blue-500 text-white font-semibold text-lg rounded-lg" @click="editModalOpen = false; drawState.editPenColour($props.label, editNewColour);">
                    Edit
                </button>

                <button class="p-3 bg-red-500 text-white font-semibold text-lg rounded-lg" @click="editModalOpen = false; editNewColour = $props.primaryColour;">
                    Cancel
                </button>
            </div>
        </template>
    </PenModal>

    <PenModal v-if="!$props.disabled && !$props.noEdit" :open="deleteModalOpen" @close="deleteModalOpen = false;">
        <template v-slot:header>
            <span class="font-thin text-2xl">Delete Pen <span class="font-semibold">{{ $props.label }}</span>?</span>
        </template>
        <template v-slot:body>
            <div class="flex flex-row gap-2 justify-end mx-2">
                <button 
                @click="deleteModalOpen = false; drawState.removePen($props.label);"
                class="px-2 py-2 text-lg bg-red-500 text-white rounded-lg hover:ring-4 ring-red-300 transition-all duration-75">
                    Confirm
                </button>
                <button 
                @click="deleteModalOpen = false;"
                class="px-2 py-2 text-lg border border-gray-800 rounded-lg transition-all duration-75 hover:ring-4 ring-slate-300">
                    Cancel
                </button>
            </div>
        </template>
    </PenModal>

</template>

<style scoped>

</style>

