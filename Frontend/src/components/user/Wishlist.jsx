import { FaHeart } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import UserToast from "./UserToast";

export default function Wishlist({ productId }) {
    const { user } = useAuth();
    const [liked, setLiked] = useState(false);
    const [toast, setToast] = useState(null);

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
            setToast({
                message: "Vui lòng đăng nhập để sử dụng yêu thích",
                type: "info",
            });
            return;
        }

        let list =
            JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];

        if (list.includes(productId)) {
            list = list.filter((id) => id !== productId);

            setToast({
                message: "Đã xóa khỏi danh sách yêu thích",
                type: "info",
            });
        }
        else {
            list.push(productId);

            setToast({
                message: "Đã thêm vào danh sách yêu thích",
                type: "success",
            });
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
                className={`absolute top-3 right-3 bg-white p-2 rounded-full shadow
                ${liked ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}>
                <FaHeart />
            </button>

            {toast && (
                <UserToast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
}
