<template>
    <Main>
        <!-- Page Title -->
        <section class="w-full text-center py-8">
            <h1 class="text-4xl font-bold">หมวดหมู่คอร์สทั้งหมด</h1>
            <p class="text-gray-600 mt-2">เลือกหมวดหมู่ที่คุณสนใจเพื่อดูคอร์สทั้งหมดในหมวดนั้น</p>
        </section>

        <!-- Categories Grid -->
        <section class="max-w-7xl mx-auto px-5 py-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            <div v-for="(cat, index) in categories" :key="cat.name" @click="goToCategory(cat.name)"
                class="flex flex-col items-center justify-center p-6 rounded-xl cursor-pointer text-white transition-transform transform hover:scale-105"
                :class="cat.color">
                <component :is="cat.icon" class="w-12 h-12 mb-2" />
                <span class="font-semibold text-lg">{{ cat.name }}</span>
            </div>
        </section>
    </Main>
</template>

<script>
import Main from '../layouts/MainLayout.vue'
import { ref } from 'vue'
import { AcademicCapIcon, CodeBracketIcon, PaintBrushIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'

export default {
    name: 'CategoriesPage',
    components: { Main },
    setup() {
        const router = useRouter()

        const categories = ref([
            { name: "All", color: "bg-gray-500", icon: AcademicCapIcon },
            { name: "Programming", color: "bg-violet-500", icon: CodeBracketIcon },
            { name: "Design", color: "bg-green-500", icon: PaintBrushIcon },
            { name: "Marketing", color: "bg-yellow-500", icon: AcademicCapIcon },
        ])

        const goToCategory = (name) => {
            // สามารถไปหน้า Filtered Courses หรือ Home พร้อม filter ได้
            router.push({ name: 'item-categories', query: { category: name } })
        }

        return { categories, goToCategory }
    }
}
</script>
