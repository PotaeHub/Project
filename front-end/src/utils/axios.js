import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
});

// attach access token
api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // ต้องถูกต้อง
    }
    return config;
});

// refresh token if 401
api.interceptors.response.use(
    res => res,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const res = await api.get("/refresh", { withCredentials: true });
                const newToken = res.data.accessToken;
                localStorage.setItem("token", newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (err) {
                localStorage.removeItem("token");
                window.location.href = "/login";
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
