import { useCart } from "../../../contexts/CartContext";
import { useLocation } from "react-router-dom";
import { useState, useMemo } from "react";

export default function Checkout() {
  const { cart } = useCart();
  const location = useLocation();

  /* ================== CART ================== */
  const selectedIds = location.state?.selectedItems || [];
  const checkoutItems = cart.filter(item =>
    selectedIds.includes(item.id)
  );

  /* ================== ADDRESS ================== */
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      phone: "0901234567",
      province: "Hồ Chí Minh",
      city: "Thủ Đức",
      ward: "Linh Trung",
      detail: "Số 12, đường ABC",
      isDefault: true
    }
  ]);

  const [selectedAddressId, setSelectedAddressId] = useState(1);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    province: "",
    city: "",
    ward: "",
    detail: ""
  });

  const handleAddAddress = () => {
    if (!newAddress.name || !newAddress.phone) return;

    const newId = Date.now();

    setAddresses(prev => [
      ...prev,
      {
        ...newAddress,
        id: newId,
        isDefault: false
      }
    ]);

    setSelectedAddressId(newId);
    setShowAddressForm(false);
    setNewAddress({
      name: "",
      phone: "",
      province: "",
      city: "",
      ward: "",
      detail: ""
    });
  };

  const handleDeleteAddress = (id) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));

    if (selectedAddressId === id) {
      setSelectedAddressId(addresses[0].id);
    }
  };

  /* ================== PAYMENT ================== */
  const [payment, setPayment] = useState("COD");

  /* ================== TOTAL ================== */
  const totalPrice = useMemo(() => {
    return checkoutItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [checkoutItems]);

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-6">Thanh toán</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="md:col-span-2 space-y-6">

            {/* ĐỊA CHỈ */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">
                  Địa chỉ giao hàng
                </h2>
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  + Thêm địa chỉ
                </button>
              </div>

              <div className="space-y-3">
                {addresses.map(addr => {
                  const isSelected = selectedAddressId === addr.id;

                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`
                        relative cursor-pointer rounded-xl p-4 transition
                        ${isSelected
                          ? "bg-blue-50 ring-2 ring-blue-500"
                          : "bg-gray-50 hover:bg-gray-100"}
                      `}
                    >
                      {/* RADIO */}
                      <input
                        type="radio"
                        checked={isSelected}
                        readOnly
                        className="absolute top-4 left-4 accent-blue-600"
                      />

                      {/* CONTENT */}
                      <div className="pl-7">
                        <p className="font-medium">
                          {addr.name} | {addr.phone}
                          {addr.isDefault && (
                            <span className="ml-2 text-xs text-green-600">
                              (Mặc định)
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {addr.detail}, {addr.ward}, {addr.city}, {addr.province}
                        </p>
                      </div>

                      {/* DELETE */}
                      {!addr.isDefault && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(addr.id);
                          }}
                          className="
                            absolute top-4 right-4 text-xs text-red-500
                            hover:underline
                          "
                        >
                          Xoá
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SẢN PHẨM */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-4">
                Sản phẩm
              </h2>

              <div className="space-y-4">
                {checkoutItems.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 pb-4 border-b border-gray-100"
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="font-medium line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Số lượng: {item.quantity}
                      </p>
                    </div>

                    <div className="font-semibold text-red-500">
                      {(item.price * item.quantity).toLocaleString()} ₫
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* THANH TOÁN */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-4">
                Phương thức thanh toán
              </h2>

              <div className="space-y-3">
                {[
                  { id: "COD", label: "Thanh toán khi nhận hàng (COD)" },
                  { id: "BANK", label: "Chuyển khoản ngân hàng" },
                  { id: "WALLET", label: "Ví điện tử (Momo, ZaloPay)" }
                ].map(p => (
                  <label
                    key={p.id}
                    className={`
                      flex items-center gap-3 p-3 rounded-xl cursor-pointer
                      ${payment === p.id
                        ? "bg-blue-50 ring-2 ring-blue-500"
                        : "bg-gray-50 hover:bg-gray-100"}
                    `}
                  >
                    <input
                      type="radio"
                      checked={payment === p.id}
                      onChange={() => setPayment(p.id)}
                    />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-xl p-6 shadow-sm h-fit">
            <h2 className="text-lg font-medium mb-4">
              Tóm tắt đơn hàng
            </h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>{totalPrice.toLocaleString()} ₫</span>
              </div>

              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span>0 ₫</span>
              </div>

              <hr />

              <div className="flex justify-between font-semibold text-base">
                <span>Tổng cộng</span>
                <span className="text-red-500">
                  {totalPrice.toLocaleString()} ₫
                </span>
              </div>
            </div>

            <button className="mt-6 w-full bg-[#2f9ea0] hover:bg-blue-500 text-white py-3 rounded-xl font-medium">
              Đặt hàng
            </button>
          </div>
        </div>
      </div>

      {/* POPUP THÊM ĐỊA CHỈ */}
      {showAddressForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-7 w-[420px] shadow-lg">
            <h3 className="font-semibold text-lg mb-6">
              Thêm địa chỉ giao hàng
            </h3>

            <div className="space-y-5 text-sm">
              {[
                { key: "name", placeholder: "Họ tên" },
                { key: "phone", placeholder: "Số điện thoại" },
                { key: "province", placeholder: "Tỉnh / Thành phố", type: "select" },
                { key: "city", placeholder: "Quận / Huyện", type: "select" },
                { key: "ward", placeholder: "Phường / Xã", type: "select" },
                { key: "detail", placeholder: "Địa chỉ chi tiết" }
              ].map(f =>
                f.type === "select" ? (
                  <select
                    key={f.key}
                    className="w-full h-11 px-4 rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    onChange={e =>
                      setNewAddress({ ...newAddress, [f.key]: e.target.value })
                    }
                  >
                    <option value="">{f.placeholder}</option>
                  </select>
                ) : (
                  <input
                    key={f.key}
                    placeholder={f.placeholder}
                    className="w-full h-11 px-4 rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    onChange={e =>
                      setNewAddress({ ...newAddress, [f.key]: e.target.value })
                    }
                  />
                )
              )}
            </div>

            <div className="flex justify-end gap-4 mt-7">
              <button
                onClick={() => setShowAddressForm(false)}
                className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Huỷ
              </button>
              <button
                onClick={handleAddAddress}
                className="px-5 py-2 rounded-lg bg-[#2f9ea0] text-white hover:bg-blue-500"
              >
                Lưu địa chỉ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
