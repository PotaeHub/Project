<script setup>
import { computed } from 'vue'

const props = defineProps({
    course: Object
})

const lessonCount = computed(() => props.course.lessons?.length || 0)
</script>

<template>
    <div class="bg-blue-50 rounded-xl p-6 grid grid-cols-2 gap-4">
        <div>📦 {{ lessonCount }} บทเรียน</div>
        <div>♾️ เรียนได้ตลอดชีพ</div>
        <div>⬇️ มีไฟล์ประกอบ</div>
        <div>🎓 สอนโดย {{ course.teacher?.name }}</div>
    </div>
</template>
