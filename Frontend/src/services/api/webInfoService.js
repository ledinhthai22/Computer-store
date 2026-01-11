import axiosClient from "./axiosClient";

export const WebInfoService = {
  getAll: () => axiosClient.get("/WebInfo").then((res) => res.data),

  getDeleted: () => axiosClient.get("/WebInfo/deleted").then((res) => res.data),

  getById: (id) => axiosClient.get(`/WebInfo/${id}`).then((res) => res.data),

  create: (data) => axiosClient.post("/WebInfo", data).then((res) => res.data),

  update: (id, data) => axiosClient.put(`/WebInfo/${id}`, data).then((res) => res.data),

  delete: (id) => axiosClient.delete(`/WebInfo/${id}`).then((res) => res.data),

  recover: (id) => axiosClient.put(`/WebInfo/restore/${id}`).then((res) => res.data),
};

// Xử lý bug
export const handleApiError = (error, defaultMessage = "Có lỗi xảy ra") => {
  const message =
    error.response?.data?.message || error.message || defaultMessage;
  console.error("API Error:", error);
  return message;
};
