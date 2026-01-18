import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { productService, handleApiError } from "../../../services/api/productService";
import { categoryService } from "../../../services/api/categoryService";
import { brandService } from "../../../services/api/brandService";

import ProductCard from "../../../components/user/product/ProductCard";
import FilterSidebar from "../../../components/user/product/FilterSidebar";
import UserPagination from "../../../components/user/product/UserPagination";

export default function ScreenProduct() {
    const { slug } = useParams(); // Lấy "14%20inch"
    const screenName = decodeURIComponent(slug); // Chuyển thành "14 inch"

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 12;

    const [sidebarFilters, setSidebarFilters] = useState({
        MaDanhMuc: null, MaThuongHieu: null, GiaMin: null, GiaMax: null
    });

    useEffect(() => {
        document.title = `Laptop màn hình ${screenName}`;
        setCurrentPage(1);
    }, [screenName]);

    useEffect(() => {
        const fetchSidebar = async () => {
            try {
                const [cats, brs] = await Promise.all([categoryService.usergetAll(), brandService.usergetAll()]);
                if (cats) setCategories(cats.map(c => ({ id: c.maDanhMuc, name: c.tenDanhMuc })));
                if (brs) setBrands(brs.map(b => ({ id: b.maThuongHieu, name: b.tenThuongHieu })));
            } catch (err) { console.error(err); }
        };
        fetchSidebar();
    }, []);

    // GỌI API THEO MÀN HÌNH
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const params = {
                    SoLuongMoiTrang: pageSize,
                    TrangHienTai: currentPage,
                    SapXep: "gia_asc",
                    KichThuocManHinh: screenName, // <--- TRUYỀN PARAM MÀN HÌNH VÀO ĐÂY
                    ...sidebarFilters
                };

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
    }, [currentPage, screenName, sidebarFilters]);

    const handleFilterChange = (key, value) => {
        if (key === "Gia") {
             setSidebarFilters(prev => ({ ...prev, GiaMin: value.min, GiaMax: value.max }));
        } else {
             setSidebarFilters(prev => ({ ...prev, [key]: value }));
        }
        setCurrentPage(1);
    };

    return (
        <div className="w-full bg-stone-50 py-8 min-h-screen">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="mb-6 border-b pb-4 border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-800 uppercase border-l-4 border-[#2f9ea0] pl-3">
                        Laptop màn hình {screenName}
                    </h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-1/4 flex-shrink-0">
                        <FilterSidebar 
                            categories={categories} brands={brands} filters={sidebarFilters}
                            onFilterChange={handleFilterChange}
                        />
                    </div>
                    <div className="w-full lg:w-3/4">
                        {isLoading ? (
                            <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-4 border-[#2f9ea0] border-t-transparent"></div></div>
                        ) : products.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                                    {products.map((p) => <div key={p.maSanPham}><ProductCard product={p} /></div>)}
                                </div>
                                <div className="mt-8 flex justify-center">
                                    <UserPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-20 text-gray-500">Không có sản phẩm nào.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}