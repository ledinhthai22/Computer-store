import React from 'react';
import { RotateCcw, X } from 'lucide-react';

const RestoreConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2 text-green-600">
            <RotateCcw size={24} />
            <h3 className="font-bold text-lg">{title || 'Xác nhận khôi phục'}</h3>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-600 leading-relaxed">
            {message || 'Bạn có chắc chắn muốn khôi phục mục này? Dữ liệu sẽ được đưa trở lại danh sách hoạt động.'}
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
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transition-all active:scale-95 disabled:bg-green-300 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Đang xử lý...
              </>
            ) : (
              'Xác nhận khôi phục'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestoreConfirmModal;