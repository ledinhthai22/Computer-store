import { useAuth } from "../../../contexts/AuthProvider.jsx";
import {  Navigate } from "react-router-dom";
export default function Profile(){
    const {user} = useAuth();
    if(!user) return <Navigate to="/login" />
    return(
        <div className="flex">
            <div className="p-6 max-w-[80%] mx-auto ">
                <h1 className="text-3xl font-bold mb-6">Thông tin cá nhân</h1>
                <div className="mb-4">
                    <span className="font-semibold">Họ và tên: </span>
                    <span>{user?.hoTen}</span>
                </div>
                <div className="mb-4">
                    <span className="font-semibold">Email: </span>
                    <span>{user?.Email || "Chưa cập nhật"}</span>
                </div>
                <div className="mb-4">
                    <span className="font-semibold">Chức vụ: </span>
                    <span>{user?.role || user?.vaiTro ||"Chưa cập nhật"}</span>
                </div>
                <div className="mb-4">
                    <span className="font-semibold">Số điện thoại: </span>
                    <span>{user.phone || "Chưa cập nhật"}</span>
                </div>
                <div className="mb-4">
                    <span className="font-semibold">Địa chỉ: </span>
                    <span>{user.address || "Chưa cập nhật"}</span>
                </div>
                <button className="bg-[#2f9ea0] mt-4 p-4 hover:bg-blue-600">Cập nhật thông tin</button>
            </div>
        </div>
    );
}