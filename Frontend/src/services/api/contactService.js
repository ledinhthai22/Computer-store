import axios from "axios";

const API_BASE_URL = "https://localhost:7012/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const contactService = {
  getAll: () => api.get("/Contact").then((res) => res.data),

  getAllUnread: () => api.get("/Contact/AllUnread").then((res) => res.data),

  getAllRead: () => api.get(`/Contact/AllRead`).then((res) => res.data),

  create: (data) =>
    api.post("/Contact/SendContact", data).then((res) => res.data),

  update: (id, data) =>
    api.put(`/Contact/read/${id}`, data).then((res) => res.data),

  delete: (id) => api.delete(`/Contact/${id}`).then((res) => res.data),
};

// Xử lý bug
export const handleApiError = (error, defaultMessage = "Có lỗi xảy ra") => {
  const message =
    error.response?.data?.message || error.message || defaultMessage;
  console.error("API Error:", error);
  return message;
};
