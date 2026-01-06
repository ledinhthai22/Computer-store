import { Search } from "lucide-react";

const TableSearch = ({ filterText, onFilter, placeholder = "Tìm kiếm..." }) => {
    return (
        <div className="relative flex-1">
            <input
                type="text"
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all text-sm"
                value={filterText}
                onChange={onFilter}
            />
            <Search 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                size={16} 
            />
        </div>
    );
};

export default TableSearch;