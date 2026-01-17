import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { RotateCcw, ArrowUpIcon, ArrowLeft, Eye } from "lucide-react";
import TableSearch from '../../admin/TableSearch';
import Pagination from '../Pagination';

const WebInfoRecoverTable = ({ data = [], loading, onRecover, onView }) => {
    const [filterText, setFilterText] = useState('');
    const navigate = useNavigate();

    const filteredItems = data.filter(
        item => item.tenTrang && item.tenTrang.toLowerCase().includes(filterText.toLowerCase()) ||
                item.soDienThoai && item.soDienThoai.toLowerCase().includes(filterText.toLowerCase()) ||
                item.diaChi && item.diaChi.toLowerCase().includes(filterText.toLowerCase())
    );
    
    const truncateText = (text, wordLimit) => {     
        if (!text) return "";
        const words = text.split(" ");
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(" ") + "...";
        }
        return text;
    };

    const columns = [
        {
            name: 'STT',
            selector: (row, index) => index + 1,
            width: '80px',
            sortable: false,
        },
        {
            name: 'TÊN TRANG',
            selector: row => row.tenTrang,
            sortable: true,
            grow: 2,
            minWidth: '200px',
            cell: row => (
                <span className="font-semibold text-gray-700">
                    {row.tenTrang}
                </span>
            ),
        },
        {
            name: 'SỐ ĐIỆN THOẠI',
            selector: row => row.soDienThoai,
            sortable: true,
            width: '150px',
            cell: row => (
                <span className="text-gray-700">
                    {row.soDienThoai}
                </span>
            ),
        },
        {
            name: 'ĐỊA CHỈ',
            selector: row => row.diaChi,
            sortable: true,
            grow: 3,
            minWidth: '200px',
            cell: row => (
                <span className="text-gray-700" title={row.diaChi}>
                    {truncateText(row.diaChi, 8)}
                </span>
            ),
        },
        {
            name: 'HÀNH ĐỘNG',
            center: true,
            width: '250px',
            cell: row => (
                <div className="flex items-center gap-2 justify-center">
                    <button 
                        onClick={() => onView(row)}
                        className="flex items-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all font-medium shadow-sm cursor-pointer"
                        title="Xem chi tiết"
                    >
                        <Eye size={16} /> 
                        <span className="hidden sm:inline text-sm">Xem</span>
                    </button>
                    <button 
                        onClick={() => onRecover(row.maThongTinTrang)}
                        className="flex items-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all font-medium shadow-sm cursor-pointer"
                        title="Khôi phục"
                    >
                        <RotateCcw size={16} /> 
                        <span className="hidden sm:inline text-sm">Khôi phục</span>
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
                                Không có thông tin trang nào đã xóa.
                            </div>
                        }
                    />
                </div>
            </div>
    );
};

export default WebInfoRecoverTable;