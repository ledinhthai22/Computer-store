import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
       localStorage.removeItem('user');
       window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;