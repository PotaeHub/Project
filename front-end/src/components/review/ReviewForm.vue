<script setup>
import { ref } from 'vue'
import api from '@/utils/axios.js'

const props = defineProps({
    courseId: { type: Number, required: true },
    lessons: {
        type: Array,
        required: false,
        default: () => [] // [{ id, title, videoUrl }]
    }
})

const currentVideo = ref(props.lessons[0]?.videoUrl || 'NO VEIO')

const emit = defineEmits(['submitted'])

const rating = ref(5)
const comment = ref('')
const loading = ref(false)
const error = ref('')

const submitReview = async () => {
    if (!comment.value.trim()) {
        error.value = 'กรุณาเขียนรีวิวก่อน'
        return
    }

    try {
        loading.value = true
        error.value = ''

        await api.post('/reviews', {
            courseId: props.courseId,
            rating: rating.value,
            comment: comment.value
        })

        rating.value = 5
        comment.value = ''
        emit('submitted')
    } catch (err) {
        error.value = err.response?.data?.message || 'ไม่สามารถส่งรีวิวได้'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="bg-white rounded-2xl p-6 shadow space-y-6">

        <!-- Video Player -->
        <div v-if="currentVideo">
            <h3 class="text-xl font-bold mb-2">วิดีโอสอน</h3>
            <video :src="currentVideo" controls class="w-full rounded-xl mb-4"></video>
        </div>

        <!-- Lesson List -->
        <div v-if="lessons.length" class="flex flex-col gap-2">
            <h4 class="font-semibold">บทเรียน</h4>
            <ul class="space-y-1">
                <li v-for="lesson in lessons" :key="lesson.id">
                    <button @click="currentVideo = lesson.videoUrl" class="text-left text-violet-700 hover:underline">
                        {{ lesson.title }}
                    </button>
                </li>
            </ul>
        </div>

        <!-- Review Form -->
        <div class="mt-6">
            <h3 class="text-xl font-bold mb-2">เขียนรีวิวคอร์สนี้</h3>

            <!-- Rating -->
            <div>
                <label class="block mb-1 font-medium">ให้คะแนน</label>
                <select v-model="rating" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500">
                    <option v-for="n in 5" :key="n" :value="n">{{ n }} ดาว</option>
                </select>
            </div>

            <!-- Comment -->
            <div class="mt-2">
                <label class="block mb-1 font-medium">ความคิดเห็น</label>
                <textarea v-model="comment" rows="4" placeholder="คุณคิดอย่างไรกับคอร์สนี้?"
                    class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500" />
            </div>

            <!-- Error -->
            <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>

            <!-- Submit -->
            <button @click="submitReview" :disabled="loading"
                class="mt-3 bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50">
                {{ loading ? 'กำลังส่ง...' : 'ส่งรีวิว' }}
            </button>
        </div>
    </div>
</template>
