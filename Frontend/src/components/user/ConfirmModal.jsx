export default function ConfirmModal({
    show,
    title = "Xác nhận",
    message,
    onCancel,
    onConfirm
  }) {
    if (!show) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-xl shadow-lg w-[320px] p-5">
          <h3 className="text-lg font-semibold mb-3">{title}</h3>
  
          <p className="text-sm text-gray-600 mb-5">{message}</p>
  
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg text-sm bg-gray-200 hover:bg-gray-300"
            >
              Huỷ
            </button>
  
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700"
            >
              Xoá
            </button>
          </div>
        </div>
      </div>
    );
  }
  