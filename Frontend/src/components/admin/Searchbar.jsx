import { Search as SearchIcon, X } from 'lucide-react';

const Search = ({ value, onChange }) => {
  
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="relative w-full sm:w-72">
      <SearchIcon 
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
        size={18} 
      />
      <input
        type="text"
        placeholder="Tìm kiếm..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-100 transition-colors whitespace-nowrap cursor-pointer"
          type="button"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Search;