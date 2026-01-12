import { Link } from "react-router-dom";
import { FaCartPlus, FaTrashAlt } from "react-icons/fa";
import useAddToCart from "../../../hooks/useAddToCart";

const WishlistItem = ({ product, onRemove }) => {
    const { handleAddToCart } = useAddToCart(product);

    const getProductImage = () => {
        if (product.bienThe && product.bienThe.length > 0) {
            const firstVariant = product.bienThe[0];
            if (firstVariant.hinhAnh && firstVariant.hinhAnh.length > 0) {
                const fileName = firstVariant.hinhAnh[0];
                return fileName.startsWith('http') ? fileName : `/images/products/${fileName}`;
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

    return (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex items-center p-4 mb-4 group w-full relative">
            <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-white rounded-lg overflow-hidden border border-gray-50">
                <Link to={`/san-pham/${product.slug}`}>
                    <img 
                        src={imageUrl} 
                        alt={product.tenSanPham} 
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                </Link>
            </div>

            <div className="flex-grow px-4 md:px-8">
                <div className="flex flex-col">
                    <span className="text-[10px] md:text-xs text-[#2f9ea0] font-bold uppercase tracking-widest mb-1">
                        {product.tenThuongHieu || "Computer Store"}
                    </span>
                    <Link to={`/san-pham/${product.slug}`}>
                        <h2 className="text-sm md:text-xl font-bold text-gray-800 hover:text-[#2f9ea0] transition-colors line-clamp-2">
                            {product.tenSanPham}
                        </h2>
                    </Link>
                    <div className="mt-2 flex items-center gap-3 md:hidden">
                        <span className="text-[#2f9ea0] font-bold">{formatCurrency(giaSauGiam)}</span>
                        {phanTramGiam > 0 && (
                            <span className="text-xs text-red-500">-{phanTramGiam}%</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="hidden md:flex flex-col items-end justify-center px-8 border-l border-gray-100 min-w-[200px]">
                {phanTramGiam > 0 && (
                    <span className="text-gray-400 text-sm line-through mb-1">
                        {formatCurrency(giaGoc)}
                    </span>
                )}
                <span className="text-[#2f9ea0] font-black text-2xl">
                    {formatCurrency(giaSauGiam)}
                </span>
                {phanTramGiam > 0 && (
                    <span className="mt-1 text-[10px] bg-red-50 text-red-600 font-bold px-2 py-1 rounded">
                        GIẢM {phanTramGiam}%
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-2 ml-4 border-l pl-4 border-gray-100">
                <button 
                    onClick={handleAddToCart}
                    className="flex items-center justify-center gap-2 bg-[#2f9ea0] hover:bg-black text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
                >
                    <FaCartPlus />
                    <span className="hidden sm:inline">MUA NGAY</span>
                </button>
                <button 
                    onClick={() => onRemove(product.id)}
                    className="flex items-center justify-center gap-2 text-gray-400 hover:text-red-600 hover:bg-red-50 py-2 rounded-lg text-xs transition-all"
                    title="Xóa khỏi yêu thích"
                >
                    <FaTrashAlt />
                    <span className="hidden sm:inline">Xóa</span>
                </button>
            </div>
        </div>
    );
};

export default WishlistItem;