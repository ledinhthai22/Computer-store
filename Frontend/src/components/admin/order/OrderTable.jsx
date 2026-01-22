import { useState } from "react";
import DataTable from "react-data-table-component";
import { Eye, ArrowUpIcon, Filter, Edit,Trash2 } from "lucide-react";
import TableSearch from "../../admin/TableSearch";
import Pagination from "../Pagination";

const OrderTable = ({ 
    data , 
    loading,
    onView, 
    onUpdate, 
    onDelete,
    filterType, 
    onFilterTypeChange,
    updatingOrderId 
}) => { 
    const [filterText, setFilterText] = useState('');
    const filteredItems = data.filter(
        item => item.maHoaDon && item.maHoaDon.toLowerCase().includes(filterText.toLowerCase()) ||
                item.tenKhachHang && item.tenKhachHang.toLowerCase().includes(filterText.toLowerCase()) ||
                item.soDienThoai && item.soDienThoai.toLowerCase().includes(filterText.toLowerCase())||
                item.diaChiGiaoHang && item.diaChiGiaoHang.toLowerCase().includes(filterText.toLowerCase())
    );

    // Map trạng thái số sang text và màu sắc
    const getStatusInfo = (status) => {
        const statusMap = {
            0: { text: "Chưa duyệt", color: "bg-gray-400 text-white border-gray-500" },
            1: { text: "Đã duyệt", color: "bg-orange-500 text-white border-orange-600" },
            2: { text: "Đang xử lý", color: "bg-orange-300 text-gray-800 border-orange-400" },
            3: { text: "Đang giao", color: "bg-yellow-400 text-gray-800 border-yellow-500" },
            4: { text: "Đã giao", color: "bg-green-600 text-white border-green-700" },
            5: { text: "Hoàn thành", color: "bg-green-400 text-white border-green-500" },
            6: { text: "Đã hủy", color: "bg-red-400 text-white border-red-500" },
            7: { text: "Trả hàng", color: "bg-red-600 text-white border-red-700" }
        };
        return statusMap[status] || { text: "Không xác định", color: "bg-gray-200 text-gray-600" };
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${hours}:${minutes} - ${day}/${month}/${year}`;
    };

    const columns = [
        {
            name: 'STT',
            selector: (row, index) => index + 1,
            width: '80px',
            sortable: false,
        },
        {
            name: 'MÃ HÓA ĐƠN',
            selector: row => row.maHoaDon,
            sortable: true,
            width: '150px',
            cell: row => (
                <span className="font-bold text-blue-600">
                    {row.maHoaDon}
                </span>
            ),
        },
        {
            name: 'KHÁCH HÀNG',
            selector: row => row.tenKhachHang,
            sortable: true,
            grow: 2,
            minWidth: '180px',
            cell: row => (
                <div>
                    <div className="font-semibold text-gray-800">{row.tenKhachHang}</div>
                    <div className="text-xs text-gray-500">{row.email}</div>
                </div>
            ),
        },
        {
            name: 'TỔNG TIỀN',
            selector: row => row.tongTien,
            sortable: true,
            width: '150px',
            cell: row => (
                <span className="font-bold text-green-600">
                    {formatPrice(row.tongTien)}
                </span>
            ),
        },
        {
            name: 'NGÀY ĐẶT',
            selector: row => row.ngayDatHang,
            sortable: true,
            width: '180px',
            cell: row => (
                <span className="text-sm text-gray-600">
                    {formatDateTime(row.ngayDatHang)}
                </span>
            ),
        },
        {
            name: 'TRẠNG THÁI',
            selector: row => row.trangThai,
            sortable: true,
            width: '160px',
            center: true,
            cell: row => {
                const statusInfo = getStatusInfo(row.trangThai);
                
                return (
                    <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border whitespace-nowrap ${statusInfo.color}`}>
                        {statusInfo.text}
                    </span>
                );
            },
        },
        {
            name: 'HÀNH ĐỘNG',
            center: true,
            width: '280px',
            cell: row => {
                const isUpdating = updatingOrderId === row.maHoaDon;
                const isDeletedView = filterType === 'deleted'; // Kiểm tra xem có đang ở tab đã xóa không
                
                return (
                    <div className="flex items-center gap-2 justify-center">
                        {/* Nút Xem Chi Tiết */}
                        <button 
                            onClick={() => onView(row)}
                            className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            title="Xem chi tiết"
                        >
                            <Eye size={18} /> 
                        </button>
                        {!isDeletedView && (
                            <button 
                                onClick={() => onUpdate(row)}
                                disabled={updatingOrderId && !isUpdating}
                                className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${
                                    isUpdating
                                        ? 'bg-amber-100 text-amber-700 border border-amber-300'
                                        : updatingOrderId
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'text-amber-500 hover:bg-amber-100 cursor-pointer'
                                }`}
                                title="Cập nhật trạng thái"
                            >
                                <Edit size={18} /> 
                            </button>
                        )}

                        {/* NÚT XÓA (SOFT DELETE) */}
                        {!isDeletedView && (
                            <button 
                                onClick={() => onDelete(row)}
                                disabled={updatingOrderId} // Disable khi đang cập nhật cái khác
                                className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                                title="Xóa đơn hàng"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <div className="space-y-4">
            {/* HEADER */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex-1 max-w">
                    <TableSearch 
                        filterText={filterText} 
                        onFilter={e => setFilterText(e.target.value)} 
                        placeholder="Tìm kiếm đơn hàng..."
                    />
                </div>
                
                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600 whitespace-nowrap hidden sm:inline">Lọc theo</span>
                    <select 
                        className="flex-1 sm:w-56 border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                        value={filterType}
                        onChange={(e) => onFilterTypeChange(e.target.value)}
                    >
                        <option value="all">Tất cả</option>
                        <option value="unread">Chưa duyệt</option>
                        <option value="approved">Đã duyệt</option>
                        <option value="processing">Đang xử lý</option>
                        <option value="shipping">Đang giao</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                        <option value="returned">Trả hàng</option>
                        <option value="deleted">Đã xóa (Thùng rác)</option>
                    </select>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-4">
                    <DataTable
                        columns={columns}
                        data={filteredItems}
                        progressPending={loading}
                        pagination
                        paginationComponent={Pagination}
                        paginationPerPage={5}
                        persistTableHead
                        className="custom-datatable"
                        sortIcon={<ArrowUpIcon size={14} className="ml-1 text-gray-400" />}
                        highlightOnHover
                        responsive
                        noDataComponent={
                            <div className="p-12 text-center text-gray-400 font-medium">
                                Không tìm thấy đơn hàng nào.
                            </div>
                        }
                    />
            </div>
        </div>
    );
};

export default OrderTable;