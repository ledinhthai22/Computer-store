import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthProvider";
import { useToast } from "../contexts/ToastContext";
import { useModalLogin } from "../contexts/ModalLoginContext";

export default function useAddToCart(product) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  
  const { openLogin } = useModalLogin(); 

  const handleAddToCart = () => {
    if (!user) {
      showToast("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng", "info");
      openLogin(); 
      return;
    }

    addToCart(product);
    showToast("Đã thêm sản phẩm vào giỏ hàng", "success");
  };

  return { handleAddToCart };
}