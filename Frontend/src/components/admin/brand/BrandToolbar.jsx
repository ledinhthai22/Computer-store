import { ArrowUpDown, Plus, History } from 'lucide-react';
import Searchbar from '../Searchbar';
import { Link } from 'react-router-dom';

const BrandToolbar = ({ 
  search, 
  onSearchChange, 
  sortOrder, 
  onSortChange,
  onOpenAddModal
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
      
      {/* Tìm kiếm */}
      <Searchbar value={search} onChange={onSearchChange} placeholder="Tìm kiếm thương hiệu..." />

      <div className="flex w-full sm:w-auto gap-3">
        {/* Sắp xếp */}
        <div className="relative flex-1 sm:flex-none">
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <select
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full sm:w-auto pl-9 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none bg-white cursor-pointer"
          >
            <option value="brandName-asc">Tên thương hiệu (A-Z)</option>
            <option value="brandName-desc">Tên thương hiệu (Z-A)</option>
          </select>
        </div>

        {/* Nút thêm mới */}
        <button 
          onClick={onOpenAddModal}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium whitespace-nowrap cursor-pointer"
        >
          <Plus size={18} /> Thêm mới
        </button>

        {/* Khôi phục */}
        <Link
          to="/quan-ly/thuong-hieu/khoi-phuc"
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium whitespace-nowrap cursor-pointer"
        >
          <History size={18} /> Khôi phục
        </Link>
      </div>
    </div>
  );
};

export default BrandToolbar;