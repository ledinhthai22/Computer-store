import { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react"; // Thêm icon mắt
import { userService } from "../../../services/api/userService";
import Toast from '../Toast';

const UserModalCreate = ({ isOpen, onClose, onSuccess }) => {
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        hoTen: "",
        email: "",
        soDienThoai: "",
        ngaySinh: "",
        matKhau: "",
        xacNhanMatKhau: "",
        trangThai: true,
    });

    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Xử lý dọn dẹp setTimeout để tránh Memory Leak
    useEffect(() => {
        return () => {
            // Cleanup function nếu cần
        };
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
        if (errorMessage) setErrorMessage("");
    };

    const validateForm = () => {
        const newErrors = {};
        // Email regex chuẩn hơn
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // SĐT regex (đầu số VN)
        const phoneRegex = /^(0|84)(3|5|7|8|9)([0-9]{8})$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        if (!formData.hoTen.trim()) newErrors.hoTen = "Họ tên không được để trống";
        if (!formData.ngaySinh) newErrors.ngaySinh = "Vui lòng chọn ngày sinh";
        if (!formData.email.trim()) {
            newErrors.email = "Email không được để trống";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Email không đúng định dạng";
        }

        if (!formData.soDienThoai.trim()) {
            newErrors.soDienThoai = "Số điện thoại không được để trống";
        } else if (!phoneRegex.test(formData.soDienThoai)) {
            newErrors.soDienThoai = "Số điện thoại VN không hợp lệ (10 số)";
        }

        if (!formData.matKhau) {
            newErrors.matKhau = "Mật khẩu không được để trống";
        } else if (!passwordRegex.test(formData.matKhau)) {
            newErrors.matKhau = "Mật khẩu yếu: Cần 8 ký tự, hoa, thường, số và ký tự đặc biệt";
        }

        if (formData.matKhau !== formData.xacNhanMatKhau) {
            newErrors.xacNhanMatKhau = "Mật khẩu xác nhận không khớp";
        }

        return newErrors;
    };

    const handleSubmit = async () => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            const birthDate = new Date(formData.ngaySinh);
            birthDate.setHours(0, 0, 0, 0);

            const submitData = {
                hoTen: (formData.hoTen || "").trim(),
                email: (formData.email || "").trim(),
                matKhau: formData.matKhau || "",
                trangThai: true,
                ngaySinh: birthDate.toISOString(),
                soDienThoai: (formData.soDienThoai || "").trim(),
            };
            
            console.log("Dữ liệu gửi đi:", submitData);
            await userService.create(submitData);
            if (onSuccess) onSuccess("Thêm người dùng thành công");          
            handleClose();
        } catch (err) {
            console.error("Lỗi API:", err);
            setErrorMessage(err);
            showToast("Thêm người dùng thất bại", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            hoTen: "", email: "", soDienThoai: "", ngaySinh: "",
            matKhau: "", xacNhanMatKhau: "", trangThai: true,
        });
        setErrors({});
        setErrorMessage("");
        setShowPassword(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-[#2f9ea0]">Thêm người dùng mới</h2>
                        <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                            <X size={24} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 overflow-y-auto overflow-x-hidden">
                        {errorMessage && (
                            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                                {errorMessage}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols gap-4">
                            {/* Họ tên - Full width */}
                            <div className="md:col-span-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Họ và tên *</label>
                                <input
                                    name="hoTen" value={formData.hoTen} onChange={handleChange}
                                    className={`w-full p-3 border-2 rounded-xl focus:outline-none transition-all ${errors.hoTen ? "border-red-500" : "border-gray-200 focus:border-[#2f9ea0]"}`}
                                />
                                {errors.hoTen && <p className="text-red-500 text-xs mt-1">{errors.hoTen}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày sinh *</label>
                                <input
                                    type="date"
                                    name="ngaySinh" value={formData.ngaySinh} onChange={handleChange}
                                    className={`w-full p-3 border-2 rounded-xl focus:outline-none ${errors.ngaySinh ? "border-red-500" : "border-gray-200 focus:border-[#2f9ea0]"}`}
                                />
                                {errors.ngaySinh && <p className="text-red-500 text-xs mt-1">{errors.ngaySinh}</p>}
                            </div>
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                                <input
                                    name="email" value={formData.email} onChange={handleChange}
                                    className={`w-full p-3 border-2 rounded-xl focus:outline-none ${errors.email ? "border-red-500" : "border-gray-200 focus:border-[#2f9ea0]"}`}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            {/* SĐT */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại *</label>
                                <input
                                    name="soDienThoai" value={formData.soDienThoai} onChange={handleChange}
                                    className={`w-full p-3 border-2 rounded-xl focus:outline-none ${errors.soDienThoai ? "border-red-500" : "border-gray-200 focus:border-[#2f9ea0]"}`}
                                />
                                {errors.soDienThoai && <p className="text-red-500 text-xs mt-1">{errors.soDienThoai}</p>}
                            </div>

                            {/* Mật khẩu */}
                            <div className="relative">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu *</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="matKhau" value={formData.matKhau} onChange={handleChange}
                                    className={`w-full p-3 border-2 rounded-xl focus:outline-none ${errors.matKhau ? "border-red-500" : "border-gray-200 focus:border-[#2f9ea0]"}`}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                                </button>
                                {errors.matKhau && <p className="text-red-500 text-xs mt-1 leading-tight">{errors.matKhau}</p>}
                            </div>

                            {/* Xác nhận */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Xác nhận mật khẩu *</label>
                                <input
                                    type="password"
                                    name="xacNhanMatKhau" value={formData.xacNhanMatKhau} onChange={handleChange}
                                    className={`w-full p-3 border-2 rounded-xl focus:outline-none ${errors.xacNhanMatKhau ? "border-red-500" : "border-gray-200 focus:border-[#2f9ea0]"}`}
                                />
                                {errors.xacNhanMatKhau && <p className="text-red-500 text-xs mt-1">{errors.xacNhanMatKhau}</p>}
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={handleClose} disabled={loading}
                                className="flex-1 py-3 px-6 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 cursor-pointer"
                            >
                                HỦY
                            </button>
                            <button
                                onClick={handleSubmit} disabled={loading}
                                className={`flex-1 py-3 px-6 text-white font-bold rounded-xl shadow-lg transition-all ${loading ? "bg-gray-400" : "bg-[#2f9ea0] hover:bg-[#248183] active:scale-95"} cursor-pointer`}
                            >
                                {loading ? "ĐANG XỬ LÝ..." : "Xác nhận"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {toast.show && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast({ ...toast, show: false })} 
                />
            )}
        </>
    );
};

export default UserModalCreate;