import api from "../utils/axios";

export const UserService = {
    getAll() {
        return api.get("/admin/users")
    },
    create(data) {
        return api.post("/admin/create", data);
    },
    getProfile(id) {
        return api.get(`/admin/profile/${id}`);
    },
    update(id, data) {
        return api.put(`/admin/user/${id}`, data);
    },
    remove(id) {
        return api.delete(`/admin/user/${id}`);
    }
};