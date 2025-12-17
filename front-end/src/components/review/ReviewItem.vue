<script setup>
defineProps({
    review: Object
})
</script>

<template>
    <div class="border rounded-xl p-4 space-y-2">
        <div class="flex items-center justify-between">
            <span class="font-semibold">{{ review.user?.email }}</span>
            <span class="text-yellow-500">
                ⭐ {{ review.rating }}/5
            </span>
        </div>
        <p class="text-gray-700">{{ review.comment }}</p>
    </div>
</template>
