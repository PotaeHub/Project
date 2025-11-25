<script setup>
import image from "../../assets/work.jpg"
import { ref } from "vue"
import { useRouter } from "vue-router";

const loading = ref(false);
const router = useRouter();


const gologin = async () => {
    loading.value = true;
    try {
        await new Promise(resolve => setTimeout(resolve, 2000))
        router.push("/")
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false
    }
}
</script>
<template>
    <div class="flex h-screen">

        <!-- LEFT : FORM AREA -->
        <div class="w-1/2 flex justify-center items-center bg-gray-100">
            <!-- Form แค่ครึ่งพื้นที่ฝั่งซ้าย -->
            <div class="w-1/2">
                <h1 class="text-3xl font-bold mb-6 text-center">Login</h1>

                <form class="space-y-4">
                    <div>
                        <label class="block text-md font-medium mb-1">Email ✉︎</label>
                        <input type="email" class="w-full border p-2 rounded" required>
                    </div>

                    <div>
                        <label class="block text-md font-medium mb-1">Password 🔐</label>
                        <input type="password" class="w-full border p-2 rounded" required>

                    </div>
                    <h1>🔑 Forget Password</h1>
                    <router-link to="/register"
                        class="block text-left text-blue-500 hover:border-b-2 hover:border-blue-800 w-15 hover:text-violet-500">
                        Register
                    </router-link>

                    <button type="submit" @click.prevent="gologin"
                        class="bg-violet-600 w-full h-10 rounded-md hover:bg-violet-800 text-white text-2xl font-medium flex justify-center items-center">
                        <span v-if="loading">โปรดรออย่างใจเย็น.......</span>
                        <span v-else> ➜] Login</span>
                    </button>
                </form>
            </div>
        </div>

        <!-- RIGHT : IMAGE AREA -->
        <div class="w-1/2">
            <img :src="image" class="w-full h-full object-cover" />
        </div>
    </div>
</template>
