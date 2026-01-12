import axiosClient from "./axiosClient";

export const contactService = {
  getAll: () => axiosClient.get("/admin/contacts").then((res) => res.data),

  getAllUnread: () =>
    axiosClient.get("/admin/contacts/Unread").then((res) => res.data),

  getAllRead: () => axiosClient.get(`/admin/contacts/Read`).then((res) => res.data),

  create: (data) =>
    axiosClient.post("/contacts", data).then((res) => res.data),

  update: (id, data) =>
    axiosClient.put(`/admin/contacts/read/${id}`, data).then((res) => res.data),

  delete: (id) => axiosClient.delete(`/admin/contacts/${id}`).then((res) => res.data),
};

// Xử lý bug
export const handleApiError = (error, defaultMessage = "Có lỗi xảy ra") => {
  const message =
    error.response?.data?.message || error.message || defaultMessage;
  console.error("API Error:", error);
  return message;
};
