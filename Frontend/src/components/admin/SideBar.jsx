import { LayoutDashboard, ShoppingBag, Layers, User, LogOut, Hexagon, Mail, AppWindow, Newspaper, Columns2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthProvider";
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  const menuItems = [
    { name: 'Thống kê', icon: LayoutDashboard, path: '/quan-ly/thong-ke' }, 
    { name: 'Sản phẩm', icon: ShoppingBag, path: '/quan-ly/san-pham' },
    { name: 'Đơn hàng', icon: Newspaper, path: '/quan-ly/don-hang' },
    { name: 'Danh mục', icon: Layers, path: '/quan-ly/danh-muc' },
    { name: 'Thương hiệu', icon: Hexagon, path: '/quan-ly/thuong-hieu' },
    { name: 'Người dùng', icon: User, path: '/quan-ly/nguoi-dung' },
    { name: 'Liên hệ', icon: Mail, path: '/quan-ly/lien-he' },
    { name: 'Trình chiếu', icon: Columns2, path: '/quan-ly/trinh-chieu' },
    //{ name: 'Thông tin trang', icon: AppWindow, path: '/quan-ly/thong-tin-trang' },
  ];

  return (
    <div className="h-full flex flex-col justify-between py-6 px-4 bg-white border-r border-gray-100">
      <div className="space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path !== '/quan-ly/thong-ke' && location.pathname.startsWith(item.path));

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-[#2F9EA0]/10 text-[#2F9EA0] font-semibold shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-[#2F9EA0]'
              }`}
            >
              <item.icon
                size={20}
                className={`${
                  isActive ? 'text-[#2F9EA0]' : 'text-gray-400 group-hover:text-[#2F9EA0]'
                }`}
              />
              <span className="text-sm">{item.name}</span>
              {isActive && (
                <div className="absolute left-0 w-1 h-6 bg-[#2F9EA0] rounded-r-full" />
              )}
            </Link>
          );
        })}
      </div>

      <div className="space-y-2 pt-4 border-t border-gray-100">
        <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group cursor-pointer">
          <LogOut size={20} className="text-gray-400 group-hover:text-red-600" />
          <span className="text-sm font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;