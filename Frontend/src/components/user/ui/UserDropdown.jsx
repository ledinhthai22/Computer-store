import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthProvider";
import { useToast } from "../../../contexts/ToastContext";
import { FaUser } from "react-icons/fa6";

export default function UserDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const { showToast } = useToast();
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
    showToast("Đăng xuất thành công", "success");
  };

  return (
    <div className="relative text-black" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 h-10 flex items-center text-white hover:bg-[#ffffff50] max-w-40 cursor-pointer rounded"
        title={user.hoTen}>
        <FaUser className="mr-1 shrink-0" />
        <span className=" text-sm truncate overflow-hidden whitespace-nowrap">{user.hoTen}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white border rounded-xl shadow-lg z-50">
          <Link to="/thong-tin-ca-nhan" className="block px-4 py-2 hover:text-blue-500">
            Chỉnh sửa trang cá nhân
          </Link>
          <Link to="/quan-ly" className="block px-4 py-2 hover:text-blue-500">
            Trang quản trị
          </Link>
          <Link to="/don-hang" className="block px-4 py-2 hover:text-blue-500">
            Quản lý đơn hàng
          </Link>
          <Link to="/yeu-thich" className="block px-4 py-2 hover:text-blue-500">
            Sản phẩm yêu thích
          </Link>
          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:text-blue-500 cursor-pointer">
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
