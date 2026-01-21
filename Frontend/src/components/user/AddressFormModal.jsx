import React, { useEffect, useState } from "react";
import Select from "react-select";
import addressService from "../../services/api/addressService";

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

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: initialData.name || "",
    phone: initialData.phone || "",
    province: initialData.province || "",
    ward: initialData.ward || "",
    detail: initialData.detail || "",
  });

  const [setAsDefault, setSetAsDefault] = useState(
    initialData.diaChiMacDinh || false
  );

  /* ================= RESET FORM ================= */
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: initialData.name || "",
        phone: initialData.phone || "",
        province: initialData.province || "",
        ward: initialData.ward || "",
        detail: initialData.detail || "",
      });
      setSetAsDefault(initialData.diaChiMacDinh || false);
      setErrors({});
      setError(null);
    }
  }, [isOpen, initialData]);

  /* ================= FETCH PROVINCES ================= */
  useEffect(() => {
    if (!isOpen) return;

    const fetchProvinces = async () => {
      setLoading(true);
      try {
        const data = await addressService.getProvinces(true);
        setProvinces(data || []);
      } catch (err) {
        setError(err.message || "Không tải được danh sách tỉnh/thành"); 
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, [isOpen]);

  /* ================= LOAD WARDS ================= */
  useEffect(() => {
    if (!formData.province) {
      setWards([]);
      return;
    }

    const selectedProvince = provinces.find(
      (p) => p.name === formData.province
    );
    setWards(selectedProvince?.wards || []);
  }, [formData.province, provinces]);

  const provinceOptions = provinces.map((p) => ({
    value: p.name,
    label: p.name,
  }));
  const wardOptions = wards.map((w) => ({
    value: w.name,
    label: w.name,
  }));

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    let { name, value } = e.target;

    // Họ tên: không số, không ký tự đặc biệt
    if (name === "name") {
      value = value.replace(/[^A-Za-zÀ-ỹ\s]/g, "").slice(0, 100);
    }

    // SĐT: chỉ số, tối đa 10
    if (name === "phone") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name) => (selected) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selected ? selected.value : "",
      ...(name === "province" ? { ward: "" } : {}),
    }));
  };

  /* ================= VALIDATE ================= */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập họ và tên";
    }

    if (!formData.phone) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (formData.phone.length !== 10) {
      newErrors.phone = "Số điện thoại phải đủ 10 số";
    }

    if (!formData.province) {
      newErrors.province = "Vui lòng chọn Tỉnh/Thành phố";
    }

    if (!formData.ward) {
      newErrors.ward = "Vui lòng chọn Phường/Xã";
    }

    if (!formData.detail.trim()) {
      newErrors.detail = "Vui lòng nhập địa chỉ chi tiết";
    }

    return newErrors;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    setErrors({});
    setError(null);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitLoading(true);
    try {
      const payload = {
        tenNguoiNhan: formData.name.trim(),
        soDienThoai: formData.phone,
        diaChi: formData.detail.trim(),
        phuongXa: formData.ward,
        tinhThanh: formData.province,
      };

      let addressId;

      if (isEditing) {
        if (!editingAddressId) {
          throw new Error("Không tìm thấy ID địa chỉ");
        }
        await addressService.updateAddress(editingAddressId, payload);
        addressId = editingAddressId;
      } else {
        const created = await addressService.createAddress(payload);
        addressId = created.maDiaChiNhanHang;
      }

      if (setAsDefault) {
        await addressService.setDefaultAddress(addressId);
      }

      onSave();
      onClose();
    } catch (err) {
      let msg = err.message || "Lưu địa chỉ thất bại";
      if (err.response?.data?.message) msg = err.response.data.message;
      setError(msg);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-7 w-full max-w-md shadow-2xl">
        <h3 className="text-2xl font-bold mb-5">
          {isEditing ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
        </h3>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Họ tên */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Họ và tên *
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full h-12 px-4 rounded-lg border ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* SĐT */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Số điện thoại *
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              inputMode="numeric"
              className={`w-full h-12 px-4 rounded-lg border ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Province */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Tỉnh / Thành phố *
            </label>
            <Select
              options={provinceOptions}
              value={provinceOptions.find(
                (o) => o.value === formData.province
              )}
              onChange={handleSelectChange("province")}
              isClearable
            />
            {errors.province && (
              <p className="text-red-500 text-xs mt-1">{errors.province}</p>
            )}
          </div>

          {/* Ward */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Phường / Xã *
            </label>
            <Select
              options={wardOptions}
              value={wardOptions.find((o) => o.value === formData.ward)}
              onChange={handleSelectChange("ward")}
              isClearable
              isDisabled={!formData.province}
            />
            {errors.ward && (
              <p className="text-red-500 text-xs mt-1">{errors.ward}</p>
            )}
          </div>

          {/* Detail */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Địa chỉ chi tiết *
            </label>
            <input
              name="detail"
              value={formData.detail}
              onChange={handleChange}
              className={`w-full h-12 px-4 rounded-lg border ${
                errors.detail ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.detail && (
              <p className="text-red-500 text-xs mt-1">{errors.detail}</p>
            )}
          </div>

          {/* Default */}
          <label className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              checked={setAsDefault}
              onChange={(e) => setSetAsDefault(e.target.checked)}
              className="w-5 h-5 accent-teal-600"
            />
            Đặt làm địa chỉ mặc định
          </label>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 border rounded-xl"
          >
            Huỷ
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitLoading}
            className="flex-1 py-3 bg-teal-600 text-white rounded-xl font-semibold disabled:opacity-50"
          >
            {submitLoading ? "Đang lưu..." : "Lưu địa chỉ"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressFormModal;
