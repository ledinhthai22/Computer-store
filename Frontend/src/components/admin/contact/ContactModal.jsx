import { X } from "lucide-react";

const ContactDetailModal = ({ isOpen, onClose, contact }) => {
  if (!isOpen || !contact) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            Chi tiết liên hệ
          </h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            
            <div className="flex items-start gap-3">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Email liên hệ</p>
                <p className="text-gray-800 font-medium">{contact.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t pt-4">
              <div className="w-full">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Nội dung tin nhắn</p>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 leading-relaxed max-h-48 overflow-y-auto">
                  {contact.noiDung}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetailModal;