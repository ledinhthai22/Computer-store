import { useEffect, useState, useCallback } from "react";
import CategoryTable from "../../../components/admin/category/CategoryTable";
import Toast from "../../../components/admin/Toast";
import ConfirmModal from "../../../components/admin/DeleteConfirmModal";
import { categoryService, handleApiError } from "../../../services/api/categoryService";

const BRAND_NAME_REGEX = /^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]*$/;

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [newName, setNewName] = useState("");
    const [editing, setEditing] = useState(null);
    const [trangThai, setTrangThai] = useState(true);

    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [filterType, setFilterType] = useState('all');

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
    };

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            let res;
            if (filterType === 'all') {
                res = await categoryService.getAll();
            }else if (filterType === 'active') {
                res = await categoryService.getAll().then(data => data.filter(category => category.trangThai));
            }else{
                res = await categoryService.getAll().then(data => data.filter(category => !category.trangThai));
            }
            setCategories(Array.isArray(res) ? res : []);
        } catch (err) {
            showToast(handleApiError(err, "Tải danh sách danh mục thất bại"), "error");
        } finally {
            setLoading(false);
        }
    }, [filterType]);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    // ===== XÓA =====
    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            setIsDeleting(true);
            await categoryService.delete(deleteId);
            showToast("Xóa danh mục thành công");
            fetchCategories();
        } catch (err) {
            showToast(handleApiError(err, "Xóa danh mục thất bại"), "error");
        } finally {
            setIsDeleting(false);
            setIsConfirmOpen(false);
            setDeleteId(null);
        }
    };

    // ===== SỬA =====
    const handleEditClick = (category) => {
        setEditing(category);
        setNewName(category.tenDanhMuc);
        setTrangThai(category.trangThai);
        setError("");
        setIsModalOpen(true);
    };

    // ===== LƯU =====
    const handleSave = async (e) => {
        e.preventDefault();
        const nameTrimmed = newName.trim();

        // Kiểm tra lại lần cuối trước khi gửi
        if (!nameTrimmed) {
            return setError("Tên danh mục không được để trống");
        }
        if (!BRAND_NAME_REGEX.test(nameTrimmed)) {
            return setError("Tên danh mục không được chứa ký tự đặc biệt");
        }
    
    // Nếu có lỗi hiện tại thì không cho submit
    if (error) return;

        try {
            setIsSubmitting(true);

            const categoryData = {
                tenDanhMuc: nameTrimmed,
                trangThai: trangThai,
            };

            if (editing) {
                await categoryService.update(editing.maDanhMuc, categoryData);
                showToast("Cập nhật danh mục thành công");
            } else {
                await categoryService.create(categoryData);
                showToast("Thêm danh mục thành công");
            }

            fetchCategories();
            setIsModalOpen(false);
            setEditing(null);
            setNewName("");
            setError("");
        } catch (err) {
            setError(handleApiError(err, "Có lỗi xảy ra khi lưu danh mục"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const openAddModal = () => {
        setEditing(null);
        setNewName("");
        setTrangThai(true);
        setError("");
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <CategoryTable
                data={categories}
                loading={loading}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onFilterTypeChange={setFilterType}
                filterType={filterType}
                showToast={showToast}
                onOpenAddModal={openAddModal}
            />

            {/* MODAL THÊM / SỬA */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                        <form onSubmit={handleSave} className="p-6">
                            <h2 className="text-xl font-bold mb-5 text-center text-gray-800">
                                {editing ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
                            </h2>

                            {/* TÊN */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Tên danh mục
                                </label>
                                <input
                                    value={newName}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setNewName(value);
                                        
                                        // Kiểm tra lỗi theo thời gian thực (Real-time validation)
                                        if (!value.trim()) {
                                            setError("Tên danh mục không được để trống");
                                        } else if (!BRAND_NAME_REGEX.test(value)) {
                                            setError("Tên danh mục không được chứa ký tự đặc biệt");
                                        } else {
                                            setError(""); // Xóa lỗi nếu nhập đúng
                                        }
                                    }}
                                    className={`w-full px-4 py-2 border rounded-lg outline-none ${error
                                            ? "border-red-500"
                                            : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                                        }`}
                                    placeholder="Nhập tên danh mục..."
                                    disabled={isSubmitting}
                                    autoFocus
                                />
                                {error && (
                                    <p className="text-red-500 text-xs mt-2 font-medium">
                                        {error}
                                    </p>
                                )}
                            </div>

                            {editing && (
                                <div className="mb-5 flex items-start gap-4">
                                    {/* SWITCH BÊN TRÁI */}
                                    <button
                                        type="button"
                                        onClick={() => setTrangThai(!trangThai)}
                                        disabled={isSubmitting}
                                        className={`relative w-11 h-6 rounded-full transition-colors mt-1 cursor-pointer
                                        ${trangThai ? "bg-green-500" : "bg-gray-300"}
                                    `}>
                                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300
                                            ${trangThai ? "translate-x-5" : ""}
                                        `}
                                        />
                                    </button>

                                    {/* TEXT BÊN PHẢI */}
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">
                                            Trạng thái hiển thị
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Bật để hiển thị danh mục trên website
                                        </p>
                                    </div>
                                </div>
                            )}


                            {/* ACTION */}
                            <div className="flex justify-center gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer"
                                >
                                    Đóng
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 cursor-pointer"
                                >
                                    {isSubmitting ? "Đang lưu..." : "Xác nhận"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* TOAST */}
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}

            {/* CONFIRM DELETE */}
            <ConfirmModal
                isOpen={isConfirmOpen}
                message="Bạn có chắc chắn muốn xóa danh mục này không?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsConfirmOpen(false)}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default Category;
