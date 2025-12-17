<script setup>
import { LayoutDashboard, BookOpen, Megaphone, LogOut } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { logoutUser } from '@/store/user'

const router = useRouter()
</script>

<template>
    <div class="min-h-screen flex bg-gray-100">

        <!-- Sidebar -->
        <aside class="w-64 bg-white shadow-lg">
            <div class="p-6 text-2xl font-bold text-violet-700">
                Teacher Panel
            </div>

            <nav class="flex flex-col gap-2 px-4">
                <RouterLink to="/teacher/dashboard" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700
                 hover:bg-violet-100 hover:text-violet-700 transition">
                    <LayoutDashboard class="w-5 h-5" />
                    Dashboard
                </RouterLink>

                <RouterLink to="/teacher/my-courses" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700
                 hover:bg-violet-100 hover:text-violet-700 transition">
                    <BookOpen class="w-5 h-5" />
                    My Courses
                </RouterLink>

                <RouterLink to="/teacher/announcement" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700
                 hover:bg-violet-100 hover:text-violet-700 transition">
                    <Megaphone class="w-5 h-5" />
                    Announcements
                </RouterLink>

                <button @click="logoutUser(router)" class="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500
                 hover:bg-red-100 transition mt-6">
                    <LogOut class="w-5 h-5" />
                    Logout
                </button>
            </nav>
        </aside>

        <!-- Main -->
        <main class="flex-1 p-8">
            <RouterView />
        </main>

    </div>
</template>
