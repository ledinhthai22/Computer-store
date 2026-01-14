import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { nanoid } from "nanoid";
import { Plus, Trash2, ArrowLeft, Camera, X } from "lucide-react";

import Toast from "../../../components/admin/Toast";
import AddCategoryModal from "../../../components/admin/product/AddCategoryModal";
import AddBrandModal from "../../../components/admin/product/AddBrandModal";

import { productService } from "../../../services/api/productService";
import { categoryService } from "../../../services/api/categoryService";
import { brandService } from "../../../services/api/brandService";

/* ======================
    HELPER COMPONENTS
====================== */
const InputField = ({ label, value, onChange, type = "text", disabled = false, error }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`px-4 py-2 rounded-xl border outline-none transition-all ${
        disabled
          ? "bg-gray-100 text-gray-500"
          : error
          ? "border-red-500 bg-red-50"
          : "border-gray-300 focus:ring-2 focus:ring-blue-500"
      }`}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const SelectField = ({ label, value, onChange, options = [], valueKey, labelKey, onAdd, error }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    <div className="flex gap-2">
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className={`flex-1 px-4 py-2 rounded-xl border outline-none cursor-pointer ${
          error ? "border-red-500 bg-red-50" : "border-gray-300 focus:ring-2 focus:ring-blue-500"
        }`}
      >
        <option value="">-- Chọn --</option>
        {options.map((o) => (
          <option key={o[valueKey]} value={o[valueKey]}>
            {o[labelKey]}
          </option>
        ))}
      </select>
      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="px-3 rounded-xl bg-green-500 text-white cursor-pointer"
        >
          <Plus size={18} />
        </button>
      )}
    </div>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

/* ======================
    MAIN COMPONENT
====================== */
const createVariant = () => ({
  uid: nanoid(),
  tenBienThe: "",
  mauSac: "",
  ram: "",
  oCung: "",
  boXuLyTrungTam: "",
  boXuLyDoHoa: "",
  giaBan: "",
  giaKhuyenMai: "",
  soLuongTon: "",
});

const UpdateProduct = () => {
  const { maSanPham } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState(null);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddBrand, setShowAddBrand] = useState(false);

  const [images, setImages] = useState([]); // Chứa cả File (mới) và String (URL cũ)
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    tenSanPham: "",
    giaCoBan: "",
    khuyenMai: "",
    maDanhMuc: "",
    maThuongHieu: "",
    kichThuocManHinh: "",
    soKheRam: "",
    oCung: "",
    pin: "",
    heDieuHanh: "",
    doPhanGiaiManHinh: "",
    loaiXuLyTrungTam: "",
    loaiXuLyDoHoa: "",
    congGiaoTiep: "",
  });

  const [variants, setVariants] = useState([]);

  /* ===== FETCH INITIAL DATA ===== */
  useEffect(() => {
  const loadInitialData = async () => {
    try {
      setFetching(true);
      const [cates, brds, resProduct] = await Promise.all([
        categoryService.getAll(),
        brandService.getAll(),
        productService.getById(maSanPham),
      ]);

      setCategories(Array.isArray(cates) ? cates : []);
      setBrands(Array.isArray(brds) ? brds : []);

      // Dựa trên ảnh Response: Dữ liệu nằm ngay trong resProduct
      const product = resProduct; 

      if (product && product.maSanPham) {
        // 1. Mapping thông tin cơ bản
        setFormData({
          tenSanPham: product.tenSanPham || "",
          giaCoBan: product.giaCoBan || "",
          khuyenMai: product.khuyenMai || "",
          maDanhMuc: product.maDanhMuc || "", // Lưu ý: Nếu dropdown không chọn đúng, hãy kiểm tra ID danh mục trong response
          maThuongHieu: product.maThuongHieu || "",
          
          // 2. Mapping Specs từ biến thể đầu tiên (thongSoKyThuat)
          kichThuocManHinh: product.bienThe?.[0]?.thongSoKyThuat?.kichThuocManHinh || "",
          soKheRam: product.bienThe?.[0]?.thongSoKyThuat?.soKheRam || "",
          oCung: product.bienThe?.[0]?.thongSoKyThuat?.oCung || "",
          pin: product.bienThe?.[0]?.thongSoKyThuat?.pin || "",
          heDieuHanh: product.bienThe?.[0]?.thongSoKyThuat?.heDieuHanh || "",
          doPhanGiaiManHinh: product.bienThe?.[0]?.thongSoKyThuat?.doPhanGiaiManHinh || "",
          loaiXuLyTrungTam: product.bienThe?.[0]?.thongSoKyThuat?.loaiXuLyTrungTam || "",
          loaiXuLyDoHoa: product.bienThe?.[0]?.thongSoKyThuat?.loaiXuLyDoHoa || "",
          congGiaoTiep: product.bienThe?.[0]?.thongSoKyThuat?.congGiaoTiep || "",
        });

        // 3. Mapping Biến thể (bienThe)
        const mappedVariants = (product.bienThe || []).map((v) => ({
          ...v,
          uid: v.maBTSP || nanoid(), // Trong ảnh của bạn là maBTSP
          tenBienThe: v.tenBienThe || "",
          giaBan: v.giaBan || "",
          giaKhuyenMai: v.giaKhuyenMai || "",
          soLuongTon: v.soLuongTon || 0,
        }));
        setVariants(mappedVariants);

        // 4. Mapping Hình ảnh (hinhAnh)
        if (product.hinhAnh) {
          // Response trả về mảng các đường dẫn string
          setImages(product.hinhAnh); 
        }
      }
    } catch (err) {
      console.error("Lỗi fetch:", err);
      setToast({ type: "error", message: "Không thể tải thông tin sản phẩm" });
    } finally {
      setFetching(false);
    }
  };

  // Chỉ chạy khi có maSanPham và maSanPham không phải "undefined"
  if (maSanPham && maSanPham !== "undefined") {
    loadInitialData();
  }
}, [maSanPham]);

  const totalStock = useMemo(() => variants.reduce((s, v) => s + Number(v.soLuongTon || 0), 0), [variants]);

  /* ===== HANDLERS ===== */
  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateVariant = (uid, field, value) => {
    setVariants((prev) => prev.map((v) => (v.uid === uid ? { ...v, [field]: value } : v)));
  };

  const addVariant = () => setVariants((p) => [...p, createVariant()]);
  const removeVariant = (uid) => variants.length > 1 && setVariants((p) => p.filter((v) => v.uid !== uid));

  const uploadImages = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (i) => setImages((prev) => prev.filter((_, idx) => idx !== i));

  /* ===== SUBMIT UPDATE ===== */
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const fd = new FormData();

      fd.append("TenSanPham", formData.tenSanPham);
      fd.append("MaDanhMuc", formData.maDanhMuc);
      fd.append("MaThuongHieu", formData.maThuongHieu);

      // Xử lý hình ảnh: Phân biệt File mới và URL cũ nếu API yêu cầu
      images.forEach((img) => {
        if (img instanceof File) {
          fd.append("HinhAnh", img);
        } else {
          fd.append("HinhAnhCu", img); // Tùy thuộc Backend xử lý ảnh cũ thế nào
        }
      });

      variants.forEach((v, i) => {
        if(v.maBienThe) fd.append(`BienThe[${i}].MaBienThe`, v.maBienThe);
        fd.append(`BienThe[${i}].TenBienThe`, v.tenBienThe);
        fd.append(`BienThe[${i}].GiaBan`, v.giaBan);
        fd.append(`BienThe[${i}].GiaKhuyenMai`, v.giaKhuyenMai || 0);
        fd.append(`BienThe[${i}].MauSac`, v.mauSac);
        fd.append(`BienThe[${i}].Ram`, v.ram);
        fd.append(`BienThe[${i}].OCung`, v.oCung);
        fd.append(`BienThe[${i}].BoXuLyTrungTam`, v.boXuLyTrungTam);
        fd.append(`BienThe[${i}].BoXuLyDoHoa`, v.boXuLyDoHoa);
        fd.append(`BienThe[${i}].SoLuongTon`, v.soLuongTon);

        // Specs
        fd.append(`BienThe[${i}].ThongSoKyThuat.KichThuocManHinh`, formData.kichThuocManHinh);
        fd.append(`BienThe[${i}].ThongSoKyThuat.SoKheRam`, formData.soKheRam);
        fd.append(`BienThe[${i}].ThongSoKyThuat.OCung`, formData.oCung);
        fd.append(`BienThe[${i}].ThongSoKyThuat.Pin`, formData.pin);
        fd.append(`BienThe[${i}].ThongSoKyThuat.HeDieuHanh`, formData.heDieuHanh);
        fd.append(`BienThe[${i}].ThongSoKyThuat.DoPhanGiaiManHinh`, formData.doPhanGiaiManHinh);
        fd.append(`BienThe[${i}].ThongSoKyThuat.LoaiXuLyTrungTam`, formData.loaiXuLyTrungTam);
        fd.append(`BienThe[${i}].ThongSoKyThuat.LoaiXuLyDoHoa`, formData.loaiXuLyDoHoa);
        fd.append(`BienThe[${i}].ThongSoKyThuat.CongGiaoTiep`, formData.congGiaoTiep);
      });

      // GỌI API UPDATE
      await productService.update(maSanPham, fd);
      setToast({ type: "success", message: "Cập nhật sản phẩm thành công" });
      setTimeout(() => navigate("/quan-ly/san-pham"), 1200);
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Cập nhật sản phẩm thất bại" });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-10 text-center">Đang tải dữ liệu sản phẩm...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between">
        <button onClick={() => navigate(-1)} className="flex gap-2 cursor-pointer hover:text-blue-500">
          <ArrowLeft /> Quay lại
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-orange-600 text-white px-6 py-2 rounded-xl hover:bg-orange-700 cursor-pointer shadow-lg"
        >
          {loading ? "Đang lưu..." : "Cập nhật sản phẩm"}
        </button>
      </div>

      {/* IMAGES */}
      <section className="bg-white p-6 rounded-2xl">
        <h3 className="font-bold mb-3">Ảnh sản phẩm</h3>
        <div className="flex gap-3 flex-wrap">
          {images.map((img, i) => (
            <div key={i} className="relative w-24 h-24">
              <img
                src={img instanceof File ? URL.createObjectURL(img) : `http://localhost:7012${img}`}
                className="w-full h-full object-cover rounded-xl border"
                />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <label className="w-24 h-24 border-dashed border-2 flex items-center justify-center rounded-xl cursor-pointer hover:bg-gray-50">
            <Camera className="text-gray-400" />
            <input type="file" hidden multiple accept="image/*" onChange={uploadImages} />
          </label>
        </div>
      </section>

      {/* BASIC INFO */}
      <section className="bg-white p-6 rounded-2xl grid grid-cols-2 gap-4 shadow-sm">
        <InputField
          label="Tên sản phẩm"
          value={formData.tenSanPham}
          onChange={(v) => handleChange("tenSanPham", v)}
          error={errors.tenSanPham}
        />
        <InputField
          label="Giá cơ bản (Tham khảo)"
          type="number"
          value={formData.giaCoBan}
          onChange={(v) => handleChange("giaCoBan", v)}
        />
        <InputField
          label="Khuyến mãi chung (%)"
          type="number"
          value={formData.khuyenMai}
          onChange={(v) => handleChange("khuyenMai", v)}
        />
        <InputField label="Tổng tồn kho" value={totalStock} disabled />

        <SelectField
          label="Danh mục"
          value={formData.maDanhMuc}
          onChange={(v) => handleChange("maDanhMuc", v)}
          options={categories}
          valueKey="maDanhMuc"
          labelKey="tenDanhMuc"
          onAdd={() => setShowAddCategory(true)}
        />

        <SelectField
          label="Thương hiệu"
          value={formData.maThuongHieu}
          onChange={(v) => handleChange("maThuongHieu", v)}
          options={brands}
          valueKey="maThuongHieu"
          labelKey="tenThuongHieu"
          onAdd={() => setShowAddBrand(true)}
        />
      </section>

      {/* SPECIFICATIONS */}
      <section className="bg-white p-6 rounded-2xl space-y-4 shadow-sm">
        <h3 className="font-bold text-lg">Thông số kỹ thuật</h3>
        <div className="grid grid-cols-3 gap-4">
          <InputField label="Kích thước màn hình" value={formData.kichThuocManHinh} onChange={(v) => handleChange("kichThuocManHinh", v)} />
          <InputField label="Độ phân giải màn hình" value={formData.doPhanGiaiManHinh} onChange={(v) => handleChange("doPhanGiaiManHinh", v)} />
          <InputField label="Hệ điều hành" value={formData.heDieuHanh} onChange={(v) => handleChange("heDieuHanh", v)} />
          <InputField label="Loại xử lý trung tâm (CPU)" value={formData.loaiXuLyTrungTam} onChange={(v) => handleChange("loaiXuLyTrungTam", v)} />
          <InputField label="Loại xử lý đồ họa (GPU)" value={formData.loaiXuLyDoHoa} onChange={(v) => handleChange("loaiXuLyDoHoa", v)} />
          <InputField label="Số khe RAM" value={formData.soKheRam} onChange={(v) => handleChange("soKheRam", v)} />
          <InputField label="Ổ cứng mặc định" value={formData.oCung} onChange={(v) => handleChange("oCung", v)} />
          <InputField label="Pin" value={formData.pin} onChange={(v) => handleChange("pin", v)} />
          <InputField label="Cổng giao tiếp" value={formData.congGiaoTiep} onChange={(v) => handleChange("congGiaoTiep", v)} />
        </div>
      </section>

      {/* VARIANTS */}
      <section className="bg-white p-6 rounded-2xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">Biến thể sản phẩm</h3>
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} /> Thêm biến thể
          </button>
        </div>

        <div className="space-y-4 pr-2" style={{ maxHeight: "600px", overflowY: "auto" }}>
          {variants.map((v) => (
            <div key={v.uid} className="relative border rounded-2xl p-4 bg-gray-50 hover:border-blue-200 transition-all">
              <div className="flex items-center justify-between mb-4">
                {variants.length > 1 && (
                  <button type="button" onClick={() => removeVariant(v.uid)} className="text-red-500 hover:bg-red-50 p-1 rounded-lg">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <InputField label="Tên biến thể" value={v.tenBienThe} onChange={(val) => updateVariant(v.uid, "tenBienThe", val)} />
                <InputField label="Màu sắc" value={v.mauSac} onChange={(val) => updateVariant(v.uid, "mauSac", val)} />
                <InputField label="RAM" value={v.ram} onChange={(val) => updateVariant(v.uid, "ram", val)} />
                <InputField label="Ổ cứng" value={v.oCung} onChange={(val) => updateVariant(v.uid, "oCung", val)} />
                <InputField label="Bộ xử lý trung tâm (CPU)" value={v.boXuLyTrungTam} onChange={(val) => updateVariant(v.uid, "boXuLyTrungTam", val)} />
                <InputField label="Bộ xử lý đồ họa (GPU)" value={v.boXuLyDoHoa} onChange={(val) => updateVariant(v.uid, "boXuLyDoHoa", val)} />
                <InputField label="Giá bán" type="number" value={v.giaBan} onChange={(val) => updateVariant(v.uid, "giaBan", val)} />
                <InputField label="Giá khuyến mãi" type="number" value={v.giaKhuyenMai} onChange={(val) => updateVariant(v.uid, "giaKhuyenMai", val)} />
                <InputField label="Số lượng tồn" type="number" value={v.soLuongTon} onChange={(val) => updateVariant(v.uid, "soLuongTon", val)} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODALS */}
      <AddCategoryModal isOpen={showAddCategory} onClose={() => setShowAddCategory(false)} onSuccess={(newCat) => setCategories([...categories, newCat])} />
      <AddBrandModal isOpen={showAddBrand} onClose={() => setShowAddBrand(false)} onSuccess={(newBrand) => setBrands([...brands, newBrand])} />

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default UpdateProduct;