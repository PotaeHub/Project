<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router";
import bg from '../../assets/bg_login.jpg'
import api from "../../utils/axios";
import { useUserStore, setUserStore } from '../../store/user.js';
const email = ref("");
const password = ref("");
const loading = ref(false);
const router = useRouter();


const gologin = async () => {
    loading.value = true;
    try {
        const res = await api.post("/login", {
            email: email.value,
            password: password.value
        })
        const { token, user: userData } = res.data;

        // อัปเดต store + localStorage
        setUserStore({
            token,
            email: userData.email,
            role: userData.role
        });
        if (userData.role === "ADMIN") router.push("/admin/dashboard");
        else if (userData.role === "TEACHER" && userData.role === "STUDENT") router.push("/");
        else router.push("/");
    } catch (error) {
        alert(error.response.data.message || "Login failed");
        console.error(error);
    } finally {
        loading.value = false
    }
}
</script>
<template>
    <div class="h-screen  w-full flex justify-center items-center "
        :style="{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }">

        <!-- LEFT : FORM AREA -->
        <div
            class="w-1/2  flex justify-center items-center shadow-gray-500 shadow-lg h-[585px] w-[552px] rounded-[30px] text-black bg-white transform translate-x-[400px]">
            <!-- Form แค่ครึ่งพื้นที่ฝั่งซ้าย -->
            <div class="w-2/3 flex flex-col h-full justify-between py-30 ">
                <h1 class="text-3xl roboto font-bold mb-6 text-center text-4xl">เข้าสู่ระบบ / สร้างบัญชี</h1>

                <form class="space-y-4">
                    <div>
                        <label class="block text-xl font-bold mb-1">อีเมล</label>
                        <input type="email" v-model="email"
                            class="w-full border p-2 rounded-[10px] focus:outline focus:outline-sky-500 border-gray-500"
                            required placeholder="ระบุอีเมล">
                    </div>

                    <div>
                        <label class="block text-xl  mb-1">รหัสผ่าน</label>
                        <input type="password" v-model="password"
                            class="w-full border p-2 rounded-[10px] focus:outline border-gray-500 focus:outline-sky-500"
                            required placeholder="ระบุรหัสผ่าน">

                    </div>

                    <div class="flex justify-between">
                        <h1 class="text-xl">ลืมรหัสผ่าน?</h1>
                        <router-link to="/register"
                            class=" text-xl   text-blue-400 hover:border-b-2 hover:border-blue-800 w-15 hover:text-violet-500">
                            Register
                        </router-link>

                    </div>

                    <button type="submit" @click.prevent="gologin"
                        class="bg-sky-400 w-full h-[53px]  rounded-[10px] hover:bg-sky-500 text-white text-2xl font-medium flex justify-center items-center">
                        <span v-if="loading">โปรดรออย่างใจเย็น.......</span>
                        <span v-else> ➜] Login</span>
                    </button>




                </form>
            </div>
        </div>

        <!-- RIGHT : IMAGE AREA -->

    </div>
</template>
