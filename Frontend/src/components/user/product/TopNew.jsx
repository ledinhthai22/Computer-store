import { useState, useEffect } from "react";
import axiosClient from "../../../services/api/axiosClient";
import ProductCard from "./ProductCard"; 
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

export default function TopNew() {
    const [products, setProducts] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const ITEMS_PER_VIEW = 5;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axiosClient.get('/products?limit=100');
                const rawData = res.data && Array.isArray(res.data.items) ? res.data.items : [];

                const newestProducts = rawData.sort((a, b) => 
                    new Date(b.ngayTao) - new Date(a.ngayTao)
                );

                setProducts(newestProducts.slice(0, 20));
            } catch (error) {
                console.error("Lỗi fetch sản phẩm mới:", error);
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
        <div className="relative w-full rounded-2xl bg-stone-50 p-4 shadow-sm border border-stone-100">
            <div className="flex items-center justify-between mb-4 px-2">
                <h1 className="text-2xl font-bold text-[#2f9ea0] uppercase tracking-tight">Sản phẩm mới nhất</h1>
            </div>

            {/* Container slider */}
            <div className="relative group/slider">
                
                {/* Nút Previous */}
                <button
                    onClick={handlePrev}
                    disabled={startIndex === 0}
                    className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-100 hover:bg-[#2f9ea0] hover:text-white transition-all duration-300 -ml-2 lg:-ml-5
                    ${startIndex === 0 
                        ? "opacity-0 cursor-default" 
                        : "opacity-0 group-hover/slider:opacity-100" 
                    }`}
                >
                    <MdNavigateBefore size={28} />
                </button>

                {/* Nút Next */}
                <button
                    onClick={handleNext}
                    disabled={startIndex + ITEMS_PER_VIEW >= products.length}
                    className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-100 hover:bg-[#2f9ea0] hover:text-white transition-all duration-300 -mr-2 lg:-mr-5
                    ${startIndex + ITEMS_PER_VIEW >= products.length 
                        ? "opacity-0 cursor-default" 
                        : "opacity-0 group-hover/slider:opacity-100"
                    }`}
                >
                    <MdNavigateNext size={28} />
                </button>

                {/* Grid sản phẩm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 transition-all duration-300">
                    {visibleProducts.map(product => (
                        <ProductCard key={product.maSanPham} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}