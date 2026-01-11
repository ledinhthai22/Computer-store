import axiosClient from "./axiosClient";

export const brandService = {
  getAll: () => axiosClient.get("/Brand").then((res) => res.data),

  getDeleted: () => axiosClient.get("/Brand/deleted").then((res) => res.data),

  getById: (id) => axiosClient.get(`/Brand/${id}`).then((res) => res.data),

  create: (data) => axiosClient.post("/Brand", data).then((res) => res.data),

  update: (id, data) =>
    axiosClient.put(`/Brand/${id}`, data).then((res) => res.data),

  delete: (id) => axiosClient.delete(`/Brand/${id}`).then((res) => res.data),

  recover: (id) =>
    axiosClient.put(`/Brand/recover/${id}`).then((res) => res.data),
};

// Xử lý bug
export const handleApiError = (error, defaultMessage = "Có lỗi xảy ra") => {
  const message =
    error.response?.data?.message || error.message || defaultMessage;
  console.error("API Error:", error);
  return message;
};
