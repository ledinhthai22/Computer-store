import { useState, useEffect } from "react";
import { productService, handleApiError } from "../../../services/api/productService";
import ProductCard from "./ProductCard"; 
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

export default function TopNew() {
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


    const visibleProducts = products.slice(
        startIndex,
        startIndex + ITEMS_PER_VIEW
    );

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
        <div className="relative w-full bg-stone-50 p-2 sm:p-4 shadow-sm border border-stone-100">
            <div className="flex items-center justify-center mb-8">
                <div className="relative">
                    <h1 className="text-2xl lg:text-3xl font-bold text-[#2f9ea0] uppercase tracking-tight text-center relative z-10 px-4 bg-stone-50">
                        SẢN PHẨM MỚI NHẤT
                    </h1>
                    <div className="absolute w-full h-[2px] bg-gray-200 top-1/2 left-0 -z-0"></div>
                </div>
            </div>

            {/* Container slider */}
            <div className="relative group/slider px-2 sm:px-0">
                
                {/* Nút Previous */}
                <button
                    onClick={handlePrev}
                    disabled={startIndex === 0}
                    className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-100 hover:bg-[#2f9ea0] hover:text-white transition-all duration-300 -ml-2 lg:-ml-5
                    ${startIndex === 0 
                        ? "opacity-0 cursor-default" 
                        : "opacity-100 lg:opacity-0 lg:group-hover/slider:opacity-100" 
                    }`}
                >
                    <MdNavigateBefore size={24} className="lg:hidden" />
                    <MdNavigateBefore size={28} className="hidden lg:block" />
                </button>

                {/* Nút Next */}
                <button
                    onClick={handleNext}
                    disabled={startIndex + ITEMS_PER_VIEW >= products.length}
                    className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-100 hover:bg-[#2f9ea0] hover:text-white transition-all duration-300 -mr-2 lg:-mr-5
                    ${startIndex + ITEMS_PER_VIEW >= products.length 
                        ? "opacity-0 cursor-default" 
                        : "opacity-100 lg:opacity-0 lg:group-hover/slider:opacity-100"
                    }`}
                >
                    <MdNavigateNext size={24} className="lg:hidden" />
                    <MdNavigateNext size={28} className="hidden lg:block" />
                </button>

                {/* Grid sản phẩm */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 transition-all duration-300">
                    {visibleProducts.map(product => (
                        <ProductCard key={product.maSanPham} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}