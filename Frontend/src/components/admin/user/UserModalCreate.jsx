import { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react"; // Thêm icon mắt
import { userService } from "../../../services/api/userService";
import Toast from '../Toast';

// Chỉ cho phép chữ cái (có dấu) và khoảng trắng, KHÔNG có số và ký tự đặc biệt
const NAME_REGEX = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]+$/;

// Regex kiểm tra email chuẩn (không cho phép 2 dấu @@ và định dạng sai)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Chỉ cho phép nhập 8 số trở lên, bao gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const UserModalCreate = ({ isOpen, onClose, onSuccess }) => {
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [showPassword, setShowPassword] = useState(false);
    const [showCFPassword, setShowCFPassword] = useState(false);
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

        // Xóa lỗi khi người dùng bắt đầu nhập lại
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
        if (errorMessage) setErrorMessage("");
    };

    const validateForm = () => {
        const newErrors = {};
        const today = new Date();
        const currentYear = today.getFullYear();

        // 1. Validate Họ tên: Không số, không ký tự đặc biệt
        if (!formData.hoTen.trim()) {
            newErrors.hoTen = "Họ tên không được để trống";
        } else if (!NAME_REGEX.test(formData.hoTen)) {
            newErrors.hoTen = "Họ tên không được chứa số hoặc ký tự đặc biệt";
        }

        // 2. Validate Ngày sinh: Không vượt quá hiện tại và năm không vô lý (ví dụ > 2099)
        if (!formData.ngaySinh) {
            newErrors.ngaySinh = "Vui lòng chọn ngày sinh";
        } else {
            const birthDateObj = new Date(formData.ngaySinh);
            if (birthDateObj > today) {
                newErrors.ngaySinh = "Ngày sinh không được vượt quá ngày hiện tại";
            } else if (birthDateObj.getFullYear() > currentYear || birthDateObj.getFullYear() < 1900) {
                newErrors.ngaySinh = "Năm sinh không hợp lệ";
            }
        }

        // 3. Validate Email: Regex chặn @@ và định dạng sai
        if (!formData.email.trim()) {
            newErrors.email = "Email không được để trống";
        } else if (!EMAIL_REGEX.test(formData.email)) {
            newErrors.email = "Email không hợp lệ (ví dụ: example@gmail.com)";
        }

        // 4. Validate Số điện thoại: Đã chặn nhập text ở input, giờ check độ dài
        if (!formData.soDienThoai.trim()) {
            newErrors.soDienThoai = "Số điện thoại không được để trống";
        } else if (!formData.soDienThoai.length == 10 ) {
            newErrors.soDienThoai = "Số điện thoại phải đủ 10 số";
        }

        // 5. Validate Mật khẩu
        if (!formData.matKhau) {
            newErrors.matKhau = "Mật khẩu không được để trống";
        } else if (!PASSWORD_REGEX.test(formData.matKhau)) {
            newErrors.matKhau = "Cần ít nhất 8 ký tự, 1 hoa, 1 thường, 1 số, 1 ký tự đặc biệt";
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
                hoTen: formData.hoTen.trim(),
                email: formData.email.trim(),
                matKhau: formData.matKhau,
                trangThai: true,
                ngaySinh: birthDate.toISOString(),
                soDienThoai: formData.soDienThoai.trim(),
            };

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
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-auto">
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
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Họ và tên</label>
                                <input
                                    name="hoTen" value={formData.hoTen} 
                                    onChange={handleChange}
                                    className={`w-full p-3 border-2 rounded-xl focus:outline-none transition-all ${errors.hoTen ? "border-red-500" : "border-gray-200 focus:border-[#2F9EA0]"}`}
                                />
                                {errors.hoTen && <p className="text-red-500 text-xs mt-1 italic">{errors.hoTen}</p>}
                            </div>
                            {/* Ngày sinh */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày sinh</label>
                                <input
                                    type="date"
                                    name="ngaySinh" 
                                    max={new Date().toISOString().split("T")[0]} // Giới hạn chọn trên lịch
                                    value={formData.ngaySinh} 
                                    onChange={handleChange}
                                    className={`w-full p-3 border-2 rounded-xl focus:outline-none ${errors.ngaySinh ? "border-red-500" : "border-gray-200 focus:border-[#2F9EA0]"}`}
                                />
                                {errors.ngaySinh && <p className="text-red-500 text-xs mt-1 italic">{errors.ngaySinh}</p>}
                            </div>
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                                <input
                                    name="email" value={formData.email} 
                                    onChange={handleChange}
                                    className={`w-full p-3 border-2 rounded-xl focus:outline-none ${errors.email ? "border-red-500" : "border-gray-200 focus:border-[#2F9EA0]"}`}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1 italic">{errors.email}</p>}
                            </div>

                            {/* SĐT */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại</label>
                                <input
                                    name="soDienThoai" value={formData.soDienThoai}
                                    onInput={(e) => {
                                        // CHẶN NHẬP TEXT: Chỉ cho phép số và tối đa 10 số
                                        e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                                        handleChange(e);
                                    }}
                                    className={`w-full p-3 border-2 rounded-xl focus:outline-none ${errors.soDienThoai ? "border-red-500" : "border-gray-200 focus:border-[#2F9EA0]"}`}
                                />
                                {errors.soDienThoai && <p className="text-red-500 text-xs mt-1 italic">{errors.soDienThoai}</p>}
                            </div>

                            {/* Mật khẩu */}
                            <div className="relative">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="matKhau" value={formData.matKhau} 
                                    onChange={handleChange}
                                    className={`w-full p-3 border-2 rounded-xl focus:outline-none ${errors.matKhau ? "border-red-500" : "border-gray-200 focus:border-[#2f9ea0]"}`}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                                </button>
                                {errors.matKhau && <p className="text-red-500 text-xs mt-1 italic">{errors.matKhau}</p>}
                            </div>

                            {/* Xác nhận */}
                            <div className="relative">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Xác nhận mật khẩu</label>
                                <input
                                    type={showCFPassword ? "text" : "password"}
                                    name="xacNhanMatKhau" 
                                    value={formData.xacNhanMatKhau} 
                                    onChange={handleChange}
                                    className={`w-full p-3 border-2 rounded-xl focus:outline-none ${errors.xacNhanMatKhau ? "border-red-500" : "border-gray-200 focus:border-[#2f9ea0]"}`}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowCFPassword(!showCFPassword)}
                                    className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                                >
                                    {showCFPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                                </button>
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