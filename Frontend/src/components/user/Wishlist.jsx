import { FaHeart } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";

export default function Wishlist({ productId }) {
    const { user } = useAuth();
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        if (!user) return;

        const list = JSON.parse(
            localStorage.getItem(`wishlist_${user.id}`)
        ) || [];

        setLiked(list.includes(productId));
    }, [productId, user]);

    const toggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            alert("Vui lòng đăng nhập");
            return;
        }

        let list = JSON.parse(
            localStorage.getItem(`wishlist_${user.id}`)
        ) || [];

        if (list.includes(productId)) {
            list = list.filter(id => id !== productId);
        } else {
            list.push(productId);
        }

        localStorage.setItem(
            `wishlist_${user.id}`,
            JSON.stringify(list)
        );

        setLiked(list.includes(productId)); 
    };

    return (
        <button
            onClick={toggleWishlist}
            className={`absolute top-3 right-3 bg-white p-2 rounded-full shadow
                ${liked ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
        >
            <FaHeart />
        </button>
    );
}
