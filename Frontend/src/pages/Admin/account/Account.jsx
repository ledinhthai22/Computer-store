import {useState, useEffect, useCallback} from 'react';
import AccountTable from '../../../components/admin/account/AccountTable';
import Toast from '../../../components/admin/Toast';
import ConfirmModal from '../../../components/admin/DeleteConfirmModal';
import { userService, handleApiError } from '../../../services/api/userService';

const Contact = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filterType, setFilterType] = useState('all');

    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    }

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            let res = [];
            if (filterType === 'lock') {
                res = await userService.getAllLock();
            } else if (filterType === 'read') {
                res = await userService.getAllUnlock();
            } else {
                res = await userService.getAll();
            }
            const data = Array.isArray(res) ? res : [];
            setUsers(data);
        } catch (err) {
            const errorMessage = handleApiError(err, "Tải danh sách người dùng thất bại");
            showToast(errorMessage, "error");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, [filterType]);

    useEffect(() => {fetchUsers();}, [fetchUsers]);

    // MODAL XÓA
    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setIsConfirmOpen(true);
    };
    const handleConfirmDelete = async () => {
        try {
            setIsDeleting(true);
            await userService.delete(deleteId);
            showToast("Xóa người dùng thành công", "success");
            await fetchUsers();
        } catch (err) {
            const errorMessage = handleApiError(err, "Xóa người dùng thất bại");
            showToast(errorMessage, "error");
        } finally {
            setIsDeleting(false);
            setIsConfirmOpen(false);
            setDeleteId(null);
        }
    };

    return (
        <>
            <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <AccountTable 
                    data={users} 
                    loading={loading}
                    onDelete={handleDeleteClick}
                    filterType={filterType}
                    onFilterTypeChange={setFilterType}
                />
            </div>
            
            {/* Hiển thị Toast */}
            {toast.show && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast({ ...toast, show: false })} 
                />
            )}
            <ConfirmModal 
                isOpen={isConfirmOpen}
                message="Bạn có muốn xóa người dùng này không?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsConfirmOpen(false)}
                isLoading={isDeleting}
            />
        </div>
        </>
    )
}

export default Contact;