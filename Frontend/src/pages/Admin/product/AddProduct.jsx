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
} from 'lucide-react';
import AddCategoryModal from '../../../components/admin/product/AddCategoryModal';
import AddBrandModal from '../../../components/admin/product/AddBrandModal';
import { productService } from '../../../services/api/productService';
import { categoryService } from '../../../services/api/categoryService';
import { brandService } from '../../../services/api/brandService';

const InputField = ({ label, value, onChange, type = "text", disabled, placeholder, error, min, max }) => (
  <div className="flex flex-col gap-1.5 w-full text-left">
    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{label}</label>
    <input
      type={type}
      value={value ?? ''}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      min={min}
      max={max}
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
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    tenSanPham: '',
    maDanhMuc: '',
    maThuongHieu: '',
  });

  const [productImages, setProductImages] = useState([]); // mảng động

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

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const validateImageFile = (file) => {
    const valid = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;
    if (!valid.includes(file.type)) return 'Chỉ chấp nhận JPG, PNG, GIF, WEBP';
    if (file.size > maxSize) return 'Ảnh không được vượt quá 5MB';
    return null;
  };

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (productImages.length + files.length > 10) {
      showToast(`Tối đa 10 ảnh, chỉ thêm được ${10 - productImages.length} ảnh nữa`, 'error');
      return;
    }

    const newImages = files.map(file => {
      const err = validateImageFile(file);
      if (err) {
        showToast(err, 'error');
        return null;
      }
      return {
        id: `new_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        file,
        preview: URL.createObjectURL(file),
        isNew: true,
        anhChinh: false,
      };
    }).filter(Boolean);

    setProductImages(prev => [...prev, ...newImages]);
    setErrors(prev => ({ ...prev, hinhAnh: '' }));
    e.target.value = '';
  };

  const handleReplaceImage = (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const err = validateImageFile(file);
    if (err) return showToast(err, 'error');

    const newImg = {
      id: `replace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      file,
      preview: URL.createObjectURL(file),
      isNew: true,
      anhChinh: index === 0,
    };

    setProductImages(prev => {
      const updated = [...prev];
      if (updated[index]?.preview) URL.revokeObjectURL(updated[index].preview);
      updated[index] = newImg;
      return updated;
    });

    setErrors(prev => ({ ...prev, hinhAnh: '' }));
    e.target.value = '';
  };

  const removeProductImage = (index) => {
    if (index === 0) {
      showToast("Không thể xóa ảnh chính bằng nút này. Hãy thay thế ảnh chính.", 'error');
      return;
    }

    setProductImages(prev => {
      const imgToRemove = prev[index];
      if (imgToRemove?.preview) URL.revokeObjectURL(imgToRemove.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleVariantChange = (id, field, value) => {
    setVariants(prev =>
      prev.map(v => {
        if (v.id !== id) return v;

        let updated = { ...v, [field]: value };

        // Ràng buộc phần trăm giảm: 0-100, không âm
        if (field === 'phanTramGiam') {
          let num = Number(value);
          if (isNaN(num) || num < 0) {
            updated.phanTramGiam = '0';
            num = 0;
          } else if (num > 100) {
            updated.phanTramGiam = '100';
            num = 100;
          } else {
            updated.phanTramGiam = value;
          }

          // Tính lại giá KM
          const giaBan = Number(updated.giaBan) || 0;
          if (giaBan > 0) {
            updated.giaKhuyenMai = Math.round(giaBan * (1 - num / 100));
          } else {
            updated.giaKhuyenMai = '';
          }
        }

        // Giá bán: số nguyên > 0
        if (field === 'giaBan') {
          let num = Number(value);
          if (isNaN(num) || num < 0) {
            updated.giaBan = '';
          } else {
            updated.giaBan = Math.floor(num).toString();
          }

          // Tính lại giá KM nếu có %
          const phanTram = Number(updated.phanTramGiam) || 0;
          if (phanTram > 0 && Number(updated.giaBan) > 0) {
            updated.giaKhuyenMai = Math.round(Number(updated.giaBan) * (1 - phanTram / 100));
          }
        }

        // Số lượng tồn: không âm
        if (field === 'soLuongTon') {
          const num = Number(value);
          updated.soLuongTon = isNaN(num) || num < 0 ? 0 : Math.floor(num);
        }

        return updated;
      })
    );

    // Xóa lỗi khi sửa
    setErrors(prev => {
      const idx = variants.findIndex(v => v.id === id);
      const newErrors = { ...prev };
      delete newErrors[`variant_${idx}_${field}`];
      return newErrors;
    });
  };

  const handleVariantSpecChange = (id, field, value) => {
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

    if (productImages.length === 0) newErrors.hinhAnh = 'Vui lòng thêm ít nhất 1 ảnh';
    if (productImages.length > 10) newErrors.hinhAnh = 'Tối đa 10 hình ảnh';

    variants.forEach((v, index) => {
      if (!v.tenBienThe.trim()) newErrors[`variant_${index}_tenBienThe`] = 'Vui lòng nhập tên biến thể';

      const soLuongTon = Number(v.soLuongTon);
      if (isNaN(soLuongTon) || soLuongTon < 0) {
        newErrors[`variant_${index}_soLuongTon`] = 'Số lượng tồn không được âm';
      }

      const giaBanNum = Number(v.giaBan);
      if (isNaN(giaBanNum) || giaBanNum <= 0 || !Number.isInteger(giaBanNum)) {
        newErrors[`variant_${index}_giaBan`] = 'Giá bán phải là số nguyên lớn hơn 0';
      }

      const phanTram = Number(v.phanTramGiam);
      if (v.phanTramGiam !== '' && (isNaN(phanTram) || phanTram < 0 || phanTram > 100)) {
        newErrors[`variant_${index}_phanTramGiam`] = 'Phần trăm giảm phải từ 0 đến 100';
      }

      const giaKM = Number(v.giaKhuyenMai);
      if (v.giaKhuyenMai !== '' && (isNaN(giaKM) || giaKM < 0)) {
        newErrors[`variant_${index}_giaKhuyenMai`] = 'Giá khuyến mãi không được âm';
      }

      if (v.giaKhuyenMai && Number(v.giaKhuyenMai) >= Number(v.giaBan)) {
        newErrors[`variant_${index}_giaKhuyenMai`] = 'Giá khuyến mãi phải nhỏ hơn giá bán';
      }
    });

    setErrors(newErrors);
    return newErrors;
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      showToast('Vui lòng kiểm tra lại các trường bắt buộc', 'error');
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
        if (img?.file) {
          formDataToSend.append('HinhAnh', img.file);
        }
      });

      await productService.AddProduct(formDataToSend);

      showToast('Thêm sản phẩm thành công!', 'success');
      setTimeout(() => navigate('/quan-ly/san-pham'), 1500);
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Thêm sản phẩm thất bại';
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
          {/* Left - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon size={20} className="text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Hình Ảnh Sản Phẩm (Tối đa 10 ảnh)</h2>
              </div>

              {errors.hinhAnh && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <AlertCircle size={16} /> {errors.hinhAnh}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {productImages.map((imgObj, index) => (
                  <div
                    key={imgObj.id}
                    className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-300 hover:border-blue-500 shadow-sm transition-all duration-200"
                  >
                    <img
                      src={imgObj.preview}
                      alt={`Ảnh ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-blue-600/90 text-white text-xs px-2.5 py-1 rounded font-semibold shadow">
                        Ảnh chính
                      </div>
                    )}
                    <button
                      onClick={() => removeProductImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-700 z-10"
                    >
                      <X size={14} />
                    </button>
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-5">
                      <Camera size={28} className="text-white drop-shadow-md" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleReplaceImage(e, index)}
                      />
                    </label>
                  </div>
                ))}

                {productImages.length < 10 && (
                  <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group">
                    <Camera size={28} className="text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
                    <span className="text-xs text-gray-500 group-hover:text-blue-600 font-medium transition-colors">Thêm ảnh</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleAddImages}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Thông Tin Cơ Bản */}
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

            {/* Biến Thể */}
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
                const giaKMHienThi = (giaBanNum > 0 && phanTramNum >= 0 && phanTramNum <= 100)
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
                            onClick={(e) => {
                              e.stopPropagation();
                              removeVariant(variant.id);
                            }}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        )}
                        {isOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
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
                            value={variant.giaBan}
                            onChange={(v) => handleVariantChange(variant.id, 'giaBan', v)}
                            error={errors[`variant_${index}_giaBan`]}
                            placeholder="10000000"
                          />
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                              Phần trăm giảm (%)
                            </label>
                            <InputField
                              type="number"
                              value={variant.phanTramGiam ?? ''}
                              onChange={(v) => handleVariantChange(variant.id, 'phanTramGiam', v)}
                              error={errors[`variant_${index}_phanTramGiam`]}
                              placeholder="0 - 100"
                              min="0"
                              max="100"
                            />
                            {giaKMHienThi && (
                              <p className="text-sm text-green-600 mt-1">
                                Giá KM: <strong>{giaKMHienThi} VNĐ</strong>
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <InputField
                            label="Màu sắc"
                            value={variant.mauSac}
                            onChange={(v) => handleVariantChange(variant.id, 'mauSac', v)}
                            placeholder="VD: Đen"
                          />
                          <InputField
                            label="RAM"
                            value={variant.ram}
                            onChange={(v) => handleVariantChange(variant.id, 'ram', v)}
                            placeholder="VD: 16GB"
                          />
                          <InputField
                            label="Ổ cứng"
                            value={variant.oCung}
                            onChange={(v) => handleVariantChange(variant.id, 'oCung', v)}
                            placeholder="VD: 512GB SSD"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <InputField
                            label="CPU"
                            value={variant.boXuLyTrungTam}
                            onChange={(v) => handleVariantChange(variant.id, 'boXuLyTrungTam', v)}
                            placeholder="VD: Intel Core i7-12700H"
                          />
                          <InputField
                            label="GPU"
                            value={variant.boXuLyDoHoa}
                            onChange={(v) => handleVariantChange(variant.id, 'boXuLyDoHoa', v)}
                            placeholder="VD: NVIDIA RTX 3060"
                          />
                          <InputField
                            label="Số lượng tồn *"
                            type="number"
                            value={variant.soLuongTon}
                            onChange={(v) => handleVariantChange(variant.id, 'soLuongTon', v)}
                            error={errors[`variant_${index}_soLuongTon`]}
                            placeholder="0"
                          />
                        </div>

                        <div className="border-t pt-6">
                          <h4 className="text-lg font-bold text-gray-800 mb-4">Thông số kỹ thuật</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <InputField
                              label="Kích thước màn hình"
                              value={variant.thongSoKyThuat.kichThuocManHinh}
                              onChange={(v) => handleVariantSpecChange(variant.id, 'kichThuocManHinh', v)}
                              placeholder='VD: 15.6"'
                            />
                            <InputField
                              label="Độ phân giải"
                              value={variant.thongSoKyThuat.doPhanGiaiManHinh}
                              onChange={(v) => handleVariantSpecChange(variant.id, 'doPhanGiaiManHinh', v)}
                              placeholder="VD: 1920x1080 (Full HD)"
                            />
                            <InputField
                              label="Hệ điều hành"
                              value={variant.thongSoKyThuat.heDieuHanh}
                              onChange={(v) => handleVariantSpecChange(variant.id, 'heDieuHanh', v)}
                              placeholder="VD: Windows 11 Home"
                            />
                            <InputField
                              label="Pin"
                              value={variant.thongSoKyThuat.pin}
                              onChange={(v) => handleVariantSpecChange(variant.id, 'pin', v)}
                              placeholder="VD: 56Wh"
                            />
                            <InputField
                              label="Số khe RAM"
                              value={variant.thongSoKyThuat.soKheRam}
                              onChange={(v) => handleVariantSpecChange(variant.id, 'soKheRam', v)}
                              placeholder="VD: 2"
                            />
                            <InputField
                              label="Cổng giao tiếp"
                              value={variant.thongSoKyThuat.congGiaoTiep}
                              onChange={(v) => handleVariantSpecChange(variant.id, 'congGiaoTiep', v)}
                              placeholder="VD: USB-C, HDMI, USB 3.0"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right - Tổng Quan */}
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
                  <span className="text-sm text-gray-600">Tổng số lượng tồn:</span>
                  <span className="font-bold text-blue-600">{totalStock.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Số lượng ảnh:</span>
                  <span className="font-bold text-gray-900">{productImages.length}</span>
                </div>

                <div className="pt-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-xs text-blue-800 leading-relaxed">
                      <strong>Lưu ý:</strong> Ảnh đầu tiên là ảnh chính • Tối đa 10 ảnh • Phần trăm giảm từ 0-100
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

      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg border-l-4 ${
              toast.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' : 'bg-red-50 border-red-500 text-red-800'
            }`}
          >
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