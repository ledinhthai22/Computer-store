import { useCart } from "../../../contexts/CartContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import AddressFormModal from "../../../components/user/AddressFormModal";
import ConfirmModal from "../../../components/user/ConfirmModal";
import addressService from "../../../services/api/addressService";
import { useAuth } from "../../../contexts/AuthProvider";
import { orderService, handleApiError } from "../../../services/api/orderService";
import { useToast } from "../../../contexts/ToastContext";

export default function Checkout() {
  const { cart, fetchCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const selectedVariantIds = location.state?.selectedItems || [];
  const buyNowItem = location.state?.buyNowItem;

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [initialFormData, setInitialFormData] = useState({});

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [addressIdToDelete, setAddressIdToDelete] = useState(null);

  const [orderNote, setOrderNote] = useState("");
  const [payment, setPayment] = useState("COD");

  // Kiểm tra đăng nhập
  useEffect(() => {
    if (!user) {
      navigate("/");
      showToast("Vui lòng đăng nhập!", "error");
    }
  }, [user, navigate, showToast]);

  if (!user) return null;

  // --- HÀM ĐÃ SỬA (FIX LỖI ẢNH) ---
  const normalizeItem = (item) => {
    const variantId = item.maBienThe || item.MaBienThe;
    const qty = item.soLuong || item.SoLuong || item.qty || 0;
    const name = item.tenSanPham || item.TenSanPham || item.tenBienThe || "Sản phẩm";

    const giaGoc = Number(item.giaBan || item.GiaBan || item.gia || 0);
    const giaKhuyenMai = Number(
      item.giaKhuyenMai || item.GiaKhuyenMai || item.giaKhuyenMai || giaGoc
    );

    // Lấy đường dẫn ảnh thô
    let rawImagePath = item.hinhAnh || item.duongDanAnh || item.HinhAnh || "";

    if (typeof rawImagePath === "object" && rawImagePath !== null) {
      rawImagePath = rawImagePath.duongDan || rawImagePath.path || rawImagePath.url || "";
    }

    const imagePath = String(rawImagePath || "").trim();

    // --- FIX LOGIC TẠO URL ẢNH ---
    let image = "https://via.placeholder.com/400"; // Ảnh mặc định

    if (imagePath) {
      if (imagePath.startsWith("http")) {
        // Nếu đã là link đầy đủ (ví dụ từ Buy Now), giữ nguyên
        image = imagePath;
      } else {
        // Nếu là đường dẫn tương đối, nối thêm domain server
        // Lưu ý: Đảm bảo server backend đang chạy ở port 7012
        image = `https://localhost:7012/Product/Image/${imagePath}`;
      }
    }
    // -----------------------------

    return {
      variantId,
      qty,
      name,
      giaGoc,
      giaKhuyenMai,
      discountPerItem: giaGoc - giaKhuyenMai,
      image,
      originalItem: item,
    };
  };

  const checkoutItems = useMemo(() => {
    if (buyNowItem) {
      return [normalizeItem(buyNowItem)];
    }

    if (!cart || cart.length === 0) return [];

    if (selectedVariantIds.length === 0) {
      return cart.map(normalizeItem);
    }

    return cart
      .filter((item) => {
        const variantId = item.maBienThe || item.MaBienThe;
        return selectedVariantIds.includes(variantId);
      })
      .map(normalizeItem);
  }, [cart, selectedVariantIds, buyNowItem]);

  const { totalOriginal, totalDiscount, finalTotal } = useMemo(() => {
    return checkoutItems.reduce(
      (acc, item) => {
        const original = item.giaGoc * item.qty;
        const discount = item.discountPerItem * item.qty;
        const discounted = item.giaKhuyenMai * item.qty;

        return {
          totalOriginal: acc.totalOriginal + original,
          totalDiscount: acc.totalDiscount + discount,
          finalTotal: acc.finalTotal + discounted,
        };
      },
      { totalOriginal: 0, totalDiscount: 0, finalTotal: 0 }
    );
  }, [checkoutItems]);

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoadingAddresses(true);
      try {
        const data = await addressService.getUserAddresses();
        setAddresses(data || []);

        const defaultAddr = data.find((a) => a.diaChiMacDinh) || data[0];
        if (defaultAddr) setSelectedAddressId(defaultAddr.maDiaChiNhanHang);
      } catch (err) {
        console.error("Lỗi tải địa chỉ:", err);
      } finally {
        setLoadingAddresses(false);
      }
    };

    if (user) {
        fetchAddresses();
    }
  }, [user]);

  const selectedAddress = addresses.find((a) => a.maDiaChiNhanHang === selectedAddressId);

  const openAddForm = () => {
    setIsEditing(false);
    setEditingAddressId(null);
    setInitialFormData({});
    setShowAddressForm(true);
  };

  const openEditForm = () => {
    if (!selectedAddress) return;

    setIsEditing(true);
    setEditingAddressId(selectedAddress.maDiaChiNhanHang);
    setInitialFormData({
      name: selectedAddress.tenNguoiNhan,
      phone: selectedAddress.soDienThoai,
      province: selectedAddress.tinhThanh,
      ward: selectedAddress.phuongXa,
      detail: selectedAddress.diaChi,
      diaChiMacDinh: selectedAddress.diaChiMacDinh,
    });
    setShowAddressForm(true);
  };

  const handleSaveAddress = async () => {
    try {
      const updated = await addressService.getUserAddresses();
      setAddresses(updated);

      const newDefault = updated.find((a) => a.diaChiMacDinh) || updated[0];
      if (newDefault) {
        setSelectedAddressId(newDefault.maDiaChiNhanHang);
      } else {
        setSelectedAddressId(null);
      }
    } catch (err) {
      console.error("Lỗi reload địa chỉ sau khi lưu:", err);
    }
  };

  const handleRequestDelete = (addressId) => {
    setAddressIdToDelete(addressId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!addressIdToDelete) return;

    try {
      await addressService.deleteAddress(addressIdToDelete);
      const updated = await addressService.getUserAddresses();
      setAddresses(updated);

      const newSelected =
        updated.find((a) => a.diaChiMacDinh)?.maDiaChiNhanHang ||
        updated[0]?.maDiaChiNhanHang ||
        null;
      setSelectedAddressId(newSelected);

      showToast("Đã xóa địa chỉ thành công", "success");
    } catch (err) {
      showToast("Xóa địa chỉ thất bại. Vui lòng thử lại!", "error");
    } finally {
      setShowDeleteConfirm(false);
      setAddressIdToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setAddressIdToDelete(null);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return showToast("Vui lòng chọn địa chỉ giao hàng!", "error");
    if (checkoutItems.length === 0) return showToast("Giỏ hàng trống!", "error");
    if (!user?.maNguoiDung) return showToast("Vui lòng đăng nhập để đặt hàng!", "error");

    const phuongThuc = payment === "COD" ? 1 : 2;

    try {
      let result;
      if (buyNowItem) {
        const item = checkoutItems[0];
        const request = {
          TongTienGoc: item.giaGoc * item.qty,
          TongTienThanhToan: item.giaKhuyenMai * item.qty,
          PhuongThucThanhToan: phuongThuc,
          MaKH: user.maNguoiDung,
          MaDiaChiNhanHang: selectedAddress.maDiaChiNhanHang,
          ChiTietDonHang: [{ MaBienThe: item.variantId, SoLuong: item.qty }],
          GhiChu: orderNote.trim(),
          GhiChuNoiBo: "",
          NguoiNhan: selectedAddress.tenNguoiNhan,
          SoDienThoaiNguoiNhan: selectedAddress.soDienThoai,
          TinhThanh: selectedAddress.tinhThanh,
          PhuongXa: selectedAddress.phuongXa,
          DiaChi: selectedAddress.diaChi,
        };
        result = await orderService.createOrder(request);
      } else {
        const request = {
          SelectedVariantIds: checkoutItems.map((i) => i.variantId),
          MaDiaChiNhanHang: selectedAddress.maDiaChiNhanHang,
          PhuongThucThanhToan: phuongThuc,
          TongTienGoc: totalOriginal,
          TongTienThanhToan: finalTotal,
          GhiChu: orderNote.trim(),
        };
        result = await orderService.checkoutFromCart(user.maNguoiDung, request);
        await fetchCart();
      }

      showToast("Đặt hàng thành công!", "success");
      navigate("/thanh-toan-thanh-cong");
    } catch (error) {
      const errorMessage = handleApiError(error, "Đặt hàng thất bại. Vui lòng thử lại!");
      showToast(errorMessage, "error");
    }
  };

  if (loadingAddresses) {
    return (
      <div className="bg-gray-50 min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center py-20">
            <svg className="animate-spin h-12 w-12 text-teal-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Thanh toán</h1>

        {checkoutItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <svg className="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Không có sản phẩm nào được chọn</h2>
            <p className="text-gray-600 mb-6">Vui lòng quay lại giỏ hàng và chọn sản phẩm để thanh toán</p>
            <a
              href="/cart"
              className="inline-block px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition cursor-pointer"
            >
              Quay lại giỏ hàng
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* ĐỊA CHỈ GIAO HÀNG */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Địa chỉ giao hàng
                  </h2>
                  <button
                    onClick={openAddForm}
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 transition cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm mới
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-lg font-medium mb-2">Chưa có địa chỉ giao hàng</p>
                    <button
                      onClick={openAddForm}
                      className="text-teal-600 hover:text-teal-700 font-medium hover:underline cursor-pointer"
                    >
                      Thêm địa chỉ ngay →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.length > 1 && (
                      <div>
                        <select
                          value={selectedAddressId || ""}
                          onChange={(e) => setSelectedAddressId(Number(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition cursor-pointer"
                        >
                          {addresses.map((addr) => (
                            <option key={addr.maDiaChiNhanHang} value={addr.maDiaChiNhanHang}>
                              {addr.tenNguoiNhan} - {addr.soDienThoai} - {addr.phuongXa}, {addr.tinhThanh}
                              {addr.diaChiMacDinh && " (Mặc định)"}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {selectedAddress && (
                      <div className="p-5 bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-xl">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg text-gray-900">{selectedAddress.tenNguoiNhan}</h3>
                            {selectedAddress.diaChiMacDinh && (
                              <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                Mặc định
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={openEditForm}
                              className="p-2 text-teal-600 hover:bg-teal-100 rounded-lg transition cursor-pointer"
                              title="Chỉnh sửa địa chỉ"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            {!selectedAddress.diaChiMacDinh && addresses.length > 1 && (
                              <button
                                onClick={() => handleRequestDelete(selectedAddress.maDiaChiNhanHang)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition cursor-pointer"
                                title="Xóa địa chỉ"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-gray-700 font-medium flex items-center gap-2">
                            <span>Số điện thoại:</span> {selectedAddress.soDienThoai}
                          </p>
                          <p className="text-gray-600 flex items-start gap-2">
                            <span className="mt-0.5">Địa chỉ nhận hàng:</span>
                            <span>{selectedAddress.diaChi}, {selectedAddress.phuongXa}, {selectedAddress.tinhThanh}</span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* GHI CHÚ ĐƠN HÀNG */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  Ghi chú đơn hàng
                </h2>
                <textarea
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="Ghi chú cho người bán hoặc shipper (không bắt buộc)..."
                  className="w-full h-24 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none transition"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-2 text-right">{orderNote.length}/500 ký tự</p>
              </div>

              {/* SẢN PHẨM */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-5 flex items-center gap-2">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Sản phẩm trong đơn ({checkoutItems.length})
                </h2>
                <div className="divide-y divide-gray-100">
                  {checkoutItems.map((item) => (
                    <div key={item.variantId} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                      <img
                        src={item.image}
                        onError={(e) => {
                          console.warn("Ảnh không tải được:", item.image);
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/400";
                        }}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600">
                          Số lượng: <span className="font-semibold text-gray-900">{item.qty}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        {item.giaKhuyenMai < item.giaGoc ? (
                          <>
                            <p className="font-bold text-lg text-red-600">
                              {(item.giaKhuyenMai * item.qty).toLocaleString("vi-VN")} ₫
                            </p>
                            <p className="text-sm text-gray-500 line-through">
                              {(item.giaGoc * item.qty).toLocaleString("vi-VN")} ₫
                            </p>
                          </>
                        ) : (
                          <p className="font-bold text-lg text-gray-900">
                            {(item.giaGoc * item.qty).toLocaleString("vi-VN")} ₫
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PHƯƠNG THỨC THANH TOÁN */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-5 flex items-center gap-2">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Phương thức thanh toán
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                  <label
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl cursor-pointer border-2 transition-all
                      ${payment === "COD" ? "border-teal-500 bg-teal-50 shadow-sm" : "border-gray-200 hover:border-teal-300 hover:bg-teal-50/30"}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={payment === "COD"}
                      onChange={() => setPayment("COD")}
                      className="sr-only"
                    />
                    <span className="text-3xl">💵</span>
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">COD</p>
                      <p className="text-xs text-gray-600 mt-0.5">Thanh toán khi nhận hàng</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* RIGHT - TÓM TẮT ĐƠN HÀNG */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Đơn Hàng
                </h2>

                <div className="space-y-3 mb-5 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Tổng tiền</span>
                    <span>{totalOriginal.toLocaleString("vi-VN")} ₫</span>
                  </div>

                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Đã giảm</span>
                      <span>-{totalDiscount.toLocaleString("vi-VN")} ₫</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Phí vận chuyển</span>
                    <span className="text-green-600 font-semibold">Miễn phí</span>
                  </div>

                  <hr className="border-gray-200 my-2" />

                  <div className="flex justify-between text-xl font-bold pt-1">
                    <span>Tổng cộng</span>
                    <span className="text-red-600">{finalTotal.toLocaleString("vi-VN")} ₫</span>
                  </div>
                </div>

                {orderNote.trim() && (
                  <div className="mb-5 p-4 bg-gray-50 rounded-xl text-sm border border-gray-200">
                    <p className="font-medium text-gray-700 mb-1">💬 Ghi chú:</p>
                    <p className="text-gray-600 italic">"{orderNote}"</p>
                  </div>
                )}

                <button
                  onClick={handlePlaceOrder}
                  disabled={!selectedAddress || checkoutItems.length === 0}
                  className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-4 rounded-xl font-bold text-lg transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Xác nhận đặt hàng
                </button>

                <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
                  Bằng cách đặt hàng, bạn đồng ý với{" "}
                  <a href="#" className="text-teal-600 hover:underline cursor-pointer">Điều khoản dịch vụ</a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <AddressFormModal
        isOpen={showAddressForm}
        onClose={() => setShowAddressForm(false)}
        onSave={handleSaveAddress}
        initialData={initialFormData}
        isEditing={isEditing}
        editingAddressId={editingAddressId}
      />

      <ConfirmModal
        show={showDeleteConfirm}
        title="Xác nhận xóa địa chỉ"
        message="Bạn có chắc chắn muốn xóa địa chỉ này không? Hành động này không thể hoàn tác."
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}