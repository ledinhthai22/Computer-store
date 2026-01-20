import { useEffect, useState } from "react";
import SlideShowTable from '../../../components/admin/slideshow/SlideShowTable';
import Toast from '../../../components/admin/Toast';
import ConfirmModal from '../../../components/admin/DeleteConfirmModal';
//import { slideShowService } from '../../../services/api/slideShowService';

const SlideShow = () => {
    const [slideShows, setSlideShows] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [slideShowNameInput, setSlideShowNameInput] = useState('');
    const [editingSlideShow, setEditingSlideShow] = useState(null);

    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };
    const fetchSlideShows = async () => {
        try {
            setLoading(true);
            const res = await slideShowService.getAll();
            const data = Array.isArray(res) ? res : [];
            setSlideShows(data);
        } catch (err) {
            console.log(err);
            showToast("Tải danh sách slide show thất bại", "error");
            setSlideShows([]);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {fetchSlideShows(); }, []);

    // MODAL XÓA
    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setIsConfirmOpen(true);
    };
    const handleConfirmDelete = async () => {
        try {
            setIsDeleting(true);
            await slideShowService.delete(deleteId);
            showToast("Xóa slide show thành công", "success");
            await fetchSlideShows();
        } catch (err) {
            console.log(err);
            showToast("Xóa slide show thất bại", "error");
        } finally {
            setIsDeleting(false);
            setIsConfirmOpen(false);
            setDeleteId(null);
        }
    };

    // MODAL SỬA
    const handleEditClick = (slideShow) => {
        setEditingSlideShow(slideShow);
        setSlideShowNameInput(slideShow.tenSlideShow || '');
        setError('');
        setIsModalOpen(true);
    };
    // CHỨC NĂNG THÊM VÀ SỬA
    const handleSave = async (e) => {
        e.preventDefault();
        const nameTrimmed = slideShowNameInput.trim();
        if (!nameTrimmed) {
            return setError('Tên slide show không được để trống');
        }
        try {
            setIsSubmitting(true);
            const data = { tenSlideShow: nameTrimmed };
            if (editingSlideShow) {
                await slideShowService.update(editingSlideShow.maSlideShow, data)
                showToast("Cập nhật slide show thành công", "success");
            } else {
                await slideShowService.create(data);
                showToast("Thêm slide show thành công", "success");
            }

            await fetchSlideShows();
            setIsModalOpen(false);
            setEditingSlideShow(null);
            setSlideShowNameInput('');
        } catch (err) {
            console.log(err);
            showToast("Có lỗi xảy ra khi lưu slide show", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <SlideShowTable 
                    data={slideShows} 
                    loading={loading} 
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    onOpenAddModal={() => {
                        setEditingSlideShow(null);
                        setSlideShowNameInput('');
                        setError('');
                        setIsModalOpen(true);
                    }}
                />
            </div>

            {/* MODAL THÊM/SỬA */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                        <form onSubmit={handleSave} className="p-6">
                            <h2 className="text-xl font-bold mb-5 text-gray-800 text-center">
                                {editingSlideShow ? 'Chỉnh sửa slide show' : 'Thêm slide show mới'}
                            </h2>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên slide show</label>
                                <input
                                    type="text"
                                    value={slideShowNameInput}
                                    onChange={(e) => {
                                        setSlideShowNameInput(e.target.value);
                                        if(error) setError('');
                                    }}
                                    className={`w-full px-4 py-2 border rounded-lg outline-none ${
                                        error ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                                    }`}
                                    autoFocus
                                />
                                {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
                            </div>

                            <div className="flex justify-center gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg whitespace-nowrap cursor-pointer"
                                >
                                    Đóng
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:bg-blue-300 font-medium whitespace-nowrap cursor-pointer"
                                >
                                    {isSubmitting ? 'Đang lưu...' : 'Xác nhận'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
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
                message="Bạn có muốn xóa slide show này không?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsConfirmOpen(false)}
                isLoading={isDeleting}
            />
        </div>
    );
}

export default SlideShow;