import axios from "axios";

const API_BASE_URL = "https://localhost:7012/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const categoryService = {
  getAll: () => api.get("/Category").then((res) => res.data),

  getDeleted: () => api.get("/Category/deleted").then((res) => res.data),

  getById: (id) => api.get(`/Category/${id}`).then((res) => res.data),

  create: (data) => api.post("/Category", data).then((res) => res.data),

  update: (id, data) =>
    api.put(`/Category/${id}`, data).then((res) => res.data),

  delete: (id) => api.delete(`/Category/${id}`).then((res) => res.data),

  recover: (id) => api.put(`/Category/recover/${id}`).then((res) => res.data),
};

// Xử lý bug
export const handleApiError = (error, defaultMessage = "Có lỗi xảy ra") => {
  const message =
    error.response?.data?.message || error.message || defaultMessage;
  console.error("API Error:", error);
  return message;
};
