import axios from "axios";
import { useEffect, useState } from "react";
import Toast from '../../components/admin/Toast';
import ConfirmModal from '../../components/admin/RecoverConfirmModal';
import BrandRecoverTable from '../../components/admin/brand/BrandRecoverTable';

const BrandRecover = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [recoverId, setRecoverId] = useState(null);
    const [isRecover, setIsRecover] = useState(false);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    const fetchDataRecover = async () => {
        try {
            setLoading(false);
            const res = await axios.get('https://localhost:7012/api/Brand/deleted');
            const data = Array.isArray(res.data) ? res.data : [];
            setBrands(data);
        } catch (error) {
            console.error("Lỗi khi fetch:", error);
            showToast("Không thể tải danh sách thương hiệu!", "error");
        }finally{
            setLoading(false);}
    };

    useEffect(() => { fetchDataRecover(); }, []);

    // MODAL Recover
    const handleRecover = (id) => {
        setRecoverId(id);
        setIsConfirmOpen(true);
    };
    const handleConfirmRecover = async () => {
    try {
        setIsRecover(true);
        await axios.put(`https://localhost:7012/api/Brand/recover/${recoverId}`);
        
        showToast("Khôi phục thành công!", "success");
        await fetchDataRecover();
    } catch (err) {
        console.error(err);
        showToast("Lỗi khi khôi phục dữ liệu!", "error");
    } finally {
        setIsRecover(false);
        setIsConfirmOpen(false);
        setRecoverId(null);
    }
};

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <BrandRecoverTable 
                    data={brands} 
                    loading={loading}
                    onRecover={handleRecover}
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
                title="Xác nhận khôi phục thương hiệu"
                message="Bạn có muốn khôi phục thương hiệu này không?"
                onConfirm={handleConfirmRecover}
                onCancel={() => setIsConfirmOpen(false)}
                isLoading={isRecover}
            />
        </div>
    );
}

export default BrandRecover;