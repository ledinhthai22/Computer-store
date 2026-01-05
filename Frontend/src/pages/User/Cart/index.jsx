import { useCart } from "../../../contexts/CartContext";
import { Link } from "react-router-dom";
export default function Cart() {
  const { cart, crease, decrease, remove, totalPrice } = useCart();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Giỏ hàng của bạn</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">Giỏ hàng của bạn đang trống.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Danh sách sản phẩm */}
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border rounded-lg p-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-500">{item.price}$</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => decrease(item.id)}
                    className="px-3 py-1 border rounded"
                  >
                    -
                  </button>

                  <span className="font-medium">{item.quantity}</span>
                  <button
                    onClick={() => crease(item.id)}
                    className="px-3 py-1 border rounded"
                  >
                    +
                  </button>

                  <button
                    onClick={() => remove(item.id)}
                    className="text-red-500 hover:underline"
                  >
                    Xoá
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Tổng tiền */}
          <div className="border rounded-lg p-4 h-fit">
            <h2 className="text-lg font-semibold mb-4">Tổng đơn hàng</h2>

            <div className="flex justify-between mb-2">
              <span>Tạm tính</span>
              <span>{totalPrice.toLocaleString()}$</span>
            </div>

            <div className="flex justify-between mb-4">
              <span>Phí vận chuyển</span>
              <span>0$</span>
            </div>

            <div className="flex justify-between font-bold text-lg">
              <span>Tổng cộng</span>
              <span>{totalPrice.toLocaleString()}$</span>
            </div>

            <button className="mt-6 w-full bg-[#2f9ea0] text-white py-2 rounded hover:bg-blue-700">
              <Link to={`/checkout`}>Thanh toán</Link>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
