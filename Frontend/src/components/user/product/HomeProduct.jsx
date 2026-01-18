import { useState, useEffect } from "react";
import { productService, handleApiError } from "../../../services/api/productService";
import { categoryService } from "../../../services/api/categoryService";
import { brandService } from "../../../services/api/brandService";

import ProductCard from "./ProductCard";
import FilterSidebar from "./FilterSidebar";
import UserPagination from "./UserPagination";

export default function HomeProduct() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 12; 

    const [filters, setFilters] = useState({
        MaDanhMuc: null,
        MaThuongHieu: null,
        GiaMin: null,
        GiaMax: null
    });

    // --- 1. LẤY DỮ LIỆU SIDEBAR (DANH MỤC & THƯƠNG HIỆU) ---
    useEffect(() => {
        const fetchFiltersData = async () => {
            try {
                // Gọi song song 2 API để tối ưu tốc độ
                const [catsList, brandsList] = await Promise.all([
                    categoryService.usergetAll(),
                    brandService.usergetAll()
                ]);

                // Map dữ liệu Danh mục (theo JSON bạn cung cấp)
                if (Array.isArray(catsList)) {
                    setCategories(catsList.map(c => ({
                        id: c.maDanhMuc,
                        name: c.tenDanhMuc
                    })));
                }

                // Map dữ liệu Thương hiệu (theo JSON bạn cung cấp)
                if (Array.isArray(brandsList)) {
                    setBrands(brandsList.map(b => ({
                        id: b.maThuongHieu,
                        name: b.tenThuongHieu
                    })));
                }

            } catch (error) {
                console.error("Lỗi lấy dữ liệu sidebar:", error);
            }
        };

        fetchFiltersData();
    }, []);

    // --- 2. LẤY DANH SÁCH SẢN PHẨM ---
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                // Chuẩn bị tham số gửi lên API
                const params = {
                    SoLuongMoiTrang: pageSize,
                    TrangHienTai: currentPage,
                    SapXep: "ngaytao_desc", // Mặc định sắp xếp mới nhất
                    ...filters
                };
                
                // Xóa các param rỗng hoặc null để URL sạch đẹp
                Object.keys(params).forEach(key => {
                    if (params[key] === null || params[key] === "") delete params[key];
                });

                // Gọi Service (Service đã trả về object { danhSach, tongSoTrang })
                const { danhSach, tongSoTrang } = await productService.usergetAll(params);
                
                setProducts(danhSach || []);
                setTotalPages(tongSoTrang || 0);

            } catch (error) {
                handleApiError(error, "Lỗi tải danh sách sản phẩm");
                setProducts([]);
                setTotalPages(0);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [filters, currentPage]); // Chạy lại khi bộ lọc hoặc trang thay đổi

    // --- HANDLERS ---
    const handleFilterChange = (type, value) => {
        setFilters(prev => {
            // Xử lý riêng cho khoảng giá (vì Component con trả về {min, max})
            if (type === "Gia") {
                return { ...prev, GiaMin: value.min, GiaMax: value.max };
            }
            return { ...prev, [type]: value };
        });
        // Reset về trang 1 mỗi khi đổi bộ lọc
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

    // --- RENDER ---
    return (
        <div className="w-full bg-stone-50 py-8 min-h-screen">
            <div className="container mx-auto px-4">

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* --- SIDEBAR TRÁI --- */}
                    <div className="w-full lg:w-1/4 flex-shrink-0">
                        <FilterSidebar 
                            categories={categories} 
                            brands={brands}
                            filters={filters}
                            onFilterChange={handleFilterChange}
                        />
                    </div>

                    {/* --- NỘI DUNG CHÍNH --- */}
                    <div className="w-full lg:w-3/4 flex flex-col">
                        <div className="min-h-[800px] flex flex-col">
                            {isLoading ? (
                                /* Loading State */
                                <div className="flex justify-center items-center py-32 bg-white rounded-xl shadow-sm">
                                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-100 border-t-[#2f9ea0]"></div>
                                </div>
                            ) : (
                                products.length > 0 ? (
                                    /* Grid Sản Phẩm */
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">   
                                        {products.map((product) => (
                                            <div key={product.maSanPham || product.id} className="transform hover:-translate-y-1 transition-transform duration-300">
                                                <ProductCard product={product} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    /* Empty State */
                                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm text-center">
                                        <p className="text-gray-500 font-medium mb-4">Không tìm thấy sản phẩm phù hợp.</p>
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

                        {/* --- PHÂN TRANG --- */}
                        {!isLoading && products.length > 0 && (
                            <div className="mt-8 flex justify-center pb-4">
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