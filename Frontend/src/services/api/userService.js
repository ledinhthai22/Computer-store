import axiosClient from "./axiosClient";

export const userService = {
  getAll: () => axiosClient.get("/admin/users").then((res) => res.data),

  getAllLock: () =>
    axiosClient.get("/admin/users/locked").then((res) => res.data),

  getAllUnlock: () =>
    axiosClient.get("/admin/users/unlocked").then((res) => res.data),

  getAllDeleted: () =>
    axiosClient.get("/admin/users/deleted").then((res) => res.data),

  create: (data) =>
    axiosClient.post("/admin/users", data).then((res) => res.data),

  update: (id, data) =>
    axiosClient.put(`/admin/users/${id}`, data).then((res) => res.data),

  delete: (id) =>
    axiosClient.delete(`/admin/users/${id}`).then((res) => res.data),

  lock: (id) =>
    axiosClient.put(`/admin/users/${id}/lock`).then((res) => res.data),

  unlock: (id) =>
    axiosClient.put(`/admin/users/${id}/unlock`).then((res) => res.data),

  recover: (id) =>
    axiosClient.put(`/admin/users/${id}/restore`).then((res) => res.data),
};

// Xử lý bug
export const handleApiError = (error, defaultMessage = "Có lỗi xảy ra") => {
  const message =
    error.response?.data?.message || error.message || defaultMessage;
  console.error("API Error:", error);
  return message;
};
