import { useState } from "react";
import DataTable from "react-data-table-component";
import { Edit, Trash2, Plus, History, ArrowUpIcon, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TableSearch from "../../admin/TableSearch";
import Pagination from "../Pagination";

const CategoryTable = ({
  data = [],
  loading,
  onEdit,
  onDelete,
  onOpenAddModal,
  filterType,
  onFilterTypeChange,
  showToast, // Prop từ component cha để hiển thị Toast
}) => {
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState("");

  const filteredItems = data.filter(
    (item) =>
      (item.tenDanhMuc?.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.slug?.toLowerCase().includes(filterText.toLowerCase()))
  );

  const handleDeleteAttempt = (row) => {
    if (row.trangThai === true) {
      // Không cho xóa khi đang "Hiện" → Hiển thị Toast cảnh báo
      showToast("Không thể xóa danh mục đang hiển thị (Hiện)!", "error");
      return;
    }

    // Gọi hàm xóa từ cha (onDelete)
    onDelete(row.maDanhMuc);
    // Toast thành công/thất bại sẽ do component cha xử lý sau khi API hoàn tất
  };

  const columns = [
    {
      name: "STT",
      selector: (row, index) => index + 1,
      width: "80px",
      sortable: false,
    },
    {
      name: "TÊN DANH MỤC",
      selector: (row) => row.tenDanhMuc,
      sortable: true,
      grow: 2,
      minWidth: "220px",
      cell: (row) => (
        <span className="font-semibold text-gray-700 capitalize">
          {row.tenDanhMuc}
        </span>
      ),
    },
    {
      name: "SLUG",
      selector: (row) => row.slug,
      sortable: true,
      grow: 2,
      minWidth: "220px",
      cell: (row) => (
        <span className="font-semibold text-gray-700">
          {row.slug}
        </span>
      ),
    },
    {
      name: "TRẠNG THÁI",
      selector: (row) => row.trangThai,
      sortable: true,
      width: "140px",
      center: true,
      cell: (row) => {
        const isActive = row.trangThai === true;

        return (
          <span
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase border ${
              isActive
                ? "bg-green-100 text-green-700 border-green-200"
                : "bg-gray-100 text-gray-600 border-gray-200"
            }`}
          >
            {isActive ? "Hiện" : "Ẩn"}
          </span>
        );
      },
    },
    {
      name: "HÀNH ĐỘNG",
      center: true,
      width: "220px",
      cell: (row) => {
        const isDisabled = row.trangThai === true;

        return (
          <div className="flex items-center gap-2 justify-center">
            {/* Nút Sửa */}
            <button
              onClick={() => onEdit(row)}
              className="p-2 text-amber-500 hover:bg-amber-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              title="Chỉnh sửa danh mục"
            >
              <Edit size={18} />
              <span className="hidden sm:inline">Sửa</span>
            </button>

            {/* Nút Xóa */}
            <button
              onClick={() => handleDeleteAttempt(row)}
              disabled={isDisabled}
              title={
                isDisabled
                  ? "Danh mục đang hiển thị (Hiện), không thể xóa"
                  : "Xóa danh mục (xóa mềm)"
              }
              className={`p-2 rounded-lg transition-colors flex items-center gap-1 cursor-pointer
                ${
                  isDisabled
                    ? "text-gray-400 cursor-not-allowed bg-gray-100"
                    : "text-red-500 hover:bg-red-100"
                }
              `}
            >
              <Trash2 size={18} />
              <span className="hidden sm:inline">Xóa</span>
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
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md cursor-pointer"
          >
            <Plus size={16} />
            <span>Thêm mới</span>
          </button>

          <button
            onClick={() => navigate("/quan-ly/danh-muc/khoi-phuc")}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-md cursor-pointer"
          >
            <History size={16} />
            <span className="hidden lg:inline">Danh sách đã xóa</span>
            <span className="lg:hidden">Khôi phục</span>
          </button>
        </div>
      </div>

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