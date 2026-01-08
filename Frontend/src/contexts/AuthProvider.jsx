import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email, matKhau) => {
    try {
      const response = await fetch("https://localhost:7012/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, matKhau }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng nhập thất bại");
      }

      const userData = {
        hoTen: data.hoTen,
        vaiTro: data.vaiTro,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async (hoTen, email, matKhau, soDienThoai, xacNhanMatKhau) => {
    try {
      const response = await fetch("https://localhost:7012/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          hoTen,
          email,
          soDienThoai,
          matKhau,
          xacNhanMatKhau,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const firstErrorKey = Object.keys(data.errors)[0];
          throw new Error(data.errors[firstErrorKey][0]);
        }
        throw new Error(data.message || "Đăng ký thất bại");
      }

      const userData = {
        hoTen: data.hoTen,
        vaiTro: data.vaiTro,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    await fetch("https://localhost:7012/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
