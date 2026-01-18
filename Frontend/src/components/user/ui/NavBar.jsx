import { Link } from "react-router-dom";
import { IoMenu, IoSearch } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import MenuCategory from "./MenuCategory";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthProvider";
import { useModalLogin } from "../../../contexts/ModalLoginContext"; // Import Context mới
import UserDropdown from "./UserDropdown";
import LoginModal from "../Auth/LoginModal";
import RegisterModal from "../Auth/RegisterModal";

export default function NavBar() {
    const { user } = useAuth();
    
    const { activeModal, openLogin, openRegister, closeModal } = useModalLogin();
    
    const [openDanhMuc, setOpenDanhMuc] = useState(false);
    
    return (
        <> 
            <nav className="bg-[#2f9ea0] text-white sticky top-0 z-50 shadow-md py-2 md:py-3 transition-all">
                <div className="container mx-auto px-4 max-w-7xl flex flex-wrap items-center justify-between gap-y-3 md:gap-y-0 md:gap-x-8">

                    {/* --- Logo & Danh mục --- */}
                    <div className="flex items-center gap-2 md:gap-4 shrink-0">
                        <Link to="/" className="text-xl md:text-2xl font-bold hover:opacity-90 whitespace-nowrap tracking-tight" title="Trang chủ">
                            Computer-Store
                        </Link>

                        <div
                            className="relative px-2 py-1 md:px-3 md:py-2 flex items-center gap-1 hover:bg-[#ffffff20] rounded-lg cursor-pointer transition-all duration-200"
                            title="Danh mục sản phẩm"
                            onMouseEnter={() => setOpenDanhMuc(true)}
                            onMouseLeave={() => setOpenDanhMuc(false)}
                        >
                            <span className="hidden sm:inline font-medium">Danh mục</span>
                            <IoMenu className="text-2xl" />
                            {openDanhMuc && <MenuCategory onClose={() => setOpenDanhMuc(false)} />}
                        </div>
                        <Link to="/gui-lien-he" className="p-2 hover:bg-[#ffffff20] rounded-lg flex items-center gap-2 transition-all duration-200 group" title="Liên hệ">
                            <span className="lg:inline font-medium">Liên hệ</span>
                        </Link>
                    </div>

                    {/* --- Giỏ hàng & User --- */}
                    <div className="flex items-center gap-3 md:gap-4 md:order-3 shrink-0">
                        <Link to="/gio-hang" className="p-2 hover:bg-[#ffffff20] rounded-lg flex items-center gap-2 transition-all duration-200 group" title="Giỏ hàng">
                            <div className="relative">
                                <FaShoppingCart className="text-xl group-hover:scale-110 transition-transform" />
                            </div>
                            <span className="hidden lg:inline font-medium">Giỏ hàng</span>
                        </Link>

                        {user ? <UserDropdown /> : (
                            <button 
                                onClick={openLogin} // Gọi hàm từ Context
                                className="p-2 hover:bg-[#ffffff20] rounded-lg flex items-center gap-2 transition-all duration-200 font-medium" 
                                title="Đăng nhập"
                            >
                                <FaUser className="text-lg" />
                                <span className="hidden lg:inline">Đăng nhập</span>
                            </button>
                        )}
                    </div>
                    
                    {/* --- Search Bar --- */}
                    <div className="w-full order-last md:order-2 md:w-auto md:flex-1 flex justify-center md:justify-end lg:justify-center">
                        <div className="w-full md:max-w-[600px] bg-white text-black rounded-lg flex items-center h-10 px-0 shadow-sm focus-within:shadow-md focus-within:ring-2 focus-within:ring-[#2f9ea0]/50 transition-all overflow-hidden">
                            <input
                                className="grow bg-transparent outline-none text-sm px-4 py-2 placeholder-gray-400"
                                placeholder="Bạn đang tìm sản phẩm gì..."
                                title="Nhập thông tin cần tìm"
                            />
                            <button className="bg-gray-100 hover:bg-[#2f9ea0] hover:text-white h-full px-4 flex items-center justify-center transition-colors duration-200" title="Tìm kiếm">
                                <IoSearch className="text-xl" />
                            </button>
                        </div>
                    </div>

                </div>
            </nav>

            {activeModal === 'login' && (
                <LoginModal 
                    onClose={closeModal} 
                    onSwitchToRegister={openRegister} 
                />
            )}

            {activeModal === 'register' && (
                <RegisterModal 
                    onClose={closeModal} 
                    onSwitchToLogin={openLogin} 
                />
            )}
        </>
    );
}