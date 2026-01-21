import { useState } from "react";
import axiosClient from "../../../services/api/axiosClient";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useToast } from "../../../contexts/ToastContext";

export default function ChangePasswordModal({ onClose }) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [show, setShow] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState({});

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,50}$/;

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const e = {};
    if (!passwords.oldPassword) e.oldPassword = "Nhập mật khẩu cũ";
    if (!passwordRegex.test(passwords.newPassword))
      e.newPassword = "Mật khẩu 8–50 ký tự, đủ mạnh";
    if (passwords.newPassword === passwords.oldPassword)
      e.newPassword = "Không được trùng mật khẩu cũ";
    if (passwords.newPassword !== passwords.confirmPassword)
      e.confirmPassword = "Xác nhận không khớp";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateForm();
    if (Object.keys(err).length) return setErrors(err);

    setLoading(true);
    try {
      await axiosClient.put("/me/ChangePassword", {
        matKhauCu: passwords.oldPassword,
        matKhauMoi: passwords.newPassword,
        xacNhanMatKhau: passwords.confirmPassword,
      });
      showToast("Đổi mật khẩu thành công!", "success");
      onClose();
    } catch {
      showToast("Đổi mật khẩu thất bại. Vui lòng thử lại.", "error");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label, name, showKey) => (
    <div className="relative">
      <label className="text-sm font-medium block mb-1">{label}</label>
      <input
        type={show[showKey] ? "text" : "password"}
        name={name}
        value={passwords[name]}
        onChange={handleChange}
        maxLength={50}
        className={`w-full p-3 border rounded-lg ${
          errors[name] ? "border-red-500" : "border-gray-300"
        }`}
      />
      <button
        type="button"
        onClick={() => setShow({ ...show, [showKey]: !show[showKey] })}
        className="absolute right-3 top-9 text-gray-500"
      >
        {show[showKey] ? <IoEyeOff /> : <IoEye />}
      </button>
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-[#2f9ea0] mb-6 text-center">
          Đổi mật khẩu
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {renderInput("Mật khẩu cũ", "oldPassword", "old")}
          {renderInput("Mật khẩu mới", "newPassword", "new")}
          {renderInput("Xác nhận mật khẩu", "confirmPassword", "confirm")}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 p-3 border rounded-lg"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 p-3 bg-[#2f9ea0] text-white rounded-lg font-bold"
            >
              {loading ? "Đang xử lý..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
