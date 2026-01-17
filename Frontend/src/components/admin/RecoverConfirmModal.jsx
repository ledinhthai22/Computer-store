const RestoreConfirmModal = ({ isOpen, message, onConfirm, onCancel, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">

        {/* Body */}
        <div className="p-6 text-center">
          <p className="text-gray-600 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 flex justify-center gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transition-all active:scale-95 disabled:bg-green-300 flex items-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Đang xử lý...
              </>
            ) : (
              'Xác nhận'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestoreConfirmModal;