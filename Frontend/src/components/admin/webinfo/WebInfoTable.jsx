import { useState } from "react";
import DataTable from "react-data-table-component";
import { Edit, Trash2, Plus, History, ArrowUpIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TableSearch from "../../admin/TableSearch";
import Pagination from "../Pagination";

const WebInfoTable = ({
    data = [],
    loading,
    onEdit,
    onDelete,
    onOpenAddModal,
    showToast,
}) => {
    const navigate = useNavigate();
    const [filterText, setFilterText] = useState("");

    const filteredItems = data.filter((item) =>
        item.tenKhoaCaiDat?.toLowerCase().includes(filterText.toLowerCase()) ||
        item.giaTriCaiDat?.toLowerCase().includes(filterText.toLowerCase()) ||
        item.moTa?.toLowerCase().includes(filterText.toLowerCase()) ||
        item.tomTat?.toLowerCase().includes(filterText.toLowerCase()) ||
        String(item.trangThaiHienThi).includes(filterText)
    );

    const truncateText = (text, wordLimit) => {
        if (!text) return "";
        const words = text.split(" ");
        return words.length > wordLimit
            ? words.slice(0, wordLimit).join(" ") + "..."
            : text;
    };

    const handleDelete = (row) => {
        if (row.trangThaiHienThi === true) {
            showToast("Không thể xóa cấu hình đang hoạt động", "error");
            return;
        }
        onDelete(row.maThongTinTrang);
    };

    const columns = [
        {
            name: "STT",
            selector: (row, index) => index + 1,
            width: "70px",
            center: true,
        },
        {
            name: "TÊN CẤU HÌNH",
            selector: (row) => row.tenKhoaCaiDat,
            sortable: true,
            width: "200px",
            cell: (row) => (
                <span className="font-semibold text-gray-700 truncate">
                    {row.tenKhoaCaiDat}
                </span>
            ),
        },
        {
            name: "GIÁ TRỊ",
            selector: (row) => row.giaTriCaiDat,
            sortable: true,
            grow: 1,
            cell: (row) => (
                <span className="text-gray-700 truncate" title={row.giaTriCaiDat}>
                    {truncateText(row.giaTriCaiDat, 6)}
                </span>
            ),
        },
        {
            name: "MÔ TẢ",
            selector: (row) => row.moTa,
            grow: 1,
            cell: (row) => (
                <span className="text-gray-600 truncate" title={row.moTa}>
                    {truncateText(row.moTa, 6)}
                </span>
            ),
        },
        {
            name: "TÓM TẮT",
            selector: (row) => row.tomTat,
            grow: 1,
            cell: (row) => (
                <span className="text-gray-600 truncate" title={row.tomTat}>
                    {truncateText(row.tomTat, 6)}
                </span>
            ),
        },
        {
            name: "TRẠNG THÁI",
            selector: (row) => row.trangThaiHienThi,
            sortable: true,
            width: "120px",
            center: true,
            cell: (row) => {
                const isActive = row.trangThaiHienThi === true;
                return (
                    <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase
                        ${isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }
                    `}
                    >
                        {isActive ? "Hoạt động" : "Ngưng"}
                    </span>
                );
            },
        },
        {
            name: "HÀNH ĐỘNG",
            width: "160px",
            center: true,
            cell: (row) => {
                const isDisabled = row.trangThaiHienThi === true;
                return (
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(row)}
                            className="p-2 text-amber-500 hover:bg-amber-100 rounded-lg"
                        >
                            <Edit size={16} />
                        </button>

                        <button
                            onClick={() => handleDelete(row)}
                            disabled={isDisabled}
                            className={`p-2 rounded-lg ${isDisabled
                                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                                    : "text-red-500 hover:bg-red-100"
                                }`}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                );
            },
        },
    ];

return (
    <div className="w-full space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex-1 max-w">
                <TableSearch
                    filterText={filterText}
                    onFilter={(e) => setFilterText(e.target.value)}
                    placeholder="Tìm kiếm..."
                />
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={onOpenAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md cursor-pointer"
                >
                    <Plus size={16} />
                    <span>Thêm mới</span>
                </button>

                <button
                    onClick={() =>
                        navigate("/quan-ly/thong-ke/khoi-phuc")
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-md cursor-pointer"
                >
                    <History size={16} />
                    <span className="hidden lg:inline">
                        Danh sách đã xóa
                    </span>
                    <span className="lg:hidden">Khôi phục</span>
                </button>
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
                persistTableHead
                className="custom-datatable"
                sortIcon={<ArrowUpIcon size={14} className="ml-1 text-gray-400" />}
                highlightOnHover
                responsive
                noDataComponent={
                    <div className="p-12 text-center text-gray-400 font-medium">
                        Không tìm thấy cấu hình nào.
                    </div>
                }
            />
        </div>
    </div>
);
};

export default WebInfoTable;
