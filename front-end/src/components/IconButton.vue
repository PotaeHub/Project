<script setup>
const props = defineProps({
    variant: {
        type: String,
        default: 'primary'
    }
})
</script>

<template>
    <button class="flex items-center gap-2 px-4 py-2 rounded-lg transition" :class="{
        'bg-violet-600 text-white hover:bg-violet-700': variant === 'primary',
        'bg-red-500 text-white hover:bg-red-600': variant === 'danger'
    }">
        <slot />
    </button>
</template>
