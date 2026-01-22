import { X, Settings, FileText, ToggleLeft, Calendar, Trash2 } from "lucide-react";

const WebInfoViewModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const isActive = data.trangThaiHienThi === true;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            Chi tiết cấu hình website
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={22} className="text-gray-500" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-5">
          {/* KEY */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Settings size={18} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Khóa cấu hình</p>
                <p className="font-semibold text-gray-900 break-all">
                  {data.tenKhoaCaiDat}
                </p>
              </div>
            </div>
          </div>

          {/* VALUE */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText size={18} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Giá trị cấu hình</p>
                <p className="text-gray-800 whitespace-pre-wrap break-all">
                  {data.giaTriCaiDat || "—"}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText size={18} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Tóm tắt</p>
                <p className="text-gray-800 whitespace-pre-wrap break-all">
                  {data.tomTat || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText size={18} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Mô tả</p>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {data.moTa || "Không có mô tả"}
                </p>
              </div>
            </div>
          </div>

          {/* STATUS */}
          <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-200 rounded-lg">
                <ToggleLeft size={18} className="text-gray-700" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Trạng thái hiển thị</p>
                <p className="font-semibold">
                  {isActive ? "Hoạt động" : "Ngưng hiển thị"}
                </p>
              </div>
            </div>

            <span
              className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                isActive
                  ? "bg-green-100 text-green-700 border-green-200"
                  : "bg-gray-100 text-gray-600 border-gray-200"
              }`}
            >
              {isActive ? "ACTIVE" : "INACTIVE"}
            </span>
          </div>

          {/* DATES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Calendar size={18} className="text-blue-600 mt-1" />
                <div>
                  <p className="text-xs text-gray-500">Ngày cập nhật</p>
                  <p className="font-medium text-gray-800">
                    {new Date(data.ngayCapNhat).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>
            </div>

            {data.ngayXoa && (
              <div className="bg-red-50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Trash2 size={18} className="text-red-600 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500">Ngày xóa</p>
                    <p className="font-medium text-red-700">
                      {new Date(data.ngayXoa).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebInfoViewModal;
