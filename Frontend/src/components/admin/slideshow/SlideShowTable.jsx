import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { Edit, Trash2, Plus, ArrowUpIcon } from "lucide-react";
import TableSearch from '../TableSearch';
import Pagination from '../Pagination';
const BrandTable = ({ data, loading, onEdit, onDelete, onOpenAddModal }) => {
    const [filterText, setFilterText] = useState('');

    const filteredItems = data.filter(
        item => item.duongDanSanPham && item.duongDanSanPham.toLowerCase().includes(filterText.toLowerCase()),
    );
    const columns = [
        {
            name: 'STT',
            selector: row => row.soThuTu,
            width: '80px',
            sortable: true,
        },
        {
            name: 'HÌNH ẢNH',
            selector: row => row.duongDanHinh,
            grow: 1,
            cell: row => (
                <div className="py-2">
                    <span className="text-blue-600 truncate block w-40">{row.duongDanHinh}</span>
                </div>
            ),
        },
        {
            name: 'LIÊN KẾT SẢN PHẨM',
            selector: row => row.duongDanSanPham,
            grow: 1,
        },
        {
            name: 'TRẠNG THÁI',
            selector: row => row.trangThai,
            width: '120px',
            cell: row => (
                <span className={`px-2 py-1 rounded-full text-xs ${row.trangThai === 1 ? 'bg-green-100 text-green-700 w-15 text-center' : 'bg-red-100 text-red-700 w-15 text-center'}`}>
                    {row.trangThai === 1 ? 'Hiển thị' : 'Ẩn'}
                </span>
            ),
        },
        {
            name: 'HÀNH ĐỘNG',
            center: true,
            width: '200px',
            cell: row => (
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => onEdit(row)}
                        className="p-2 text-amber-500 hover:bg-amber-100 rounded-lg cursor-pointer flex items-center gap-1"
                    >
                        <Edit size={18} /> Sửa
                    </button>
                    <button 
                        onClick={() => onDelete(row.maTrinhChieu)} // Chú ý: dùng maTrinhChieu
                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg cursor-pointer flex items-center gap-1"
                    >
                        <Trash2 size={18} /> Xóa
                    </button>
                </div>
            ),
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
                    progressComponent={<div className="p-8 text-gray-500">Đang tải dữ liệu...</div>}
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
                            Không tìm thấy thương hiệu nào.
                        </div>
                    }
                />
            </div>
        </div>
    );
};

export default BrandTable;