import axiosClient from "./axiosClient";

export const categoryService = {
  getAll: () => axiosClient.get("/categories").then((res) => res.data),

  getDeleted: () =>
    axiosClient.get("/admin/categories/deleted").then((res) => res.data),

  getById: (id) => axiosClient.get(`/admin/categories/${id}`).then((res) => res.data),

  create: (data) => axiosClient.post("/admin/categories", data).then((res) => res.data),

  update: (id, data) =>
    axiosClient.put(`/admin/categories/${id}`, data).then((res) => res.data),

  delete: (id) => axiosClient.delete(`/admin/categories/${id}`).then((res) => res.data),

  recover: (id) =>
    axiosClient.put(`/admin/categories/recover/${id}`).then((res) => res.data),
};

// Xử lý bug
export const handleApiError = (error, defaultMessage = "Có lỗi xảy ra") => {
  const message =
    error.response?.data?.message || error.message || defaultMessage;
  console.error("API Error:", error);
  return message;
};
