import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trash2, Camera, X, Save, ArrowLeft, Plus } from 'lucide-react';

// --- 1. ĐƯA COMPONENT NÀY RA NGOÀI ĐỂ TRÁNH MẤT FOCUS ---
const InputField = ({ label, value, onChange, type = "text", disabled = false }) => (
    <div className="flex flex-col gap-2 w-full text-left">
        <label className="text-[14px] font-medium text-gray-700 ml-1">{label}</label>
        <input
            type={type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={`w-full px-4 py-3 rounded-xl outline-none transition-all ${
                disabled 
                    ? 'bg-[#F1F4F9] text-gray-500 border-transparent' 
                    : 'bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 text-gray-900 shadow-sm'
            }`}
        />
    </div>
);

const AddProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    const [basicInfo, setBasicInfo] = useState({
        tenSanPham: '', giaCoBan: 0, khuyenMai: 0, maDanhMuc: '', maThuongHieu: ''
    });

    const [specs, setSpecs] = useState({
        soKheRam: '', oCung: '', pin: '', heDieuHanh: '',
        doPhanGiaiManHinh: '', loaiXuLyTrungTam: '', loaiXuLyDoHoa: '', congGiaoTiep: ''
    });

    const [variants, setVariants] = useState([{
        id: Math.random().toString(36).substr(2, 9),
        tenBienThe: '', giaBan: 0, giaKhuyenMai: 0, mauSac: '', ram: '', oCung: '',
        manHinh: '', boXuLyDoHoa: '', boXuLyTrungTam: '', soLuongTon: 0, hinhAnh: []
    }]);

    // Fetch Metadata (Categories, Brands)
    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const [catRes, brandRes] = await Promise.all([
                    axios.get(`https://localhost:7012/api/Category`),
                    axios.get(`https://localhost:7012/api/Brand`)
                ]);
                setCategories(catRes.data);
                setBrands(brandRes.data);
            } catch (error) {
                console.error("Lỗi khi tải metadata:", error);
            }
        };
        fetchMetadata();
    }, []);

    // Image Handlers
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

    // Variant Handlers
    const addVariant = () => {
        setVariants([...variants, {
            id: Math.random().toString(36).substr(2, 9),
            tenBienThe: '', giaBan: 0, giaKhuyenMai: 0, mauSac: '', ram: '', oCung: '',
            manHinh: '', boXuLyDoHoa: '', boXuLyTrungTam: '', soLuongTon: 0, hinhAnh: []
        }]);
    };

    const updateVariant = (id, field, value) => {
        setVariants(variants.map(v => v.id === id ? { ...v, [field]: value } : v));
    };

    const removeVariant = (id) => {
        if (variants.length > 1) {
            setVariants(variants.filter(v => v.id !== id));
        } else {
            alert("Sản phẩm phải có ít nhất một biến thể.");
        }
    };

    const handleSave = async () => {
        if (!basicInfo.tenSanPham || !basicInfo.maDanhMuc || !basicInfo.maThuongHieu) {
            alert("Vui lòng nhập tên sản phẩm, danh mục và thương hiệu!");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                ...basicInfo,
                maDanhMuc: Number(basicInfo.maDanhMuc),
                brandID: Number(basicInfo.maThuongHieu),
                thongSoKyThuat: specs,
                bienThe: variants.map(v => ({ ...v, hinhAnh: images }))
            };
            await axios.post(`https://localhost:7012/create/`, payload);
            alert("Thêm sản phẩm thành công!");
            navigate('/quan-ly/san-pham');
        } catch (error) {
            console.error("Lỗi API:", error);
            alert("Lỗi: " + (error.response?.data?.message || "Không thể lưu"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-20 bg-gray-50 min-h-screen">
            {/* Action Bar */}
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-bold transition-all cursor-pointer">
                    <ArrowLeft size={20} /> Quay lại
                </button>
                <button 
                    onClick={handleSave} 
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md disabled:bg-gray-400 transition-all active:scale-95"
                >
                    <Plus size={20} />
                    {loading ? "Đang xử lý..." : "Thêm sản phẩm"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                {/* HÌNH ẢNH */}
                <section className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-800 mb-6 uppercase tracking-tight">Ảnh Sản Phẩm</h2>
                    <div className="flex flex-col gap-4">
                        <div className="relative aspect-square w-full border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50 flex flex-col items-center justify-center overflow-hidden transition-all hover:bg-gray-100 group">
                            {images.length > 0 ? (
                                <>
                                    <img src={images[0]} className="w-full h-full object-cover" alt="Main" />
                                    <button type="button" onClick={() => removeImage(0)} className="absolute top-4 right-4 p-2 bg-white/90 text-red-500 rounded-full shadow-lg hover:bg-red-50 transition-all">
                                        <Trash2 size={20} />
                                    </button>
                                </>
                            ) : (
                                <div className="text-center">
                                    <div className="bg-blue-50 p-4 rounded-full mb-3 inline-block">
                                        <Camera size={32} className="text-blue-500" />
                                    </div>
                                    <p className="text-gray-400 font-medium">Chọn ảnh chính</p>
                                </div>
                            )}
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} multiple />
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                            {images.slice(1).map((img, idx) => (
                                <div key={idx} className="relative w-20 h-20 rounded-xl border border-gray-100 overflow-hidden group shadow-sm">
                                    <img src={img} className="w-full h-full object-cover" alt="Sub" />
                                    <button type="button" onClick={() => removeImage(idx + 1)} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
                                        <X size={18} />
                                    </button>
                                </div>
                            ))}
                            <label className="w-20 h-20 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-white cursor-pointer text-gray-400 hover:border-blue-400 hover:text-blue-400 transition-all">
                                <Plus size={24} />
                                <input type="file" className="hidden" onChange={handleImageUpload} multiple />
                            </label>
                        </div>
                    </div>
                </section>

                {/* THÔNG TIN CHÍNH */}
                <section className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-800 mb-6 uppercase tracking-tight">Thông tin cơ bản</h2>
                    <div className="space-y-5">
                        <InputField label="Tên sản phẩm" value={basicInfo.tenSanPham} onChange={(v) => setBasicInfo({ ...basicInfo, tenSanPham: v })} />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Giá gốc (VNĐ)" type="number" value={basicInfo.giaCoBan} onChange={(v) => setBasicInfo({ ...basicInfo, giaCoBan: Number(v) })} />
                            <InputField label="Khuyến mãi (%)" type="number" value={basicInfo.khuyenMai} onChange={(v) => setBasicInfo({ ...basicInfo, khuyenMai: Number(v) })} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] font-medium text-gray-700 ml-1">Danh mục</label>
                                <select
                                    value={basicInfo.maDanhMuc}
                                    onChange={(e) => setBasicInfo({ ...basicInfo, maDanhMuc: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
                                >
                                    <option value="">Chọn danh mục</option>
                                    {categories.map(cat => (
                                        <option key={cat.maDanhMuc} value={String(cat.maDanhMuc)}>{cat.tenDanhMuc}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] font-medium text-gray-700 ml-1">Thương hiệu</label>
                                <select
                                    value={basicInfo.maThuongHieu}
                                    onChange={(e) => setBasicInfo({ ...basicInfo, maThuongHieu: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
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
                    <InputField label="Màn hình" value={specs.kichThuocManHinh} onChange={(v) => setSpecs({ ...specs, kichThuocManHinh: v })} />
                    <InputField label="Số khe RAM" value={specs.soKheRam} onChange={(v) => setSpecs({ ...specs, soKheRam: v })} />
                    <InputField label="Ổ cứng" value={specs.oCung} onChange={(v) => setSpecs({ ...specs, oCung: v })} />
                    <InputField label="PIN" value={specs.pin} onChange={(v) => setSpecs({ ...specs, pin: v })} />
                    <InputField label="Hệ điều hành" value={specs.heDieuHanh} onChange={(v) => setSpecs({ ...specs, heDieuHanh: v })} />
                    <InputField label="Độ phân giải" value={specs.doPhanGiaiManHinh} onChange={(v) => setSpecs({ ...specs, doPhanGiaiManHinh: v })} />
                    <InputField label="CPU" value={specs.loaiXuLyTrungTam} onChange={(v) => setSpecs({ ...specs, loaiXuLyTrungTam: v })} />
                    <InputField label="GPU" value={specs.loaiXuLyDoHoa} onChange={(v) => setSpecs({ ...specs, loaiXuLyDoHoa: v })} />
                    <InputField label="Cổng kết nối" value={specs.congGiaoTiep} onChange={(v) => setSpecs({ ...specs, congGiaoTiep: v })} />
                </div>
            </section>

            {/* BIẾN THỂ */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-left">
                <div className="flex justify-between items-center mb-8 border-b pb-4">
                    <h2 className="text-xl font-black text-gray-800 uppercase tracking-wider">Danh sách biến thể</h2>
                    <button type="button" onClick={addVariant} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-md">
                        <Plus size={18} /> Thêm cấu hình mới
                    </button>
                </div>
                <div className="max-h-[650px] overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {variants.map((v) => (
                        <div key={v.id} className="p-6 rounded-3xl border border-gray-200 bg-gray-50/50 relative group transition-all hover:bg-gray-50 hover:border-blue-200">
                            <button 
                                type="button" 
                                onClick={() => removeVariant(v.id)} 
                                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors bg-white p-1.5 rounded-full shadow-sm"
                            >
                                <Trash2 size={20} />
                            </button>
                            
                            <div className="w-full mb-5">
                                <InputField 
                                    label="Tên biến thể" 
                                    value={v.tenBienThe} 
                                    onChange={(val) => updateVariant(v.id, 'tenBienThe', val)} 
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <InputField label="Màu sắc" value={v.mauSac} onChange={(val) => updateVariant(v.id, 'mauSac', val)} />
                                <InputField label="Giá khuyến mãi" type="number" value={v.giaKhuyenMai} onChange={(val) => updateVariant(v.id, 'giaKhuyenMai', Number(val))} />
                                <InputField label="RAM" value={v.ram} onChange={(val) => updateVariant(v.id, 'ram', val)} />
                                <InputField label="Giá bán" type="number" value={v.giaBan} onChange={(val) => updateVariant(v.id, 'giaBan', Number(val))} />
                                <InputField label="Ổ cứng" value={v.oCung} onChange={(val) => updateVariant(v.id, 'oCung', val)} />
                                <InputField label="CPU" value={v.boXuLyTrungTam} onChange={(val) => updateVariant(v.id, 'boXuLyTrungTam', val)} />
                                <InputField label="GPU" value={v.boXuLyDoHoa} onChange={(val) => updateVariant(v.id, 'boXuLyDoHoa', val)} />
                                <InputField label="Số lượng tồn" type="number" value={v.soLuongTon} onChange={(val) => updateVariant(v.id, 'soLuongTon', Number(val))} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default AddProduct;