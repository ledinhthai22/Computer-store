// CategoryRecover.js
import { useEffect, useState } from "react";
import UserRecoverTable from '../../../components/admin/user/UserRecoverTable';
import Toast from '../../../components/admin/Toast';
import ConfirmModal from '../../../components/admin/RecoverConfirmModal';
import { userService, handleApiError } from '../../../services/api/userService';

const UserRecover = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [recoverId, setRecoverId] = useState(null);
    const [isRecovering, setIsRecovering] = useState(false);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    const fetchUser = async () => {
        try {
            setLoading(true);
            const data = await userService.getAllDeleted();
            const formattedData = Array.isArray(data) ? data : [];
            setUsers(formattedData);
        } catch (err) {
            const errorMessage = handleApiError(err, "Tải danh sách người dùng đã xóa thất bại");
            showToast(errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        fetchUser(); 
    }, []);

    // MODAL Recover
    const handleRecoverClick = (id) => {
        setRecoverId(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmRecover = async () => {
        try {
            setIsRecovering(true);
            await userService.recover(recoverId);
            showToast("Khôi phục người dùng thành công", "success");
            await fetchUser();
        } catch (err) {
            const errorMessage = handleApiError(err, "Khôi phục người dùng thất bại");
            showToast(errorMessage, "error");
        } finally {
            setIsRecovering(false);
            setIsConfirmOpen(false);
            setRecoverId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <UserRecoverTable 
                    data={users} 
                    loading={loading}
                    onRecover={handleRecoverClick}
                />
            </div>
            
            {/* Toast */}
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
                message="Bạn có muốn khôi phục người dùng này không?"
                onConfirm={handleConfirmRecover}
                onCancel={() => setIsConfirmOpen(false)}
                isLoading={isRecovering}
            />
        </div>
    );
}

export default UserRecover;