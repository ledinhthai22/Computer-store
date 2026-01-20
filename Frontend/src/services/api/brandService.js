import axiosClient from "./axiosClient";

export const brandService = {
  
  userGetAll: () =>
    axiosClient.get("/brands").then((res) => res.data || []),

  userGetById: (id) =>
    axiosClient.get(`/brands/${id}`).then((res) => res.data),

  getAll: () =>
    axiosClient.get("/admin/brands").then((res) => res.data),

  getDeleted: () =>
    axiosClient.get("/admin/brands/deleted").then((res) => res.data),

  getById: (id) =>
    axiosClient.get(`/admin/brands/${id}`).then((res) => res.data),

  create: (data) =>
    axiosClient
      .post("/admin/brands", data)
      .then((res) => res.data.data),

  update: (id, data) =>
    axiosClient
      .put(`/admin/brands/${id}`, data)
      .then((res) => res.data.data),

  delete: (id) =>
    axiosClient
      .delete(`/admin/brands/${id}`)
      .then((res) => res.data),

  recover: (id) =>
  axiosClient
    .put(`/admin/brands/recover/${id}`)   // sửa Restore → recover
    .then((res) => res.data),
};


export const handleApiError = (
  error,
  defaultMessage = "Có lỗi xảy ra"
) => {
  const message =
    error.response?.data?.message ||
    error.message ||
    defaultMessage;

  console.error("API Error:", error);
  return message;
};
