import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthProvider";
import { useToast } from "../contexts/ToastContext";

export default function useAddToCart(product) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!user) {
      showToast("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng", "info");
      navigate("/login");
      return;
    }

    addToCart(product);
    showToast("Đã thêm sản phẩm vào giỏ hàng", "success");
  };

  return { handleAddToCart };
}
