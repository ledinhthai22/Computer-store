import { useState } from "react";
import DataTable from "react-data-table-component";
import { Edit, Trash2, Plus, History, ArrowUpIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TableSearch from "../../admin/TableSearch";
import Pagination from "../Pagination";

const WebInfoTable = ({ data, loading, onEdit, onDelete, onOpenAddModal }) => {
    const navigate = useNavigate();
    const [filterText, setFilterText] = useState('');

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
            name: 'TRẠNG THÁI',
            selector: row => row.trangThai,
            sortable: true,
            width: '140px',
            center: true,
            cell: row => {
                const isActive = row.trangThai === true;
                
                return (
                    <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border whitespace-nowrap ${
                        isActive 
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                    }`}>
                        {isActive ? "Hoạt động" : "Lựa chọn"}
                    </span>
                );
            },
        },
        {
            name: 'HÀNH ĐỘNG',
            center: true,
            width: '220px',
            cell: row => (
                <div className="flex items-center gap-2 justify-center">
                    <button 
                        onClick={() => onEdit(row)}
                        className="p-2 text-amber-500 hover:bg-amber-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        title="Chỉnh sửa"
                    >
                        <Edit size={18} /> 
                        <span className="hidden sm:inline">Sửa</span>
                    </button>
                    <button 
                        onClick={() => onDelete(row.maThongTinTrang)}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        title="Xóa"
                    >
                        <Trash2 size={18} /> 
                        <span className="hidden sm:inline">Xóa</span>
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="w-full space-y-4">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex-1 max-w-md">
                    <TableSearch 
                        filterText={filterText} 
                        onFilter={e => setFilterText(e.target.value)} 
                        placeholder="Tìm kiếm thông tin trang..."
                    />
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={onOpenAddModal}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium shadow-md cursor-pointer whitespace-nowrap"
                    >
                        <Plus size={16} />
                        <span>Thêm mới</span>
                    </button>
                    
                    <button 
                        onClick={() => navigate('/quan-ly/thong-tin-trang/khoi-phuc')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all font-medium shadow-md cursor-pointer whitespace-nowrap"
                    >
                        <History size={16} />
                        <span className="hidden lg:inline">Danh sách đã xóa</span>
                        <span className="lg:hidden">Khôi phục</span>
                    </button>
                </div>
            </div>

            {/* TABLE */}
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
                                Không tìm thấy thông tin trang nào.
                            </div>
                        }
                    />
            </div>
        </div>
    );
};

export default WebInfoTable;