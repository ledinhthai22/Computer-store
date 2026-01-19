import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { brandService, handleApiError } from "../../../services/api/brandService";
import { categoryService } from "../../../services/api/categoryService";
import { IoClose } from "react-icons/io5";

export default function MenuCategory({ onClose }) {
  const [brands, setBrand] = useState([]);
  const [categories, setCategory] = useState([]);

  const chipList = ['Core i3', 'Core i5', 'Core i7', 'Core i9', 'Ryzen 5', 'Ryzen 7'];
  const screenList = ['13 inch', '14 inch', '15.6 inch', '16 inch'];

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await brandService.usergetAll();
        setBrand(data);
      } catch (error) {
        handleApiError(error, "Lỗi khi tải thương hiệu");
        setBrand([]);
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.usergetAll();
        setCategory(data);
      } catch (error) {
        handleApiError(error, "Lỗi khi tải danh mục");
        setCategory([]);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      {/* 1. LỚP PHỦ (OVERLAY) */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
        onClick={onClose}
      ></div>

      <div 
        className="mt-0.5 fixed inset-x-4 top-20 z-50 bg-white text-black rounded-lg shadow-2xl p-4 overflow-y-auto max-h-[80vh] 
                   lg:absolute lg:inset-auto lg:top-full lg:left-0 lg:p-6 lg:rounded-md lg:shadow-lg lg:overflow-visible
                   lg:w-max" 
        onMouseLeave={onClose}
      >
        
        {/* Nút Đóng cho Mobile */}
        <div className="flex justify-between items-center mb-4 lg:hidden border-b pb-2">
            <span className="font-bold text-gray-700">Danh mục</span>
            <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-red-100 text-red-500">
                <IoClose size={24} />
            </button>
        </div>

        {/* EDIT 2: Sử dụng Grid 5 cột (lg:grid-cols-5) thay vì Flex để chia đều khoảng cách */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid lg:grid-cols-4 gap-6 lg:gap-8">

            {/* Cột 1: Thương hiệu */}
            <div className="">
                <h4 className="font-bold mb-3 text-[#2f9ea0] uppercase text-xs lg:text-sm">Thương hiệu</h4>
                <ul className="space-y-2 lg:space-y-3 text-sm">
                    {brands.map(b => (
                    <li key={b.maThuongHieu}>
                        <Link to={`/san-pham/thuong-hieu/${b.maThuongHieu}`} onClick={onClose} className="block hover:text-[#2f9ea0] hover:translate-x-1 transition-transform">
                        {b.tenThuongHieu}
                        </Link>
                    </li>
                    ))}
                </ul>
            </div>

            {/* Cột 2: Nhu cầu */}
            <div className="">
                <h4 className="font-bold mb-3 text-[#2f9ea0] uppercase text-xs lg:text-sm">Nhu cầu sử dụng</h4>
                <ul className="space-y-2 lg:space-y-3 text-sm">
                    {categories.map(c => (
                    <li key={c.maDanhMuc}>
                        <Link to={`/san-pham/danh-muc/${c.maDanhMuc}`} onClick={onClose} className="block hover:text-[#2f9ea0] hover:translate-x-1 transition-transform">
                        {c.tenDanhMuc}
                        </Link>
                    </li>
                    ))}
                </ul>
            </div>

            {/* Cột 3: Dòng Chip (ĐÃ CẬP NHẬT LINK) */}
            <div className="">
                <h4 className="font-bold mb-3 text-[#2f9ea0] uppercase text-xs lg:text-sm">Dòng chip</h4>
                <ul className="space-y-2 lg:space-y-3 text-sm">
                    {chipList.map((chip, index) => (
                        <li key={index}>
                            <Link 
                                to={`/san-pham/dong-chip/${encodeURIComponent(chip)}`} 
                                onClick={onClose} 
                                className="block hover:text-[#2f9ea0] hover:translate-x-1 transition-transform"
                            >
                                Laptop {chip}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Cột 4: Màn hình (ĐÃ CẬP NHẬT LINK) */}
             <div className="">
                <h4 className="font-bold mb-3 text-[#2f9ea0] uppercase text-xs lg:text-sm">Màn hình</h4>
                <ul className="space-y-2 lg:space-y-3 text-sm">
                    {screenList.map((size, index) => (
                        <li key={index}>
                            <Link 
                                to={`/san-pham/man-hinh/${encodeURIComponent(size)}`} 
                                onClick={onClose} 
                                className="block hover:text-[#2f9ea0] hover:translate-x-1 transition-transform"
                            >
                                Laptop {size}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
      </div>
    </>
  );
}