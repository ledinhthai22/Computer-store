import axiosClient from "./axiosClient";

export const categoryService = {
  getAll: () => axiosClient.get("/Category").then((res) => res.data),

  getDeleted: () => axiosClient.get("/Category/deleted").then((res) => res.data),

  getById: (id) => axiosClient.get(`/Category/${id}`).then((res) => res.data),

  create: (data) => axiosClient.post("/Category", data).then((res) => res.data),

  update: (id, data) =>
    axiosClient.put(`/Category/${id}`, data).then((res) => res.data),

  delete: (id) => axiosClient.delete(`/Category/${id}`).then((res) => res.data),

  recover: (id) => axiosClient.put(`/Category/recover/${id}`).then((res) => res.data),
};

// Xử lý bug
export const handleApiError = (error, defaultMessage = "Có lỗi xảy ra") => {
  const message =
    error.response?.data?.message || error.message || defaultMessage;
  console.error("API Error:", error);
  return message;
};
