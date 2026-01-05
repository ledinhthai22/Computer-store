import axios from "axios";
import { useEffect, useState } from "react";
import CategoryTable from '../../components/admin/category/CategoryTable';
import CategoryToolbar from '../../components/admin/category/CategoryToolbar';
import Pagination from '../../components/admin/Pagination';

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [sortOrder, setSortOrder] = useState('tenDanhMuc-asc');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    

    const [editingCategory, setEditingCategory] = useState(null);

    const fetchCategories = async () => {
        try {
            const res = await axios.get('https://localhost:7012/api/Category');
            setCategories(res.data);
            setFiltered(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi khi fetch:", error);
            setLoading(false);
        }
    };

    useEffect(() => { fetchCategories(); }, []);

    useEffect(() => {
        let result = [...categories];
        if (search) {
            result = result.filter(c => c.tenDanhMuc?.toLowerCase().includes(search.toLowerCase()));
        }
        result.sort((a, b) => {
            if (sortOrder === 'tenDanhMuc-asc') return a.tenDanhMuc?.localeCompare(b.tenDanhMuc);
            if (sortOrder === 'tenDanhMuc-desc') return b.tenDanhMuc?.localeCompare(a.tenDanhMuc);
            return 0;
        });
        setFiltered(result);
        setCurrentPage(1);
    }, [search, categories, sortOrder]);

    // Phân trang
    const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    // --- CHỨC NĂNG XÓA ---
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
        try {
            await axios.delete(`https://localhost:7012/api/Category/${id}`);
            alert("Xóa thành công!");
            fetchCategories();
        } catch (err) {
            alert("Lỗi khi xóa danh mục.", err);
        }
    };

    // --- MODAL SỬA ---
    const handleEditClick = (category) => {
        setEditingCategory(category);
        setNewCategoryName(category.tenDanhMuc);
        setError('');
        setIsModalOpen(true);
    };

    // --- CHỨC NĂNG THÊM VÀ SỬA ---
    const handleSave = async (e) => {
        e.preventDefault();
        const nameTrimmed = newCategoryName.trim();
        if (!nameTrimmed) return setError('Tên danh mục không được để trống.');

        try {
            setIsSubmitting(true);
            if (editingCategory) {
                await axios.put(`https://localhost:7012/api/Category/${editingCategory.maDanhMuc}`, {
                    tenDanhMuc: nameTrimmed
                });
                alert("Cập nhật thành công!");
            } else {
                await axios.post('https://localhost:7012/api/Category', {
                    tenDanhMuc: nameTrimmed
                });
                alert("Thêm thành công!");
            }
            
            await fetchCategories();
            setIsModalOpen(false);
            setEditingCategory(null);
            setNewCategoryName('');
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <CategoryToolbar 
                search={search}
                onSearchChange={setSearch}
                sortOrder={sortOrder}
                onSortChange={setSortOrder}
                onOpenAddModal={() => {
                    setEditingCategory(null);
                    setNewCategoryName('');
                    setError('');
                    setIsModalOpen(true);
                }}
            />

            <div className="flex flex-col gap-4">
                <CategoryTable 
                    data={currentItems} 
                    loading={loading} 
                    onEdit={handleEditClick}
                    onDelete={handleDelete}
                />
                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>

            {/* POPUP MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                        <form onSubmit={handleSave} className="p-6">
                            <h2 className="text-xl font-bold mb-5 text-gray-800">
                                {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                            </h2>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục</label>
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => {
                                        setNewCategoryName(e.target.value);
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

                            <div className="flex justify-end gap-3 mt-6">
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
        </div>
    );
}

export default Category;