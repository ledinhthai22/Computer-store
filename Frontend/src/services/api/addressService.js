import axios from 'axios';

const API_BASE_URL = '/api/delivery-address';

const addressService = {

  getProvinces: async (withWards = true) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/provinces`, {
        params: { withWards },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi lấy provinces:', error);
      throw error.response?.data?.message || 'Không tải được danh sách tỉnh/thành';
    }
  },

  // Lấy danh sách địa chỉ của user
  getUserAddresses: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user-addresses`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('Lỗi lấy địa chỉ:', error);
      throw error.response?.data?.message || 'Không tải được danh sách địa chỉ';
    }
  },

  // Thêm địa chỉ mới
  createAddress: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user-addresses`, data, { withCredentials: true });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Thêm địa chỉ thất bại';
    }
  },

  // Cập nhật địa chỉ
  updateAddress: async (id, data) => {
    try {
      await axios.put(`${API_BASE_URL}/user-addresses/${id}`, data, { withCredentials: true });
      return true;
    } catch (error) {
      throw error.response?.data?.message || 'Cập nhật địa chỉ thất bại';
    }
  },

  // Xóa địa chỉ
  deleteAddress: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/user-addresses/${id}`, { withCredentials: true });
      return true;
    } catch (error) {
      throw error.response?.data?.message || 'Xóa địa chỉ thất bại';
    }
  },

  // Đặt làm mặc định
  setDefaultAddress: async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/user-addresses/${id}/default`, {}, { withCredentials: true });
      return true;
    } catch (error) {
      throw error.response?.data?.message || 'Đặt mặc định thất bại';
    }
  },
};

export default addressService;