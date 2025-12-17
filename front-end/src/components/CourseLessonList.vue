<script setup>
defineProps({
    lessons: Array
})
</script>

<template>
    <div>
        <h2 class="text-xl font-bold mb-4">เนื้อหาคอร์ส</h2>

        <div class="space-y-3">
            <div v-for="(lesson, index) in lessons" :key="lesson.id"
                class="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <div>
                    <span class="font-semibold">บทที่ {{ index + 1 }}:</span>
                    {{ lesson.title }}
                </div>

                <span class="text-sm text-gray-500">
                    ▶️ วิดีโอ
                </span>
            </div>
        </div>
    </div>
</template>
