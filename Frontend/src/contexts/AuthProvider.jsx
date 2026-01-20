import { createContext, useState, useContext, useEffect, useCallback } from "react";
import SessionLoading from "../components/user/ui/SessionLoading";
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
        maNguoiDung: data.maNguoiDung,
        hoTen: data.hoTen,
        email: data.email,
        vaiTro: data.vaiTro,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      if (data.vaiTro === "QuanTriVien") {
        window.location.href = "/quan-ly/thong-ke";
      }
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.";
      return { success: false, message: message };
    }
  };

  const register = async (data) => {
    try {
      await axiosClient.post("/auth/register", data);

      const loginResult = await login(data.email, data.matKhau);

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
      window.location.href = "/";
    }
  }, []);

  // Trong AuthProvider
  const [isCheckingSession, setIsCheckingSession] = useState(!!user); // true nếu có user

  useEffect(() => {
    if (!user) {
      setIsCheckingSession(false);
      return;
    }

    const checkSession = async () => {
      try {
        await axiosClient.post("/auth/refresh-token");
      } catch (err) {
        // Không redirect ở đây, để interceptor lo
        await logout();
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();

    const interval = setInterval(() => {
      axiosClient.post("/auth/refresh-token").catch(() => logout());
    }, 50 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, logout]);

  // // Trong render
  // if (isCheckingSession) {
  //   return <SessionLoading />;
  // }
  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);