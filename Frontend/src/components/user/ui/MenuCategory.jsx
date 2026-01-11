import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { brandService, handleApiError } from "../../../services/api/brandService";
import { categoryService } from "../../../services/api/categoryService";
export default function MenuCategory({ onClose }) {
  const [brands, setBrand] = useState([]);
  const [categories, setCategory] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try{
        const data = await brandService.getAll();
        setBrand(data);
      } catch(error){
        handleApiError(error, "Lỗi khi tải thương hiệu");
        setBrand([]);
      }
    };
    fetchBrands();
  }, []);
  

  useEffect(() => {
    const fetchCategories = async () => {
      try{
        const data = await categoryService.getAll();
        setCategory(data);
      } catch(error){
        handleApiError(error, "Lỗi khi tải thương hiệu");
        setCategory([]);
      }
    };
    fetchCategories();
  }, []);
  

  return (
    <div className="absolute top-full left-0 z-1000 inline-flex bg-white text-black rounded-md shadow-lg p-6" onMouseLeave={onClose}>
      <div className="">
        <h4 className="font-semibold mb-3 text-[#2f9ea0] whitespace-nowrap">Nhu cầu sử dụng</h4>
        <ul className="space-y-3 text-sm whitespace-nowrap">
          {categories.map(c => (
            <li key={c.maDanhMuc}>
              <Link to={`/san-pham/danh-muc/${c.maDanhMuc}`} className="hover:text-blue-600 transition">
                {c.tenDanhMuc}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="pl-8">
        <h4 className="font-semibold mb-3 text-[#2f9ea0] whitespace-nowrap">Thương hiệu</h4>
        <ul className="space-y-3 text-sm whitespace-nowrap">
          {brands.map(b => (
            <li key={b.maThuongHieu}>
              <Link to={`/san-pham/thuong-hieu/${b.maThuongHieu}`} className="hover:text-blue-600 transition">
                {b.tenThuongHieu}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="pl-8">
        <h4 className="font-semibold mb-3 text-[#2f9ea0] whitespace-nowrap">Dòng chip</h4>
        <ul className="space-y-3 text-sm whitespace-nowrap">
            <li>
              <Link to={`/`} className="hover:text-blue-600 transition">
                Laptop Core i3
              </Link>
            </li>
            <li>
              <Link to={`/`} className="hover:text-blue-600 transition">
                Laptop Core i5
              </Link>
            </li>
            <li>
              <Link to={`/`} className="hover:text-blue-600 transition">
                Laptop Core i7
              </Link>
            </li>
            <li>
              <Link to={`/`} className="hover:text-blue-600 transition">
                Laptop Core i9
              </Link>
            </li>
        </ul>
      </div>

      <div className="pl-8">
        <h4 className="font-semibold mb-3 text-[#2f9ea0] whitespace-nowrap">Màn hình</h4>
        <ul className="space-y-3 text-sm whitespace-nowrap">
            <li>
              <Link to={`/`} className="hover:text-blue-600 transition">
                Laptop 13 inch
              </Link>
            </li>
            <li>
              <Link to={`/`} className="hover:text-blue-600 transition">
                Laptop 14 inch
              </Link>
            </li>
            <li>
              <Link to={`/`} className="hover:text-blue-600 transition">
                Laptop 15.6 inch
              </Link>
            </li>
            <li>
              <Link to={`/`} className="hover:text-blue-600 transition">
                Laptop 16 inch
              </Link>
            </li>
        </ul>
      </div>
      
      <div className="pl-8">
        <h4 className="font-semibold mb-3 text-[#2f9ea0] whitespace-nowrap">Phân khúc giá</h4>
        <ul className="space-y-3 text-sm whitespace-nowrap">
            <li>
              <Link to={`/`} className="hover:text-blue-600 transition">
                Dưới 10 triệu
              </Link>
            </li>
            <li>
              <Link to={`/`} className="hover:text-blue-600 transition">
                Từ 10 - 15 triệu
              </Link>
            </li>
            <li>
              <Link to={`/`} className="hover:text-blue-600 transition">
                Từ 15 - 20 triệu
              </Link>
            </li>
            <li>
              <Link to={`/`} className="hover:text-blue-600 transition">
                Từ 20 - 25 triệu
              </Link>
            </li>
            <li>
              <Link to={`/`} className="hover:text-blue-600 transition">
                Hơn 25 triệu
              </Link>
            </li>
        </ul>
      </div>

      
    </div>
  );
}
