import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import { productService, handleApiError } from "../../../services/api/productService";
import { categoryService } from "../../../services/api/categoryService";
import { brandService } from "../../../services/api/brandService";

// Import các thành phần giao diện
import ProductCard from "../../../components/user/product/ProductCard";
import FilterSidebar from "../../../components/user/product/FilterSidebar";
import UserPagination from "../../../components/user/product/UserPagination";

export default function ChipProduct() {
    const { slug } = useParams(); 
    const chipName = decodeURIComponent(slug); 

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 12;

    // --- SỬA LỖI TẠI ĐÂY: Đổi tên state 'sidebarFilters' thành 'filters' để khớp với code bên dưới ---
    const [filters, setFilters] = useState({
        MaDanhMuc: null,
        MaThuongHieu: null,
        GiaMin: null,
        GiaMax: null
    });

    // 1. Set Title
    useEffect(() => {
        document.title = `Laptop dòng chip ${chipName}`;
        setCurrentPage(1); 
    }, [chipName]);

    // 2. Lấy dữ liệu Sidebar (Category + Brand)
    useEffect(() => {
        const fetchSidebar = async () => {
            try {
                const [cats, brs] = await Promise.all([
                    categoryService.usergetAll(),
                    brandService.usergetAll()
                ]);
                if (cats) setCategories(cats.map(c => ({ id: c.maDanhMuc, name: c.tenDanhMuc })));
                if (brs) setBrands(brs.map(b => ({ id: b.maThuongHieu, name: b.tenThuongHieu })));
            } catch (err) {
                console.error(err);
            }
        };
        fetchSidebar();
    }, []);

    // 3. Gọi API Lọc theo Chip
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const params = {
                    SoLuongMoiTrang: pageSize,
                    TrangHienTai: currentPage,
                    SapXep: "gia_asc",
                    BoXuLyTrungTam: chipName,
                    ...filters // Sử dụng state filters đã sửa tên
                };

                // Xóa các param rỗng
                Object.keys(params).forEach(key => !params[key] && delete params[key]);

                const res = await productService.usergetAll(params);
                setProducts(res.danhSach || []);
                setTotalPages(res.tongSoTrang || 0);
            } catch (error) {
                handleApiError(error, "Lỗi tải sản phẩm");
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, [currentPage, chipName, filters]); // Theo dõi filters thay vì sidebarFilters

    const handleFilterChange = (key, value) => {
        if (key === "Gia") {
             setFilters(prev => ({ ...prev, GiaMin: value.min, GiaMax: value.max }));
        } else {
             setFilters(prev => ({ ...prev, [key]: value }));
        }
        setCurrentPage(1);
    };

    const clearFilters = () => {
        // Hàm này giờ đã hoạt động đúng vì setFilters đã được định nghĩa
        setFilters({ MaDanhMuc: null, MaThuongHieu: null, GiaMin: null, GiaMax: null });
        setCurrentPage(1);
    };

    return (
        <div className="w-full bg-stone-50 py-8 min-h-screen">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="mb-6 border-b pb-4 border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-800 uppercase border-l-4 border-[#2f9ea0] pl-3">
                        Laptop chip {chipName}
                    </h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-1/4 flex-shrink-0">
                        <FilterSidebar 
                            categories={categories} 
                            brands={brands} // Cập nhật: Truyền state brands đã fetch vào đây
                            filters={filters} // Giờ biến filters đã tồn tại
                            showBrands={true}
                            showChips={false}
                            onFilterChange={handleFilterChange}
                        />
                    </div>
                    
                    <div className="w-full lg:w-3/4">
                        {isLoading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#2f9ea0] border-t-transparent"></div>
                            </div>
                        ) : products.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                                    {products.map((p) => (
                                        <div key={p.maSanPham} className="transform hover:-translate-y-1 transition-transform duration-300">
                                            <ProductCard product={p} />
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 flex justify-center">
                                    <UserPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm text-center">
                                <p className="text-gray-500 font-medium mb-4">
                                    Không tìm thấy sản phẩm phù hợp.
                                </p>
                                <button 
                                    onClick={clearFilters}
                                    className="px-6 py-2 bg-[#2f9ea0] text-white rounded-md hover:bg-[#258b8d] transition-colors"
                                >
                                    Xóa bộ lọc
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}