/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { IoMenu, IoSearch } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import MenuCategory from "./MenuCategory";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthProvider";
import UserDropdown from "./UserDropdown";

export default function NavBar() {
    const { user, logout } = useAuth();
    const [openDanhMuc, setOpenDanhMuc] = useState(false);

    return (
        <nav className="relative  bg-[#2f9ea0] text-white sticky top-0 z-50 shadow-sm">
            <div className="flex items-center max-w-[90%] mx-auto py-2">

                {/* LEFT */}
                <div className="flex items-center gap-2">
                <Link to="/" className="px-3 py-2 text-xl font-bold hover:bg-[#ffffff30] rounded" title="Trang chủ">
                    Computer-Store
                </Link>

                <div
                    className="relative px-3 py-2 flex items-center gap-1 hover:bg-[#ffffff30] rounded cursor-pointer"
                    title="Danh mục sản phẩm"
                    onMouseEnter={() => setOpenDanhMuc(true)}
                    onMouseLeave={() => setOpenDanhMuc(false)}
                >
                    Danh mục <IoMenu className="text-xl" />
                    {openDanhMuc && <MenuCategory onClose={() => setOpenDanhMuc(false)} />}
                </div>
                </div>

                {/* SEARCH */}
                <div className="flex-1 mx-6 bg-white text-black rounded-full flex items-center h-11 px-4 max-w-[700px]">
                <input
                    className="grow bg-transparent outline-none text-sm"
                    placeholder="Nhập thông tin cần tìm"
                    title="Nhập thông tin cần tìm"
                />
                <button className="hover:bg-gray-200 rounded-full p-2 cursor-pointer" title="Tìm kiếm">
                    <IoSearch className="text-xl" />
                </button>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-2">
                <Link to="/cart" className="px-3 py-2 hover:bg-[#ffffff30] rounded flex items-center" title="Giỏ hàng">
                    Giỏ hàng <FaShoppingCart className="ml-2" />
                </Link>

                {user ? <UserDropdown /> : (
                    <Link to="/login" className="px-3 py-2 hover:bg-[#ffffff30] rounded flex items-center" title="Đăng nhập">
                    <FaUser className="mr-2" /> Đăng nhập
                    </Link>
                )}
                </div>

            </div>
        </nav>

    );
}