import { ArrowUpDown, Plus, History } from 'lucide-react';
import Searchbar from '../Searchbar';
import { Link } from 'react-router-dom';

const AccountToolbar = ({ search, onSearchChange, sortOrder, onSortChange, onOpenAddModal }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
      <Searchbar value={search} onChange={onSearchChange} />
      <div className="flex w-full sm:w-auto gap-3">
        <div className="relative flex-1 sm:flex-none">
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <select
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full sm:w-auto pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm bg-white cursor-pointer"
          >
            <option value="accountName-asc">Họ tên (A-Z)</option>
            <option value="accountName-desc">Họ tên (Z-A)</option>
            <option value="email-asc">Email (A-Z)</option>
            <option value="email-desc">Email (Z-A)</option>
            <option value="created_at-asc">Ngày tạo (Mới-Cũ)</option>
            <option value="created_at-desc">Ngày tạo (Cũ-Mới)</option>
          </select>
        </div>
        <button onClick={onOpenAddModal} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          <Plus size={18} /> Thêm mới
        </button>
        <Link to="#" className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          <History size={18} /> Khôi phục
        </Link>
      </div>
    </div>
  );
};

export default AccountToolbar;