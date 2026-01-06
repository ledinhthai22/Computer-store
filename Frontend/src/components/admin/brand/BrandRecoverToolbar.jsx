import { ArrowUpDown, ArrowLeft } from 'lucide-react';
import Searchbar from '../Searchbar';
import { useNavigate } from 'react-router-dom';
const BrandRecoverToolbar = ({ 
  search, 
  onSearchChange, 
  sortOrder, 
  onSortChange,
}) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
      <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-colors group whitespace-nowrap cursor-pointer"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform " />
          <span>Quay lại</span>
        </button>
      {/* Search */}
      <Searchbar value={search} onChange={onSearchChange} />

      <div className="flex w-full sm:w-auto gap-3">
        {/* Sort Dropdown */}
        <div className="relative flex-1 sm:flex-none">
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <select
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full sm:w-auto pl-9 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none bg-white whitespace-nowrap cursor-pointer"
          >
            <option value="tenDanhMuc-asc">Tên thương hiệu (A-Z)</option>
            <option value="tenDanhMuc-desc">Tên thương hiệu (Z-A)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default BrandRecoverToolbar;