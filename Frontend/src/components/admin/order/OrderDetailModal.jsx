import { useState, useEffect } from "react";
import { X, Package, User, Phone, MapPin, CreditCard, Calendar, FileText, Edit, Save, RotateCcw,Wallet } from "lucide-react";

//  Thêm prop onUpdate vào component
const OrderDetailModal = ({ isOpen, onClose, order, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  //  SỬA 1: Map dữ liệu đúng theo key của Backend (JSON dòng đầu bạn gửi)
  useEffect(() => {
    if (order) {
      // 1. Tạo mảng chứa các thành phần địa chỉ
      const addressParts = [
        order.diaChi,      
        order.phuongXa,    
        order.tinhThanh    
      ];

      // 2. Lọc bỏ các giá trị null/undefined/rỗng và nối lại bằng dấu phẩy
      const fullAddress = addressParts
        .filter(part => part && part.toString().trim() !== "") 
        .join(", "); 

      // 3. Nếu không ghép được (do thiếu dữ liệu lẻ), dùng order.diaChiGiaoHang làm fallback
      const finalAddress = fullAddress || order.diaChiGiaoHang || "";

      setFormData({
        nguoiNhan: order.tenKhachHang || "",
        soDienThoaiNguoiNhan: order.soDienThoai || "",
        
        diaChi: finalAddress, //  Đưa chuỗi đã ghép vào formData
        
        ghiChu: order.ghiChu || "",
        ghiChuNoiBo: order.ghiChuNoiBo || "",
        
        tinhThanh: order.tinhThanh || "", 
        phuongXa: order.phuongXa || ""
      });
    }
    setIsEditing(false);
  }, [order, isOpen]);

  if (!isOpen || !order) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

 const handleSave = () => {
    const fullAddressString = formData.diaChi || "";
    
    const parts = fullAddressString.split(",").map(p => p.trim()).filter(p => p !== "");

    let finalTinhThanh = order.tinhThanh || "";
    let finalPhuongXa = order.phuongXa || "";
    let finalDiaChiCuThe = fullAddressString; 
    if (parts.length >= 3) {
        finalTinhThanh = parts[parts.length - 1]; 
        finalPhuongXa = parts[parts.length - 2]; 
        
        finalDiaChiCuThe = parts.slice(0, parts.length - 2).join(", ");
    } 
    else if (parts.length === 2) {
        finalTinhThanh = parts[1];
        finalPhuongXa = parts[0]; 
        finalDiaChiCuThe = parts[0];
    }

    const payload = {
      ...formData,
      diaChi: finalDiaChiCuThe,
      tinhThanh: finalTinhThanh, 
      phuongXa: finalPhuongXa,   
    };

    try {
        console.log("Payload gửi đi:", payload);
        onUpdate(order.maDonHang, payload); 
        setIsEditing(false); 
    } catch (error) {
        console.error("Lỗi update ở modal", error);
    }
  };
  const getStatusInfo = (status) => {
    const statusMap = {
      0: { text: "Chưa duyệt", color: "bg-gray-400 text-white" },
      1: { text: "Đã duyệt", color: "bg-orange-500 text-white" },
      2: { text: "Đang xử lý", color: "bg-orange-300 text-gray-800" },
      3: { text: "Đang giao", color: "bg-yellow-400 text-gray-800" },
      4: { text: "Đã giao", color: "bg-green-600 text-white" },
      5: { text: "Hoàn thành", color: "bg-green-400 text-white" },
      6: { text: "Đã hủy", color: "bg-red-400 text-white" },
      7: { text: "Trả hàng", color: "bg-red-600 text-white" }
    };
    return statusMap[status] || { text: "Không xác định", color: "bg-gray-200 text-gray-600" };
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')} - ${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
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
          <div className="flex gap-2">
            {/*  Nút Toggle Chỉnh sửa */}
            {!isEditing ? (
                <button 
                    onClick={() => setIsEditing(true)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                    title="Chỉnh sửa thông tin"
                >
                    <Edit size={20} />
                    <span className="text-sm font-medium">Sửa</span>
                </button>
            ) : (
                <div className="flex gap-2">
                    <button 
                        onClick={() => setIsEditing(false)}
                        className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors cursor-pointer"
                        title="Hủy bỏ"
                    >
                        <RotateCcw size={20} />
                    </button>
                    <button 
                        onClick={handleSave}
                        className="p-2 bg-green-500/80 hover:bg-green-500 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                        title="Lưu thay đổi"
                    >
                        <Save size={20} />
                        <span className="text-sm font-medium">Lưu</span>
                    </button>
                </div>
            )}
            
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>
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
            {/* ... */}
            <div className="space-y-4">
              
              {/*  nguoiNhan */}
              <div className="flex items-start gap-3">
                <User size={18} className="text-gray-400 mt-2.5" />
                <div className="w-full">
                  <p className="text-xs text-gray-500 mb-1">Họ tên người nhận</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="nguoiNhan" 
                      value={formData.nguoiNhan || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  ) : (
                    <p className="font-semibold text-gray-800 py-2">{order.tenKhachHang}</p>
                  )}
                </div>
              </div>

              {/*  soDienThoaiNguoiNhan */}
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-gray-400 mt-2.5" />
                <div className="w-full">
                  <p className="text-xs text-gray-500 mb-1">Số điện thoại</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="soDienThoaiNguoiNhan" //  QUAN TRỌNG
                      value={formData.soDienThoaiNguoiNhan || ""} //  Sửa value
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  ) : (
                    <p className="font-semibold text-gray-800 py-2">{order.soDienThoai}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-semibold text-gray-800 py-1">{order.email}</p>
                </div>
              </div>

             {/*  Địa chỉ */}
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-gray-400 mt-2.5" />
                <div className="w-full">
                  <p className="text-xs text-gray-500 mb-1">Địa chỉ giao hàng</p>
                  {isEditing ? (
                    <textarea
                      name="diaChi"
                      value={formData.diaChi || ""} // Lúc này nó chứa: "Số 1, Phường 2, Quận 3"
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
                    />
                  ) : (
                    <p className="font-semibold text-gray-800 py-2">{order.diaChiGiaoHang}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin đơn hàng*/}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
             <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-green-600" />
              Thông tin đơn hàng
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
              <Wallet size={18} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Phương thức thanh toán</p>
                <p className="font-semibold text-gray-800">
                  {order.phuongThucThanhToan === 1 
                    ? 'Thanh toán khi nhận hàng (COD)' 
                    : 'Thanh toán Online / Chuyển khoản'}
                </p>
                </div>
              </div>
              <div className="border-t border-green-200 border-dashed my-2"></div>

              {/* 3. DANH SÁCH SẢN PHẨM (Mới thêm vào) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Package size={18} className="text-gray-400" />
                  <p className="text-xs font-bold text-gray-500 uppercase">
                      Chi tiết sản phẩm ({order.chiTietDonHang?.length || 0})
                  </p>
                </div>
                
                <div className="flex flex-col gap-3 pl-7"> {/* pl-7 để thụt đầu dòng thẳng hàng với text trên */}
                  {order.chiTietDonHang?.map((item, index) => (
                    <div key={index} className="flex justify-between items-start text-sm group">
                      <div className="flex gap-2 items-start">
                        {/* Ảnh nhỏ (nếu có) */}
                        {item.hinhAnh && (
                            <img 
                              src={item.hinhAnh} 
                              alt="sp" 
                              className="w-8 h-8 rounded object-cover border border-green-200"
                            />
                        )}
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-800 line-clamp-2">
                              {item.tenSanPham}
                            </span>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-700 whitespace-nowrap">
                        {item.soLuong}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* --- ĐƯỜNG KẺ NGĂN CÁCH --- */}
              <div className="border-t border-green-200 border-dashed my-2"></div>
              <div className="flex items-start gap-3">
                <CreditCard size={18} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Tổng tiền</p>
                  <p className="text-2xl font-bold text-green-600">{formatPrice(order.tongTien)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ghi chú & Ghi chú nội bộ */}
          <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
            <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FileText size={20} className="text-amber-600" />
              Ghi chú
            </h4>
            
            <div className="space-y-4">
                {/* Ghi chú khách hàng */}
                <div className="w-full">
                    <p className="text-xs text-gray-500 mb-1 font-semibold">Ghi chú khách hàng:</p>
                    {isEditing ? (
                        <textarea
                            name="ghiChu"
                            value={formData.ghiChu}
                            onChange={handleInputChange}
                            rows={2}
                            className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                        />
                    ) : (
                        <p className="text-gray-700 leading-relaxed">{order.ghiChu || "Không có ghi chú"}</p>
                    )}
                </div>

                {/*  Ghi chú nội bộ */}
                <div className="w-full border-t border-amber-200 pt-3">
                    <p className="text-xs text-gray-500 mb-1 font-semibold">Ghi chú nội bộ (Admin):</p>
                    {isEditing ? (
                        <textarea
                            name="ghiChuNoiBo"
                            value={formData.ghiChuNoiBo}
                            onChange={handleInputChange}
                            placeholder="Nhập ghi chú nội bộ..."
                            rows={2}
                            className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                        />
                    ) : (
                        <p className="text-gray-700 leading-relaxed italic">
                            {order.ghiChuNoiBo || "Chưa có ghi chú nội bộ"}
                        </p>
                    )}
                </div>
            </div>
          </div>

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