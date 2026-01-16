import { useAuth } from "../../../contexts/AuthProvider";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosClient from "../../../services/api/axiosClient";
import UpdateProfileModal from "./UpdateProfileModal";

export default function Profile() {

  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosClient.get("/me");
        setProfileData(response.data);
      } catch (error) {
        console.error("Lỗi khi tải thông tin:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const formatDateDisplay = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    
    // Kiểm tra ngày hợp lệ
    if (isNaN(date.getTime())) return "Ngày không hợp lệ";

    const day = String(date.getDate()).padStart(2, '0'); // Thêm số 0 vào ngày
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Thêm số 0 vào tháng
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  if (!user) return <Navigate to="/dang-nhap" />;

  return (
    <div className="w-full py-6 px-4"> 
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-4xl mx-auto border border-gray-200">
        
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#2f9ea0] uppercase">
            Thông tin cá nhân
          </h2>
        </div>

        <div className="p-6">
          {loading ? (
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          ) : profileData ? (
            <div className="space-y-0">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-b border-gray-100">
                <div className="font-semibold text-gray-700">Mã người dùng:</div>
                <div className="sm:col-span-2 text-gray-900">{profileData.maNguoiDung}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-b border-gray-100">
                <div className="font-semibold text-gray-700">Họ và tên:</div>
                <div className="sm:col-span-2 text-gray-900 font-medium">{profileData.hoTen}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-b border-gray-100">
                <div className="font-semibold text-gray-700">Giới tính:</div>
                <div className="sm:col-span-2 text-gray-900 font-medium">{profileData.gioiTinh === true ? "Nam" : "Nữ"}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-b border-gray-100">
                <div className="font-semibold text-gray-700">Ngày sinh: </div>
                <div className="sm:col-span-2 text-gray-900 font-medium">{formatDateDisplay(profileData.ngaySinh)}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-b border-gray-100">
                <div className="font-semibold text-gray-700">Email:</div>
                <div className="sm:col-span-2 text-gray-900">{profileData.email}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-b border-gray-100">
                <div className="font-semibold text-gray-700">Vai trò:</div>
                <div className="sm:col-span-2 text-gray-900">{profileData.vaiTro === "QuanTriVien" ? "Quản Trị Viên" : profileData.vaiTro === "NguoiDung" ? "Khách Hàng": "Khác"}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4">
                <div className="font-semibold text-gray-700">Số điện thoại:</div>
                <div className="sm:col-span-2 text-gray-900">
                  {profileData.soDienThoai || "Chưa cập nhật"}
                </div>
              </div>

            </div>
          ) : (
            <p className="text-red-500">Không thể tải thông tin</p>
          )}

          {/* Phần nút bấm */}
          <div className="mt-8 pt-4 border-t border-gray-100">
            <button
              onClick={() => setShowProfileModal(true)}
              className="px-6 py-2.5 bg-[#2f9ea0] text-white font-semibold rounded hover:bg-teal-700 transition duration-200 ease-in-out shadow-sm"
            >
              Cập nhật thông tin
            </button>
          </div>
        </div>
      </div>

      {showProfileModal && (
        <UpdateProfileModal
          user={profileData}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
}