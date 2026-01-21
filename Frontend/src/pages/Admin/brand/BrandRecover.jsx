import { useEffect, useState } from "react";
import Toast from '../../../components/admin/Toast';
import ConfirmModal from '../../../components/admin/RecoverConfirmModal';
import BrandRecoverTable from '../../../components/admin/brand/BrandRecoverTable';
import { brandService } from '../../../services/api/brandService';

const BrandRecover = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [recoverId, setRecoverId] = useState(null);
    const [isRecovering, setIsRecovering] = useState(false); // rename cho rõ nghĩa

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        // Tự động ẩn sau 4s (tùy chọn)
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
    };

    const fetchDataRecover = async () => {
        setLoading(true);
        try {
            const res = await brandService.getDeleted();
            // Đảm bảo data là array, tránh lỗi nếu backend trả object hoặc null
            const data = Array.isArray(res) ? res : res?.data || [];
            setBrands(data);
        } catch (err) {
            console.log(err)
            showToast("Tải danh sách thương hiệu đã xóa thất bại", "error");
            console.error("Fetch deleted brands error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDataRecover();
    }, []);

    // Mở modal confirm
    const handleRecover = (id) => {
        setRecoverId(id);
        setIsConfirmOpen(true);
    };

    // Xử lý confirm khôi phục
    const handleConfirmRecover = async () => {
        if (!recoverId) return;

        setIsRecovering(true);
        try {
            await brandService.recover(recoverId);
            showToast("Khôi phục thương hiệu thành công!", "success");

            // Reload danh sách ngay lập tức
            await fetchDataRecover();

            // Optional: Nếu muốn xóa ngay mà không chờ API (nhanh hơn)
            // setBrands(prev => prev.filter(b => b.maThuongHieu !== recoverId));
        } catch (err) {
            console.log(err)
            showToast("Khôi phục thương hiệu thất bại", "error");
        } finally {
            setIsRecovering(false);
            setIsConfirmOpen(false);
            setRecoverId(null);
        }
    };

    return (
        <div className="space-y-6 p-4">
            <div className="flex flex-col gap-4">
                <BrandRecoverTable 
                    data={brands} 
                    loading={loading}
                    onRecover={handleRecover}
                />
            </div>
            
            {/* Toast thông báo */}
            {toast.show && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast({ ...toast, show: false })} 
                />
            )}

            {/* Modal confirm */}
            <ConfirmModal 
                isOpen={isConfirmOpen}
                message="Bạn có chắc muốn khôi phục thương hiệu này không?"
                onConfirm={handleConfirmRecover}
                onCancel={() => {
                    setIsConfirmOpen(false);
                    setRecoverId(null);
                }}
                isLoading={isRecovering}
            />
        </div>
    );
}

export default BrandRecover;