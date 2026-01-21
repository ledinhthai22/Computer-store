export default function SessionLoading() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
  
          {/* Text */}
          <p className="text-gray-600 text-sm">
            Đang tải...
          </p>
        </div>
      </div>
    );
  }
  