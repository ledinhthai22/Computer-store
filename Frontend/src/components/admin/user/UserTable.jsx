import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { Trash2, History, ArrowUpIcon, Lock, Unlock, Filter, Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import TableSearch from '../TableSearch';
import Pagination from '../Pagination';

const UserTable = ({ data, onLock, onUnlock, onDelete, filterType, onFilterTypeChange, onOpenAddModal, showToast }) => {
    const navigate = useNavigate();
    const [filterText, setFilterText] = useState('');

    const filteredItems = data.filter(item => 
        (item.hoTen?.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.email?.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.soDienThoai?.includes(filterText))
    );

    const handleDeleteAttempt = (row) => {
        if (row.trangThai === true) {
        // Không cho xóa, hiển thị Toast cảnh báo
        showToast("Không thể xóa người dùng đang hoạt động", "error");
        return;
        }

        // Gọi onDelete (xóa thực tế)
        onDelete(row.maNguoiDung);
        // Toast thành công sẽ do component cha xử lý (sau khi API delete xong)
    };

    const columns = [
        { 
            name: 'STT', 
            selector: (row, index) => index + 1, 
            width: '70px',
            center: true
        },
        { 
            name: 'TÊN NGƯỜI DÙNG', 
            selector: row => row.hoTen, 
            sortable: true, 
            grow: 2,
            cell: row => (
                <span className="font-semibold text-gray-700">
                    {row.hoTen}
                </span>
            )
        },
        { 
            name: 'EMAIL', 
            selector: row => row.email, 
            sortable: true, 
            grow: 2,
            cell: row => (
                <span className="text-gray-600">
                    {row.email}
                </span>
            )
        },
        { 
            name: 'SỐ ĐIỆN THOẠI', 
            selector: row => row.soDienThoai, 
            sortable: true,
            cell: row => (
                <span className="text-gray-600">
                    {row.soDienThoai || 'N/A'}
                </span>
            )
        },
        {
            name: 'TRẠNG THÁI',
            selector: row => row.trangThai,
            sortable: true,
            center: true,
            cell: row => {

                return (
                <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase border w-25 text-center ${
                    row.trangThai 
                        ? "bg-green-100 text-green-700 border-green-200" 
                        : "bg-red-100 text-red-700 border-red-200"
                }`}>
                    {row.trangThai ? "Hoạt động" : "Bị khóa"}
                </span>
                )
            }
        },
        {
            name: 'HÀNH ĐỘNG',
            width: '250px',
            center: true,
            cell: row => {
                const isDisabled = row.trangThai === true;
                return (
                <div className="flex items-center justify-center gap-2">
                    {row.trangThai ? (
                        <button 
                            onClick={() => onLock(row.maNguoiDung)} 
                            className="p-2 text-orange-500 hover:bg-orange-100 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                        >
                            <Lock size={16} /> Khóa
                        </button>
                    ) : (
                        <button 
                            onClick={() => onUnlock(row.maNguoiDung)} 
                            className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                        >
                            <Unlock size={16} /> Mở
                        </button>
                    )}
                    <button
                        onClick={() => handleDeleteAttempt(row)}
                        title={
                            isDisabled
                            ? "Thương hiệu đang hiển thị (Hiện), không thể xóa"
                            : "Xóa thương hiệu (xóa mềm)"
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
            }
        }
    ];

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <TableSearch 
                    filterText={filterText} 
                    onFilter={e => setFilterText(e.target.value)} 
                    placeholder="Tìm kiếm..."
                />
                
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-gray-400" />
                        <select 
                            className="border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                            value={filterType}
                            onChange={(e) => onFilterTypeChange(e.target.value)}
                        >
                            <option value="all">Tất cả</option>
                            <option value="active">Đang hoạt động</option>
                            <option value="lock">Đang bị khóa</option>
                        </select>
                    </div>
                    <button 
                        onClick={onOpenAddModal}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium shadow-md cursor-pointer"
                    >
                        <Plus size={16} />
                        <span>Thêm mới</span>
                    </button>
                    <button
                        onClick={() => navigate('/quan-ly/nguoi-dung/khoi-phuc')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all font-medium shadow-md cursor-pointer"
                    >
                        <History size={16} /> Danh sách đã xóa
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-4">
                <DataTable
                    columns={columns}
                    data={filteredItems}
                    pagination
                    paginationComponent={Pagination}
                    paginationPerPage={5}
                    paginationRowsPerPageOptions={[5, 10, 15, 20]}
                    persistTableHead
                    className="custom-datatable"
                    sortIcon={<ArrowUpIcon size={14} className="ml-1 text-gray-400" />}
                    highlightOnHover
                    responsive
                    noDataComponent={
                        <div className="p-12 text-center text-gray-400 font-medium">
                            Không tìm thấy người dùng nào.
                        </div>
                    }
                />
            </div>
        </div>
    );
};

export default UserTable;