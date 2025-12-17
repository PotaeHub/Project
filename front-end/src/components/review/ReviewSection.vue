<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import api from '@/utils/axios.js'
import ReviewForm from './ReviewForm.vue'

const props = defineProps({
    courseId: {
        type: [Number, String],
        required: true
    }
})

const reviews = ref([])
const avgRating = ref(0)
const total = ref(0)
const loading = ref(false)

const fetchReviews = async () => {
    if (!props.courseId) return

    try {
        loading.value = true
        const res = await api.get(`/courses/${props.courseId}/reviews`)

        reviews.value = res.data.reviews
        avgRating.value = res.data.avgRating
        total.value = res.data.total
    } catch (err) {
        console.error("Fetch reviews error:", err)
    } finally {
        loading.value = false
    }
}

onMounted(fetchReviews)
watch(() => props.courseId, fetchReviews)

/* ===== Computed ===== */
const averageRating = computed(() => avgRating.value || 0)
const ratingCount = computed(() => total.value)

/* จำนวนดาว */
const starWidth = (star) => {
    if (!reviews.value.length) return '0%'
    const count = reviews.value.filter(r => r.rating === star).length
    return `${(count / reviews.value.length) * 100}%`
}
</script>

<template>
    <section class="mt-16 space-y-8">

        <!-- Header -->
        <div>
            <h2 class="text-2xl font-bold">รีวิวจากผู้เรียน</h2>
            <p class="text-gray-600">
                {{ ratingCount }} รีวิว • ⭐ {{ averageRating }}
            </p>
        </div>

        <!-- Summary -->
        <div class="flex items-center gap-6 bg-gray-50 rounded-xl p-6">
            <div class="text-center">
                <div class="text-5xl font-bold text-violet-600">
                    {{ averageRating }}
                </div>
                <div class="text-yellow-400 text-xl">
                    ★★★★★
                </div>
                <div class="text-sm text-gray-500">
                    {{ ratingCount }} รีวิว
                </div>
            </div>

            <div class="flex-1 space-y-2">
                <div v-for="n in 5" :key="n" class="flex items-center gap-2">
                    <span class="w-12 text-sm">{{ 6 - n }} ดาว</span>
                    <div class="flex-1 bg-gray-200 h-2 rounded">
                        <div class="bg-violet-500 h-2 rounded" :style="{ width: starWidth(6 - n) }" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Review Form -->
        <ReviewForm :courseId="courseId" @submitted="fetchReviews" />

        <!-- Review List -->
        <div class="space-y-4">
            <div v-for="review in reviews" :key="review.id" class="bg-white p-5 rounded-xl shadow">
                <div class="flex items-center justify-between">
                    <div class="font-semibold">
                        {{ review.user?.name || 'ผู้เรียน' }}
                    </div>
                    <div class="text-yellow-400">
                        {{ '★'.repeat(review.rating) }}
                    </div>
                </div>

                <p class="text-gray-700 mt-2">
                    {{ review.comment }}
                </p>

                <div class="text-xs text-gray-400 mt-2">
                    {{ new Date(review.createdAt).toLocaleDateString() }}
                </div>
            </div>
        </div>

        <!-- Empty -->
        <p v-if="!loading && !reviews.length" class="text-gray-500 text-center">
            ยังไม่มีรีวิวสำหรับคอร์สนี้
        </p>

    </section>
</template>
