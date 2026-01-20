import { useState } from "react";
import axiosClient from "../../../services/api/axiosClient";
import { useToast } from "../../../contexts/ToastContext";

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

export default function UpdateProfileModal({ onClose, user }) {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    hoTen: user?.hoTen || "",
    gioiTinh: user?.gioiTinh ? "Nam" : "Nữ",
    ngaySinh: formatDateForInput(user?.ngaySinh),
    email: user?.email || "",
    soDienThoai: user?.soDienThoai || "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    let { name, value } = e.target;

    // Họ tên: không số, không ký tự đặc biệt, tối đa 100 ký tự
    if (name === "hoTen") {
      value = value.replace(/[^A-Za-zÀ-ỹ\s]/g, "").slice(0, 100);
    }

    // SĐT: chỉ số, tối đa 10 ký tự
    if (name === "soDienThoai") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData({ ...formData, [name]: value });

    // clear lỗi realtime
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  /* ================= VALIDATE ================= */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.hoTen.trim()) {
      newErrors.hoTen = "Họ tên không được để trống";
    }

    if (!formData.soDienThoai) {
      newErrors.soDienThoai = "Số điện thoại không được để trống";
    } else if (formData.soDienThoai.length !== 10) {
      newErrors.soDienThoai = "Số điện thoại phải đủ 10 số";
    }

    if (!formData.ngaySinh) {
      newErrors.ngaySinh = "Vui lòng chọn ngày sinh";
    }

    return newErrors;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        hoTen: formData.hoTen,
        email: formData.email,
        soDienThoai: formData.soDienThoai,
        ngaySinh: formData.ngaySinh,
        gioiTinh: formData.gioiTinh === "Nam",
        maVaiTro: user.maVaiTro || 1,
      };

      await axiosClient.put("/me", payload);
      showToast("Cập nhật thông tin thành công!", "success");

      setTimeout(() => window.location.reload(), 800);
      onClose();
    } catch {
      showToast("Cập nhật thông tin thất bại!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-[#2f9ea0] mb-4">
          Cập nhật thông tin
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Họ tên */}
          <div>
            <label className="text-sm font-medium">Họ tên</label>
            <input
              name="hoTen"
              value={formData.hoTen}
              onChange={handleChange}
              maxLength={100}
              className={`w-full p-3 border-2 rounded-xl mt-1 ${
                errors.hoTen ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.hoTen && (
              <p className="text-red-500 text-xs mt-1">{errors.hoTen}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              value={formData.email}
              readOnly
              className="w-full p-3 border-2 border-gray-200 rounded-xl mt-1 bg-stone-200"
            />
          </div>

          {/* Giới tính + Ngày sinh (SIZE BẰNG NHAU) */}
          <div className="flex gap-3">
            <div className="w-1/2">
              <label className="text-sm font-medium block mb-1">Giới tính</label>
              <div className="h-[48px] border-2 border-gray-200 rounded-xl flex items-center gap-5 px-3">
                {["Nam", "Nữ"].map((gt) => (
                  <label key={gt} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gioiTinh"
                      value={gt}
                      checked={formData.gioiTinh === gt}
                      onChange={handleChange}
                      className="accent-[#2f9ea0]"
                    />
                    {gt}
                  </label>
                ))}
              </div>
            </div>

            <div className="w-1/2">
              <label className="text-sm font-medium block mb-1">Ngày sinh</label>
              <input
                type="date"
                name="ngaySinh"
                value={formData.ngaySinh}
                onChange={handleChange}
                onKeyDown={(e) => e.preventDefault()} // không cho gõ
                max={new Date().toISOString().split("T")[0]}
                className={`w-full h-[48px] border-2 rounded-xl px-3 ${
                  errors.ngaySinh ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.ngaySinh && (
                <p className="text-red-500 text-xs mt-1">{errors.ngaySinh}</p>
              )}
            </div>
          </div>

          {/* SĐT */}
          <div>
            <label className="text-sm font-medium">Số điện thoại</label>
            <input
              name="soDienThoai"
              value={formData.soDienThoai}
              onChange={handleChange}
              inputMode="numeric"
              className={`w-full p-3 border-2 rounded-xl mt-1 ${
                errors.soDienThoai ? "border-red-500" : "border-gray-200"
              }`}
              placeholder="10 chữ số"
            />
            {errors.soDienThoai && (
              <p className="text-red-500 text-xs mt-1">
                {errors.soDienThoai}
              </p>
            )}
          </div>

          {/* BUTTON */}
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 p-3 bg-[#2f9ea0] text-white rounded-xl font-bold disabled:bg-gray-400"
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 p-3 border rounded-xl"
            >
              Huỷ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
