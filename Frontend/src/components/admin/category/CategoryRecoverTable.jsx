import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { History, ArrowUpIcon, ArrowLeft } from "lucide-react";
import TableSearch from '../../admin/TableSearch';
import Pagination from '../Pagination';

const CategoryRecoverTable = ({ data = [], loading, onRecover }) => {
    const [filterText, setFilterText] = useState('');
    const navigate = useNavigate();

    const filteredItems = data.filter(
        item => 
            (item.tenDanhMuc && item.tenDanhMuc.toLowerCase().includes(filterText.toLowerCase())) ||
            (item.slug && item.slug.toLowerCase().includes(filterText.toLowerCase()))
    );

    const columns = [
        {
            name: 'STT',
            selector: (row, index) => index + 1,
            width: '80px',
            sortable: false,
        },
        {
            name: 'DANH MỤC',
            selector: row => row.tenDanhMuc,
            sortable: true,
            grow: 1.5,
            cell: row => (
                <span className="font-semibold text-gray-700 capitalize">
                    {row.tenDanhMuc}
                </span>
            ),
        },
        {
            name: 'SLUG',
            selector: row => row.slug,
            sortable: true,
            cell: row => (
                <span className="text-gray-500">
                    {row.slug}
                </span>
            ),
        },
        {
            name: "TRẠNG THÁI",
            selector: (row) => row.trangThai,
            sortable: true,
            width: "150px",
            center: true,
            cell: (row) => {
                const isActive = row.trangThai === true;

                return (
                <span
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase border w-25 text-center ${
                    isActive
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                >
                    {isActive ? "Hoạt động" : "Ẩn"}
                </span>
                );
            },
        },
        {
            name: 'HÀNH ĐỘNG',
            width: '400px',
            center: true,
            cell: row => (
                <div className="flex justify-center w-full"> 
                    <button 
                        onClick={() => onRecover(row.maDanhMuc)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#00e676] hover:bg-[#00c853] text-white rounded-lg transition-all font-medium shadow-sm whitespace-nowrap cursor-pointer"
                    >
                        <History size={18} />
                        <span>Khôi phục</span>
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="w-full p-4 space-y-4">
            <div className="flex items-center w-full gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#2962ff] hover:bg-[#0039cb] text-white rounded-lg transition-colors text-sm font-medium shadow-sm cursor-pointer whitespace-nowrap"
                >
                    <ArrowLeft size={16} />
                    Quay lại
                </button>

                <TableSearch 
                    filterText={filterText} 
                    onFilter={e => setFilterText(e.target.value)} 
                    placeholder="Tìm kiếm..."
                />
            </div>

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
                            Không tìm thấy danh mục nào trong danh sách xóa.
                        </div>
                    }
                />
            </div>
        </div>
    );
};

export default CategoryRecoverTable;