import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { Edit, Trash2, Plus, History, ArrowUpIcon } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import TableSearch from '../../admin/TableSearch';
import Pagination from '../Pagination';
const BrandTable = ({ data, loading, onEdit, onDelete, onOpenAddModal }) => {
    const navigate = useNavigate();
    const [filterText, setFilterText] = useState('');

    const filteredItems = data.filter(
        item => item.brandName && item.brandName.toLowerCase().includes(filterText.toLowerCase()),
    );
    const columns = [
        {
            name: 'STT',
            selector: (row, index) => index + 1,
            width: '80px',
            sortable: false,
        },
        {
            name: 'TÊN THƯƠNG HIỆU',
            selector: row => row.brandName,
            sortable: true,
            grow: 2,
            cell: row => (
                <span className="font-semibold text-gray-700 capitalize">
                    {row.brandName}
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
                        className="p-2 text-amber-500 hover:bg-amber-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        title="Sửa"
                    >
                        <Edit size={18} /> Sửa
                    </button>
                    <button 
                        onClick={() => onDelete(row.brandID)}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        title="Xóa"
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
                
                <button 
                    onClick={() => navigate('/quan-ly/thuong-hieu/khoi-phuc')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all font-medium shadow-md cursor-pointer"
                >
                    <History size={16} />
                    <span>Danh sách đã xóa</span>
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