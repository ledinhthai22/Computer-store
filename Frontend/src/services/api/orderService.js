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
  updateOrderInfo: async (maDH, data) => {
    const res = await axiosClient.put(`/order/Cap-nhat-thong-tin/${maDH}`, data);
    return res.data;
  },

  getOrderDetail: async (maDH) => {
    const res = await axiosClient.get(`/order/detail/${maDH}`);
    return res.data;
  },

  /**
   * Hủy đơn hàng (người dùng tự hủy - thường chỉ áp dụng khi trạng thái còn "Chờ duyệt")
   */
  cancelOrder: async (maDH) => {
    const res = await axiosClient.put(`/order/cancel/${maDH}`);
    return res.data;
  },

  /** Lấy chi tiết đơn hàng theo mã đơn (MaDon - dạng string) */
  getOrderByCode: async (maDon) => {
    const res = await axiosClient.get(`/order/Ma-Don/${maDon}`);
    return res.data;
  },

  /** Lấy danh sách đơn hàng theo trạng thái (0=Chờ duyệt, 3=Đang giao, 5=Hoàn thành, 6=Đã hủy, ...) */
  getOrdersByStatus: async (status) => {
    const res = await axiosClient.get(`/order/by-status/${status}`);
    return res.data;
  },

  /** Lấy tất cả đơn hàng đã hoàn thành */
  getCompletedOrders: async () => {
    const res = await axiosClient.get(`/order/completed`);
    return res.data;
  },

  /** Lấy tất cả đơn hàng đã hủy */
  getCancelledOrders: async () => {
    const res = await axiosClient.get(`/order/cancelled`);
    return res.data;
  },

  /** Lấy đơn hàng theo số điện thoại người nhận */
  getOrdersByPhone: async (phone) => {
    const res = await axiosClient.get(`/order/by-phone/${phone}`);
    return res.data;
  },

  /** Lấy đơn hàng theo mã đơn (by-code) - thường dùng để tìm kiếm nhanh */
  getOrderByMaDon: async (maDon) => {
    const res = await axiosClient.get(`/order/by-code/${maDon}`);
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
  softDelete: async (maDH) => {
    const res = await axiosClient.delete(`/admin/order/${maDH}`);
    return res.data;
  },
  getorderhiden: async () =>{
    const res = await axiosClient.get(`/admin/order/SoftDelete/`);
    return res.data;
  },
  getBySoDienThoai: async (soDienThoai) => {
    const res = await axiosClient.get(
      `/admin/order/So-Dien-Thoai/${soDienThoai}`,
    );
    return res.data;
  },

  updateStatus: async (maDonHang, status) => {
    const res = await axiosClient.put(`/admin/order/${maDonHang}`, status);
    return res.data;
  },

  updateInfo: async (maDonHang, data) => {
    const res = await axiosClient.put(
      `/admin/order/Admin-Cap-nhat-thong-tin/${maDonHang}`,
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
