<template>
    <div class="bg-white rounded-2xl shadow-md p-8 w-full max-w-5xl mx-auto border border-gray-100">
        <!-- Title -->
        <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">
            {{ title }}
        </h2>

        <!-- Content -->
        <slot />
    </div>
</template>

<script setup>
const props = defineProps({
    title: String
})
</script>
