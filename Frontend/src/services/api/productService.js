import axiosClient from "./axiosClient";

export const productService = {
  // USER
  usergetAll: (params) => axiosClient.get("/products",{params: params}).then((res) => {return res.data}),

  usergetId: (id) => axiosClient.get(`/products/${id}`).then((res) => res.data.danhSach),

  usergetNewest: (soLuong) => axiosClient.get(`/products/newest?soLuong=${soLuong}`).then((res) => res.data),

  usergetBestSelling: (soLuong) => axiosClient.get(`/products/best-selling?soLuong=${soLuong}`).then((res) => res.data),

  usergetByCategory: (maDanhMuc) => axiosClient.get(`/products/category/${maDanhMuc}`).then((res) => res.data.danhSach),

  usergetByBrand: (maThuongHieu) => axiosClient.get(`/products/brand/${maThuongHieu}`).then((res) => res.data.danhSach),
  
  usergetBySlug: (slug) => axiosClient.get(`/products/slug/${slug}`).then((res) => res.data.danhSach),

  // ADMIN
  getAll: () =>
    axiosClient.get("/admin/products").then((res) => res.data.danhSach),

  getDeleted: () =>
    axiosClient.get("/admin/products/deleted").then((res) => res.data.danhSach),

  getById: (id) =>
    axiosClient.get(`/admin/products/${id}`).then((res) => res.data.danhSach),

  create: (formData) =>
    axiosClient.post("/admin/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  update: (id, data) =>
    axiosClient
      .put(`/admin/products/${id}`, data)
      .then((res) => res.data.danhSach),

  delete: (id) =>
    axiosClient
      .delete(`/admin/products/${id}`)
      .then((res) => res.data.danhSach),

  recover: (id) =>
    axiosClient
      .put(`/admin/products/${id}/restore`)
      .then((res) => res.danhSach),
};

// Xử lý bug
export const handleApiError = (error, defaultMessage = "Có lỗi xảy ra") => {
  const message =
    error.response?.data?.message || error.message || defaultMessage;
  console.error("API Error:", error);
  return message;
};
