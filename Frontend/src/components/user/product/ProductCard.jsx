import React from "react";
import { Link } from "react-router-dom";
import Wishlist from "../Wishlist";
import { FaCartPlus } from "react-icons/fa";
import useAddToCart from "../../../hooks/useAddToCart";

export default function ProductCard({ product }) {
    const { handleAddToCart } = useAddToCart(product);

    const getProductImage = () => {
        if (product.bienThe && product.bienThe.length > 0) {
            const firstVariant = product.bienThe[0];
            if (firstVariant.hinhAnh && firstVariant.hinhAnh.length > 0) {
                const fileName = firstVariant.hinhAnh[0];
                
                if (fileName.startsWith('http')) {
                    return fileName;
                }
                return `/images/products/${fileName}`; //wwwroot/images/products/
            }
        }
        return "https://via.placeholder.com/300x300?text=No+Image";
    };

    const imageUrl = getProductImage();

    const giaGoc = product.giaCoBan || 0;
    const phanTramGiam = product.khuyenMai || 0;
    const giaSauGiam = giaGoc - (giaGoc * phanTramGiam / 100);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const productLink = `/san-pham/${product.slug}`;

    return (
        <div className="relative group w-full h-full">
            <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Wishlist product={product} />
            </div>

            {phanTramGiam > 0 && (
                <div className="absolute top-3 left-3 z-20 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                    -{phanTramGiam}%
                </div>
            )}

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-[#2f9ea0] transition-all duration-300 flex flex-col h-full overflow-hidden">
                <Link to={productLink} className="block relative overflow-hidden">
                    <div className="w-full aspect-square bg-white flex items-center justify-center p-6">
                        <img 
                            src={imageUrl} 
                            alt={product.tenSanPham} 
                            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/300?text=No+Image";
                            }}
                        />
                    </div>
                </Link>

                <div className="p-4 flex flex-col flex-grow">
                    <span className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-medium">
                        {product.tenThuongHieu || "Computer Store"}
                    </span>
                    
                    <Link to={productLink} className="mb-2">
                        <h2 className="font-semibold text-gray-800 line-clamp-2 text-sm hover:text-[#2f9ea0] transition-colors min-h-[40px]" title={product.tenSanPham}>
                            {product.tenSanPham}
                        </h2>
                    </Link>
                    
                    <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex flex-col">
                            {phanTramGiam > 0 && (
                                <span className="text-gray-400 text-xs line-through mb-0.5">
                                    {formatCurrency(giaGoc)}
                                </span>
                            )}
                            <span className="text-[#2f9ea0] font-bold text-base lg:text-lg">
                                {formatCurrency(giaSauGiam)}
                            </span>
                        </div>

                        <button 
                            onClick={handleAddToCart} 
                            title="Thêm vào giỏ hàng" 
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-[#2f9ea0] hover:text-white transition-all duration-300 shadow-sm cursor-pointer"
                        >
                            <FaCartPlus size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}