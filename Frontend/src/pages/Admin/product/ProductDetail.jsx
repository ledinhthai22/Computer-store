import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toast from '../../../components/admin/Toast';
import { Trash2, Camera, X, Edit3, Save, ArrowLeft, Plus } from 'lucide-react';
import ConfirmModal from '../../../components/admin/DeleteConfirmModal';

const ProductDetail = () => {
  const { maSanPham } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [images, setImages] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
    
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [basicInfo, setBasicInfo] = useState({
    maSanPham: null, tenSanPham: '', giaCoBan: 0, khuyenMai: 0, maDanhMuc: '', maThuongHieu: ''
  });
  const [specs, setSpecs] = useState({
    kichThuocManHinh: '', soKheRam: '', oCung: '', pin: '', heDieuHanh: '',
    doPhanGiaiManHinh: '', loaiXuLyTrungTam: '', loaiXuLyDoHoa: '', congGiaoTiep: ''
  });
  const [variants, setVariants] = useState([]);
  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, brandRes] = await Promise.all([
        axios.get(`https://localhost:7012/api/Product/${maSanPham}`),
        axios.get(`https://localhost:7012/api/Category`),
        axios.get(`https://localhost:7012/api/Brand`)
      ]);

      const data = prodRes.data;
      const categoriesData = catRes.data;
      const brandsData = brandRes.data;

      setCategories(categoriesData);
      setBrands(brandsData);

      const foundCat = categoriesData.find(c => c.tenDanhMuc === data.tenDanhMuc);
      const maDanhMucFound = foundCat ? foundCat.maDanhMuc : "";

      const foundBrand = brandsData.find(b => b.brandName === data.tenThuongHieu);
      const maThuongHieuFound = foundBrand ? foundBrand.brandID : "";

      setBasicInfo({
        maSanPham: data.maSanPham,
        tenSanPham: data.tenSanPham,
        giaCoBan: data.giaCoBan,
        khuyenMai: data.khuyenMai,
        maDanhMuc: String(maDanhMucFound), 
        maThuongHieu: String(maThuongHieuFound)
      });

      setSpecs(data.thongSoKyThuat || {});
      setVariants(data.bienThe || []);
      const allImages = data.bienThe?.flatMap(v => v.hinhAnh) || [];
      setImages([...new Set(allImages)]);

    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [maSanPham]);
  
  const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
  };

  //UPLOAD ẢNH
  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files) {
      const readers = Array.from(files).map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });
      Promise.all(readers).then((newImages) => setImages((prev) => [...prev, ...newImages]));
    }
  };

  const removeImage = (index) => setImages((prev) => prev.filter((_, i) => i !== index));

  //BIEN THE SAN PHAM
  const addVariant = () => {
    setVariants([...variants, {
      id: Math.random().toString(36).substr(2, 9),
      tenBienThe: '', giaBan: 0, giaKhuyenMai: 0, mauSac: '', ram: '', oCung: '', 
      manHinh: '', boXuLyDoHoa: '', boXuLyTrungTam: '', soLuongTon: 0, hinhAnh: []
    }]);
  };
  const updateVariant = (id, field, value) => {
    setVariants(variants.map(v => (v.id === id || v.maBienThe === id) ? { ...v, [field]: value } : v));
  };
  const removeVariant = (id) => setVariants(variants.filter(v => v.id !== id && v.maBienThe !== id));

  //CAP NHAT SAN PHAM
  const handleUpdate = async () => {
    const payload = {
      ...basicInfo,
      maDanhMuc: Number(basicInfo.maDanhMuc),
      maThuongHieu: Number(basicInfo.brandID),
      thongSoKyThuat: specs,
      bienThe: variants.map(v => ({ ...v, hinhAnh: images })) // Đồng bộ ảnh cho các biến thể
    };

    try {
      await axios.put(`https://localhost:7012/api/Product/${maSanPham}`, payload);
      showToast("Chỉnh sửa sản phẩm thành công!", "success");
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      showToast("Chỉnh sửa sản phẩm thất bại.", "error");
    }
  };

  //XOA SAN PHAM
  const handleDeleteClick = (id) => {
        setDeleteId(id);
        setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
      try {
        setIsDeleting(true);
        await axios.delete(`https://localhost:7012/api/Product/${maSanPham}`);
        showToast("Xóa sản phẩm thành công", "success");
        navigate('/quan-ly/san-pham');
      } catch (err) {
        console.error(err)
        showToast("Xóa sản phẩm thất bại", "error");
      } finally {
            setIsDeleting(false);
            setIsConfirmOpen(false);
            setDeleteId(null);
        }
    };

  const InputField = ({ label, value, onChange, type = "text", disabled = !isEditing }) => (
    <div className="flex flex-col gap-1.5 w-full text-left">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <input
        type={type} value={value || ''} 
        onChange={(e) => onChange(e.target.value)} 
        disabled={disabled}
        className={`w-full px-4 py-2 rounded-lg outline-none transition-all ${
          disabled ? 'bg-gray-100 text-gray-500 border-transparent' : 'bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-900'
        }`}
      />
    </div>
  );

  if (loading) return <div className="p-10 text-center">Đang tải dữ liệu sản phẩm...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-20 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium cursor-pointer whitespace-nowrap">
          <ArrowLeft size={20} /> Quay lại
        </button>
        <div className="flex gap-3">
          {!isEditing ? (
            <>
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-6 py-2 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 shadow-md cursor-pointer">
                <Edit3 size={18} /> Chỉnh sửa
              </button>
              <button onClick={handleDeleteClick} className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 shadow-md cursor-pointer">
                <Trash2 size={18} /> Xóa
              </button>
            </>
          ) : (
            <>
                <button onClick={() => setIsEditing(false)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 cursor-pointer">Hủy</button>
                <button onClick={handleUpdate} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md cursor-pointer">
                <Save size={18} /> Lưu chỉnh sửa
                </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        {/* HÌNH ẢNH */}
        <section className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full border-2 border-dashed border-gray-300 rounded-3xl bg-[#F8FAFC] flex flex-col items-center justify-center overflow-hidden group">
              {images.length > 0 ? (
                <>
                  <img src={images[0]} className="w-full h-full object-cover" alt="Main" />
                  {isEditing && (
                    <button type="button" onClick={() => removeImage(0)} className="absolute top-4 right-4 p-2 bg-white/80 text-red-500 rounded-full shadow-md cursor-pointer">
                        <Trash2 size={20} />
                    </button>
                  )}
                </>
              ) : <Camera size={32} className="text-gray-400" />}
              {isEditing && <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} multiple />}
            </div>
            <div className="flex flex-wrap gap-3">
              {images.slice(1).map((img, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-xl border border-gray-200 overflow-hidden group shadow-sm">
                  <img src={img} className="w-full h-full object-cover" alt="Sub" />
                  {isEditing && (
                    <button type="button" onClick={() => removeImage(idx + 1)} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              {isEditing && (
                <label className="w-20 h-20 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 cursor-pointer text-gray-400">
                  <Plus size={24} /><input type="file" className="hidden" onChange={handleImageUpload} multiple />
                </label>
              )}
            </div>
          </div>
        </section>

        {/* THÔNG TIN CHÍNH */}
        <section className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-6 uppercase">Thông tin sản phẩm</h2>
          <div className="space-y-4">
            <InputField label="Tên sản phẩm" value={basicInfo.tenSanPham} onChange={(v) => setBasicInfo({...basicInfo, tenSanPham: v})} />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Giá gốc (VNĐ)" type="number" value={basicInfo.giaCoBan} onChange={(v) => setBasicInfo({...basicInfo, giaCoBan: v})} />
              <InputField label="Khuyến mãi (%)" type="number" value={basicInfo.khuyenMai} onChange={(v) => setBasicInfo({...basicInfo, khuyenMai: v})} />
            </div>
            <div className="grid grid gap-4">
              <InputField label="Số lượng tồn" type="number" value={basicInfo.soLuongTon} onChange={(v) => setBasicInfo({...basicInfo, soLuongTon: v})} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-left">
              {/* SELECT BOX DANH MỤC */}
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-semibold text-gray-700">Danh mục</label>
                <select 
                  disabled={!isEditing}
                  value={String(basicInfo.maDanhMuc)} // Đảm bảo value là string để khớp option
                  onChange={(e) => setBasicInfo({...basicInfo, maDanhMuc: e.target.value})}
                  className={`w-full px-4 py-2 rounded-lg outline-none transition-all ${
                    !isEditing ? 'bg-gray-100 text-gray-500 border-transparent' : 'bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500'
                  }`}
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map(cat => (
                    <option key={cat.maDanhMuc} value={String(cat.maDanhMuc)}>{cat.tenDanhMuc}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-semibold text-gray-700">Thương hiệu</label>
                <select 
                  disabled={!isEditing}
                  value={String(basicInfo.maThuongHieu)} 
                  onChange={(e) => setBasicInfo({...basicInfo, maThuongHieu: e.target.value})}
                  className={`w-full px-4 py-2 rounded-lg outline-none transition-all ${
                    !isEditing ? 'bg-gray-100 text-gray-500 border-transparent' : 'bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500'
                  }`}
                >
                  <option value="">Chọn thương hiệu</option>
                  {brands.map(brand => (
                    <option key={brand.brandID} value={String(brand.brandID)}>{brand.brandName}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* THÔNG SỐ KỸ THUẬT */}
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-left">
        <h2 className="text-xl font-black text-gray-800 uppercase mb-8 border-b pb-4">Thông Số Kỹ Thuật</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField label="Màn hình" value={specs.kichThuocManHinh} onChange={(v) => setSpecs({...specs, kichThuocManHinh: v})} />
          <InputField label="Số khe RAM" value={specs.soKheRam} onChange={(v) => setSpecs({...specs, soKheRam: v})} />
          <InputField label="Ổ cứng" value={specs.oCung} onChange={(v) => setSpecs({...specs, oCung: v})} />
          <InputField label="PIN" value={specs.pin} onChange={(v) => setSpecs({...specs, pin: v})} />
          <InputField label="Hệ điều hành" value={specs.heDieuHanh} onChange={(v) => setSpecs({...specs, heDieuHanh: v})} />
          <InputField label="Độ phân giải" value={specs.doPhanGiaiManHinh} onChange={(v) => setSpecs({...specs, doPhanGiaiManHinh: v})} />
          <InputField label="CPU" value={specs.loaiXuLyTrungTam} onChange={(v) => setSpecs({...specs, loaiXuLyTrungTam: v})} />
          <InputField label="GPU" value={specs.loaiXuLyDoHoa} onChange={(v) => setSpecs({...specs, loaiXuLyDoHoa: v})} />
          <InputField label="Cổng kết nối" value={specs.congGiaoTiep} onChange={(v) => setSpecs({...specs, congGiaoTiep: v})} />
        </div>
      </section>

      {/* BIẾN THỂ */}
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-left">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h2 className="text-xl font-black text-gray-800 uppercase tracking-wider">Biến Thể Sản Phẩm</h2>
          {isEditing && (
            <button type="button" onClick={addVariant} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700  cursor-pointer">
              <Plus size={18} /> Thêm biến thể
            </button>
          )}
        </div>
        <div className="max-h-[650px] overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {variants.map((v) => (
            <div key={v.maBienThe || v.id} className="p-6 rounded-3xl border border-gray-200 bg-gray-50 relative group">
              {isEditing && (
                <button type="button" onClick={() => removeVariant(v.maBienThe || v.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 cursor-pointer">
                  <Trash2 size={20} />
                </button>
              )}
              <div className="w-full mb-5">
              <InputField label="Tên biến thể" value={v.tenBienThe} onChange={(val) => updateVariant(v.maBienThe || v.id, 'tenBienThe', val)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <InputField label="Màu sắc" value={v.mauSac} onChange={(val) => updateVariant(v.maBienThe || v.id, 'mauSac', val)} /> 
                <InputField label="Giá khuyến mãi" value={v.giaKhuyenMai} onChange={(val) => updateVariant(v.maBienThe || v.id, 'giaKhuyenMai', val)} />
                <InputField label="RAM" value={v.ram} onChange={(val) => updateVariant(v.maBienThe || v.id, 'ram', val)} />
                <InputField label="Giá bán" type="number" value={v.giaBan} onChange={(val) => updateVariant(v.maBienThe || v.id, 'giaBan', Number(val))} />
                <InputField label="Ổ cứng" value={v.oCung} onChange={(val) => updateVariant(v.maBienThe || v.id, 'oCung', val)} />
                <InputField label="CPU" value={v.boXuLyTrungTam} onChange={(val) => updateVariant(v.maBienThe || v.id, 'boXuLyTrungTam', val)} />
                <InputField label="GPU" value={v.boXuLyDoHoa} onChange={(val) => updateVariant(v.maBienThe || v.id, 'boXuLyDoHoa', val)} />
                <InputField label="Tồn kho" type="number" value={v.soLuongTon} onChange={(val) => updateVariant(v.maBienThe || v.id, 'soLuongTon', Number(val))} />
              </div>
            </div>
          ))}
        </div>
      </section>
      {toast.show && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast({ ...toast, show: false })} 
                />
            )}
            
            <ConfirmModal 
                isOpen={isConfirmOpen}
                message="Bạn có muốn xóa sản phẩm này không?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsConfirmOpen(false)}
                isLoading={isDeleting}
            />
    </div>
  );
};

export default ProductDetail;