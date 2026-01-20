import { useState } from "react";
import { AlertCircle } from "lucide-react";

const OrderUpdateModal = ({ isOpen, onClose, onConfirm, order }) => {
  if (!isOpen || !order) return null;

  const [selectedStatus, setSelectedStatus] = useState(order.trangThai);

  const statusOptions = [
    { value: 0, label: "Chưa duyệt", color: "bg-gray-400" },
    { value: 1, label: "Đã duyệt", color: "bg-orange-500" },
    { value: 2, label: "Đang xử lý", color: "bg-orange-300" },
    { value: 3, label: "Đang giao", color: "bg-yellow-400" },
    { value: 4, label: "Đã giao", color: "bg-green-600" },
    { value: 5, label: "Hoàn thành", color: "bg-green-400" },
    { value: 6, label: "Đã hủy", color: "bg-red-400" },
    { value: 7, label: "Trả hàng", color: "bg-red-600" }
  ];

  const handleConfirm = () => {
    onConfirm(selectedStatus);
  };

  const currentStatus = statusOptions.find(s => s.value === order.trangThai);
  const newStatus = statusOptions.find(s => s.value === selectedStatus);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-4 rounded-t-2xl">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <AlertCircle size={24} />
            Cập nhật trạng thái đơn hàng
          </h3>
          <p className="text-sm text-amber-100 mt-1">Mã: {order.maHoaDon}</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Current Status */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Trạng thái hiện tại:</p>
            <div className={`inline-flex items-center px-4 py-2 rounded-lg text-white font-semibold ${currentStatus?.color}`}>
              {currentStatus?.label}
            </div>
          </div>

          {/* New Status Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Chọn trạng thái mới:
            </label>
            <div className="grid grid-cols-2 gap-3">
              {statusOptions.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setSelectedStatus(status.value)}
                  className={`p-3 rounded-xl border-2 transition-all text-sm font-semibold ${
                    selectedStatus === status.value
                      ? `${status.color} text-white border-gray-800 shadow-lg scale-105`
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Warning */}
          {selectedStatus !== order.trangThai && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 flex items-start gap-2">
                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                <span>
                  Bạn đang cập nhật từ <strong>{currentStatus?.label}</strong> sang <strong>{newStatus?.label}</strong>
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-all font-medium"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedStatus === order.trangThai}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-medium"
          >
            Xác nhận cập nhật
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderUpdateModal