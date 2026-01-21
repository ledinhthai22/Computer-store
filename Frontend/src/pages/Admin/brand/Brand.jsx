import { useEffect, useState, useCallback } from "react";
import BrandTable from "../../../components/admin/brand/BrandTable";
import Toast from "../../../components/admin/Toast";
import ConfirmModal from "../../../components/admin/DeleteConfirmModal";
import {
    brandService,
    handleApiError,
} from "../../../services/api/brandService";

const BRAND_NAME_REGEX = /^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]*$/;

const Brand = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [brandNameInput, setBrandNameInput] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [editingBrand, setEditingBrand] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false); // ← Thêm để phân biệt thêm mới / chỉnh sửa

    const [filterType, setFilterType] = useState('all');

    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
    };

    const fetchBrands = useCallback(async () => {
        try {
            setLoading(true);
            let res;
            if (filterType === 'all') {
                res = await brandService.getAll();
            } else if (filterType === 'active') {
                res = await brandService.getAll().then(data => data.filter(brand => brand.trangThai));
            } else {
                res = await brandService.getAll().then(data => data.filter(brand => !brand.trangThai));
            }
            setBrands(Array.isArray(res) ? res : []);
        } catch (err) {
            showToast(
                handleApiError(err, "Tải danh sách thương hiệu thất bại"),
                "error"
            );
            setBrands([]);
        } finally {
            setLoading(false);
        }
    }, [filterType]);

    useEffect(() => { fetchBrands(); }, [fetchBrands]);

    // XÓA
    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            setIsDeleting(true);
            await brandService.delete(deleteId);
            showToast("Xóa thương hiệu thành công");
            await fetchBrands();
        } catch (err) {
            showToast(handleApiError(err, "Xóa thương hiệu thất bại"), "error");
        } finally {
            setIsDeleting(false);
            setIsConfirmOpen(false);
            setDeleteId(null);
        }
    };

    // SỬA - mở modal chỉnh sửa
    const handleEditClick = (brand) => {
        setEditingBrand(brand);
        setBrandNameInput(brand.tenThuongHieu || "");
        setIsActive(brand.trangThai ?? true);
        setError("");
        setIsEditMode(true);          // ← Bật chế độ chỉnh sửa
        setIsModalOpen(true);
    };

    // LƯU (THÊM / SỬA)
const handleSave = async (e) => {
    e.preventDefault();

    const nameTrimmed = brandNameInput.trim();
    
    // Kiểm tra lại lần cuối trước khi gửi
    if (!nameTrimmed) {
        return setError("Tên thương hiệu không được để trống");
    }
    if (!BRAND_NAME_REGEX.test(nameTrimmed)) {
        return setError("Tên thương hiệu không được chứa ký tự đặc biệt");
    }
    
    // Nếu có lỗi hiện tại thì không cho submit
    if (error) return;

    try {
        setIsSubmitting(true);

        const data = {
            tenThuongHieu: nameTrimmed,
            ...(isEditMode && { trangThai: isActive }),
        };

        if (editingBrand) {
            await brandService.update(editingBrand.maThuongHieu, data);
            showToast("Cập nhật thương hiệu thành công");
        } else {
            await brandService.create(data);
            showToast("Thêm thương hiệu thành công");
        }

        await fetchBrands();
        setIsModalOpen(false);
        setEditingBrand(null);
        setBrandNameInput("");
        setIsActive(true);
        setIsEditMode(false);
    } catch (err) {
        showToast(handleApiError(err, "Có lỗi xảy ra khi lưu thương hiệu"), "error");
    } finally {
        setIsSubmitting(false);
    }
};

    return (
        <div className="space-y-6">
            <BrandTable
                data={brands}
                loading={loading}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onFilterTypeChange={setFilterType}
                filterType={filterType}
                showToast={showToast}
                onOpenAddModal={() => {
                    setEditingBrand(null);
                    setBrandNameInput("");
                    setIsActive(true);
                    setError("");
                    setIsEditMode(false);     // ← Chế độ thêm mới → không hiện switch
                    setIsModalOpen(true);
                }}
            />

            {/* MODAL THÊM / SỬA */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                        <form onSubmit={handleSave} className="p-6">
                            <h2 className="text-xl font-bold mb-6 text-center">
                                {isEditMode ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}
                            </h2>

                            {/* TÊN */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Tên thương hiệu
                                </label>
                                <input
                                    type="text"
                                    value={brandNameInput}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setBrandNameInput(val);

                                        // Kiểm tra lỗi theo thời gian thực (Real-time validation)
                                        if (!val.trim()) {
                                            setError("Tên thương hiệu không được để trống");
                                        } else if (!BRAND_NAME_REGEX.test(val)) {
                                            setError("Tên không được chứa ký tự đặc biệt");
                                        } else {
                                            setError(""); // Xóa lỗi nếu nhập đúng
                                        }
                                    }}
                                    className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${
                                        error
                                            ? "border-red-500 bg-red-50"
                                            : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                                    }`}
                                    autoFocus
                                />
                                {error && (
                                    <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1">
                                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                        {error}
                                    </p>
                                )}
                            </div>

                            {/* SWITCH CHỈ HIỆN KHI CHỈNH SỬA */}
                            {isEditMode && (
                                <div className="flex items-center gap-4 mt-5">
                                    <button
                                        type="button"
                                        onClick={() => setIsActive(!isActive)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition cursor-pointer ${
                                            isActive ? "bg-green-500" : "bg-gray-300"
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                                isActive ? "translate-x-6" : "translate-x-1"
                                            }`}
                                        />
                                    </button>

                                    <div>
                                        <p className="text-sm font-medium text-gray-800">
                                            Trạng thái hiển thị
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Bật để hiển thị thương hiệu trên website
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* ACTION */}
                            <div className="flex justify-center gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                                >
                                    Đóng
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:bg-blue-300 font-medium cursor-pointer"
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
                message="Bạn có muốn xóa thương hiệu này không?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsConfirmOpen(false)}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default Brand;