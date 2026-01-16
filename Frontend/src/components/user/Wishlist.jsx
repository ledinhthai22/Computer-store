import { FaHeart } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import { useToast } from "../../contexts/ToastContext";

export default function Wishlist({ product }) {
    const { user } = useAuth();
    const [liked, setLiked] = useState(false);
    const { showToast } = useToast();

    // Lấy ID từ product object
    const productId = product?.maSanPham || product?.id;

    // Function để kiểm tra trạng thái liked
    const checkLikedStatus = () => {
        if (!user || !productId) return false;

        const list = JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];
        const validList = list.filter(item => item?.id != null);
        
        return validList.some(item => item.id === productId);
    };

    // Cập nhật trạng thái liked khi component mount và khi có thay đổi
    useEffect(() => {
        setLiked(checkLikedStatus());
    }, [productId, user]);

    // Lắng nghe event wishlistUpdated để đồng bộ trạng thái
    useEffect(() => {
        const handleWishlistUpdate = () => {
            setLiked(checkLikedStatus());
        };

        window.addEventListener('wishlistUpdated', handleWishlistUpdate);

        return () => {
            window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
        };
    }, [productId, user]);

    const toggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            showToast("Vui lòng đăng nhập để sử dụng yêu thích", "info");
            return;
        }

        // Kiểm tra productId và product hợp lệ
        if (!productId || !product) {
            console.error("Product or productId is undefined!", { product, productId });
            showToast("Lỗi: Không xác định được sản phẩm", "error");
            return;
        }

        let list = JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];
        
        // Lọc bỏ các giá trị null/undefined
        list = list.filter(item => item?.id != null);

        const existingIndex = list.findIndex(item => item.id === productId);

        if (existingIndex !== -1) {
            // Xóa khỏi wishlist
            list.splice(existingIndex, 1);
            showToast("Đã xóa khỏi danh sách yêu thích", "info");
            setLiked(false);
        } else {
            // Thêm vào wishlist - lưu cả object product
            list.push({
                id: productId,
                tenSanPham: product.tenSanPham,
                slug: product.slug,
                anhDaiDien: product.anhDaiDien,
                giaNhoNhat: product.giaNhoNhat,
                giaKhuyenMaiNhoNhat: product.giaKhuyenMaiNhoNhat,
                tenThuongHieu: product.tenThuongHieu,
                danhGiaTrungBinh: product.danhGiaTrungBinh,
                luotMua: product.luotMua
            });
            showToast("Đã thêm vào danh sách yêu thích", "success");
            setLiked(true);
        }

        localStorage.setItem(
            `wishlist_${user.id}`,
            JSON.stringify(list)
        );
        
        // Dispatch event để cập nhật TẤT CẢ các component Wishlist khác
        window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
            detail: { productId, action: existingIndex !== -1 ? 'removed' : 'added' }
        }));
    };

    return (
        <button
            onClick={toggleWishlist}
            className={`bg-white p-2 rounded-full shadow transition-all duration-300 cursor-pointer
            ${liked ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
            title={liked ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
        >
            <FaHeart />
        </button>
    );
}