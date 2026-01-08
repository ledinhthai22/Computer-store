import axios from "axios";
import { useEffect, useState } from "react";
import WebInfoTable from '../../../components/admin/WebInfo/WebInfoTable';
import Toast from '../../../components/admin/Toast';
import ConfirmModal from '../../../components/admin/DeleteConfirmModal';

const Category = () => {
    const [webinfo, setWebinfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };
        const fetchWebInfo = async () => {
            try {
                const res = await axios.get('https://localhost:7012/api/WebInfo');
                const data = Array.isArray(res.data) ? res.data : [];
                setWebinfo(data);
            } catch (error) {
                console.error("Lỗi fetch:", error);
                showToast("Tải danh sách thông tin trang thất bại", "error");
            }finally{
                setLoading(false);
            }
        };

    useEffect(() => { fetchWebInfo(); }, []);

    // --- CHỨC NĂNG XÓA ---
    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setIsConfirmOpen(true);
    };
    const handleConfirmDelete = async () => {
        try {
            setIsDeleting(true);
            await axios.delete(`https://localhost:7012/api/WebInfo/${deleteId}`);
            showToast("Xóa thông tin trang thành công", "success");
            await fetchWebInfo();
        } catch (err) {
            console.error(err);
            showToast("Xóa thông tin trang thất bại", "error");
        } finally {
            setIsDeleting(false);
            setIsConfirmOpen(false);
            setDeleteId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <WebInfoTable 
                    data={webinfo} 
                    loading={loading} 
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                />
            </div>

            {toast.show && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast({ ...toast, show: false })} 
                />
            )}
            <ConfirmModal 
                isOpen={isConfirmOpen}
                message="Bạn có muốn xóa thông tin trang này không?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsConfirmOpen(false)}
                isLoading={isDeleting}
            />
        </div>
    );
}

export default Category;