
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Trash2, Camera, X, Edit3, Save, ArrowLeft, Plus, ChevronDown, ChevronUp,
  Image as ImageIcon, Package, Settings, DollarSign, AlertCircle, Check
} from 'lucide-react';
import DeleteConfirmModal from '../../../components/admin/DeleteConfirmModal';
import UpdateConfirmModal from '../../../components/admin/UpdateConfirmModal';
import { productService } from "../../../services/api/productService";
import { categoryService } from "../../../services/api/categoryService";
import { brandService } from "../../../services/api/brandService";

const InputField = ({ label, value, onChange, type = "text", disabled, placeholder, error }) => (
  <div className="flex flex-col gap-1.5 w-full text-left">
    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{label}</label>
    <input
      type={type}
      value={value ?? ''}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
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

const ProductDetail = () => {
  const { maSanPham } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isConfirmUpdateOpen, setIsConfirmUpdateOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [openSpecs, setOpenSpecs] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState('');

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
  const [deletedVariantIds, setDeletedVariantIds] = useState([]);

  const [productImages, setProductImages] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);

  const MAX_IMAGES = 10;
  const currentImageCount = productImages.filter(img => img !== null && img !== undefined).length;

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
        const [product, catData, brandData] = await Promise.all([
          productService.getDetailProduct(maSanPham),
          categoryService.getAll(),
          brandService.getAll(),
        ]);

        console.log("API Response:", product);

        setCategories(catData);
        setBrands(brandData);

        setBasicInfo({
          maSanPham: product.maSanPham,
          tenSanPham: product.tenSanPham || '',
          slug: product.slug || '',
          maDanhMuc: String(product.maDanhMuc || ''),
          maThuongHieu: String(product.maThuongHieu || ''),
          soLuongTon: product.soLuongTon || 0,
        });

        if (product.hinhAnh?.length) {
          const formatted = product.hinhAnh.map(img => ({
            id: img.maHinhAnh || `server_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            duongDan: formatImageUrl(img.duongDan || img.duongDanAnh),
            maHinhAnh: img.maHinhAnh,
            anhChinh: img.anhChinh || false,
            isNew: false,
          }));
          setProductImages(formatted);
        }

        if (product.bienThe?.length) {
          console.log("Biến thể nhận được:", product.bienThe);
          const formattedVariants = product.bienThe.map(bt => {
            let phanTramGiam = '';
            const giaBan = Number(bt.giaBan) || 0;
            const giaKM = Number(bt.giaKhuyenMai) || 0;
            if (giaBan > 0 && giaKM > 0 && giaKM < giaBan) {
              phanTramGiam = Math.round(((giaBan - giaKM) / giaBan) * 100);
            }
            return {
              ...bt,
              id: bt.maBTSP,
              phanTramGiam: phanTramGiam.toString(),
              thongSoKyThuat: bt.thongSoKyThuat || {},
            };
          });
          setVariants(formattedVariants);
        } else {
          console.log("Không có biến thể từ API");
          setVariants([]);
        }
      } catch (error) {
        console.error("Lỗi fetch:", error);
        showToast("Không thể tải dữ liệu sản phẩm", 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [maSanPham]);

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

  const handleProductImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (currentImageCount + files.length > MAX_IMAGES) {
      showToast(`Chỉ thêm được ${MAX_IMAGES - currentImageCount} ảnh nữa (tối đa ${MAX_IMAGES})`, 'error');
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

    if (newImages.length > 0) {
      setProductImages(prev => [...prev, ...newImages]);
    }
    e.target.value = '';
  };

  const removeImage = (index) => {
    setProductImages(prev => {
      const imgToRemove = prev[index];
      if (imgToRemove?.maHinhAnh && !imgToRemove.isNew) {
        setDeletedImageIds(ids => [...new Set([...ids, imgToRemove.maHinhAnh])]);
      }
      if (imgToRemove?.preview) URL.revokeObjectURL(imgToRemove.preview);
      if (index === 0) {
        showToast("Không thể xóa ảnh chính. Hãy thay thế ảnh chính.", 'error');
        return prev; // Không cho xóa ảnh chính
      } else {
        return prev.filter((_, i) => i !== index);
      }
    });
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
    e.target.value = '';
  };

  const updateVariant = (id, field, value) => {
    setVariants(prev =>
      prev.map(v => {
        if (v.id !== id && v.maBTSP !== id) return v;
        let updated = { ...v, [field]: value };
        if (field === 'phanTramGiam') {
          const phanTram = Number(value);
          if (value !== '' && (phanTram < 0 || phanTram > 100)) {
            updated.phanTramGiam = Math.max(0, Math.min(100, phanTram)).toString();
          }
        }
        if (field === 'giaBan' || field === 'phanTramGiam') {
          const giaBan = Number(updated.giaBan) || 0;
          let phanTram = Number(updated.phanTramGiam) || 0;
          phanTram = Math.max(0, Math.min(100, phanTram));
          if (giaBan > 0) {
            updated.giaKhuyenMai = Math.round(giaBan * (1 - phanTram / 100));
          } else {
            updated.giaKhuyenMai = '';
          }
        }
        return updated;
      })
    );
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`variant_${id}_${field}`];
      return newErrors;
    });
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

  const addVariant = () => {
    const newId = `new-${Date.now()}`;
    setVariants([
      ...variants,
      {
        id: newId,
        maBTSP: null,
        tenBienThe: '',
        giaBan: 0,
        phanTramGiam: '',
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

  const validateForm = () => {
    const newErrors = {};
    if (!basicInfo.tenSanPham?.trim()) {
      newErrors.tenSanPham = 'Vui lòng nhập tên sản phẩm';
    }
    variants.forEach((v) => {
      const vid = v.id || v.maBTSP;
      if (!v.tenBienThe?.trim()) {
        newErrors[`variant_${vid}_tenBienThe`] = 'Vui lòng nhập tên biến thể';
      }
      if (!v.giaBan || Number(v.giaBan) <= 0) {
        newErrors[`variant_${vid}_giaBan`] = 'Giá bán phải lớn hơn 0';
      }
      if (Number(v.soLuongTon) < 0) {
        newErrors[`variant_${vid}_soLuongTon`] = 'Số lượng tồn không hợp lệ';
      }
      const phanTram = Number(v.phanTramGiam);
      if (v.phanTramGiam !== '' && (phanTram < 0 || phanTram > 100)) {
        newErrors[`variant_${vid}_phanTramGiam`] = 'Phần trăm giảm phải từ 0 đến 100';
      }
      if (Number(v.giaKhuyenMai) >= Number(v.giaBan) && Number(v.giaKhuyenMai) > 0) {
        newErrors[`variant_${vid}_giaKhuyenMai`] = 'Giá khuyến mãi phải nhỏ hơn giá bán';
      }
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      showToast('Vui lòng kiểm tra lại các trường phần trăm giảm và thông tin bắt buộc', 'error');
      return false;
    }
    return true;
  };

  const handleUpdateClick = () => {
    if (validateForm()) {
      setIsConfirmUpdateOpen(true);
    } else {
      showToast("Vui lòng kiểm tra lại thông tin biến thể", "error");
    }
  };

  const handleConfirmUpdate = async () => {
    const formData = new FormData();
    const fallback = "Đang cập nhật";
    try {
      setIsUpdating(true);
      formData.append('TenSanPham', basicInfo.tenSanPham.trim());
      formData.append('MaDanhMuc', basicInfo.maDanhMuc);
      formData.append('MaThuongHieu', basicInfo.maThuongHieu);
      formData.append('SoLuongTon', variants.reduce((sum, v) => sum + (Number(v.soLuongTon) || 0), 0));
      deletedImageIds.forEach(id => formData.append('HinhAnhXoa', id));
      productImages.forEach(img => {
        if (img?.file) formData.append('HinhAnhMoi', img.file);
      });
      const mainImg = productImages[0];
      if (mainImg?.isNew) {
        formData.append('AnhMoiDauTienLaAnhChinh', 'true');
      } else if (mainImg?.maHinhAnh) {
        formData.append('MaAnhChinh', mainImg.maHinhAnh);
        formData.append('AnhMoiDauTienLaAnhChinh', 'false');
      }
      deletedVariantIds.forEach(id => formData.append('BienTheXoa', id));
      variants.forEach((v, i) => {
        if (v.maBTSP > 0) formData.append(`BienThe[${i}].MaBTSP`, v.maBTSP);
        formData.append(`BienThe[${i}].TenBienThe`, v.tenBienThe?.trim() || fallback);
        formData.append(`BienThe[${i}].GiaBan`, Number(v.giaBan) || 0);
        formData.append(`BienThe[${i}].GiaKhuyenMai`, Number(v.giaKhuyenMai) || 0);
        formData.append(`BienThe[${i}].MauSac`, v.mauSac?.trim() || fallback);
        formData.append(`BienThe[${i}].Ram`, v.ram?.trim() || fallback);
        formData.append(`BienThe[${i}].OCung`, v.oCung?.trim() || fallback);
        formData.append(`BienThe[${i}].BoXuLyTrungTam`, v.boXuLyTrungTam?.trim() || fallback);
        formData.append(`BienThe[${i}].BoXuLyDoHoa`, v.boXuLyDoHoa?.trim() || fallback);
        formData.append(`BienThe[${i}].SoLuongTon`, Number(v.soLuongTon) || 0);
        formData.append(`BienThe[${i}].TrangThai`, v.trangThai ?? true);
        const ts = v.thongSoKyThuat || {};
        formData.append(`BienThe[${i}].ThongSoKyThuat.KichThuocManHinh`, ts.kichThuocManHinh?.trim() || fallback);
        formData.append(`BienThe[${i}].ThongSoKyThuat.DungLuongRam`, ts.dungLuongRam?.trim() || v.ram?.trim() || fallback);
        formData.append(`BienThe[${i}].ThongSoKyThuat.SoKheRam`, ts.soKheRam?.trim() || "1");
        formData.append(`BienThe[${i}].ThongSoKyThuat.OCung`, ts.oCung?.trim() || v.oCung?.trim() || fallback);
        formData.append(`BienThe[${i}].ThongSoKyThuat.Pin`, ts.pin?.trim() || fallback);
        formData.append(`BienThe[${i}].ThongSoKyThuat.HeDieuHanh`, ts.heDieuHanh?.trim() || fallback);
        formData.append(`BienThe[${i}].ThongSoKyThuat.DoPhanGiaiManHinh`, ts.doPhanGiaiManHinh?.trim() || fallback);
        formData.append(`BienThe[${i}].ThongSoKyThuat.LoaiXuLyTrungTam`, ts.loaiXuLyTrungTam?.trim() || v.boXuLyTrungTam?.trim() || fallback);
        formData.append(`BienThe[${i}].ThongSoKyThuat.LoaiXuLyDoHoa`, ts.loaiXuLyDoHoa?.trim() || v.boXuLyDoHoa?.trim() || fallback);
        formData.append(`BienThe[${i}].ThongSoKyThuat.CongGiaoTiep`, ts.congGiaoTiep?.trim() || fallback);
      });
      await productService.updateProduct(maSanPham, formData);
      showToast("Cập nhật thành công!", "success");
      setDeletedImageIds([]);
      setDeletedVariantIds([]);
      const refreshed = await productService.getDetailProduct(maSanPham);
      if (refreshed) {
        setBasicInfo({
          maSanPham: refreshed.maSanPham,
          tenSanPham: refreshed.tenSanPham || basicInfo.tenSanPham,
          slug: refreshed.slug || basicInfo.slug,
          maDanhMuc: String(refreshed.maDanhMuc || basicInfo.maDanhMuc),
          maThuongHieu: String(refreshed.maThuongHieu || basicInfo.maThuongHieu),
          soLuongTon: refreshed.soLuongTon || basicInfo.soLuongTon,
        });
        if (refreshed.hinhAnh?.length) {
          const formatted = refreshed.hinhAnh.map(img => ({
            id: img.maHinhAnh || `server_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            duongDan: formatImageUrl(img.duongDan || img.duongDanAnh),
            maHinhAnh: img.maHinhAnh,
            anhChinh: img.anhChinh || false,
            isNew: false,
          }));
          setProductImages(formatted);
        }
        if (refreshed.bienThe) {
          const formattedVariants = refreshed.bienThe.map(bt => {
            let phanTramGiam = '';
            const giaBan = Number(bt.giaBan) || 0;
            const giaKM = Number(bt.giaKhuyenMai) || 0;
            if (giaBan > 0 && giaKM > 0 && giaKM < giaBan) {
              phanTramGiam = Math.round(((giaBan - giaKM) / giaBan) * 100);
            }
            return {
              ...bt,
              id: bt.maBTSP,
              phanTramGiam: phanTramGiam.toString(),
              thongSoKyThuat: bt.thongSoKyThuat || {},
            };
          });
          setVariants(formattedVariants);
        }
      }
      setIsEditing(false);
    } catch (error) {
      showToast("Lỗi cập nhật: " + (error.response?.data?.message || error.message || "Không rõ"), "error");
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
      showToast("Xóa thất bại", 'error');
    } finally {
      setIsDeleting(false);
      setIsConfirmDeleteOpen(false);
    }
  };

  if (loading) {
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
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
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

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">

            {/* Hình Ảnh */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon size={20} className="text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Hình Ảnh Sản Phẩm (Tối đa {MAX_IMAGES} ảnh)</h2>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {productImages
                  .filter(img => img !== null && img !== undefined)
                  .map((imgObj, index) => (
                    <div
                      key={imgObj?.id || `empty-${index}`}
                      className={`relative group aspect-square rounded-lg overflow-hidden border-2 transition-all ${imgObj
                        ? 'border-gray-200 hover:border-blue-500'
                        : 'border-dashed border-gray-300 hover:border-blue-500 bg-gray-50'
                        }`}
                    >
                      {imgObj ? (
                        <>
                          <img
                            src={imgObj.preview || imgObj.duongDan}
                            alt={`Ảnh ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {index === 0 && (
                            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md font-semibold shadow-sm">
                              Ảnh chính
                            </div>
                          )}
                          {isEditing && (
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </>
                      ) : isEditing ? (
                        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors text-gray-400 hover:text-blue-500">
                          <Camera size={24} className="mb-2" />
                          <span className="text-xs font-medium">Thay ảnh</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleReplaceImage(e, index)}
                          />
                        </label>
                      ) : null}
                    </div>
                  ))}

                {isEditing && currentImageCount < MAX_IMAGES && (
                  <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group">
                    <Camera size={24} className="text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
                    <span className="text-xs text-gray-500 group-hover:text-blue-600 font-medium transition-colors">Thêm ảnh</span>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handleProductImageUpload}
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
              <div className="space-y-4">
                <InputField
                  label="Tên Sản Phẩm *"
                  value={basicInfo.tenSanPham}
                  onChange={(v) => setBasicInfo({ ...basicInfo, tenSanPham: v })}
                  disabled={!isEditing}
                  placeholder="VD: Dell XPS 15 9520"
                  error={errors.tenSanPham}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700">Danh Mục *</label>
                    <select
                      value={basicInfo.maDanhMuc}
                      onChange={(e) => setBasicInfo({ ...basicInfo, maDanhMuc: e.target.value })}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2.5 rounded-lg text-sm transition-all ${!isEditing ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed' : 'bg-white border focus:border-blue-500'}`}
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map(cat => (
                        <option key={cat.maDanhMuc} value={String(cat.maDanhMuc)}>
                          {cat.tenDanhMuc}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700">Thương Hiệu *</label>
                    <select
                      value={basicInfo.maThuongHieu}
                      onChange={(e) => setBasicInfo({ ...basicInfo, maThuongHieu: e.target.value })}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2.5 rounded-lg text-sm transition-all ${!isEditing ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed' : 'bg-white border focus:border-blue-500'}`}
                    >
                      <option value="">Chọn thương hiệu</option>
                      {brands.map(brand => (
                        <option key={brand.maThuongHieu} value={String(brand.maThuongHieu)}>
                          {brand.tenThuongHieu}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <InputField
                  label="Slug"
                  value={basicInfo.slug}
                  disabled={true}
                />
              </div>
            </div>

            {/* Biến Thể */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
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
                const giaBanNum = Number(variant.giaBan) || 0;
                const phanTramNum = Number(variant.phanTramGiam) || 0;
                const giaKMHienThi = (giaBanNum > 0 && phanTramNum >= 0 && phanTramNum <= 100)
                  ? Math.round(giaBanNum * (1 - phanTramNum / 100)).toLocaleString('vi-VN')
                  : '';

                return (
                  <div
                    key={id}
                    className={`border border-gray-200 rounded-2xl mb-6 overflow-hidden shadow-sm ${isOpen ? 'bg-blue-50/30' : ''}`}
                  >
                    <div
                      className="p-4 bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => toggleSpecs(id)}
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
                        {isEditing && variants.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeVariant(id);
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
                            onChange={(val) => updateVariant(id, 'tenBienThe', val)}
                            disabled={!isEditing}
                            error={errors[`variant_${id}_tenBienThe`]}
                            placeholder="VD: Core i7, 16GB RAM"
                          />
                          <InputField
                            label="Giá bán (VNĐ) *"
                            type="number"
                            value={variant.giaBan}
                            onChange={(val) => updateVariant(id, 'giaBan', val)}
                            disabled={!isEditing}
                            error={errors[`variant_${id}_giaBan`]}
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
                              onChange={(e) => {
                                const val = e.target.value;
                                updateVariant(id, 'phanTramGiam', val);
                                const phanTram = Number(val);
                                if (val !== '' && (phanTram < 0 || phanTram > 100)) {
                                  setErrors(prev => ({
                                    ...prev,
                                    [`variant_${id}_phanTramGiam`]: 'Phần trăm giảm phải từ 0 đến 100'
                                  }));
                                }
                              }}
                              disabled={!isEditing}
                              placeholder="0 - 100"
                              className={`w-full px-4 py-2.5 rounded-xl outline-none transition-all duration-200 border ${errors[`variant_${id}_phanTramGiam`]
                                ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                                : 'bg-white border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-gray-900 shadow-sm'
                                }`}
                            />
                            {errors[`variant_${id}_phanTramGiam`] && (
                              <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                                <AlertCircle size={12} /> {errors[`variant_${id}_phanTramGiam`]}
                              </p>
                            )}
                            {giaKMHienThi && isEditing && (
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
                            onChange={(val) => updateVariant(id, 'mauSac', val)}
                            disabled={!isEditing}
                            placeholder="VD: Đen"
                          />
                          <InputField
                            label="RAM"
                            value={variant.ram}
                            onChange={(val) => updateVariant(id, 'ram', val)}
                            disabled={!isEditing}
                            placeholder="VD: 16GB"
                          />
                          <InputField
                            label="Ổ cứng"
                            value={variant.oCung}
                            onChange={(val) => updateVariant(id, 'oCung', val)}
                            disabled={!isEditing}
                            placeholder="VD: 512GB SSD"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <InputField
                            label="CPU"
                            value={variant.boXuLyTrungTam}
                            onChange={(val) => updateVariant(id, 'boXuLyTrungTam', val)}
                            disabled={!isEditing}
                            placeholder="VD: Intel Core i7-12700H"
                          />
                          <InputField
                            label="GPU"
                            value={variant.boXuLyDoHoa}
                            onChange={(val) => updateVariant(id, 'boXuLyDoHoa', val)}
                            disabled={!isEditing}
                            placeholder="VD: NVIDIA RTX 3060"
                          />
                          <InputField
                            label="Số lượng tồn *"
                            type="number"
                            value={variant.soLuongTon}
                            onChange={(val) => updateVariant(id, 'soLuongTon', val)}
                            disabled={!isEditing}
                            error={errors[`variant_${id}_soLuongTon`]}
                            placeholder="0"
                          />
                        </div>

                        <div className="border-t pt-6">
                          <h4 className="text-lg font-bold text-gray-800 mb-4">Thông số kỹ thuật</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <InputField
                              label="Kích thước màn hình"
                              value={variant.thongSoKyThuat?.kichThuocManHinh || ''}
                              onChange={(val) => updateVariantSpec(id, 'kichThuocManHinh', val)}
                              disabled={!isEditing}
                              placeholder='VD: 15.6"'
                            />
                            <InputField
                              label="Độ phân giải"
                              value={variant.thongSoKyThuat?.doPhanGiaiManHinh || ''}
                              onChange={(val) => updateVariantSpec(id, 'doPhanGiaiManHinh', val)}
                              disabled={!isEditing}
                              placeholder="VD: 1920x1080 (Full HD)"
                            />
                            <InputField
                              label="Hệ điều hành"
                              value={variant.thongSoKyThuat?.heDieuHanh || ''}
                              onChange={(val) => updateVariantSpec(id, 'heDieuHanh', val)}
                              disabled={!isEditing}
                              placeholder="VD: Windows 11 Home"
                            />
                            <InputField
                              label="Pin"
                              value={variant.thongSoKyThuat?.pin || ''}
                              onChange={(val) => updateVariantSpec(id, 'pin', val)}
                              disabled={!isEditing}
                              placeholder="VD: 56Wh"
                            />
                            <InputField
                              label="Số khe RAM"
                              value={variant.thongSoKyThuat?.soKheRam || ''}
                              onChange={(val) => updateVariantSpec(id, 'soKheRam', val)}
                              disabled={!isEditing}
                              placeholder="VD: 2"
                            />
                            <InputField
                              label="Cổng giao tiếp"
                              value={variant.thongSoKyThuat?.congGiaoTiep || ''}
                              onChange={(val) => updateVariantSpec(id, 'congGiaoTiep', val)}
                              disabled={!isEditing}
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
                  <span className="font-bold text-gray-900">
                    {currentImageCount} / {MAX_IMAGES}
                  </span>
                </div>
                <div className="pt-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-xs text-blue-800 leading-relaxed">
                      <strong>Lưu ý:</strong> Ảnh đầu tiên sẽ là ảnh chính. Tối đa {MAX_IMAGES} ảnh. Chỉ chấp nhận file ≤ 5MB.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div className={`px-6 py-4 rounded-lg shadow-lg border-l-4 ${toast.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' : 'bg-red-50 border-red-500 text-red-800'}`}>
            <div className="flex items-center gap-3">
              <AlertCircle size={20} />
              <span className="font-medium">{toast.message}</span>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={isConfirmDeleteOpen}
        message="Dữ liệu bị xóa sẽ không thể khôi phục. Bạn chắc chắn muốn xóa sản phẩm này?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmDeleteOpen(false)}
        isLoading={isDeleting}
      />

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