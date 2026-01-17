import { WebInfoService } from "../../../services/api/webInfoService";
import { useEffect, useState } from "react";
import WebInfoTable from '../../../components/admin/WebInfo/WebInfoTable';
import Toast from '../../../components/admin/Toast';
import ConfirmModal from '../../../components/admin/DeleteConfirmModal';
import WebInfoModal from "../../../components/admin/webinfo/WebInfoModal";

const WebInfoPage = () => {
    const [webinfo, setWebinfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
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
            setLoading(true);
            const res = await WebInfoService.getAll();
            const data = Array.isArray(res) ? res : [res];
            
            // Map dữ liệu và thêm message cho cột trạng thái
            const formattedData = data.map(item => ({
                ...item,
                message: item.trangThai ? "Hoạt động" : "Lựa chọn"
            }));
            
            setWebinfo(formattedData);
        } catch (error) {
            console.error("Lỗi fetch:", error);
            showToast("Tải thông tin trang thất bại", "error");
            setWebinfo([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        fetchWebInfo(); 
    }, []);

    // ✅ Hàm cập nhật trạng thái (kích hoạt trang chủ)
    const handleUpdateStatus = async (id) => {
        try {
            setIsUpdatingStatus(true);
            
            // Gọi API update status - truyền { trangThai: true }
            await WebInfoService.updateStatus(id, { trangThai: true });
            
            showToast("Đã kích hoạt trang chủ thành công!", "success");
            
            // Reload lại dữ liệu
            await fetchWebInfo();
            
            // Cập nhật editing data nếu đang mở modal
            if (editing?.maThongTinTrang === id) {
                setEditing(prev => ({ ...prev, trangThai: true }));
            }
        } catch (err) {
            console.error("Lỗi update status:", err);
            showToast(
                err.response?.data?.message || 'Cập nhật trạng thái thất bại', 
                'error'
            );
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const handleSave = async (formData) => {
        try {
            setIsSubmitting(true);
            if (editing) {
                await WebInfoService.update(editing.maThongTinTrang, formData);
                showToast("Cập nhật thành công!");
            } else {
                await WebInfoService.create(formData);
                showToast("Thêm mới thành công!");
            }
            await fetchWebInfo();
            setIsModalOpen(false);
            setEditing(null);
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
            await WebInfoService.delete(deleteId);
            showToast("Xóa thành công");
            await fetchWebInfo();
        } catch (err) {
            console.error(err);
            showToast("Xóa thất bại", "error");
        } finally {
            setIsDeleting(false);
            setIsConfirmOpen(false);
            setDeleteId(null);
        }
    };

    const handleEdit = (data) => {
        setEditing(data);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditing(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <WebInfoTable 
                    data={webinfo} 
                    loading={loading} 
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onOpenAddModal={() => { 
                        setEditing(null); 
                        setIsModalOpen(true); 
                    }}
                />

                <WebInfoModal 
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    onUpdateStatus={handleUpdateStatus}
                    editingData={editing}
                    isSubmitting={isSubmitting}
                    isUpdatingStatus={isUpdatingStatus}
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
        </div>
    );
};

export default WebInfoPage;