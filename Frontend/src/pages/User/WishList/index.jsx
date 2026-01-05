import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthProvider";
import ProductCard from "../../../components/user/ProductCard";

export default function WishList() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (!user) return;

        const ids = JSON.parse(
            localStorage.getItem(`wishlist_${user.id}`)
        ) || [];

        if (ids.length === 0) {
            setProducts([]);
            return;
        }

        Promise.all(
            ids.map(id =>
                fetch(`https://dummyjson.com/products/${id}`)
                    .then(res => res.json())
                    .catch(() => null)
            )
        ).then(data => {
            setProducts(data.filter(Boolean)); // 🔑 FIX CARD TRỐNG
        });
    }, [user]);

    if (!user) {
        return <p className="text-center mt-10">Vui lòng đăng nhập</p>;
    }

    return (
        <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-2xl font-bold mb-6">❤️ Sản phẩm yêu thích</h1>

            {products.length === 0 ? (
                <p className="text-gray-500">
                    Bạn chưa có sản phẩm yêu thích nào
                </p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {products.map(p => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            )}
        </div>
    );
}
