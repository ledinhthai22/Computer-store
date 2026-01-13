import { useEffect, useState } from "react";
import CategoryTable from '../../../components/admin/category/CategoryTable';
import Toast from '../../../components/admin/Toast';
import ConfirmModal from '../../../components/admin/DeleteConfirmModal';
import { categoryService, handleApiError } from '../../../services/api/categoryService';

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newName, setNewName] = useState('');
    const [editing, setEditing] = useState(null);

    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await categoryService.getAll();
            const data = Array.isArray(res) ? res : [];
            setCategories(data);
        } catch (err) {
            const errorMessage = handleApiError(err, "Tải danh sách danh mục thất bại");
            showToast(errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCategories(); }, []);

    // --- MODAL XÓA ---
    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            setIsDeleting(true);
            await categoryService.delete(deleteId);
            showToast("Xóa danh mục thành công", "success");
            await fetchCategories();
        } catch (err) {
            const errorMessage = handleApiError(err, "Xóa danh mục thất bại");
            showToast(errorMessage, "error");
        } finally {
            setIsDeleting(false);
            setIsConfirmOpen(false);
            setDeleteId(null);
        }
    };

    // MODAL SỬA
    const handleEditClick = (category) => {
        setEditing(category);
        setNewName(category.tenDanhMuc);
        setError('');
        setIsModalOpen(true);
    };

    // CHỨC NĂNG THÊM VÀ SỬA 
    const handleSave = async (e) => {
        e.preventDefault();
        const nameTrimmed = newName.trim();
        
        if (!nameTrimmed) {
            return setError('Tên danh mục không được để trống');
        }

        try {
            setIsSubmitting(true);
            const categoryData = { tenDanhMuc: nameTrimmed };

            if (editing) {
                await categoryService.update(editing.maDanhMuc, categoryData);
                showToast("Cập nhật danh mục thành công", "success");
            } else {
                await categoryService.create(categoryData);
                showToast("Thêm danh mục thành công", "success");
            }
            
            await fetchCategories();
            setIsModalOpen(false);
            setEditing(null);
            setNewName('');
            setError('');
        } catch (err) {
            const errorMessage = handleApiError(err, 'Có lỗi xảy ra khi lưu danh mục');
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const openAddModal = () => {
        setEditing(null);
        setNewName('');
        setError('');
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <CategoryTable 
                    data={categories} 
                    loading={loading} 
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    onOpenAddModal={openAddModal}
                />
            </div>

            {/* MODAL THÊM/SỬA */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                        <form onSubmit={handleSave} className="p-6">
                            <h2 className="text-xl font-bold mb-5 text-gray-800">
                                {editing ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                            </h2>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên danh mục
                                </label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => {
                                        setNewName(e.target.value);
                                        if(error) setError('');
                                    }}
                                    className={`w-full px-4 py-2 border rounded-lg outline-none ${
                                        error ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                                    }`}
                                    placeholder="Nhập tên danh mục..."
                                    autoFocus
                                    disabled={isSubmitting}
                                />
                                {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
                            </div>

                            <div className="flex justify-center gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 cursor-pointer"
                                    disabled={isSubmitting}
                                >
                                    Đóng
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                >
                                    {isSubmitting ? 'Đang lưu...' : 'Xác nhận'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast.show && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast({ ...toast, show: false })} 
                />
            )}
            
            {/* Confirm Modal */}
            <ConfirmModal 
                isOpen={isConfirmOpen}
                message="Bạn có muốn xóa xóa danh mục này không?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsConfirmOpen(false)}
                isLoading={isDeleting}
            />
        </div>
    );
}

export default Category;