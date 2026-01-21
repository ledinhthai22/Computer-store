import { useEffect, useState, useCallback } from "react";
import SlideShowTable from '../../../components/admin/slideshow/SlideShowTable';
import Toast from '../../../components/admin/Toast';
import ConfirmModal from '../../../components/admin/DeleteConfirmModal';
import { slideShowService } from '../../../services/api/slideShowService';

const SlideShow = () => {
    const API_BASE_URL = "https://localhost:7012";
    const [slideShows, setSlideShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        tenTrinhChieu: '',
        duongDanSanPham: '',
        SoThuTu: 1,
        TrangThai: true, // Lưu trực tiếp vào đây
        HinhAnh: null
    });
    
    const [previewImage, setPreviewImage] = useState(null);
    const [editingSlideShow, setEditingSlideShow] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [filterType, setFilterType] = useState('all');

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    const fetchSlideShows = useCallback(async () => {
        try {
            setLoading(true);
            const data = await slideShowService.getAll();
            console.log("Dữ liệu API:", data);
            let res = data;
            if (filterType === 'active') {
                res = data.filter(item => item.trangThai);
            } else if (filterType === 'inactive') {
                res = data.filter(item => !item.trangThai);
            }
            setSlideShows(Array.isArray(res) ? res : []);
        } catch (err) {
            console.log(err)
            showToast("Tải danh sách thất bại", "error");
        } finally {
            setLoading(false);
        }
    }, [filterType]);

    useEffect(() => { fetchSlideShows(); }, [fetchSlideShows]);
    const handleEditClick = (slideShow) => {
        setEditingSlideShow(slideShow);
        setFormData({
            tenTrinhChieu: slideShow.tenTrinhChieu || '',
            duongDanSanPham: slideShow.duongDanSanPham || '',
            SoThuTu: slideShow.soThuTu || 1,
            TrangThai: slideShow.trangThai, // API trả về true/false
            HinhAnh: null 
        });
        
        // Xử lý preview image từ URL server
        const fullImageUrl = slideShow.duongDanHinh?.startsWith('http') 
            ? slideShow.duongDanHinh 
            : `${API_BASE_URL}${slideShow.duongDanHinh}`;
        setPreviewImage(fullImageUrl);
        setIsModalOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, HinhAnh: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = new FormData();
            data.append('TenTrinhChieu', formData.tenTrinhChieu);
            data.append('DuongDanSanPham', formData.duongDanSanPham);
            data.append('SoThuTu', formData.SoThuTu);
            data.append('TrangThai', formData.TrangThai); // Boolean sẽ được convert sang string "true"/"false"
            
            if (formData.HinhAnh) {
                data.append('HinhAnh', formData.HinhAnh);
            }

            if (editingSlideShow) {
                await slideShowService.update(editingSlideShow.maTrinhChieu, data);
                showToast("Cập nhật thành công");
            } else {
                await slideShowService.create(data);
                showToast("Thêm mới thành công");
            }

            await fetchSlideShows();
            setIsModalOpen(false);
        } catch (err) {
            console.log(err)
            showToast("Thao tác thất bại", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    // XÓA 
        const handleDeleteClick = (id) => {
            setDeleteId(id);
            setIsConfirmOpen(true);
        };
    
        const handleConfirmDelete = async () => {
            try {
                setIsDeleting(true);
                await slideShowService.delete(deleteId);
                showToast("Xóa trình chiếu thành công");
                await fetchSlideShows();
            } catch (err) {
                console.log(err)
                showToast("Xóa trình chiếu thất bại", "error");
            } finally {
                setIsDeleting(false);
                setIsConfirmOpen(false);
                setDeleteId(null);
            }
        };

    return (
        <div className="space-y-6">
            <SlideShowTable 
                data={slideShows} 
                loading={loading} 
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                filterType={filterType}
                onFilterTypeChange={setFilterType}
                showToast={showToast}
                onOpenAddModal={() => {
                    setEditingSlideShow(null);
                    setFormData({ tenTrinhChieu: '', duongDanSanPham: '', SoThuTu: 1, TrangThai: true, HinhAnh: null });
                    setPreviewImage(null);
                    setIsModalOpen(true);
                }}
            />

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <h2 className="text-xl font-bold text-gray-800 text-center">
                                {editingSlideShow ? 'Chỉnh sửa Trình chiếu' : 'Thêm Trính chiếu mới'}
                            </h2>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh</label>
                                <div className="relative mt-1">
                                    {/* Label bọc toàn bộ vùng này để kích hoạt input khi click */}
                                    <label 
                                        htmlFor="fileInput" 
                                        className="flex flex-col items-center justify-center p-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#2F9EA0] transition-colors cursor-pointer min-h-[160px] overflow-hidden"
                                    >
                                        {/* Input file ẩn đi nhưng vẫn hoạt động thông qua label */}
                                        <input 
                                            type="file" 
                                            onChange={handleFileChange} 
                                            className="hidden" 
                                            id="fileInput"
                                            accept="image/*" 
                                        />

                                        {previewImage ? (
                                            <div className="w-full h-full relative group">
                                                <img 
                                                    src={previewImage} 
                                                    alt="Preview" 
                                                    className="h-40 w-full object-cover rounded-md border shadow-sm" 
                                                />
                                                {/* Lớp phủ khi hover để báo hiệu có thể đổi ảnh */}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-md">
                                                    <span className="text-white text-sm font-medium">Thay đổi hình ảnh</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center py-5">
                                                <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                </svg>
                                                <p className="text-sm text-gray-500">Nhấn để tải lên hình ảnh</p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tên trình chiếu</label>
                                <input 
                                    type="text" required
                                    value={formData.tenTrinhChieu}
                                    onChange={(e) => setFormData({...formData, tenTrinhChieu: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-lg focus:border-[#2F9EA0] focus:ring-2 focus:ring-[#2F9EA0] outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Đường dẫn sản phẩm</label>
                                <input 
                                    type="text" required
                                    value={formData.duongDanSanPham}
                                    onChange={(e) => setFormData({...formData, duongDanSanPham: e.target.value})}
                                    placeholder="/chi-tiet-san-pham/slug-san-pham"
                                    className="w-full px-4 py-2 border rounded-lg focus:border-[#2F9EA0] focus:ring-2 focus:ring-[#2F9EA0] outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Số thứ tự</label>
                                <input 
                                    type="number"
                                    value={formData.SoThuTu}
                                    onChange={(e) => setFormData({...formData, SoThuTu: parseInt(e.target.value) || 0})}
                                    className="w-full px-4 py-2 border rounded-lg focus:border-[#2F9EA0] focus:ring-2 focus:ring-[#2F9EA0] outline-none"
                                />
                            </div>

                            {/* SWITCH TRẠNG THÁI */}
                            <div className="flex items-center gap-4 mt-5 p-3 bg-gray-50 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setFormData({...formData, TrangThai: !formData.TrangThai})}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition cursor-pointer ${formData.TrangThai ? "bg-green-500" : "bg-gray-300"}`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${formData.TrangThai ? "translate-x-6" : "translate-x-1"}`}
                                    />
                                </button>

                                <div>
                                    <p className="text-sm font-medium text-gray-800">Trạng thái hiển thị</p>
                                    <p className="text-xs text-gray-500">Bật để hiển thị slide trên website</p>
                                </div>
                            </div>

                            <div className="flex justify-center gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">Đóng</button>
                                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:bg-blue-300 font-medium cursor-pointer">
                                    {isSubmitting ? 'Đang lưu...' : 'Xác nhận'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {toast.show && <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />}

            {/* CONFIRM DELETE */}
            <ConfirmModal
                isOpen={isConfirmOpen}
                message="Bạn có muốn xóa trình chiếu này không?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsConfirmOpen(false)}
                isLoading={isDeleting}
            />
        </div>
    );
}

export default SlideShow;