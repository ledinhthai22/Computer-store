import axios from 'axios';
import {useState, useEffect} from 'react';
import ContactTable from '../../components/admin/contact/ContactTable';
import Toast from '../../components/admin/Toast';
import ConfirmModal from '../../components/admin/DeleteConfirmModal';

const Contact = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    // const [deleteId, setDeleteId] = useState(null);
    // const [isDeleting, setIsDeleting] = useState(false);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    }

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`https://dummyjson.com/quotes`);
            const data = res.data && Array.isArray(res.data.quotes) ? res.data.quotes : [];
            setContacts(data);
        } catch (error) {
            console.error("Lỗi fetch:", error);
            showToast("Không thể tải danh sách liên hệ", "error");
            setContacts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {fetchContacts(); }, []);

    // MODAL XÓA
    // const handleDeleteClick = (id) => {
    //     setDeleteId(id);
    //     setIsConfirmOpen(true);
    // };
    // const handleConfirmDelete = async () => {
    //     try {
    //         setIsDeleting(true);
    //         await axios.delete(`https://localhost:7012/api/Contact/${deleteId}`);
    //         showToast("Đã xóa liên hệ thành công!", "success");
    //         await fetchContacts();
    //     } catch (err) {
    //         console.error(err);
    //         showToast("Lỗi xóa dữ liệu", "error");
    //     } finally {
    //         setIsDeleting(false);
    //         setIsConfirmOpen(false);
    //         setDeleteId(null);
    //     }
    // };
    return (
        <>
            <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <ContactTable 
                    data={contacts} 
                    loading={loading}
                    //onDelete={handleDeleteClick}
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
            {/* <ConfirmModal 
                isOpen={isConfirmOpen}
                message="Bạn có muốn xóa liên hệ này không?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsConfirmOpen(false)}
                isLoading={isDeleting}
            /> */}
        </div>
        </>
    )
}

export default Contact;