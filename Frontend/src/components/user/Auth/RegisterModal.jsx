import { useState } from "react";
import { useAuth } from "../../../contexts/AuthProvider";
import { IoClose, IoEye, IoEyeOff } from "react-icons/io5";
import { useToast } from "../../../contexts/ToastContext";

export default function RegisterModal({ onClose, onSwitchToLogin }) {
  const { register } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    hoTen: "",
    email: "",
    ngaySinh: "",
    gioiTinh: true,
    soDienThoai: "",
    matKhau: "",
    xacNhanMatKhau: "",
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Hiển thị / ẩn mật khẩu
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    let { name, value } = e.target;

    // Giới tính
    if (name === "gioiTinh") {
      value = value === "true";
    }

    // Họ tên: chỉ chữ + khoảng trắng
    if (name === "hoTen") {
      value = value.replace(/[^A-Za-zÀ-ỹ\s]/g, "");
    }

    // Số điện thoại: chỉ số, tối đa 10
    if (name === "soDienThoai") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData({ ...formData, [name]: value });

    if (errors[name]) setErrors({ ...errors, [name]: "" });
    if (errorMessage) setErrorMessage("");
  };

  /* ================= VALIDATE FORM ================= */
  const validateForm = () => {
    const newErrors = {};

    // Họ tên
    const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/;
    if (!formData.hoTen.trim()) {
      newErrors.hoTen = "Họ tên không được để trống";
    } else if (!nameRegex.test(formData.hoTen)) {
      newErrors.hoTen = "Họ tên không được chứa số hoặc ký tự đặc biệt";
    } else if (formData.hoTen.length > 100) {
      newErrors.hoTen = "Họ tên tối đa 100 ký tự";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email sai định dạng";
    }

    // Ngày sinh
    if (!formData.ngaySinh) {
      newErrors.ngaySinh = "Vui lòng chọn ngày sinh";
    }

    // Số điện thoại
    if (!/^\d{10}$/.test(formData.soDienThoai)) {
      newErrors.soDienThoai = "Số điện thoại phải gồm đúng 10 chữ số";
    }

    // Mật khẩu
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,50}$/;
    if (!passwordRegex.test(formData.matKhau)) {
      newErrors.matKhau =
        "Mật khẩu 8–50 ký tự, gồm hoa, thường, số và ký tự đặc biệt";
    }

    // Xác nhận mật khẩu
    if (formData.matKhau !== formData.xacNhanMatKhau) {
      newErrors.xacNhanMatKhau = "Mật khẩu không khớp";
    }

    return newErrors;
  };

  /* ================= HANDLE SUBMIT ================= */
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    setErrorMessage("");

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const result = await register(formData);
      if (result.success) {
        showToast("Đăng ký thành công!", "success");
        onClose();
      } else {
        setErrorMessage(result.message || "Đăng ký thất bại");
      }
    } catch {
      setErrorMessage("Lỗi hệ thống");
    } finally {
      setLoading(false);
    }
  };

  /* ================= STYLE ================= */
  const labelClass = "block text-stone-600 font-bold mb-0.5 text-xs ml-1";
  const inputClass = (hasError) =>
    `w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none transition-colors ${
      hasError
        ? "border-red-500"
        : "border-stone-200 focus:border-[#2f9ea0]"
    }`;

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
      <div className="relative bg-white shadow-2xl rounded-xl w-full max-w-md animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-stone-400 hover:text-red-500 cursor-pointer transition-colors"
        >
          <IoClose size={22} />
        </button>

        <div className="p-5">
          <h2 className="text-2xl font-bold text-[#2f9ea0] text-center mb-4">
            ĐĂNG KÝ
          </h2>

          {errorMessage && (
            <div className="mb-3 p-2 bg-red-100 text-red-700 rounded text-xs text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-2">
            {/* Họ tên */}
            <div>
              <label className={labelClass}>Họ và tên</label>
              <input
                name="hoTen"
                value={formData.hoTen}
                onChange={handleChange}
                maxLength={100}
                className={inputClass(errors.hoTen)}
              />
              {errors.hoTen && (
                <p className="text-red-500 text-[10px]">{errors.hoTen}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className={labelClass}>Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass(errors.email)}
              />
              {errors.email && (
                <p className="text-red-500 text-[10px]">{errors.email}</p>
              )}
            </div>

                      {/* Giới tính & Ngày sinh */}
            <div className="flex flex-row gap-2">
              {/* Giới tính */}
              <div className="w-1/2">
                <label className={labelClass}>Giới tính</label>
                <div className="w-full h-[38px] px-1 border-2 border-stone-200 rounded-lg flex items-center justify-around bg-white">
                  <label className="flex items-center gap-1 cursor-pointer text-xs font-medium text-stone-600">
                    <input
                      type="radio"
                      name="gioiTinh"
                      value="true"
                      checked={formData.gioiTinh === true}
                      onChange={handleChange}
                      className="w-3.5 h-3.5 accent-[#2f9ea0] cursor-pointer"
                    />
                    Nam
                  </label>

                  <label className="flex items-center gap-1 cursor-pointer text-xs font-medium text-stone-600">
                    <input
                      type="radio"
                      name="gioiTinh"
                      value="false"
                      checked={formData.gioiTinh === false}
                      onChange={handleChange}
                      className="w-3.5 h-3.5 accent-[#2f9ea0] cursor-pointer"
                    />
                    Nữ
                  </label>
                </div>
              </div>

              {/* Ngày sinh */}
              <div className="w-1/2">
                <label className={labelClass}>Ngày sinh</label>
                <input
                  type="date"
                  name="ngaySinh"
                  value={formData.ngaySinh}
                  onChange={handleChange}
                  onKeyDown={(e) => e.preventDefault()}
                  max={new Date().toISOString().split("T")[0]}
                  className={`${inputClass(errors.ngaySinh)} h-[38px] cursor-pointer`}
                />
              </div>
            </div>

            {/* Số điện thoại */}
            <div>
              <label className={labelClass}>Số điện thoại</label>
              <input
                name="soDienThoai"
                value={formData.soDienThoai}
                onChange={handleChange}
                className={inputClass(errors.soDienThoai)}
              />
              {errors.soDienThoai && (
                <p className="text-red-500 text-[10px]">
                  {errors.soDienThoai}
                </p>
              )}
            </div>

            {/* Mật khẩu */}
            <div className="relative">
              <label className={labelClass}>Mật khẩu</label>
              <input
                type={showPassword ? "text" : "password"}
                name="matKhau"
                value={formData.matKhau}
                onChange={handleChange}
                maxLength={50}
                className={inputClass(errors.matKhau)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-stone-500 cursor-pointer hover:text-[#2f9ea0]"
              >
                {showPassword ? <IoEyeOff /> : <IoEye />}
              </button>
            </div>

            {/* Xác nhận mật khẩu */}
            <div className="relative">
              <label className={labelClass}>Xác nhận mật khẩu</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="xacNhanMatKhau"
                value={formData.xacNhanMatKhau}
                onChange={handleChange}
                className={inputClass(errors.xacNhanMatKhau)}
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-8 text-stone-500 cursor-pointer hover:text-[#2f9ea0]"
              >
                {showConfirmPassword ? <IoEyeOff /> : <IoEye />}
              </button>
            </div>

            {(errors.matKhau || errors.xacNhanMatKhau) && (
              <p className="text-red-500 text-[10px]">
                {errors.matKhau || errors.xacNhanMatKhau}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`mt-2 py-2 text-white rounded-lg font-bold cursor-pointer ${
                loading
                  ? "bg-gray-400"
                  : "bg-[#2f9ea0] hover:bg-teal-600"
              }`}
            >
              {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG KÝ"}
            </button>
          </form>

          <div className="mt-3 text-center text-xs">
            Đã có tài khoản?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-[#2f9ea0] font-bold cursor-pointer hover:underline"
            >
              ĐĂNG NHẬP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
