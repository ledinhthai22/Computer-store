import {useState, useEffect, useCallback} from 'react';
import ContactTable from '../../../components/admin/contact/ContactTable';
import Toast from '../../../components/admin/Toast';
import ConfirmModal from '../../../components/admin/DeleteConfirmModal';
import ContactModal from '../../../components/admin/contact/ContactModal';
import { contactService, handleApiError } from '../../../services/api/contactService';

const Contact = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filterType, setFilterType] = useState('unread');

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
            let res = [];
            if (filterType === 'unread') {
                res = await contactService.getAllUnread();
            } else if (filterType === 'read') {
                res = await contactService.getAllRead();
            } else {
                res = await contactService.getAll();
            }
            const data = Array.isArray(res) ? res : [];
            setContacts(data);
        } catch (err) {
            const errorMessage = handleApiError(err, "Tải danh sách liên hệ thất bại");
            showToast(errorMessage, "error");
            setContacts([]);
        } finally {
            setLoading(false);
        }
    }, [filterType]);

    useEffect(() => {fetchContacts();}, [fetchContacts]);

    // MODAL XÓA
    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setIsConfirmOpen(true);
    };
    const handleConfirmDelete = async () => {
        try {
            setIsDeleting(true);
            await contactService.delete(deleteId);
            showToast("Đã xóa liên hệ thành công!", "success");
            await fetchContacts();
            window.dispatchEvent(new CustomEvent('contactUpdated'));
        } catch (err) {
            const errorMessage = handleApiError(err, "Xóa liên hệ thất bại");
            showToast(errorMessage, "error");
        } finally {
            setIsDeleting(false);
            setIsConfirmOpen(false);
            setDeleteId(null);
        }
    };

    const handleViewClick = async (contact) => {
        setSelectedContact(contact);
        setIsViewModalOpen(true);

        if (contact.message?.toLowerCase() !== "đã đọc") {
            try {
                await contactService.update(contact.maLienHe);
                await fetchContacts(); 
                window.dispatchEvent(new CustomEvent('contactUpdated'));
            } catch (err) {
                const errorMessage = handleApiError(err, "Cập nhật trạng thái liên hệ thất bại");
                showToast(errorMessage, "error");
            }
        }
    };

    return (
        <>
            <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <ContactTable 
                    data={contacts} 
                    loading={loading}
                    onDelete={handleDeleteClick}
                    onView={handleViewClick}
                    filterType={filterType}
                    onFilterTypeChange={setFilterType}
                    showToast={showToast}
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