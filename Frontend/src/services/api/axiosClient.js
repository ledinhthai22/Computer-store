import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://localhost:7012/api', 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response, config } = error;

    if (response && response.status === 403) {

      const noRedirectUrls = [
        '/auth/login', 
        '/auth/register', 
        '/auth/refresh-token',
        '/me/ChangePassword'
      ];

      const isAuthApi = noRedirectUrls.some(url => config.url.includes(url));

      if (!isAuthApi) {
        localStorage.removeItem('user');
        window.location.href = '/dang-nhap';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
