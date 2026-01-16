import axiosClient from "./axiosClient";

export const productService = {
  userGetAll: (params) =>
    axiosClient.get("/products", { params }).then((res) => res.data),

  userGetById: (id) =>
    axiosClient.get(`/products/${id}`).then((res) => res.data),

  userGetBySlug: (slug) =>
    axiosClient.get(`/products/slug/${slug}`).then((res) => res.data),

  userGetNewest: (soLuong = 10) =>
    axiosClient
      .get(`/products/newest`, { params: { soLuong } })
      .then((res) => res.data),

  userGetBestSelling: (soLuong = 10) =>
    axiosClient
      .get(`/products/best-selling`, { params: { soLuong } })
      .then((res) => res.data),

  userGetByCategoryPaging: (maDanhMuc, page = 1, pageSize = 12, filters = {}) => {
    const params = {
      page,
      pageSize,
    };

    if (filters.MaThuongHieu) params.maThuongHieu = filters.MaThuongHieu;
    if (filters.GiaMin !== null && filters.GiaMin !== undefined) params.giaMin = filters.GiaMin;
    if (filters.GiaMax !== null && filters.GiaMax !== undefined) params.giaMax = filters.GiaMax;

    return axiosClient
      .get(`/products/category/${maDanhMuc}`, { params })
      .then((res) => res.data);
  },

  userGetByBrandPaging: (maThuongHieu, page = 1, pageSize = 12, filters = {}) => {
    const params = {
      page,
      pageSize,
    };

    if (filters.MaDanhMuc) params.maDanhMuc = filters.MaDanhMuc;
    if (filters.GiaMin !== null && filters.GiaMin !== undefined) params.giaMin = filters.GiaMin;
    if (filters.GiaMax !== null && filters.GiaMax !== undefined) params.giaMax = filters.GiaMax;

    return axiosClient
      .get(`/products/brand/${maThuongHieu}`, { params })
      .then((res) => res.data);
  },

  usergetByCategory: function(maDanhMuc, page = 1, pageSize = 12, filters = {}) {
    return this.userGetByCategoryPaging(maDanhMuc, page, pageSize, filters);
  },

  usergetByBrand: function(maThuongHieu, page = 1, pageSize = 12, filters = {}) {
    return this.userGetByBrandPaging(maThuongHieu, page, pageSize, filters);
  },

  usergetAll: function(params) {
    return this.userGetAll(params);
  },

  usergetNewest: function(soLuong = 10) {
    return this.userGetNewest(soLuong);
  },

  usergetBestSelling: function(soLuong = 10) {
    return this.userGetBestSelling(soLuong);
  },

  getAdminList: async () => {
    const res = await axiosClient.get("/admin/products");
    return res.data;
  },

  getDetailProduct: async (id) => {
    const res = await axiosClient.get(`/admin/products/${id}`);
    return res.data;
  },

  updateProduct: async (id, formData) => {
    const res = await axiosClient.put(`/admin/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  addProduct: async (formData) => {
    const res = await axiosClient.post(`/admin/products`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  deleteProduct: async (id) => {
    const res = await axiosClient.delete(`/admin/products/${id}`);
    return res.data;
  },

  recoverProduct: async (id) => {
    const res = await axiosClient.put(`/admin/products/${id}/restore`);
    return res.data;
  },
};

export const handleApiError = (error, defaultMessage = "Có lỗi xảy ra") => {
  const message =
    error.response?.data?.message || error.message || defaultMessage;

  console.error("API Error:", error);
  return message;
};