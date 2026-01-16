import { useState } from "react";
import axiosClient from "../../../services/api/axiosClient";
import { useToast } from "../../../contexts/ToastContext";

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  // Kiểm tra nếu ngày không hợp lệ
  if (isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  // Tháng trong JS bắt đầu từ 0 nên phải +1
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  // Trả về định dạng chuẩn cho thẻ input type="date": YYYY-MM-DD
  return `${year}-${month}-${day}`;
};

export default function UpdateProfileModal({ onClose, user }) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    hoTen: user?.hoTen || "",
    gioiTinh: user?.gioiTinh === false ? "Nam" : "Nữ" || "",
    ngaySinh: formatDateForInput(user?.ngaySinh) || "",
    email: user?.email || "",
    soDienThoai: user?.soDienThoai || "",
    // matKhau: "", 
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 2. Tạo payload gửi đi
      const payload = {
        hoTen: formData.hoTen,
        email: formData.email,
        soDienThoai: formData.soDienThoai,
        // matKhau: formData.matKhau,
        ngaySinh: formData.ngaySinh,
        gioiTinh: formData.gioiTinh === "Nam" ? false : true,
        maVaiTro: user.maVaiTro || 1
      };

      console.log("Payload gửi đi:", payload); 

      await axiosClient.put("/me", payload, {
      });
      
      showToast("Cập nhật thông tin thành công!", "success");
      setTimeout(() => {
        window.location.reload();
      }, 1000); 
      onClose();
    } catch (error) {
      // console.error("Lỗi chi tiết:", error.response?.data);
      // if (error.response?.data?.errors?.MatKhau) {
      //    alert("Lỗi: " + error.response.data.errors.MatKhau[0]);
      // } else {
         showToast("Cập nhật thông tin thất bại. Vui lòng thử lại.", "error");
      // }
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
          <div>
            <label className="text-sm font-medium text-gray-700">Họ tên</label>
            <input
              name="hoTen"
              value={formData.hoTen}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-200 rounded-xl mt-1"
              placeholder="Họ tên"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-200 rounded-xl mt-1 bg-stone-200"
              title="Bạn không thể chỉnh sửa email"
              readOnly
            />
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
            <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
            <input
              name="soDienThoai"
              value={formData.soDienThoai}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-200 rounded-xl mt-1"
              placeholder="Số điện thoại"
            />
          </div>

          {/* <div>
            <label className="text-sm font-bold text-red-500">
              Xác nhận mật khẩu <span className="text-red-600">*</span>
            </label>
            <input
              name="matKhau"
              type="password"
              value={formData.matKhau}
              onChange={handleChange}
              className="w-full p-3 border-2 border-red-200 bg-red-50 rounded-xl mt-1 focus:border-red-500 focus:outline-none"
              placeholder="Nhập mật khẩu hiện tại để lưu"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Bạn cần nhập mật khẩu hiện tại để xác nhận thay đổi.
            </p>
          </div> */}

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 p-3 bg-[#2f9ea0] text-white rounded-xl font-bold hover:bg-teal-600 transition disabled:bg-gray-400"
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 p-3 border rounded-xl hover:bg-gray-50 transition"
            >
              Huỷ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}