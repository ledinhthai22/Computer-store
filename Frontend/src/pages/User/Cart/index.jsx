import { useCart } from "../../../contexts/CartContext";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import ConfirmModal from "../../../components/user/ConfirmModal"; // import component modal
import { useToast } from "../../../contexts/ToastContext";

export default function Cart() {
  const { cart, crease, decrease, remove } = useCart();

  const { showToast } = useToast();
  const [selectedItems, setSelectedItems] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteMode, setDeleteMode] = useState(null); // "single" | "multiple"
  const [deleteId, setDeleteId] = useState(null);

  const isAllSelected =
    cart.length > 0 && selectedItems.length === cart.length;

  const toggleSelectAll = () => {
    setSelectedItems(
      isAllSelected ? [] : cart.map((item) => item.id)
    );
  };

  const toggleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const totalPrice = useMemo(() => {
    return cart
      .filter((item) => selectedItems.includes(item.id))
      .reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
  }, [cart, selectedItems]);

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

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Giỏ hàng</h1>

        {cart.length === 0 ? (
          <p className="text-gray-500">Giỏ hàng của bạn đang trống.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 accent-indigo-600"
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
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="group relative flex items-center gap-4 bg-gray-100/70 hover:bg-gray-200/70 transition rounded-xl p-3"
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                      className="w-4 h-4 accent-indigo-600"
                    />

                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg bg-white shadow-sm"
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ${item.price}
                      </p>
                    </div>

                    <div className="mr-12 flex items-center bg-white rounded-lg shadow-sm">
                      <button
                        onClick={() => decrease(item.id)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                      >
                        −
                      </button>

                      <span className="px-3 text-sm font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => crease(item.id)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                      >
                        +
                      </button>
                    </div>

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
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div className="bg-white rounded-2xl shadow-sm p-5 h-fit">
              <h2 className="text-lg font-semibold mb-4">
                Tổng đơn hàng
              </h2>

              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>$0</span>
                </div>

                <div className="flex justify-between text-base font-bold pt-2">
                  <span>Tổng cộng</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
              </div>

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
        )}
      </div>

      {/* CONFIRM MODAL */}
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
