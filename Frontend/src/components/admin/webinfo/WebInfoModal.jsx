import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";

const WebInfoModal = ({ isOpen, onClose, onSave, onUpdateStatus, editingData, isSubmitting, isUpdatingStatus }) => {
    const initialForm = {
        tenTrang: "",
        soDienThoai: "",
        diaChi: "",
        duongDanFacebook: "",
        duongDanInstagram: "",
        duongDanYoutube: "",
        chinhSachBaoMat: "",
        chinhSachDoiTra: "",
        dieuKhoanSuDung: "",
        duongDanAnh: "",
        trangThai: false
    };

    const [formData, setFormData] = useState(initialForm);
    const [error, setError] = useState("");

    useEffect(() => {
        if (editingData) {
            setFormData(editingData);
        } else {
            setFormData(initialForm);
        }
        setError("");
    }, [editingData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.tenTrang.trim() || !formData.soDienThoai.trim()) {
            return setError("Vui lòng nhập tên trang và số điện thoại.");
        }
        onSave(formData);
    };

    const handleActivate = () => {
        if (editingData?.maThongTinTrang) {
            onUpdateStatus(editingData.maThongTinTrang);
        }
    };

    if (!isOpen) return null;

    const isActive = formData.trangThai === true;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Header with Activate Button */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">
                            {editingData ? 'Chỉnh sửa thông tin trang' : 'Thêm thông tin trang mới'}
                        </h2>
                        
                        {editingData && (
                            <div>
                                {!isActive ? (
                                    <button
                                        type="button"
                                        onClick={handleActivate}
                                        disabled={isUpdatingStatus}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:bg-green-300 shadow-md transition-all font-medium cursor-pointer"
                                    >
                                        <CheckCircle size={18} />
                                        {isUpdatingStatus ? 'Đang kích hoạt...' : 'Kích hoạt'}
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg border border-green-200 font-medium">
                                        <CheckCircle size={18} />
                                        Đang hoạt động
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Tên Trang */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tên trang <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="tenTrang"
                                value={formData.tenTrang}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="VD: Shop Công Nghệ"
                            />
                        </div>

                        {/* Số điện thoại & Địa chỉ */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Số điện thoại <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="soDienThoai"
                                value={formData.soDienThoai}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="0123456789"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                            <input
                                name="diaChi"
                                value={formData.diaChi}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Nhập địa chỉ..."
                            />
                        </div>

                        {/* Mạng xã hội */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Link Facebook</label>
                            <input
                                name="duongDanFacebook"
                                value={formData.duongDanFacebook}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="https://facebook.com/..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Link Instagram</label>
                            <input
                                name="duongDanInstagram"
                                value={formData.duongDanInstagram}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="https://instagram.com/..."
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Link Youtube</label>
                            <input
                                name="duongDanYoutube"
                                value={formData.duongDanYoutube}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="https://youtube.com/..."
                            />
                        </div>

                        {/* Chính sách */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Chính sách bảo mật</label>
                            <textarea
                                name="chinhSachBaoMat"
                                value={formData.chinhSachBaoMat}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg h-20 outline-none resize-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập chính sách bảo mật..."
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Chính sách đổi trả</label>
                            <textarea
                                name="chinhSachDoiTra"
                                value={formData.chinhSachDoiTra}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg h-20 outline-none resize-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập chính sách đổi trả..."
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Điều khoản sử dụng</label>
                            <textarea
                                name="dieuKhoanSuDung"
                                value={formData.dieuKhoanSuDung}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg h-20 outline-none resize-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập điều khoản sử dụng..."
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-lg transition-all cursor-pointer"
                        >
                            Đóng
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:bg-blue-300 shadow-md hover:bg-blue-700 transition-all font-medium cursor-pointer"
                        >
                            {isSubmitting ? 'Đang lưu...' : 'Xác nhận'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WebInfoModal;