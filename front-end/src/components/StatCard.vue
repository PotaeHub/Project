<script setup>
defineProps({
    title: String,
    value: [String, Number]
})
</script>

<template>
    <div class="bg-white p-6 rounded-xl shadow flex items-center gap-4">
        <slot />
        <div>
            <p class="text-gray-500">{{ title }}</p>
            <h2 class="text-2xl font-bold">{{ value }}</h2>
        </div>
    </div>
</template>
