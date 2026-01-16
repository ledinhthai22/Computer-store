import React from "react";
import { Link } from "react-router-dom";
import Wishlist from "../Wishlist";
import { FaCartPlus, FaStar} from "react-icons/fa";
import useAddToCart from "../../../hooks/useAddToCart";

const API_BASE_URL = "https://localhost:7012";  

export default function ProductCard({ product }) {
    if (!product) return null;

    const { handleAddToCart } = useAddToCart(product);

    const getProductImage = () => {
        if (product.anhDaiDien) {
            return `${API_BASE_URL}/Product/Image/${product.anhDaiDien}`;
        }

        return "https://via.placeholder.com/300x300?text=No+Image";
    };

    const imageUrl = getProductImage();

    const giaGoc = product.giaNhoNhat || 0;
    const giaHienTai = product.giaKhuyenMaiNhoNhat || giaGoc; 
    
    let phanTramGiam = 0;
    if (giaGoc > giaHienTai && giaGoc > 0) {
        phanTramGiam = Math.round(((giaGoc - giaHienTai) / giaGoc) * 100);
    }

    const rawRating = product.danhGiaTrungBinh || 0;
    const formattedRating = rawRating.toFixed(1).replace('.', ',');

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const productLink = `/chi-tiet-san-pham/${product.slug}`;

    return (
        <div className="relative group w-full h-full">
            {/* Nút yêu thích */}
            <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Wishlist product={product} />
            </div>

            {/* Tem giảm giá */}
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
                                // Xử lý khi ảnh lỗi
                                e.target.onerror = null;
                                // console.warn("Lỗi tải ảnh:", imageUrl); 
                                e.target.src = "https://via.placeholder.com/300?text=Not+Found";
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
                    <div className="flex items-center justify-between mb-3 text-xs">
                        {/* Hiển thị số điểm (VD: 4,5 *) */}
                        {rawRating > 0 ? (
                            <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                                <span className="font-semibold text-gray-700">{formattedRating}</span>
                                <FaStar className="text-yellow-400 text-[10px] mb-0.5" />
                            </div>
                        ) : (
                            // Nếu chưa có đánh giá thì để trống hoặc hiển thị text khác
                            <span className="text-gray-400 text-[11px]">Chưa có đánh giá</span>
                        )}

                        {/* Lượt xem */}
                        <div className="flex items-center gap-1 text-gray-400" title={`đã bán ${product.luotMua}`}>
                            <span>Đã bán {product.luotMua}</span>
                        </div>
                    </div>
                    
                    <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex flex-col">
                            {phanTramGiam > 0 && (
                                <span className="text-gray-400 text-xs line-through mb-0.5">
                                    {formatCurrency(giaGoc)}
                                </span>
                            )}
                            <span className="text-[#2f9ea0] font-bold text-base lg:text-lg">
                                {formatCurrency(giaHienTai)}
                            </span>
                        </div>

                        <button 
                            onClick={handleAddToCart} 
                            title="Thêm vào giỏ"
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