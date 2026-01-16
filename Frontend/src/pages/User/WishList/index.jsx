import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthProvider";
import WishlistItem from "../../../components/user/product/WishlistItem";
import TopNew from "../../../components/user/product/TopNew";
import { Navigate } from "react-router-dom";
import { useToast } from "../../../contexts/ToastContext";

export default function WishList() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchWishlistProducts = () => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        const wishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];
        
        // Lọc bỏ các giá trị null/undefined
        const validProducts = wishlist.filter(item => item?.id != null);

        console.log("Wishlist products:", validProducts);

        setProducts(validProducts);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchWishlistProducts();
    }, [user]);

    // Lắng nghe sự kiện cập nhật wishlist
    useEffect(() => {
        const handleWishlistUpdate = (e) => {
            console.log("WishList page received update event:", e.detail);
            fetchWishlistProducts();
        };
        
        window.addEventListener('wishlistUpdated', handleWishlistUpdate);
        
        return () => {
            window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
        };
    }, [user]);

    const handleRemove = async (productId) => {
        if (!user) return;

        let list = JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];
        list = list.filter(item => item?.id !== productId && item?.id != null);
        localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(list));

        setProducts(list);
        
        showToast("Đã xóa khỏi danh sách yêu thích", "info");
        
        // Dispatch event để cập nhật các nút wishlist khác
        window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
            detail: { productId, action: 'removed' }
        }));
    };

    const handleAddToCart = (product) => {
        if (!user) return;

        let cart = JSON.parse(localStorage.getItem(`cart_${user.id}`)) || [];
        
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        
        localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
        
        showToast("Đã thêm vào giỏ hàng", "success");
    };

    if (!user) {
        return <Navigate to="/dang-nhap"/>;
    }
    
    if(user.vaiTro === "QuanTriVien") {
        return <Navigate to="/quan-ly" />;
    }

    return (
        <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-2xl font-bold mb-6">Sản phẩm yêu thích</h1>

            {isLoading ? (
                <p className="text-gray-500">Đang tải...</p>
            ) : products.length === 0 ? (
                <p className="text-gray-500">
                    Bạn chưa có sản phẩm yêu thích nào
                </p>
            ) : (
                <div 
                    className="space-y-4 mb-8 overflow-y-auto pr-2" 
                    style={{ maxHeight: '600px' }}
                >
                    {products.map(product => (
                        <WishlistItem
                            key={product.id}
                            product={product}
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