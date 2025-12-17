<script setup>
import { Code, Palette, Megaphone, LayoutGrid, BookOpen } from 'lucide-vue-next'

const props = defineProps({
    category: Object,
    active: Boolean
})
const emit = defineEmits(['select'])

// map ชื่อ category เป็น icon
const iconMap = {
    programming: Code,
    webdevelopment: LayoutGrid,
    design: Palette,
    marketing: Megaphone
}

// function ใช้เลือก icon
const getIconKey = (name) => {
    if (!name) return '';
    return name.toLowerCase().replace(/\s+/g, '')
}
</script>

<template>
    <div @click="emit('select', category)" class="min-w-[120px] flex flex-col items-center cursor-pointer transition "
        :class="active ? 'scale-105' : 'hover:-translate-y-1'">
        <div class="w-20 h-20 rounded-full flex items-center justify-center transition"
            :class="active ? 'bg-violet-600' : 'bg-violet-100 hover:bg-violet-200'">
            <component :is="iconMap[getIconKey(category.name)] || BookOpen" class="w-8 h-8"
                :class="active ? 'text-white' : 'text-violet-600'" />
        </div>

        <p class="mt-3 text-sm font-medium" :class="active ? 'text-violet-700' : 'text-gray-700'">
            {{ category.name || 'ทั้งหมด' }}
        </p>
    </div>
</template>
