import { FaHeart } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import { useToast } from "../../contexts/ToastContext";
import { WishListService } from "../../services/api/wishListService";

export default function Wishlist({ product }) {
    const { user } = useAuth();
    const [wishlistId, setWishlistId] = useState(null);
    const { showToast } = useToast();
    
    const productId = Number(product?.maSanPham || product?.id);

    useEffect(() => {
        const checkStatus = async () => {
            // Sửa logic lấy ID người dùng
            const currentUserId = user?.maNguoiDung; 
            if (currentUserId && productId) {
                try {
                    const data = await WishListService.getByUser(currentUserId);
                    const item = data.find(i => Number(i.maSanPham) === productId);
                    setWishlistId(item ? (item.maYeuThich || item.id) : null);
                } catch (error) {
                    console.error("Lỗi fetch status:", error);
                }
            }
        };
        checkStatus();
    }, [productId, user?.maNguoiDung]);

    const toggleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            showToast("Vui lòng đăng nhập", "info");
            return;
        }
        // Ép kiểu chắc chắn để tránh lỗi 400
        const currentUserId = Number(user.maNguoiDung);
        const currentProductId = Number(productId);

        if (isNaN(currentUserId) || isNaN(currentProductId)) {
            console.error("Dữ liệu không hợp lệ:", { currentUserId, currentProductId });
            return;
        }

        try {
            if (wishlistId) {
                await WishListService.delete(wishlistId);
                setWishlistId(null);
                showToast("Đã xóa khỏi yêu thích", "info");
            } else {
                const payload = {
                    maNguoiDung: currentUserId,
                    maSanPham: currentProductId
                };
                const response = await WishListService.create(payload);
                setWishlistId(response.maYeuThich || response.id);
                showToast("Đã thêm vào yêu thích", "success");
            }
            window.dispatchEvent(new CustomEvent('wishlistUpdated'));
        } catch (error) {
            console.log(error)
            showToast("Thao tác thất bại", "error");
        }
    };

    return (
        <button
            onClick={toggleWishlist}
            className={`bg-white p-2 rounded-full shadow transition-all duration-300 cursor-pointer
            ${wishlistId ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
        >
            <FaHeart />
        </button>
    );
}