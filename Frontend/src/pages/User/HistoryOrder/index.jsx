import React, { useState, useEffect } from 'react';
import { 
  Package, Search, Loader2, Clock, Truck, CheckCircle, XCircle, 
  Trash2, Eye 
} from 'lucide-react';
import { orderService, handleApiError } from '../../../services/api/orderService';
import { useToast } from '../../../contexts/ToastContext';
import UserPagination from '../../../components/user/product/UserPagination'; // ← thay bằng đường dẫn thực tế của bạn

const ITEMS_PER_PAGE = 10;

const formatPrice = (price) => {
  if (price == null) return '0 ₫';
  return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
};

const formatDateDisplay = (dateString) => {
  if (!dateString) return "";
  if (dateString.includes(' ')) {
    const [time, date] = dateString.split(' ');
    const [hours, minutes] = time.split(':');
    return `${date} ${hours}:${minutes}`;
  }
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const HistoryOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmCancelOrder, setConfirmCancelOrder] = useState(null);

  const { showToast } = useToast();

  const statusTabs = [
    { id: null, label: 'Tất cả', icon: null },
    { id: 0, label: 'Chờ duyệt', icon: Clock },
    { id: 3, label: 'Đang giao', icon: Truck },
    { id: 5, label: 'Hoàn thành', icon: CheckCircle },
    { id: 6, label: 'Đã hủy', icon: XCircle },
  ];

  const fetchOrders = async (status) => {
    setLoading(true);
    setError(null);
    setOrders([]);
    setCurrentPage(1);

    try {
      let result;
      if (status === 5) {
        result = await orderService.getCompletedOrders();
      } else if (status === 6) {
        result = await orderService.getCancelledOrders();
      } else if (status !== null) {
        result = await orderService.getOrdersByStatus(status);
      } else {
        const promises = [
          orderService.getOrdersByStatus(0),
          orderService.getOrdersByStatus(1),
          orderService.getOrdersByStatus(2),
          orderService.getOrdersByStatus(3),
          orderService.getCompletedOrders(),
          orderService.getCancelledOrders(),
        ];
        const responses = await Promise.allSettled(promises);
        const combined = responses
          .filter(r => r.status === 'fulfilled' && r.value?.success)
          .flatMap(r => r.value.data || []);
        
        const unique = Array.from(
          new Map(combined.map(item => [item.maDonHang, item])).values()
        );
        result = { success: true, data: unique };
      }

      if (result?.success) {
        const sorted = (result.data || []).sort((a, b) => {
          const dateA = new Date(b.ngayTao?.split(' ').reverse().join(' ') || 0);
          const dateB = new Date(a.ngayTao?.split(' ').reverse().join(' ') || 0);
          return dateA - dateB;
        });
        setOrders(sorted);
      } else {
        throw new Error('Không nhận được dữ liệu hợp lệ');
      }
    } catch (err) {
      const message = handleApiError(err, 'Không tải được lịch sử đơn hàng');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(activeStatus);
  }, [activeStatus]);

  const executeCancelOrder = async (maDonHang) => {
    try {
      setLoading(true);
      const response = await orderService.cancelOrder(maDonHang);

      if (response?.success) {
        showToast("Đơn hàng đã được hủy thành công", "success");
        fetchOrders(activeStatus);
      } else {
        throw new Error(response?.message || "Hủy thất bại");
      }
    } catch (err) {
      const message = handleApiError(err, "Không thể hủy đơn hàng");
      showToast(message, "error");
    } finally {
      setLoading(false);
      setConfirmCancelOrder(null);
    }
  };

  const handleCancelOrder = (maDonHang) => {
    setConfirmCancelOrder(maDonHang);
  };

  const handleViewDetail = async (maDonHang) => {
    if (!maDonHang) {
      showToast("Không tìm thấy mã đơn hàng", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await orderService.getOrderDetail(maDonHang);

      if (response?.success && response.data) {
        setSelectedOrder(response.data);
      } else {
        throw new Error(response?.message || "Không lấy được chi tiết đơn hàng");
      }
    } catch (err) {
      const message = handleApiError(err, "Lỗi khi tải chi tiết đơn hàng");
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (order.maDon || '').toLowerCase().includes(term) ||
      order.chiTietDonHang?.some(item => 
        (item.tenBienThe || '').toLowerCase().includes(term)
      )
    );
  });

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getStatusBadge = (statusText) => {
    const map = {
      'Chờ duyệt': 'bg-yellow-100 text-yellow-800',
      'Đã duyệt': 'bg-blue-100 text-blue-800',
      'Đang xử lý': 'bg-indigo-100 text-indigo-800',
      'Đang giao': 'bg-purple-100 text-purple-800',
      'Hoàn thành': 'bg-green-100 text-green-800',
      'Đã hủy': 'bg-red-100 text-red-800',
    };
    const style = map[statusText] || 'bg-gray-100 text-gray-800';
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${style}`}>
        {statusText || 'Không xác định'}
      </span>
    );
  };

  const getPaymentMethod = (method) => {
    const map = {
      1: 'Thanh toán khi nhận hàng (COD)',
      2: 'Chuyển khoản ngân hàng',
      3: 'Thẻ tín dụng / Ghi nợ',
    };
    return map[method] || 'Không xác định';
  };

  const DetailModal = () => {
    if (!selectedOrder) return null;

    const { khachHang = {}, diaChi = {}, chiTietDonHang = [] } = selectedOrder;

    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-xl font-bold text-[#2f9ea0]">
                Chi tiết đơn hàng #{selectedOrder.maDon || '—'}
              </h3>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-gray-600 hover:text-gray-800 text-2xl leading-none cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-sm text-gray-500">Mã đơn hàng</p>
                <p className="font-medium">{selectedOrder.maDon}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày tạo</p>
                <p className="font-medium">{formatDateDisplay(selectedOrder.ngayTao)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Trạng thái</p>
                <div className="mt-1">{getStatusBadge(selectedOrder.trangThai)}</div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phương thức thanh toán</p>
                <p className="font-medium">{getPaymentMethod(selectedOrder.phuongThucThanhToan)}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-gray-500">Người nhận</p>
                <p className="font-medium">{diaChi.tenNguoiNhan || khachHang.hoTen || '—'}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="font-medium">{diaChi.soDienThoai || khachHang.soDienThoai || '—'}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-gray-500">Địa chỉ giao hàng</p>
                <p className="font-medium">
                  {diaChi.diaChi}, {diaChi.phuongXa}, {diaChi.tinhThanh}
                </p>
              </div>
            </div>

            <h4 className="font-semibold text-lg mb-4">Sản phẩm trong đơn</h4>
            <div className="space-y-4 mb-8">
              {chiTietDonHang.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start border-b pb-3 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium">{item.tenBienThe || '—'}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatPrice(item.giaBan || item.giaKhuyenMai || 0)} × {item.soLuong}
                    </p>
                  </div>
                  <p className="font-medium text-[#2f9ea0] whitespace-nowrap">
                    {formatPrice((item.giaBan || item.giaKhuyenMai || 0) * item.soLuong)}
                  </p>
                </div>
              ))}
            </div>

            {selectedOrder.ghiChu && (
              <div className="mb-6">
                <p className="text-sm text-gray-500">Ghi chú của khách hàng:</p>
                <p className="mt-1">{selectedOrder.ghiChu}</p>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t text-lg font-bold">
              <span>Tổng tiền:</span>
              <span className="text-[#2f9ea0]">{formatPrice(selectedOrder.tongTien)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CancelConfirmModal = () => {
    if (!confirmCancelOrder) return null;

    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-md shadow-2xl overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-bold text-red-600 mb-4">
              Xác nhận hủy đơn hàng
            </h3>
            <p className="text-gray-700 mb-6">
              Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmCancelOrder(null)}
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Không hủy
              </button>
              <button
                onClick={() => executeCancelOrder(confirmCancelOrder)}
                disabled={loading}
                className={`px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Trash2 size={18} />
                )}
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full py-6 px-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-5xl mx-auto border border-gray-200">
        
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#2f9ea0] uppercase">
            Lịch sử đơn hàng
          </h2>
          <span className="text-sm text-gray-500 hidden sm:block">
            Theo dõi trạng thái đơn hàng của bạn
          </span>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-100 pb-4">
            {statusTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeStatus === tab.id;
              return (
                <button
                  key={tab.label}
                  onClick={() => setActiveStatus(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer
                    ${isActive 
                      ? 'bg-[#2f9ea0] text-white shadow-sm' 
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                >
                  {Icon && <Icon size={16} />}
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="relative mb-6 max-w-md mx-auto sm:mx-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm theo mã đơn hoặc tên sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2f9ea0] focus:border-[#2f9ea0]"
            />
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-12 text-[#2f9ea0]">
              <Loader2 className="animate-spin mb-2" size={32} />
              <p className="text-sm">Đang tải dữ liệu...</p>
            </div>
          )}

          {error && !loading && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 text-sm">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="space-y-4 min-h-[400px]">
                {paginatedOrders.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                    <Package size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">Không tìm thấy đơn hàng nào.</p>
                  </div>
                ) : (
                  paginatedOrders.map(order => {
                    const isPending = order.trangThai === 'Chờ duyệt' || order.trangThai === 0;

                    return (
                      <div 
                        key={order.maDonHang}
                        className="border border-gray-200 rounded-lg hover:border-[#2f9ea0] transition-colors duration-200 overflow-hidden"
                      >
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-gray-700">#{order.maDon || '—'}</span>
                            <span className="text-gray-400">|</span>
                            <span className="text-sm text-gray-500">
                              {formatDateDisplay(order.ngayTao)}
                            </span>
                          </div>
                          <div>{getStatusBadge(order.trangThai)}</div>
                        </div>

                        <div className="p-4">
                          {order.chiTietDonHang?.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                              <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-[#2f9ea0] mt-1"></div>
                                <div>
                                  <p className="text-gray-800 font-medium text-sm">
                                    {item.tenBienThe || '—'}
                                  </p>
                                </div>
                              </div>
                              <div className="text-gray-600 text-sm whitespace-nowrap">
                                x {item.soLuong}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex flex-wrap justify-between items-center gap-3">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Tổng thành tiền:</span>
                            <span className="text-lg font-bold text-[#2f9ea0]">
                              {formatPrice(order.tongTien)}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleViewDetail(order.maDonHang)}
                              className="flex items-center gap-2 px-4 py-2 border border-[#2f9ea0]/30 text-[#2f9ea0] hover:bg-[#2f9ea0]/5 rounded text-sm font-medium transition-colors cursor-pointer"
                            >
                              <Eye size={16} />
                              Chi tiết
                            </button>

                            {isPending && (
                              <button
                                onClick={() => handleCancelOrder(order.maDonHang)}
                                className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded text-sm font-medium transition-colors cursor-pointer"
                              >
                                <Trash2 size={16} />
                                Hủy
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <UserPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>

      {selectedOrder && <DetailModal />}
      {confirmCancelOrder && <CancelConfirmModal />}
    </div>
  );
};

export default HistoryOrder;