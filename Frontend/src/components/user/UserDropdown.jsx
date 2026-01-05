import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";
import { FaUser } from "react-icons/fa6";
export default function UserDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="relative text-black" ref={dropdownRef}>
      <button onClick={() => setOpen(!open)} className="p-5 w-20 flex items-center justify-center h-10 mt-1.5 text-white hover:bg-[#ffffff50]">
       <span className="ml-2 flex" title="Người dùng"> <FaUser className="mt-1 ml-1 mr-1" /> {user.firstName}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white border rounded-xl shadow-lg z-50">
          <Link to="/profile" className="block px-4 py-2 hover:text-blue-500">Chỉnh sửa trang cá nhân</Link>
          <Link to="/orders" className="block px-4 py-2 hover:text-blue-500">Quản lý đơn hàng</Link>
          <Link to="/wishlist" className="block px-4 py-2 hover:text-blue-500">Sản phẩm yêu thích</Link>
          <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:text-blue-500 text-red-600">
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
