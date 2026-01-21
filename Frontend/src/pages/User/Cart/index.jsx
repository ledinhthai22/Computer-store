import { useCart } from "../../../contexts/CartContext";
import { Link } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import ConfirmModal from "../../../components/user/ConfirmModal";
import { useToast } from "../../../contexts/ToastContext";

export default function Cart() {
  const { cart, increase, decrease, remove } = useCart();
  const { showToast } = useToast();

  const [selectedItems, setSelectedItems] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteMode, setDeleteMode] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    document.title = "Giỏ hàng của bạn";
  }, []);

  // ================== NORMALIZE DATA ==================
  const normalizeItem = (item) => {
    const id = item.maBienThe || item.MaBienThe;
    const qty = item.soLuong || item.SoLuong || 0;

    const name =
      item.tenSanPham || item.TenSanPham || item.tenBienThe || "Sản phẩm";

    const giaBan = Number(item.giaBan || item.GiaBan || 0);
    const giaKhuyenMai = Number(
      item.giaKhuyenMai || item.GiaKhuyenMai || giaBan
    );

    const image =
      item.hinhAnh || item.duongDanAnh
        ? `https://localhost:7012/Product/Image/${item.hinhAnh || item.duongDanAnh}`
        : "https://via.placeholder.com/100";

    return {
      id,
      qty,
      name,
      price: giaKhuyenMai,       // giá KM
      originalPrice: giaBan,     // giá bán
      discount: giaBan - giaKhuyenMai,
      image,
    };
  };

  // ================== SELECT ==================
  const isAllSelected =
    cart.length > 0 && selectedItems.length === cart.length;

  const toggleSelectAll = () => {
    setSelectedItems(
      isAllSelected ? [] : cart.map((item) => normalizeItem(item).id)
    );
  };

  const toggleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // ================== TẠM TÍNH (GIÁ BÁN) ==================
  const subTotal = useMemo(() => {
    return cart
      .map(normalizeItem)
      .filter((item) => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + item.originalPrice * item.qty, 0);
  }, [cart, selectedItems]);

  // ================== ĐÃ GIẢM ==================
  const totalDiscount = useMemo(() => {
    return cart
      .map(normalizeItem)
      .filter((item) => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + item.discount * item.qty, 0);
  }, [cart, selectedItems]);

  // ================== TỔNG CỘNG ==================
  const totalPrice = subTotal - totalDiscount;

  // ================== DELETE ==================
  const handleConfirmDelete = () => {
    if (deleteMode === "single" && deleteId) {
      remove(deleteId);
      showToast("Đã xoá sản phẩm khỏi giỏ hàng", "success");
    }

    if (deleteMode === "multiple") {
      selectedItems.forEach((id) => remove(id));
      setSelectedItems([]);
      showToast("Đã xoá các sản phẩm khỏi giỏ hàng", "success");
    }

    setShowConfirm(false);
    setDeleteMode(null);
    setDeleteId(null);
  };

  // ================== RENDER ==================
  return (
    <div className="bg-gray-200 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Giỏ hàng</h1>

        {cart.length === 0 ? (
          <p className="text-gray-500">Giỏ hàng của bạn đang trống.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ================== PRODUCT LIST ================== */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 accent-[#2f9ea0]"
                  />
                  <span>Chọn tất cả ({cart.length} sản phẩm)</span>
                </div>

                {selectedItems.length > 0 && (
                  <button
                    onClick={() => {
                      setDeleteMode("multiple");
                      setShowConfirm(true);
                    }}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Xoá ({selectedItems.length})
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-105 overflow-y-auto pr-2">
                {cart.map((raw) => {
                  const item = normalizeItem(raw);

                  return (
                    <div
                      key={item.id}
                      className="group relative flex items-center gap-4 bg-gray-100/70 hover:bg-gray-200/70 transition rounded-xl p-3"
                    >
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                        className="w-4 h-4 accent-[#2f9ea0]"
                      />

                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/100")
                        }
                        className="w-20 h-20 object-cover rounded-lg bg-white shadow-sm"
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium line-clamp-2">
                          {item.name}
                        </h3>

                        {/* ===== PRICE ===== */}
                        <div className="text-sm mt-1">
                          {item.price < item.originalPrice ? (
                            <>
                              <span className="text-red-600 font-semibold">
                                {item.price.toLocaleString()}₫
                              </span>
                              <span className="ml-2 text-gray-400 line-through">
                                {item.originalPrice.toLocaleString()}₫
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-700 font-medium">
                              {item.originalPrice.toLocaleString()}₫
                            </span>
                          )}
                        </div>
                      </div>

                      {/* ===== QUANTITY ===== */}
                      <div className="mr-12 flex items-center bg-white rounded-lg shadow-sm">
                        <button
                          onClick={() => decrease(item.id, item.qty)}
                          className="px-2 py-1 hover:bg-gray-100 rounded-l-lg"
                        >
                          −
                        </button>
                        <span className="px-3 text-sm font-medium">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => increase(item.id, item.qty)}
                          className="px-2 py-1 hover:bg-gray-100 rounded-r-lg"
                        >
                          +
                        </button>
                      </div>

                      {/* ===== DELETE ===== */}
                      <button
                        onClick={() => {
                          setDeleteMode("single");
                          setDeleteId(item.id);
                          setShowConfirm(true);
                        }}
                        className="text-sm text-red-600 hover:underline absolute right-3 top-1/2 -translate-y-1/2
                        opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition"
                      >
                        Xoá
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ================== ORDER SUMMARY ================== */}
            <div className="bg-white rounded-2xl shadow-sm p-5 h-[360px] flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-4">Tổng đơn hàng</h2>

                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Tạm tính</span>
                    <span>{subTotal.toLocaleString()}₫</span>
                  </div>

                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Đã giảm</span>
                      <span>-{totalDiscount.toLocaleString()}₫</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Phí vận chuyển</span>
                    <span className="text-green-600">Miễn phí</span>
                  </div>

                  {selectedItems.length > 0 && (
                    <div className="flex justify-between text-base font-bold pt-2">
                      <span>Tổng cộng</span>
                      <span className="text-red-500">
                        {totalPrice.toLocaleString()}₫
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Link
                  to="/checkout"
                  state={{ selectedItems }}
                  className={`block mt-5 w-full text-center py-2.5 rounded-xl font-medium transition
                    ${
                      selectedItems.length === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-[#2f9ea0] text-white hover:bg-blue-500"
                    }`}
                >
                  Thanh toán
                </Link>

                {selectedItems.length === 0 && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Vui lòng chọn sản phẩm để thanh toán
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        show={showConfirm}
        title="Xác nhận xoá"
        message={
          deleteMode === "multiple"
            ? `Bạn có chắc chắn muốn xoá ${selectedItems.length} sản phẩm khỏi giỏ hàng không?`
            : "Bạn có chắc chắn muốn xoá sản phẩm này khỏi giỏ hàng không?"
        }
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
