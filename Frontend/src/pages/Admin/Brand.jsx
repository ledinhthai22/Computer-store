import axios from "axios";
import { useEffect, useState } from "react";
import BrandTable from '../../components/admin/brand/BrandTable';
import BrandToolbar from '../../components/admin/brand/BrandToolbar';
import Pagination from '../../components/admin/Pagination';

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

    const API_URL = 'https://localhost:7012/api/Brand';

    // Cấu hình header đính kèm token để tránh lỗi 401
    const getAuthConfig = () => {
        const token = localStorage.getItem('token');
        return {
            headers: { Authorization: `Bearer ${token}` }
        };
    };

    const fetchBrands = async () => {
        try {
            const res = await axios.get(API_URL);
            setBrands(res.data);
            setFiltered(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách thương hiệu:", error);
            setLoading(false);
        }
    };

    useEffect(() => { fetchBrands(); }, []);

    useEffect(() => {
        let result = [...brands];
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

    const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa thương hiệu này?")) return;
        try {
            await axios.delete(`${API_URL}/${id}`, getAuthConfig());
            alert("Xóa thương hiệu thành công!");
            fetchBrands();
        } catch (err) {
            alert("Lỗi khi xóa dữ liệu.", err);
        }
    };

    const handleEditClick = (brand) => {
        setEditingBrand(brand);
        setBrandNameInput(brand.brandName);
        setError('');
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const nameTrimmed = brandNameInput.trim();
        if (!nameTrimmed) return setError('Tên thương hiệu không được để trống.');

        try {
            setIsSubmitting(true);
            const payload = { brandName: nameTrimmed }; // Gửi đúng key brandName

            if (editingBrand) {
                await axios.put(`${API_URL}/${editingBrand.brandID}`, payload, getAuthConfig());
                alert("Cập nhật thương hiệu thành công!");
            } else {
                await axios.post(API_URL, payload, getAuthConfig());
                alert("Thêm thương hiệu thành công!");
            }
            
            await fetchBrands();
            setIsModalOpen(false);
            setEditingBrand(null);
            setBrandNameInput('');
        } catch (err) {
            // Hiển thị lỗi từ server hoặc thông báo mặc định
            setError(err.response?.data?.message || 'Có lỗi xảy ra hoặc bạn không có quyền thực hiện.');
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
                    onDelete={handleDelete}
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
        </div>
    );
}

export default Brand;