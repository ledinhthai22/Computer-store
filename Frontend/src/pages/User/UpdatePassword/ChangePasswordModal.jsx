import { useState } from "react";
import axiosClient from "../../../services/api/axiosClient";

export default function ChangePasswordModal({ onClose }) {
  const [loading, setLoading] = useState(false);
  
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 1. Thêm state lưu lỗi
  const [errors, setErrors] = useState({});

  // 2. Thêm Regex chuẩn giống trang Register
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value,
    });

    // Xóa lỗi khi người dùng bắt đầu gõ lại
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // 3. Hàm validate chi tiết
  const validateForm = () => {
    const newErrors = {};

    // Validate Mật khẩu cũ
    if (!passwords.oldPassword) {
      newErrors.oldPassword = "Mật khẩu cũ không được để trống";
    }

    // Validate Mật khẩu mới
    if (!passwords.newPassword) {
      newErrors.newPassword = "Mật khẩu mới không được để trống";
    } else if (!passwordRegex.test(passwords.newPassword)) {
      newErrors.newPassword = "Mật khẩu không đủ mạnh (8 ký tự, có hoa, thường, số, ký tự đặc biệt)";
    }

    // Validate trùng mật khẩu cũ
    if (passwords.newPassword && passwords.newPassword === passwords.oldPassword) {
      newErrors.newPassword = "Mật khẩu mới không được trùng với mật khẩu cũ";
    }

    // Validate Xác nhận mật khẩu
    if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Reset lỗi cũ

    // 4. Kiểm tra validate trước khi gọi API
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        matKhauCu: passwords.oldPassword,
        matKhauMoi: passwords.newPassword,
        xacNhanMatKhau: passwords.confirmPassword
      };

      await axiosClient.put("/me/ChangePassword", payload);

      alert("Đổi mật khẩu thành công!");
      onClose();

    } catch (error) {
      console.error("Lỗi đổi pass:", error);

      const errorData = error.response?.data;
      let errorMsg = "Đổi mật khẩu thất bại. Vui lòng thử lại.";

      if (typeof errorData === 'string') {
          errorMsg = errorData;
      } else if (errorData?.message) {
          errorMsg = errorData.message;
      } else if (errorData?.title) {
          errorMsg = errorData.title;
      }

      if (errorMsg.toLowerCase().includes("mật khẩu cũ") || errorMsg.toLowerCase().includes("incorrect")) {
        setErrors({ oldPassword: errorMsg });
      } else {
        alert("Lỗi: " + errorMsg);
      }
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-[#2f9ea0] mb-6 text-center">
          Đổi mật khẩu
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mật khẩu cũ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu cũ</label>
            <input
              type="password"
              name="oldPassword"
              value={passwords.oldPassword}
              onChange={handleChange}
              // Cập nhật class để hiện viền đỏ khi có lỗi
              className={`w-full p-3 border rounded-lg outline-none ${
                errors.oldPassword 
                  ? "border-red-500 focus:ring-2 focus:ring-red-200" 
                  : "border-gray-300 focus:ring-2 focus:ring-[#2f9ea0]"
              }`}
              placeholder="Nhập mật khẩu hiện tại"
            />
            {/* Hiển thị lỗi ngay dưới input */}
            {errors.oldPassword && <p className="text-red-500 text-xs mt-1">{errors.oldPassword}</p>}
          </div>

          {/* Mật khẩu mới */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg outline-none ${
                errors.newPassword 
                  ? "border-red-500 focus:ring-2 focus:ring-red-200" 
                  : "border-gray-300 focus:ring-2 focus:ring-[#2f9ea0]"
              }`}
              placeholder="Nhập mật khẩu mới (min 8 ký tự, hoa, thường, số, k.tự đặc biệt)"
            />
            {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
          </div>

          {/* Xác nhận mật khẩu mới */}
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg outline-none ${
                errors.confirmPassword
                  ? "border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:ring-2 focus:ring-[#2f9ea0]"
              }`}
              placeholder="Nhập lại mật khẩu mới"
            />
             {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <div className="flex gap-3 mt-6 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 p-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Huỷ bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 p-3 bg-[#2f9ea0] text-white rounded-lg font-bold hover:bg-teal-700 transition disabled:bg-gray-400 shadow-md"
            >
              {loading ? "Đang xử lý..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}