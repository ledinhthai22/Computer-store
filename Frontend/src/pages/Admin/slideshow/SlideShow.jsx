import { useEffect, useState } from "react";
import SlideShowTable from '../../../components/admin/slideshow/SlideShowTable';
import Toast from '../../../components/admin/Toast';
import ConfirmModal from '../../../components/admin/DeleteConfirmModal';
// import { slideShowService } from '../../../services/api/slideShowService'; // Giữ lại để dùng sau

const SlideShow = () => {
    const [slideShows, setSlideShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [slideShowNameInput, setSlideShowNameInput] = useState(''); // Đây có thể là tên hoặc link sản phẩm tùy bạn điều chỉnh
    const [editingSlideShow, setEditingSlideShow] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    // MOCK DATA dựa trên cấu trúc database của bạn
    const mockData = [
        { maTrinhChieu: 1, duongDanHinh: 'banner1.jpg', duongDanSanPham: '/san-pham-1', soThuTu: 1, trangThai: 1 },
        { maTrinhChieu: 2, duongDanHinh: 'banner2.jpg', duongDanSanPham: '/san-pham-2', soThuTu: 2, trangThai: 1 },
        { maTrinhChieu: 3, duongDanHinh: 'banner3.jpg', duongDanSanPham: '/san-pham-3', soThuTu: 3, trangThai: 0 },
    ];

    const fetchSlideShows = async () => {
        try {
            setLoading(true);
            
            // --- KHI CÓ API THÌ MỞ ĐOẠN NÀY ---
            /*
            const res = await slideShowService.getAll();
            const data = Array.isArray(res) ? res : [];
            setSlideShows(data);
            */
            // ---------------------------------

            // HIỆN TẠI DÙNG MOCK DATA
            setSlideShows(mockData);
            setLoading(false);
        } catch (err) {
            console.log(err);
            showToast("Tải danh sách slide show thất bại", "error");
            setSlideShows([]);
            setLoading(false);
        }
    };

    useEffect(() => { fetchSlideShows(); }, []);

    // MODAL XÓA
    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            setIsDeleting(true);
            // API CALL: await slideShowService.delete(deleteId);
            
            // Mock logic xóa
            setSlideShows(slideShows.filter(item => item.maTrinhChieu !== deleteId));
            showToast("Xóa slide show thành công", "success");
        } catch (err) {
            console.log(err)
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
        // Ở đây lấy DuongDanHinh làm ví dụ cho input
        setSlideShowNameInput(slideShow.duongDanHinh || '');
        setError('');
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!slideShowNameInput.trim()) return setError('Không được để trống');
        
        try {
            setIsSubmitting(true);
            // API CALL: const data = { duongDanHinh: slideShowNameInput };
            
            if (editingSlideShow) {
                // await slideShowService.update(editingSlideShow.maTrinhChieu, data)
                showToast("Cập nhật thành công (Mock)", "success");
            } else {
                // await slideShowService.create(data);
                showToast("Thêm mới thành công (Mock)", "success");
            }

            await fetchSlideShows();
            setIsModalOpen(false);
        } catch (err) {
            console.log(err)
            showToast("Có lỗi xảy ra", "error");
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