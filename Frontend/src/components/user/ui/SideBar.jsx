import React from "react";
import { NavLink } from "react-router-dom";
import { FaUser, FaHistory, FaKey } from "react-icons/fa";

const SideBar = () => {
    const menuItems = [
        { path: "/thong-tin-ca-nhan", name: "Thông tin cá nhân", icon: <FaUser /> },
        { path: "/doi-mat-khau", name: "Đổi mật khẩu", icon: <FaKey /> },
        { path: "/lich-su-mua-hang", name: "Lịch sử mua hàng", icon: <FaHistory /> },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 shrink-0 hidden md:block sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto">

            <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="font-bold text-gray-800 uppercase text-sm tracking-wider">
                    Tài khoản
                </h3>
            </div>

            <div className="flex flex-col py-4">
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-6 py-4 transition-colors duration-200 border-l-4 ${
                                isActive
                                    ? "bg-gray-50 border-[#2f9ea0] text-[#2f9ea0] font-semibold"
                                    : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-[#2f9ea0]"
                            }`
                        }
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-sm font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </div>
        </aside>
    );
};

export default SideBar;