import axiosClient from "./axiosClient";

export const orderService = {
  // USER
  checkoutFromCart: async (maKH, data) => {
    const res = await axiosClient.post(`/order/Check-out-Cart/${maKH}`, data);
    return res.data;
  },

  createOrder: async (data) => {
    const res = await axiosClient.post(`/order/Tao-Don-Hang`, data);
    return res.data;
  },

  // ADMIN
  getAdminList: async () => {
    const res = await axiosClient.get("/admin/order");
    return res.data;
  },

  getByStatus: async (status) => {
    const res = await axiosClient.get(`/admin/order/status/${status}`);
    return res.data;
  },

  getByMaDonHang: async (maDonHang) => {
    const res = await axiosClient.get(`/admin/order/Ma-Don-Hang/${maDonHang}`);
    return res.data;
  },

  getByMaDon: async (maDon) => {
    const res = await axiosClient.get(`/admin/order/Ma-Don/${maDon}`);
    return res.data;
  },

  getBySoDienThoat: async (soDienThoat) => {
    const res = await axiosClient.get(
      `/admin/order/So-Dien-Thoai/${soDienThoat}`,
    );
    return res.data;
  },

  updateStatus: async (maDonHang, status) => {
    const res = await axiosClient.put(`/admin/products/${maDonHang}`, status);
    return res.data;
  },

  updateInfo: async (maDonHang, data) => {
    const res = await axiosClient.put(
      `/admin/products/Admin-Cap-nhat-thong-tin/${maDonHang}`,
      data,
    );
    return res.data;
  },

  create: async (data) => {
    const res = await axiosClient.post(`/admin/order/Tao-Don-Hang`, data);
    return res.data;
  },
};

// Xử lý bug
export const handleApiError = (error, defaultMessage = "Có lỗi xảy ra") => {
  const message =
    error.response?.data?.message || error.message || defaultMessage;
  console.error("API Error:", error);
  return message;
};
