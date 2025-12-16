<script setup>
const props = defineProps({
    modelValue: String
})

const emit = defineEmits(["update:modelValue"])
</script>

<template>
    <select :value="modelValue" @change="emit('update:modelValue', $event.target.value)" class="px-4 py-2 rounded-xl border shadow
               focus:outline-none focus:ring-2 focus:ring-blue-400 mb-10">
        <option value="">เรียงตามราคา</option>
        <option value="asc">ราคาถูก → แพง</option>
        <option value="desc">ราคาแพง → ถูก</option>
    </select>
</template>
