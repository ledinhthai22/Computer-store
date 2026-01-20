import { createContext, useContext, useEffect, useState } from "react";
import { cartService } from "../services/api/cartService";
import { useAuth } from "./AuthProvider";
import { useToast } from "./ToastContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    if (!user?.maNguoiDung) return;
    try {
      const res = await cartService.getByUser(user.maNguoiDung);
      setCart(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Fetch cart error:", err);
    }
  };

  useEffect(() => {
    if (!user?.maNguoiDung) {
      setCart([]);
      return;
    }
    fetchCart();
  }, [user]);

  const addToCart = async (variantId, quantity = 1) => {
    try {
      await cartService.add({
        MaNguoiDung: user.maNguoiDung,
        MaBienThe: variantId,
        SoLuong: quantity,
      });
      await fetchCart();
      showToast("Đã thêm sản phẩm vào giỏ hàng", "success");
    } catch {
      showToast("Không thể thêm sản phẩm", "error");
    }
  };

  const increase = async (variantId, qty) => {
    const newQty = qty + 1;
    await cartService.update({
      MaNguoiDung: user.maNguoiDung,
      MaBienThe: variantId,
      SoLuong: newQty,
    });
    setCart((prev) =>
      prev.map((i) =>
        i.maBienThe === variantId || i.MaBienThe === variantId
          ? { ...i, soLuong: newQty, SoLuong: newQty }
          : i
      )
    );
  };

  const decrease = async (variantId, qty) => {
    if (qty <= 1) return;
    const newQty = qty - 1;
    await cartService.update({
      MaNguoiDung: user.maNguoiDung,
      MaBienThe: variantId,
      SoLuong: newQty,
    });
    setCart((prev) =>
      prev.map((i) =>
        i.maBienThe === variantId || i.MaBienThe === variantId
          ? { ...i, soLuong: newQty, SoLuong: newQty }
          : i
      )
    );
  };

  const remove = async (variantId) => {
    await cartService.remove({
      MaNguoiDung: user.maNguoiDung,
      MaBienThe: variantId,
    });
    setCart((prev) =>
      prev.filter(
        (i) =>
          i.maBienThe !== variantId && i.MaBienThe !== variantId
      )
    );
    showToast("Đã xoá sản phẩm", "success");
  };

  const totalPrice = cart.reduce((sum, item) => {
    const price =
      Number(item.giaKhuyenMai) ||
      Number(item.giaBan) ||
      Number(item.gia) ||
      0;

    const qty =
      Number(item.soLuong) ||
      Number(item.SoLuong) ||
      0;

    return sum + price * qty;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increase,
        decrease,
        remove,
        totalPrice,
        fetchCart,  // Export fetchCart để sử dụng ở Checkout
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);