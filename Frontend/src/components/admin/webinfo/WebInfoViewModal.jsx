import { X, Globe, Phone, MapPin, Facebook, Instagram, Youtube, Shield, RefreshCw, FileText } from "lucide-react";

const WebInfoViewModal = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Chi tiết thông tin trang</h2>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>
                <div className="p-6 space-y-6">
                    <div className="bg-blue-50 rounded-xl p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Globe size={18} className="text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 mb-1">Tên trang</p>
                                        <p className="font-semibold text-gray-900">{data.tenTrang || "N/A"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Phone size={18} className="text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 mb-1">Số điện thoại</p>
                                        <p className="font-semibold text-gray-900">{data.soDienThoai || "N/A"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-4 shadow-sm md:col-span-2">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <MapPin size={18} className="text-red-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 mb-1">Địa chỉ</p>
                                        <p className="font-semibold text-gray-900">{data.diaChi || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Media Links */}
                    <div className="bg-red-50 rounded-xl p-6">
                        <div className="space-y-3">
                            {data.duongDanFacebook && (
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Facebook size={18} className="text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 mb-1">Facebook</p>
                                            <a 
                                                href={data.duongDanFacebook} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline font-medium break-all"
                                            >
                                                {data.duongDanFacebook}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {data.duongDanInstagram && (
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-pink-100 rounded-lg">
                                            <Instagram size={18} className="text-pink-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 mb-1">Instagram</p>
                                            <a 
                                                href={data.duongDanInstagram} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-pink-600 hover:underline font-medium break-all"
                                            >
                                                {data.duongDanInstagram}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {data.duongDanYoutube && (
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-100 rounded-lg">
                                            <Youtube size={18} className="text-red-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 mb-1">Youtube</p>
                                            <a 
                                                href={data.duongDanYoutube} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-red-600 hover:underline font-medium break-all"
                                            >
                                                {data.duongDanYoutube}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!data.duongDanFacebook && !data.duongDanInstagram && !data.duongDanYoutube && (
                                <div className="text-center py-4 text-gray-500">
                                    Chưa có thông tin mạng xã hội
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Policies */}
                    <div className="bg-orange-50 rounded-xl p-6">
                        <div className="space-y-4">
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="flex items-start gap-3 mb-2">
                                    <Shield size={18} className="text-green-600 mt-1" />
                                    <h4 className="font-semibold text-gray-800">Chính sách bảo mật</h4>
                                </div>
                                <p className="text-gray-600 text-sm pl-9 whitespace-pre-wrap">
                                    {data.chinhSachBaoMat || "Chưa có thông tin"}
                                </p>
                            </div>

                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="flex items-start gap-3 mb-2">
                                    <RefreshCw size={18} className="text-blue-600 mt-1" />
                                    <h4 className="font-semibold text-gray-800">Chính sách đổi trả</h4>
                                </div>
                                <p className="text-gray-600 text-sm pl-9 whitespace-pre-wrap">
                                    {data.chinhSachDoiTra || "Chưa có thông tin"}
                                </p>
                            </div>

                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="flex items-start gap-3 mb-2">
                                    <FileText size={18} className="text-purple-600 mt-1" />
                                    <h4 className="font-semibold text-gray-800">Điều khoản sử dụng</h4>
                                </div>
                                <p className="text-gray-600 text-sm pl-9 whitespace-pre-wrap">
                                    {data.dieuKhoanSuDung || "Chưa có thông tin"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WebInfoViewModal;