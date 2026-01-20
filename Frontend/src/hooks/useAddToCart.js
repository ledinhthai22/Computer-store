import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthProvider";
import { useToast } from "../contexts/ToastContext";
import { useModalLogin } from "../contexts/ModalLoginContext";

export default function useAddToCart(variant, quantity = 1) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { openLogin } = useModalLogin();

  const handleAddToCart = () => {
    if (!user) {
      showToast("Vui lòng đăng nhập để thêm sản phẩm", "info");
      openLogin();
      return;
    }

    addToCart(variant.maBTSP, quantity);
  };

  return { handleAddToCart };
}
