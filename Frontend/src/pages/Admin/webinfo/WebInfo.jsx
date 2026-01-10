import axios from "axios";
import { useEffect, useState } from "react";
import WebInfoTable from '../../../components/admin/WebInfo/WebInfoTable';
import Toast from '../../../components/admin/Toast';
import ConfirmModal from '../../../components/admin/DeleteConfirmModal';
import WebInfoModal from "../../../components/admin/webinfo/WebInfoModal";

const WebInfoPage = () => {
    const [webinfo, setWebinfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

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
            setWebinfo(Array.isArray(res.data) ? res.data : [res.data]);
        } catch (error) {
            console.error("Lỗi fetch:", error);
            showToast("Tải thông tin trang thất bại", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchWebInfo(); }, []);

    const handleSave = async (formData) => {
        try {
            setIsSubmitting(true);
            if (editing) {
                await axios.put(`https://localhost:7012/api/WebInfo/${editing.maThongTinTrang}`, formData);
                showToast("Cập nhật thành công!");
            } else {
                await axios.post('https://localhost:7012/api/WebInfo', formData);
                showToast("Thêm mới thành công!");
            }
            await fetchWebInfo();
            setIsModalOpen(false);
        } catch (err) {
            showToast(err.response?.data?.message || 'Có lỗi xảy ra.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            setIsDeleting(true);
            await axios.delete(`https://localhost:7012/api/WebInfo/${deleteId}`);
            showToast("Xóa thành công");
            await fetchWebInfo();
        } catch (err) {
            console.error(err)
            showToast("Xóa thất bại", "error");
        } finally {
            setIsDeleting(false);
            setIsConfirmOpen(false);
        }
    };

    return (
        <div className="space-y-6 p-4">
            <WebInfoTable 
                data={webinfo} 
                loading={loading} 
                onEdit={(data) => { setEditing(data); setIsModalOpen(true); }}
                onDelete={handleDeleteClick}
                onOpenAddModal={() => { setEditing(null); setIsModalOpen(true); }}
            />

            <WebInfoModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                editingData={editing}
                isSubmitting={isSubmitting}
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
                message="Bạn có muốn xóa thông tin trang này không?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsConfirmOpen(false)}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default WebInfoPage;