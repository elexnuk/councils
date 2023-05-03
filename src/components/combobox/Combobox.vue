<script setup>

import { computed, reactive, ref, watch } from "vue";

let props = defineProps({
    placeholder: String,
    values: Array,
});

let emit = defineEmits(["input"]);

let dropdownShown = ref(false);

// String in the input
let inputString = ref("");

// Input convert to lower case
let lowerInputString = computed(() => {
    return inputString.value.toLowerCase().trim();
})

// List of items filtered by input already
let filteredItems = computed(() => {
    let items = [];
    for (let value of props.values) {
        if (value.name.toLowerCase().trim().includes(lowerInputString.value)) {
            items.push(value);
        }
    }

    items.sort((a, b) => a.name.localeCompare(b.name));
    return items;
});

// Value selected by the combobox
let value = ref("");

// Index of highlighted item
let index = ref(0);

// Select and emit the current value highlighted
function select(i) {
    // console.log("selecting i", i);
    // console.log("selected slug", filteredItems.value[i].slug);

    index.value = i;
    dropdownShown.value = false;
    value.value = filteredItems.value[i].slug;
    inputString.value = filteredItems.value[i].name;

    emit("input", { slug: value.value });
}

// highlight the next value
function selectNext() {
    if (dropdownShown) {
        if (index < filteredItems.length - 1) {
            index.value++;
        } else {
            index.value = 0;
        }
    } else {
        dropdownShown.value = true;
    }
}

// highlight the previous value
function selectPrev() {
    if (index > 0) {
        index.value--;
    } else {
        index.value = filteredItems.length - 1;
    }
}

function backspace() {
    dropdownShown.value = true;
}
</script>

<template>
    <div class="w-full text-lg rounded-lg border border-black relative flex flex-row justify-between items-center focus-within:ring-4 ring-blue-500">
        <input class="px-4 py-2 rounded-l-lg grow h-10" type="search" :placeholder="$props.placeholder" v-model="inputString"
        tabindex="0"
        @focusin="dropdownShown = true;"
        @focusout="dropdownShown = false;"
        @click="dropdownShown = true;"
        @keyup.enter.prevent="select(index);"
        @keyup.down.prevent="selectNext();"
        @keyup.up.prevent="selectPrev();"
        @keyup.delete="backspace();"
        >

        <button class="hover:text-red-700 focus:text-red-700 focus:bg-red-200 hover:bg-red-200 rounded-full transition-all duration-75 h-fit mx-1"
        @click="inputString = ''; value = ''; dropdownShown = true;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        <button class="hover:text-blue-500 focus:text-blue-500 hover:bg-blue-200 focus:bg-blue-200 rounded-full transition-all duration-75 mx-1"
        @click="dropdownShown = !dropdownShown;"
        >
            <svg v-if="dropdownShown" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
        </button>

        <Transition>
            <ul v-show="dropdownShown" class="absolute z-10 bg-white rounded-lg border w-full top-10 text-base">
                <li v-for="(item, i) in filteredItems" @click="select(i)" :class="[{'bg-slate-200': (i == index)}]" class="px-4 py-2 hover:bg-slate-200 cursor-pointer">{{ item.name }}</li>
            </ul>
        </Transition>
    </div>
</template>

<style scoped>

</style>