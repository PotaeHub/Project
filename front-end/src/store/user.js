// store/user.js
import { reactive } from "vue";

export const useUserStore = reactive({
    token: localStorage.getItem("token") || null,
    email: localStorage.getItem("email") || null,
    role: localStorage.getItem("role") || null,
    profilePic: null
});

export const setUserStore = ({ token, email, role, profilePic = null }) => {
    useUserStore.token = token;
    useUserStore.email = email;
    useUserStore.role = role;
    useUserStore.profilePic = profilePic;

    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    localStorage.setItem("role", role);
};

export const logoutUser = (router) => {
    useUserStore.token = null;
    useUserStore.email = null;
    useUserStore.role = null;
    useUserStore.profilePic = null;

    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    if (router) router.push("/login");
};
