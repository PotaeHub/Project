<script setup>
import MainLayout from "@/layouts/MainLayout.vue"
import SearchInput from "../components/SearchInput.vue";
import { onMounted, ref, computed } from 'vue'
import BigPanel from "@/components/BigPanel.vue"
import CategoryCard from "../components/CategoryCard.vue";
import api from "../utils/axios";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import ItemCard from "../components/ItemsCard.vue"
import PriceShot from "../components/priceShot.vue";
import Trading from "./CourseDetail.vue";

const searchText = ref('');
const selectedCategory = ref(null)
const selectedType = ref("") // ตัวแปรเก็บประเภทคอร์ส
const categories = ref([]);
const courses = ref([])
const slider = ref(null);
const sortPrice = ref("")

// ฟังก์ชันเลือกหมวดหมู่
const onSelectCategory = (category) => {
    selectedCategory.value = category
}

// คอร์สที่กรองตามหมวดหมู่, ประเภท, ราคา
const filteredCourses = computed(() => {
    let result = [...courses.value]

    // กรองตามหมวดหมู่
    if (selectedCategory.value && selectedCategory.value.id) {
        result = result.filter(c => c.categoryId === selectedCategory.value.id)
    }

    // กรองตามประเภท
    if (selectedType.value) {
        result = result.filter(c => c.type === selectedType.value)
    }

    // กรองตามราคา
    if (sortPrice.value === "asc") result.sort((a, b) => a.price - b.price)
    if (sortPrice.value === "desc") result.sort((a, b) => b.price - a.price)

    return result
})

// ดึงข้อมูลจาก API
const fetchCourses = async () => {
    const res = await api.get("/courses");
    courses.value = res.data.courses
}

const courseTypes = computed(() => {
    const typesSet = new Set(courses.value.map(c => c.type).filter(Boolean))
    return [{ label: "ทั้งหมด", value: "" },
    ...[...typesSet].map(t => ({
        label: t, // ถ้าต้องการ map เป็นชื่อไทย ทำตรงนี้
        value: t
    }))
    ]
})
const fetchCategories = async () => {
    const res = await api.get("/categories");
    categories.value = res.data.categories;
}

onMounted(() => {
    fetchCategories()
    fetchCourses()
})

// slider ปุ่มเลื่อนซ้ายขวา
const scrollLeft = () => slider.value.scrollBy({ left: -300, behavior: 'smooth' });
const scrollRight = () => slider.value.scrollBy({ left: 300, behavior: 'smooth' });
</script>

<template>
    <MainLayout>
        <!-- MAIN SECTION -->
        <main class="relative w-full h-[500px] bg-gradient-to-b from-blue-400 to-gray-100">
            <div class="flex flex-col justify-center items-center pt-20 gap-[16px]">
                <div class="text-4xl text-blue-600">หัวข้อ</div>
                <div class="text-5xl">เว็บไซต์</div>
                <SearchInput v-model:keyword="searchText" />
            </div>

            <!-- หมวดหมู่คอร์ส -->
            <div class="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 w-full max-w-6xl px-6 ">
                <BigPanel title="หมวดหมู่คอร์ส">
                    <button @click="scrollLeft"
                        class="absolute left-20 top-1/2 -translate-y-1/2 bg-white/80 border shadow-lg rounded-full p-2  hover:bg-white z-20">
                        <ChevronLeft class="w-6 h-6 text-gray-700" />
                    </button>

                    <div ref="slider" class="flex gap-4 overflow-x-hidden scrollbar-hide px-4 py-2 scroll-smooth">
                        <CategoryCard :key="'all'" name="ทั้งหมด" :category="{ id: null }" :active="!selectedCategory"
                            @select="onSelectCategory" />
                        <CategoryCard v-for="c in categories" :key="c.id" :name="c.name" :category="c"
                            :active="selectedCategory?.id === c.id" @select="onSelectCategory" />
                    </div>

                    <button @click="scrollRight"
                        class="absolute right-20 top-1/2 -translate-y-1/2 bg-white/80 border shadow-lg rounded-full p-2 hover:bg-white z-20">
                        <ChevronRight class="w-6 h-6 text-gray-700" />
                    </button>
                </BigPanel>
            </div>
        </main>

        <!-- SECTION แท็บประเภทคอร์ส + ราคา -->
        <div class="mt-[200px] bg-blue-50 min-h-screen px-6 py-10">

            <!-- แท็บประเภทคอร์ส -->
            <div class="flex gap-4 mb-6">
                <div v-for="type in courseTypes" :key="type.value" @click="selectedType = type.value"
                    class="cursor-pointer px-5 py-3 rounded-t-xl font-semibold transition" :class="selectedType === type.value
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'">
                    {{ type.label }}
                </div>
            </div>

            <!-- กรองราคา -->
            <div class="mb-6">
                <PriceShot v-model="sortPrice" />
            </div>

            <!-- Grid คอร์ส -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 place-items-center">
                <ItemCard v-for="c in filteredCourses" :key="c.id" :courseName="c.title" :image="c.image"
                    :instructor="c.teacher?.name || 'ไม่ระบุผู้สอน'" :price="c.price" :description="c.description"
                    :id="c.id" />
            </div>

        </div>


    </MainLayout>
</template>
