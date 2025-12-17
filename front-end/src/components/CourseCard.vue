<script setup>
defineProps({
    course: Object
})
</script>

<template>
    <RouterLink :to="`/course/${course.id}`"
        class="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden group">
        <img :src="course.image || 'https://placehold.co/600x400'"
            class="h-44 w-full object-cover group-hover:scale-105 transition" />

        <div class="p-4 space-y-2">
            <h3 class="font-bold text-lg line-clamp-2">
                {{ course.title }}
            </h3>

            <p class="text-sm text-gray-500">
                โดย {{ course.teacher?.name || 'ผู้สอนไม่ระบุ' }}
            </p>

            <div class="flex justify-between items-center pt-2">
                <span class="font-bold text-violet-600">
                    ฿{{ course.price.toLocaleString() }}
                </span>

                <span class="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded">
                    {{ course.type }}
                </span>
            </div>
        </div>
    </RouterLink>
</template>
