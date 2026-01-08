import axios from "axios";
import { useEffect, useState } from "react";
import WebInfoRecoverTable from '../../../components/admin/webinfo/WebInfoRecoverTable';
import Toast from '../../../components/admin/Toast';
import ConfirmModal from '../../../components/admin/RecoverConfirmModal';
import WebInfoModal from '../../../components/admin/webinfo/WebInfoModal';

const WebInfoRecover = () => {
    const [webinfo, setWebinfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [recoverId, setRecoverId] = useState(null);
    const [isRecover, setIsRecover] = useState(false);

    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedWebInfo, setSelectedWebInfo] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    const fetchWebInfoRecover = async () => {
        try {
            setLoading(true);
            const res = await axios.get('https://localhost:7012/api/Webinfo/deleted');
            const data = Array.isArray(res.data) ? res.data : [];
            setWebinfo(data);
        } catch (error) {
            console.error("Lỗi khi fetch:", error);
            showToast("Tải danh sách thông tin trang thất bại", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchWebInfoRecover(); }, []);

    const handleView = (item) => {
        setSelectedWebInfo(item);
        setIsViewModalOpen(true);
    };

    const handleRecover = (id) => {
        setRecoverId(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmRecover = async () => {
        try {
            setIsRecover(true);
            await axios.put(`https://localhost:7012/api/WebInfo/recover/${recoverId}`);
            showToast("Khôi phục thông tin trang thành công", "success");
            await fetchWebInfoRecover();
        } catch (err) {
            console.error(err)
            showToast("Khôi phục thông tin trang thất bại", "error");
        } finally {
            setIsRecover(false);
            setIsConfirmOpen(false);
            setRecoverId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <WebInfoRecoverTable
                    data={webinfo} 
                    loading={loading}
                    onRecover={handleRecover}
                    onView={handleView}
                />
            </div>
            
            <WebInfoModal 
                isOpen={isViewModalOpen} 
                onClose={() => setIsViewModalOpen(false)} 
                data={selectedWebInfo} 
            />

            {toast.show && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast({ ...toast, show: false })} 
                />
            )}
            <ConfirmModal 
                isOpen={isConfirmOpen}
                message="Bạn có muốn khôi phục thông tin trang này không?"
                onConfirm={handleConfirmRecover}
                onCancel={() => setIsConfirmOpen(false)}
                isLoading={isRecover}
            />
        </div>
    );
}

export default WebInfoRecover;