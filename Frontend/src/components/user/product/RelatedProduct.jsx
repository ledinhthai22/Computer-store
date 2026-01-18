import { useState, useEffect } from "react";
import { productService, handleApiError } from "../../../services/api/productService";
import ProductCard from "./ProductCard"; 
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

// Thêm props productId vào component
export default function RelatedProduct({ productId }) {
    const [products, setProducts] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const ITEMS_PER_VIEW = 5;

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            if (!productId) return; // Nếu chưa có ID thì không gọi API
            
            try {
                // Sử dụng API usergetRelated thay vì usergetNewest
                const data = await productService.usergetRelated(productId);
                
                // Giả sử API trả về mảng sản phẩm, ta set luôn vào state
                // Nếu cần sắp xếp theo ngày như cũ thì giữ lại hàm sort
                setProducts(data || []);
                setStartIndex(0); // Reset slide về đầu khi đổi sản phẩm
            } catch (error) {
                handleApiError(error, "Lỗi fetch sản phẩm liên quan");
                setProducts([]); 
            }
        };

        fetchRelatedProducts();
    }, [productId]); // Chạy lại mỗi khi productId thay đổi

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

    return (
        <div className="mt-8 mb-8 bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
                <h3 className="text-2xl font-bold text-gray-900">
                    CÓ THỂ BẠN CŨNG THÍCH
                </h3>
            </div>

            <div className="relative group/slider">
                {products.length > 0 ? (
                    <>
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

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {visibleProducts.map(product => (
                        <div key={product.maSanPham} className="transition-transform duration-300 hover:-translate-y-1">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </>
                ) : (
                    /* Hiển thị thông báo khi không có sản phẩm */
                    <div className="text-center py-10">
                        <p className="text-gray-500">Hiện tại không có sản phẩm liên quan nào.</p>
                    </div>
                )}
            </div>
        </div>
    );
}