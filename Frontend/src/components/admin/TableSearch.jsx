import { Search, X } from "lucide-react";

const TableSearch = ({ filterText, onFilter, placeholder = "Tìm kiếm..." }) => {
    const handleClear = () => {
        const event = {
            target: { value: "" }
        };
        onFilter(event);
    };

    return (
        <div className="relative flex-1 group">
            <Search 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                size={16} 
            />

            <input
                type="text"
                placeholder={placeholder}
                className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all text-sm"
                value={filterText}
                onChange={onFilter}
            />
            {filterText && (
                <button
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    title="Xóa nội dung"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
};

export default TableSearch;