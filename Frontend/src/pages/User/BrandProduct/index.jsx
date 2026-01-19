import { useState, useEffect, use } from "react";
import { useParams } from "react-router-dom";
import { productService, handleApiError } from "../../../services/api/productService";
import { categoryService } from "../../../services/api/categoryService";
import ProductCard from "../../../components/user/product/ProductCard";
import FilterSidebar from "../../../components/user/product/FilterSidebar";

export default function BrandProduct() {
    // --- 1. State ---
    const [originalProducts, setOriginalProducts] = useState([]); 
    const [displayProducts, setDisplayProducts] = useState([]);   
    const [categories, setCategories] = useState([]);             
    const [isLoading, setIsLoading] = useState(true);

    const [filters, setFilters] = useState({
        MaDanhMuc: null,
        GiaMin: null,
        GiaMax: null
    });

    const { maThuongHieu } = useParams();
    useEffect(()=>{
        document.title = "Sản phẩm theo thương hiệu";
    },[])

    useEffect(() => {
        const fetchInitialData = async () => {
            if (!maThuongHieu) return;

            setIsLoading(true);
            try {
                const [productsData, catsList] = await Promise.all([
                    productService.usergetByBrand(maThuongHieu, 50),
                    categoryService.usergetAll()
                ]);

                const sortedProducts = productsData?.sort((a, b) => 
                    new Date(b.ngayTao) - new Date(a.ngayTao)
                ) || [];

                setOriginalProducts(sortedProducts);
                setDisplayProducts(sortedProducts);

                if (Array.isArray(catsList)) {
                    setCategories(catsList.map(c => ({
                        id: c.maDanhMuc, 
                        name: c.tenDanhMuc
                    })));
                }

            } catch (error) {
                handleApiError(error, "Lỗi tải dữ liệu");
                setOriginalProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, [maThuongHieu]);

    useEffect(() => {
        let result = [...originalProducts];

        if (filters.MaDanhMuc) {
            const selectedCategoryObj = categories.find(c => c.id == filters.MaDanhMuc);
            
            if (selectedCategoryObj) {
                const categoryName = selectedCategoryObj.name;
                
                result = result.filter(p => 
                    p.tenDanhMuc && p.tenDanhMuc.trim() === categoryName.trim()
                );
            }
        }

        if (filters.GiaMin !== null && filters.GiaMin !== "") {
            result = result.filter(p => Number(p.giaNhoNhat || p.giaBan) >= Number(filters.GiaMin));
        }
        if (filters.GiaMax !== null && filters.GiaMax !== "") {
            result = result.filter(p => Number(p.giaNhoNhat || p.giaBan) <= Number(filters.GiaMax));
        }

        setDisplayProducts(result);
    }, [filters, originalProducts, categories]); 

    const handleFilterChange = (type, value) => {
        setFilters(prev => {
            if (type === "Gia") {
                return { ...prev, GiaMin: value.min, GiaMax: value.max };
            }
            return { ...prev, [type]: value };
        });
    };

    const clearFilters = () => {
        setFilters({ MaDanhMuc: null, GiaMin: null, GiaMax: null });
    };

    return (
        <div className="w-full bg-stone-100 py-8 min-h-screen">
            <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-8 pt-4 pb-8 lg:pt-8 lg:pb-12 flex flex-col gap-4 lg:gap-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-[#2f9ea0] pl-3">
                        Sản phẩm thương hiệu
                    </h2>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-1/4 flex-shrink-0">
                        <FilterSidebar 
                            categories={categories} 
                            brands={[]} 
                            filters={filters}
                            showBrands={false} 
                            onFilterChange={handleFilterChange}
                        />
                    </div>

                    <div className="w-full lg:w-3/4 flex flex-col justify-between">
                        <div>
                            {isLoading ? (
                                <div className="flex justify-center items-center py-32 bg-white rounded-xl shadow-sm">
                                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-100 border-t-[#2f9ea0]"></div>
                                </div>
                            ) : (
                                displayProducts.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">    
                                        {displayProducts.map((product, index) => (
                                            <div 
                                                key={product.maSanPham || index} 
                                                className="transform hover:-translate-y-1 transition-transform duration-300"
                                            >
                                                <ProductCard product={product} />
                                            </div>
                                        ))}
                                    </div>
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
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}