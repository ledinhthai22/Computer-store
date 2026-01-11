import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {    if (error.response && error.response.status === 401) {
        console.warn("Lỗi 401: Chưa đăng nhập hoặc Token hết hạn");
    }
    return Promise.reject(error);
  }
);

export default axiosClient;