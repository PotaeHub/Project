<template>
    <div>
        <div class="flex justify-between mb-6">
            <h1 class="text-2xl font-bold">My Courses</h1>
            <button class="bg-violet-600 text-white px-4 py-2 rounded-lg">
                + New Course
            </button>
        </div>

        <div class="grid grid-cols-3 gap-6">
            <div v-for="i in 6" :key="i" class="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
                <h3 class="font-bold">Vue Masterclass</h3>
                <p class="text-sm text-gray-500">12 lessons</p>
                <button class="mt-4 border border-violet-600 text-violet-600 px-3 py-1 rounded">
                    Manage
                </button>
            </div>
        </div>
    </div>
</template>
<style scoped>
@reference "tailwindcss";

.course-card {
    @apply bg-white p-5 rounded-xl shadow;
}
</style>
