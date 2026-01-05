import axios from "axios";
import { useEffect, useState } from "react";
import CategoryTable from '../../components/admin/category/CategoryTable';
import CategoryToolbar from '../../components/admin/category/CategoryToolbar';
import Pagination from '../../components/admin/Pagination';

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [sortOrder, setSortOrder] = useState('tenDanhMuc-asc'); // Đồng nhất tên với Toolbar

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    // Hàm fetch dữ liệu
    const fetchCategories = async () => {
        try {
            const res = await axios.get('https://localhost:7012/api/Category');
            setCategories(res.data);
            setFiltered(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi khi fetch categories:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Logic Search và Sort
    useEffect(() => {
        let result = [...categories];

        if (search) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(c => 
                // Thêm check c.tenDanhMuc để tránh lỗi nếu dữ liệu null
                c.tenDanhMuc?.toLowerCase().includes(lowerSearch)
            );
        }

        result.sort((a, b) => {
            if (sortOrder === 'tenDanhMuc-asc') {
                return a.tenDanhMuc?.localeCompare(b.tenDanhMuc);
            } 
            if (sortOrder === 'tenDanhMuc-desc') {
                return b.tenDanhMuc?.localeCompare(a.tenDanhMuc);
            }
            return 0;
        });

        setFiltered(result);
        setCurrentPage(1);
    }, [search, categories, sortOrder]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    const handleAddCategory = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Chống double-click/enter

    setError('');
    const nameTrimmed = newCategoryName.trim();

    // 1. Validation Local
    if (!nameTrimmed) {
        setError('Tên danh mục không được để trống.');
        return;
    }

    const isExist = categories.some(c => c.tenDanhMuc?.toLowerCase() === nameTrimmed.toLowerCase());
    if (isExist) {
        setError('Tên danh mục này đã tồn tại trong danh sách hiện tại!');
        return;
    }

    try {
        setIsSubmitting(true);
        
        // 2. Gọi API theo đúng cấu trúc Swagger
        const response = await axios.post('https://localhost:7012/api/Category', 
            {
                tenDanhMuc: nameTrimmed // Phải khớp 100% key trong Swagger
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        // 3. Xử lý phản hồi thành công
        if (response.status === 200 || response.status === 201) {
            // Load lại danh sách từ server để đồng bộ ID mới
            await fetchCategories(); 
            
            setIsModalOpen(false);
            setNewCategoryName('');
            alert("Thêm thành công!");
        }
    } catch (err) {
        console.error("Chi tiết lỗi API:", err.response?.data);
        
        // Hiển thị lỗi từ server trả về (nếu có validation từ Backend)
        const serverMessage = typeof err.response?.data === 'string' 
            ? err.response.data 
            : err.response?.data?.message || err.response?.data?.title;
            
        setError(serverMessage || 'Không thể kết nối đến máy chủ.');
    } finally {
        setIsSubmitting(false);
    }
};

    return (
        <>
            <div className="space-y-6">
                <CategoryToolbar 
                    search={search}
                    onSearchChange={setSearch}
                    sortOrder={sortOrder}
                    onSortChange={setSortOrder}
                    onOpenAddModal={() => {
                        setIsModalOpen(true);
                        setError('');
                        setNewCategoryName(''); // Clear input mỗi khi mở lại
                    }}
                />

                <div className="flex flex-col gap-4">
                    <CategoryTable 
                        data={currentItems} 
                        loading={loading} 
                        isCategoryPage={true}
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
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in zoom-in duration-200">
                            <form onSubmit={handleAddCategory} className="p-6">
                                <h2 className="text-xl font-bold mb-5 text-gray-800">Thêm danh mục mới</h2>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục</label>
                                    <input
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(e) => {
                                            setNewCategoryName(e.target.value);
                                            if(error) setError('');
                                        }}
                                        className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${
                                            error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
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
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                                    >
                                        Đóng
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-all font-medium"
                                    >
                                        {isSubmitting ? 'Đang lưu...' : 'Xác nhận thêm'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Category;