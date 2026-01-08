import { FaHeart } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import { useToast } from "../../contexts/ToastContext";

export default function Wishlist({ productId }) {
    const { user } = useAuth();
    const [liked, setLiked] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        if (!user) return;

        const list =
            JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];

        setLiked(list.includes(productId));
    }, [productId, user]);

    const toggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            showToast("Vui lòng đăng nhập để sử dụng yêu thích", "info");
            return;
        }

        let list =
            JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];

        if (list.includes(productId)) {
            list = list.filter((id) => id !== productId);

            showToast("Đã xóa khỏi danh sách yêu thích", "info");
        }
        else {
            list.push(productId);

            showToast("Đã thêm vào danh sách yêu thích", "success");
        }

        localStorage.setItem(
            `wishlist_${user.id}`,
            JSON.stringify(list)
        );

        setLiked(list.includes(productId));
    };

    return (
        <>
            <button
                onClick={toggleWishlist}
                className={`absolute top-3 right-3 bg-white p-2 rounded-full shadow transition-colors cursor-pointer
                ${liked ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
                title={liked ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                >
                <FaHeart />
            </button>
        </>
    );
}
