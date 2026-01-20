import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/tim-kiem?keyword=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <div className="relative flex-1 max-w-2xl">
      <div
        className={`relative flex items-center transition-all duration-300 ${
          isFocused ? 'ring-2 ring-[#2f9ea0]' : ''
        } rounded-lg bg-white`}
      >
        {/* Icon Search */}
        <div className="absolute left-3 pointer-events-none">
          <Search className="text-gray-400" size={20} />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyPress={handleKeyPress}
          placeholder="Tìm kiếm sản phẩm..."
          className="w-full pl-10 pr-20 py-2.5 border border-gray-300 rounded-lg focus:outline-none text-sm"
        />

        {/* Nút Clear */}
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Xóa"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;