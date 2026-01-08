import { useState } from "react";
import DataTable from "react-data-table-component";
import { Eye, Trash2, ArrowUpIcon } from "lucide-react";
import TableSearch from "../../admin/TableSearch";
import Pagination from "../Pagination";

const ContactTable = ({ data, loading, onDelete, onView }) => { 
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
    const columns = [
        {
            name: 'STT',
            selector: (row, index) => index + 1,
            width: '80px',
            sortable: false,
        },
        {
            name: 'EMAIL LIÊN HỆ',
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
            name: 'TRẠNG THÁI',
            selector: row => row.message,
            sortable: true,
            width: '160px', // Tăng nhẹ độ rộng để nhãn không bị gò bó
            cell: row => {
                // Kiểm tra chính xác giá trị text trả về từ API
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
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        title="Xem"
                    >
                        <Eye size={18} /> Xem
                    </button>
                    <button 
                        onClick={() => onDelete(row.maLienHe)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
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
            <div className="w-full space-y-4">
            <div className="flex items-center justify-end w-full gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <TableSearch 
                    filterText={filterText} 
                    onFilter={e => setFilterText(e.target.value)} 
                    placeholder="Tìm kiếm..."
                />
            </div>

            {/* DATATABLE */}
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