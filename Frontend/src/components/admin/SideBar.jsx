import { LayoutDashboard, ShoppingBag, Layers, User, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { name: 'Thống kê', icon: LayoutDashboard, path: '#' },
    { name: 'Sản phẩm', icon: ShoppingBag, path: '/quan-ly/san-pham' },
    { name: 'Danh mục', icon: Layers, path: '/quan-ly/danh-muc' },
    { name: 'Người dùng', icon: User, path: '/quan-ly/nguoi-dung' },

  ];

  return (
    <div className="h-full flex flex-col justify-between py-6 px-4 bg-white border-r border-gray-100">
      <div className="space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon
                size={20}
                className={`${
                  isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                }`}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="space-y-2 pt-4 border-t border-gray-100">
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200">
             <LogOut size={20} />
             <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;