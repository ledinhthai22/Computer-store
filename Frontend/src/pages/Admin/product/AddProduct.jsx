import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trash2,
  Camera,
  X,
  ArrowLeft,
  Plus,
  AlertCircle,
  Package,
  Image as ImageIcon,
  Settings,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react';
import AddCategoryModal from '../../../components/admin/product/AddCategoryModal';
import AddBrandModal from '../../../components/admin/product/AddBrandModal';
import { productService } from '../../../services/api/productService';
import { categoryService } from '../../../services/api/categoryService';
import { brandService } from '../../../services/api/brandService';

const InputField = ({ label, value, onChange, type = "text", disabled, placeholder, error, min, step }) => (
  <div className="flex flex-col gap-1.5 w-full text-left">
    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{label}</label>
    <input
      type={type}
      value={value ?? ''}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      min={min}
      step={step}
      className={`w-full px-4 py-2.5 rounded-xl outline-none transition-all duration-200 border ${
        error
          ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
          : disabled
          ? 'bg-gray-50 text-gray-400 border-transparent cursor-not-allowed'
          : 'bg-white border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-gray-900 shadow-sm'
      }`}
    />
    {error && (
      <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
        <AlertCircle size={12} /> {error}
      </p>
    )}
  </div>
);

const SelectField = ({ label, value, onChange, options, valueKey, labelKey, placeholder, error = "", onAdd }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{label}</label>
    <div className="flex gap-2">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`flex-1 px-4 py-3 rounded-xl text-base transition-all outline-none ${
          error 
            ? 'border-2 border-red-500 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
            : 'bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt[valueKey]} value={String(opt[valueKey])}>
            {opt[labelKey]}
          </option>
        ))}
      </select>
      {onAdd && (
        <button 
          type="button" 
          onClick={onAdd} 
          className="px-3 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-sm"
        >
          <Plus size={20} />
        </button>
      )}
    </div>
    {error && (
      <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
        <AlertCircle size={12} /> {error}
      </p>
    )}
  </div>
);

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState('');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    tenSanPham: '',
    maDanhMuc: '',
    maThuongHieu: '',
  });

  const [productImages, setProductImages] = useState([]);

  const [variants, setVariants] = useState([
    {
      id: Math.random().toString(36).substr(2, 9),
      tenBienThe: '',
      giaBan: '',
      phanTramGiam: '',
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
        congGiaoTiep: '',
      },
    },
  ]);

  const [openVariant, setOpenVariant] = useState({});

  const totalStock = useMemo(() => {
    return variants.reduce((sum, v) => sum + (Number(v.soLuongTon) || 0), 0);
  }, [variants]);

  const currentImageCount = productImages.filter(img => img !== null).length;

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([categoryService.getAll(), brandService.getAll()]);
        setCategories(catRes);
        setBrands(brandRes);
      } catch (error) {
        showToast('Không thể tải danh mục/thương hiệu', 'error');
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    return () => {
      productImages.forEach(img => {
        if (img?.preview) URL.revokeObjectURL(img.preview);
      });
    };
  }, [productImages]);

  const showToast = (message, type = 'success', duration = 4000) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), duration);
  };

  const validateImageFile = (file) => {
    const valid = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;
    if (!valid.includes(file.type)) return 'Chỉ chấp nhận JPG, PNG, GIF, WEBP';
    if (file.size > maxSize) return 'Ảnh không được vượt quá 5MB';
    return null;
  };

  const isValidColorName = (value) => {
    return /^[\p{L}\s-]+$/u.test(value.trim()) || value === '';
  };

  const isValidInteger = (value) => {
    return value === '' || (/^\d+$/.test(value) && Number(value) >= 0);
  };

  const handleAddOrReplaceImage = (file, targetIndex = null) => {
    const err = validateImageFile(file);
    if (err) {
      showToast(err, 'error');
      return;
    }

    const newImg = {
      id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      file,
      preview: URL.createObjectURL(file),
      isNew: true,
    };

    setProductImages(prev => {
      if (targetIndex !== null) {
        const updated = [...prev];
        if (updated[targetIndex]?.preview) URL.revokeObjectURL(updated[targetIndex].preview);
        updated[targetIndex] = newImg;
        return updated;
      }
      if (prev.length >= 10) {
        showToast('Đã đạt tối đa 10 ảnh!', 'error');
        setImageError('Đã đạt tối đa 10 ảnh');
        return prev;
      }
      return [...prev, newImg];
    });

    setErrors(prev => ({ ...prev, hinhAnh: '' }));
    setImageError('');
  };

  const handleProductImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (currentImageCount + files.length > 10) {
      showToast(`Chỉ có thể thêm tối đa ${10 - currentImageCount} ảnh nữa`, 'error');
      setImageError(`Tối đa 10 ảnh (đã có ${currentImageCount}/10)`);
      return;
    }

    files.forEach(file => handleAddOrReplaceImage(file));
    e.target.value = '';
  };

  const handleReplaceImage = (e, index) => {
    const file = e.target.files?.[0];
    if (file) handleAddOrReplaceImage(file, index);
    e.target.value = '';
  };

  const removeProductImage = (index) => {
    setProductImages(prev => {
      const imgToRemove = prev[index];
      if (imgToRemove?.preview) URL.revokeObjectURL(imgToRemove.preview);
      return prev.filter((_, i) => i !== index);
    });
    setImageError('');
  };

  const handleVariantChange = (id, field, value) => {
    const variantIndex = variants.findIndex(v => v.id === id);

    // Validate các trường số nguyên không âm
    if (['giaBan', 'phanTramGiam', 'soLuongTon'].includes(field)) {
      if (value !== '' && !isValidInteger(value)) {
        let msg = '';
        if (field === 'giaBan') msg = 'Giá bán chỉ được nhập số nguyên không âm';
        else if (field === 'phanTramGiam') msg = 'Phần trăm giảm chỉ được nhập số nguyên từ 0-100';
        else if (field === 'soLuongTon') msg = 'Số lượng chỉ được nhập số nguyên không âm';
        showToast(msg, 'error', 3000);
        return;
      }
      if (field === 'phanTramGiam' && value !== '' && (Number(value) > 100)) {
        showToast('Phần trăm giảm phải từ 0 đến 100', 'error', 3000);
        return;
      }
    }

    // Validate màu sắc
    if (field === 'mauSac') {
      if (value !== '' && !isValidColorName(value)) {
        showToast('Màu sắc chỉ được chứa chữ cái, khoảng trắng và gạch nối (-)', 'error', 3000);
        return;
      }
    }

    setVariants(prev =>
      prev.map(v => {
        if (v.id !== id) return v;

        let updated = { ...v, [field]: value };

        if (field === 'giaBan' || field === 'phanTramGiam') {
          const giaBan = Number(updated.giaBan) || 0;
          const phanTram = Number(updated.phanTramGiam) || 0;
          if (giaBan > 0 && phanTram > 0 && phanTram <= 100) {
            updated.giaKhuyenMai = Math.round(giaBan * (1 - phanTram / 100));
          } else {
            updated.giaKhuyenMai = '';
          }
        }

        return updated;
      })
    );

    setErrors(prev => {
      const key = `variant_${variantIndex}_${field}`;
      if (prev[key]) {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      }
      return prev;
    });
  };

  const handleVariantSpecChange = (id, field, value) => {
    // Validate riêng cho soKheRam
    if (field === 'soKheRam') {
      if (value !== '' && !isValidInteger(value)) {
        showToast('Số khe RAM chỉ được nhập số nguyên không âm (ví dụ: 1, 2, 4)', 'error', 3000);
        return;
      }
    }

    setVariants(prev =>
      prev.map(v =>
        v.id === id ? { ...v, thongSoKyThuat: { ...v.thongSoKyThuat, [field]: value } } : v
      )
    );
  };

  const addVariant = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setVariants(prev => [
      ...prev,
      {
        id: newId,
        tenBienThe: '',
        giaBan: '',
        phanTramGiam: '',
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
          congGiaoTiep: '',
        },
      },
    ]);
    setOpenVariant(prev => ({ ...prev, [newId]: true }));
  };

  const removeVariant = (id) => {
    if (variants.length <= 1) {
      showToast('Sản phẩm phải có ít nhất một biến thể', 'error');
      return;
    }
    setVariants(prev => prev.filter(v => v.id !== id));
    setOpenVariant(prev => {
      const newOpen = { ...prev };
      delete newOpen[id];
      return newOpen;
    });
  };

  const toggleVariant = (id) => {
    setOpenVariant(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tenSanPham.trim()) newErrors.tenSanPham = 'Vui lòng nhập tên sản phẩm';
    if (!formData.maDanhMuc) newErrors.maDanhMuc = 'Vui lòng chọn danh mục';
    if (!formData.maThuongHieu) newErrors.maThuongHieu = 'Vui lòng chọn thương hiệu';

    if (currentImageCount === 0) newErrors.hinhAnh = 'Vui lòng thêm ít nhất 1 ảnh';

    variants.forEach((v, index) => {
      if (!v.tenBienThe.trim()) newErrors[`variant_${index}_tenBienThe`] = `Tên biến thể ${index + 1} không được để trống`;
      
      const giaBanNum = Number(v.giaBan);
      if (!v.giaBan || giaBanNum <= 0 || !Number.isInteger(giaBanNum)) {
        newErrors[`variant_${index}_giaBan`] = `Giá bán biến thể ${index + 1} phải là số nguyên lớn hơn 0`;
      }

      const phanTram = Number(v.phanTramGiam);
      if (v.phanTramGiam !== '' && (phanTram < 0 || phanTram > 100 || !Number.isInteger(phanTram))) {
        newErrors[`variant_${index}_phanTramGiam`] = `Phần trăm giảm biến thể ${index + 1} phải là số nguyên từ 0-100`;
      }

      if (v.mauSac && !isValidColorName(v.mauSac)) {
        newErrors[`variant_${index}_mauSac`] = `Màu sắc biến thể ${index + 1} chứa ký tự không hợp lệ`;
      }

      const soLuong = Number(v.soLuongTon);
      if (!v.soLuongTon || soLuong < 0 || !Number.isInteger(soLuong)) {
        newErrors[`variant_${index}_soLuongTon`] = `Số lượng  biến thể ${index + 1} phải là số nguyên không âm`;
      }

      const soKheRam = v.thongSoKyThuat.soKheRam;
      if (soKheRam !== '' && (!isValidInteger(soKheRam) || !Number.isInteger(Number(soKheRam)))) {
        newErrors[`variant_${index}_soKheRam`] = `Số khe RAM biến thể ${index + 1} phải là số nguyên không âm`;
      }

      if (v.giaKhuyenMai && Number(v.giaKhuyenMai) >= giaBanNum) {
        newErrors[`variant_${index}_giaKhuyenMai`] = `Giá khuyến mãi biến thể ${index + 1} phải nhỏ hơn giá bán`;
      }
    });

    return newErrors;
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      const errorList = Object.values(validationErrors);
      const toastMsg = errorList.length > 1 
        ? `${errorList[0]} (và ${errorList.length - 1} lỗi khác)`
        : errorList[0] || 'Vui lòng kiểm tra lại các trường bắt buộc';

      showToast(toastMsg, 'error', 5000);

      const firstError = document.querySelector('[class*="border-red"]');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();

      formDataToSend.append('TenSanPham', formData.tenSanPham.trim());
      formDataToSend.append('MaDanhMuc', formData.maDanhMuc);
      formDataToSend.append('MaThuongHieu', formData.maThuongHieu);
      formDataToSend.append('SoLuongTon', totalStock);

      variants.forEach((v, index) => {
        formDataToSend.append(`BienThe[${index}].TenBienThe`, v.tenBienThe.trim() || 'Đang cập nhật');
        formDataToSend.append(`BienThe[${index}].GiaBan`, Number(v.giaBan) || 0);
        formDataToSend.append(`BienThe[${index}].GiaKhuyenMai`, Number(v.giaKhuyenMai) || 0);
        formDataToSend.append(`BienThe[${index}].MauSac`, v.mauSac || 'Đang cập nhật');
        formDataToSend.append(`BienThe[${index}].Ram`, v.ram || 'Đang cập nhật');
        formDataToSend.append(`BienThe[${index}].OCung`, v.oCung || 'Đang cập nhật');
        formDataToSend.append(`BienThe[${index}].BoXuLyTrungTam`, v.boXuLyTrungTam || 'Đang cập nhật');
        formDataToSend.append(`BienThe[${index}].BoXuLyDoHoa`, v.boXuLyDoHoa || 'Đang cập nhật');
        formDataToSend.append(`BienThe[${index}].SoLuongTon`, Number(v.soLuongTon) || 0);

        const ts = v.thongSoKyThuat;
        formDataToSend.append(`BienThe[${index}].ThongSoKyThuat.KichThuocManHinh`, ts.kichThuocManHinh || 'Đang cập nhật');
        formDataToSend.append(`BienThe[${index}].ThongSoKyThuat.DungLuongRam`, ts.dungLuongRam || v.ram || 'Đang cập nhật');
        formDataToSend.append(`BienThe[${index}].ThongSoKyThuat.SoKheRam`, ts.soKheRam || '1');
        formDataToSend.append(`BienThe[${index}].ThongSoKyThuat.OCung`, ts.oCung || v.oCung || 'Đang cập nhật');
        formDataToSend.append(`BienThe[${index}].ThongSoKyThuat.Pin`, ts.pin || 'Đang cập nhật');
        formDataToSend.append(`BienThe[${index}].ThongSoKyThuat.HeDieuHanh`, ts.heDieuHanh || 'Đang cập nhật');
        formDataToSend.append(`BienThe[${index}].ThongSoKyThuat.DoPhanGiaiManHinh`, ts.doPhanGiaiManHinh || 'Đang cập nhật');
        formDataToSend.append(`BienThe[${index}].ThongSoKyThuat.LoaiXuLyTrungTam`, ts.loaiXuLyTrungTam || v.boXuLyTrungTam || 'Đang cập nhật');
        formDataToSend.append(`BienThe[${index}].ThongSoKyThuat.LoaiXuLyDoHoa`, ts.loaiXuLyDoHoa || v.boXuLyDoHoa || 'Đang cập nhật');
        formDataToSend.append(`BienThe[${index}].ThongSoKyThuat.CongGiaoTiep`, ts.congGiaoTiep || 'Đang cập nhật');
      });

      productImages.forEach(img => {
        if (img?.file) formDataToSend.append('HinhAnh', img.file);
      });

      await productService.AddProduct(formDataToSend);

      showToast('Thêm sản phẩm thành công!', 'success');
      setTimeout(() => navigate('/quan-ly/san-pham'), 1500);
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Thêm sản phẩm thất bại. Vui lòng thử lại.';
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryAdded = async (newCategoryId) => {
    try {
      const catRes = await categoryService.getAll();
      setCategories(catRes);
      if (newCategoryId) setFormData(prev => ({ ...prev, maDanhMuc: String(newCategoryId) }));
      showToast('Thêm danh mục thành công!', 'success');
    } catch {
      showToast('Không thể tải lại danh mục', 'error');
    }
  };

  const handleBrandAdded = async (newBrandId) => {
    try {
      const brandRes = await brandService.getAll();
      setBrands(brandRes);
      if (newBrandId) setFormData(prev => ({ ...prev, maThuongHieu: String(newBrandId) }));
      showToast('Thêm thương hiệu thành công!', 'success');
    } catch {
      showToast('Không thể tải lại thương hiệu', 'error');
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
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm"
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

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Hình ảnh */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ImageIcon size={20} className="text-blue-600" />
                  <h2 className="text-lg font-bold text-gray-900">Hình Ảnh Sản Phẩm</h2>
                </div>
                <span className={`text-sm font-medium ${currentImageCount === 0 ? 'text-red-600' : 'text-gray-600'}`}>
                  {currentImageCount}/10
                </span>
              </div>

              {errors.hinhAnh && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <AlertCircle size={16} /> {errors.hinhAnh}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-4 gap-4">
                {productImages.map((imgObj, index) => (
                  <div
                    key={imgObj?.id || `slot-${index}`}
                    className={`relative group aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      imgObj ? 'border-gray-200 hover:border-blue-500' : 'border-dashed border-gray-300 hover:border-blue-500 bg-gray-50'
                    }`}
                  >
                    {imgObj ? (
                      <>
                        <img src={imgObj.preview} alt={`Ảnh ${index + 1}`} className="w-full h-full object-cover" />
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md font-semibold shadow-sm">
                            Ảnh chính
                          </div>
                        )}
                        <button
                          onClick={() => removeProductImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                        >
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors text-gray-400 hover:text-blue-500">
                        <Camera size={24} className="mb-2" />
                        <span className="text-xs font-medium">Thay ảnh</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleReplaceImage(e, index)} />
                      </label>
                    )}
                  </div>
                ))}

                {currentImageCount < 10 && (
                  <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group">
                    <Camera size={24} className="text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
                    <span className="text-xs text-gray-500 group-hover:text-blue-600 font-medium transition-colors">Thêm ảnh</span>
                    <input type="file" className="hidden" multiple accept="image/*" onChange={handleProductImageUpload} />
                  </label>
                )}
              </div>

              {imageError && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-3">
                  <AlertCircle size={14} /> {imageError}
                </p>
              )}
            </div>

            {/* Thông tin cơ bản */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package size={20} className="text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Thông Tin Cơ Bản</h2>
              </div>
              <div className="space-y-6">
                <InputField
                  label="Tên sản phẩm *"
                  value={formData.tenSanPham}
                  onChange={(v) => {
                    setFormData(prev => ({ ...prev, tenSanPham: v }));
                    setErrors(prev => ({ ...prev, tenSanPham: '' }));
                  }}
                  error={errors.tenSanPham}
                  placeholder="VD: Dell XPS 15 9520"
                />
                <div className="grid grid-cols-2 gap-4">
                  <SelectField
                    label="Danh mục *"
                    value={formData.maDanhMuc}
                    onChange={(v) => {
                      setFormData(prev => ({ ...prev, maDanhMuc: v }));
                      setErrors(prev => ({ ...prev, maDanhMuc: '' }));
                    }}
                    options={categories}
                    valueKey="maDanhMuc"
                    labelKey="tenDanhMuc"
                    placeholder="Chọn danh mục"
                    error={errors.maDanhMuc}
                    onAdd={() => setIsCategoryModalOpen(true)}
                  />
                  <SelectField
                    label="Thương hiệu *"
                    value={formData.maThuongHieu}
                    onChange={(v) => {
                      setFormData(prev => ({ ...prev, maThuongHieu: v }));
                      setErrors(prev => ({ ...prev, maThuongHieu: '' }));
                    }}
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

            {/* Biến thể */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Settings size={20} className="text-blue-600" />
                  <h2 className="text-lg font-bold text-gray-900">Biến Thể Sản Phẩm</h2>
                </div>
                <button
                  onClick={addVariant}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center gap-2 shadow-sm"
                >
                  <Plus size={16} /> Thêm biến thể
                </button>
              </div>

              {variants.map((variant, index) => {
                const isOpen = openVariant[variant.id];
                const giaBanNum = Number(variant.giaBan) || 0;
                const phanTramNum = Number(variant.phanTramGiam) || 0;
                const giaKM = (giaBanNum > 0 && phanTramNum > 0 && phanTramNum <= 100)
                  ? Math.round(giaBanNum * (1 - phanTramNum / 100)).toLocaleString('vi-VN')
                  : '';

                return (
                  <div key={variant.id} className="border border-gray-200 rounded-2xl mb-6 overflow-hidden shadow-sm">
                    <div
                      className="p-4 bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => toggleVariant(variant.id)}
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </span>
                        <div>
                          <h3 className="font-bold text-gray-800">
                            Biến thể {index + 1} {variant.tenBienThe && `- ${variant.tenBienThe}`}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {variant.mauSac || '—'} • {variant.ram || '—'} • {variant.oCung || '—'} • {variant.soLuongTon || 0} sp
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {variants.length > 1 && (
                          <button
                            onClick={(e) => { e.stopPropagation(); removeVariant(variant.id); }}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        )}
                        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>

                    {isOpen && (
                      <div className="p-6 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <InputField
                            label="Tên biến thể *"
                            value={variant.tenBienThe}
                            onChange={(v) => handleVariantChange(variant.id, 'tenBienThe', v)}
                            error={errors[`variant_${index}_tenBienThe`]}
                            placeholder="VD: Core i7, 16GB RAM"
                          />
                          <InputField
                            label="Giá bán (VNĐ) *"
                            type="number"
                            min="1"
                            step="1"
                            value={variant.giaBan}
                            onChange={(v) => handleVariantChange(variant.id, 'giaBan', v)}
                            error={errors[`variant_${index}_giaBan`]}
                            placeholder="10000000"
                          />
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                              Phần trăm giảm (%)
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="1"
                              value={variant.phanTramGiam ?? ''}
                              onChange={(e) => handleVariantChange(variant.id, 'phanTramGiam', e.target.value)}
                              placeholder="0 - 100"
                              className={`w-full px-4 py-2.5 rounded-xl outline-none transition-all duration-200 border ${
                                errors[`variant_${index}_phanTramGiam`] ? 'border-red-500 bg-red-50' : 'bg-white border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                              }`}
                            />
                            {errors[`variant_${index}_phanTramGiam`] && (
                              <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                                <AlertCircle size={12} /> {errors[`variant_${index}_phanTramGiam`]}
                              </p>
                            )}
                            {giaKM && (
                              <p className="text-sm text-green-600 mt-1 font-medium">
                                Giá KM: <strong>{giaKM} ₫</strong>
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <InputField
                            label="Màu sắc"
                            value={variant.mauSac}
                            onChange={(v) => handleVariantChange(variant.id, 'mauSac', v)}
                            error={errors[`variant_${index}_mauSac`]}
                            placeholder="VD: Đen, Xám bạc"
                          />
                          <InputField label="RAM" value={variant.ram} onChange={(v) => handleVariantChange(variant.id, 'ram', v)} placeholder="VD: 16GB" />
                          <InputField label="Ổ cứng" value={variant.oCung} onChange={(v) => handleVariantChange(variant.id, 'oCung', v)} placeholder="VD: 512GB SSD" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <InputField label="CPU" value={variant.boXuLyTrungTam} onChange={(v) => handleVariantChange(variant.id, 'boXuLyTrungTam', v)} placeholder="VD: Intel Core i7-12700H" />
                          <InputField label="GPU" value={variant.boXuLyDoHoa} onChange={(v) => handleVariantChange(variant.id, 'boXuLyDoHoa', v)} placeholder="VD: NVIDIA RTX 3060" />
                          <InputField
                            label="Số lượng"
                            type="number"
                            min="0"
                            step="1"
                            value={variant.soLuongTon}
                            onChange={(v) => handleVariantChange(variant.id, 'soLuongTon', v)}
                            error={errors[`variant_${index}_soLuongTon`]}
                            placeholder="0"
                          />
                        </div>

                        <div className="border-t pt-6">
                          <h4 className="text-lg font-bold text-gray-800 mb-4">Thông số kỹ thuật</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <InputField label="Kích thước màn hình" value={variant.thongSoKyThuat.kichThuocManHinh} onChange={(v) => handleVariantSpecChange(variant.id, 'kichThuocManHinh', v)} placeholder='VD: 15.6"' />
                            <InputField label="Độ phân giải" value={variant.thongSoKyThuat.doPhanGiaiManHinh} onChange={(v) => handleVariantSpecChange(variant.id, 'doPhanGiaiManHinh', v)} placeholder="VD: 1920x1080" />
                            <InputField label="Hệ điều hành" value={variant.thongSoKyThuat.heDieuHanh} onChange={(v) => handleVariantSpecChange(variant.id, 'heDieuHanh', v)} placeholder="VD: Windows 11 Home" />
                            <InputField label="Pin" value={variant.thongSoKyThuat.pin} onChange={(v) => handleVariantSpecChange(variant.id, 'pin', v)} placeholder="VD: 56Wh" />
                            <InputField
                              label="Số khe RAM"
                              type="number"
                              min="0"
                              step="1"
                              value={variant.thongSoKyThuat.soKheRam}
                              onChange={(v) => handleVariantSpecChange(variant.id, 'soKheRam', v)}
                              error={errors[`variant_${index}_soKheRam`]}
                              placeholder="VD: 2"
                            />
                            <InputField label="Cổng giao tiếp" value={variant.thongSoKyThuat.congGiaoTiep} onChange={(v) => handleVariantSpecChange(variant.id, 'congGiaoTiep', v)} placeholder="VD: USB-C, HDMI" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tổng quan */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign size={20} className="text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Tổng Quan</h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Tổng biến thể:</span>
                  <span className="font-bold text-gray-900">{variants.length}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Tổng số sản phẩm:</span>
                  <span className={`font-bold ${totalStock <= 0 ? 'text-red-600' : 'text-blue-600'}`}>
                    {totalStock.toLocaleString('vi-VN')}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Số lượng ảnh:</span>
                  <span className={`font-bold ${currentImageCount === 0 ? 'text-red-600' : currentImageCount < 3 ? 'text-orange-600' : 'text-green-600'}`}>
                    {currentImageCount} / 10
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Khuyến mãi:</span>
                  <span className={`font-bold ${variants.some(v => Number(v.giaKhuyenMai) > 0) ? 'text-green-600' : 'text-gray-500'}`}>
                    {variants.some(v => Number(v.giaKhuyenMai) > 0) ? 'Có áp dụng' : 'Chưa có'}
                  </span>
                </div>
                <div className="pt-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-xs text-blue-800 leading-relaxed">
                      <strong>Lưu ý:</strong> Ảnh đầu là ảnh chính • Tối đa 10 ảnh • Các trường số chỉ chấp nhận số nguyên
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddCategoryModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} onSuccess={handleCategoryAdded} />
      <AddBrandModal isOpen={isBrandModalOpen} onClose={() => setIsBrandModalOpen(false)} onSuccess={handleBrandAdded} />

      {/* Toast */}
      {toast.show && (
        <div className="fixed top-6 right-6 z-50 animate-fade-in">
          <div
            className={`px-6 py-4 rounded-xl shadow-2xl border-l-6 min-w-[320px] ${
              toast.type === 'success'
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-600 text-green-900'
                : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-600 text-red-900'
            }`}
          >
            <div className="flex items-start gap-3">
              {toast.type === 'success' ? (
                <div className="mt-0.5 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Check size={16} className="text-green-700" />
                </div>
              ) : (
                <AlertCircle size={24} className="text-red-700 flex-shrink-0" />
              )}
              <div>
                <p className="font-semibold text-base">
                  {toast.type === 'success' ? 'Thành công' : 'Lỗi nhập liệu'}
                </p>
                <p className="text-sm mt-1">{toast.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;