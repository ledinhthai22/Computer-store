import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Toast from '../../../components/admin/Toast';
import { Trash2, Camera, X, Edit3, Save, ArrowLeft, Plus, ChevronDown, ChevronUp,ImageIcon,Package,Settings,DollarSign,AlertCircle } from 'lucide-react';
import DeleteConfirmModal from '../../../components/admin/DeleteConfirmModal';
import UpdateConfirmModal from '../../../components/admin/UpdateConfirmModal';
import { productService } from "../../../services/api/productService";
import { categoryService } from "../../../services/api/categoryService";
import { brandService } from "../../../services/api/brandService";

const InputField = ({ label, value, onChange, type = "text", disabled, placeholder }) => (
  <div className="flex flex-col gap-1.5 w-full text-left">
    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{label}</label>
    <input
      type={type}
      value={value || ''}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full px-4 py-2.5 rounded-xl outline-none transition-all duration-200 border ${
        disabled
          ? 'bg-gray-50 text-gray-400 border-transparent cursor-not-allowed'
          : 'bg-white border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-gray-900 shadow-sm'
      }`}
    />
  </div>
);

const ProductDetail = () => {
  const { maSanPham } = useParams();
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);
  const [deletedVariantIds, setDeletedVariantIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isConfirmUpdateOpen, setIsConfirmUpdateOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [openSpecs, setOpenSpecs] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [basicInfo, setBasicInfo] = useState({
    maSanPham: null,
    tenSanPham: '',
    slug: '',
    maDanhMuc: '',
    maThuongHieu: '',
    soLuongTon: 0,
  });

  const [variants, setVariants] = useState([]);

  const formatImageUrl = (rawPath) => {
    if (!rawPath) return '';
    if (rawPath.startsWith('http')) return rawPath;
    const cleanPath = rawPath.startsWith('/') ? rawPath.substring(1) : rawPath;
    return `https://localhost:7012/${cleanPath}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [product, categoriesData, brandsData] = await Promise.all([
          productService.getDetailProduct(maSanPham),
          categoryService.getAll(),
          brandService.getAll(),
        ]);

        setCategories(categoriesData);
        setBrands(brandsData);

        setBasicInfo({
          maSanPham: product.maSanPham,
          tenSanPham: product.tenSanPham || '',
          slug: product.slug || '',
          maDanhMuc: String(product.maDanhMuc || ''),
          maThuongHieu: String(product.maThuongHieu || ''),
          soLuongTon: product.soLuongTon || 0,
        });

        if (product.hinhAnh) {
          const formatted = product.hinhAnh.map(img => ({
            ...img,
            duongDan: formatImageUrl(img.duongDan || img.duongDanAnh),
          }));
          setImages(formatted);
        }

        if (product.bienThe) {
          setVariants(
            product.bienThe.map(bt => ({
              ...bt,
              id: bt.maBTSP,
              thongSoKyThuat: bt.thongSoKyThuat || {},
            }))
          );
        }
      } catch (error) {
        showToast("Không thể tải dữ liệu sản phẩm", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [maSanPham]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const addVariant = () => {
    const newId = `new-${Date.now()}`;
    setVariants([
      ...variants,
      {
        id: newId,
        maBTSP: null,
        tenBienThe: '',
        giaBan: 0,
        giaKhuyenMai: 0,
        mauSac: '',
        ram: '',
        oCung: '',
        boXuLyTrungTam: '',
        boXuLyDoHoa: '',
        soLuongTon: 0,
        trangThai: true,
        thongSoKyThuat: {},
      },
    ]);
    setOpenSpecs(prev => ({ ...prev, [newId]: true }));
  };

  const updateVariant = (id, field, value) => {
    setVariants(prev =>
      prev.map(v => (v.id === id || v.maBTSP === id ? { ...v, [field]: value } : v))
    );
  };

  const updateVariantSpec = (id, field, value) => {
    setVariants(prev =>
      prev.map(v => {
        if (v.id === id || v.maBTSP === id) {
          return {
            ...v,
            thongSoKyThuat: { ...(v.thongSoKyThuat || {}), [field]: value },
          };
        }
        return v;
      })
    );
  };

  const removeVariant = (id) => {
    setVariants(prev => {
      const variantToRemove = prev.find(v => v.id === id || v.maBTSP === id);
      if (variantToRemove?.maBTSP && variantToRemove.maBTSP > 0) {
        setDeletedVariantIds(prevIds => [...prevIds, variantToRemove.maBTSP]);
      }
      return prev.filter(v => v.id !== id && v.maBTSP !== id);
    });
  };

  const toggleSpecs = (id) => setOpenSpecs(prev => ({ ...prev, [id]: !prev[id] }));

  const handleImageUpload = (e, isMain = false) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setImages(prev => {
      let updated = [...prev];

      if (isMain) {
        updated = updated.map(img => ({ ...img, anhChinh: false }));

        const newImage = {
          duongDan: URL.createObjectURL(files[0]),
          file: files[0],
          isNew: true,
          anhChinh: true,
        };

        return [newImage, ...updated];
      }

      const newImages = files.map(f => ({
        duongDan: URL.createObjectURL(f),
        file: f,
        isNew: true,
        anhChinh: false,
      }));

      return [...updated, ...newImages];
    });
  };

  const removeImage = (index) => {
    const imgToRemove = images[index];
    if (imgToRemove?.maHinhAnh && !imgToRemove.isNew) {
      setDeletedImageIds(prev =>
        prev.includes(imgToRemove.maHinhAnh) ? prev : [...prev, imgToRemove.maHinhAnh]
      );
    }
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateClick = () => {
    if (!basicInfo.tenSanPham?.trim()) {
      showToast("Vui lòng nhập tên sản phẩm", "error");
      return;
    }
    setIsConfirmUpdateOpen(true);
  };

  const handleConfirmUpdate = async () => {
    const formData = new FormData();
    const fallback = "Đang cập nhật";

    try {
      setIsUpdating(true);

      formData.append('TenSanPham', basicInfo.tenSanPham.trim());
      formData.append('MaDanhMuc', basicInfo.maDanhMuc);
      formData.append('MaThuongHieu', basicInfo.maThuongHieu);

      const totalStock = variants.reduce((sum, v) => sum + (Number(v.soLuongTon) || 0), 0);
      formData.append('SoLuongTon', totalStock);

      deletedImageIds.forEach(id => formData.append('HinhAnhXoa', id));

      const mainImage = images.find(i => i.anhChinh);

      if (mainImage?.isNew) {
        formData.append('AnhMoiDauTienLaAnhChinh', 'true');
      } else if (mainImage?.maHinhAnh) {
        formData.append('MaAnhChinh', mainImage.maHinhAnh);
        formData.append('AnhMoiDauTienLaAnhChinh', 'false');
      }

      const newImages = images.filter(img => img.isNew && img.file);
      newImages.forEach(img => {
        formData.append('HinhAnhMoi', img.file);
      });

      deletedVariantIds.forEach(id => formData.append('BienTheXoa', id));

      variants.forEach((v, i) => {
        if (Number.isInteger(v.maBTSP) && v.maBTSP > 0) {
          formData.append(`BienThe[${i}].MaBTSP`, v.maBTSP);
        }
        formData.append(`BienThe[${i}].TenBienThe`, v.tenBienThe || fallback);
        formData.append(`BienThe[${i}].GiaBan`, v.giaBan || 0);
        formData.append(`BienThe[${i}].GiaKhuyenMai`, v.giaKhuyenMai || 0);
        formData.append(`BienThe[${i}].MauSac`, v.mauSac || fallback);
        formData.append(`BienThe[${i}].Ram`, v.ram || fallback);
        formData.append(`BienThe[${i}].OCung`, v.oCung || fallback);
        formData.append(`BienThe[${i}].BoXuLyTrungTam`, v.boXuLyTrungTam || fallback);
        formData.append(`BienThe[${i}].BoXuLyDoHoa`, v.boXuLyDoHoa || fallback);
        formData.append(`BienThe[${i}].SoLuongTon`, v.soLuongTon || 0);
        formData.append(`BienThe[${i}].TrangThai`, v.trangThai ?? true);

        const ts = v.thongSoKyThuat || {};
        formData.append(`BienThe[${i}].ThongSoKyThuat.KichThuocManHinh`, ts.kichThuocManHinh || fallback);
        formData.append(`BienThe[${i}].ThongSoKyThuat.DungLuongRam`, ts.dungLuongRam || v.ram || fallback);
        formData.append(`BienThe[${i}].ThongSoKyThuat.SoKheRam`, ts.soKheRam || "1");
        formData.append(`BienThe[${i}].ThongSoKyThuat.OCung`, ts.oCung || v.oCung || fallback);
        formData.append(`BienThe[${i}].ThongSoKyThuat.Pin`, ts.pin || fallback);
        formData.append(`BienThe[${i}].ThongSoKyThuat.HeDieuHanh`, ts.heDieuHanh || fallback);
        formData.append(`BienThe[${i}].ThongSoKyThuat.DoPhanGiaiManHinh`, ts.doPhanGiaiManHinh || fallback);
        formData.append(`BienThe[${i}].ThongSoKyThuat.LoaiXuLyTrungTam`, ts.loaiXuLyTrungTam || v.boXuLyTrungTam || fallback);
        formData.append(`BienThe[${i}].ThongSoKyThuat.LoaiXuLyDoHoa`, ts.loaiXuLyDoHoa || v.boXuLyDoHoa || fallback);
        formData.append(`BienThe[${i}].ThongSoKyThuat.CongGiaoTiep`, ts.congGiaoTiep || fallback);
      });

      const response = await productService.updateProduct(maSanPham, formData);

      showToast("Cập nhật thành công!", "success");

      setDeletedImageIds([]);
      setDeletedVariantIds([]);

      if (response) {
        setBasicInfo({
          maSanPham: response.maSanPham,
          tenSanPham: response.tenSanPham || basicInfo.tenSanPham,
          slug: response.slug || basicInfo.slug,
          maDanhMuc: String(response.maDanhMuc || basicInfo.maDanhMuc),
          maThuongHieu: String(response.maThuongHieu || basicInfo.maThuongHieu),
          soLuongTon: response.soLuongTon || basicInfo.soLuongTon,
        });

        if (response.hinhAnh?.length) {
          const formatted = response.hinhAnh.map(img => ({
            ...img,
            duongDan: formatImageUrl(img.duongDan || img.duongDanAnh),
          }));
          setImages(formatted);
        }

        if (response.bienThe) {
          setVariants(
            response.bienThe.map(bt => ({
              ...bt,
              id: bt.maBTSP,
              thongSoKyThuat: bt.thongSoKyThuat || {},
            }))
          );
        }
      }

      setIsEditing(false);

      setTimeout(async () => {
        try {
          const refreshed = await productService.getDetailProduct(maSanPham);
          if (refreshed?.hinhAnh?.length) {
            const formatted = refreshed.hinhAnh.map(img => ({
              ...img,
              duongDan: formatImageUrl(img.duongDan || img.duongDanAnh),
            }));
            setImages(formatted);
          }
        } catch (error) {
          showToast("Lỗi tải lại dữ liệu", error);
        }
      }, 800);

    } catch (error) {
      showToast(
        "Lỗi cập nhật: " + (error.response?.data?.message || error.message || "Không rõ"),
        "error"
      );
    } finally {
      setIsUpdating(false);
      setIsConfirmUpdateOpen(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await productService.deleteProduct(maSanPham);
      showToast("Xóa thành công");
      setTimeout(() => navigate('/quan-ly/san-pham'), 1200);
    } catch (error) {
      showToast("Xóa thất bại", error);
    } finally {
      setIsDeleting(false);
      setIsConfirmDeleteOpen(false);
    }
  };

  if (loading && !isEditing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const totalStock = variants.reduce((sum, v) => sum + (Number(v.soLuongTon) || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6 space-y-6">

        {/* Header giống AddProduct */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)} 
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <ArrowLeft size={20} className="text-gray-700" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Chi Tiết Sản Phẩm</h1>
                <p className="text-sm text-gray-500 mt-0.5">Mã sản phẩm: {maSanPham}</p>
              </div>
            </div>

            <div className="flex gap-3">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Edit3 size={18} /> Chỉnh sửa
                  </button>
                  <button
                    onClick={() => setIsConfirmDeleteOpen(true)}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Trash2 size={18} /> Xóa
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-all"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleUpdateClick}
                    disabled={isUpdating}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2 disabled:opacity-50 shadow-sm"
                  >
                    {isUpdating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save size={18} /> Lưu thay đổi
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Nội dung chính */}
          <div className="lg:col-span-2 space-y-6">

            {/* Product Images */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon size={20} className="text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Hình Ảnh Sản Phẩm</h2>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <div 
                    key={index} 
                    className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 group"
                  >
                    <img
                      src={img.duongDan}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md font-semibold">
                        Ảnh chính
                      </div>
                    )}
                    {isEditing && (
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}

                {isEditing && (
                  <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group">
                    <Camera size={24} className="text-gray-400 group-hover:text-blue-500 mb-2" />
                    <span className="text-xs text-gray-500 group-hover:text-blue-600 font-medium">Thêm ảnh</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
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
                  value={basicInfo.tenSanPham}
                  onChange={(v) => setBasicInfo({ ...basicInfo, tenSanPham: v })}
                  disabled={!isEditing}
                  placeholder="VD: Dell XPS 15 9520"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700">Danh Mục *</label>
                    <div className="relative">
                      <select
                        value={basicInfo.maDanhMuc}
                        onChange={(e) => setBasicInfo({ ...basicInfo, maDanhMuc: e.target.value })}
                        disabled={!isEditing}
                        className={`w-full px-4 py-2.5 rounded-lg text-sm transition-all appearance-none pr-10 ${
                          !isEditing
                            ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed'
                            : 'bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                        }`}
                      >
                        <option value="">Chọn danh mục</option>
                        {categories.map(cat => (
                          <option key={cat.maDanhMuc} value={String(cat.maDanhMuc)}>
                            {cat.tenDanhMuc}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700">Thương Hiệu *</label>
                    <div className="relative">
                      <select
                        value={basicInfo.maThuongHieu}
                        onChange={(e) => setBasicInfo({ ...basicInfo, maThuongHieu: e.target.value })}
                        disabled={!isEditing}
                        className={`w-full px-4 py-2.5 rounded-lg text-sm transition-all appearance-none pr-10 ${
                          !isEditing
                            ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed'
                            : 'bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                        }`}
                      >
                        <option value="">Chọn thương hiệu</option>
                        {brands.map(brand => (
                          <option key={brand.maThuongHieu} value={String(brand.maThuongHieu)}>
                            {brand.tenThuongHieu}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <InputField
                  label="Slug"
                  value={basicInfo.slug}
                  onChange={(v) => setBasicInfo({ ...basicInfo, slug: v })}
                  disabled={true}
                />
              </div>
            </div>

            {/* Variants Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Settings size={20} className="text-blue-600" />
                  <h2 className="text-lg font-bold text-gray-900">Biến Thể Sản Phẩm</h2>
                </div>
                {isEditing && (
                  <button
                    onClick={addVariant}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Plus size={16} /> Thêm biến thể
                  </button>
                )}
              </div>

              {variants.length === 0 && (
                <p className="text-center text-gray-500 py-8">Chưa có biến thể nào</p>
              )}

              {variants.map((variant, index) => {
                const id = variant.maBTSP || variant.id;
                const isOpen = openSpecs[id];

                return (
                  <div 
                    key={id} 
                    className={`border border-gray-200 rounded-lg p-4 mb-4 ${
                      isOpen ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <div 
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleSpecs(id)}
                    >
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Biến thể {index + 1} {variant.tenBienThe && `- ${variant.tenBienThe}`}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {variant.mauSac || '—'} • {variant.ram || '—'} • {variant.oCung || '—'} • {variant.soLuongTon || 0} sp
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        {isEditing && variants.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeVariant(id);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={20} />
                          </button>
                        )}
                        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>

                    {isOpen && (
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField
                          label="Tên biến thể"
                          value={variant.tenBienThe}
                          onChange={(val) => updateVariant(id, 'tenBienThe', val)}
                          disabled={!isEditing}
                          placeholder="VD: i7-16GB-512GB"
                        />
                        <InputField
                          label="Giá bán (VNĐ)"
                          type="number"
                          value={variant.giaBan}
                          onChange={(val) => updateVariant(id, 'giaBan', Number(val))}
                          disabled={!isEditing}
                        />
                        <InputField
                          label="Giá khuyến mãi (VNĐ)"
                          type="number"
                          value={variant.giaKhuyenMai}
                          onChange={(val) => updateVariant(id, 'giaKhuyenMai', Number(val))}
                          disabled={!isEditing}
                        />
                        <InputField
                          label="Màu sắc"
                          value={variant.mauSac}
                          onChange={(val) => updateVariant(id, 'mauSac', val)}
                          disabled={!isEditing}
                        />
                        <InputField
                          label="RAM"
                          value={variant.ram}
                          onChange={(val) => updateVariant(id, 'ram', val)}
                          disabled={!isEditing}
                        />
                        <InputField
                          label="Ổ cứng"
                          value={variant.oCung}
                          onChange={(val) => updateVariant(id, 'oCung', val)}
                          disabled={!isEditing}
                        />
                        <InputField
                          label="CPU"
                          value={variant.boXuLyTrungTam}
                          onChange={(val) => updateVariant(id, 'boXuLyTrungTam', val)}
                          disabled={!isEditing}
                        />
                        <InputField
                          label="GPU"
                          value={variant.boXuLyDoHoa}
                          onChange={(val) => updateVariant(id, 'boXuLyDoHoa', val)}
                          disabled={!isEditing}
                        />
                        <InputField
                          label="Số lượng tồn"
                          type="number"
                          value={variant.soLuongTon}
                          onChange={(val) => updateVariant(id, 'soLuongTon', Number(val))}
                          disabled={!isEditing}
                        />

                        {/* Technical specs - collapsible nếu muốn, nhưng hiện tại để phẳng */}
                        <div className="md:col-span-3 mt-4 pt-4 border-t border-gray-200">
                          <h4 className="text-md font-semibold mb-3">Thông số kỹ thuật</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InputField
                              label="Kích thước màn hình"
                              value={variant.thongSoKyThuat?.kichThuocManHinh || ''}
                              onChange={(val) => updateVariantSpec(id, 'kichThuocManHinh', val)}
                              disabled={!isEditing}
                            />
                            <InputField
                              label="Độ phân giải"
                              value={variant.thongSoKyThuat?.doPhanGiaiManHinh || ''}
                              onChange={(val) => updateVariantSpec(id, 'doPhanGiaiManHinh', val)}
                              disabled={!isEditing}
                            />
                            <InputField
                              label="Hệ điều hành"
                              value={variant.thongSoKyThuat?.heDieuHanh || ''}
                              onChange={(val) => updateVariantSpec(id, 'heDieuHanh', val)}
                              disabled={!isEditing}
                            />
                            <InputField
                              label="Dung lượng PIN"
                              value={variant.thongSoKyThuat?.pin || ''}
                              onChange={(val) => updateVariantSpec(id, 'pin', val)}
                              disabled={!isEditing}
                            />
                            <InputField
                              label="Số khe RAM"
                              value={variant.thongSoKyThuat?.soKheRam || ''}
                              onChange={(val) => updateVariantSpec(id, 'soKheRam', val)}
                              disabled={!isEditing}
                            />
                            <InputField
                              label="Cổng giao tiếp"
                              value={variant.thongSoKyThuat?.congGiaoTiep || ''}
                              onChange={(val) => updateVariantSpec(id, 'congGiaoTiep', val)}
                              disabled={!isEditing}
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
                  <span className="font-bold text-blue-600">{totalStock.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Số lượng ảnh:</span>
                  <span className="font-bold text-gray-900">{images.length}</span>
                </div>

                <div className="pt-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-xs text-blue-800 leading-relaxed">
                      <strong>Lưu ý:</strong> Ảnh đầu tiên sẽ là ảnh chính. Chỉ chấp nhận file ảnh ≤ 5MB.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

      {/* Modal xác nhận xóa */}
      <DeleteConfirmModal
        isOpen={isConfirmDeleteOpen}
        message="Dữ liệu bị xóa sẽ không thể khôi phục. Bạn chắc chắn muốn xóa sản phẩm này?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmDeleteOpen(false)}
        isLoading={isDeleting}
      />

      {/* Modal xác nhận cập nhật */}
      <UpdateConfirmModal
        isOpen={isConfirmUpdateOpen}
        message="Bạn có chắc chắn muốn lưu các thay đổi này?"
        onConfirm={handleConfirmUpdate}
        onCancel={() => setIsConfirmUpdateOpen(false)}
        isLoading={isUpdating}
      />
    </div>
  );
};

export default ProductDetail;