import { useState } from "react";
import DataTable from "react-data-table-component";
import { Eye, Trash2, ArrowUpIcon, Filter } from "lucide-react";
import TableSearch from "../../admin/TableSearch";
import Pagination from "../Pagination";

const ContactTable = ({ data, loading, onDelete, onView, filterType, onFilterTypeChange }) => { 
    const [filterText, setFilterText] = useState('');

    const filteredItems = data.filter(
        item => item.email && item.email.toLowerCase().includes(filterText.toLowerCase()) ||
                item.noiDung && item.noiDung.toLowerCase().includes(filterText.toLowerCase())
    );
    const truncateText = (text, wordLimit) => {     
        if (!text) return "";
        const words = text.split(" ");
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(" ") + "...";
        }
        return text;
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        
        // Định dạng Ngày/Tháng/Năm
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        // Định dạng Giờ:Phút
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
            name: 'EMAIL',
            selector: row => row.email,
            sortable: true,
            grow: 2,
            cell: row => (
                <span className="font-semibold text-gray-700 capitalize">
                    {row.email}
                </span>
            ),
        },
        {
            name: 'NỘI DUNG',
            selector: row => row.noiDung,
            sortable: true,
            grow: 2,
            cell: row => (
                <span className="text-gray-700" title={row.noiDung}>
                {truncateText(row.noiDung, 6)}
        </span>
            ),
        },
        {
            name: 'NGÀY',
            selector: row => row.ngayGui,
            sortable: true,
            grow: 2,
            cell: row => (
                <span className="text-gray-700" title={row.ngayGui}>
                    {formatDateTime(row.ngayGui)}
                </span>
            ),
        },
        {
            name: 'TRẠNG THÁI',
            selector: row => row.message,
            sortable: true,
            width: '160px',
            cell: row => {
                const isRead = row.message?.toLowerCase() === "đã đọc";
                
                return (
                    <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                        isRead 
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-red-100 text-red-700 border-red-200"
                    }`}>
                        {row.message}
                    </span>
                );
            },
        },
        {
            name: 'HÀNH ĐỘNG',
            center: true,
            width: '200px',
            cell: row => (
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => onView(row)}
                        className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        title="Xem"
                    >
                        <Eye size={18} /> Xem
                    </button>
                    <button 
                        onClick={() => onDelete(row.maLienHe)}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        title="Xóa"
                    >
                        <Trash2 size={18} /> Xóa
                    </button>
                </div>
            ),
        },
    ];
    return(
        <>
            <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <TableSearch 
                    filterText={filterText} 
                    onFilter={e => setFilterText(e.target.value)} 
                    placeholder="Tìm kiếm..."
                />
                
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-gray-400" />
                        <select 
                            className="border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                            value={filterType}
                            onChange={(e) => onFilterTypeChange(e.target.value)}
                        >
                            <option value="all">Tất cả</option>
                            <option value="unread">Chưa đọc</option>
                            <option value="read">Đã đọc</option>
                        </select>
                    </div>
                </div>
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
                    sortIcon={<ArrowUpIcon size={14} className="ml-1 text-gray-400" />}
                    highlightOnHover
                    responsive
                    noDataComponent={
                        <div className="p-12 text-center text-gray-400 font-medium">
                            Không tìm thấy liên hệ nào.
                        </div>
                    }
                />
            </div>
        </div>
        </>
    )
}

export default ContactTable;