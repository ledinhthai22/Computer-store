import { Bell } from 'lucide-react';
import { useClickOutside } from '../../../hooks/useClickOutside';

const NavNotifications = ({ isOpen, onToggle, onClose }) => {
  // Sử dụng hook để lấy ref và gán hàm onClose khi click ra ngoài
  const wrapperRef = useClickOutside(() => {
    if (isOpen) onClose();
  });

  const notifications = [
    { id: 1, text: "Liên hệ mới từ khách hàng", unread: true },
  ];

  return (
    <div className="relative" ref={wrapperRef}>
      <button 
        onClick={onToggle}
        className={`text-blue-200 hover:text-white transition-colors relative p-1 rounded-full ${isOpen ? 'bg-blue-800/50 text-white' : ''}`}
      >
        <Bell className="w-5 h-5" />
        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-indigo-900"></span>
      </button>

      {isOpen && (
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
  );
};

export default NavNotifications;