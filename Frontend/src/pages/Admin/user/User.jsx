import { useState, useEffect, useCallback } from 'react';
import UserTable from '../../../components/admin/user/UserTable';
import Toast from '../../../components/admin/Toast';
import ConfirmModal from '../../../components/admin/DeleteConfirmModal';
import { userService, handleApiError } from '../../../services/api/userService';

const User = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('all');
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            let data;
            if (filterType === 'lock') {
                data = await userService.getAllLock();
            } else if (filterType === 'active') {
                data = await userService.getAllUnlock();
            } else {
                data = await userService.getAll();
            }
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            showToast(handleApiError(err, "Tải danh sách thất bại"), "error");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, [filterType]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const handleLock = async (id) => {
        try {
            await userService.lock(id);
            showToast("Đã khóa tài khoản");
            fetchUsers();
        } catch (err) { showToast(handleApiError(err), "error"); }
    };

    const handleUnlock = async (id) => {
        try {
            await userService.unlock(id);
            showToast("Đã mở khóa tài khoản");
            fetchUsers();
        } catch (err) { showToast(handleApiError(err), "error"); }
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            setIsDeleting(true);
            await userService.delete(deleteId);
            showToast("Xóa người dùng thành công");
            fetchUsers();
        } catch (err) { showToast(handleApiError(err), "error"); }
        finally {
            setIsDeleting(false);
            setIsConfirmOpen(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
            <UserTable 
                data={users} 
                loading={loading} 
                filterType={filterType}
                onFilterTypeChange={setFilterType}
                onLock={handleLock}
                onUnlock={handleUnlock}
                onDelete={handleDeleteClick}
            />

            {/* Hiển thị Toast */}
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
                message="Bạn có muốn xóa người dùng này không?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsConfirmOpen(false)}
                isLoading={isDeleting}
            />
            </div>
        </div>
    );
};

export default User;