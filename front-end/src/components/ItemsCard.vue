<script setup>
import { ref } from 'vue'

defineProps({
    id: {
        type: [Number, String],
        required: true
    },
    image: String,
    courseName: String,
    instructor: String,
    price: [Number, String],
    description: String
})
const containerRef = ref(null)
const overlayStyle = ref({ left: '100%', transform: 'translateX(16px)' })
const isHover = ref(false)

const windowWidth = ref(window.innerWidth)

const checkPosition = () => {
    if (!containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    const overlayWidth = Math.min(576, windowWidth.value * 0.9)
    const spaceRight = windowWidth.value - rect.right
    const spaceLeft = rect.left

    if (spaceRight < overlayWidth && spaceLeft >= overlayWidth) {
        overlayStyle.value = { right: '100%', transform: 'translateX(-16px)' }
    } else {
        overlayStyle.value = { left: '100%', transform: 'translateX(16px)' }
    }
}

const onMouseEnter = () => {
    isHover.value = true
    checkPosition()
}

const onMouseLeave = () => {
    isHover.value = false
}

const onResize = () => {
    windowWidth.value = window.innerWidth
}

window.addEventListener('resize', onResize)
</script>

<template>
    <div ref="containerRef" class="relative w-full max-w-[30pc] h-[24rem] group cursor-pointer"
        @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
        <!-- Card ปกติ -->
        <div class="h-full w-full rounded-3xl overflow-hidden shadow-xl bg-white flex flex-col">
            <img :src="image" alt="course" class="h-40 w-full object-cover border-b-2 border-gray-300" />
            <div class="p-6 flex flex-col gap-2">
                <h3 class="text-2xl font-bold text-gray-800 truncate">{{ courseName }}</h3>
                <p class="text-lg text-gray-500 truncate">โดย {{ instructor }}</p>
                <span class="text-2xl font-extrabold text-blue-600">฿{{ price }}</span>
            </div>
        </div>

        <!-- Overlay -->
        <div class="absolute top-0 h-full bg-white shadow-2xl rounded-3xl p-6
         flex flex-col justify-between
         opacity-0 pointer-events-none
         group-hover:opacity-100 group-hover:pointer-events-auto
         transition-all duration-300 z-50" :style="[overlayStyle, { width: Math.min(576, windowWidth * 0.9) + 'px' }]">
            <div>
                <h3 class="text-3xl font-bold text-gray-800">{{ courseName }}</h3>
                <p class="text-lg text-gray-700  mt-2">โดย {{ instructor }}</p>
                <p class="text-gray-700 text-base mt-4 line-clamp-6">{{ description }}</p>
            </div>
            <div class="flex items-center justify-between mt-6 flex-wrap gap-3">
                <span class="text-2xl font-extrabold text-blue-600 w-55">฿{{ price }}</span>
                <router-link class="border-blue-700 border-2 text-blue-700 px-6 py-3 rounded-xl">ชำระเงิน</router-link>
                <router-link :to="{ name: 'course-detail', params: { id } }"
                    class="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700">ดูคอร์ส</router-link>
            </div>
        </div>
    </div>
</template>
