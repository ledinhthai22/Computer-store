import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toast from '../../../components/admin/Toast';
import { Trash2, Camera, X, ArrowLeft, Plus } from 'lucide-react';
import AddCategoryModal from '../../../components/admin/product/AddCategoryModal';
import AddBrandModal from '../../../components/admin/product/AddBrandModal';

const InputField = ({ label, value, onChange, type = "text", disabled = false, error = "" }) => {
    const [touched, setTouched] = useState(false);

    const handleBlur = () => {
        setTouched(true);
    };

    return (
        <div className="flex flex-col gap-2 w-full text-left">
            <label className="text-[14px] font-medium text-gray-700 ml-1">{label}</label>
            <input
                type={type}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                onBlur={handleBlur}
                disabled={disabled}
                className={`w-full px-4 py-3 rounded-xl outline-none transition-all ${
                    error && touched
                        ? 'border-2 border-red-500 bg-red-50' 
                        : disabled 
                        ? 'bg-[#F1F4F9] text-gray-500 border-transparent' 
                        : 'bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 text-gray-900 shadow-sm'
                }`}
            />
            {error && touched && <p className="text-red-500 text-sm mt-1 ml-1">{error}</p>}
        </div>
    );
};

const SelectField = ({ label, value, onChange, options, valueKey, labelKey, placeholder, error = "", onAdd }) => {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-gray-700 ml-1">{label}</label>
            <div className="flex gap-2">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`flex-1 px-4 py-3 rounded-xl outline-none shadow-sm transition-all ${
                        error 
                            ? 'border-2 border-red-500 bg-red-50' 
                            : 'bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500'
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
                    <button
                        type="button"
                        onClick={onAdd}
                        className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all flex items-center gap-1 font-medium shadow-sm"
                    >
                        <Plus size={18} />
                    </button>
                )}
            </div>
            {error && <p className="text-red-500 text-sm mt-1 ml-1">{error}</p>}
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
    const [errorMessage, setErrorMessage] = useState("");

    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        tenSanPham: '',
        giaCoBan: '',
        khuyenMai: '',
        maDanhMuc: '',
        brandID: '',
        kichThuocManHinh: '',
        soKheRam: '',
        oCung: '',
        pin: '',
        heDieuHanh: '',
        doPhanGiaiManHinh: '',
        loaiXuLyTrungTam: '',
        loaiXuLyDoHoa: '',
        congGiaoTiep: ''
    });

    const [variants, setVariants] = useState([{
        id: Math.random().toString(36).substr(2, 9),
        tenBienThe: '',
        giaBan: '',
        giaKhuyenMai: '',
        mauSac: '',
        ram: '',
        oCung: '',
        manHinh: '',
        boXuLyDoHoa: '',
        boXuLyTrungTam: '',
        soLuongTon: '',
        hinhAnh: []
    }]);

    const totalStock = useMemo(() => {
        return variants.reduce((total, variant) => {
            const qty = Number(variant.soLuongTon) || 0;
            return total + qty;
        }, 0);
    }, [variants]);

    const fetchProduct = async () => {
        try {
            const [catRes, brandRes] = await Promise.all([
                axios.get(`https://localhost:7012/api/Category`),
                axios.get(`https://localhost:7012/api/Brand`)
            ]);
            setCategories(catRes.data);
            setBrands(brandRes.data);
        } catch (error) {
            console.error("Lỗi khi tải metadata:", error);
            showToast("Không thể tải dữ liệu danh mục và thương hiệu", "error");
        }
    };

    useEffect(() => {
        fetchProduct();
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    // Validate real-time
    const validateField = (field, value) => {
        switch(field) {
            case 'tenSanPham':
                return !value.trim() ? "Tên sản phẩm không được để trống" : "";
            case 'giaCoBan':
                return !value || value <= 0 ? "Giá gốc phải lớn hơn 0" : "";
            case 'khuyenMai':
                return value && (value < 0 || value > 100) ? "Khuyến mãi phải từ 0-100%" : "";
            case 'maDanhMuc':
                return !value ? "Vui lòng chọn danh mục" : "";
            case 'brandID':
                return !value ? "Vui lòng chọn thương hiệu" : "";
            default:
                return "";
        }
    };

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        const error = validateField(field, value);
        setErrors({ ...errors, [field]: error });
        if (errorMessage) setErrorMessage("");
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.tenSanPham.trim()) {
            newErrors.tenSanPham = "Tên sản phẩm không được để trống";
        }
        if (!formData.giaCoBan || formData.giaCoBan <= 0) {
            newErrors.giaCoBan = "Giá gốc phải lớn hơn 0";
        }
        if (formData.khuyenMai && (formData.khuyenMai < 0 || formData.khuyenMai > 100)) {
            newErrors.khuyenMai = "Khuyến mãi phải từ 0-100%";
        }
        if (!formData.maDanhMuc) {
            newErrors.maDanhMuc = "Vui lòng chọn danh mục";
        }
        if (!formData.brandID) {
            newErrors.brandID = "Vui lòng chọn thương hiệu";
        }

        variants.forEach((variant, index) => {
            if (!variant.tenBienThe.trim()) {
                newErrors[`variant_${index}_tenBienThe`] = "Tên biến thể không được để trống";
            }
            if (!variant.giaBan || variant.giaBan <= 0) {
                newErrors[`variant_${index}_giaBan`] = "Giá bán phải lớn hơn 0";
            }
            if (!variant.soLuongTon || variant.soLuongTon < 0) {
                newErrors[`variant_${index}_soLuongTon`] = "Số lượng tồn không hợp lệ";
            }
            if (variant.hinhAnh.length === 0) {
                newErrors[`variant_${index}_hinhAnh`] = "Vui lòng thêm ít nhất một hình ảnh cho biến thể";
            }
        });

        return newErrors;
    };

    const handleVariantImageUpload = (variantId, e) => {
        const files = e.target.files;
        if (files) {
            const readers = Array.from(files).map((file) => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(file);
                });
            });
            Promise.all(readers).then((newImages) => {
                setVariants(variants.map(v => 
                    v.id === variantId 
                        ? { ...v, hinhAnh: [...v.hinhAnh, ...newImages] }
                        : v
                ));
                
                const variantIndex = variants.findIndex(v => v.id === variantId);
                const errorKey = `variant_${variantIndex}_hinhAnh`;
                if (errors[errorKey]) {
                    setErrors({ ...errors, [errorKey]: "" });
                }
            });
        }
    };

    const removeVariantImage = (variantId, imageIndex) => {
        setVariants(variants.map(v => 
            v.id === variantId 
                ? { ...v, hinhAnh: v.hinhAnh.filter((_, i) => i !== imageIndex) }
                : v
        ));
    };

    const addVariant = () => {
        setVariants([...variants, {
            id: Math.random().toString(36).substr(2, 9),
            tenBienThe: '',
            giaBan: '',
            giaKhuyenMai: '',
            mauSac: '',
            ram: '',
            oCung: '',
            manHinh: '',
            boXuLyDoHoa: '',
            boXuLyTrungTam: '',
            soLuongTon: '',
            hinhAnh: []
        }]);
    };

    const updateVariant = (id, field, value) => {
        setVariants(variants.map(v => v.id === id ? { ...v, [field]: value } : v));
        
        const variantIndex = variants.findIndex(v => v.id === id);
        const errorKey = `variant_${variantIndex}_${field}`;
        if (errors[errorKey]) {
            setErrors({ ...errors, [errorKey]: "" });
        }
    };

    const removeVariant = (id) => {
        if (variants.length > 1) {
            setVariants(variants.filter(v => v.id !== id));
        } else {
            showToast("Sản phẩm phải có ít nhất một biến thể.", "error");
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setErrors({});

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setErrorMessage("Vui lòng kiểm tra lại thông tin đã nhập!");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        try {
            setLoading(true);
            
            const payload = {
                tenSanPham: formData.tenSanPham,
                giaCoBan: Number(formData.giaCoBan),
                khuyenMai: Number(formData.khuyenMai) || 0,
                soLuongTon: totalStock,
                maDanhMuc: Number(formData.maDanhMuc),
                brandID: Number(formData.brandID),
                thongSoKyThuat: {
                    kichThuocManHinh: formData.kichThuocManHinh || '',
                    soKheRam: formData.soKheRam || '',
                    oCung: formData.oCung || '',
                    pin: formData.pin || '',
                    heDieuHanh: formData.heDieuHanh || '',
                    doPhanGiaiManHinh: formData.doPhanGiaiManHinh || '',
                    loaiXuLyTrungTam: formData.loaiXuLyTrungTam || '',
                    loaiXuLyDoHoa: formData.loaiXuLyDoHoa || '',
                    congGiaoTiep: formData.congGiaoTiep || ''
                },
                bienThe: variants.map(v => ({
                    tenBienThe: v.tenBienThe,
                    giaBan: Number(v.giaBan),
                    giaKhuyenMai: Number(v.giaKhuyenMai) || 0,
                    mauSac: v.mauSac || '',
                    ram: v.ram || '',
                    oCung: v.oCung || '',
                    manHinh: v.manHinh || '',
                    boXuLyDoHoa: v.boXuLyDoHoa || '',
                    boXuLyTrungTam: v.boXuLyTrungTam || '',
                    soLuongTon: Number(v.soLuongTon),
                    hinhAnh: v.hinhAnh
                }))
            };
            
            console.log('=== PAYLOAD GỬI ĐI ===');
            console.log(JSON.stringify(payload, null, 2));
            console.log('=== KẾT THÚC PAYLOAD ===');

            const response = await axios.post(`https://localhost:7012/api/Product/`, payload);
            console.log('Response:', response.data);
            
            showToast("Thêm sản phẩm thành công!", "success");
            
            setTimeout(() => {
                navigate('/quan-ly/san-pham');
            }, 1500);
        } catch (error) {
            console.error("LỖI API:", error);
            console.error("Response data:", error.response?.data);
            console.error("Response status:", error.response?.status);
            
            const errorMsg = error.response?.data?.message 
                || error.response?.data?.title
                || error.response?.data 
                || "Thêm sản phẩm thất bại. Vui lòng thử lại!";
            
            setErrorMessage(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
            showToast("Lỗi: " + (typeof errorMsg === 'string' ? errorMsg : 'Kiểm tra console'), "error");
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryAdded = async (newCategoryId) => {
        await fetchProduct();
        if (newCategoryId) {
            setFormData({ ...formData, maDanhMuc: String(newCategoryId) });
        }
        showToast("Thêm danh mục thành công", "success");
    };

    const handleBrandAdded = async (newBrandId) => {
        await fetchProduct();
        if (newBrandId) {
            setFormData({ ...formData, brandID: String(newBrandId) });
        }
        showToast("Thêm thương hiệu thành công", "success");
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-20 bg-gray-50 min-h-screen">
            {/* Action Bar */}
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-bold transition-all cursor-pointer"
                >
                    <ArrowLeft size={20} /> Quay lại
                </button>
                <button 
                    onClick={handleSave} 
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md disabled:bg-gray-400 transition-all active:scale-95 cursor-pointer"
                >
                    <Plus size={20} />
                    {loading ? "Đang xử lý..." : "Thêm sản phẩm"}
                </button>
            </div>

            {errorMessage && (
                <div className="p-4 bg-red-100 border-2 border-red-400 text-red-700 rounded-2xl text-center font-medium">
                    {errorMessage}
                </div>
            )}

            {/* THÔNG TIN CHÍNH */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 mb-6 uppercase tracking-tight">Thông tin cơ bản</h2>
                <div className="space-y-5">
                    <InputField 
                        label="Tên sản phẩm" 
                        value={formData.tenSanPham} 
                        onChange={(v) => handleChange('tenSanPham', v)}
                        error={errors.tenSanPham}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField 
                            label="Giá gốc (VNĐ)" 
                            type="number" 
                            value={formData.giaCoBan} 
                            onChange={(v) => handleChange('giaCoBan', v)}
                            error={errors.giaCoBan}
                        />
                        <InputField 
                            label="Khuyến mãi (%)" 
                            type="number" 
                            value={formData.khuyenMai} 
                            onChange={(v) => handleChange('khuyenMai', v)}
                            error={errors.khuyenMai}
                        />
                        <InputField 
                            label="Tổng số lượng tồn" 
                            type="number" 
                            value={totalStock}
                            onChange={() => {}}
                            disabled={true}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SelectField
                            label="Danh mục"
                            value={formData.maDanhMuc}
                            onChange={(v) => handleChange('maDanhMuc', v)}
                            options={categories}
                            valueKey="maDanhMuc"
                            labelKey="tenDanhMuc"
                            placeholder="Chọn danh mục"
                            error={errors.maDanhMuc}
                            onAdd={() => setIsCategoryModalOpen(true)}
                        />
                        <SelectField
                            label="Thương hiệu"
                            value={formData.brandID}
                            onChange={(v) => handleChange('brandID', v)}
                            options={brands}
                            valueKey="brandID"
                            labelKey="brandName"
                            placeholder="Chọn thương hiệu"
                            error={errors.brandID}
                            onAdd={() => setIsBrandModalOpen(true)}
                        />
                    </div>
                </div>
            </section>

            {/* THÔNG SỐ KỸ THUẬT */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-left">
                <h2 className="text-xl font-black text-gray-800 uppercase mb-8 border-b pb-4">Thông Số Kỹ Thuật</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField label="Màn hình" value={formData.kichThuocManHinh} onChange={(v) => handleChange('kichThuocManHinh', v)} />
                    <InputField label="Số khe RAM" value={formData.soKheRam} onChange={(v) => handleChange('soKheRam', v)} />
                    <InputField label="Ổ cứng" value={formData.oCung} onChange={(v) => handleChange('oCung', v)} />
                    <InputField label="PIN" value={formData.pin} onChange={(v) => handleChange('pin', v)} />
                    <InputField label="Hệ điều hành" value={formData.heDieuHanh} onChange={(v) => handleChange('heDieuHanh', v)} />
                    <InputField label="Độ phân giải" value={formData.doPhanGiaiManHinh} onChange={(v) => handleChange('doPhanGiaiManHinh', v)} />
                    <InputField label="CPU" value={formData.loaiXuLyTrungTam} onChange={(v) => handleChange('loaiXuLyTrungTam', v)} />
                    <InputField label="GPU" value={formData.loaiXuLyDoHoa} onChange={(v) => handleChange('loaiXuLyDoHoa', v)} />
                    <InputField label="Cổng kết nối" value={formData.congGiaoTiep} onChange={(v) => handleChange('congGiaoTiep', v)} />
                </div>
            </section>

            {/* BIẾN THỂ */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-left">
                <div className="flex justify-between items-center mb-8 border-b pb-4">
                    <h2 className="text-xl font-black text-gray-800 uppercase tracking-wider">Biến Thể Sản Phẩm</h2>
                    <button 
                        type="button" 
                        onClick={addVariant} 
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-md cursor-pointer"
                    >
                        <Plus size={18} /> Thêm biến thể
                    </button>
                </div>
                <div className="max-h-[800px] overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {variants.map((v, index) => (
                        <div key={v.id} className="p-6 rounded-3xl border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white relative group transition-all hover:border-blue-300 hover:shadow-lg">
                            <button 
                                type="button" 
                                onClick={() => removeVariant(v.id)} 
                                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors bg-white p-2 rounded-full shadow-md cursor-pointer z-10"
                            >
                                <Trash2 size={20} />
                            </button>
                            
                            {/* Hình ảnh của biến thể */}
                            <div className="mb-6">
                                <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Hình ảnh biến thể</h3>
                                
                                {errors[`variant_${index}_hinhAnh`] && (
                                    <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded-lg text-xs">
                                        {errors[`variant_${index}_hinhAnh`]}
                                    </div>
                                )}
                                
                                <div className="flex flex-wrap gap-3">
                                    {v.hinhAnh.map((img, imgIdx) => (
                                        <div key={imgIdx} className="relative w-24 h-24 rounded-xl border-2 border-gray-200 overflow-hidden group/img shadow-sm">
                                            <img src={img} className="w-full h-full object-cover" alt={`Variant ${index + 1} - Image ${imgIdx + 1}`} />
                                            <button 
                                                type="button" 
                                                onClick={() => removeVariantImage(v.id, imgIdx)} 
                                                className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-all cursor-pointer"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                    ))}
                                    
                                    <label className={`w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                                        errors[`variant_${index}_hinhAnh`] 
                                            ? 'border-red-500 bg-red-50 hover:bg-red-100' 
                                            : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'
                                    }`}>
                                        <Camera size={24} className={errors[`variant_${index}_hinhAnh`] ? 'text-red-400' : 'text-gray-400'} />
                                        <span className="text-xs text-gray-500 mt-1">Thêm ảnh</span>
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            onChange={(e) => handleVariantImageUpload(v.id, e)} 
                                            multiple 
                                            accept="image/*"
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Thông tin biến thể */}
                            <div className="w-full mb-5">
                                <InputField 
                                    label="Tên biến thể" 
                                    value={v.tenBienThe} 
                                    onChange={(val) => updateVariant(v.id, 'tenBienThe', val)}
                                    error={errors[`variant_${index}_tenBienThe`]}
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <InputField 
                                    label="Màu sắc" 
                                    value={v.mauSac} 
                                    onChange={(val) => updateVariant(v.id, 'mauSac', val)} 
                                />
                                <InputField 
                                    label="RAM" 
                                    value={v.ram} 
                                    onChange={(val) => updateVariant(v.id, 'ram', val)} 
                                />
                                <InputField 
                                    label="Ổ cứng" 
                                    value={v.oCung} 
                                    onChange={(val) => updateVariant(v.id, 'oCung', val)} 
                                />
                                <InputField 
                                    label="Ổ cứng" 
                                    value={v.manHinh} 
                                    onChange={(val) => updateVariant(v.id, 'manHinh', val)} 
                                />
                                <InputField 
                                    label="CPU" 
                                    value={v.boXuLyTrungTam} 
                                    onChange={(val) => updateVariant(v.id, 'boXuLyTrungTam', val)} 
                                />
                                <InputField 
                                    label="GPU" 
                                    value={v.boXuLyDoHoa} 
                                    onChange={(val) => updateVariant(v.id, 'boXuLyDoHoa', val)} 
                                />
                                <InputField 
                                    label="Giá bán (VNĐ)" 
                                    type="number" 
                                    value={v.giaBan} 
                                    onChange={(val) => updateVariant(v.id, 'giaBan', val)}
                                    error={errors[`variant_${index}_giaBan`]}
                                />
                                <InputField 
                                    label="Giá khuyến mãi (VNĐ)" 
                                    type="number" 
                                    value={v.giaKhuyenMai} 
                                    onChange={(val) => updateVariant(v.id, 'giaKhuyenMai', val)}
                                />
                                <InputField 
                                    label="Số lượng tồn" 
                                    type="number" 
                                    value={v.soLuongTon} 
                                    onChange={(val) => updateVariant(v.id, 'soLuongTon', val)}
                                    error={errors[`variant_${index}_soLuongTon`]}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

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

            {toast.show && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast({ ...toast, show: false })} 
                />
            )}
        </div>
    );
};

export default AddProduct;