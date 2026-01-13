import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthProvider";
import { useToast } from "../../../contexts/ToastContext";
import { useState } from "react";

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const matKhau = formData.get("matKhau");

    if (!email || !matKhau || email.trim() === "") {
      setErrorMessage("Vui lòng nhập Email và Mật khẩu.");
      return;
    }

    try {
      const result = await login(email, matKhau);
      if (result.success) {
        showToast("Đăng nhập thành công", "success");
        navigate("/");
      } else {
        setErrorMessage(
          result.message || "Đăng nhập thất bại. Vui lòng thử lại."
        );
      }
    } catch (err) {
      console.log(err)
      setErrorMessage("Lỗi kết nối mạng. Vui lòng kiểm tra console.");
    }
  };

  return (
    // THÊM 'py-12' VÀO DÒNG DƯỚI ĐÂY ĐỂ TẠO KHOẢNG CÁCH TRÊN DƯỚI
    <div className="flex items-center justify-center px-4 py-12"> 
      
      {/* Container chính: Card đổ bóng, bo góc */}
      <div className="flex bg-white shadow-lg rounded-2xl overflow-hidden max-w-4xl w-full">
        
        {/* Cột trái: Ảnh (Ẩn trên mobile) */}
        <div className="hidden md:flex w-1/2 bg-gray-100 items-center justify-center p-8">
          <img
            className="w-full max-w-xs object-contain mix-blend-multiply"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3Mclb0NdAfReSwkqWDtxIh2Oc4vEyPMYzeg&s"
            alt="Login Illustration"
          />
        </div>

        {/* Cột phải: Form đăng nhập */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-[#2f9ea0] text-center mb-2">
            CHÀO MỪNG TRỞ LẠI !
          </h2>
          <p className="text-stone-400 text-center mb-6">Đăng nhập để tiếp tục</p>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center text-sm">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-stone-600 font-medium mb-1">Email</label>
              <input
                type="text"
                name="email"
                className="p-3 border-2 rounded-xl w-full border-stone-300 focus:outline-none focus:border-[#2f9ea0] transition-colors"
                placeholder="Example@gmail.com"
              />
            </div>

            <div>
              <label className="block text-stone-600 font-medium mb-1">Mật khẩu</label>
              <input
                type="password"
                name="matKhau"
                className="p-3 border-2 rounded-xl w-full border-stone-300 focus:outline-none focus:border-[#2f9ea0] transition-colors"
                placeholder="Nhập mật khẩu"
              />
            </div>

            <div className="text-right">
              <Link
                className="text-sm text-stone-500 hover:text-[#2f9ea0]"
                to="/quen-mat-khau" // Nhớ kiểm tra lại đường dẫn này trong App.jsx của bạn nhé
              >
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full p-3 text-white font-bold rounded-xl bg-[#2f9ea0] hover:bg-teal-600 transition duration-300 shadow-md mt-2"
            >
              ĐĂNG NHẬP
            </button>
          </form>

          <p className="mt-6 text-center text-stone-500">
            Bạn là người mới?{" "}
            <Link className="text-[#2f9ea0] font-bold hover:underline" to="/dang-ky">
              ĐĂNG KÝ NGAY
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}