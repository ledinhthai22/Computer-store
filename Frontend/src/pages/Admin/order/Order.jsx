// Order.jsx - Main Page
import { useState, useEffect, useCallback } from 'react';
import OrderTable from '../../../components/admin/order/OrderTable';
import OrderDetailModal from '../../../components/admin/order/OrderDetailModal';
import OrderUpdateModal from '../../../components/admin/order/OrderUpdateModal';
import OrderDeleteModal from '../../../components/admin/order/OrderDeleteModal';
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
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);

    // ... (giữ nguyên fetchOrders, v.v...)

    // 👇 3. Sửa lại hàm handleDeleteClick (Chỉ mở modal, không xóa ngay)
    const handleDeleteClick = (order) => {
        setOrderToDelete(order);
        setIsDeleteModalOpen(true);
    };

    // 👇 4. Thêm hàm Xử lý xóa thật sự (Gọi khi bấm nút Xóa trong Modal)
    const handleConfirmDelete = async () => {
        if (!orderToDelete) return;

        try {
            // Gọi service softDelete
            await orderService.softDelete(orderToDelete.maDonHang);
            
            showToast("Đã chuyển đơn hàng vào thùng rác!", "success");
            
            // Đóng modal và reset
            setIsDeleteModalOpen(false);
            setOrderToDelete(null);

            // Reload lại danh sách
            await fetchOrders();
        } catch (error) {
            console.error("Delete error:", error);
            showToast("Xóa thất bại: " + (error.response?.data?.message || error.message), "error");
        }
    };
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
            chiTietDonHang: backendOrder.chiTietDonHang?.map(item => ({
                maBienThe: item.maBienThe,
                tenSanPham: item.tenBienThe, 
                soLuong: item.soLuong,
                donGia: item.giaBan,
                giaKhuyenMai: item.giaKhuyenMai,
                thanhTien: item.thanhTien,
                hinhAnh: item.hinhAnh
            })) || [],
            ngayXoa: backendOrder.ngayXoa || null,
            _backend: backendOrder,
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
    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const statusMap = {
                'unread': 0, 'approved': 1, 'processing': 2, 'shipping': 3,
                'delivered': 4, 'completed': 5, 'cancelled': 6, 'returned': 7
            };

            let res;

            // --- BƯỚC 1: GỌI API DỰA TRÊN FILTER ---
            if (filterType === 'deleted') {
                // ✅ Gọi API lấy danh sách đã xóa mềm
                res = await orderService.getorderhiden();
            } else if (filterType === 'all') {
                res = await orderService.getAdminList();
            } else {
                const statusId = statusMap[filterType];
                res = await orderService.getByStatus(statusId);
            }

            // --- BƯỚC 2: CHUYỂN ĐỔI DỮ LIỆU ---
            let transformedOrders = Array.isArray(res) 
                ? res.map(order => transformOrderForUI(order))
                : [];

            // --- BƯỚC 3: LỌC HIỂN THỊ (Đoạn code của bạn) ---
            if (filterType === 'deleted') {
                // Nếu đang xem thùng rác: GIỮ LẠI các đơn ĐÃ xóa (có ngày xóa)
                // Lưu ý: Nếu API getorderhiden đã chỉ trả về đơn đã xóa thì có thể không cần filter này, 
                // nhưng thêm vào để chắc chắn.
                transformedOrders = transformedOrders.filter(o => o.ngayXoa !== null);
            } else {
                // Nếu xem các tab bình thường: ẨN các đơn đã xóa
                transformedOrders = transformedOrders.filter(o => o.ngayXoa === null);
            }

            setOrders(transformedOrders);
        } catch (err) {
            console.log(err);
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
                    onDelete={handleDeleteClick}
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
            <OrderDeleteModal 
                isOpen={isDeleteModalOpen}
                order={orderToDelete}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setOrderToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
            />
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