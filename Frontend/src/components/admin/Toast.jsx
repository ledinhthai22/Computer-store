import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 1500);
        return () => clearTimeout(timer);
    }, [onClose]);

    const styles = {
        success: "bg-green-50 border-green-200 text-green-800",
        error: "bg-red-50 border-red-200 text-red-800",
        info: "bg-blue-50 border-blue-200 text-blue-800"
    };

    const icons = {
        success: <CheckCircle className="text-green-500" size={20} />,
        error: <XCircle className="text-red-500" size={20} />,
        info: <Info className="text-blue-500" size={20} />
    };

    return (
        <div className={`fixed top-5 right-5 z-[2000] flex items-center gap-3 p-4 rounded-lg border shadow-lg transition-all animate-in fade-in slide-in-from-right-4 ${styles[type]}`}>
            {icons[type]}
            <p className="text-sm font-medium">{message}</p>
            <button 
                onClick={onClose}
                className="ml-auto p-1 hover:bg-black/5 rounded-full transition-colors"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;