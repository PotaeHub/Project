<script setup>
const props = defineProps({
    tabs: Array,
    activeTab: String
})

const emit = defineEmits(['update:activeTab'])
</script>

<template>
    <div class="flex gap-10 ">
        <button v-for="tab in tabs" :key="tab" @click="$emit('update:activeTab', tab)"
            :class="activeTab === tab ? 'text-green-600 border-b-2' : 'text-gray-600'">
            {{ tab }}
        </button>
    </div>
</template>
