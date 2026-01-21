import axiosClient from "./axiosClient";

export const WebInfoService = {
  // CLIENT
  userGetHeader: () =>
    axiosClient.get("/webinfo").then((res) => res.data),
    
  userGetAll: () =>
    axiosClient.get("/webinfo/all").then((res) => res.data),

  // ADMIN
  getAll: () =>
    axiosClient.get("/admin/web-info").then((res) => res.data),

  getDeleted: () =>
    axiosClient.get("/admin/web-info/deleted").then((res) => res.data),

  getById: (id) =>
    axiosClient.get(`/admin/web-info/${id}`).then((res) => res.data),

  create: (data) =>
    axiosClient.post("/admin/web-info/create", data).then((res) => res.data),

  update: (id, data) =>
    axiosClient.put(`/admin/web-info/${id}`, data).then((res) => res.data),

  delete: (id) =>
    axiosClient.delete(`/admin/web-info/${id}`).then((res) => res.data),

  recover: (id) =>
    axiosClient
      .put(`/admin/web-info/restore/${id}`)
      .then((res) => res.data),
};
