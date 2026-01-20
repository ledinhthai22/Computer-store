import { useState } from "react";
import DataTable from "react-data-table-component";
import { Edit, Trash2, Plus, History, ArrowUpIcon, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TableSearch from "../../admin/TableSearch";
import Pagination from "../Pagination";

const CategoryTable = ({ data, loading, onEdit, onDelete, onOpenAddModal, filterType, onFilterTypeChange }) => {
    const navigate = useNavigate();
    const [filterText, setFilterText] = useState('');

    const filteredItems = data.filter(
        item => item.tenDanhMuc && item.tenDanhMuc.toLowerCase().includes(filterText.toLowerCase()) ||
            item.slug && item.slug.toLowerCase().includes(filterText.toLowerCase()),
    );
    const columns = [
        {
            name: 'STT',
            selector: (row, index) => index + 1,
            width: '80px',
            sortable: false,
        },
        {
            name: 'TÊN DANH MỤC',
            selector: row => row.tenDanhMuc,
            sortable: true,
            grow: 2,
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
            grow: 2,
            cell: row => (
                <span className="font-semibold text-gray-700 capitalize">
                    {row.slug}
                </span>
            ),
        },
        {
            name: "TRẠNG THÁI",
            selector: row => row.trangThai,
            cell: row => (
                <span
                    className={`px-5 py-1.5 text-sm font-semibold rounded-full border border-current text-center w-18
                ${row.trangThai
                            ? 'text-green-700 bg-green-100 border-green-400'
                            : 'text-red-700 bg-red-100 border-red-400'
                        }
            `}
                >
                    {row.trangThai ? ('Hiện') : ('Ẩn')}
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
                        onClick={() => onDelete(row.maDanhMuc)}
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
                <div className="flex items-center gap-2">
                        <Filter size={18} className="text-gray-400" />
                        <select 
                            className="border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                            value={filterType}
                            onChange={(e) => onFilterTypeChange(e.target.value)}
                        >
                            <option value="all">Tất cả</option>
                            <option value="active">Đang hoạt động</option>
                            <option value="inactive">Đang ẩn</option>
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
                    onClick={() => navigate('/quan-ly/danh-muc/khoi-phuc')}
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
                            Không tìm thấy danh mục nào.
                        </div>
                    }
                />
            </div>
        </div>
    );
};

export default CategoryTable;