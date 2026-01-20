import { useState } from "react";
import { useAuth } from "../../../contexts/AuthProvider";
import { useToast } from "../../../contexts/ToastContext";
import { IoClose, IoEye, IoEyeOff } from "react-icons/io5";

export default function LoginModal({ onClose, onSwitchToRegister }) {
  const { login } = useAuth();
  const { showToast } = useToast();

  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const formData = new FormData(event.target);
    const email = formData.get("email")?.trim();
    const matKhau = formData.get("matKhau");

    if (!email || !matKhau) {
      setErrorMessage("Vui lòng nhập Email và Mật khẩu.");
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, matKhau);
      if (result.success) {
        showToast("Đăng nhập thành công", "success");
        onClose();
      } else {
        setErrorMessage(result.message || "Đăng nhập thất bại.");
      }
    } catch (err) {
      setErrorMessage("Lỗi kết nối mạng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
      <div className="relative bg-white shadow-2xl rounded-2xl w-full max-w-md animate-fade-in">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
        >
          <IoClose size={24} />
        </button>

        <div className="p-8 md:p-10">
          <h2 className="text-3xl font-bold text-[#2f9ea0] text-center mb-2">
            ĐĂNG NHẬP
          </h2>
          <p className="text-stone-400 text-center mb-6">
            Chào mừng bạn trở lại!
          </p>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded text-center text-sm">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Email */}
            <div>
              <label className="block text-stone-600 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="example@gmail.com"
                className="p-3 border-2 rounded-xl w-full border-stone-300 focus:outline-none focus:border-[#2f9ea0] transition-colors"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-stone-600 font-medium mb-1">
                Mật khẩu
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="matKhau"
                  placeholder="Nhập mật khẩu"
                  className="p-3 pr-12 border-2 rounded-xl w-full border-stone-300 focus:outline-none focus:border-[#2f9ea0] transition-colors"
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#2f9ea0] cursor-pointer"
                >
                  {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <a
                href="/quen-mat-khau"
                className="text-sm text-stone-500 hover:text-[#2f9ea0] cursotr-pointer"
              >
                Quên mật khẩu?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 text-white font-bold rounded-xl transition duration-300 shadow-md mt-2 cursor-pointer
                ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#2f9ea0] hover:bg-teal-600"}`}
            >
              {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP"}
            </button>
          </form>

          <p className="mt-6 text-center text-stone-500">
            Bạn là người mới?{" "}
            <button
              type="button"
              className="text-[#2f9ea0] font-bold hover:underline cursor-pointer"
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
