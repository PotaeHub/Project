<template>
    <div class="p-6">
        <div class="mb-6 flex justify-between items-center">
            <h1 class="text-2xl font-bold">Courses</h1>
            <button @click="openModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow">
                + Add Course
            </button>
        </div>

        <div class="overflow-x-auto w-full shadow-md rounded-lg">
            <table class="min-w-full bg-white">
                <thead class="bg-gray-200">
                    <tr>
                        <th class="px-6 py-3 text-left font-semibold">Title</th>
                        <th class="px-6 py-3 text-left font-semibold">Teacher Name</th>
                        <th class="px-6 py-3 text-left font-semibold">Price</th>
                        <th class="px-6 py-3 text-left font-semibold">Image</th>
                        <th class="px-6 py-3 text-left font-semibold">Category</th>
                        <th class="px-6 py-3 text-left font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="c in courses" :key="c.id" class="hover:bg-gray-50">
                        <td class="px-6 py-4 bg-white">{{ c.title }}</td>
                        <td class="px-6 py-4 bg-white">{{ c.teacher?.name || "-" }}</td>
                        <td class="px-6 py-4 bg-white">{{ c.price }}</td>
                        <td class="px-6 py-4 bg-white">{{ c.image }}</td>
                        <td class="px-6 py-4 bg-white">{{ c.category?.name || "-" }}</td>
                        <td class="px-6 py-4 bg-white space-x-2">
                            <button @click="openModal(c)"
                                class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">Edit</button>
                            <button @click="deleteCourse(c.id)"
                                class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>


        <!-- Modal -->
        <Modal v-if="isModalOpen" @close="isModalOpen = false">
            <template #body>
                <div class="space-y-4">
                    <h1 class="font-bold text-5xl">Add Coures</h1>
                    <input v-model="form.title" placeholder="Course Title"
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <textarea v-model="form.description" placeholder="Description"
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    <input v-model.number="form.price" type="number" placeholder="Price"
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

                    <h1>Name :</h1>
                    <select v-model="form.teacherId"
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="" disabled>Select Teacher</option>
                        <option v-for="t in teachers" :key="t.id" :value="t.id">{{ t.name }}</option>
                    </select>


                    <select v-model="form.categoryId"
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">No Category</option>
                        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                    </select>

                    <div v-if="apiError" class="p-3 bg-red-50 border border-red-300 rounded-lg">
                        <span class="text-red-700 font-semibold">{{ apiError }}</span>
                    </div>

                    <button @click="saveCourse"
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow">
                        Save
                    </button>
                </div>
            </template>
        </Modal>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../../utils/axios";
import Modal from "@/components/ui/Modal.vue";

const courses = ref([]);
const teachers = ref([]);
const categories = ref([]);
const isModalOpen = ref(false);
const form = ref({});
const apiError = ref("");

const fetchCourses = async () => {
    const res = await api.get("/admin/courses");
    courses.value = res.data.courses;
};

const fetchTeachers = async () => {
    try {
        const res = await api.get("/admin/teachers");
        teachers.value = res.data.teachers;
    } catch (error) {
        console.log(error)
        apiError.value = err.response?.data?.message
    }
};



const openModal = (c = null) => {
    form.value = c
        ? { ...c, teacherId: c.teacherId, categoryId: c.categoryId || "" }
        : { title: "", description: "", price: 0, categoryId: "" };
    apiError.value = "";
    isModalOpen.value = true;
};

const saveCourse = async () => {
    try {
        apiError.value = "";
        const url = form.value.id ? `/admin/course/${form.value.id}` : "/admin/course/create";
        const method = form.value.id ? "put" : "post";
        await api[method](url, form.value);
        isModalOpen.value = false;
        fetchCourses();
    } catch (err) {
        apiError.value = err.response?.data?.message || "Failed to save course";
    }
};

const deleteCourse = async (id) => {
    if (!confirm("Are you sure?")) return;
    await api.delete(`/admin/course/${id}`);
    fetchCourses();
};

onMounted(() => {
    fetchCourses();
    fetchTeachers();
});
</script>
