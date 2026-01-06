import axios from "axios";
import { useEffect, useState } from "react";
import BrandTable from '../../components/admin/brand/BrandTable';
import BrandToolbar from '../../components/admin/brand/BrandToolbar';
import Pagination from '../../components/admin/Pagination';
import Toast from '../../components/admin/Toast';
import ConfirmModal from '../../components/admin/DeleteConfirmModal';

const Brand = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [sortOrder, setSortOrder] = useState('brandName-asc');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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

    // Hàm lấy dữ liệu từ API
    const fetchBrands = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`https://localhost:7012/api/Brand`);
            // Đảm bảo dữ liệu là mảng trước khi set
            const data = Array.isArray(res.data) ? res.data : [];
            setBrands(data);
            setFiltered(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách thương hiệu:", error);
            showToast("Không thể tải danh sách thương hiệu!", "error");
            setBrands([]);
        } finally {
            setLoading(false);
        }
    };

    // Gọi fetchBrands khi trang được tải lần đầu
    useEffect(() => {
        fetchBrands();
    }, []);

    // Xử lý Tìm kiếm và Sắp xếp
    useEffect(() => {
        let result = Array.isArray(brands) ? [...brands] : [];
        if (search) {
            result = result.filter(b => b.brandName?.toLowerCase().includes(search.toLowerCase()));
        }
        result.sort((a, b) => {
            if (sortOrder === 'brandName-asc') return a.brandName?.localeCompare(b.brandName);
            if (sortOrder === 'brandName-desc') return b.brandName?.localeCompare(a.brandName);
            return 0;
        });
        setFiltered(result);
        setCurrentPage(1);
    }, [search, brands, sortOrder]);

    // Phân trang
    const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    // MODAL XÓA
    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setIsConfirmOpen(true);
    };
    const handleConfirmDelete = async () => {
        try {
            setIsDeleting(true);
            await axios.delete(`https://localhost:7012/api/Brand/${deleteId}`);
            showToast("Đã xóa thương hiệu thành công!", "success");
            await fetchBrands();
        } catch (err) {
            console.error(err);
            showToast("Lỗi khi xóa dữ liệu!", "error");
        } finally {
            setIsDeleting(false);
            setIsConfirmOpen(false);
            setDeleteId(null);
        }
    };

    // MODAL THÊM/SỬA
    const handleEditClick = (brand) => {
        setEditingBrand(brand);
        setBrandNameInput(brand.brandName || '');
        setError('');
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const nameTrimmed = brandNameInput.trim();
        if (!nameTrimmed) return setError('Tên thương hiệu không được để trống.');

        try {
            setIsSubmitting(true);
            const payload = { brandName: nameTrimmed };

            if (editingBrand) {
                // Sửa thương hiệu
                await axios.put(`https://localhost:7012/api/Brand/${editingBrand.brandID}`, payload);
                showToast("Cập nhật thành công!", "success");
            } else {
                // Thêm mới thương hiệu
                await axios.post(`https://localhost:7012/api/Brand`, payload);
                showToast("Thêm mới thành công!", "success");
            }
            
            await fetchBrands();
            setIsModalOpen(false);
            setEditingBrand(null);
            setBrandNameInput('');
        } catch (err) {
            showToast(err.response?.data?.message || "Có lỗi xảy ra!", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <BrandToolbar 
                search={search}
                onSearchChange={setSearch}
                sortOrder={sortOrder}
                onSortChange={setSortOrder}
                onOpenAddModal={() => {
                    setEditingBrand(null);
                    setBrandNameInput('');
                    setError('');
                    setIsModalOpen(true);
                }}
            />

            <div className="flex flex-col gap-4">
                <BrandTable 
                    data={currentItems} 
                    loading={loading} 
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                />
                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>

            {/* MODAL THÊM/SỬA */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                        <form onSubmit={handleSave} className="p-6">
                            <h2 className="text-xl font-bold mb-5 text-gray-800">
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

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Hủy bỏ
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
                title="Xóa thương hiệu"
                message="Bạn có chắc chắn muốn xóa thương hiệu này khỏi hệ thống?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsConfirmOpen(false)}
                isLoading={isDeleting}
            />
        </div>
    );
}

export default Brand;