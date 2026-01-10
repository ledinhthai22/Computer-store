import axios from "axios";

const API_BASE_URL = "https://localhost:7012/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const categoryService = {
  // Lấy danh mục
  getAll: () => api.get("/Category").then((res) => res.data),

  // Lấy danh mục đã xóa
  getDeleted: () => api.get("/Category/deleted").then((res) => res.data),

  // Lấy danh mục theo ID
  getById: (id) => api.get(`/Category/${id}`).then((res) => res.data),

  // Tạo danh mục mới
  create: (data) => api.post("/Category", data).then((res) => res.data),

  // Cập nhật danh mục
  update: (id, data) =>
    api.put(`/Category/${id}`, data).then((res) => res.data),

  // Xóa danh mục
  delete: (id) => api.delete(`/Category/${id}`).then((res) => res.data),

  // Khôi phục danh mục
  recover: (id) => api.put(`/Category/recover/${id}`).then((res) => res.data),
};

// Xử lý bug
export const handleApiError = (error, defaultMessage = "Có lỗi xảy ra") => {
  const message =
    error.response?.data?.message || error.message || defaultMessage;
  console.error("API Error:", error);
  return message;
};
