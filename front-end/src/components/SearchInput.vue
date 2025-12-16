<template>
    <div class="relative w-[800px]">
        <!-- Icon -->
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
        </span>

        <!-- Input -->
        <input v-model="keyword" @input="emitKeyword" type="text"
            class="w-full pl-10 pr-4 py-2 border rounded-2xl focus:ring-2 focus:ring-violet-400 outline-none h-14"
            placeholder="ค้นหา..." />
    </div>
</template>
<script setup>
import { ref } from 'vue'

const emit = defineEmits(['update:keyword', 'search'])

const keyword = ref('')

const emitKeyword = () => {
    emit('update:keyword', keyword.value)   // ส่งค่ากลับไป parent แบบ v-model
    emit('search', keyword.value)           // ส่ง event search ด้วย
}
</script>
