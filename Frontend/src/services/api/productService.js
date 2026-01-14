import axiosClient from "./axiosClient";

export const productService = {
  // USER
  getByIdUser: async (id) => {
    console.log("Đang gọi API với id:", id);
    console.log(
      "URL đầy đủ:",
      `${axiosClient.defaults.baseURL}/products/${id}`
    );

    try {
      const response = await axiosClient.get(`/products/${id}`);
      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      console.error("Error URL:", error.config?.url);
      throw error;
    }
  },

  // ADMIN
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
