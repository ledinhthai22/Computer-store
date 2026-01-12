import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api', 
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

    if (response && response.status === 401) {

      const noRedirectUrls = [
        '/auth/login', 
        '/auth/register', 
        '/auth/refresh-token'
      ];

      const isAuthApi = noRedirectUrls.some(url => config.url.includes(url));

      if (!isAuthApi) {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;