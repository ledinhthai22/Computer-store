import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { Edit, Trash2, Plus, ArrowUpIcon, Filter } from "lucide-react";
import TableSearch from '../TableSearch';
import Pagination from '../Pagination';

const SlideShowTable = ({ data, loading, onEdit, onDelete, onOpenAddModal, filterType, onFilterTypeChange, showToast }) => {
    const API_BASE_URL = "https://localhost:7012";
    const [filterText, setFilterText] = useState('');

    const filteredItems = data.filter(
        item => item.tenTrinhChieu && item.tenTrinhChieu.toLowerCase().includes(filterText.toLowerCase()),
    );
    
    const handleDeleteAttempt = (row) => {
        if (row.trangThai === true) {
        // Không cho xóa, hiển thị Toast cảnh báo
        showToast("Không thể xóa trình chiếu đang hoạt động", "error");
        return;
        }

        // Gọi onDelete (xóa thực tế)
        onDelete(row.maTrinhChieu);
        // Toast thành công sẽ do component cha xử lý (sau khi API delete xong)
    };

    const columns = [
        {
            name: 'STT',
            selector: (row, index) => index + 1,
            width: '80px',
            sortable: false,
        },
        {
            name: 'HÌNH ẢNH',
            grow: 1,
            cell: row => {
                // Xử lý URL hình ảnh
                const imageUrl = row.duongDanHinh?.startsWith('http') 
                    ? row.duongDanHinh 
                    : `${API_BASE_URL}${row.duongDanHinh}`;
                
                return (
                    <div className="py-2">
                        <img 
                            src={imageUrl} 
                            alt={row.tenTrinhChieu} 
                            className="h-12 w-24 object-cover rounded border shadow-sm"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=No+Image"; }}
                        />
                    </div>
                );
            },
        },
        {
            name: 'TÊN SLIDE',
            selector: row => row.tenTrinhChieu,
            sortable: true,
            grow: 1,
        },
        {
            name: 'LIÊN KẾT',
            selector: row => row.duongDanSanPham,
            width: '250px',
            grow: 1,
        },
        {
            name: 'TRẠNG THÁI',
            selector: row => row.trangThai,
            cell: row => (
                <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase border w-25 text-center
                ${row.trangThai
                            ? 'text-green-700 bg-green-100 border-green-400'
                            : 'text-red-700 bg-red-100 border-red-400'
                        }`}
                >
                    {row.trangThai ? ('Hoạt động') : ('Ẩn')}
                </span>
            ),
        },
        {
            name: 'HÀNH ĐỘNG',
            width: '180px',
            cell: row => {
                const isDisabled = row.trangThai === true;
                return (
                <div className="flex items-center gap-1">
                    <button onClick={() => onEdit(row)} className="p-2 text-amber-500 hover:bg-amber-100 rounded-lg transition-colors"><Edit size={18} /></button>
                    <button
                        onClick={() => handleDeleteAttempt(row)}
                        title={
                            isDisabled
                            ? "Trình chiếu đang hoạt động, không thể xóa"
                            : "Xóa trình chiếu"
                        }
                        className={`p-2 rounded-lg transition-colors flex items-center gap-1 cursor-pointer
                            ${
                            isDisabled
                                ? "text-gray-400 cursor-not-allowed bg-gray-100"
                                : "text-red-500 hover:bg-red-100"
                            }
                        `}
                        >
                        <Trash2 size={18} />
                        <span className="hidden sm:inline">Xóa</span>
                    </button>
                </div>
                )
            },
        },
    ];

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-end w-full gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <TableSearch 
                    filterText={filterText} 
                    onFilter={e => setFilterText(e.target.value)} 
                    placeholder="Tìm kiếm..."
                />
                <div className="flex items-center gap-2">
                        <Filter size={18} className="text-gray-400" />
                        <select 
                            className="border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                            value={filterType}
                            onChange={(e) => onFilterTypeChange(e.target.value)}
                        >
                            <option value="all">Tất cả</option>
                            <option value="active">Đang hoạt động</option>
                            <option value="inactive">Đang ẩn</option>
                        </select>
                    </div>
                <button 
                    onClick={onOpenAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium shadow-md cursor-pointer"
                >
                    <Plus size={16} />
                    <span>Thêm mới</span>
                </button>
            </div>

            {/* BẢNG DỮ LIỆU */}
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
                            Không tìm thấy trình chiếu nào.
                        </div>
                    }
                />
            </div>
        </div>
    );
};

export default SlideShowTable;