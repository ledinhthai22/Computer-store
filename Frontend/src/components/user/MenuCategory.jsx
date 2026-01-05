import { Link } from "react-router-dom";
export default function MenuCategory({ onClose }) {
    return (
      <div
        className="absolute top-full left-0 w-250 bg-white text-black rounded-md shadow-lg mt-1 z-[1000] grid grid-cols-5 p-6"
        onMouseLeave={onClose}>
        <div className="col-span-1 border-r pr-4">
        <h4 className="font-semibold mb-2 text-[#2f9ea0]">Laptop theo chức năng</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to={`/`}>Máy tính xách tay</Link></li>
            <li><Link to={`/`}>Laptop Gaming</Link></li>
            <li><Link to={`/`}>Laptop Văn phòng</Link></li>
            <li><Link to={`/`}>Laptop Lập trình</Link></li>
            <li><Link to={`/`}>Laptop cao cấp</Link></li>
            <li><Link to={`/`}>Apple Macbook</Link></li>
          </ul>
        </div>
        <div className="ml-2">
          <h4 className="font-semibold mb-2 text-[#2f9ea0]">Laptop theo hãng</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to={`/`}>ACER</Link></li>
            <li><Link to={`/`}>Gigabyte</Link></li>
            <li><Link to={`/`}>APPLE</Link></li>
            <li><Link to={`/`}>DELL</Link></li>
            <li><Link to={`/`}>HP</Link></li>
            <li><Link to={`/`}>LENOVO</Link></li>
          </ul>
        </div>
      </div>
    );
  }
  