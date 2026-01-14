import { useState } from 'react';
import { brandService } from '../../../services/api/brandService';

const AddBrandModal = ({ isOpen, onClose, onSuccess }) => {
  const [brandName, setBrandName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameTrimmed = brandName.trim();
    if (!nameTrimmed) {
      setError('Tên thương hiệu không được để trống.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const response = await brandService.create({ tenThuongHieu: nameTrimmed });

      // Giả sử backend trả về { maThuongHieu, tenThuongHieu }
      const newBrandId = response.maThuongHieu;

      onSuccess(newBrandId);
      setBrandName('');
      setError('');
      onClose();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Có lỗi xảy ra khi thêm thương hiệu.';
      setError(errMsg);
      console.error('Lỗi thêm thương hiệu:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setBrandName('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-xl font-bold mb-5 text-gray-800 text-center">
            Thêm thương hiệu mới
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên thương hiệu
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => {
                setBrandName(e.target.value);
                if (error) setError('');
              }}
              className={`w-full px-4 py-2 border rounded-lg outline-none ${
                error ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-green-500'
              }`}
              placeholder="Nhập tên thương hiệu..."
              autoFocus
              disabled={isSubmitting}
            />
            {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
          </div>

          <div className="flex justify-center gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg disabled:bg-green-300 font-medium hover:bg-green-700 transition-all"
            >
              {isSubmitting ? 'Đang lưu...' : 'Thêm thương hiệu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBrandModal;