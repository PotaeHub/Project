import { createMemoryHistory, createRouter } from "vue-router"
import Home from "../pages/Home.vue"
import About from "../pages/About.vue"
import Contact from "../pages/Contact.vue"
import Login from "../pages/auth/Login.vue"
import Register from "../pages/auth/Register.vue"

const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/contact", component: Contact },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes
})
