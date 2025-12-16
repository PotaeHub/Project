import { createWebHistory, createRouter } from "vue-router";

import Home from "@/pages/Home.vue";
import Login from "@/pages/auth/Login.vue";
import Register from "@/pages/auth/Register.vue";
import { useUserStore } from "@/store/user.js";

import AdminLayout from "../layouts/admin/AdminLayout.vue";
import Dashboard from "../pages/admin/Dashboard.vue";
import Users from "../pages/admin/Users.vue";
import Courses from "../pages/admin/Courses.vue";
import Categories from "@/pages/admin/Categories.vue"
import Trading from "../pages/CourseDetail.vue";
const routes = [
  // Main
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
    meta: { requireAdmin: true },
    component: AdminLayout,
    redirect: "/admin/dashboard",
    children: [
      { path: "dashboard", name: "admin-dashboard", component: Dashboard },
      { path: "users", name: "admin-users", component: Users },
      { path: "courses", name: "admin-courses", component: Courses },
      { path: "categories", name: "admin-categories", component: Categories },
    ]
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const user = useUserStore;

  if (to.meta.roles && !to.meta.roles.includes(user.role)) {
    return next("/login")
  }

  // ถ้าหน้าต้องเป็น Admin เท่านั้น
  if (to.meta.requireAdmin) {
    if (!user.role || user.role !== "ADMIN") {
      return next("/login");
    }
  }

  next();
});
