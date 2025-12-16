<script setup>
import { ShoppingCartIcon, MagnifyingGlassIcon, HomeIcon, AcademicCapIcon } from '@heroicons/vue/24/outline';
import { ref, computed } from 'vue';
import { useUserStore, logoutUser } from '../store/user.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const user = useUserStore;
const role = computed(() => user.role);

const logout = () => {
  logoutUser(router);
};
const isLoggedIn = computed(() => !!user.token);
const isAdmin = computed(() => user.role === 'ADMIN');
const isStudent = computed(() => user.role === 'STUDENT');
const isTeacher = computed(() => user.role === 'TEACHER');

const selectedCategory = ref("All");
</script>

<template>
  <nav class="flex justify-between items-center h-20 px-20 bg-white shadow-md relative sticky top-0 z-999">

    <!-- Logo + Menu -->
    <div class="flex items-center gap-8">
      <router-link to="/">
        <h1 class="font-bold text-3xl text-violet-700 flex items-center gap-2">
          <AcademicCapIcon class="w-8 h-8 " /> MyCourses
        </h1>
      </router-link>

      <!-- Main Menu -->
      <ul class="flex gap-5 items-center" v-if="isStudent || isAdmin">

        <!-- Home -->
        <router-link :to="{ name: 'home' }" class="group flex items-center gap-1">
          <li class="relative list-none text-lg font-medium cursor-pointer
                     after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-violet-600 after:transition-all after:duration-300
                     group-hover:after:w-full flex items-center gap-1">
            <HomeIcon class="w-5 h-5 text-black" />
            <h1 class="text-black">Home</h1>
          </li>
        </router-link>

        <!-- Dropdown -->
        <li class="relative group cursor-pointer text-lg font-medium flex items-center z-10 gap-1">
          <h1 class="text-black">คอร์สทั้งหมด</h1>

          <ul
            class="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 min-w-[200px]">

            <li @click="selectedCategory = 'All'" class="px-4 py-2 hover:bg-violet-100 rounded cursor-pointer">All</li>
            <li @click="selectedCategory = 'Programming'" class="px-4 py-2 hover:bg-violet-100 rounded cursor-pointer">
              Programming</li>
            <li @click="selectedCategory = 'Design'" class="px-4 py-2 hover:bg-violet-100 rounded cursor-pointer">Design
            </li>
            <li @click="selectedCategory = 'Marketing'" class="px-4 py-2 hover:bg-violet-100 rounded cursor-pointer">
              Marketing</li>
          </ul>
        </li>

        <!-- 🧑‍🏫 Teacher Navbar -->
        <div v-if="isTeacher">
          <router-link to="/teacher/dashboard" class="text-black hover:text-violet-600">Dashboard</router-link>
          <router-link to="/teacher/my-courses" class="text-black hover:text-violet-600">คอร์สของฉัน</router-link>
          <router-link to="/teacher/announcement" class="text-black hover:text-violet-600">ประกาศ</router-link>
        </div>

      </ul>

      <!-- Search Bar -->
      <div class="relative">
        <input type="text" placeholder="ค้นหาคอร์ส..."
          class="border rounded-full pl-10 text-black pr-4 h-10 w-60 focus:outline-none focus:ring-2 focus:ring-violet-500 transition" />
        <MagnifyingGlassIcon class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
    </div>

    <div class="flex gap-3 items-center">
      <div v-if="!user.token" class="animate-fade-in">
        <router-link to="/login"
          class="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 px-6  py-2 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
          เข้าสู่ระบบ
        </router-link>

      </div>

      <div v-else class="flex items-center gap-3 pl-4 border-l border-gray-200 animate-fade-in">
        <div class="flex flex-col items-end">
          <span class="text-sm text-gray-600 transition-colors duration-300">Welcome</span>
          <span class="text-sm font-semibold text-gray-800 transition-colors duration-300">{{ user.email }}</span>
        </div>
        <div
          class="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex justify-center items-center text-white font-bold shadow-md animate-pulse hover:animate-none transition-all duration-300 transform hover:scale-110">
          {{ user.email.charAt(0).toUpperCase() }}
        </div>
        <button @click="logout" class="bg-red-500 px-4 py-2 rounded-md text-white">
          Logout
        </button>
      </div>

      <!-- Cart -->
      <button class="bg-white/70 p-2 rounded-full shadow-lg hover:bg-white transition cursor-pointer">
        <ShoppingCartIcon class="w-6 h-6 text-gray-800" />
      </button>
    </div>
  </nav>
</template>
