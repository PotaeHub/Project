import { createWebHistory, createRouter } from "vue-router";

import Home from "@/pages/Home.vue";
import Login from "@/pages/auth/Login.vue";
import Register from "@/pages/auth/Register.vue";
import { useUserStore } from "@/store/user.js";

import AdminLayout from "@/layouts/admin/AdminLayout.vue";
import AdminDashboard from "@/pages/admin/Dashboard.vue";
import Users from "@/pages/admin/Users.vue";
import Courses from "@/pages/admin/Courses.vue";
import Categories from "@/pages/admin/Categories.vue";

import Trading from "@/pages/CourseDetail.vue";

// ✅ FIX ตรงนี้
import TeacherLayout from "@/layouts/teacher/TeacherLayout.vue";
import TeacherDashboard from "@/pages/teacher/Dashboard.vue";
import Announcement from "@/pages/teacher/Announcement.vue";
import MyCourses from "@/pages/teacher/MyCourses.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: { roles: ["TEACHER", "STUDENT", "ADMIN"] }
  },

  { path: "/login", name: "login", component: Login },
  { path: "/register", name: "register", component: Register },
  { path: "/course/:id", name: "course-detail", component: Trading },

  // Admin
  {
    path: "/admin",
    component: AdminLayout,
    meta: { roles: ["ADMIN"] },
    redirect: "/admin/dashboard",
    children: [
      { path: "dashboard", component: AdminDashboard },
      { path: "users", component: Users },
      { path: "courses", component: Courses },
      { path: "categories", component: Categories },
    ]
  },

  // Teacher
  {
    path: "/teacher",
    component: TeacherLayout,
    meta: { roles: ["TEACHER"] },
    redirect: "/teacher/dashboard",
    children: [
      { path: "dashboard", name: "teacher-dashboard", component: TeacherDashboard },
      { path: "announcement", name: "teacher-announcement", component: Announcement },
      { path: "my-courses", name: "teacher-my-courses", component: MyCourses },
    ]
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const user = useUserStore;

  next();
});
