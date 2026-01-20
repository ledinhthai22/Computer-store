import { Link } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";
import { FaUser, FaPhone } from "react-icons/fa6";
import MenuCategory from "./MenuCategory";
import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthProvider";
import { useModalLogin } from "../../../contexts/ModalLoginContext";
import UserDropdown from "./UserDropdown";
import LoginModal from "../Auth/LoginModal";
import RegisterModal from "../Auth/RegisterModal";
import { WebInfoService } from "../../../services/api/webInfoService";
import SearchBar from "./SearchBar";

export default function NavBar() {
  const { user } = useAuth();
  const { activeModal, openLogin, openRegister, closeModal } = useModalLogin();
  const [openDanhMuc, setOpenDanhMuc] = useState(false);
  const [storeName, setStoreName] = useState("Computer-Store");

  useEffect(() => {
    const fetchWebInfo = async () => {
      try {
        const response = await WebInfoService.userGetAll();
        const data = Array.isArray(response) ? response[0] : response;
        if (data) {
          const name = data.tenTrang || data["Tên cửa hàng"];
          if (name) setStoreName(name);
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin Header:", error);
      }
    };
    fetchWebInfo();
  }, []);

  return (
    <>
      <nav className="bg-[#2f9ea0] text-white sticky top-0 z-50 shadow-md">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="h-16 flex items-center justify-between gap-4">

            <div className="flex items-center gap-3 min-w-fit">
              <Link
                to="/"
                title="Trang chủ"
                className="text-xl font-bold whitespace-nowrap hover:opacity-90"
              >
                {storeName}
              </Link>

              <div
                title="Danh mục sản phẩm"
                className="relative flex items-center gap-1 px-3 py-2 hover:bg-white/20 rounded-lg cursor-pointer"
                onMouseEnter={() => setOpenDanhMuc(true)}
                onMouseLeave={() => setOpenDanhMuc(false)}
              >
                <span className="hidden md:inline font-medium">Danh mục</span>
                <IoMenu className="text-2xl" />
                {openDanhMuc && <MenuCategory onClose={() => setOpenDanhMuc(false)} />}
              </div>

              <Link
                to="/gui-lien-he"
                title="Liên hệ"
                className="hidden lg:flex items-center gap-2 px-3 py-2 hover:bg-white/20 rounded-lg"
              >
                <FaPhone className="text-xl" />
                <span>Liên hệ</span>
              </Link>
            </div>

            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-[600px] bg-white text-black rounded-lg flex items-center h-10 shadow-sm focus-within:shadow-md focus-within:ring-2 focus-within:ring-[#2f9ea0]/50 overflow-hidden">
                {/*  */}
                <SearchBar />
                {/*  */}
              </div>
            </div>

            <div className="flex items-center gap-3 min-w-fit">
              <Link
                to="/gio-hang"
                title="Giỏ hàng"
                className="flex items-center gap-2 px-3 py-2 hover:bg-white/20 rounded-lg"
              >
                <FaShoppingCart className="text-xl" />
                <span className="hidden lg:inline">Giỏ hàng</span>
              </Link>

              {user ? (
                <UserDropdown />
              ) : (
                <button
                  title="Đăng nhập"
                  onClick={openLogin}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-white/20 rounded-lg"
                >
                  <FaUser className="text-lg" />
                  <span className="hidden lg:inline">Đăng nhập</span>
                </button>
              )}
            </div>

          </div>
        </div>
      </nav>

      {activeModal === "login" && (
        <LoginModal onClose={closeModal} onSwitchToRegister={openRegister} />
      )}

      {activeModal === "register" && (
        <RegisterModal onClose={closeModal} onSwitchToLogin={openLogin} />
      )}
    </>
  );
}
