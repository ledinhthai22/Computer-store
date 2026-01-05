import { Link } from "react-router-dom";
import { IoMenu,IoSearch } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import MenuCategory from "./MenuCategory";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import UserDropdown from "./UserDropdown";
export default function NavBar(){
    const {user,logout} = useAuth();
    const [openDanhMuc, setOpenDanhMuc] = useState(false);

    return(
        <nav className="bg-[#2f9ea0] text-white sticky top-0 z-[999]">
            <div className="flex max-w-[80%] mx-auto">
                <Link title="Trang chủ" to={`/`}> <img className="size-20 w-30" src="https://static.vecteezy.com/system/resources/previews/029/754/224/non_2x/logo-suitable-for-management-consulting-auditing-and-tax-free-png.png" alt="logo"/></Link>
                <ul className="flex m-2">
                    <Link className=" p-3 mt-3 hover:bg-[#ffffff50]" title="Danh sách sản phẩm" to={`/products`}><li>Sản phẩm</li></Link>
                    <Link className="ml-5 p-3 mt-3 hover:bg-[#ffffff50]" title=" Trang Liên hệ" to={`/contact`}><li>Liên hệ</li></Link>
                    <Link className="ml-5 p-3 mt-3 hover:bg-[#ffffff50]" title="Trang giới thiệu" to={`/about`}><li>Về chúng tôi</li></Link>
                    <li title="Danh mục" className="ml-5 mt-1 p-2 flex relative" onMouseEnter={() => setOpenDanhMuc(true)} onMouseLeave={() => setOpenDanhMuc(false)}>
                            <span className="flex items-center">
                            Danh mục <IoMenu className="ml-2 mt-1 size-2xl" />
                            </span>
                            {openDanhMuc && <MenuCategory onClose={() => setOpenDanhMuc(false)} />}
                    </li>
                </ul>
                <div className="mt-6 mb-5 bg-white text-black rounded-full flex">
                    <input className="h-10 w-100 rounded-full" title="Tìm kiếm" type="text" placeholder="  Nhập thông tin cần tìm" />
                    <button title="Tìm kiếm" className="text-black hover:bg-stone-500 rounded-r-2xl justify-center h-full w-7 text-center"><IoSearch className="size-2xl mr-1"/></button>
                </div>  
                <div className="ml-auto p-2 flex mt-3">
                    <Link className="p-3 mt-1 hover:bg-[#ffffff50]" title="Giỏ hàng" to={`/cart`}><FaShoppingCart className="size-5"/></Link>

                    {user?(
                        <>
                            <UserDropdown />
                        </>
                    ):(
                        <Link className="p-3 flex hover:bg-[#ffffff50]" title="Đăng nhập" to={`/login`}><FaUser className="mt-1 mr-1"/>Đăng nhập</Link>
                    )
                }
                </div>
            </div>
        </nav>
    )
}