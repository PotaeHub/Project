<template>
    <div class="p-6">

        <!-- Header + Add User + Filter Dropdown -->
        <div class="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 class="text-2xl font-bold">Users</h1>

            <div class="flex gap-4 items-center">
                <!-- Role Select -->
                <div>
                    <label class="text-sm font-medium text-slate-700 mr-2">Filter by Role:</label>
                    <select v-model="selectedRole" @change="currentPage = 1"
                        class="px-3 py-1 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                        <option value="ALL">All</option>
                        <option value="STUDENT">Student</option>
                        <option value="TEACHER">Teacher</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>

                <!-- Add User -->
                <button @click="openModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg ml-4">
                    + Add User
                </button>
            </div>
        </div>

        <!-- Users Table -->
        <div class="overflow-x-auto shadow-md rounded-lg">
            <table class="w-full border-collapse">
                <thead class="bg-gray-200">
                    <tr>
                        <th class="px-6 py-3 text-left font-semibold">id</th>
                        <th class="px-6 py-3 text-left font-semibold">Name</th>
                        <th class="px-6 py-3 text-left font-semibold">Email</th>
                        <th class="px-6 py-3 text-left font-semibold">ดูโปรไฟล์</th>
                        <th class="px-6 py-3 text-left font-semibold">สถานะ</th>
                        <th class="px-6 py-3 text-left font-semibold">การดำเนินการ</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(u, index) in paginatedUsers" :key="u.id" class="border-b hover:bg-gray-50">
                        <td class="px-6 py-4 bg-white">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                        <td class="px-6 py-4 bg-white">{{ u.name }}</td>
                        <td class="px-6 py-4 bg-white">{{ u.email }}</td>
                        <td class="px-6 py-4 bg-white">
                            <input type="submit" @click="openProfile(u)"
                                class="text-blue-500 border-b-2 cursor-pointer hover:text-blue-700" value="ดูโปรไฟล์" />
                        </td>
                        <td class="px-6 py-4 bg-white">
                            <span :class="{
                                'bg-green-100 text-green-800': u.role === 'STUDENT',
                                'bg-blue-100 text-blue-800': u.role === 'TEACHER',
                                'bg-red-100 text-red-800': u.role === 'ADMIN',
                                'inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium': true
                            }">
                                {{ u.role }}
                            </span>
                        </td>
                        <td class="px-6 py-4 bg-white text-center">
                            <button @click="deleteUser(u.id)"
                                class="p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-all duration-200 shadow-sm hover:shadow text-red-600 hover:text-red-700 active:scale-95 flex items-center justify-center"
                                title="Delete User">
                                <TrashIcon class="w-5 h-5 cursor-pointer" />
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div class="mt-4 flex justify-center gap-2">
            <button v-for="page in totalPages" :key="page" @click="currentPage = page" :class="{
                'bg-indigo-600 text-white': currentPage === page,
                'bg-gray-200 text-slate-700 hover:bg-gray-300': currentPage !== page
            }" class="px-3 py-1 rounded-lg font-medium transition-colors duration-200">
                {{ page }}
            </button>
        </div>
        <Modal v-if="isModalOpen" @close="isModalOpen = false">
            <template #title>Add User</template>

            <template #body>
                <div class="space-y-4">
                    <input v-model="form.name" placeholder="Full Name" class="w-full px-4 py-2 border rounded-lg" />
                    <input v-model="form.email" type="email" placeholder="Email"
                        class="w-full px-4 py-2 border rounded-lg" />
                    <input v-model="form.password" type="password" placeholder="Password"
                        class="w-full px-4 py-2 border rounded-lg" />
                    <select v-model="form.role" class="w-full px-4 py-2 border rounded-lg">
                        <option v-for="r in roles" :key="r.value" :value="r.value">{{ r.label }}</option>
                    </select>
                    <div v-if="apiError" class="p-3 bg-red-50 border border-red-300 rounded-lg">
                        <span class="text-red-700 font-semibold">{{ apiError }}</span>
                    </div>
                    <button @click="saveUser"
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow">
                        Save
                    </button>
                </div>
            </template>
        </Modal>
        <Modal v-if="isProfileModalOpen" @close="isProfileModalOpen = false">
            <template #title>Profile</template>
            <template #body>
                <div class="space-y-4">
                    <div class="flex items-center gap-4">
                        <User class="w-12 h-12 text-gray-400" />
                        <div>
                            <h3 class="text-xl font-bold">{{ selectedProfile?.name }}</h3>
                            <p class="text-sm text-gray-500">{{ selectedProfile?.email }}</p>
                            <span :class="{
                                'bg-green-100 text-green-800': selectedProfile?.role === 'STUDENT',
                                'bg-blue-100 text-blue-800': selectedProfile?.role === 'TEACHER',
                                'bg-red-100 text-red-800': selectedProfile?.role === 'ADMIN',
                                'inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium': true
                            }">{{ selectedProfile?.role }}</span>
                        </div>
                    </div>
                </div>
            </template>
        </Modal>
    </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { TrashIcon, User } from "lucide-vue-next";
import api from "../../utils/axios";
import Modal from "../../components/ui/Modal.vue";

const users = ref([]);
const selectedRole = ref("ALL");
const currentPage = ref(1);
const pageSize = 20;
const isModalOpen = ref(false);
const isProfileModalOpen = ref(false)
const profile = ref("");
const apiError = ref("");

// Form สำหรับ Add User
const form = ref({
    name: "",
    email: "",
    password: "",
    role: "STUDENT"
});
const selectedProfile = ref(null);
// Role options
const roles = [
    { label: "Student", value: "STUDENT" },
    { label: "Teacher", value: "TEACHER" },
    { label: "Admin", value: "ADMIN" }
];

// Fetch Users
const fetchUsers = async () => {
    try {
        const res = await api.get("/admin/users");
        console.log(res.data)
        users.value = res.data.users;
    } catch (err) {
        console.error(err);
    }
};


// Delete User
const deleteUser = async (id) => {
    if (!confirm("Are you sure?")) return;
    await api.delete(`/admin/user/${id}`);
    fetchUsers();
};

// Open modal Add User
const openModal = () => {
    form.value = { name: "", email: "", password: "", role: "STUDENT" };
    apiError.value = "";
    isModalOpen.value = true;
};

// Save User
const saveUser = async () => {
    apiError.value = "";
    try {
        await api.post("/admin/create", { ...form.value });
        isModalOpen.value = false;
        fetchUsers();
    } catch (err) {
        console.error(err);
        apiError.value = err.response?.data?.message || "Something went wrong";
    }
};
const openProfile = (user) => {
    selectedProfile.value = user;
    isProfileModalOpen.value = true;
};

// Filtered users by role
const filteredUsers = computed(() => {
    if (selectedRole.value === "ALL") return users.value;
    return users.value.filter(u => u.role === selectedRole.value);
});

// Paginated users
const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filteredUsers.value.slice(start, start + pageSize);
});

// Total pages
const totalPages = computed(() => Math.ceil(filteredUsers.value.length / pageSize));

onMounted(fetchUsers);
</script>
