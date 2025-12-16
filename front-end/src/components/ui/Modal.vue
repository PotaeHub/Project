<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 ">

        <!-- Glass Backdrop -->
        <div class="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity" @click="$emit('close')">
        </div>

        <!-- Modal Card -->
        <div
            class="relative w-full max-w-2xl bg-white backdrop-blur-lg rounded-3xl shadow-2xl ring-1 ring-slate-200 flex flex-col max-h-[90vh] overflow-hidden animate-fadeIn scale-100">

            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <h3 class="text-2xl font-bold text-slate-900 tracking-tight">
                    <slot name="title">Modal Title</slot>
                </h3>
                <button @click="$emit('close')"
                    class="rounded-full p-2 text-slate-600 hover:text-white hover:bg-red-500 transition-all duration-200">
                    <XIcon class="w-5 h-5" />
                </button>
            </div>

            <!-- Body -->
            <div class="p-6 overflow-y-auto text-slate-800 custom-scrollbar space-y-4">
                <slot name="body"></slot>
            </div>

            <!-- Footer -->
            <div
                class="flex items-center justify-end gap-3 px-6 py-4 bg-white/70 backdrop-blur-sm border-t border-slate-200">
                <button class="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl shadow-lg
                 hover:bg-indigo-700 hover:shadow-xl transition-all duration-200" @click="$emit('close')">
                    Close
                </button>
                <slot name="footer"></slot>
            </div>

        </div>
    </div>
</template>

<script setup>
import { XIcon } from 'lucide-vue-next'
</script>

<style>
/* Animation ลื่นสุดๆ */
@keyframes fadeIn {
    0% {
        opacity: 0;
        transform: translateY(12px) scale(0.96);
    }

    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.animate-fadeIn {
    animation: fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Scrollbar แบบบาง+สวย */
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #94a3b8;
    border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #64748b;
}
</style>
