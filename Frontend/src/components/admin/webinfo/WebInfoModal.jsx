import { useState, useEffect } from "react";

const WebInfoModal = ({ isOpen, onClose, onSave, editingData, isSubmitting }) => {
    // Khởi tạo state dựa trên cấu trúc API WebInfo
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
        duongDanAnh: ""
    };

    const [formData, setFormData] = useState(initialForm);
    const [error, setError] = useState("");

    // Khi mở modal để sửa, đổ dữ liệu cũ vào form
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-xl font-bold mb-5 text-gray-800 border-b pb-3">
                        {editingData ? 'Chỉnh sửa thông tin trang' : 'Thêm thông tin trang mới'}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Tên Trang */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên trang</label>
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                            <input
                                name="soDienThoai"
                                value={formData.soDienThoai}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                            <input
                                name="diaChi"
                                value={formData.diaChi}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Link Instagram</label>
                            <input
                                name="duongDanInstagram"
                                value={formData.duongDanInstagram}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        {/* Chính sách (Textarea) */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Chính sách bảo mật</label>
                            <textarea
                                name="chinhSachBaoMat"
                                value={formData.chinhSachBaoMat}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg h-20 outline-none"
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

                    <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Đóng
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:bg-blue-300 shadow-md hover:bg-blue-700 transition-all"
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