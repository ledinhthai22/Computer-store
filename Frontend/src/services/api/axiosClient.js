import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://localhost:7012/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosClient.interceptors.response.use(
  (response) => response,

  (error) => {
    const { response, config } = error;

<<<<<<< HEAD
    if (response?.status === 403 || response?.status === 401) {  // Thêm 401 nếu cần
      const noRedirectUrls = [
        '/auth/login',
        '/auth/register',
        '/auth/refresh-token',
        '/me/ChangePassword',
        '/'                     // ← Thêm trang chủ
      ];

      const isNoRedirect = noRedirectUrls.some(url => 
        config.url.includes(url) || config.url === url || config.url === '' // trường hợp url rỗng
      );

      if (!isNoRedirect) {
        console.warn("Phiên hết hạn → đăng xuất và redirect về trang chủ");
        localStorage.removeItem('user');
        window.location.href = '/'; // hoặc '/login' nếu bạn có trang login riêng
=======
    if (response && response.status === 403) {
      const noRedirectUrls = [
        "/auth/login",
        "/auth/register",
        "/auth/refresh-token",
        "/me/ChangePassword",
      ];

      const isAuthApi = noRedirectUrls.some((url) => config.url.includes(url));

      if (!isAuthApi) {
        localStorage.removeItem("user");
        window.location.href = "/";
>>>>>>> f7611952f99233a8eae0eb0c96448d10fb00497f
      }
      // Không reject tiếp ở đây nếu là refresh-token → để catch block xử lý
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
