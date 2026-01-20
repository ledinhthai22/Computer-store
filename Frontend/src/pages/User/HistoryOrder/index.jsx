// src/pages/HistoryOrder.jsx
import React, { useState, useEffect } from 'react';
import { 
  Package, Search, Loader2, Clock, Truck, CheckCircle, XCircle, 
  Trash2 
} from 'lucide-react';
import { orderService, handleApiError } from '../../../services/api/orderService';

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
};

const formatDateDisplay = (dateString) => {
    if (!dateString) return "";
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

  // Cấu hình Tabs
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

    try {
      let result;
      // Logic gọi API giữ nguyên như cũ
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
        const sorted = (result.data || []).sort((a, b) => 
          new Date(b.ngayTao) - new Date(a.ngayTao)
        );
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

  // Xử lý hủy đơn hàng
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) return;

    try {
      // Gọi API hủy đơn hàng (Cần đảm bảo orderService có hàm này hoặc thay bằng axios call tương ứng)
      // Ví dụ: await orderService.cancelOrder(orderId); 
      // Nếu chưa có hàm cancelOrder, bạn cần thêm vào service hoặc gọi trực tiếp ở đây.
      // Tạm thời giả định hàm hủy là changeStatusOrder sang trạng thái hủy (6) hoặc endpoint riêng
      
      await orderService.updateOrderStatus(orderId, 6); // Ví dụ gọi hàm update
      
      alert("Đã hủy đơn hàng thành công!");
      fetchOrders(activeStatus); // Tải lại danh sách
    } catch (err) {
      alert(handleApiError(err, "Không thể hủy đơn hàng lúc này"));
    }
  };

  const filteredOrders = orders.filter(order => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      order.maDon?.toLowerCase().includes(term) ||
      order.chiTietDonHang?.some(item => 
        item.tenBienThe?.toLowerCase().includes(term)
      )
    );
  });

  // Helper styles cho trạng thái
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
            {statusText}
        </span>
    );
  };

  return (
    <div className="w-full py-6 px-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-5xl mx-auto border border-gray-200">
        
        {/* Header giống Profile */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#2f9ea0] uppercase">
            Lịch sử đơn hàng
          </h2>
          <span className="text-sm text-gray-500 hidden sm:block">
            Theo dõi trạng thái đơn hàng của bạn
          </span>
        </div>

        <div className="p-6">
          {/* Tabs trạng thái - Styled theo theme Teal */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-100 pb-4">
            {statusTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeStatus === tab.id;
              return (
                <button
                  key={tab.label}
                  onClick={() => setActiveStatus(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive 
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

          {/* Ô tìm kiếm */}
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

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 text-[#2f9ea0]">
              <Loader2 className="animate-spin mb-2" size={32} />
              <p className="text-sm">Đang tải dữ liệu...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Danh sách đơn hàng */}
          {!loading && !error && (
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                    <Package size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">Không tìm thấy đơn hàng nào.</p>
                </div>
              ) : (
                filteredOrders.map(order => {
                  const isPending = order.trangThai === 'Chờ duyệt' || order.status === 0;

                  return (
                    <div 
                      key={order.maDonHang} 
                      className="border border-gray-200 rounded-lg hover:border-[#2f9ea0] transition-colors duration-200 overflow-hidden"
                    >
                        {/* Order Header Row */}
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-gray-700">#{order.maDon}</span>
                                <span className="text-gray-400">|</span>
                                <span className="text-sm text-gray-500">{formatDateDisplay(order.ngayTao)}</span>
                            </div>
                            <div>
                                {getStatusBadge(order.trangThai)}
                            </div>
                        </div>

                        {/* Order Body - List Items */}
                        <div className="p-4">
                            {order.chiTietDonHang?.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-[#2f9ea0] mt-1"></div>
                                        <div>
                                            <p className="text-gray-800 font-medium text-sm">{item.tenBienThe}</p>
                                        </div>
                                    </div>
                                    <div className="text-gray-600 text-sm whitespace-nowrap">
                                        x {item.soLuong}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Footer - Actions & Total */}
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500">Tổng thành tiền:</span>
                                <span className="text-lg font-bold text-[#2f9ea0]">
                                    {formatPrice(order.tongTien)}
                                </span>
                            </div>

                            {/* Chỉ hiện nút Hủy nếu đơn hàng đang Chờ duyệt */}
                            {isPending && (
                                <button
                                    onClick={() => handleCancelOrder(order.maDonHang)}
                                    className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 bg-white hover:bg-red-50 rounded text-sm font-medium transition-colors"
                                >
                                    <Trash2 size={16} />
                                    Hủy đơn hàng
                                </button>
                            )}
                        </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryOrder;