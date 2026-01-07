import React, { useState } from 'react';
import { Plus, Trash2, Camera, X, Image as ImageIcon } from 'lucide-react';

const ProductForm = () => {
  // --- States ---
  const [images, setImages] = useState([]); 
  const [basicInfo, setBasicInfo] = useState({
    tenSanPham: '', giaCoBan: 0, khuyenMai: 0, soLuongTon: 0, maDanhMuc: '', maThuongHieu: ''
  });
  const [specs, setSpecs] = useState({
    kichThuocManHinh: '', soKheRam: '', oCung: '', pin: '', heDieuHanh: '', doPhanGiaiManHinh: '', loaiXuLyTrungTam: '', loaiXuLyDoHoa: '', congGiaoTiep: ''
  });
  const [variants, setVariants] = useState([]);

  // --- Handlers ---
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

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addVariant = () => {
    setVariants([...variants, {
      id: Math.random().toString(36).substr(2, 9),
      tenBienThe: '', giaBan: 0, giaKhuyenMai: 0, mauSac: '', ram: '', oCung: '', manHinh: '', boXuLyDoHoa: '', boXuLyTrungTam: '', soLuongTon: 0, hinhAnh: []
    }]);
  };

  const updateVariant = (id, field, value) => {
    setVariants(variants.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const removeVariant = (id) => setVariants(variants.filter(v => v.id !== id));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...basicInfo,
      maDanhMuc: Number(basicInfo.maDanhMuc),
      maThuongHieu: Number(basicInfo.maThuongHieu),
      thongSoKyThuat: specs,
      bienThe: variants.map(({ id, ...rest }) => ({
        ...rest,
        hinhAnh: images // API nhận mảng chuỗi hình ảnh
      }))
    };
    console.log('API Payload:', payload);
  };

  const InputField = ({ label, value, onChange, type = "text", placeholder }) => (
    <div className="flex flex-col gap-1.5 w-full text-left">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900"
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-20 bg-gray-50 min-h-screen">
      
      {/* 1. THÔNG TIN CƠ BẢN & ẢNH (GIỐNG UI MẪU) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        <section className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-[#2D3748] mb-6 uppercase tracking-tight">Ảnh Sản Phẩm</h2>
          
          <div className="flex flex-col gap-4">
            {/* KHU VỰC ẢNH CHÍNH */}
            <div className="relative aspect-square w-full border-2 border-dashed border-gray-300 rounded-3xl bg-[#F8FAFC] flex flex-col items-center justify-center overflow-hidden group transition-all hover:border-blue-400">
              {images.length > 0 ? (
                <>
                  <img src={images[0]} className="w-full h-full object-cover" alt="Main" />
                  <button 
                    type="button" onClick={() => removeImage(0)}
                    className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm text-red-500 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={20} />
                  </button>
                </>
              ) : (
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera size={32} />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Ảnh Chính</p>
                  <p className="text-xs text-gray-400 mt-1">Hỗ trợ JPG, PNG (Max 5MB)</p>
                </div>
              )}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} multiple />
            </div>

            {/* DANH SÁCH ẢNH PHỤ */}
            <div className="flex flex-wrap gap-3">
              {images.slice(1).map((img, idx) => (
                <div key={idx + 1} className="relative w-20 h-20 rounded-xl border border-gray-200 overflow-hidden group shadow-sm">
                  <img src={img} className="w-full h-full object-cover" alt={`Sub ${idx}`} />
                  <button 
                    type="button" onClick={() => removeImage(idx + 1)}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              
              {/* NÚT THÊM ẢNH PHỤ */}
              <label className="w-20 h-20 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all text-gray-400">
                <Plus size={24} />
                <input type="file" className="hidden" onChange={handleImageUpload} multiple />
              </label>
            </div>
          </div>
        </section>

        {/* THÔNG TIN CƠ BẢN */}
        <section className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-6 uppercase tracking-tight">Thông tin sản phẩm</h2>
          <div className="space-y-4">
            <InputField label="Tên sản phẩm" value={basicInfo.tenSanPham} onChange={(val) => setBasicInfo({...basicInfo, tenSanPham: val})} placeholder="Ví dụ: Laptop Apple MacBook Pro" />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Giá gốc (VNĐ)" type="number" value={basicInfo.giaCoBan} onChange={(val) => setBasicInfo({...basicInfo, giaCoBan: Number(val)})} />
              <InputField label="Khuyến mãi (%)" type="number" value={basicInfo.khuyenMai} onChange={(val) => setBasicInfo({...basicInfo, khuyenMai: Number(val)})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Mã danh mục" type="number" value={basicInfo.maDanhMuc} onChange={(val) => setBasicInfo({...basicInfo, maDanhMuc: val})} />
              <InputField label="Mã thương hiệu" type="number" value={basicInfo.maThuongHieu} onChange={(val) => setBasicInfo({...basicInfo, maThuongHieu: val})} />
            </div>
          </div>
        </section>
      </div>

      {/* 2. THÔNG SỐ KỸ THUẬT */}
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-left">
        <h2 className="text-xl font-black text-gray-800 uppercase mb-8 border-b pb-4">Thông Số Kỹ Thuật</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField label="Màn hình" value={specs.kichThuocManHinh} onChange={(v) => setSpecs({...specs, kichThuocManHinh: v})} />
          <InputField label="RAM" value={specs.soKheRam} onChange={(v) => setSpecs({...specs, soKheRam: v})} />
          <InputField label="Ổ cứng" value={specs.oCung} onChange={(v) => setSpecs({...specs, oCung: v})} />
          <InputField label="PIN" value={specs.pin} onChange={(v) => setSpecs({...specs, pin: v})} />
          <InputField label="Hệ điều hành" value={specs.heDieuHanh} onChange={(v) => setSpecs({...specs, heDieuHanh: v})} />
          <InputField label="Độ phân giải" value={specs.doPhanGiaiManHinh} onChange={(v) => setSpecs({...specs, doPhanGiaiManHinh: v})} />
          <InputField label="CPU" value={specs.loaiXuLyTrungTam} onChange={(v) => setSpecs({...specs, loaiXuLyTrungTam: v})} />
          <InputField label="GPU" value={specs.loaiXuLyDoHoa} onChange={(v) => setSpecs({...specs, loaiXuLyDoHoa: v})} />
          <InputField label="Cổng kết nối" value={specs.congGiaoTiep} onChange={(v) => setSpecs({...specs, congGiaoTiep: v})} />
        </div>
      </section>

      {/* 3. BIẾN THỂ SẢN PHẨM */}
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-left">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h2 className="text-xl font-black text-gray-800 uppercase tracking-wider">Biến Thể</h2>
          <button type="button" onClick={addVariant} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
            <Plus size={18} /> Thêm biến thể
          </button>
        </div>
        
        <div className="max-h-[500px] overflow-y-auto pr-2 space-y-6 custom-scrollbar">
          {variants.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50 text-gray-400">Chưa có biến thể nào được tạo.</div>
          ) : (
            variants.map((variant, index) => (
              <div key={variant.id} className="p-6 rounded-3xl border border-gray-200 bg-gray-50 relative group hover:border-blue-300 transition-all">
                <button type="button" onClick={() => removeVariant(variant.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={20} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <InputField label="Tên biến thể" value={variant.tenBienThe} onChange={(v) => updateVariant(variant.id, 'tenBienThe', v)} />
                  <InputField label="Giá bán" type="number" value={variant.giaBan} onChange={(v) => updateVariant(variant.id, 'giaBan', Number(v))} />
                  <InputField label="Tồn kho" type="number" value={variant.soLuongTon} onChange={(v) => updateVariant(variant.id, 'soLuongTon', Number(v))} />
                  <InputField label="Màu sắc" value={variant.mauSac} onChange={(v) => updateVariant(variant.id, 'mauSac', v)} />
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </form>
  );
};

export default ProductForm;