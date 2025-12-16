<template>
    <header
        class="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-10">

        <div class="flex items-center gap-6 ml-auto">
            <div class="flex items-center gap-3 pl-6 border-l border-slate-700 h-8">
                <div class="flex flex-col items-end">
                    <span class="text-sm font-medium text-white leading-none mb-1">Admin</span>
                    <span class="text-xs text-white font-light">{{ user.email }}</span>
                </div>
                <div class="p-2 bg-slate-800 rounded-full border border-slate-700 text-slate-400">
                    <User class="w-4 h-4" />
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { useUserStore } from "@/store/user";
import {
    User
} from "lucide-vue-next";
const user = useUserStore;

defineProps({
    title: String
});


</script>