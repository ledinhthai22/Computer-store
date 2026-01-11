import axiosClient from "./axiosClient";

export const contactService = {
  getAll: () => axiosClient.get("/Contact").then((res) => res.data),

  getAllUnread: () =>
    axiosClient.get("/Contact/AllUnread").then((res) => res.data),

  getAllRead: () => axiosClient.get(`/Contact/AllRead`).then((res) => res.data),

  create: (data) =>
    axiosClient.post("/Contact/SendContact", data).then((res) => res.data),

  update: (id, data) =>
    axiosClient.put(`/Contact/read/${id}`, data).then((res) => res.data),

  delete: (id) => axiosClient.delete(`/Contact/${id}`).then((res) => res.data),
};

// Xử lý bug
export const handleApiError = (error, defaultMessage = "Có lỗi xảy ra") => {
  const message =
    error.response?.data?.message || error.message || defaultMessage;
  console.error("API Error:", error);
  return message;
};
