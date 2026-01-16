/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthProvider";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    hoTen: "",
    email: "",
    ngaySinh: "",
    gioiTinh: true, // Boolean true = Nam
    soDienThoai: "",
    matKhau: "",
    xacNhanMatKhau: "",
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Chuyển đổi giới tính sang bool, các trường khác giữ nguyên string
    const finalValue = name === "gioiTinh" ? value === "true" : value;

    setFormData({ ...formData, [name]: finalValue });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
    if (errorMessage) setErrorMessage("");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.hoTen.trim()) newErrors.hoTen = "Họ tên không được để trống";
    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không đúng định dạng";
    }
    if (!formData.soDienThoai.trim()) {
      newErrors.soDienThoai = "Số điện thoại không được để trống";
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!formData.matKhau || formData.matKhau.length < 8 || !passwordRegex.test(formData.matKhau)) {
      newErrors.matKhau = "Mật khẩu không đủ mạnh (8 ký tự, có hoa, thường, số, ký tự đặc biệt)";
    }
    if (formData.matKhau !== formData.xacNhanMatKhau) {
      newErrors.xacNhanMatKhau = "Mật khẩu xác nhận không khớp";
    }
    return newErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      // GỬI TRỰC TIẾP formData, KHÔNG BỌC TRONG "request"
      // Backend .NET sẽ tự map camelCase (hoTen) sang PascalCase (HoTen)
      const result = await register(formData);

      if (result.success) {
        alert("Đăng ký thành công!");
        navigate("/dang-nhap");
      } else {
        setErrorMessage(result.message || "Đăng ký thất bại.");
      }
    } catch (error) {
      setErrorMessage("Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-8">
      <div className="flex bg-white shadow-xl rounded-2xl overflow-hidden max-w-5xl w-full">
        <div className="hidden md:flex w-1/2 bg-gray-100 items-center justify-center p-8">
          <img
            className="w-full max-w-sm object-contain mix-blend-multiply"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3Mclb0NdAfReSwkqWDtxIh2Oc4vEyPMYzeg&s"
            alt="Register"
          />
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-[#2f9ea0] text-center mb-6">ĐĂNG KÝ</h2>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div>
              <label className="block text-stone-600 font-medium mb-1">Họ và tên</label>
              <input
                type="text"
                name="hoTen"
                value={formData.hoTen}
                onChange={handleChange}
                className={`p-3 border-2 rounded-xl w-full focus:outline-none ${errors.hoTen ? "border-red-500" : "border-stone-300 focus:border-[#2f9ea0]"}`}
                placeholder="Nguyễn Văn A"
              />
              {errors.hoTen && <p className="text-red-500 text-sm mt-1">{errors.hoTen}</p>}
            </div>

            <div>
              <label className="block text-stone-600 font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`p-3 border-2 rounded-xl w-full focus:outline-none ${errors.email ? "border-red-500" : "border-stone-300 focus:border-[#2f9ea0]"}`}
                placeholder="example@gmail.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Giới tính</label>
              <div className="w-full p-3 border-2 border-gray-200 rounded-xl flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" name="gioiTinh" value="true"
                    checked={formData.gioiTinh === true}
                    onChange={handleChange}
                    className="w-5 h-5 accent-[#2f9ea0]"
                  />
                  <span>Nam</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" name="gioiTinh" value="false"
                    checked={formData.gioiTinh === false}
                    onChange={handleChange}
                    className="w-5 h-5 accent-[#2f9ea0]"
                  />
                  <span>Nữ</span>
                </label>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Ngày Sinh</label>
              <input
                type="date"
                name="ngaySinh"
                value={formData.ngaySinh}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-200 rounded-xl mt-1"
                required
              />
            </div>

            <div>
              <label className="block text-stone-600 font-medium mb-1">Số điện thoại</label>
              <input
                type="text"
                name="soDienThoai"
                value={formData.soDienThoai}
                onChange={handleChange}
                className="p-3 border-2 border-stone-300 rounded-xl w-full"
                placeholder="0901234567"
              />
            </div>

            <div>
              <label className="block text-stone-600 font-medium mb-1">Mật khẩu</label>
              <input
                type="password"
                name="matKhau"
                value={formData.matKhau}
                onChange={handleChange}
                className="p-3 border-2 border-stone-300 rounded-xl w-full"
                placeholder="********"
              />
              {errors.matKhau && <p className="text-red-500 text-sm mt-1">{errors.matKhau}</p>}
            </div>

            <div>
              <label className="block text-stone-600 font-medium mb-1">Xác nhận mật khẩu</label>
              <input
                type="password"
                name="xacNhanMatKhau"
                value={formData.xacNhanMatKhau}
                onChange={handleChange}
                className="p-3 border-2 border-stone-300 rounded-xl w-full"
              />
              {errors.xacNhanMatKhau && <p className="text-red-500 text-sm mt-1">{errors.xacNhanMatKhau}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 mt-4 text-white font-bold rounded-xl ${loading ? "bg-gray-400" : "bg-[#2f9ea0] hover:bg-teal-600"}`}
            >
              {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG KÝ"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}