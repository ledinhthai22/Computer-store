import { useState } from "react";
import { useAuth } from "../../../contexts/AuthProvider";
import { IoClose } from "react-icons/io5";

export default function RegisterModal({ onClose, onSwitchToLogin }) {
  const { register } = useAuth();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === "gioiTinh" ? value === "true" : value;
    setFormData({ ...formData, [name]: finalValue });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
    if (errorMessage) setErrorMessage("");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.hoTen.trim()) newErrors.hoTen = "Họ tên trống";
    if (!formData.email.trim()) {
        newErrors.email = "Email trống";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email sai định dạng";
    }
    if (!formData.soDienThoai.trim()) newErrors.soDienThoai = "SĐT trống";
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!formData.matKhau || !passwordRegex.test(formData.matKhau)) {
      newErrors.matKhau = "Mật khẩu yếu (8 ký tự, Hoa, thường, số, đặc biệt)";
    }
    if (formData.matKhau !== formData.xacNhanMatKhau) {
      newErrors.xacNhanMatKhau = "Mật khẩu không khớp";
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
      const result = await register(formData);
      if (result.success) {
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        onSwitchToLogin();
      } else {
        setErrorMessage(result.message || "Đăng ký thất bại.");
      }
    } catch (error) {
      setErrorMessage("Lỗi hệ thống.");
    } finally {
      setLoading(false);
    }
  };

  // STYLE ĐÃ ĐƯỢC THU NHỎ
  const labelClass = "block text-stone-600 font-bold mb-0.5 text-xs ml-1"; // Label nhỏ hơn
  const inputClass = (hasError) => `w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none transition-colors ${hasError ? "border-red-500" : "border-stone-200 focus:border-[#2f9ea0]"}`; // Input nhỏ hơn (py-2)

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
      {/* Container thu nhỏ max-w-md */}
      <div className="relative bg-white shadow-2xl rounded-xl w-full max-w-md animate-fade-in my-auto">
        
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-stone-400 hover:text-red-500 z-10 transition-colors"
        >
          <IoClose size={22} />
        </button>

        <div className="p-5 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold text-[#2f9ea0] text-center mb-4">ĐĂNG KÝ</h2>

          {errorMessage && (
            <div className="mb-3 p-2 bg-red-100 border border-red-200 text-red-700 rounded text-xs text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-2">
            
            <div>
              <label className={labelClass}>Họ và tên</label>
              <input
                type="text"
                name="hoTen"
                value={formData.hoTen}
                onChange={handleChange}
                className={inputClass(errors.hoTen)}
                placeholder="Nguyễn Văn A"
              />
              {errors.hoTen && <p className="text-red-500 text-[10px] mt-0.5 ml-1">{errors.hoTen}</p>}
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass(errors.email)}
                placeholder="example@gmail.com"
              />
              {errors.email && <p className="text-red-500 text-[10px] mt-0.5 ml-1">{errors.email}</p>}
            </div>

            {/* Giới tính & Ngày sinh */}
            <div className="flex flex-row gap-2">
                <div className="w-1/2">
                    <label className={labelClass}>Giới tính</label>
                    <div className="w-full px-1 py-[7px] border-2 border-stone-200 rounded-lg flex items-center justify-around bg-white">
                        <label className="flex items-center gap-1 cursor-pointer text-xs font-medium text-stone-600">
                            <input 
                                type="radio" 
                                name="gioiTinh" 
                                value="true" 
                                checked={formData.gioiTinh === true} 
                                onChange={handleChange} 
                                className="w-3.5 h-3.5 accent-[#2f9ea0]" 
                            /> Nam
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer text-xs font-medium text-stone-600">
                            <input 
                                type="radio" 
                                name="gioiTinh" 
                                value="false" 
                                checked={formData.gioiTinh === false} 
                                onChange={handleChange} 
                                className="w-3.5 h-3.5 accent-[#2f9ea0]" 
                            /> Nữ
                        </label>
                    </div>
                </div>

                <div className="w-1/2">
                    <label className={labelClass}>Ngày sinh</label>
                     <input
                        type="date"
                        name="ngaySinh"
                        value={formData.ngaySinh}
                        onChange={handleChange}
                        className={`${inputClass(false)} h-[38px]`} 
                        required
                    />
                </div>
            </div>

            <div>
              <label className={labelClass}>Số điện thoại</label>
              <input
                type="text"
                name="soDienThoai"
                value={formData.soDienThoai}
                onChange={handleChange}
                className={inputClass(errors.soDienThoai)}
                placeholder="0901234567"
              />
              {errors.soDienThoai && <p className="text-red-500 text-[10px] mt-0.5 ml-1">{errors.soDienThoai}</p>}
            </div>

            <div className="flex gap-2">
                <div className="w-1/2">
                    <label className={labelClass}>Mật khẩu</label>
                    <input
                        type="password"
                        name="matKhau"
                        value={formData.matKhau}
                        onChange={handleChange}
                        className={inputClass(errors.matKhau)}
                        placeholder="********"
                    />
                </div>
                <div className="w-1/2">
                    <label className={labelClass}>Xác nhận</label>
                    <input
                        type="password"
                        name="xacNhanMatKhau"
                        value={formData.xacNhanMatKhau}
                        onChange={handleChange}
                        className={inputClass(errors.xacNhanMatKhau)}
                        placeholder="********"
                    />
                </div>
            </div>
            {/* Gom lỗi mật khẩu xuống dưới cùng cho gọn */}
            {(errors.matKhau || errors.xacNhanMatKhau) && (
                <p className="text-red-500 text-[10px] ml-1">
                    {errors.matKhau || errors.xacNhanMatKhau}
                </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 mt-2 text-white text-sm font-bold rounded-lg transition-all shadow-sm ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#2f9ea0] hover:bg-teal-600"}`}
            >
              {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG KÝ"}
            </button>
          </form>

          <div className="mt-3 pt-2 border-t border-gray-100 text-center text-stone-500 text-xs">
            Đã có tài khoản?{" "}
            <button 
                type="button"
                className="text-[#2f9ea0] font-bold hover:underline" 
                onClick={onSwitchToLogin}
            >
              ĐĂNG NHẬP
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}