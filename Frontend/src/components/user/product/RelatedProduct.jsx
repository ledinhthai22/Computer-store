import { useState, useEffect } from "react";
import { productService, handleApiError } from "../../../services/api/productService";
import ProductCard from "./ProductCard"; 
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

export default function RelatedProduct() {
    const [products, setProducts] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const ITEMS_PER_VIEW = 5;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productService.usergetNewest(20);
                const sortedProducts = data.sort((a, b) => 
                    new Date(b.ngayTao) - new Date(a.ngayTao)
                );
                setProducts(sortedProducts.slice(0, 20));
            } catch (error) {
                handleApiError(error, "Lỗi fetch sản phẩm mới nhất");
                setProducts([]); 
            }
        };
        fetchProducts();
    }, []);

    const visibleProducts = products.slice(startIndex, startIndex + ITEMS_PER_VIEW);

    const handleNext = () => {
        if (startIndex + ITEMS_PER_VIEW < products.length) {
            setStartIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (startIndex > 0) {
            setStartIndex(prev => prev - 1);
        }
    };

    if (products.length === 0) return null;

    return (
        /* Chỉnh sửa 1: Thay đổi bg-stone-50 thành bg-white, thêm bo góc rounded-2xl và shadow-xl */
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
            
            {/* Chỉnh sửa 2: Căn chỉnh lại tiêu đề cho giống các section khác trong Detail */}
            <div className="flex items-center gap-3 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">
                    Sản phẩm liên quan
                </h3>
            </div>

            <div className="relative group/slider">
                {/* Nút Previous */}
                <button
                    onClick={handlePrev}
                    disabled={startIndex === 0}
                    className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg border border-gray-100 hover:bg-[#2f9ea0] hover:text-white transition-all duration-300 -ml-5
                    ${startIndex === 0 
                        ? "opacity-0 cursor-default" 
                        : "opacity-100 lg:opacity-0 lg:group-hover/slider:opacity-100" 
                    }`}
                >
                    <MdNavigateBefore size={28} />
                </button>

                {/* Nút Next */}
                <button
                    onClick={handleNext}
                    disabled={startIndex + ITEMS_PER_VIEW >= products.length}
                    className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg border border-gray-100 hover:bg-[#2f9ea0] hover:text-white transition-all duration-300 -mr-5
                    ${startIndex + ITEMS_PER_VIEW >= products.length 
                        ? "opacity-0 cursor-default" 
                        : "opacity-100 lg:opacity-0 lg:group-hover/slider:opacity-100"
                    }`}
                >
                    <MdNavigateNext size={28} />
                </button>

                {/* Grid sản phẩm - Giữ nguyên gap để thoáng đãng */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {visibleProducts.map(product => (
                        /* Đảm bảo ProductCard bên trong cũng có bo góc nhẹ và shadow khi hover */
                        <div key={product.maSanPham} className="transition-transform duration-300 hover:-translate-y-1">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}