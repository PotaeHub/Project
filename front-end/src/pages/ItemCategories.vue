<template>
    <Main>
        <section class="w-full text-center py-8">
            <h1 class="text-4xl font-bold">คอร์สในหมวดหมู่: {{ category }}</h1>
        </section>

        <section class="max-w-7xl mx-auto px-5 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div v-for="course in filteredCourses" :key="course.title"
                class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition">
                <img :src="course.img" class="w-full h-48 object-cover" />
                <div class="p-4 space-y-2">
                    <h3 class="text-xl font-semibold">{{ course.title }}</h3>
                    <p class="text-violet-600 font-bold">฿{{ course.price }}</p>
                    <router-link to="/register"
                        class="block bg-violet-600 text-white text-center py-2 rounded hover:bg-violet-700 transition">
                        เรียนเลย
                    </router-link>
                </div>
            </div>
        </section>
    </Main>
</template>

<script>
import Main from '../layouts/MainLayout.vue'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
    name: 'ItemCategoriesPage',
    components: { Main },
    setup() {
        const route = useRoute()
        const category = ref(route.query.category || 'All')

        const featuredCourses = ref([
            { title: "Web Development Bootcamp", img: "/src/assets/course1.jpg", price: 1200, category: "Programming" },
            { title: "UI/UX Design Masterclass", img: "/src/assets/course2.jpg", price: 900, category: "Design" },
            { title: "Digital Marketing 101", img: "/src/assets/course3.jpg", price: 700, category: "Marketing" },
            { title: "Advanced JS", img: "/src/assets/course4.jpg", price: 1000, category: "Programming" },
            { title: "Logo Design Basics", img: "/src/assets/course5.jpg", price: 800, category: "Design" },
            { title: "Guitar Basics", img: "/src/assets/course6.jpg", price: 600, category: "Music" },
        ])

        const filteredCourses = computed(() => {
            if (category.value === 'All') return featuredCourses.value
            return featuredCourses.value.filter(course => course.category === category.value)
        })

        return { category, filteredCourses }
    }
}
</script>
