<script setup>
const props = defineProps({
    label: String,
    variant: {
        type: String,
        default: 'primary' // primary | secondary | danger
    },
    type: {
        type: String,
        default: 'button'
    }
})
</script>

<template>
    <button :type="type" class="px-6 py-2 rounded-lg font-semibold transition-all duration-300" :class="{
        'bg-violet-600 text-white hover:bg-violet-700': variant === 'primary',
        'bg-gray-200 text-gray-800 hover:bg-gray-300': variant === 'secondary',
        'bg-red-500 text-white hover:bg-red-600': variant === 'danger'
    }">
        <slot>{{ label }}</slot>
    </button>
</template>
