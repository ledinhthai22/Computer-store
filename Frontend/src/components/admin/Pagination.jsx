import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({ rowsPerPage, rowCount, onChangePage, currentPage }) => {
  const [jumpPage, setJumpPage] = useState('');

  const totalPages = Math.ceil(rowCount / rowsPerPage);

  // Logic tạo danh sách trang hiển thị
  const getVisiblePages = () => {
    const around = 1; // Số trang hiển thị quanh trang hiện tại
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - around && i <= currentPage + around)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  const handleJumpSubmit = (e) => {
    if (e.key === 'Enter') {
      const pageNum = parseInt(jumpPage);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        onChangePage(pageNum);
        setJumpPage('');
      }
    }
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-6 select-none">
      {/* Nút Về đầu trang */}
      <button
        onClick={() => onChangePage(1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors cursor-pointer whitespace-nowrap"
      >
        <ChevronsLeft size={18} />
      </button>

      {/* Nút Previous */}
      <button
        onClick={() => onChangePage(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors cursor-pointer whitespace-nowrap"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Danh sách trang */}
      <div className="flex items-center gap-1">
        {getVisiblePages().map((page, index) => {
          if (page === '...') {
            return (
              <div key={`dots-${index}`} className="relative group flex items-center">
                <span className="w-9 h-9 flex items-center justify-center text-gray-400 group-hover:hidden cursor-pointer whitespace-nowrap">
                  ...
                </span>
                <input
                  type="number"
                  placeholder="Go"
                  value={jumpPage}
                  onChange={(e) => setJumpPage(e.target.value)}
                  onKeyDown={handleJumpSubmit}
                  className="hidden group-hover:block w-12 h-9 border border-blue-300 rounded-md text-center text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            );
          }

          return (
            <button
              key={index}
              onClick={() => onChangePage(page)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                currentPage === page
                  ? 'bg-[#2F9EA0] text-white shadow-md'
                  : 'text-gray-600 hover:bg-[#2F9EA0]/10 hover:text-[#2F9EA0]'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Nút Next */}
      <button
        onClick={() => onChangePage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors cursor-pointer whitespace-nowrap"
      >
        <ChevronRight size={18} />
      </button>

      {/* Nút Đến cuối trang */}
      <button
        onClick={() => onChangePage(totalPages)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors cursor-pointer whitespace-nowrap"
      >
        <ChevronsRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;