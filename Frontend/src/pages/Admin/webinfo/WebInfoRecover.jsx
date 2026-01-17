import { WebInfoService } from "../../../services/api/webInfoService";
import { useEffect, useState } from "react";
import WebInfoRecoverTable from '../../../components/admin/webinfo/WebInfoRecoverTable';
import WebInfoViewModal from '../../../components/admin/webinfo/WebInfoViewModal';
import Toast from '../../../components/admin/Toast';
import ConfirmModal from '../../../components/admin/RecoverConfirmModal';

const WebInfoRecover = () => {
    const [webinfo, setWebinfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [recoverId, setRecoverId] = useState(null);
    const [isRecovering, setIsRecovering] = useState(false);

    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedWebInfo, setSelectedWebInfo] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    const fetchWebInfoRecover = async () => {
        try {
            setLoading(true);
            const res = await WebInfoService.getDeleted();
            const data = Array.isArray(res) ? res : [];
            setWebinfo(data);
        } catch (error) {
            console.error("Lỗi khi fetch:", error);
            showToast("Tải danh sách thông tin trang đã xóa thất bại", "error");
            setWebinfo([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        fetchWebInfoRecover(); 
    }, []);

    const handleView = (item) => {
        setSelectedWebInfo(item);
        setIsViewModalOpen(true);
    };

    const handleRecoverClick = (id) => {
        setRecoverId(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmRecover = async () => {
        if (!recoverId) return;

        try {
            setIsRecovering(true);
            await WebInfoService.recover(recoverId);
            showToast("Khôi phục thông tin trang thành công!", "success");
            await fetchWebInfoRecover();
        } catch (err) {
            console.error("Lỗi khôi phục:", err);
            showToast(
                err.response?.data?.message || "Khôi phục thông tin trang thất bại", 
                "error"
            );
        } finally {
            setIsRecovering(false);
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
                    onRecover={handleRecoverClick}
                    onView={handleView}
                />
            </div>
            <WebInfoViewModal 
                isOpen={isViewModalOpen} 
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedWebInfo(null);
                }} 
                data={selectedWebInfo} 
            />

            {/* Toast Notification */}
            {toast.show && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast({ ...toast, show: false })} 
                />
            )}

            {/* Confirm Modal */}
            <ConfirmModal 
                isOpen={isConfirmOpen}
                message="Bạn có chắc chắn muốn khôi phục thông tin trang này?"
                onConfirm={handleConfirmRecover}
                onCancel={() => {
                    setIsConfirmOpen(false);
                    setRecoverId(null);
                }}
                isLoading={isRecovering}
            />
        </div>
    );
};

export default WebInfoRecover;