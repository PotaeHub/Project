<script setup>
import { ShoppingCart, Search, Home, GraduationCap } from 'lucide-vue-next'
import { ref, computed } from 'vue'
import { useUserStore, logoutUser } from '../store/user.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = useUserStore

const logout = () => logoutUser(router)

const isLoggedIn = computed(() => !!user.token)
const isAdmin = computed(() => user.role === 'ADMIN')
const isStudent = computed(() => user.role === 'STUDENT')
const isTeacher = computed(() => user.role === 'TEACHER')

const selectedCategory = ref('All')
</script>

<template>
  <nav class="flex justify-between items-center h-20 px-20 bg-white shadow-md sticky top-0 z-50">

    <!-- LEFT -->
    <div class="flex items-center gap-8">

      <!-- LOGO -->
      <router-link to="/">
        <h1 class="font-bold text-3xl text-violet-700 flex items-center gap-2">
          <GraduationCap class="w-8 h-8" />
          MyCourses
        </h1>
      </router-link>

      <!-- MENU -->
      <ul class="flex gap-6 items-center text-gray-800 font-medium">

        <!-- STUDENT / ADMIN -->
        <template v-if="isStudent || isAdmin">
          <router-link to="/" class="flex items-center gap-1 hover:text-violet-600 transition">
            <Home class="w-5 h-5" />
            Home
          </router-link>

          <!-- Dropdown -->
          <li class="relative group cursor-pointer">
            คอร์สทั้งหมด
            <ul class="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-lg
                     opacity-0 invisible group-hover:opacity-100 group-hover:visible
                     transition-all duration-300 min-w-[180px] z-50">
              <li class="px-4 py-2 hover:bg-violet-100 cursor-pointer">All</li>
              <li class="px-4 py-2 hover:bg-violet-100 cursor-pointer">Programming</li>
              <li class="px-4 py-2 hover:bg-violet-100 cursor-pointer">Design</li>
              <li class="px-4 py-2 hover:bg-violet-100 cursor-pointer">Marketing</li>
            </ul>
          </li>
        </template>

        <!-- TEACHER -->
        <template v-if="isTeacher">
          <router-link to="/teacher/dashboard" class="hover:text-violet-600">Dashboard</router-link>
          <router-link to="/teacher/my-courses" class="hover:text-violet-600">คอร์สของฉัน</router-link>
          <router-link to="/teacher/announcement" class="hover:text-violet-600">ประกาศ</router-link>
        </template>

      </ul>

      <!-- SEARCH -->
      <div class="relative">
        <input type="text" placeholder="ค้นหาคอร์ส..." class="border rounded-full pl-10 pr-4 h-10 w-60
                 focus:outline-none focus:ring-2 focus:ring-violet-500 transition" />
        <Search class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
    </div>

    <!-- RIGHT -->
    <div class="flex gap-4 items-center">

      <!-- NOT LOGIN -->
      <router-link v-if="!isLoggedIn" to="/login" class="bg-gradient-to-r from-violet-600 to-purple-600
               hover:from-violet-700 hover:to-purple-700
               px-6 py-2 rounded-lg text-white font-semibold shadow-lg
               transition transform hover:scale-105">
        เข้าสู่ระบบ
      </router-link>

      <!-- LOGGED IN -->
      <div v-else class="flex items-center gap-4 pl-4 border-l">

        <div class="text-right">
          <p class="text-sm text-gray-500">Welcome</p>
          <p class="text-sm font-semibold text-gray-800">{{ user.email }}</p>
        </div>

        <!-- Avatar -->
        <div class="w-10 h-10 rounded-full bg-gradient-to-br
                 from-violet-500 to-purple-600
                 flex items-center justify-center text-white font-bold">
          {{ user.email.charAt(0).toUpperCase() }}
        </div>

        <button @click="logout" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition">
          Logout
        </button>
      </div>

      <!-- CART -->
      <button v-if="isStudent" class="bg-white p-2 rounded-full shadow hover:shadow-lg transition">
        <ShoppingCart class="w-6 h-6 text-gray-800" />
      </button>

    </div>
  </nav>
</template>
