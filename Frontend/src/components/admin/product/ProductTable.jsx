import { useState } from "react";
import DataTable from "react-data-table-component";
import { Plus, ArrowUpIcon, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TableSearch from "../../admin/TableSearch";
import Pagination from "../Pagination";

const ProductTable = ({ data = [], loading }) => {
    const navigate = useNavigate();
    const [filterText, setFilterText] = useState("");

    const filteredItems = data.filter(
        item =>
            item.tenSanPham?.toLowerCase().includes(filterText.toLowerCase()) ||
            item.slug?.toLowerCase().includes(filterText.toLowerCase()) ||
            item.tenDanhMuc?.toLowerCase().includes(filterText.toLowerCase()) ||
            item.tenThuongHieu?.toLowerCase().includes(filterText.toLowerCase()) ||
            item.tongSoLuong?.toString().includes(filterText) ||
            item.trangThai?.toString().includes(filterText).toLowerCase
    );
    // const formatDateTime = (dateString) => {
    //     if (!dateString) return "N/A";
    //     const date = new Date(dateString);

    //     const day = String(date.getDate()).padStart(2, '0');
    //     const month = String(date.getMonth() + 1).padStart(2, '0');
    //     const year = date.getFullYear();

    //     const hours = String(date.getHours()).padStart(2, '0');
    //     const minutes = String(date.getMinutes()).padStart(2, '0');

    //     return `${hours}:${minutes} - ${day}/${month}/${year}`;
    // };
    const columns = [
        {
            name: "STT",
            selector: (_, index) => index + 1,
            width: "80px",
            center: true,
        },
        {
            name: "TÊN SẢN PHẨM",
            selector: row => row.tenSanPham,
            sortable: true,
            width: "150px",
            grow: 2,
            cell: row => (
                <span className="font-semibold text-gray-700">
                    {row.tenSanPham}
                </span>
            ),
        },
        {
            name: "SLUG",
            selector: row => row.slug,
            sortable: true,
            width: "150px",
            grow: 2,
            cell: row => (
                <span className="font-semibold text-gray-700">
                    {row.slug}
                </span>
            ),
        },
        {
            name: "DANH MỤC",
            selector: row => row.tenDanhMuc,
            sortable: true,
            width: "150px",
            cell: row => (
                <span className="text-gray-600">
                    {row.tenDanhMuc}
                </span>
            ),
        },
        {
            name: "THƯƠNG HIỆU",
            selector: row => row.tenThuongHieu,
            sortable: true,
            width: "150px",
            cell: row => (
                <span className="text-gray-600">
                    {row.tenThuongHieu}
                </span>
            ),
        },
        {
            name: "SỐ LƯỢNG",
            selector: row => row.tongSoLuong,
            sortable: true,
            center: true,
            width: "150px",
            cell: row => (
                <span className="font-semibold">
                    {row.tongSoLuong}
                </span>
            ),
        },
        {
            name: "TRẠNG THÁI",
            selector: row => row.trangThai,
            sortable: true,
            center: true,
            width: "150px",
            cell: row => (
                <span
                    className={`
                inline-flex items-center gap-1.5
                px-3 py-1.5 text-sm font-semibold rounded-full
                border border-current whitespace-nowrap
                ${row.trangThai
                            ? 'text-green-700 bg-green-100 border-green-400'
                            : 'text-red-700 bg-red-100 border-red-400'
                        }
            `}
                >
                    {row.trangThai ? (
                        <>
                            Còn hàng
                        </>
                    ) : (
                        <>
                            Hết hàng
                        </>
                    )}
                </span>
            ),
        },
        {
            name: "HÀNH ĐỘNG",
            center: true,
            width: "180px",
            cell: row => (
                <button
                    onClick={() =>
                        navigate(`/quan-ly/san-pham/${row.maSanPham}`)
                    }
                    className="p-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                    <Eye size={16} />
                    Chi tiết
                </button>
            ),
        },
    ];

    return (
        <div className="w-full space-y-4">
            {/* HEADER */}
            <div className="flex items-center justify-end w-full gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <TableSearch
                    filterText={filterText}
                    onFilter={e => setFilterText(e.target.value)}
                    placeholder="Tìm kiếm sản phẩm..."
                />

                <button
                    onClick={() =>
                        navigate("/quan-ly/san-pham/them-san-pham")
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium shadow-md cursor-pointer"
                >
                    <Plus size={16} />
                    <span>Thêm mới</span>
                </button>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-4">
                <DataTable
                    columns={columns}
                    data={filteredItems}
                    progressPending={loading}
                    progressComponent={
                        <div className="p-8 text-gray-500">
                            Đang tải dữ liệu...
                        </div>
                    }
                    pagination
                    paginationComponent={Pagination}
                    paginationPerPage={5}
                    persistTableHead
                    sortIcon={
                        <ArrowUpIcon size={14} className="ml-1 text-gray-400" />
                    }
                    highlightOnHover
                    responsive
                    noDataComponent={
                        <div className="p-12 text-center text-gray-400 font-medium">
                            Không tìm thấy sản phẩm nào.
                        </div>
                    }
                    className="custom-datatable"
                />
            </div>
        </div>
    );
};

export default ProductTable;
