// Order.jsx - Main Page
import { useState, useEffect, useCallback } from 'react';
import OrderTable from '../../../components/admin/order/OrderTable';
import OrderDetailModal from '../../../components/admin/order/OrderDetailModal';
import OrderUpdateModal from '../../../components/admin/order/OrderUpdateModal';
import Toast from '../../../components/admin/Toast';
import { orderService } from '../../../services/api/orderService'; // TODO: Import service khi API ready

// ⚠️ MOCK DATA - Thay thế bằng API call sau này
// const MOCK_ORDERS = [
//     {
//         maHoaDon: "HD001",
//         tenKhachHang: "Nguyễn Văn A",
//         email: "nguyenvana@email.com",
//         soDienThoai: "0901234567",
//         diaChiGiaoHang: "123 Đường ABC, Quận 1, TP.HCM",
//         tongTien: 25000000,
//         trangThai: 1, // 0: Tất cả, 1: Chưa duyệt, 2: Đã duyệt, 3: Đang xử lý, 4: Đang giao, 5: Đã giao, 6: Hoàn thành, 7: Đã hủy, 8: Trả hàng
//         ngayDatHang: "2024-01-15T10:30:00",
//         ghiChu: "Giao hàng giờ hành chính"
//     },
//     {
//         maHoaDon: "HD002",
//         tenKhachHang: "Trần Thị B",
//         email: "tranthib@email.com",
//         soDienThoai: "0912345678",
//         diaChiGiaoHang: "456 Đường XYZ, Quận 3, TP.HCM",
//         tongTien: 15000000,
//         trangThai: 3,
//         ngayDatHang: "2024-01-14T14:20:00",
//         ghiChu: ""
//     },
//     {
//         maHoaDon: "HD003",
//         tenKhachHang: "Lê Văn C",
//         email: "levanc@email.com",
//         soDienThoai: "0923456789",
//         diaChiGiaoHang: "789 Đường DEF, Quận 5, TP.HCM",
//         tongTien: 35000000,
//         trangThai: 6,
//         ngayDatHang: "2024-01-13T09:15:00",
//         ghiChu: "Đã thanh toán"
//     }
// ];

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('all');

    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // ✅ State quản lý trạng thái đang được cập nhật
    const [pendingStatusUpdate, setPendingStatusUpdate] = useState(null); // { maHoaDon, newStatus }

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };
    const mapStatusStringToNumber = (statusString) => {
        const statusMap = {
            'Chờ duyệt': 0,
            'Đã duyệt': 1,
            'Đang xử lý': 2,
            'Đang giao': 3,
            'Đã giao': 4,
            'Hoàn thành': 5,
            'Đã hủy': 6,
            'Trả hàng': 7
        };
        return statusMap[statusString];
    };
    const transformOrderForUI = (backendOrder) => {
        return {
            maHoaDon: backendOrder.maDon,
            maDonHang: backendOrder.maDonHang,
            tenKhachHang: backendOrder.diaChi?.tenNguoiNhan || 'N/A',
            email: backendOrder.khachHang?.email || 'N/A',
            soDienThoai: backendOrder.diaChi?.soDienThoai || 'N/A',
            
            diaChiGiaoHang: backendOrder.diaChi 
                ? `${backendOrder.diaChi.diaChi}, ${backendOrder.diaChi.phuongXa}, ${backendOrder.diaChi.tinhThanh}`
                : 'N/A',
            
            tongTien: backendOrder.tongTien || 0,
            
            trangThai: mapStatusStringToNumber(backendOrder.trangThai),
            
            ngayDatHang: convertVietnameseDateToISO(backendOrder.ngayTao),
            
            ghiChu: backendOrder.ghiChu || '',
            ghiChuNoiBo: backendOrder.ghiChuNoiBo || '',
            _backend: backendOrder
        };
    };
    const convertVietnameseDateToISO = (vnDate) => {
        if (!vnDate) return new Date().toISOString();
        
        try {
            const [time, date] = vnDate.split(' ');
            const [hours, minutes] = time.split(':');
            const [day, month, year] = date.split('/');
            
            const isoDate = new Date(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day),
                parseInt(hours || 0),
                parseInt(minutes || 0)
            );
            
            return isoDate.toISOString();
        } catch (error) {
            console.error('Error converting date:', error);
            return new Date().toISOString();
        }
    };
    // TODO: Thay thế bằng API call
    const fetchOrders = useCallback(async () => {
        try {
            // setLoading(true);
            
            // // TODO: Uncomment khi API ready
            // const res = await orderService.getByStatus(filterType);
            // setOrders(Array.isArray(res) ? res : []);
            // const transformedOrders = Array.isArray(res) 
            //     ? res.map(order => transformOrderForUI(order))
            //     : [];
            // // ⚠️ MOCK: Filter data theo trạng thái
            // let filteredData = transformedOrders;
            // if (filterType !== 'all') {
            //     const statusMap = {
            //         'unread': 0,      // Chưa duyệt
            //         'approved': 1,    // Đã duyệt
            //         'processing': 2,  // Đang xử lý
            //         'shipping': 3,    // Đang giao
            //         'delivered': 4,   // Đã giao
            //         'completed': 5,   // Hoàn thành
            //         'cancelled': 6,   // Đã hủy
            //         'returned': 7    // Trả hàng
            //     };
            //     filteredData = transformedOrders.filter(order => order.trangThai === statusMap[filterType]);
            // }
            setLoading(true);
            const statusMap = {
                'unread': 0,      // Chưa duyệt
                'approved': 1,    // Đã duyệt
                'processing': 2,  // Đang xử lý
                'shipping': 3,    // Đang giao
                'delivered': 4,   // Đã giao
                'completed': 5,   // Hoàn thành
                'cancelled': 6,   // Đã hủy
                'returned': 7     // Trả hàng
            };

            let res;

            if (filterType === 'all') {
                res = await orderService.getAdminList(); 
            } else {
                const statusId = statusMap[filterType]; 
                res = await orderService.getByStatus(statusId);
            }
            const transformedOrders = Array.isArray(res) 
                ? res.map(order => transformOrderForUI(order))
                : [];

            setOrders(transformedOrders);
            // setOrders(filteredData);
        } catch (err) {
            console.log(err)
            showToast("Tải danh sách đơn hàng thất bại", "error");
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, [filterType]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // ✅ Xem chi tiết đơn hàng
    const handleViewClick = (order) => {
        setSelectedOrder(order);
        setIsViewModalOpen(true);
    };

    // ✅ Mở modal cập nhật trạng thái
    const handleUpdateClick = (order) => {
        // ⚠️ Kiểm tra xem có đang cập nhật order khác không
        if (pendingStatusUpdate && pendingStatusUpdate.maHoaDon !== order.maHoaDon) {
            showToast(
                `Vui lòng hoàn thành cập nhật đơn hàng ${pendingStatusUpdate.maHoaDon} trước!`, 
                "error"
            );
            return;
        }
        
        // ✅ Chỉ set selectedOrder và mở modal, KHÔNG set pendingStatusUpdate ở đây
        setSelectedOrder(order);
        setIsUpdateModalOpen(true);
    };
   const handleUpdateOrderInfo = async (orderId, updatedData) => {
        try {
            await orderService.updateOrderInfo(orderId, updatedData);

            await fetchOrders();
            
            showToast("Cập nhật thành công!", "success");
        } catch (error) {
            console.error("Update failed:", error);
            showToast("Cập nhật thông tin thất bại: " + (error.response?.data || error.message), "error");
        }
    };
    // ✅ Xác nhận cập nhật trạng thái - Gọi từ modal
    const handleConfirmUpdate = async (newStatus) => {
        if (!selectedOrder) return;

        try {
            // ✅ Set pending update NGAY KHI BẮT ĐẦU cập nhật
            setPendingStatusUpdate({ 
                maHoaDon: selectedOrder.maDonHang, 
                newStatus: newStatus 
            });

            // TODO: Uncomment khi API ready
            await orderService.updateStatus(selectedOrder.maDonHang, { trangThai: newStatus });
            
            // ⚠️ MOCK: Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // ⚠️ MOCK: Cập nhật state local
            setOrders(prev => prev.map(order => 
                order.maHoaDon === selectedOrder.maHoaDon 
                    ? { ...order, trangThai: newStatus }
                    : order
            ));
            
            showToast("Cập nhật trạng thái đơn hàng thành công!", "success");
            
            // ✅ Đóng modal
            setIsUpdateModalOpen(false);
            setSelectedOrder(null);
            
            // Reload data
            await fetchOrders();
            
        } catch (err) {
            console.log(err);
            showToast("Cập nhật trạng thái thất bại", "error");
        } finally {
            // ✅ CRITICAL: LUÔN LUÔN reset pendingStatusUpdate sau khi hoàn thành (success hoặc fail)
            setPendingStatusUpdate(null);
        }
    };

    // ✅ Đóng modal cập nhật - Chỉ reset selectedOrder
    const handleCloseUpdateModal = () => {
        setIsUpdateModalOpen(false);
        setSelectedOrder(null);
        // ⚠️ KHÔNG reset pendingStatusUpdate ở đây - chỉ reset sau khi API call xong
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <OrderTable 
                    data={orders} 
                    loading={loading}
                    onView={handleViewClick}
                    onUpdate={handleUpdateClick}
                    filterType={filterType}
                    onFilterTypeChange={setFilterType}
                    updatingOrderId={pendingStatusUpdate?.maHoaDon || null}
                />
            </div>
            
            {/* View Modal */}
            {/* <OrderDetailModal
                isOpen={isViewModalOpen}
                order={selectedOrder}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedOrder(null);
                }}
            /> */}
            <OrderDetailModal
                isOpen={isViewModalOpen}
                order={selectedOrder}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedOrder(null);
                }}
                // ✅ Truyền hàm update xuống modal
                onUpdate={handleUpdateOrderInfo}
            />
           
            {/* Update Status Modal */}
            <OrderUpdateModal
                isOpen={isUpdateModalOpen}
                order={selectedOrder}
                onConfirm={handleConfirmUpdate}
                onClose={handleCloseUpdateModal}
            />

            {/* Toast */}
            {toast.show && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast({ ...toast, show: false })} 
                />
            )}
        </div>
    );
};

export default Order;