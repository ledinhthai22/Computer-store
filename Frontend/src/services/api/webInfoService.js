import axiosClient from "./axiosClient";

export const WebInfoService = {
  userGetAll: () => axiosClient.get("/WebInfo").then((res) => res.data),

  getAll: () => axiosClient.get("/admin/WebInfoAdmin").then((res) => res.data),

  getDeleted: () =>
    axiosClient.get("/admin/WebInfoAdmin/deleted").then((res) => res.data),

  getById: (id) =>
    axiosClient.get(`/admin/WebInfoAdmin/detail/${id}`).then((res) => res.data),

  create: (data) =>
    axiosClient.post("/admin/WebInfoAdmin", data).then((res) => res.data),

  update: (id, data) =>
    axiosClient.put(`/admin/WebInfoAdmin/${id}`, data).then((res) => res.data),

  updateStatus: (id, data) =>
    axiosClient
      .put(`/admin/WebInfoAdmin/update-status/${id}`, data)
      .then((res) => res.data),

  delete: (id) =>
    axiosClient.delete(`/admin/WebInfoAdmin/${id}`).then((res) => res.data),

  recover: (id) =>
    axiosClient
      .put(`/admin/WebInfoAdmin/restore/${id}`)
      .then((res) => res.data),
};

// Xử lý bug
export const handleApiError = (error, defaultMessage = "Có lỗi xảy ra") => {
  const message =
    error.response?.data?.message || error.message || defaultMessage;
  console.error("API Error:", error);
  return message;
};
