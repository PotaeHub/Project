<template>
    <aside class="w-64 bg-slate-900 h-screen flex flex-col border-r border-slate-800 transition-all duration-300">
        <div class="p-6">
            <div class="flex items-center gap-3 mb-6">
                <div class="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
                    <LayoutGrid class="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 class="text-lg font-bold text-white tracking-wide">Admin Panel</h2>
                    <p class="text-xs text-slate-400">Management System</p>
                </div>
            </div>
            <div class="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
        </div>

        <nav class="flex-1 px-4 space-y-2 overflow-y-auto">
            <p class="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Menu</p>

            <RouterLink to="dashboard"
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative"
                :class="{
                    'bg-indigo-600 text-white shadow-md shadow-indigo-500/20': $route.path === '/admin/dashboard',
                    'text-slate-400 hover:bg-slate-800 hover:text-gray-100': $route.path !== '/admin/dashboard'
                }">
                <LayoutDashboard class="w-5 h-5 transition-transform group-hover:scale-105" />
                <span class="font-medium">Dashboard</span>
            </RouterLink>

            <RouterLink to="users"
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative"
                :class="{
                    'bg-indigo-600 text-white shadow-md shadow-indigo-500/20': $route.path.startsWith('/admin/users'),
                    'text-slate-400 hover:bg-slate-800 hover:text-gray-100': !$route.path.startsWith('/admin/users')
                }">
                <Users class="w-5 h-5 transition-transform group-hover:scale-105" />
                <span class="font-medium">Users</span>
            </RouterLink>

            <RouterLink to="courses"
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative"
                :class="{
                    'bg-indigo-600 text-white shadow-md shadow-indigo-500/20': $route.path.startsWith('/admin/courses'),
                    'text-slate-400 hover:bg-slate-800 hover:text-gray-100': !$route.path.startsWith('/admin/courses')
                }">
                <BookOpen class="w-5 h-5 transition-transform group-hover:scale-105" />
                <span class="font-medium">Courses</span>
            </RouterLink>
            <RouterLink to="categories"
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative"
                :class="{
                    'bg-indigo-600 text-white shadow-md shadow-indigo-500/20': $route.path.startsWith('/admin/categories'),
                    'text-slate-400 hover:bg-slate-800 hover:text-gray-100': !$route.path.startsWith('/admin/categories')
                }">
                <BookOpen class="w-5 h-5 transition-transform group-hover:scale-105" />
                <span class="font-medium">Categories</span>
            </RouterLink>

        </nav>
        <div class="w-full flex justify-center mt-8">
            <button @click="logout" class="px-6 py-3 rounded-xl bg-red-600 text-white font-semibold
               shadow-lg shadow-red-500/30 hover:bg-red-700 hover:shadow-red-600/40
               transition-all duration-200 transform hover:scale-105 active:scale-95
               flex items-center gap-2">

                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12H9m9 0l-3-3m3 3l-3 3" />
                </svg>

                Logout
            </button>
        </div>
        <div class="p-4 border-t border-slate-800">

            <div class="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div
                    class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                    AD
                </div>
                <div class="flex-1">
                    <p class="text-sm font-medium text-white">Admin User</p>
                    <p class="text-xs text-slate-400">Â© 2024 Admin</p>
                </div>
            </div>
        </div>
    </aside>
</template>
<script setup>
import { RouterLink, useRoute } from "vue-router";
import {
    LayoutGrid,
    LayoutDashboard,
    Users,
    BookOpen,
    GraduationCap
} from "lucide-vue-next";

const $route = useRoute();
const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
};
</script>
