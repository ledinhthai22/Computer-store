import axios from 'axios';
import {useState, useEffect, useCallback} from 'react';
import ContactTable from '../../components/admin/contact/ContactTable';
import Toast from '../../components/admin/Toast';
import ConfirmModal from '../../components/admin/DeleteConfirmModal';
import ContactModal from '../../components/admin/contact/ContactModal';

const Contact = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filterType, setFilterType] = useState('all');

    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    }

    const fetchContacts = useCallback(async () => {
        try {
            setLoading(true);
            let url = `https://localhost:7012/api/Contact`;         
            if (filterType === 'unread') {
                url = `https://localhost:7012/api/Contact/AllUnread`;
            } else if (filterType === 'read') {
                url = `https://localhost:7012/api/Contact/AllRead`;
            }
            const res = await axios.get(url);
            const data = Array.isArray(res.data) ? res.data : [];
            setContacts(data);
        } catch (error) {
            console.error("Lỗi fetch:", error);
            showToast("Không thể tải danh sách liên hệ", "error");
            setContacts([]);
        } finally {
            setLoading(false);
        }
    }, [filterType]);

    // 3. Theo dõi sự thay đổi của filterType
    useEffect(() => {fetchContacts();}, [fetchContacts]);

    // MODAL XÓA
    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setIsConfirmOpen(true);
    };
    const handleConfirmDelete = async () => {
        try {
            setIsDeleting(true);
            await axios.delete(`https://localhost:7012/api/Contact/${deleteId}`);
            showToast("Đã xóa liên hệ thành công!", "success");
            await fetchContacts();
            window.dispatchEvent(new CustomEvent('contactUpdated'));
        } catch (err) {
            console.error(err);
            showToast("Lỗi xóa dữ liệu", "error");
        } finally {
            setIsDeleting(false);
            setIsConfirmOpen(false);
            setDeleteId(null);
        }
    };

    const handleViewClick = async (contact) => {
        setSelectedContact(contact);
        setIsViewModalOpen(true);

        // Nếu liên hệ chưa đọc (message !== "đã đọc")
        if (contact.message?.toLowerCase() !== "đã đọc") {
            try {
                // Đảm bảo URL API đúng với Backend của bạn
                await axios.put(`https://localhost:7012/api/Contact/read/${contact.maLienHe}`);
                
                // 1. Tải lại DataTable tại trang này
                await fetchContacts(); 

                // 2. Phát sự kiện để NavNotification trên Header cập nhật theo
                window.dispatchEvent(new CustomEvent('contactUpdated'));
                
            } catch (error) {
                console.error("Không thể cập nhật trạng thái:", error);
            }
        }
    };

    return (
        <>
            <div className="space-y-6">
            <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                    <span className="font-semibold text-gray-700">Lọc theo:</span>
                    <select 
                        className="border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="all">Tất cả liên hệ</option>
                        <option value="unread">Chưa đọc</option>
                        <option value="read">Đã đọc</option>
                    </select>
                </div>
                <ContactTable 
                    data={contacts} 
                    loading={loading}
                    onDelete={handleDeleteClick}
                    onView={handleViewClick}
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
                message="Bạn có muốn xóa liên hệ này không?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsConfirmOpen(false)}
                isLoading={isDeleting}
            />
            <ContactModal
                isOpen={isViewModalOpen}
                contact={selectedContact}
                onClose={() => setIsViewModalOpen(false)}
            />
        </div>
        </>
    )
}

export default Contact;