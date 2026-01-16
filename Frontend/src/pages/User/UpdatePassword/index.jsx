import { useAuth } from "../../../contexts/AuthProvider";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosClient from "../../../services/api/axiosClient";
import ChangePasswordModal from "./ChangePasswordModal";

export default function UpdatePassword() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

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

  if (!user) return <Navigate to="/dang-nhap" />;

  return (
    <div className="w-full py-6 px-4"> 
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-4xl mx-auto border border-gray-200">
        
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#2f9ea0] uppercase">
            Thông tin đăng nhập
          </h2>
        </div>

        <div className="p-6">
          {loading ? (
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          ) : profileData ? (
            <div className="space-y-0">

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-b border-gray-100">
                <div className="font-semibold text-gray-700">Email:</div>
                <div className="sm:col-span-2 text-gray-900">{profileData.email}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-b border-gray-100">
                <div className="font-semibold text-gray-700">Mật khẩu:</div>
                <div className="sm:col-span-2 text-gray-900">**********</div>
              </div>

            </div>
          ) : (
            <p className="text-red-500">Không thể tải thông tin</p>
          )}

          {/* Phần nút bấm */}
          <div className="mt-8 pt-4 border-t border-gray-100">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-6 py-2.5 bg-[#2f9ea0] text-white font-semibold rounded hover:bg-teal-700 transition duration-200 ease-in-out shadow-sm"
            >
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          currentUserData={profileData}
        />
      )}
    </div>
  );
}