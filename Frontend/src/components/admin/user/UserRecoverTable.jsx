import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { History, ArrowUp, ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import TableSearch from '../TableSearch';
import Pagination from '../Pagination';

const UserRecoverTable = ({ data = [], loading, onRecover }) => {
    const [filterText, setFilterText] = useState('');
    const navigate = useNavigate();

    const filteredItems = data.filter(
        item => item.hoTen?.toLowerCase().includes(filterText.toLowerCase()) ||
            item.email?.toLowerCase().includes(filterText.toLowerCase()) ||
            item.soDienThoai?.includes(filterText)
    );

    const columns = [
        {
            name: 'STT',
            selector: (row, index) => index + 1,
            width: '80px',
            center: true,
            sortable: false
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
            name: 'HÀNH ĐỘNG',
            minWidth: '150px',
            center: true,
            cell: row => (
                <button 
                    onClick={() => onRecover(row.maNguoiDung)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#00e676] hover:bg-[#00c853] text-white rounded-lg transition-all font-medium shadow-sm cursor-pointer whitespace-nowrap"
                >
                    <History size={18} />
                    <span>Khôi phục</span>
                </button>
            )
        }
    ];

    return (
        <div className="w-full space-y-4">
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
                    placeholder="Tìm kiếm người dùng đã xóa..."
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
                    paginationRowsPerPageOptions={[5, 10, 15, 20]}
                    persistTableHead
                    className="custom-datatable"
                    sortIcon={<ArrowUp size={14} className="ml-1 text-gray-400" />}
                    highlightOnHover
                    responsive
                    noDataComponent={
                        <div className="p-12 text-center text-gray-400 font-medium">
                            Không tìm thấy người dùng nào trong danh sách đã xóa.
                        </div>
                    }
                />
            </div>
        </div>
    );
};

export default UserRecoverTable;