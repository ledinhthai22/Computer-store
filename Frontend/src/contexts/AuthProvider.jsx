import { createContext, useState, useContext } from "react";
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
      const response = await axiosClient.post("/auth/register", {
        hoTen,
        email,
        soDienThoai,
        matKhau,
        xacNhanMatKhau,
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
      const errorData = error.response?.data;

      if (errorData?.errors) {
        const firstErrorKey = Object.keys(errorData.errors)[0];
        const firstErrorMessage = errorData.errors[firstErrorKey][0];
        return { success: false, message: firstErrorMessage };
      }

      return { success: false, message: errorData?.message || "Đăng ký thất bại" };
    }
  };

  const logout = async () => {
    try {
      await axiosClient.post("/auth/logout");
    } catch (error) {
      console.error("Lỗi khi gọi API logout:", error);
    } finally {
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);