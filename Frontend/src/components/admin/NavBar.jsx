import { useState } from 'react';
import NavNoti from './ui/NavNoti';
import NavUser from './ui/NavUser';

const NavBar = () => {
  const [activeMenu, setActiveMenu] = useState(null);

  // Helper để đóng tất cả
  const closeAll = () => setActiveMenu(null);

  // Helper xử lý toggle (mở cái này thì đóng cái kia)
  const toggleMenu = (menuName) => {
    if (activeMenu === menuName) {
      setActiveMenu(null); // Đang mở thì đóng lại
    } else {
      setActiveMenu(menuName); // Mở menu mới (tự động thay thế menu cũ)
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between px-6 shadow-md border-b border-blue-800">
      <div className="flex items-center space-x-4 w-64">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-wide">Computer-Store</span>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        
        <NavNoti 
          isOpen={activeMenu === 'noti'} 
          onToggle={() => toggleMenu('noti')}
          onClose={closeAll}
        />

        <NavUser 
          isOpen={activeMenu === 'user'} 
          onToggle={() => toggleMenu('user')}
          onClose={closeAll}
        />

      </div>
    </div>
  );
};

export default NavBar;