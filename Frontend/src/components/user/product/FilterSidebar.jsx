import React, { useState } from "react";

// Thêm prop showCategories = true
export default function FilterSidebar({ categories, brands, onFilterChange, showBrands = true, showCategories = true }) {
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);

    const handleCategoryClick = (id) => {
        const newValue = selectedCategory === id ? null : id;
        setSelectedCategory(newValue);
        onFilterChange("MaDanhMuc", newValue);
    };

    const handleBrandClick = (id) => {
        const newValue = selectedBrand === id ? null : id;
        setSelectedBrand(newValue);
        onFilterChange("MaThuongHieu", newValue);
    };

    const handleApplyPrice = () => {
        onFilterChange("Gia", { min: priceRange.min, max: priceRange.max });
    };

    return (
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 sticky top-24 transition-all">
            
            {/* --- PHẦN 1: DANH MỤC (Chỉ hiện khi showCategories = true) --- */}
            {showCategories && categories && categories.length > 0 && (
                <div className="mb-8">
                    <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide mb-4 border-l-4 border-[#2f9ea0] pl-2">
                        Nhu cầu sử dụng
                    </h3>
                    <ul className="space-y-1">
                        {categories.map((cat) => (
                            <li 
                                key={cat.id} 
                                onClick={() => handleCategoryClick(cat.id)}
                                className={`
                                    group cursor-pointer text-[15px] py-2 px-3 rounded-md transition-all duration-200 flex justify-between items-center
                                    ${selectedCategory === cat.id 
                                        ? "bg-[#2f9ea0]/10 text-[#2f9ea0] font-semibold" 
                                        : "text-gray-600 hover:bg-gray-50 hover:text-[#2f9ea0]"
                                    }
                                `}
                            >
                                <span>{cat.name}</span>
                                {selectedCategory === cat.id && (
                                    <span className="text-xs text-[#2f9ea0]">●</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* --- PHẦN 2: THƯƠNG HIỆU (Chỉ hiện khi showBrands = true) --- */}
            {showBrands && brands && brands.length > 0 && (
                <div className={`mb-8 border-gray-200 pt-6 ${showCategories ? 'border-t border-dashed' : ''}`}>
                    <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide mb-4 border-l-4 border-[#2f9ea0] pl-2">
                        Thương hiệu
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {brands.map((brand) => (
                            <button 
                                key={brand.id}
                                onClick={() => handleBrandClick(brand.id)}
                                className={`
                                    text-xs px-3 py-1.5 rounded-full border transition-all duration-200 font-medium
                                    ${selectedBrand === brand.id
                                        ? "bg-[#2f9ea0] border-[#2f9ea0] text-white shadow-md transform scale-105"
                                        : "bg-white border-gray-200 text-gray-600 hover:border-[#2f9ea0] hover:text-[#2f9ea0]"
                                    }
                                `}
                            >
                                {brand.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* --- PHẦN 3: KHOẢNG GIÁ --- */}
            <div className={`border-t border-dashed border-gray-200 pt-6 ${(!showBrands && !showCategories) ? 'mt-0' : ''}`}>
                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide mb-4 border-l-4 border-[#2f9ea0] pl-2">
                    Khoảng giá
                </h3>
                {/* (Giữ nguyên phần input giá như cũ) */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="relative w-full">
                        <input type="number" placeholder="0" value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: e.target.value})} className="w-full pl-3 pr-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#2f9ea0] focus:ring-1 focus:ring-[#2f9ea0] transition-colors" />
                        <span className="absolute right-2 top-2 text-xs text-gray-400">₫</span>
                    </div>
                    <span className="text-gray-400 font-light">-</span>
                    <div className="relative w-full">
                        <input type="number" placeholder="Max" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: e.target.value})} className="w-full pl-3 pr-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#2f9ea0] focus:ring-1 focus:ring-[#2f9ea0] transition-colors" />
                        <span className="absolute right-2 top-2 text-xs text-gray-400">₫</span>
                    </div>
                </div>
                <button onClick={handleApplyPrice} className="w-full bg-[#2f9ea0] text-white text-sm py-2.5 rounded-md font-medium hover:bg-blue-600 active:scale-95 transition-all duration-200 shadow-sm hover:shadow">
                    Áp dụng bộ lọc
                </button>
            </div>
        </div>
    );
}