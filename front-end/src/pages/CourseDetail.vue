<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/utils/axios'
import ReviewSection from '@/components/review/ReviewSection.vue'
const router = useRouter()
const route = useRoute()
const course = ref(null)

const fetchCourse = async () => {
    const res = await api.get(`/courses/${route.params.id}`)
    course.value = res.data.course
}
const goBack = () => {
    router.back()
}
onMounted(fetchCourse)
</script>

<template>
    <div v-if="!course" class="p-10 text-center text-gray-500">
        กำลังโหลดข้อมูลคอร์ส...
    </div>

    <div v-else class="max-w-6xl mx-auto p-8 space-y-10">

        <button @click="goBack" class="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
            ← กลับ
        </button>
        <!-- ===== Video Player ===== -->
        <div v-if="course.lessons.length" class="w-full rounded-xl overflow-hidden shadow mb-8">
            <video :src="course.lessons[0].videoUrl" controls class="w-full h-auto"></video>
        </div>

        <!-- ===== Course Details ===== -->
        <div class="space-y-6">
            <h1 class="text-3xl font-bold">{{ course.title }}</h1>
            <p class="text-gray-600">{{ course.description }}</p>

            <div class="bg-white rounded-xl shadow p-6 space-y-3 max-w-sm">
                <p class="text-xl font-bold text-violet-600">฿{{ course.price }}</p>
                <button class="w-full bg-violet-600 text-white py-2 rounded-lg">
                    สมัครเรียน
                </button>
            </div>
        </div>
        <!-- ===== Review Section ===== -->
        <ReviewSection v-if="course.id" :courseId="course.id" :lessons="course.lessons" @submitted="fetchReviews" />
    </div>
</template>
