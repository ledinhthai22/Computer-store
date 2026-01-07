import { useState } from "react";
import DataTable from "react-data-table-component";
import { Plus, History, ArrowUpIcon, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TableSearch from "../../admin/TableSearch";
import Pagination from "../Pagination";

const ProductTable = ({ data, loading}) => {
    const navigate = useNavigate();
    const [filterText, setFilterText] = useState('');

    const filteredItems = data.filter(
        item => (item.tenSanPham && item.tenSanPham?.toLowerCase().includes(filterText.toLowerCase())) ||
                (item.tenDanhMuc && item.tenDanhMuc?.toLowerCase().includes(filterText.toLowerCase())) || 
                (item.tenThuongHieu && item.tenThuongHieu?.toLowerCase().includes(filterText.toLowerCase())) ||
                (item.soLuongTon && item.soLuongTon?.toString().includes(filterText))
    );

    const columns = [
        {
            name: 'STT',
            selector: (row, index) => index + 1,
            width: '60px',
            sortable: false,
            center: true,
        },
        {
            name: 'TÊN SẢN PHẨM',
            selector: row => row.tenSanPham,
            sortable: true,
            grow: 2,
            width: '150px',
            cell: row => (
                <span className="font-semibold text-gray-600">
                    {row.tenSanPham || 'N/A'}
                </span>
            ),
        },
        {
            name: 'DANH MỤC',
            selector: row => row.tenDanhMuc,
            sortable: true,
            width: '150px',
            cell: row => (
                <span className="text-gray-600">
                    {row.tenDanhMuc || 'N/A'}
                </span>
            ),
        },
        {
            name: 'THƯƠNG HIỆU',
            selector: row => row.tenThuongHieu,
            sortable: true,
            width: 'auto',
            cell: row => (
                <span className="text-gray-600">
                    {row.tenThuongHieu || 'N/A'}
                </span>
            ),
        },
        {
            name: 'SỐ LƯỢNG',
            selector: row => row.soLuongTon,
            sortable: true,
            width: 'auto',
            center: true,
            cell: row => (
                <span className="text-gray-600">
                    {row.soLuongTon || 0}
                </span>
            ),
        },
        {
            name: 'HÀNH ĐỘNG',
            center: true,
            width: '250px',
            cell: row => (
                <div className="flex items-center gap-1">
                    <button 
                        onClick={() => navigate(`/quan-ly/san-pham/${row.maSanPham}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#00e676] hover:bg-[#00c853] text-white rounded-lg transition-all font-medium shadow-sm cursor-pointer whitespace-nowrap"
                        title="Xem chi tiết"
                    >
                        <Eye size={18} /> Xem chi tiết
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
                    placeholder="Tìm kiếm sản phẩm..."
                />
                <button 
                    onClick={() => navigate('/quan-ly/san-pham/them-moi')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium shadow-md cursor-pointer whitespace-nowrap"
                >
                    <Plus size={16} />
                    <span>Thêm mới</span>
                </button>
                
                <button 
                    onClick={() => navigate('/quan-ly/san-pham/khoi-phuc')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all font-medium shadow-md cursor-pointer whitespace-nowrap"
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
                            Không tìm thấy sản phẩm nào.
                        </div>
                    }
                />
            </div>
        </div>
    );
};

export default ProductTable;