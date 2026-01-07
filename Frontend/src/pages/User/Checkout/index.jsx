export default function Checkout() {
    return (
      <div className="bg-gray-100 min-h-screen py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl font-semibold mb-6">Thanh toán</h1>
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* LEFT */}
            <div className="md:col-span-2 space-y-6">
              {/* Sản phẩm */}
              <div className="bg-white rounded-lg p-6 shadow">
                <h2 className="text-lg font-medium mb-4">Sản phẩm</h2>
  
                <div className="flex items-center gap-4 border-b pb-4">
                  <img
                    src="https://via.placeholder.com/120"
                    alt="product"
                    className="w-24 h-24 object-cover rounded"
                  />
  
                  <div className="flex-1">
                    <h3 className="font-medium">
                      Laptop Dell Inspiron 15
                    </h3>
                    <p className="text-sm text-gray-500">
                      Màu: Đen | RAM: 16GB
                    </p>
                  </div>
  
                  <div className="text-right">
                    <p className="font-semibold text-red-500">
                      15.000.000 ₫
                    </p>
                    <p className="text-sm text-gray-500">
                      Số lượng: 1
                    </p>
                  </div>
                </div>
              </div>
  
              {/* Phương thức thanh toán */}
              <div className="bg-white rounded-lg p-6 shadow">
                <h2 className="text-lg font-medium mb-4">
                  Phương thức thanh toán
                </h2>
  
                <div className="space-y-3">
                  <label className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer">
                    <input type="radio" name="payment" />
                    <span>Thanh toán khi nhận hàng (COD)</span>
                  </label>
  
                  <label className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer">
                    <input type="radio" name="payment" />
                    <span>Chuyển khoản ngân hàng</span>
                  </label>
  
                  <label className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer">
                    <input type="radio" name="payment" />
                    <span>Ví điện tử (Momo, ZaloPay)</span>
                  </label>
                </div>
              </div>
            </div>
  
            {/* RIGHT */}
            <div className="bg-white rounded-lg p-6 shadow h-fit">
              <h2 className="text-lg font-medium mb-4">
                Tóm tắt đơn hàng
              </h2>
  
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>15.000.000 ₫</span>
                </div>
  
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>0 ₫</span>
                </div>
  
                <hr />
  
                <div className="flex justify-between font-semibold text-base">
                  <span>Tổng cộng</span>
                  <span className="text-red-500">
                    15.000.000 ₫
                  </span>
                </div>
              </div>
  
              <button className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium">
                Đặt hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  