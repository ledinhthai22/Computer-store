import { useState } from "react";
import { useAuth } from "../../../contexts/AuthProvider"; // Đảm bảo đường dẫn đúng
import { useToast } from "../../../contexts/ToastContext"; // Đảm bảo đường dẫn đúng
import { IoClose } from "react-icons/io5";

export default function LoginModal({ onClose, onSwitchToRegister }) {
  const { login } = useAuth();
  const { showToast } = useToast();
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
        onClose(); // Đóng modal thay vì navigate
      } else {
        setErrorMessage(result.message || "Đăng nhập thất bại.");
      }
    } catch (err) {
      console.log(err);
      setErrorMessage("Lỗi kết nối mạng.");
    }
  };

  return (
    // Overlay nền đen mờ
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
      {/* Modal Container: Chỉ giữ lại form, bỏ ảnh, max-w nhỏ hơn */}
      <div className="relative bg-white shadow-2xl rounded-2xl overflow-hidden w-full max-w-md animate-fade-in">
        
        {/* Nút đóng Modal */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-stone-400 hover:text-red-500 transition-colors"
        >
          <IoClose size={24} />
        </button>

        <div className="p-8 md:p-10">
          <h2 className="text-3xl font-bold text-[#2f9ea0] text-center mb-2">
            ĐĂNG NHẬP
          </h2>
          <p className="text-stone-400 text-center mb-6">Chào mừng bạn trở lại!</p>

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
              <a href="/quen-mat-khau" className="text-sm text-stone-500 hover:text-[#2f9ea0]">
                Quên mật khẩu?
              </a>
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
            <button 
              type="button"
              className="text-[#2f9ea0] font-bold hover:underline" 
              onClick={onSwitchToRegister}
            >
              ĐĂNG KÝ NGAY
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}