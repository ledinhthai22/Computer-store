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
    gioiTinh: "",
    soDienThoai: "",
    matKhau: "",
    xacNhanMatKhau: "",
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    } else if (!/^[0-9]{10,11}$/.test(formData.soDienThoai)) {
        newErrors.soDienThoai = "Số điện thoại không hợp lệ";
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!formData.matKhau) {
      newErrors.matKhau = "Mật khẩu không được để trống";
    } else if (formData.matKhau.length < 8) {
      newErrors.matKhau = "Mật khẩu phải từ 8 ký tự trở lên";
    } else if (!passwordRegex.test(formData.matKhau)) {
      newErrors.matKhau =
        "Mật khẩu phải chứa: Chữ hoa, thường, số và ký tự đặc biệt (@$!%*?&)";
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
      const result = await register(
        formData.hoTen,
        formData.email,
        formData.ngaySinh,
        formData.gioiTinh,
        formData.matKhau,
        formData.soDienThoai,
        formData.xacNhanMatKhau
      );

      if (result.success) {
        alert("Đăng ký thành công! Bạn đã được tự động đăng nhập.");
        navigate("/");
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
            alt="Register Illustration"
          />
        </div>


        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-[#2f9ea0] text-center mb-6">
            ĐĂNG KÝ TÀI KHOẢN
          </h2>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center text-sm">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            
            <div>
              <label className="block text-stone-600 font-medium mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                name="hoTen"
                value={formData.hoTen}
                onChange={handleChange}
                className={`p-3 border-2 rounded-xl w-full focus:outline-none transition-colors ${
                  errors.hoTen
                    ? "border-red-500 focus:border-red-500"
                    : "border-stone-300 focus:border-[#2f9ea0]"
                }`}
                placeholder="VD: Nguyễn Văn A"
              />
              {errors.hoTen && (
                <p className="text-red-500 text-sm mt-1">{errors.hoTen}</p>
              )}
            </div>

            <div>
              <label className="block text-stone-600 font-medium mb-1">
                Email
              </label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`p-3 border-2 rounded-xl w-full focus:outline-none transition-colors ${
                  errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-stone-300 focus:border-[#2f9ea0]"
                }`}
                placeholder="VD: Example@gmail.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Giới tính</label>
            {/* Wrapper này giả lập style giống hệt thẻ input text */}
            <div className="w-full p-3 border-2 border-gray-200 rounded-xl flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer hover:text-[#2f9ea0] transition-colors">
                    <input 
                        type="radio" 
                        name="gioiTinh" 
                        value="Nam"
                        checked={formData.gioiTinh === "Nam"}
                        onChange={handleChange}
                        className="w-5 h-5 accent-[#2f9ea0] cursor-pointer"
                    />
                    <span className="font-medium">Nam</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer hover:text-[#2f9ea0] transition-colors">
                    <input 
                        type="radio" 
                        name="gioiTinh" 
                        value="Nữ"
                        checked={formData.gioiTinh === "Nữ"}
                        onChange={handleChange}
                        className="w-5 h-5 accent-[#2f9ea0] cursor-pointer"
                    />
                    <span className="font-medium">Nữ</span>
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
                className="w-full p-3 border-2 border-gray-200  rounded-xl mt-1"
                required
              />
          </div>

            <div>
              <label className="block text-stone-600 font-medium mb-1">
                Số điện thoại
              </label>
              <input
                type="text"
                name="soDienThoai"
                value={formData.soDienThoai}
                onChange={handleChange}
                className={`p-3 border-2 rounded-xl w-full focus:outline-none transition-colors ${
                  errors.soDienThoai
                    ? "border-red-500 focus:border-red-500"
                    : "border-stone-300 focus:border-[#2f9ea0]"
                }`}
                placeholder="VD: 0901234567"
              />
              {errors.soDienThoai && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.soDienThoai}
                </p>
              )}
            </div>

            <div>
              <label className="block text-stone-600 font-medium mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                name="matKhau"
                value={formData.matKhau}
                onChange={handleChange}
                className={`p-3 border-2 rounded-xl w-full focus:outline-none transition-colors ${
                  errors.matKhau
                    ? "border-red-500 focus:border-red-500"
                    : "border-stone-300 focus:border-[#2f9ea0]"
                }`}
                placeholder="Mật khẩu (Có hoa, thường, số, ký tự đặc biệt)"
              />
              {errors.matKhau && (
                <p className="text-red-500 text-sm mt-1">{errors.matKhau}</p>
              )}
            </div>

            <div>
              <label className="block text-stone-600 font-medium mb-1">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                name="xacNhanMatKhau"
                value={formData.xacNhanMatKhau}
                onChange={handleChange}
                className={`p-3 border-2 rounded-xl w-full focus:outline-none transition-colors ${
                  errors.xacNhanMatKhau
                    ? "border-red-500 focus:border-red-500"
                    : "border-stone-300 focus:border-[#2f9ea0]"
                }`}
                placeholder="Nhập lại mật khẩu"
              />
              {errors.xacNhanMatKhau && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.xacNhanMatKhau}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 mt-4 text-white font-bold rounded-xl shadow-md transition duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#2f9ea0] hover:bg-teal-600"
              }`}
            >
              {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG KÝ"}
            </button>
          </form>

          <p className="mt-6 text-center text-stone-500">
            Bạn đã có tài khoản?{" "}
            <Link
              className="text-[#2f9ea0] font-bold hover:underline"
              to="/dang-nhap"
            >
              ĐĂNG NHẬP
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}