import { AlertTriangle, Trash2 } from "lucide-react";

const OrderDeleteModal = ({ isOpen, onClose, onConfirm, order }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all scale-100">
        
        {/* Header - Màu đỏ cảnh báo */}
        <div className="bg-red-600 text-white px-6 py-4 rounded-t-2xl flex items-center gap-3">
          <AlertTriangle size={24} className="text-red-100" />
          <h3 className="text-lg font-bold">Xác nhận xóa đơn hàng</h3>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-gray-600">
            Bạn có chắc chắn muốn chuyển đơn hàng này vào thùng rác không?
          </p>
          
          <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3">
             <div className="p-2 bg-white rounded-lg border border-red-100 shadow-sm">
                <Trash2 size={20} className="text-red-500" />
             </div>
             <div>
                <p className="text-sm font-bold text-gray-800">Đơn hàng: {order.maHoaDon}</p>
                <p className="text-xs text-gray-500 mt-1">{order.tenKhachHang}</p>
                <p className="text-xs text-red-600 mt-1 font-medium">Hành động này sẽ ẩn đơn hàng khỏi danh sách chính.</p>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end gap-3 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-gray-600 hover:bg-gray-200 hover:text-gray-800 rounded-xl transition-all font-medium text-sm"
          >
            Hủy bỏ
          </button>
          <button
            onClick={() => onConfirm(order)}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-200 transition-all font-medium text-sm flex items-center gap-2"
          >
            <Trash2 size={16} />
            Xác nhận xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDeleteModal;