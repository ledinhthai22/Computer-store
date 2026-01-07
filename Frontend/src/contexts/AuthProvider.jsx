import { createContext, useState, useContext , useEffect} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email, matKhau) => {
    try {
      const response = await fetch("https://localhost:7012/api/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          matKhau,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.message || `Login failed with status ${response.status}`);
    }

      const userData = await response.json(); 
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData)); 
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };
  const register = async (hoTen, email, matKhau, soDienThoai, xacNhanMatKhau) => {
    try {
      const response = await fetch("https://localhost:7012/api/Auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hoTen: hoTen,
          email: email,
          soDienThoai: soDienThoai,
          matKhau: matKhau,
          xacNhanMatKhau: xacNhanMatKhau
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

      if (!data.success) {
         throw new Error(data.message);
      }

      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login,register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
