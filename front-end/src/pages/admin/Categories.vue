<script setup>
import { ref, onMounted } from "vue"
import api from "../../utils/axios"
import Modal from "../../components/ui/Modal.vue"

/* ===================== STATE ===================== */
const categories = ref([])
const form = ref({ name: "" })
const imageFile = ref(null)
const previewUrl = ref(null)
const apiError = ref("")
const isModalOpen = ref(false)
const isEdit = ref(false)
const isDragging = ref(false)

/* ===================== FETCH ===================== */
const fetchCategory = async () => {
    const res = await api.get("/admin/categories")
    console.log(res)
    categories.value = res.data.categories
}

/* ===================== MODAL ===================== */
const openModal = (c = null) => {
    apiError.value = ""
    imageFile.value = null
    previewUrl.value = null

    if (c) {
        isEdit.value = true
        form.value = { id: c.id, name: c.name }

        if (c.image) {
            previewUrl.value = `http://localhost:5000${c.image}`
        }
    } else {
        isEdit.value = false
        form.value = { name: "" }
    }

    isModalOpen.value = true
}

const closeModal = () => {
    isModalOpen.value = false
    isDragging.value = false
    removeFile()
}

/* ===================== FILE ===================== */
const onFileChange = (e) => {
    const file = e.target.files[0]
    if (file) setFile(file)
}

const onDrop = (e) => {
    e.preventDefault()
    isDragging.value = false
    const file = e.dataTransfer.files[0]
    if (file) setFile(file)
}

const setFile = (file) => {
    if (!file.type.startsWith("image/")) {
        alert("กรุณาเลือกไฟล์รูปภาพ")
        return
    }
    imageFile.value = file
    previewUrl.value = URL.createObjectURL(file)
}

const removeFile = () => {
    if (previewUrl.value?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl.value)
    }
    imageFile.value = null
    previewUrl.value = null
}

/* ===================== CRUD ===================== */
const saveCategory = async () => {
    try {
        const formData = new FormData()
        formData.append("name", form.value.name)

        if (imageFile.value) {
            formData.append("image", imageFile.value)
        }
        if (!form.value.name.trim()) {
            apiError.value = "กรุณากรอกชื่อหมวดหมู่"
            return
        }
        if (isEdit.value) {
            await api.put(
                `/admin/categories/${form.value.id}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            )
        } else {
            await api.post(
                "/admin/categories/create",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            )
        }

        closeModal()
        fetchCategory()
    } catch (err) {
        apiError.value = err.response?.data?.message || "เกิดข้อผิดพลาด"
    }
}

const deleteCategory = async (id) => {
    if (!confirm("ต้องการลบหมวดหมู่นี้ใช่ไหม?")) return
    await api.delete(`/admin/categories/${id}`)
    fetchCategory()
}

onMounted(fetchCategory)
</script>

<template>
    <div class="p-6">
        <!-- HEADER -->
        <div class="mb-6 flex justify-between items-center">
            <h1 class="text-2xl font-bold">Categories</h1>
            <button @click="openModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow">
                + Add Category
            </button>
        </div>

        <!-- TABLE -->
        <div class="overflow-x-auto shadow rounded-lg bg-white">
            <table class="min-w-full">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="px-6 py-3 text-left">#</th>
                        <th class="px-6 py-3 text-left">Image</th>
                        <th class="px-6 py-3 text-left">Name</th>
                        <th class="px-6 py-3 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(c, index) in categories" :key="c.id" class="border-t hover:bg-gray-50">
                        <td class="px-6 py-4">{{ index + 1 }}</td>
                        <td class="px-6 py-4">
                            <img v-if="c.image" :src="`http://localhost:5000${c.image}`"
                                class="w-12 h-12 object-cover rounded" />
                            <span v-else class="text-gray-400 text-sm">No Image</span>
                        </td>
                        <td class="px-6 py-4">{{ c.name }}</td>
                        <td class="px-6 py-4 space-x-2">
                            <button @click="openModal(c)"
                                class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
                                Edit
                            </button>
                            <button @click="deleteCategory(c.id)"
                                class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- MODAL -->
    <Modal v-if="isModalOpen" @close="closeModal">
        <template #body>
            <div class="space-y-4">
                <h2 class="text-xl font-bold">
                    {{ isEdit ? "Edit Category" : "Add Category" }}
                </h2>

                <!-- Upload -->
                <div class="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition"
                    :class="isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'"
                    @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @drop="onDrop"
                    @click="$refs.fileInput.click()">
                    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />

                    <div v-if="!previewUrl">
                        <p class="text-gray-600 font-medium">
                            ลากรูปมาวาง หรือคลิกเพื่อเลือกไฟล์
                        </p>
                        <p class="text-sm text-gray-400">PNG / JPG</p>
                    </div>

                    <div v-else class="relative">
                        <img :src="previewUrl" class="mx-auto max-h-40 rounded shadow" />
                        <button @click.stop="removeFile"
                            class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                            ลบ
                        </button>
                    </div>
                </div>

                <!-- Name -->
                <input v-model="form.name" placeholder="Category Name"
                    class="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300" />

                <!-- Error -->
                <div v-if="apiError" class="bg-red-100 border border-red-300 text-red-600 p-2 rounded">
                    {{ apiError }}
                </div>

                <!-- Save -->
                <button @click="saveCategory"
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded shadow">
                    Save
                </button>
            </div>
        </template>
    </Modal>
</template>
