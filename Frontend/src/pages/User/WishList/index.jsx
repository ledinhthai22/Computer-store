import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthProvider";
import WishlistItem from "../../../components/user/product/WishlistItem";
import TopNew from "../../../components/user/product/TopNew";
import { Navigate } from "react-router-dom";
import { useToast } from "../../../contexts/ToastContext";
import { WishListService } from "../../../services/api/wishListService";

export default function WishList() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchWishlist = async () => {
        try {
            const data = await WishListService.getByUser(user.maNguoiDung);
            setWishlistItems(data);
        } catch (error) {
            console.log(error)
            showToast("Không thể tải danh sách", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        document.title = "Sản phẩm yêu thích";
        fetchWishlist();
    }, [user.maNguoiDung]);

    // Lắng nghe sự kiện cập nhật để reload data
    useEffect(() => {
        const handleUpdate = () => fetchWishlist();
        window.addEventListener('wishlistUpdated', handleUpdate);
        return () => window.removeEventListener('wishlistUpdated', handleUpdate);
    }, [user]);

    const handleRemove = async (yeuThichId) => {
        try {
            await WishListService.delete(yeuThichId);
            setWishlistItems(prev => prev.filter(item => (item.maYeuThich || item.id) !== yeuThichId));
            showToast("Đã xóa thành công", "info");
            window.dispatchEvent(new CustomEvent('wishlistUpdated'));
        } catch (error) {
            console.error(error);
            showToast("Lỗi khi xóa sản phẩm", "error");
        }
    };

    const handleAddToCart = (product) => {
        // Giữ nguyên logic giỏ hàng của bạn (thường giỏ hàng cũng nên đưa lên DB sau này)
        let cart = JSON.parse(localStorage.getItem(`cart_${user.id}`)) || [];
        const existingItem = cart.find(item => item.id === (product.maSanPham || product.id));
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, id: product.maSanPham || product.id, quantity: 1 });
        }
        localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
        showToast("Đã thêm vào giỏ hàng", "success");
    };

    if (!user) return <Navigate to="/dang-nhap"/>;
    if (user.vaiTro === "QuanTriVien") return <Navigate to="/quan-ly" />;

    return (
        <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-2xl font-bold mb-6">Sản phẩm yêu thích</h1>

            {isLoading ? (
                <p>Đang tải...</p>
            ) : wishlistItems.length === 0 ? (
                <p className="text-gray-500">Bạn chưa có sản phẩm yêu thích nào</p>
            ) : (
                <div className="space-y-4 mb-8 overflow-y-auto pr-2" style={{ maxHeight: '600px' }}>
                    {wishlistItems.map(item => (
                        <WishlistItem
                            key={item.maYeuThich}
                            product={item} 
                            yeuThichId={item.maYeuThich} 
                            onRemove={handleRemove}
                            onAddToCart={handleAddToCart}
                        />
                    ))}
                </div>
            )}
            <TopNew/>
        </div>
    );
}