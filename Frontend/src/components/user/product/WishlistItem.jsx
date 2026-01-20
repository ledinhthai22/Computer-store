import { useState } from "react";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

const API_BASE_URL = "https://localhost:7012";

export default function WishlistItem({ product, yeuThichId, onRemove, onAddToCart }) {
    const [isRemoving, setIsRemoving] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    if (!product) return null;

    const handleRemove = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsRemoving(true);
        await onRemove(yeuThichId);
        setIsRemoving(false);
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onAddToCart(product);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price || 0);
    };

    // Mapping đúng theo API trả về trong ảnh image_057749.png
    const getProductImage = () => {
        if (product.hinhAnhChinh) {
            return `${API_BASE_URL}/Product/Image/${product.hinhAnhChinh}`;
        }
        return "https://via.placeholder.com/300?text=No+Image";
    };

    const giaGoc = product.giaBan || 0;
    const giaHienTai = product.giaKhuyenMai || giaGoc;
    
    let phanTramGiam = 0;
    if (giaGoc > giaHienTai && giaGoc > 0) {
        phanTramGiam = Math.round(((giaGoc - giaHienTai) / giaGoc) * 100);
    }

    return (
        <div 
            className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all duration-300 ${isRemoving ? 'opacity-50' : 'hover:shadow-md'}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center gap-4">
                {/* Hình ảnh sản phẩm */}
                <Link to={`/chi-tiet-san-pham/${product.slug}`} className="flex-shrink-0">
                    <img
                        src={getProductImage()}
                        alt={product.tenSanPham}
                        className="w-24 h-24 object-cover rounded-md hover:opacity-80 transition-opacity"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/300?text=Not+Found";
                        }}
                    />
                </Link>

                {/* Thông tin sản phẩm */}
                <div className="flex-1 min-w-0">
                    <Link to={`/chi-tiet-san-pham/${product.slug}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-teal-600 transition-colors line-clamp-2 mb-1">
                            {product.tenSanPham}
                        </h3>
                    </Link>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg font-bold text-teal-600">
                            {formatPrice(giaHienTai)}
                        </span>
                        {phanTramGiam > 0 && (
                            <>
                                <span className="text-sm text-gray-400 line-through">
                                    {formatPrice(giaGoc)}
                                </span>
                                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                                    -{phanTramGiam}%
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className={`flex flex-col gap-2 flex-shrink-0 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                    <button
                        onClick={handleAddToCart}
                        disabled={isRemoving}
                        className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors disabled:bg-gray-300 whitespace-nowrap"
                    >
                        <FaShoppingCart />
                        <span className="hidden sm:inline">Thêm vào giỏ</span>
                    </button>

                    <button
                        onClick={handleRemove}
                        disabled={isRemoving}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-red-500 border border-red-500 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50 whitespace-nowrap"
                    >
                        <FaTrash />
                        <span className="hidden sm:inline">Xóa</span>
                    </button>
                </div>
            </div>
        </div>
    );
}