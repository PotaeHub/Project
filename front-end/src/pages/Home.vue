<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/utils/axios'

import CourseCard from '@/components/CourseCard.vue'
import CategoryCard from '@/components/CategoryCard.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import MainLayout from "@/layouts/MainLayout.vue"
import { useUserStore } from "@/store/user.js"

const user = useUserStore;
const categories = ref([])
const allCourses = ref([])
const selectedCategory = ref(null)
const containerRef = ref(null)

const fetchHomeData = async () => {
    const [catRes, courseRes] = await Promise.all([
        api.get('/categories'),
        api.get('/courses')
    ])
    categories.value = catRes.data.categories
    allCourses.value = courseRes.data.courses
}

// ฟิลเตอร์คอร์สตามหมวดหมู่
const filteredCourses = computed(() => {
    if (!selectedCategory.value) return allCourses.value
    return allCourses.value.filter(c => c.categoryId === selectedCategory.value.id)
})

// แยกคอร์สตาม type
const popularCourses = computed(() => filteredCourses.value.filter(c => c.type === 'POPULAR'))
const generalCourses = computed(() => filteredCourses.value.filter(c => c.type === 'GENERAL'))

// เลือกหมวดหมู่
const selectCategory = (category) => {
    if (!category.id) {
        selectedCategory.value = null
    } else if (selectedCategory.value?.id === category.id) {
        selectedCategory.value = null
    } else {
        selectedCategory.value = category
    }
}

// scroll
const scrollLeft = () => {
    if (containerRef.value) {
        containerRef.value.scrollBy({ left: -200, behavior: 'smooth' })
    }
}
const scrollRight = () => {
    if (containerRef.value) {
        containerRef.value.scrollBy({ left: 200, behavior: 'smooth' })
    }
}

onMounted(fetchHomeData)
</script>

<template>
    <MainLayout>
        <div class="space-y-20 h-auto">

            <!-- HERO -->
            <section class="bg-gradient-to-r from-violet-600 to-purple-700 text-white">
                <div class="max-w-7xl mx-auto px-6 py-24 text-center">
                    <h1 class="text-4xl md:text-5xl font-bold mb-6">
                        เรียนออนไลน์จากผู้สอนตัวจริง
                    </h1>
                    <p class="text-lg opacity-90 mb-8">
                        รวมคอร์สคุณภาพ พัฒนาทักษะ สร้างอาชีพ
                    </p>
                    <RouterLink to="/register" v-if="!user.token"
                        class="inline-block bg-white text-violet-700 px-8 py-3 rounded-xl font-semibold shadow hover:scale-105 transition">
                        เริ่มเรียนวันนี้
                    </RouterLink>
                </div>
            </section>

            <!-- CATEGORIES -->
            <section class="max-w-7xl mx-auto px-6 relative">
                <SectionTitle :title="selectedCategory ? `คอร์สหมวด ${selectedCategory.name}` : 'คอร์สทั้งหมด'" />

                <!-- ปุ่มเลื่อน -->
                <button @click="scrollLeft"
                    class="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-2 z-10">
                    ◀
                </button>
                <button @click="scrollRight"
                    class="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-2 z-10">
                    ▶
                </button>

                <!-- Scroll container -->
                <div ref="containerRef"
                    class="flex gap-4 overflow-x-auto py-4 scrollbar-hide scroll-smooth items-center snap-x snap-mandatory h-40">

                    <!-- All category -->
                    <CategoryCard :category="{ id: null, name: 'ทั้งหมด' }"
                        @click="selectCategory({ id: null, name: 'ทั้งหมด' })"
                        :class="{ 'border-2 border-violet-600': !selectedCategory }"
                        class="flex-shrink-0 w-40 cursor-pointer snap-start box-border" />

                    <CategoryCard v-for="cat in categories" :key="cat.id" :category="cat" @click="selectCategory(cat)"
                        :class="{ 'border-2 border-violet-600': selectedCategory?.id === cat.id }"
                        class="flex-shrink-0 w-40 cursor-pointer snap-start box-border" />
                </div>
            </section>

            <!-- POPULAR COURSES -->
            <section class="max-w-7xl mx-auto px-6">
                <SectionTitle title="คอร์สยอดนิยม" />
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <CourseCard v-for="course in popularCourses" :key="course.id" :course="course" />
                </div>
            </section>

            <!-- GENERAL COURSES -->
            <section class="max-w-7xl mx-auto px-6 pb-20">
                <SectionTitle title="คอร์สทั่วไป" />
                <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <CourseCard v-for="course in generalCourses" :key="course.id" :course="course" />
                </div>
            </section>

        </div>
    </MainLayout>
</template>

<style>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
