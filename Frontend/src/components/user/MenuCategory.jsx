import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function MenuCategory({ onClose }) {
  const [brands, setBrand] = useState([]);
  const [categories, setCategory] = useState([]);

  useEffect(() => {
    fetch("https://localhost:7012/api/Brand/")
      .then(res => res.json())
      .then(data => setBrand(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetch("https://localhost:7012/api/Category/")
      .then(res => res.json())
      .then(data => setCategory(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="absolute top-full left-0 mt-2 z-[1000] inline-flex bg-white text-black rounded-md shadow-lg p-6" onMouseLeave={onClose}>
      <div className="pr-8 border-r">
        <h4 className="font-semibold mb-3 text-[#2f9ea0] whitespace-nowrap">Laptop theo chức năng</h4>
        <ul className="space-y-1 text-sm whitespace-nowrap">
          {categories.map(c => (
            <li key={c.maDanhMuc}>
              <Link to={`/products/category/${c.maDanhMuc}`} className="hover:text-blue-600 transition">
                {c.tenDanhMuc}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="pl-8">
        <h4 className="font-semibold mb-3 text-[#2f9ea0] whitespace-nowrap">Laptop theo hãng</h4>
        <ul className="space-y-1 text-sm whitespace-nowrap">
          {brands.map(b => (
            <li key={b.brandID}>
              <Link to={`/products/brand/${b.brandID}`} className="hover:text-blue-600 transition">
                {b.brandName}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
