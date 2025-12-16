<script setup>
import MainLayout from "@/layouts/MainLayout.vue"
import { ref, computed } from "vue"
import Tabs from "../components/Tabs.vue"

const showFull = ref(false)

// ข้อความตัวอย่าง (ปกติควรมาจาก backend)
const description = `
คอร์สจับมือเทรดหุ้น เป็นคอร์สออนไลน์ที่ออกแบบมาสำหรับมือใหม่
จนถึงระดับกลาง ครอบคลุมตั้งแต่พื้นฐานตลาดหุ้น การอ่านกราฟ
เทคนิคการเข้าออก การบริหารความเสี่ยง รวมถึงกลยุทธ์การทำกำไร
ที่สามารถนำไปใช้งานได้จริงในตลาดหุ้นไทยและต่างประเทศ
`

const shortTextLength = 180

const displayText = computed(() => {
    if (showFull.value) return description
    return description.slice(0, shortTextLength) + "..."
})


const activeTab = ref("detail")
</script>

<template>
    <MainLayout>

        <!-- HERO -->
        <section class="bg-gradient-to-r from-gray-500 to-green-700 text-white py-16 overflow-auto">
            <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 px-6">

                <!-- Image -->
                <div>
                    <img src="../assets/bg_login.jpg" class="rounded-2xl shadow-xl" />
                </div>

                <!-- Info -->
                <div class="flex flex-col justify-center gap-4">
                    <p class="text-sm opacity-80">แพ็กเกจ (2 รายการ)</p>
                    <h1 class="text-3xl font-bold">จับมือเทรดหุ้น Combo</h1>

                    <div class="flex items-center gap-4">
                        <span class="text-3xl font-bold">4,990 บาท</span>
                        <span class="line-through opacity-70">6,990 บาท</span>
                    </div>

                    <button
                        class="mt-4 bg-white text-green-700 font-semibold py-3 rounded-xl shadow hover:scale-[1.02] transition">
                        ชำระเงินแพ็กเกจ
                    </button>
                </div>
            </div>
        </section>

        <!-- TABS -->
        <div class="bg-white border-b">
            <div class="max-w-6xl mx-auto flex gap-8 px-6 sticky top-16 ">
                <Tabs />
            </div>
        </div>

        <!-- CONTENT -->
        <section class="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

            <div class="space-y-4 text-gray-700 leading-relaxed">

                <h2 class="text-xl font-bold border-b-1 pb-6 border-gray-400">รายละเอียด</h2>

                <p class="whitespace-pre-line">
                    {{ displayText }}
                </p>

                <!-- ปุ่ม toggle -->
                <button @click="showFull = !showFull"
                    class="text-green-600 font-semibold hover:underline flex items-center gap-1">
                    {{ showFull ? "แสดงน้อยลง" : "แสดงรายละเอียดเพิ่มเติม" }}
                    <span v-if="!showFull">▼</span>
                    <span v-else>▲</span>
                </button>

            </div>


            <!-- RIGHT INFO CARD -->
            <div class="bg-blue-50 rounded-2xl p-6 space-y-4 shadow">
                <div class="flex items-center gap-3">
                    📦 <span>จำนวนทั้งหมด <b>2 รายการ</b></span>
                </div>
                <div class="flex items-center gap-3">
                    ▶️ <span>52 วิดีโอ (6 ชม. 25 นาที)</span>
                </div>
                <div class="flex items-center gap-3">
                    ♾️ <span>เรียนได้ตลอดชีพ</span>
                </div>
                <div class="flex items-center gap-3">
                    ⬇️ <span>มีไฟล์ให้ดาวน์โหลด</span>
                </div>
            </div>

        </section>

    </MainLayout>
</template>
