<template>
    <div class="flex h-screen bg-gray-100">

        <!-- Sidebar -->
        <Sidebar />

        <!-- Main Content -->
        <div class="flex-1 flex flex-col">

            <!-- Topbar -->
            <Topbar :title="title" />

            <!-- Page Content -->
            <main class="p-6 overflow-auto">
                <router-view></router-view>
            </main>
        </div>
    </div>
</template>

<script setup>
import Sidebar from "@/components/admin/Sidebar.vue";
import Topbar from "@/components/admin/Topbar.vue";

defineProps({
    title: {
        type: String,
        default: "Dashboard"
    }
});
</script>
