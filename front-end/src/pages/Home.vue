<script setup>
import Main from '../layouts/Main.vue';
import { ref, onMounted } from "vue"

const images = [
    "/src/assets/1.jpg",
    "/src/assets/2.jpg",
    "/src/assets/3.jpg",
]

const index = ref(0)

// Auto slide ทุก 3 วินาที
onMounted(() => {
    setInterval(() => {
        nextSlide()
    }, 3000)
})

const nextSlide = () => {
    index.value = (index.value + 1) % images.length
}

const goToSlide = (i) => {
    index.value = i
}
</script>

<template>
    <Main>
        <div class="slider-wrapper relative  overflow-hidden ">
            <!-- Slider Container -->
            <div class="slider flex transition-transform duration-1000"
                :style="{ width: `${images.length * 100}%`, transform: `translateX(-${index * 100}%)` }">
                <div v-for="(img, i) in images" :key="i" class="slide flex-shrink-0 ">
                    <img :src="img" class="slide-img" />
                </div>
            </div>

            <!-- Indicator Dots -->
            <div class="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-5">
                <span v-for="(img, i) in images" :key="i" @click="goToSlide(i)" :class="[
                    'w-3 h-3 rounded-full cursor-pointer transition-colors duration-500 ease-in-out transform',
                    i === index.value ? 'bg-white scale-125 shadow-lg' : 'bg-gray-400 scale-100'
                ]"></span>

            </div>

        </div>
    </Main>
</template>

<style>
.slider-wrapper {
    width: 100%;
    max-width:max-content;
    height: 500px;
    border-radius: 12px;
}

.slider {
    display: flex;
    height: 100%;
}

.slide {
    flex-shrink: 0;
    width: 100%;
    height: 100%;
}

.slide-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: all 0.7s ease-in-out;
}
</style>
