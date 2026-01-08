import { Link } from 'react-router-dom';
import { User2, LogOut, User } from 'lucide-react';
import { useClickOutside } from '../../../hooks/useClickOutside';

const NavUserMenu = ({ isOpen, onToggle, onClose }) => {
  const wrapperRef = useClickOutside(() => {
    if (isOpen) onClose();
  });

  return (
    <div className="relative" ref={wrapperRef}>
      <div 
        onClick={onToggle}
        className="flex items-center space-x-3 cursor-pointer pl-4 border-l border-blue-800 select-none"
      >
        <div className="text-right hidden md:block">
          <p className="text-sm font-medium text-white">Admin User</p>
          <p className="text-xs text-blue-600">Manager</p>
        </div>
        <div className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all ${isOpen ? 'border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'border-cyan-500/50 hover:border-cyan-400'}`}>
          <User2 className="w-full h-full object-cover bg-slate-700 p-1" />
        </div>
      </div>

      {isOpen && (
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
              <button className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="w-4 h-4 mr-2" />
                Đăng xuất
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default NavUserMenu;