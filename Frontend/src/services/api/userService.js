import axiosClient from "./axiosClient";

export const userService = {
  getAll: () => axiosClient.get("/User").then((res) => res.data),

  getAllLock: () => axiosClient.get("/User/lock").then((res) => res.data),

  getAllUnlock: () => axiosClient.get("/User/unlock").then((res) => res.data),

  getAllDeleted: () => axiosClient.get("/User/deleted").then((res) => res.data),

  getById: (id) =>
    axiosClient.get(`/User/Userinfo/${id}`).then((res) => res.data),

  create: (data) => axiosClient.post("/User", data).then((res) => res.data),

  updateInfo: (id, data) =>
    axiosClient.put(`/User/Userinfo/${id}`, data).then((res) => res.data),

  update: (id, data) =>
    axiosClient.put(`/User/${id}`, data).then((res) => res.data),

  delete: (id) => axiosClient.delete(`/User/${id}`).then((res) => res.data),

  lock: (id) => axiosClient.put(`/User/${id}/lock`).then((res) => res.data),

  unlock: (id) => axiosClient.put(`/User/${id}/unlock`).then((res) => res.data),

  recover: (id) =>
    axiosClient.put(`/User/${id}/restore`).then((res) => res.data),
};

// Xử lý bug
export const handleApiError = (error, defaultMessage = "Có lỗi xảy ra") => {
  const message =
    error.response?.data?.message || error.message || defaultMessage;
  console.error("API Error:", error);
  return message;
};
