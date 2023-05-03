<script setup>
import { onMounted, ref } from "vue";
import "./../jscolor.min";

const emit = defineEmits([
    "open", 
    "close"
]);

const props = defineProps({
    open: Boolean
});
</script>

<template>

    <Teleport to="body">

        <div v-if="props.open" class=" fixed z-50 top-1/4 left-1/2 w-96 -ml-40 shadow-2xl rounded-lg bg-white">
            
            <div class=" h-12 border-b-2 flex flex-row justify-between px-3 py-2 mt-2 items-center">
                <slot name="header"></slot>
                <button class="hover:text-red-700 hover:bg-red-200 rounded-full transition-all duration-75 h-fit" @click="emit('close');">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div class="py-4 px-2">
                <slot name="body"></slot>
            </div>
            
            <div>
                <slot name="footer"></slot>
            </div>
        </div>

    </Teleport>

</template>

<style scoped>

</style>