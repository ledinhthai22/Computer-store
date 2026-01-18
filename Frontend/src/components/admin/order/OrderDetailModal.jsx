import { X, Package, User, Phone, MapPin, CreditCard, Calendar, FileText } from "lucide-react";

const OrderDetailModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const getStatusInfo = (status) => {
    const statusMap = {
      1: { text: "Chưa duyệt", color: "bg-gray-400 text-white" },
      2: { text: "Đã duyệt", color: "bg-orange-500 text-white" },
      3: { text: "Đang xử lý", color: "bg-orange-300 text-gray-800" },
      4: { text: "Đang giao", color: "bg-yellow-400 text-gray-800" },
      5: { text: "Đã giao", color: "bg-green-600 text-white" },
      6: { text: "Hoàn thành", color: "bg-green-400 text-white" },
      7: { text: "Đã hủy", color: "bg-red-400 text-white" },
      8: { text: "Trả hàng", color: "bg-red-600 text-white" }
    };
    return statusMap[status] || { text: "Không xác định", color: "bg-gray-200 text-gray-600" };
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes} - ${day}/${month}/${year}`;
  };

  const statusInfo = getStatusInfo(order.trangThai);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all scale-100">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Package size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Chi tiết đơn hàng</h3>
              <p className="text-sm text-blue-100">Mã: {order.maHoaDon}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex justify-center">
            <span className={`px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider ${statusInfo.color} shadow-lg`}>
              {statusInfo.text}
            </span>
          </div>

          {/* Thông tin khách hàng */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User size={20} className="text-blue-600" />
              Thông tin khách hàng
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User size={18} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Họ tên</p>
                  <p className="font-semibold text-gray-800">{order.tenKhachHang}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Số điện thoại</p>
                  <p className="font-semibold text-gray-800">{order.soDienThoai}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-semibold text-gray-800">{order.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Địa chỉ giao hàng</p>
                  <p className="font-semibold text-gray-800">{order.diaChiGiaoHang}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin đơn hàng */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-green-600" />
              Thông tin thanh toán
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar size={18} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Ngày đặt hàng</p>
                  <p className="font-semibold text-gray-800">{formatDateTime(order.ngayDatHang)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard size={18} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Tổng tiền</p>
                  <p className="text-2xl font-bold text-green-600">{formatPrice(order.tongTien)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ghi chú */}
          {order.ghiChu && (
            <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
              <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FileText size={20} className="text-amber-600" />
                Ghi chú
              </h4>
              <p className="text-gray-700 leading-relaxed">{order.ghiChu}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;