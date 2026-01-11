// CategoryRecover.js
import { useEffect, useState } from "react";
import CategoryRecoverTable from '../../../components/admin/category/CategoryRecoverTable';
import Toast from '../../../components/admin/Toast';
import ConfirmModal from '../../../components/admin/RecoverConfirmModal';
import { categoryService, handleApiError } from '../../../services/api/categoryService';

const CategoryRecover = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [recoverId, setRecoverId] = useState(null);
    const [isRecovering, setIsRecovering] = useState(false);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    const fetchCategoriesRecover = async () => {
        try {
            setLoading(true);
            const data = await categoryService.getDeleted();
            const formattedData = Array.isArray(data) ? data : [];
            setCategories(formattedData);
        } catch (err) {
            const errorMessage = handleApiError(err, "Tải danh sách danh mục đã xóa thất bại");
            showToast(errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        fetchCategoriesRecover(); 
    }, []);

    // MODAL Recover
    const handleRecoverClick = (id) => {
        setRecoverId(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmRecover = async () => {
        try {
            setIsRecovering(true);
            await categoryService.recover(recoverId);
            showToast("Khôi phục danh mục thành công", "success");
            await fetchCategoriesRecover(); // Refresh danh sách
        } catch (err) {
            const errorMessage = handleApiError(err, "Khôi phục danh mục thất bại");
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
                <CategoryRecoverTable 
                    data={categories} 
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
                message="Bạn có chắc chắn muốn khôi phục danh mục này không?"
                onConfirm={handleConfirmRecover}
                onCancel={() => setIsConfirmOpen(false)}
                isLoading={isRecovering}
            />
        </div>
    );
}

export default CategoryRecover;