<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router";
import bg from '../../assets/bg_login.jpg'
import api from "../../utils/axios";
const loading = ref(false);
const router = useRouter();
const confirmPassword = ref("");
const email = ref("");
const Passowrd = ref("");
const name = ref("");
const role = ref("STUDENT");

const register = async () => {
    loading.value = true;
    try {
        if (!email.value || !Passowrd.value || !confirmPassword.value) {
            alert("กรุณากรอกข้อมูลให้ครบ");
            return;
        }

        if (Passowrd.value !== confirmPassword.value) {
            alert("Password กับ Confirm Password ไม่ตรงกัน!");
            return;
        }
        const res = await api.post("/register", {
            email: email.value,
            name: name.value,
            password: Passowrd.value,
            role: role.value
        });
        alert("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ")
        router.push("/login")
    } catch (error) {
        alert(error.response?.data?.message || "สมัครสมาชิกไม่สำเร็จ");
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
            class="w-1/2  flex justify-center items-center shadow-gray-500 shadow-lg h-[600px] w-[650px] rounded-xl text-black bg-white transform translate-x-[400px]">
            <!-- Form แค่ครึ่งพื้นที่ฝั่งซ้าย -->
            <div class="w-2/3 flex flex-col h-full justify-between py-10 ">


                <h1 class="text-3xl roboto font-bold mb-6 text-center text-4xl">เข้าสู่ระบบ / สร้างบัญชี</h1>

                <form class="space-y-4">
                    <select v-model="role" class="border p-2 rounded-lg w-full">
                        <option value="STUDENT">Student</option>
                        <option value="TEACHER">Teacher</option>
                    </select>
                    <div>
                        <label class="block text-xl font-bold mb-1">อีเมลหรือเบอร์โทรที่ติดต่อได้</label>
                        <input v-model="email" type="email"
                            class="w-full border p-2 rounded-lg focus:outline focus:outline-sky-500 border-gray-500"
                            required placeholder="ระบุอีเมลหรือเบอร์โทร">
                    </div>

                    <div>
                        <label class="block text-xl mb-1">ชื่อ-นามสกุล</label>
                        <input v-model="name" type="text"
                            class="w-full border p-2 rounded-lg focus:outline border-gray-500 focus:outline-sky-500"
                            required placeholder="ระบุชื่อ-นามสกุล">

                    </div>

                    <div>
                        <label class="block text-xl mb-1">รหัสผ่าน</label>
                        <input v-model="Passowrd" type="password"
                            class="w-full border p-2 rounded-lg focus:outline border-gray-500 focus:outline-sky-500"
                            required placeholder="ระบุรหัสผ่าน">

                    </div>
                    <div>
                        <label class="block text-xl mb-1">ยืนยันรหัสผ่าน</label>
                        <input v-model="confirmPassword" type="password"
                            class="w-full border p-2 rounded-lg focus:outline border-gray-500 focus:outline-sky-500"
                            required placeholder="ระบุรหัสผ่าน">

                    </div>
                    <button type="submit" @click.prevent="register"
                        class="bg-blue-600 w-full h-10  rounded-md hover:bg-blue-800 text-white text-2xl font-medium flex justify-center items-center">
                        <span v-if="loading">โปรดรออย่างใจเย็น.......</span>
                        <span v-else> ➜] Register</span>
                    </button>



                </form>
            </div>
        </div>
    </div>
    <div v-if="role === 'TEACHER'" class="absolute bottom-5 right-5 text-white bg-black/50 px-4 py-2 rounded-md">
        <h1>หมายเหตุ: หากสมัครเป็นครู (TEACHER) กรุณาติดต่อแอดมินเพื่อยืนยันตัวตนก่อนใช้งาน</h1>

    </div>

</template>
