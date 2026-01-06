import { useState } from "react";
import DataTable from "react-data-table-component";
import { Eye, Trash2, ArrowUpIcon } from "lucide-react";
import TableSearch from "../../admin/TableSearch";
import Pagination from "../Pagination";

const ContactTable = ({ data, loading, onDelete }) => { 
    const [filterText, setFilterText] = useState('');

    const filteredItems = data.filter(
        item => item.author && item.author.toLowerCase().includes(filterText.toLowerCase()) ||
                item.quote && item.quote.toLowerCase().includes(filterText.toLowerCase())
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
            selector: row => row.author,
            sortable: true,
            grow: 2,
            cell: row => (
                <span className="font-semibold text-gray-700 capitalize">
                    {row.author}
                </span>
            ),
        },
        {
            name: 'NỘI DUNG',
            selector: row => row.quote,
            sortable: true,
            grow: 2,
            cell: row => (
                <span className="text-gray-700" title={row.quote}>
                {truncateText(row.quote, 6)}
        </span>
            ),
        },
        {
            name: 'TRẠNG THÁI',
            selector: row => row.author,
            sortable: true,
            grow: 2,
            cell: row => (
                <span className="font-semibold text-gray-700 capitalize">
                    {row.author}
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

                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        title="Xem"
                    >
                        <Eye size={18} /> Xem
                    </button>
                    <button 
                        //onClick={() => onDelete(row.maLienHe)}
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