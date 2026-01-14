import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Camera, X, ArrowLeft, Plus, AlertCircle, Package, Image, Settings, DollarSign } from 'lucide-react';
import AddCategoryModal from '../../../components/admin/product/AddCategoryModal';
import AddBrandModal from '../../../components/admin/product/AddBrandModal';
import { productService } from '../../../services/api/ProductService';
import { categoryService } from '../../../services/api/categoryService';
import { brandService } from '../../../services/api/brandService';

const InputField = ({ label, value, onChange, type = "text", disabled = false, error = "", placeholder = "" }) => {
  const [touched, setTouched] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        disabled={disabled}
        placeholder={placeholder}
        className={`px-4 py-2.5 rounded-lg text-sm transition-all ${
          error && touched
            ? 'border-2 border-red-500 bg-red-50 focus:ring-0'
            : disabled
            ? 'bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed'
            : 'bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
        }`}
      />
      {error && touched && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
};

const SelectField = ({ label, value, onChange, options, valueKey, labelKey, placeholder, error = "", onAdd }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="flex gap-2">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm transition-all ${
            error
              ? 'border-2 border-red-500 bg-red-50'
              : 'bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
          }`}
        >
          <option value="">{placeholder}</option>
          {options.map(opt => (
            <option key={opt[valueKey]} value={String(opt[valueKey])}>
              {opt[labelKey]}
            </option>
          ))}
        </select>
        {onAdd && (
          <button type="button" onClick={onAdd} className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all">
            <Plus size={18} />
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle size={12} /> {error}</p>}
    </div>
  );
};

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [errors, setErrors] = useState({});
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    tenSanPham: '',
    maDanhMuc: '',
    maThuongHieu: ''
  });

  const [productImages, setProductImages] = useState([]);
  const [variants, setVariants] = useState([{
    id: Math.random().toString(36).substr(2, 9),
    tenBienThe: '',
    giaBan: '',
    giaKhuyenMai: '',
    mauSac: '',
    ram: '',
    oCung: '',
    boXuLyTrungTam: '',
    boXuLyDoHoa: '',
    soLuongTon: 0,
    thongSoKyThuat: {
      kichThuocManHinh: '',
      dungLuongRam: '',
      soKheRam: '',
      oCung: '',
      pin: '',
      heDieuHanh: '',
      doPhanGiaiManHinh: '',
      loaiXuLyTrungTam: '',
      loaiXuLyDoHoa: '',
      congGiaoTiep: ''
    }
  }]);

  const totalStock = useMemo(() => {
    return variants.reduce((sum, v) => sum + (Number(v.soLuongTon) || 0), 0);
  }, [variants]);

  // Fetch categories and brands
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          categoryService.getAll(),
          brandService.getAll()
        ]);
        setCategories(catRes);
        setBrands(brandRes);
      } catch (error) {
        showToast("Không thể tải danh mục/thương hiệu", "error");
        console.error("Error fetching metadata:", error);
      }
    };
    fetchMetadata();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const validateImageFile = (file) => {
    const validExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validExtensions.includes(file.type)) {
      return 'Chỉ chấp nhận file ảnh định dạng JPG, PNG, GIF, WEBP';
    }
    if (file.size > maxSize) {
      return 'Kích thước ảnh không được vượt quá 5MB';
    }
    return null;
  };

  const handleProductImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = [];
    const invalidFiles = [];

    files.forEach(file => {
      const error = validateImageFile(file);
      if (error) {
        invalidFiles.push({ name: file.name, error });
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      showToast(invalidFiles[0].error, 'error');
      return;
    }

    setProductImages(prev => [...prev, ...validFiles]);
    setErrors(prev => ({ ...prev, hinhAnh: '' }));
  };

  const removeProductImage = (index) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleVariantChange = (id, field, value) => {
    setVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const handleVariantSpecChange = (id, field, value) => {
    setVariants(prev => prev.map(v =>
      v.id === id ? { ...v, thongSoKyThuat: { ...v.thongSoKyThuat, [field]: value } } : v
    ));
  };

  const addVariant = () => {
    setVariants(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      tenBienThe: '',
      giaBan: '',
      giaKhuyenMai: '',
      mauSac: '',
      ram: '',
      oCung: '',
      boXuLyTrungTam: '',
      boXuLyDoHoa: '',
      soLuongTon: 0,
      thongSoKyThuat: {
        kichThuocManHinh: '',
        dungLuongRam: '',
        soKheRam: '',
        oCung: '',
        pin: '',
        heDieuHanh: '',
        doPhanGiaiManHinh: '',
        loaiXuLyTrungTam: '',
        loaiXuLyDoHoa: '',
        congGiaoTiep: ''
      }
    }]);
  };

  const removeVariant = (id) => {
    if (variants.length <= 1) {
      showToast("Sản phẩm phải có ít nhất một biến thể", "error");
      return;
    }
    setVariants(prev => prev.filter(v => v.id !== id));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tenSanPham.trim()) newErrors.tenSanPham = "Vui lòng nhập tên sản phẩm";
    if (!formData.maDanhMuc) newErrors.maDanhMuc = "Vui lòng chọn danh mục";
    if (!formData.maThuongHieu) newErrors.maThuongHieu = "Vui lòng chọn thương hiệu";
    if (productImages.length === 0) newErrors.hinhAnh = "Vui lòng thêm ít nhất 1 ảnh";

    variants.forEach((v, index) => {
      if (!v.tenBienThe.trim()) newErrors[`variant_${index}_tenBienThe`] = "Vui lòng nhập tên biến thể";
      if (!v.giaBan || Number(v.giaBan) <= 0) newErrors[`variant_${index}_giaBan`] = "Giá bán phải lớn hơn 0";
      if (v.giaKhuyenMai && Number(v.giaKhuyenMai) >= Number(v.giaBan)) {
        newErrors[`variant_${index}_giaKhuyenMai`] = "Giá KM phải nhỏ hơn giá bán";
      }
    });

    return newErrors;
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast("Vui lòng kiểm tra lại thông tin!", "error");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Thông tin sản phẩm cơ bản
      formDataToSend.append('TenSanPham', formData.tenSanPham.trim());
      formDataToSend.append('MaDanhMuc', formData.maDanhMuc);
      formDataToSend.append('MaThuongHieu', formData.maThuongHieu);
      formDataToSend.append('SoLuongTon', totalStock);

      // Biến thể và thông số kỹ thuật
      variants.forEach((v, index) => {
        formDataToSend.append(`BienThe[${index}].TenBienThe`, v.tenBienThe.trim() || "Đang cập nhật");
        formDataToSend.append(`BienThe[${index}].GiaBan`, Number(v.giaBan) || 0);
        formDataToSend.append(`BienThe[${index}].GiaKhuyenMai`, Number(v.giaKhuyenMai) || 0);
        formDataToSend.append(`BienThe[${index}].MauSac`, v.mauSac || "Đang cập nhật");
        formDataToSend.append(`BienThe[${index}].Ram`, v.ram || "Đang cập nhật");
        formDataToSend.append(`BienThe[${index}].OCung`, v.oCung || "Đang cập nhật");
        formDataToSend.append(`BienThe[${index}].BoXuLyTrungTam`, v.boXuLyTrungTam || "Đang cập nhật");
        formDataToSend.append(`BienThe[${index}].BoXuLyDoHoa`, v.boXuLyDoHoa || "Đang cập nhật");
        formDataToSend.append(`BienThe[${index}].SoLuongTon`, Number(v.soLuongTon) || 0);

        // Thông số kỹ thuật
        const ts = v.thongSoKyThuat;
        formDataToSend.append(`BienThe[${index}].ThongSoKyThuat.KichThuocManHinh`, ts.kichThuocManHinh || "Đang cập nhật");
        formDataToSend.append(`BienThe[${index}].ThongSoKyThuat.DungLuongRam`, ts.dungLuongRam || v.ram || "Đang cập nhật");
        formDataToSend.append(`BienThe[${index}].ThongSoKyThuat.SoKheRam`, ts.soKheRam || "1");
        formDataToSend.append(`BienThe[${index}].ThongSoKyThuat.OCung`, ts.oCung || v.oCung || "Đang cập nhật");
        formDataToSend.append(`BienThe[${index}].ThongSoKyThuat.Pin`, ts.pin || "Đang cập nhật");
        formDataToSend.append(`BienThe[${index}].ThongSoKyThuat.HeDieuHanh`, ts.heDieuHanh || "Đang cập nhật");
        formDataToSend.append(`BienThe[${index}].ThongSoKyThuat.DoPhanGiaiManHinh`, ts.doPhanGiaiManHinh || "Đang cập nhật");
        formDataToSend.append(`BienThe[${index}].ThongSoKyThuat.LoaiXuLyTrungTam`, ts.loaiXuLyTrungTam || v.boXuLyTrungTam || "Đang cập nhật");
        formDataToSend.append(`BienThe[${index}].ThongSoKyThuat.LoaiXuLyDoHoa`, ts.loaiXuLyDoHoa || v.boXuLyDoHoa || "Đang cập nhật");
        formDataToSend.append(`BienThe[${index}].ThongSoKyThuat.CongGiaoTiep`, ts.congGiaoTiep || "Đang cập nhật");
      });

      // Hình ảnh sản phẩm
      productImages.forEach((file) => {
        formDataToSend.append('HinhAnh', file);
      });

      // Gọi API
      await productService.AddProduct(formDataToSend);

      showToast("Thêm sản phẩm thành công!", "success");
      setTimeout(() => navigate('/quan-ly/san-pham'), 1500);
    } catch (error) {
      const errMsg = error.response?.data?.message || "Thêm sản phẩm thất bại";
      showToast(errMsg, "error");
      console.error("Lỗi thêm sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle thêm danh mục mới không reload
  const handleCategoryAdded = async (newCategoryId) => {
    try {
      const catRes = await categoryService.getAll();
      setCategories(catRes);
      if (newCategoryId) {
        setFormData(prev => ({ ...prev, maDanhMuc: String(newCategoryId) }));
      }
      showToast("Thêm danh mục thành công!", "success");
    } catch (error) {
      showToast("Không thể tải lại danh mục", error);
    }
  };

  // Handle thêm thương hiệu mới không reload
  const handleBrandAdded = async (newBrandId) => {
    try {
      const brandRes = await brandService.getAll();
      setBrands(brandRes);
      if (newBrandId) {
        setFormData(prev => ({ ...prev, maThuongHieu: String(newBrandId) }));
      }
      showToast("Thêm thương hiệu thành công!", "success");
    } catch (error) {
      showToast("Không thể tải lại thương hiệu", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                <ArrowLeft size={20} className="text-gray-700" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Thêm Sản Phẩm Mới</h1>
                <p className="text-sm text-gray-500 mt-0.5">Điền đầy đủ thông tin sản phẩm bên dưới</p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-all flex items-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Lưu sản phẩm
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Images */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Image size={20} className="text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Hình Ảnh Sản Phẩm</h2>
              </div>
              
              {errors.hinhAnh && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <AlertCircle size={16} /> {errors.hinhAnh}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-4 gap-4">
                {productImages.map((file, index) => (
                  <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md font-semibold">
                        Ảnh chính
                      </div>
                    )}
                    <button
                      onClick={() => removeProductImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}

                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group">
                  <Camera size={24} className="text-gray-400 group-hover:text-blue-500 mb-2" />
                  <span className="text-xs text-gray-500 group-hover:text-blue-600 font-medium">Thêm ảnh</span>
                  <span className="text-xs text-gray-400 mt-1">JPG, PNG</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleProductImageUpload}
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  />
                </label>
              </div>
            </div>

            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package size={20} className="text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Thông Tin Cơ Bản</h2>
              </div>

              <div className="space-y-4">
                <InputField
                  label="Tên Sản Phẩm *"
                  value={formData.tenSanPham}
                  onChange={(v) => setFormData(prev => ({ ...prev, tenSanPham: v }))}
                  error={errors.tenSanPham}
                  placeholder="VD: Dell XPS 15 9520"
                />

                <div className="grid grid-cols-2 gap-4">
                  <SelectField
                    label="Danh Mục *"
                    value={formData.maDanhMuc}
                    onChange={(v) => setFormData(prev => ({ ...prev, maDanhMuc: v }))}
                    options={categories}
                    valueKey="maDanhMuc"
                    labelKey="tenDanhMuc"
                    placeholder="Chọn danh mục"
                    error={errors.maDanhMuc}
                    onAdd={() => setIsCategoryModalOpen(true)}
                  />
                  <SelectField
                    label="Thương Hiệu *"
                    value={formData.maThuongHieu}
                    onChange={(v) => setFormData(prev => ({ ...prev, maThuongHieu: v }))}
                    options={brands}
                    valueKey="maThuongHieu"
                    labelKey="tenThuongHieu"
                    placeholder="Chọn thương hiệu"
                    error={errors.maThuongHieu}
                    onAdd={() => setIsBrandModalOpen(true)}
                  />
                </div>
              </div>
            </div>

            {/* Variants Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Settings size={20} className="text-blue-600" />
                  <h2 className="text-lg font-bold text-gray-900">Biến Thể Sản Phẩm</h2>
                </div>
                <button
                  onClick={addVariant}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center gap-2 shadow-sm"
                >
                  <Plus size={16} />
                  Thêm biến thể
                </button>
              </div>

              {variants.map((variant, index) => (
                <div key={variant.id} className="border border-gray-200 rounded-lg p-4 mb-4 relative">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-semibold text-gray-800">Biến Thể {index + 1}</h3>
                    {variants.length > 1 && (
                      <button
                        onClick={() => removeVariant(variant.id)}
                        className="text-red-500 hover:text-red-700 transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>

                  {/* Variant Basic Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <InputField
                      label="Tên Biến Thể *"
                      value={variant.tenBienThe}
                      onChange={(v) => handleVariantChange(variant.id, 'tenBienThe', v)}
                      error={errors[`variant_${index}_tenBienThe`]}
                      placeholder="VD: Core i7, 16GB RAM, 512GB SSD"
                    />
                    <InputField
                      label="Giá Bán *"
                      type="number"
                      value={variant.giaBan}
                      onChange={(v) => handleVariantChange(variant.id, 'giaBan', v)}
                      error={errors[`variant_${index}_giaBan`]}
                      placeholder="VD: 20000000"
                    />
                    <InputField
                      label="Giá Khuyến Mãi"
                      type="number"
                      value={variant.giaKhuyenMai}
                      onChange={(v) => handleVariantChange(variant.id, 'giaKhuyenMai', v)}
                      error={errors[`variant_${index}_giaKhuyenMai`]}
                      placeholder="VD: 18000000"
                    />
                    <InputField
                      label="Màu Sắc"
                      value={variant.mauSac}
                      onChange={(v) => handleVariantChange(variant.id, 'mauSac', v)}
                      placeholder="VD: Bạc, Đen"
                    />
                    <InputField
                      label="RAM"
                      value={variant.ram}
                      onChange={(v) => handleVariantChange(variant.id, 'ram', v)}
                      placeholder="VD: 16GB DDR4"
                    />
                    <InputField
                      label="Ổ Cứng"
                      value={variant.oCung}
                      onChange={(v) => handleVariantChange(variant.id, 'oCung', v)}
                      placeholder="VD: 512GB SSD NVMe"
                    />
                    <InputField
                      label="Bộ Xử Lý Trung Tâm"
                      value={variant.boXuLyTrungTam}
                      onChange={(v) => handleVariantChange(variant.id, 'boXuLyTrungTam', v)}
                      placeholder="VD: Intel Core i7-12700H"
                    />
                    <InputField
                      label="Bộ Xử Lý Đồ Họa"
                      value={variant.boXuLyDoHoa}
                      onChange={(v) => handleVariantChange(variant.id, 'boXuLyDoHoa', v)}
                      placeholder="VD: NVIDIA RTX 3060"
                    />
                    <InputField
                      label="Số Lượng Tồn Kho"
                      type="number"
                      value={variant.soLuongTon}
                      onChange={(v) => handleVariantChange(variant.id, 'soLuongTon', v)}
                      placeholder="VD: 100"
                    />
                  </div>

                  {/* Technical Specs Section */}
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-md font-semibold text-gray-800 mb-4">Thông Số Kỹ Thuật</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <InputField
                        label="Kích Thước Màn Hình"
                        value={variant.thongSoKyThuat.kichThuocManHinh}
                        onChange={(v) => handleVariantSpecChange(variant.id, 'kichThuocManHinh', v)}
                        placeholder="VD: 15.6 inch"
                      />
                      <InputField
                        label="Dung Lượng RAM"
                        value={variant.thongSoKyThuat.dungLuongRam}
                        onChange={(v) => handleVariantSpecChange(variant.id, 'dungLuongRam', v)}
                        placeholder="VD: 16GB"
                      />
                      <InputField
                        label="Số Khe RAM"
                        value={variant.thongSoKyThuat.soKheRam}
                        onChange={(v) => handleVariantSpecChange(variant.id, 'soKheRam', v)}
                        placeholder="VD: 2"
                      />
                      <InputField
                        label="Ổ Cứng"
                        value={variant.thongSoKyThuat.oCung}
                        onChange={(v) => handleVariantSpecChange(variant.id, 'oCung', v)}
                        placeholder="VD: 512GB SSD"
                      />
                      <InputField
                        label="Pin"
                        value={variant.thongSoKyThuat.pin}
                        onChange={(v) => handleVariantSpecChange(variant.id, 'pin', v)}
                        placeholder="VD: 56Wh"
                      />
                      <InputField
                        label="Hệ Điều Hành"
                        value={variant.thongSoKyThuat.heDieuHanh}
                        onChange={(v) => handleVariantSpecChange(variant.id, 'heDieuHanh', v)}
                        placeholder="VD: Windows 11 Home"
                      />
                      <InputField
                        label="Độ Phân Giải Màn Hình"
                        value={variant.thongSoKyThuat.doPhanGiaiManHinh}
                        onChange={(v) => handleVariantSpecChange(variant.id, 'doPhanGiaiManHinh', v)}
                        placeholder="VD: 1920x1080 (Full HD)"
                      />
                      <InputField
                        label="Loại Xử Lý Trung Tâm"
                        value={variant.thongSoKyThuat.loaiXuLyTrungTam}
                        onChange={(v) => handleVariantSpecChange(variant.id, 'loaiXuLyTrungTam', v)}
                        placeholder="VD: Intel Core i7"
                      />
                      <InputField
                        label="Loại Xử Lý Đồ Họa"
                        value={variant.thongSoKyThuat.loaiXuLyDoHoa}
                        onChange={(v) => handleVariantSpecChange(variant.id, 'loaiXuLyDoHoa', v)}
                        placeholder="VD: NVIDIA GeForce"
                      />
                      <InputField
                        label="Cổng Giao Tiếp"
                        value={variant.thongSoKyThuat.congGiaoTiep}
                        onChange={(v) => handleVariantSpecChange(variant.id, 'congGiaoTiep', v)}
                        placeholder="VD: USB 3.2, HDMI, Thunderbolt"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign size={20} className="text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Tổng Quan</h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Tổng biến thể:</span>
                  <span className="font-bold text-gray-900">{variants.length}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Tổng số lượng tồn:</span>
                  <span className="font-bold text-blue-600">{totalStock}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Số lượng ảnh:</span>
                  <span className="font-bold text-gray-900">{productImages.length}</span>
                </div>

                <div className="pt-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-xs text-blue-800 leading-relaxed">
                      <strong>Lưu ý:</strong> Ảnh đầu tiên sẽ là ảnh chính của sản phẩm. Chỉ chấp nhận file JPG, PNG, GIF, WEBP với dung lượng tối đa 5MB.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSuccess={handleCategoryAdded}
      />

      <AddBrandModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        onSuccess={handleBrandAdded}
      />

      {/* Toast */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className={`px-6 py-4 rounded-lg shadow-lg border-l-4 ${
            toast.type === 'success' 
              ? 'bg-green-50 border-green-500 text-green-800' 
              : 'bg-red-50 border-red-500 text-red-800'
          }`}>
            <div className="flex items-center gap-3">
              <AlertCircle size={20} />
              <span className="font-medium">{toast.message}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;