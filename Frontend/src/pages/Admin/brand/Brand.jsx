import { useEffect, useState } from "react";
import BrandTable from '../../../components/admin/brand/BrandTable';
import Toast from '../../../components/admin/Toast';
import ConfirmModal from '../../../components/admin/DeleteConfirmModal';
import { brandService, handleApiError } from '../../../services/api/brandService';

const Brand = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [brandNameInput, setBrandNameInput] = useState('');
    const [editingBrand, setEditingBrand] = useState(null);

    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };
    const fetchBrands = async () => {
        try {
            setLoading(true);
            const res = await brandService.getAll();
            const data = Array.isArray(res) ? res : [];
            setBrands(data);
        } catch (err) {
            const errorMessage = handleApiError(err, "Tải danh sách thương hiệu thất bại");
            showToast(errorMessage, "error");
            setBrands([]);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {fetchBrands(); }, []);

    // MODAL XÓA
    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setIsConfirmOpen(true);
    };
    const handleConfirmDelete = async () => {
        try {
            setIsDeleting(true);
            await brandService.delete(deleteId);
            showToast("Xóa thương hiệu thành công", "success");
            await fetchBrands();
        } catch (err) {
            const errorMessage = handleApiError(err, "Xóa thương hiệu thất bại");
            showToast(errorMessage, "error");
        } finally {
            setIsDeleting(false);
            setIsConfirmOpen(false);
            setDeleteId(null);
        }
    };

    // MODAL SỬA
    const handleEditClick = (brand) => {
        setEditingBrand(brand);
        setBrandNameInput(brand.tenThuongHieu || '');
        setError('');
        setIsModalOpen(true);
    };
    // CHỨC NĂNG THÊM VÀ SỬA
    const handleSave = async (e) => {
        e.preventDefault();
        const nameTrimmed = brandNameInput.trim();
        if (!nameTrimmed) {
            return setError('Tên thương hiệu không được để trống');
        }
        try {
            setIsSubmitting(true);
            const data = { tenThuongHieu: nameTrimmed };
            if (editingBrand) {
                await brandService.update(editingBrand.maThuongHieu, data)
                showToast("Cập nhật thương hiệu thành công", "success");
            } else {
                await brandService.create(data);
                showToast("Thêm thương hiệu thành công", "success");
            }
            
            await fetchBrands();
            setIsModalOpen(false);
            setEditingBrand(null);
            setBrandNameInput('');
        } catch (err) {
            const errorMessage = handleApiError(err, "Có lỗi xảy ra khi lưu thương hiệu]");
            showToast(errorMessage, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <BrandTable 
                    data={brands} 
                    loading={loading} 
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    onOpenAddModal={() => {
                        setEditingBrand(null);
                        setBrandNameInput('');
                        setError('');
                        setIsModalOpen(true);
                    }}
                />
            </div>

            {/* MODAL THÊM/SỬA */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                        <form onSubmit={handleSave} className="p-6">
                            <h2 className="text-xl font-bold mb-5 text-gray-800 text-center">
                                {editingBrand ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu mới'}
                            </h2>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên thương hiệu</label>
                                <input
                                    type="text"
                                    value={brandNameInput}
                                    onChange={(e) => {
                                        setBrandNameInput(e.target.value);
                                        if(error) setError('');
                                    }}
                                    className={`w-full px-4 py-2 border rounded-lg outline-none ${
                                        error ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                                    }`}
                                    autoFocus
                                />
                                {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
                            </div>

                            <div className="flex justify-center gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Đóng
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:bg-blue-300 font-medium"
                                >
                                    {isSubmitting ? 'Đang lưu...' : 'Xác nhận'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Hiển thị Toast */}
            {toast.show && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast({ ...toast, show: false })} 
                />
            )}
            <ConfirmModal 
                isOpen={isConfirmOpen}
                message="Bạn có muốn xóa thương hiệu này không?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsConfirmOpen(false)}
                isLoading={isDeleting}
            />
        </div>
    );
}

export default Brand;