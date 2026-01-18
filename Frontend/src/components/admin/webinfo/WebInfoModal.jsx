import { useState, useEffect } from "react";

const WebInfoModal = ({
    isOpen,
    onClose,
    onSave,
    editingData,
    isSubmitting,
}) => {
    const initialForm = {
        tenKhoaCaiDat: "",
        giaTriCaiDat: "",
        moTa: "",
        trangThaiHienThi: true,
    };

    const [formData, setFormData] = useState(initialForm);
    const [error, setError] = useState("");

    useEffect(() => {
        if (editingData) {
            setFormData({
                tenKhoaCaiDat: editingData.tenKhoaCaiDat ?? "",
                giaTriCaiDat: editingData.giaTriCaiDat ?? "",
                moTa: editingData.moTa ?? "",
                trangThaiHienThi: editingData.trangThaiHienThi ?? true,
            });
        } else {
            setFormData(initialForm);
        }
        setError("");
    }, [editingData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleToggleStatus = () => {
        setFormData((prev) => ({
            ...prev,
            trangThaiHienThi: !prev.trangThaiHienThi,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.tenKhoaCaiDat.trim()) {
            return setError("Vui lòng nhập khóa cấu hình.");
        }
        onSave(formData);
    };

    if (!isOpen) return null;

    const isActive = formData.trangThaiHienThi;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-xl">
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <h2 className="text-xl font-bold text-gray-800">
                        {editingData ? "Cập nhật cấu hình website" : "Thêm cấu hình website"}
                    </h2>

                    {/* KEY */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Khóa cấu hình <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="tenKhoaCaiDat"
                            value={formData.tenKhoaCaiDat}
                            onChange={handleChange}
                            disabled={!!editingData}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                        />
                    </div>

                    {/* VALUE */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Giá trị cấu hình
                        </label>
                        <textarea
                            name="giaTriCaiDat"
                            value={formData.giaTriCaiDat}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg h-24 resize-none"
                        />
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mô tả
                        </label>
                        <textarea
                            name="moTa"
                            value={formData.moTa}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg h-20 resize-none"
                        />
                    </div>

                    {/* STATUS SWITCH */}
                    <div className="flex items-center justify-between px-2 py-3">
                        <div>
                            <p className="font-medium text-gray-700">Trạng thái hiển thị</p>
                            <p className="text-xs text-gray-500">
                                Bật để hiển thị cấu hình cho website
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleToggleStatus}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${isActive ? "bg-green-600" : "bg-gray-300"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${isActive ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>


                    {/* ERROR */}
                    {error && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-200 text-gray-600 rounded-lg"
                        >
                            Đóng
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:bg-blue-300"
                        >
                            {isSubmitting ? "Đang lưu..." : "Xác nhận"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WebInfoModal;
