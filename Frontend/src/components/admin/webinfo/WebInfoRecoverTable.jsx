import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { RotateCcw, ArrowUpIcon, ArrowLeft, Eye } from "lucide-react";
import TableSearch from "../../admin/TableSearch";
import Pagination from "../Pagination";

const WebInfoRecoverTable = ({ data = [], loading, onRecover, onView }) => {
  const [filterText, setFilterText] = useState("");
  const navigate = useNavigate();

  const filteredItems = data.filter(
    (item) =>
      item.tenKhoaCaiDat?.toLowerCase().includes(filterText.toLowerCase()) ||
      item.giaTriCaiDat?.toLowerCase().includes(filterText.toLowerCase()) ||
      item.moTa?.toLowerCase().includes(filterText.toLowerCase())
  );

  const truncateText = (text, wordLimit) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  const columns = [
    {
      name: "STT",
      selector: (row, index) => index + 1,
      width: "80px",
    },
    {
      name: "KHÓA CẤU HÌNH",
      selector: (row) => row.tenKhoaCaiDat,
      sortable: true,
      grow: 2,
      minWidth: "220px",
      cell: (row) => (
        <span className="font-semibold text-gray-700">
          {row.tenKhoaCaiDat}
        </span>
      ),
    },
    {
      name: "GIÁ TRỊ",
      selector: (row) => row.giaTriCaiDat,
      sortable: false,
      grow: 3,
      minWidth: "250px",
      cell: (row) => (
        <span className="text-gray-700" title={row.giaTriCaiDat}>
          {truncateText(row.giaTriCaiDat, 8)}
        </span>
      ),
    },
    // {
    //   name: "MÔ TẢ",
    //   selector: (row) => row.moTa,
    //   sortable: false,
    //   grow: 3,
    //   minWidth: "250px",
    //   cell: (row) => (
    //     <span className="text-gray-600" title={row.moTa}>
    //       {truncateText(row.moTa, 10)}
    //     </span>
    //   ),
    // },
    {
      name: "NGÀY XÓA",
      selector: (row) => row.ngayXoa,
      sortable: true,
      width: "160px",
      cell: (row) => (
        <span className="text-sm text-gray-500">
          {row.ngayXoa
            ? new Date(row.ngayXoa).toLocaleDateString("vi-VN")
            : ""}
        </span>
      ),
    },
    {
      name: "HÀNH ĐỘNG",
      center: true,
      width: "260px",
      cell: (row) => (
        <div className="flex items-center gap-2 justify-center">
          <button
            onClick={() => onView(row)}
            className="flex items-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all font-medium shadow-sm cursor-pointer"
          >
            <Eye size={16} />
            <span className="hidden sm:inline text-sm">Xem</span>
          </button>

          <button
            onClick={() => onRecover(row.maThongTinTrang)}
            className="flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all font-medium shadow-sm cursor-pointer"
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
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium shadow-sm cursor-pointer"
        >
          <ArrowLeft size={16} />
          Quay lại
        </button>

        <div className="flex-1 max-w-md">
          <TableSearch
            filterText={filterText}
            onFilter={(e) => setFilterText(e.target.value)}
            placeholder="Tìm kiếm cấu hình đã xóa..."
          />
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
          sortIcon={
            <ArrowUpIcon size={14} className="ml-1 text-gray-400" />
          }
          highlightOnHover
          responsive
          noDataComponent={
            <div className="p-12 text-center text-gray-400 font-medium">
              Không có cấu hình website nào đã bị xóa.
            </div>
          }
        />
      </div>
    </div>
  );
};

export default WebInfoRecoverTable;
