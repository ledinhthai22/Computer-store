import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bell, User2, LogOut, User } from 'lucide-react';
const NavBar = () => {
  // 1. Quản lý trạng thái đóng/mở
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Ref để xác định vị trí click (dùng để đóng menu khi click ra ngoài)
  const notiRef = useRef(null);
  const userRef = useRef(null);

  // 2. Logic đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Nếu menu đang mở VÀ click không nằm trong menu đó -> Đóng lại
      if (notiRef.current && !notiRef.current.contains(event.target)) {
        setIsNotiOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Dữ liệu giả lập cho thông báo
  const notifications = [
    { id: 1, text: "Liên hệ mới từ khách hàng", unread: true },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between px-6 shadow-md border-b border-blue-800">
      
      <div className="flex items-center space-x-4 w-64">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-wide">Computer-Store</span>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        
        {/* --- NOTIFICATION BELL --- */}
        {/* Dùng ref để bọc vùng này lại */}
        <div className="relative" ref={notiRef}>
          <button 
            onClick={() => {
              setIsNotiOpen(!isNotiOpen);
              setIsUserMenuOpen(false); // Đóng menu user nếu đang mở
            }}
            className={`text-blue-200 hover:text-white transition-colors relative p-1 rounded-full ${isNotiOpen ? 'bg-blue-800/50 text-white' : ''}`}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-indigo-900"></span>
          </button>

          {/* Dropdown Thông báo */}
          {isNotiOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
              <div className="py-2 px-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-700">Thông báo</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((item) => (
                  <div key={item.id} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 ${item.unread ? 'bg-blue-50/30' : ''}`}>
                    <p className={`text-sm ${item.unread ? 'font-medium text-gray-800' : 'text-gray-600'}`}>{item.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                  </div>
                ))}
              </div>
              <div className="py-2 text-center border-t border-gray-100 bg-gray-50 cursor-pointer hover:bg-gray-100">
                <span className="text-xs font-medium text-blue-600">Xem tất cả</span>
              </div>
            </div>
          )}
        </div>

        {/* --- USER PROFILE --- */}
        <div className="relative" ref={userRef}>
          <div 
            onClick={() => {
              setIsUserMenuOpen(!isUserMenuOpen);
              setIsNotiOpen(false);
            }}
            className="flex items-center space-x-3 cursor-pointer pl-4 border-l border-blue-800 select-none"
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-blue-300">Manager</p>
            </div>
            <div className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all ${isUserMenuOpen ? 'border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'border-cyan-500/50 hover:border-cyan-400'}`}>
              <User2 className="w-full h-full object-cover bg-slate-700 p-1" />
            </div>
          </div>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
              <ul className="py-1">
                <li>
                  <Link to="/" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <User className="w-4 h-4 mr-2" />
                    Hồ sơ cá nhân
                  </Link>
                </li>
                <li className="border-t border-gray-100 my-1"></li>
                <li>
                  <button
                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Đăng xuất
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default NavBar;