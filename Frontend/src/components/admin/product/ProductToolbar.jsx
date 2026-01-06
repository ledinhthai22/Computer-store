import { ArrowUpDown, Plus, History } from 'lucide-react';
import { Link } from 'react-router-dom';
const ProductToolbar = ({ 
  search, 
  onSearchChange, 
  sortOrder, 
  onSortChange
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
      
      {/* Search */}
      <Searchbar value={search} onChange={onSearchChange} />

      <div className="flex w-full sm:w-auto gap-3">
        {/* Sort Dropdown */}
        <div className="relative flex-1 sm:flex-none">
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <select
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full sm:w-auto pl-9 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none bg-white cursor-pointer"
          >
            <option value="title-asc">Tên sản phẩm (A-Z)</option>
            <option value="title-desc">Tên sản phẩm (Z-A)</option>
            <option value="category-asc">Danh mục (A-Z)</option>
            <option value="category-desc">Danh mục (Z-A)</option>
            <option value="price-asc">Giá (Thấp - Cao)</option>
            <option value="price-desc">Giá (Cao - Thấp)</option>
            <option value="discount-asc">Khuyến mãi (Thấp - Cao)</option>
            <option value="discount-desc">Khuyến mãi (Cao - Thấp)</option>
            <option value="stock-asc">Số lượng (Thấp - Cao)</option>
            <option value="stock-desc">Số lượng (Cao - Thấp)</option>
          </select>
        </div>

        {/* Add  */}
        <Link 
          to="#" 
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
        >
          <Plus size={18} />
          Thêm
        </Link>
        {/* Restore */}
        <Link
          to="#"
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
        >
          <History size={18} />
          Khôi phục
        </Link>
      </div>
    </div>
  );
};

export default ProductToolbar;