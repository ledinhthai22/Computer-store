import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell } from 'lucide-react';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { Link } from 'react-router-dom';

const NavNotifications = ({ isOpen, onToggle, onClose }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestContacts, setLatestContacts] = useState([]);

  const wrapperRef = useClickOutside(() => {
    if (isOpen) onClose();
  });

  // Fetch số lượng thông báo mới
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`https://dummyjson.com/quotes?limit=5`); // Lấy 5 cái mới nhất
      const data = res.data?.quotes || [];
      setLatestContacts(data);
      setUnreadCount(res.data?.total || 0); // Lấy tổng số lượng từ API
    } catch (error) {
      console.error("Lỗi fetch thông báo:", error);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <button 
        onClick={onToggle}
        className={`text-blue-200 hover:text-white transition-colors relative p-2 rounded-full ${isOpen ? 'bg-blue-800/50 text-white' : ''}`}
      >
        <Bell className="w-5 h-5" />
        {/* Hiển thị số lượng nếu > 0 */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-[10px] font-bold text-white rounded-full border-2 border-indigo-900">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
          <div className="py-2 px-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-700">Thông báo mới</h3>
            <span className="text-[10px] bg-red-100 text-red-600 px-2 py-2 rounded-full font-bold">
              {unreadCount} liên hệ
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {latestContacts.length > 0 ? (
              latestContacts.map((item) => (
                <div key={item.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 bg-blue-50/20">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.author}</p>
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 italic">"{item.quote}"</p>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-400 text-sm">
                Không có thông báo mới
              </div>
            )}
          </div>
          
          <Link to="/quan-ly/lien-he/">
          <div className="py-2 text-center border-t border-gray-100 bg-gray-50 cursor-pointer hover:bg-gray-100">
            <span className="text-xs font-medium text-blue-600">Xem tất cả liên hệ</span>
          </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default NavNotifications;