import axiosClient from "./axiosClient";

export const productService = {
  getAll: () =>
    axiosClient.get("/admin/products").then((res) => res.data.danhSach),

  getDeleted: () =>
    axiosClient.get("/admin/products/deleted").then((res) => res.data.danhSach),

  getById: (id) =>
    axiosClient.get(`/admin/products/${id}`).then((res) => res.data.danhSach),

  create: (formData) =>
    axiosClient.post("/admin/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  update: (id, data) =>
    axiosClient
      .put(`/admin/products/${id}`, data)
      .then((res) => res.data.danhSach),

  delete: (id) =>
    axiosClient
      .delete(`/admin/products/${id}`)
      .then((res) => res.data.danhSach),

  recover: (id) =>
    axiosClient
      .put(`/admin/products/${id}/restore`)
      .then((res) => res.danhSach),
};

// Xử lý bug
export const handleApiError = (error, defaultMessage = "Có lỗi xảy ra") => {
  const message =
    error.response?.data?.message || error.message || defaultMessage;
  console.error("API Error:", error);
  return message;
};
