import axios from "axios";
import { useEffect, useState } from "react";
import CategoryTable from '../../components/admin/category/CategoryTable';
import Toast from '../../components/admin/Toast';
import ConfirmModal from '../../components/admin/DeleteConfirmModal';

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
            const res = await axios.get('https://localhost:7012/api/Category');
            const data = Array.isArray(res.data) ? res.data : [];
            setCategories(data);
        } catch (error) {
            console.error("Lỗi fetch:", error);
            showToast("Không thể tải danh sách danh mục", "error");
        }finally{
            setLoading(false);
        }
    };

    useEffect(() => { fetchCategories(); }, []);

    // --- CHỨC NĂNG XÓA ---
    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setIsConfirmOpen(true);
    };
    const handleConfirmDelete = async () => {
        try {
            setIsDeleting(true);
            await axios.delete(`https://localhost:7012/api/Category/${deleteId}`);
            showToast("Đã xóa danh mục thành công!", "success");
            await fetchCategories();
        } catch (err) {
            console.error(err);
            showToast("Lỗi xóa dữ liệu", "error");
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
        if (!nameTrimmed) return setError('Tên danh mục không được để trống.');

        try {
            setIsSubmitting(true);
            if (editing) {
                await axios.put(`https://localhost:7012/api/Category/${editing.maDanhMuc}`, {
                    tenDanhMuc: nameTrimmed
                });
                showToast("Cập nhật thành công!", "success");
            } else {
                await axios.post('https://localhost:7012/api/Category', {
                    tenDanhMuc: nameTrimmed
                });
                showToast("Thêm mới thành công!", "success");
            }
            
            await fetchCategories();
            setIsModalOpen(false);
            setEditing(null);
            setNewName('');
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <CategoryTable 
                    data={categories} 
                    loading={loading} 
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    onOpenAddModal={() => {
                        setEditing(null);
                        setNewName('');
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
                            <h2 className="text-xl font-bold mb-5 text-gray-800">
                                {editing ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                            </h2>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục</label>
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
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:bg-blue-300"
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
                message="Bạn có muốn xóa danh mục này không?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsConfirmOpen(false)}
                isLoading={isDeleting}
            />
        </div>
    );
}

export default Category;