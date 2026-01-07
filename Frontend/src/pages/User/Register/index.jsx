import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthProvider";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    hoTen: "",
    email: "",
    soDienThoai: "",
    matKhau: "",
    xacNhanMatKhau: ""
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

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
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    
    if (!formData.matKhau) {
      newErrors.matKhau = "Mật khẩu không được để trống";
    } else if (formData.matKhau.length < 8) {
      newErrors.matKhau = "Mật khẩu phải từ 8 ký tự trở lên";
    } else if (!passwordRegex.test(formData.matKhau)) {
      newErrors.matKhau = "Mật khẩu phải chứa: Chữ hoa, thường, số và ký tự đặc biệt (@$!%*?&)";
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

    const result = await register(
        formData.hoTen, 
        formData.email, 
        formData.matKhau, 
        formData.soDienThoai,
        formData.xacNhanMatKhau
    );

    if (result.success) {
      alert("Đăng ký thành công! Bạn đã được tự động đăng nhập.");
      navigate("/"); 
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex bg-white shadow-lg rounded-2xl overflow-hidden max-w-5xl w-full m-8">
        <div className="hidden md:block w-1/2 bg-gray-100 flex items-center justify-center p-8">
          <img className="w-full max-w-sm object-contain" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3Mclb0NdAfReSwkqWDtxIh2Oc4vEyPMYzeg&s" alt="Register" />
        </div>
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-[#2f9ea0]">ĐĂNG KÝ TÀI KHOẢN</h2>
          
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center text-sm">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleRegister} className="mt-6">
            <div className="mb-4">
               <label className="block text-stone-600 font-medium mb-1">Họ và tên</label>
               <input type="text" name="hoTen" value={formData.hoTen} onChange={handleChange} className={`p-2 border-2 rounded-xl w-full focus:outline-none ${errors.hoTen ? "border-red-500" : "border-stone-300 focus:border-[#2f9ea0]"}`} placeholder="Nguyễn Văn A" />
               {errors.hoTen && <p className="text-red-500 text-sm mt-1">{errors.hoTen}</p>}
            </div>

            <div className="mb-4">
               <label className="block text-stone-600 font-medium mb-1">Email</label>
               <input type="text" name="email" value={formData.email} onChange={handleChange} className={`p-2 border-2 rounded-xl w-full focus:outline-none ${errors.email ? "border-red-500" : "border-stone-300 focus:border-[#2f9ea0]"}`} placeholder="Example@gmail.com" />
               {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="mb-4">
               <label className="block text-stone-600 font-medium mb-1">Số điện thoại</label>
               <input type="text" name="soDienThoai" value={formData.soDienThoai} onChange={handleChange} className={`p-2 border-2 rounded-xl w-full focus:outline-none ${errors.soDienThoai ? "border-red-500" : "border-stone-300 focus:border-[#2f9ea0]"}`} placeholder="0901234567" />
               {errors.soDienThoai && <p className="text-red-500 text-sm mt-1">{errors.soDienThoai}</p>}
            </div>

            <div className="mb-4">
               <label className="block text-stone-600 font-medium mb-1">Mật khẩu</label>
               <input type="password" name="matKhau" value={formData.matKhau} onChange={handleChange} className={`p-2 border-2 rounded-xl w-full focus:outline-none ${errors.matKhau ? "border-red-500" : "border-stone-300 focus:border-[#2f9ea0]"}`} placeholder="Mật khẩu" />
               {errors.matKhau && <p className="text-red-500 text-sm mt-1">{errors.matKhau}</p>}
            </div>

            <div className="mb-6">
               <label className="block text-stone-600 font-medium mb-1">Xác nhận mật khẩu</label>
               <input type="password" name="xacNhanMatKhau" value={formData.xacNhanMatKhau} onChange={handleChange} className={`p-2 border-2 rounded-xl w-full focus:outline-none ${errors.xacNhanMatKhau ? "border-red-500" : "border-stone-300 focus:border-[#2f9ea0]"}`} placeholder="Nhập lại mật khẩu" />
               {errors.xacNhanMatKhau && <p className="text-red-500 text-sm mt-1">{errors.xacNhanMatKhau}</p>}
            </div>

            <button type="submit" className="w-full p-3 text-stone-50 font-bold rounded-xl bg-[#2f9ea0] hover:bg-blue-600 transition duration-300">ĐĂNG KÝ</button>
          </form>
          <p className="mt-4 text-center text-stone-400">Bạn đã có tài khoản? <Link className="text-[#2f9ea0] font-bold" to="/login"> ĐĂNG NHẬP</Link></p>
        </div>
      </div>
    </div>
  );
}