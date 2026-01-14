import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Toast from '../../../components/admin/Toast';
import { Trash2, Camera, X, Edit3, Save, ArrowLeft, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import ConfirmModal from '../../../components/admin/DeleteConfirmModal';
import { productService } from "../../../services/api/ProductService";
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
      className={`w-full px-4 py-2.5 rounded-xl outline-none transition-all duration-200 border ${disabled
        ? 'bg-gray-50 text-gray-400 border-transparent'
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
  const [deletedVariantIds, setDeletedVariantIds] = useState([]); // Mới: lưu ID biến thể cũ cần xóa mềm
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
    soLuongTon: 0
  });

  const [variants, setVariants] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [product, categoriesData, brandsData] = await Promise.all([
          productService.getDetailProduct(maSanPham),
          categoryService.getAll(),
          brandService.getAll()
        ]);

        setCategories(categoriesData);
        setBrands(brandsData);
        setBasicInfo({
          maSanPham: product.maSanPham,
          tenSanPham: product.tenSanPham || '',
          slug: product.slug || '',
          maDanhMuc: String(product.maDanhMuc || ''),
          maThuongHieu: String(product.maThuongHieu || ''),
          soLuongTon: product.soLuongTon || 0
        });

        if (product.hinhAnh) {
          const formattedImages = product.hinhAnh.map(img => {
            const rawPath = img.duongDan || img.duongDanAnh;
            if (!rawPath) return img;
            if (rawPath.startsWith('http')) return { ...img, duongDan: rawPath };

            const cleanPath = rawPath.startsWith('/') ? rawPath.substring(1) : rawPath;
            return {
              ...img,
              duongDan: `https://localhost:7012/${cleanPath}`
            };
          });
          setImages(formattedImages);
        }

        if (product.bienThe) {
          setVariants(product.bienThe.map(bt => ({
            ...bt,
            id: bt.maBTSP,
            thongSoKyThuat: bt.thongSoKyThuat || {}
          })));
        }
      } catch (error) {
        showToast("Không thể tải dữ liệu", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [maSanPham]);

  const showToast = (message, type = 'success') => setToast({ show: true, message, type });

  const addVariant = () => {
    const newId = `new-${Date.now()}`;
    setVariants([...variants, {
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
      thongSoKyThuat: {}
    }]);
    setOpenSpecs(prev => ({ ...prev, [newId]: true }));
  };

  const updateVariant = (id, field, value) => {
    setVariants(prev => prev.map(v => (v.id === id || v.maBTSP === id) ? { ...v, [field]: value } : v));
  };

  const updateVariantSpec = (id, field, value) => {
    setVariants(prev => prev.map(v => {
      if (v.id === id || v.maBTSP === id) {
        return { ...v, thongSoKyThuat: { ...(v.thongSoKyThuat || {}), [field]: value } };
      }
      return v;
    }));
  };

  const removeVariant = (id) => {
    setVariants(prev => {
      const variantToRemove = prev.find(v => v.id === id || v.maBTSP === id);
      if (variantToRemove?.maBTSP && variantToRemove.maBTSP > 0) {
        // Biến thể cũ → lưu ID để gửi xóa mềm lên server
        setDeletedVariantIds(prevIds => [...prevIds, variantToRemove.maBTSP]);
      }
      return prev.filter(v => v.id !== id && v.maBTSP !== id);
    });
  };

  const toggleSpecs = (id) => setOpenSpecs(prev => ({ ...prev, [id]: !prev[id] }));

  // Upload ảnh
  const handleImageUpload = (e, isMain = false) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newImages = files.map(file => ({
      duongDan: URL.createObjectURL(file),
      file,
      isNew: true,
    }));

    setImages(prev => {
      if (isMain) {
        const [newMainImage, ...additionalNewImages] = newImages;
        const oldSubImages = prev.slice(1);
        return [newMainImage, ...oldSubImages, ...additionalNewImages];
      } else {
        return [...prev, ...newImages];
      }
    });
  };

  const removeImage = (index) => {
    const imgToRemove = images[index];
    if (imgToRemove?.maHinhAnh && !imgToRemove.isNew) {
      setDeletedImageIds(prev => [...prev, imgToRemove.maHinhAnh]);
    }
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    const fallback = "Đang cập nhật";

    if (!basicInfo.tenSanPham?.trim()) {
      showToast("Vui lòng nhập tên sản phẩm", "error");
      return;
    }

    formData.append('TenSanPham', basicInfo.tenSanPham);
    formData.append('MaDanhMuc', basicInfo.maDanhMuc);
    formData.append('MaThuongHieu', basicInfo.maThuongHieu);

    const totalStock = variants.reduce((sum, v) => sum + (Number(v.soLuongTon) || 0), 0);
    formData.append('SoLuongTon', totalStock);

    deletedImageIds.forEach(id => formData.append('HinhAnhXoa', id));

    // Gửi danh sách ID biến thể cần xóa mềm
    deletedVariantIds.forEach(id => formData.append('BienTheXoa', id));

    images.forEach(img => {
      if (img.isNew && img.file) {
        formData.append('HinhAnhMoi', img.file);
      }
    });

    variants.forEach((v, i) => {
      if (v.maBTSP && typeof v.maBTSP === 'number' && v.maBTSP > 0) {
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

    console.log('=== FormData Debug ===');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
    console.log('Deleted Variant IDs gửi lên:', deletedVariantIds);

    try {
      setLoading(true);
      await productService.updateProduct(maSanPham, formData);
      showToast("Cập nhật thành công!");
      setIsEditing(false);
      setDeletedImageIds([]);
      setDeletedVariantIds([]); // Reset sau khi lưu thành công
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      showToast("Lỗi cập nhật sản phẩm", "error");
      console.error('=== Update Error ===', error);
      console.error('Response data:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await productService.deleteProduct(maSanPham);
      showToast("Xóa thành công");
      setTimeout(() => navigate('/quan-ly/san-pham'), 1000);
    } catch (err) {
      showToast("Xóa thất bại", err);
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
    }
  };

  if (loading && !isEditing) return <div className="p-20 text-center font-medium text-gray-500 animate-pulse">Đang tải dữ liệu sản phẩm...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-24 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-semibold transition-colors cursor-pointer group">
          <div className="p-2 rounded-lg group-hover:bg-blue-50"><ArrowLeft size={20} /></div>
          Quay lại
        </button>
        <div className="flex gap-3 w-full md:w-auto">
          {!isEditing ? (
            <>
              <button onClick={() => setIsEditing(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 shadow-lg shadow-amber-200 transition-all cursor-pointer">
                <Edit3 size={18} /> Chỉnh sửa
              </button>
              <button onClick={() => setIsConfirmOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 shadow-lg shadow-red-200 transition-all cursor-pointer">
                <Trash2 size={18} /> Xóa
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(false)} className="flex-1 md:flex-none px-6 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all cursor-pointer">Hủy</button>
              <button onClick={handleUpdate} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all cursor-pointer">
                <Save size={18} /> Lưu thay đổi
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-black text-gray-400 uppercase mb-4 tracking-widest">Hình ảnh sản phẩm</h3>

            {/* Ảnh chính */}
            <div className="relative aspect-square w-full border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50 flex flex-col items-center justify-center overflow-hidden group">
              {images.length > 0 ? (
                <>
                  <img
                    src={images[0].duongDan}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt="Ảnh chính"
                  />
                  {isEditing && (
                    <button
                      onClick={() => removeImage(0)}
                      className="absolute top-4 right-4 p-2 bg-white/90 text-red-500 rounded-full shadow-xl hover:bg-red-500 hover:text-white transition-all z-10"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center text-gray-400 p-10">
                  <Camera size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="text-sm font-medium">Chưa có ảnh chính</p>
                  {isEditing && <p className="text-xs mt-2">Nhấn vào đây để upload ảnh chính mới</p>}
                </div>
              )}

              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer z-20"
                  onChange={(e) => handleImageUpload(e, true)}
                  multiple
                />
              )}
            </div>

            {/* Ảnh phụ */}
            <div className="flex flex-wrap gap-3 mt-4">
              {images.slice(1).map((img, idx) => (
                <div
                  key={idx + 1}
                  className="relative w-20 h-20 rounded-2xl border border-gray-100 overflow-hidden group shadow-sm"
                >
                  <img src={img.duongDan} className="w-full h-full object-cover" alt={`Ảnh phụ ${idx + 1}`} />
                  {isEditing && (
                    <button
                      onClick={() => removeImage(idx + 1)}
                      className="absolute inset-0 bg-red-500/80 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}

              {isEditing && (
                <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 cursor-pointer hover:border-blue-400 hover:text-blue-500 transition-all">
                  <Plus size={24} />
                  <span className="text-xs mt-1 text-gray-500">Thêm ảnh phụ</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, false)}
                    multiple
                  />
                </label>
              )}
            </div>
          </div>
        </section>

        <section className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
            THÔNG TIN CHÍNH
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <InputField label="Tên sản phẩm" value={basicInfo.tenSanPham} onChange={(v) => setBasicInfo({ ...basicInfo, tenSanPham: v })} disabled={!isEditing} placeholder="Nhập tên sản phẩm..." />
            </div>
            <InputField label="Đường dẫn (Slug)" value={basicInfo.slug} onChange={(v) => setBasicInfo({ ...basicInfo, slug: v })} disabled={!isEditing} />
            <InputField label="Tổng kho dự kiến" type="number" value={basicInfo.soLuongTon} disabled={true} />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Danh mục</label>
              <div className="relative">
                <select
                  disabled={!isEditing}
                  value={basicInfo.maDanhMuc}
                  onChange={(e) => setBasicInfo({ ...basicInfo, maDanhMuc: e.target.value })}
                  className={`w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 bg-white text-gray-900 outline-none transition-all duration-200 appearance-none cursor-pointer shadow-sm
                    ${!isEditing ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-transparent' : 'hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'}`}
                >
                  <option value="" disabled className="text-gray-400">Chọn danh mục</option>
                  {categories.map(cat => (
                    <option key={cat.maDanhMuc} value={String(cat.maDanhMuc)}>
                      {cat.tenDanhMuc}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${!isEditing ? 'opacity-50' : ''}`} />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Thương hiệu</label>
              <div className="relative">
                <select
                  disabled={!isEditing}
                  value={basicInfo.maThuongHieu}
                  onChange={(e) => setBasicInfo({ ...basicInfo, maThuongHieu: e.target.value })}
                  className={`w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 bg-white text-gray-900 outline-none transition-all duration-200 appearance-none cursor-pointer shadow-sm
                    ${!isEditing ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-transparent' : 'hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'}`}
                >
                  <option value="" disabled className="text-gray-400">Chọn thương hiệu</option>
                  {brands.map(brand => (
                    <option key={brand.maThuongHieu} value={String(brand.maThuongHieu)}>
                      {brand.tenThuongHieu}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${!isEditing ? 'opacity-50' : ''}`} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
            <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
            BIẾN THỂ VÀ THÔNG SỐ KỸ THUẬT
          </h2>
          {isEditing && (
            <button type="button" onClick={addVariant} className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all cursor-pointer">
              <Plus size={18} /> Thêm phiên bản
            </button>
          )}
        </div>

        <div className="p-8 space-y-6 max-h-[1000px] overflow-y-auto">
          {variants.map((v, index) => {
            const currentId = v.maBTSP || v.id;
            const isOpen = openSpecs[currentId];
            return (
              <div key={currentId} className={`rounded-3xl border transition-all duration-300 ${isOpen ? 'border-indigo-200 bg-indigo-50/10 shadow-md' : 'border-gray-100 bg-white shadow-sm'}`}>
                <div className="p-5 flex items-center justify-between cursor-pointer" onClick={() => toggleSpecs(currentId)}>
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full font-black text-sm">{index + 1}</span>
                    <div>
                      <h3 className="font-bold text-gray-800">{v.tenBienThe || "Tên phiên bản chưa đặt"}</h3>
                      <p className="text-xs text-gray-500">{v.mauSac || 'Chưa chọn màu'} • {v.ram || '0GB'} RAM • {v.oCung || 'Chưa rõ'} SSD</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                      <p className="text-sm font-bold text-blue-600">{(v.giaBan || 0).toLocaleString()}đ</p>
                      <p className="text-xs text-gray-400">Kho: {v.soLuongTon || 0}</p>
                    </div>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeVariant(currentId);
                        }}
                        className="p-2 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                    {isOpen ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                  </div>
                </div>

                {isOpen && (
                  <div className="p-6 pt-0 space-y-8 animate-in fade-in duration-300">
                    <div className="h-px bg-gray-100 w-full"></div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="md:col-span-2">
                        <InputField label="Tên biến thể" value={v.tenBienThe} onChange={(val) => updateVariant(currentId, 'tenBienThe', val)} disabled={!isEditing} placeholder="VD: MacBook Air M2 8GB/256GB" />
                      </div>
                      <InputField label="Giá bán (VNĐ)" type="number" value={v.giaBan} onChange={(val) => updateVariant(currentId, 'giaBan', Number(val))} disabled={!isEditing} />
                      <InputField label="Giá KM (VNĐ)" type="number" value={v.giaKhuyenMai} onChange={(val) => updateVariant(currentId, 'giaKhuyenMai', Number(val))} disabled={!isEditing} />
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-6 shadow-inner">
                      <h4 className="text-xs font-black text-indigo-500 uppercase tracking-widest">Thông số phần cứng</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <InputField label="Màu sắc" value={v.mauSac} onChange={(val) => updateVariant(currentId, 'mauSac', val)} disabled={!isEditing} />
                        <InputField label="Dung lượng RAM" value={v.ram} onChange={(val) => updateVariant(currentId, 'ram', val)} disabled={!isEditing} />
                        <InputField label="Dung lượng Ổ cứng" value={v.oCung} onChange={(val) => updateVariant(currentId, 'oCung', val)} disabled={!isEditing} />
                        <InputField label="Số lượng tồn kho" type="number" value={v.soLuongTon} onChange={(val) => updateVariant(currentId, 'soLuongTon', Number(val))} disabled={!isEditing} />

                        <InputField label="CPU (Bộ vi xử lý)" value={v.boXuLyTrungTam} onChange={(val) => updateVariant(currentId, 'boXuLyTrungTam', val)} disabled={!isEditing} />
                        <InputField label="GPU (Card đồ họa)" value={v.boXuLyDoHoa} onChange={(val) => updateVariant(currentId, 'boXuLyDoHoa', val)} disabled={!isEditing} />
                        <InputField label="Kích thước màn hình" value={v.thongSoKyThuat?.kichThuocManHinh} onChange={(val) => updateVariantSpec(currentId, 'kichThuocManHinh', val)} disabled={!isEditing} />
                        <InputField label="Độ phân giải" value={v.thongSoKyThuat?.doPhanGiaiManHinh} onChange={(val) => updateVariantSpec(currentId, 'doPhanGiaiManHinh', val)} disabled={!isEditing} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <InputField label="Hệ điều hành" value={v.thongSoKyThuat?.heDieuHanh} onChange={(val) => updateVariantSpec(currentId, 'heDieuHanh', val)} disabled={!isEditing} />
                      <InputField label="Dung lượng PIN" value={v.thongSoKyThuat?.pin} onChange={(val) => updateVariantSpec(currentId, 'pin', val)} disabled={!isEditing} />
                      <InputField label="Số khe RAM" value={v.thongSoKyThuat?.soKheRam} onChange={(val) => updateVariantSpec(currentId, 'soKheRam', val)} disabled={!isEditing} />
                      <InputField label="Cổng giao tiếp" value={v.thongSoKyThuat?.congGiaoTiep} onChange={(val) => updateVariantSpec(currentId, 'congGiaoTiep', val)} disabled={!isEditing} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}

      <ConfirmModal
        isOpen={isConfirmOpen}
        message="Dữ liệu bị xóa sẽ không thể khôi phục. Bạn chắc chắn muốn xóa sản phẩm này?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ProductDetail;