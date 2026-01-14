import { useState } from "react";
import { categoryService } from "../../../services/api/categoryService";

const AddCategoryModal = ({ isOpen, onClose, onSuccess }) => {
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameTrimmed = categoryName.trim();
    if (!nameTrimmed) {
      setError("Tên danh mục không được để trống.");
      return;
    }

    try {
      setIsSubmitting(true);
      const createdCategory = await categoryService.create({
        tenDanhMuc: nameTrimmed,
      });
      if (!createdCategory?.maDanhMuc) {
        throw new Error("Dữ liệu danh mục không hợp lệ");
      }
      onSuccess(createdCategory);

      setCategoryName("");
      setError("");
      onClose();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Có lỗi xảy ra khi thêm danh mục."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCategoryName("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-xl font-bold mb-5 text-center">
            Thêm danh mục mới
          </h2>

          <div className="mb-4">
            <label className="text-sm font-medium">Tên danh mục</label>
            <input
              autoFocus
              value={categoryName}
              onChange={(e) => {
                setCategoryName(e.target.value);
                if (error) setError("");
              }}
              className={`w-full px-4 py-2 border rounded-lg ${
                error
                  ? "border-red-500"
                  : "border-gray-300 focus:ring-2 focus:ring-green-500"
              }`}
            />
            {error && (
              <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>
            )}
          </div>

          <div className="flex justify-center gap-3 mt-6">
            <button type="button" onClick={handleClose} 
            className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg cursor-pointer">
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg cursor-pointer"
            >
              {isSubmitting ? "Đang lưu..." : "Thêm danh mục"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
