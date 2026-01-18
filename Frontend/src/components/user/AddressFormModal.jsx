import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import addressService from '../../services/api/addressService';

const AddressFormModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = {},
  isEditing = false,
  editingAddressId,
}) => {
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: initialData.name || '',
    phone: initialData.phone || '',
    province: initialData.province || '',
    ward: initialData.ward || '',
    detail: initialData.detail || '',
  });

  const [setAsDefault, setSetAsDefault] = useState(initialData.diaChiMacDinh || false);

  // Reset form khi modal mở
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: initialData.name || '',
        phone: initialData.phone || '',
        province: initialData.province || '',
        ward: initialData.ward || '',
        detail: initialData.detail || '',
      });
      setSetAsDefault(initialData.diaChiMacDinh || false);
      setError(null);
    }
  }, [isOpen, initialData]);

  // Fetch provinces
  useEffect(() => {
    if (!isOpen) return;

    const fetchProvinces = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await addressService.getProvinces(true);
        setProvinces(data || []);
      } catch (err) {
        setError(err.message || 'Không tải được danh sách tỉnh/thành');
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, [isOpen]);

  // Load wards khi chọn tỉnh
  useEffect(() => {
    if (!formData.province) {
      setWards([]);
      return;
    }

    const selectedProvince = provinces.find((p) => p.name === formData.province);
    setWards(selectedProvince?.wards || []);
  }, [formData.province, provinces]);

  const provinceOptions = provinces.map((p) => ({ value: p.name, label: p.name }));
  const wardOptions = wards.map((w) => ({ value: w.name, label: w.name }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name) => (selected) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selected ? selected.value : '',
      ...(name === 'province' ? { ward: '' } : {}),
    }));
  };

  const handleSubmit = async () => {
    const trimmed = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      province: formData.province.trim(),
      ward: formData.ward.trim(),
      detail: formData.detail.trim(),
    };

    // Validation
    if (!trimmed.name) return alert('Vui lòng nhập Họ và tên');
    if (!trimmed.phone) return alert('Vui lòng nhập Số điện thoại');
    if (!trimmed.province) return alert('Vui lòng chọn Tỉnh/Thành phố');
    if (!trimmed.ward) return alert('Vui lòng chọn Phường/Xã');
    if (!trimmed.detail) return alert('Vui lòng nhập Địa chỉ chi tiết');

    if (!/^0[1-9]\d{8,9}$/.test(trimmed.phone)) {
      return alert('Số điện thoại không hợp lệ (ví dụ: 0909123456)');
    }

    setSubmitLoading(true);
    setError(null);

    try {
      const payload = {
        tenNguoiNhan: trimmed.name,
        soDienThoai: trimmed.phone,
        diaChi: trimmed.detail,
        phuongXa: trimmed.ward,
        tinhThanh: trimmed.province,
      };

      let addressId;

      if (isEditing) {
        if (!editingAddressId) {
          throw new Error("Không tìm thấy ID địa chỉ để cập nhật");
        }
        await addressService.updateAddress(editingAddressId, payload);
        addressId = editingAddressId;
      } else {
        const created = await addressService.createAddress(payload);
        addressId = created.maDiaChiNhanHang; // giả sử API trả về object có maDiaChiNhanHang
      }

      // Nếu người dùng muốn đặt làm mặc định → gọi API set default
      if (setAsDefault) {
        await addressService.setDefaultAddress(addressId);
      }

      onSave();
      onClose();
    } catch (err) {
      let errorMsg = err.message || 'Lưu địa chỉ thất bại';
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.response?.data?.errors) {
        errorMsg = Object.values(err.response.data.errors).flat().join('\n');
      }
      setError(errorMsg);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-7 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm whitespace-pre-line">{error}</p>
          </div>
        )}

        {loading && (
          <div className="mb-5 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
            <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <p className="text-blue-600 text-sm">Đang tải dữ liệu tỉnh/thành...</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              placeholder="Nhập họ và tên"
              value={formData.name}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
              disabled={submitLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              name="phone"
              placeholder="Nhập số điện thoại"
              value={formData.phone}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
              disabled={submitLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tỉnh / Thành phố <span className="text-red-500">*</span>
            </label>
            <Select
              options={provinceOptions}
              placeholder="Chọn Tỉnh / Thành phố"
              value={provinceOptions.find((opt) => opt.value === formData.province) || null}
              onChange={handleSelectChange('province')}
              isSearchable
              isClearable
              isDisabled={loading || submitLoading}
              classNamePrefix="select"
              styles={{
                control: (base) => ({
                  ...base,
                  height: '48px',
                  borderRadius: '0.5rem',
                  borderColor: '#d1d5db',
                  boxShadow: 'none',
                  '&:hover': { borderColor: '#9ca3af' },
                }),
                menu: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Phường / Xã <span className="text-red-500">*</span>
            </label>
            <Select
              options={wardOptions}
              placeholder="Chọn Phường / Xã"
              value={wardOptions.find((opt) => opt.value === formData.ward) || null}
              onChange={handleSelectChange('ward')}
              isSearchable
              isClearable
              isDisabled={loading || !formData.province || wards.length === 0 || submitLoading}
              classNamePrefix="select"
              styles={{
                control: (base) => ({
                  ...base,
                  height: '48px',
                  borderRadius: '0.5rem',
                  borderColor: '#d1d5db',
                  boxShadow: 'none',
                  '&:hover': { borderColor: '#9ca3af' },
                }),
                menu: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Địa chỉ chi tiết <span className="text-red-500">*</span>
            </label>
            <input
              name="detail"
              placeholder="Số nhà, tên đường..."
              value={formData.detail}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
              disabled={submitLoading}
            />
          </div>

          {/* Checkbox luôn hiển thị */}
          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                id="setDefault"
                checked={setAsDefault}
                onChange={(e) => setSetAsDefault(e.target.checked)}
                className="w-5 h-5 accent-teal-600 cursor-pointer rounded"
                disabled={submitLoading}
              />
              <span className="text-gray-700 font-medium">
                Đặt làm địa chỉ mặc định
              </span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 mt-7">
          <button
            onClick={onClose}
            disabled={submitLoading}
            className="flex-1 py-3 px-6 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              submitLoading ||
              !formData.name.trim() ||
              !formData.phone.trim() ||
              !formData.province.trim() ||
              !formData.ward.trim() ||
              !formData.detail.trim()
            }
            className="flex-1 py-3 px-6 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 transition flex items-center justify-center gap-2 shadow-md"
          >
            {submitLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Đang lưu...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                {isEditing ? 'Cập nhật' : 'Lưu địa chỉ'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressFormModal;