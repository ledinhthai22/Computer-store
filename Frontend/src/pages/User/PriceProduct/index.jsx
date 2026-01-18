import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; 
import { productService, handleApiError } from "../../../services/api/productService";
import { categoryService } from "../../../services/api/categoryService";
import { brandService } from "../../../services/api/brandService";

import ProductCard from "../../../components/user/product/ProductCard";
import FilterSidebar from "../../../components/user/product/FilterSidebar";
import UserPagination from "../../../components/user/product/UserPagination";

export default function PriceProduct() {
    // --- 1. State ---
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 12;

    // Lấy param từ URL
    const [searchParams] = useSearchParams();

    const [filters, setFilters] = useState({
        MaDanhMuc: null,
        MaThuongHieu: null,
        GiaMin: searchParams.get("min") || null,
        GiaMax: searchParams.get("max") || null
    });
    useEffect(()=>{
        document.title = `Mức giá ${searchParams.get("min") || "0"} - ${searchParams.get("max") || "∞"}`;
    })

    useEffect(() => {
        const newMin = searchParams.get("min");
        const newMax = searchParams.get("max");

        setFilters(prev => ({
            ...prev,
            GiaMin: newMin, // Cập nhật lại từ URL
            GiaMax: newMax  // Cập nhật lại từ URL
        }));
        setCurrentPage(1); // Reset về trang 1
    }, [searchParams]); // Chạy mỗi khi URL thay đổi
    // ------------------------------------------------------------------

    // --- 2. Lấy dữ liệu Sidebar ---
    useEffect(() => {
        const fetchSidebarData = async () => {
            try {
                const [catsList, brandsList] = await Promise.all([
                    categoryService.usergetAll(),
                    brandService.usergetAll()
                ]);

                if (Array.isArray(catsList)) {
                    setCategories(catsList.map(c => ({
                        id: c.maDanhMuc,
                        name: c.tenDanhMuc
                    })));
                }

                if (Array.isArray(brandsList)) {
                    setBrands(brandsList.map(b => ({
                        id: b.maThuongHieu,
                        name: b.tenThuongHieu
                    })));
                }
            } catch (error) {
                console.error("Lỗi tải dữ liệu sidebar:", error);
            }
        };

        fetchSidebarData();
    }, []);

    // --- 3. Gọi API Lọc sản phẩm ---
    // useEffect này sẽ chạy tự động khi `filters` thay đổi (do đoạn code MỚI THÊM bên trên set lại filters)
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const params = {
                    SoLuongMoiTrang: pageSize,
                    TrangHienTai: currentPage,
                    SapXep: "gia_asc",
                    ...filters
                };

                // Xóa các key null/rỗng
                Object.keys(params).forEach(key => {
                    if (params[key] === null || params[key] === "") delete params[key];
                });

                const { danhSach, tongSoTrang } = await productService.usergetAll(params);
                
                setProducts(danhSach || []);
                setTotalPages(tongSoTrang || 0);

            } catch (error) {
                handleApiError(error, "Lỗi tải danh sách sản phẩm");
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [filters, currentPage]);

    // --- 4. Handlers ---
    const handleFilterChange = (type, value) => {
        setFilters(prev => ({ ...prev, [type]: value }));
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({
            MaDanhMuc: null,
            MaThuongHieu: null,
            GiaMin: null,
            GiaMax: null
        });
        setCurrentPage(1);
    };

    // --- 5. Render ---
    return (
        <div className="w-full bg-stone-100 py-8 min-h-screen">
            <div className="container mx-auto px-4">
                
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-[#2f9ea0] pl-3">
                        Tìm kiếm theo mức giá
                    </h2>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar */}
                    <div className="w-full lg:w-1/4 flex-shrink-0">
                        <FilterSidebar 
                            categories={categories} 
                            brands={brands} 
                            filters={filters}
                            showBrands={true}      
                            showCategories={true}
                            showPrice={false} 
                            onFilterChange={handleFilterChange}
                        />
                    </div>

                    {/* Nội dung chính */}
                    <div className="w-full lg:w-3/4 flex flex-col justify-between">
                        <div>
                            {isLoading ? (
                                <div className="flex justify-center items-center py-32 bg-white rounded-xl shadow-sm">
                                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-100 border-t-[#2f9ea0]"></div>
                                </div>
                            ) : (
                                products.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">    
                                        {products.map((product) => (
                                            <div 
                                                key={product.maSanPham || product.id} 
                                                className="transform hover:-translate-y-1 transition-transform duration-300"
                                            >
                                                <ProductCard product={product} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm text-center">
                                        <p className="text-gray-500 font-medium mb-4">
                                            Không tìm thấy sản phẩm nào trong khoảng giá này.
                                        </p>
                                        <button 
                                            onClick={clearFilters}
                                            className="px-6 py-2 bg-[#2f9ea0] text-white rounded-md hover:bg-[#258b8d] transition-colors"
                                        >
                                            Xóa bộ lọc
                                        </button>
                                    </div>
                                )
                            )}
                        </div>

                        {!isLoading && products.length > 0 && (
                            <div className="mt-8 flex justify-center">
                                <UserPagination 
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}