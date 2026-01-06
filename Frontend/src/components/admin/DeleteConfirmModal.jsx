import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle size={24} />
            <h3 className="font-bold text-lg">{title || 'Xác nhận xóa'}</h3>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-600">
            {message || 'Bạn có chắc chắn muốn thực hiện hành động này? Thao tác này không thể hoàn tác.'}
          </p>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-md transition-colors disabled:bg-red-300 flex items-center gap-2"
          >
            {isLoading ? 'Đang xử lý...' : 'Xác nhận xóa'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;