import { createContext, useState, useContext, useEffect, useCallback } from "react";
import axiosClient from "../services/api/axiosClient"; 

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {  
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email, matKhau) => {
    try {
      const response = await axiosClient.post("/auth/login", { 
        email, 
        matKhau 
      });

      const data = response.data;
      
      const userData = {
        hoTen: data.hoTen,
        vaiTro: data.vaiTro,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.";
      return { success: false, message: message };
    }
  };

  const register = async (hoTen, email, matKhau, soDienThoai, xacNhanMatKhau) => {
    try {
      await axiosClient.post("/auth/register", {
        hoTen,
        email,
        soDienThoai,
        matKhau,
        xacNhanMatKhau,
      });

      const loginResult = await login(email, matKhau);
      
      if (loginResult.success) {
         return { success: true };
      } else {
         return { success: false, message: "Đăng ký thành công nhưng tự động đăng nhập thất bại." };
      }

    } catch (error) {
      const errorData = error.response?.data;

      if (errorData?.errors) {
        const firstErrorKey = Object.keys(errorData.errors)[0];
        const firstErrorMessage = errorData.errors[firstErrorKey][0];
        return { success: false, message: firstErrorMessage };
      }

      return { success: false, message: errorData?.message || "Đăng ký thất bại" };
    }
  };

  const logout = useCallback(async () => {
    try {
      await axiosClient.post("/auth/logout");
    } catch (error) {
      console.error("Lỗi khi gọi API logout:", error);
    } finally {
      localStorage.removeItem("user");
      setUser(null);
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const verifySession = async () => {
      try {
        // Gọi API để gia hạn token (Refresh Token gửi qua Cookie)
        await axiosClient.post("/auth/refresh-token");
        console.log("Phiên đăng nhập hợp lệ. Đã gia hạn token.");
      } catch (error) {
        // Nếu lỗi (401/403) nghĩa là Refresh Token cũng đã hết hạn (do tắt máy quá lâu)
        console.warn("Phiên đăng nhập đã hết hạn. Đang đăng xuất...");
        await logout(); // Tự động đăng xuất
      }
    };

    // 1. Kiểm tra ngay lập tức khi vừa vào trang (Load/Reload)
    verifySession();

    // 2. Thiết lập timer: Gọi định kỳ mỗi 50 phút
    const intervalId = setInterval(verifySession, 50 * 60 * 1000);

    // Dọn dẹp timer khi unmount
    return () => clearInterval(intervalId);
  }, [user, logout]);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);