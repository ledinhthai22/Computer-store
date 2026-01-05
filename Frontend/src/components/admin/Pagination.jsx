import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Nếu chỉ có 1 trang hoặc không có dữ liệu thì không hiển thị phân trang
  if (totalPages <= 1) return null;

  // Tạo mảng số trang [1, 2, 3...]
  const pages = [...Array(totalPages).keys()].map(num => num + 1);

  return (
    <div className="flex justify-center items-center gap-2 mt-6 select-none">
      {/* Nút Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
          currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600'
        }`}
      >
        <ChevronLeft size={20} />
      </button>

      {/* Danh sách số trang */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
            currentPage === page
              ? 'bg-blue-500 text-white shadow-md shadow-blue-200' // Style cho trang đang Active
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Nút Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
          currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600'
        }`}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;