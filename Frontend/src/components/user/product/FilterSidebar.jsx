import React, { useState, useEffect } from "react";

export default function FilterSidebar({ 
    categories = [], 
    brands = [],
    
    // --- DỮ LIỆU MẶC ĐỊNH ---
    chips = ['i3', 'i5', 'i7', 'i9', 'Ryzen 5', 'Ryzen 7'],
    screens = ['14 inch', '15 inch', '15.6 inch', '16 inch', '17 inch'],
    gpus = ['RTX 2050','RTX 3050', 'RTX 4050', 'RTX 4060', 'RTX 5070', 'AMD Radeon'], 
    
    filters={},
    onFilterChange, 
    
    // --- CỜ HIỂN THỊ ---
    showCategories = true,
    showBrands = true,
    showChips = true,    
    showScreens = true,  
    showGPUs = true,     // <--- Cờ hiển thị mới cho GPU
    showPrice = true 
}) {
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });
    
    // State quản lý lựa chọn
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedChip, setSelectedChip] = useState(null);     
    const [selectedScreen, setSelectedScreen] = useState(null); 
    const [selectedGPU, setSelectedGPU] = useState(null); // <--- State mới cho GPU

    // Cập nhật State khi Props filters thay đổi (từ URL hoặc Parent)
    useEffect(() => {
        setSelectedCategory(filters.MaDanhMuc || null);
        setSelectedBrand(filters.MaThuongHieu || null);
        setSelectedChip(filters.BoXuLyTrungTam || null);     
        setSelectedScreen(filters.KichThuocManHinh || null); 
        setSelectedGPU(filters.BoXuLyDoHoa || null); // <--- Map với key API Swagger
        
        setPriceRange({
            min: filters.GiaMin || "",
            max: filters.GiaMax || ""
        });
    }, [filters]);

    // --- HANDLERS ---
    const handleCategoryClick = (id) => {
        const newValue = (selectedCategory === id) ? null : id;
        setSelectedCategory(newValue);
        onFilterChange("MaDanhMuc", newValue);
    };

    const handleBrandClick = (id) => {
        const newValue = (selectedBrand === id) ? null : id;
        setSelectedBrand(newValue);
        onFilterChange("MaThuongHieu", newValue);
    };

    const handleChipClick = (chipName) => {
        const newValue = (selectedChip === chipName) ? null : chipName;
        setSelectedChip(newValue);
        onFilterChange("BoXuLyTrungTam", newValue);
    };

    const handleScreenClick = (screenSize) => {
        const newValue = (selectedScreen === screenSize) ? null : screenSize;
        setSelectedScreen(newValue);
        onFilterChange("KichThuocManHinh", newValue);
    };

    // Handler mới cho GPU
    const handleGPUClick = (gpuName) => {
        const newValue = (selectedGPU === gpuName) ? null : gpuName;
        setSelectedGPU(newValue);
        // Lưu ý: Key phải khớp với Swagger ('BoXuLyDoHoa')
        onFilterChange("BoXuLyDoHoa", newValue);
    };

    const handleApplyPrice = () => {
        onFilterChange("Gia", { min: priceRange.min, max: priceRange.max });
    };

    return (
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 sticky top-24 transition-all">
            
            {/* --- PHẦN 1: DANH MỤC --- */}
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
                                {selectedCategory === cat.id && <span className="text-xs text-[#2f9ea0]">●</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* --- PHẦN 2: THƯƠNG HIỆU --- */}
            {showBrands && brands && brands.length > 0 && (
                <div className={`mb-8 ${showCategories ? 'border-t border-dashed border-gray-200 pt-6' : ''}`}>
                    <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide mb-4 border-l-4 border-[#2f9ea0] pl-2">
                        Thương hiệu
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {brands.map((brand) => (
                            <button 
                                key={brand.id}
                                onClick={() => handleBrandClick(brand.id)}
                                className={`
                                    text-xs px-3 py-1.5 rounded-full border transition-all duration-200 font-medium cursor-pointer
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

            {/* --- PHẦN 3: DÒNG CHIP --- */}
            {showChips && chips && chips.length > 0 && (
                <div className={`mb-8 ${(showCategories || showBrands) ? 'border-t border-dashed border-gray-200 pt-6' : ''}`}>
                    <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide mb-4 border-l-4 border-[#2f9ea0] pl-2">
                        Vi xử lý (CPU)
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {chips.map((chip, index) => (
                            <button 
                                key={index}
                                onClick={() => handleChipClick(chip)}
                                className={`
                                    text-xs px-3 py-1.5 rounded-md border transition-all duration-200 font-medium cursor-pointer
                                    ${selectedChip === chip
                                        ? "bg-[#2f9ea0] border-[#2f9ea0] text-white shadow-md transform scale-105"
                                        : "bg-white border-gray-200 text-gray-600 hover:border-[#2f9ea0] hover:text-[#2f9ea0]"
                                    }
                                `}
                            >
                                {chip}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* --- PHẦN 4: CARD ĐỒ HỌA (GPU) - MỚI --- */}
            {showGPUs && gpus && gpus.length > 0 && (
                <div className={`mb-8 ${(showCategories || showBrands || showChips) ? 'border-t border-dashed border-gray-200 pt-6' : ''}`}>
                    <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide mb-4 border-l-4 border-[#2f9ea0] pl-2">
                        Card đồ họa
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {gpus.map((gpu, index) => (
                            <button 
                                key={index}
                                onClick={() => handleGPUClick(gpu)}
                                className={`
                                    text-xs px-3 py-1.5 rounded-md border transition-all duration-200 font-medium cursor-pointer
                                    ${selectedGPU === gpu
                                        ? "bg-[#2f9ea0] border-[#2f9ea0] text-white shadow-md transform scale-105"
                                        : "bg-white border-gray-200 text-gray-600 hover:border-[#2f9ea0] hover:text-[#2f9ea0]"
                                    }
                                `}
                            >
                                {gpu}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* --- PHẦN 5: MÀN HÌNH --- */}
            {showScreens && screens && screens.length > 0 && (
                <div className={`mb-8 ${(showCategories || showBrands || showChips || showGPUs) ? 'border-t border-dashed border-gray-200 pt-6' : ''}`}>
                    <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide mb-4 border-l-4 border-[#2f9ea0] pl-2">
                        Màn hình
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {screens.map((screen, index) => (
                            <button 
                                key={index}
                                onClick={() => handleScreenClick(screen)}
                                className={`
                                    text-xs px-3 py-1.5 rounded-md border transition-all duration-200 font-medium cursor-pointer
                                    ${selectedScreen === screen
                                        ? "bg-[#2f9ea0] border-[#2f9ea0] text-white shadow-md transform scale-105"
                                        : "bg-white border-gray-200 text-gray-600 hover:border-[#2f9ea0] hover:text-[#2f9ea0]"
                                    }
                                `}
                            >
                                {screen}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* --- PHẦN 6: KHOẢNG GIÁ --- */}
            {showPrice && (
                <div className={`${(showCategories || showBrands || showChips || showScreens || showGPUs) ? 'border-t border-dashed border-gray-200 pt-6' : ''}`}>
                    <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide mb-4 border-l-4 border-[#2f9ea0] pl-2">
                        Khoảng giá
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-3">
                        <div className="relative w-full">
                            <input 
                                type="number" 
                                placeholder="0" 
                                value={priceRange.min} 
                                onChange={(e) => setPriceRange({...priceRange, min: e.target.value})} 
                                className="w-full pl-3 pr-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#2f9ea0] focus:ring-1 focus:ring-[#2f9ea0] transition-colors" 
                            />
                            <span className="absolute right-2 top-2 text-xs text-gray-400">₫</span>
                        </div>
                        <span className="text-gray-400 font-light">-</span>
                        <div className="relative w-full">
                            <input 
                                type="number" 
                                placeholder="Max" 
                                value={priceRange.max} 
                                onChange={(e) => setPriceRange({...priceRange, max: e.target.value})} 
                                className="w-full pl-3 pr-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#2f9ea0] focus:ring-1 focus:ring-[#2f9ea0] transition-colors" 
                            />
                            <span className="absolute right-2 top-2 text-xs text-gray-400">₫</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleApplyPrice} 
                        className="w-full bg-[#2f9ea0] text-white text-sm py-2.5 rounded-md font-medium hover:bg-[#258b8d] active:scale-95 transition-all duration-200 shadow-sm hover:shadow cursor-pointer"
                    >
                        Áp dụng bộ lọc
                    </button>
                </div>
            )}
        </div>
    );
}