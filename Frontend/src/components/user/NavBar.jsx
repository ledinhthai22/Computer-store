import { Link } from "react-router-dom";
import { IoMenu, IoSearch } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import MenuCategory from "./MenuCategory";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import UserDropdown from "./UserDropdown";

export default function NavBar() {
    const { user, logout } = useAuth();
    const [openDanhMuc, setOpenDanhMuc] = useState(false);

    return (
        <nav className="bg-[#2f9ea0] text-white sticky top-0 z-[999] shadow-sm">
            <div className="flex items-center justify-between max-w-[80%] mx-auto py-2">
                <div title="Trang chủ" className="flex items-center space-x-4 w-64">
                    <div className="flex items-center space-x-2">
                    <Link to={'/'} className="p-3 hover:bg-[#ffffff50] text-xl font-bold tracking-wide">Computer-Store</Link>
                    </div>
                </div>
                <ul className="flex items-center">
                    <Link className="p-3 hover:bg-[#ffffff50] rounded transition-colors" title="Danh sách sản phẩm" to={`/products`}>
                        <li>Sản phẩm</li>
                    </Link>
                    <li title="Danh mục" className="ml-2 p-3 flex relative hover:bg-[#ffffff50] rounded transition-colors cursor-pointer" onMouseEnter={() => setOpenDanhMuc(true)} onMouseLeave={() => setOpenDanhMuc(false)}>
                        <span className="flex items-center">
                            Danh mục <IoMenu className="ml-2 text-xl" />
                        </span>
                        {openDanhMuc && <MenuCategory onClose={() => setOpenDanhMuc(false)} />}
                    </li>
                </ul>

                <div className="bg-white text-black rounded-2xl flex items-center h-10 px-2 w-100">
                    <input className="flex-grow bg-transparent outline-none px-2 py-1" title="Tìm kiếm" type="text" placeholder="Nhập thông tin cần tìm" />
                    <button title="Tìm kiếm" className="text-black hover:bg-stone-200 rounded-full p-2 flex items-center justify-center">
                        <IoSearch className="text-xl" />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <Link className="p-3 hover:bg-[#ffffff50] rounded transition-colors flex items-center justify-center" title="Giỏ hàng" to={`/cart`}>
                        Giỏ hàng <FaShoppingCart className="text-xl ml-2" />
                    </Link>

                    {user ? (
                        <UserDropdown />
                    ) : (
                        <Link className="p-3 flex items-center hover:bg-[#ffffff50] rounded transition-colors" title="Đăng nhập" to={`/login`}>
                            <FaUser className="mr-2" /> Đăng nhập
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}