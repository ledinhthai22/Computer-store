// AddProduct.jsx – Refactor hoàn chỉnh, fix mất focus, đúng nghiệp vụ

import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
  error,
}) => (
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

const SelectField = ({
  label,
  value,
  onChange,
  options = [],
  valueKey,
  labelKey,
  onAdd,
  error,
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    <div className="flex gap-2">
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className={`flex-1 px-4 py-2 rounded-xl border outline-none cursor-pointer ${
          error
            ? "border-red-500 bg-red-50"
            : "border-gray-300 focus:ring-2 focus:ring-blue-500"
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

const AddProduct = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddBrand, setShowAddBrand] = useState(false);

  const [images, setImages] = useState([]); // File[]
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

  const [variants, setVariants] = useState([createVariant()]);

  /* ===== FETCH CATE/BRAND ===== */
useEffect(() => {
  Promise.all([
    categoryService.getAll(),
    brandService.getAll()
  ])
    .then(([categories, brands]) => {
      setCategories(Array.isArray(categories) ? categories : []);
      setBrands(Array.isArray(brands) ? brands : []);
    })
    .catch((err) => {
      console.error(err);
      setToast({
        type: "error",
        message: "Không tải được danh mục / thương hiệu",
      });
    });
}, []);

  /* ===== TOTAL STOCK ===== */
  const totalStock = useMemo(
    () => variants.reduce((s, v) => s + Number(v.soLuongTon || 0), 0),
    [variants]
  );

  /* ===== VALIDATE ===== */
  const validateField = (field, value) => {
    switch (field) {
      case "tenSanPham":
        return value.trim() ? "" : "Tên sản phẩm không được trống";
      case "giaCoBan":
        return Number(value) > 0 ? "" : "Giá cơ bản phải > 0";
      case "khuyenMai":
        return value === "" || (value >= 0 && value <= 100)
          ? ""
          : "Khuyến mãi 0 - 100%";
      case "maDanhMuc":
        return value ? "" : "Vui lòng chọn danh mục";
      case "maThuongHieu":
        return value ? "" : "Vui lòng chọn thương hiệu";
      default:
        return "";
    }
  };

  const validateVariantField = (field, value) => {
    if (field === "tenBienThe" && !value.trim())
      return "Tên biến thể không được trống";
    if (field === "giaBan" && Number(value) <= 0)
      return "Giá bán phải > 0";
    if (field === "giaKhuyenMai" && Number(value) < 0)
      return "Giá khuyến mãi không hợp lệ";
    if (field === "soLuongTon" && Number(value) < 0)
      return "Số lượng không hợp lệ";
    return "";
  };

  /* ===== SYNC SPECS → VARIANT ===== */
  useEffect(() => {
    setVariants((prev) =>
      prev.map((v) => ({
        ...v,
        ram: v.ram || formData.soKheRam,
        oCung: v.oCung || formData.oCung,
        boXuLyTrungTam: v.boXuLyTrungTam || formData.loaiXuLyTrungTam,
        boXuLyDoHoa: v.boXuLyDoHoa || formData.loaiXuLyDoHoa,
      }))
    );
  }, [
    formData.soKheRam,
    formData.oCung,
    formData.loaiXuLyTrungTam,
    formData.loaiXuLyDoHoa,
  ]);

  /* ===== HANDLERS ===== */
    const handleCategoryAdded = (newCategory) => {
    setCategories((prev) => [...prev, newCategory]);

    setFormData((prev) => ({
        ...prev,
        maDanhMuc: newCategory.maDanhMuc,
    }));

    setShowAddCategory(false);
    };

    const handleBrandAdded = (newBrand) => {
    setBrands((prev) => [...prev, newBrand]);

    setFormData((prev) => ({
        ...prev,
        maThuongHieu: newBrand.maThuongHieu,
    }));

    setShowAddBrand(false);
    };

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, value),
    }));
  }, []);

  const updateVariant = (uid, field, value) => {
    setVariants((prev) =>
      prev.map((v) => (v.uid === uid ? { ...v, [field]: value } : v))
    );
    setErrors((prev) => ({
      ...prev,
      [`variant_${uid}_${field}`]: validateVariantField(field, value),
    }));
  };

  const addVariant = () => setVariants((p) => [...p, createVariant()]);
  const removeVariant = (uid) =>
    variants.length > 1 &&
    setVariants((p) => p.filter((v) => v.uid !== uid));

  /* ===== IMAGES ===== */
  const uploadImages = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (i) =>
    setImages((prev) => prev.filter((_, idx) => idx !== i));

  /* ===== SUBMIT ===== */
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const fd = new FormData();

      fd.append("TenSanPham", formData.tenSanPham);
      fd.append("MaDanhMuc", formData.maDanhMuc);
      fd.append("MaThuongHieu", formData.maThuongHieu);

      images.forEach((file) => fd.append("HinhAnh", file));

      variants.forEach((v, i) => {
        fd.append(`BienThe[${i}].TenBienThe`, v.tenBienThe);
        fd.append(`BienThe[${i}].GiaBan`, v.giaBan);
        fd.append(`BienThe[${i}].GiaKhuyenMai`, v.giaKhuyenMai || 0);
        fd.append(`BienThe[${i}].MauSac`, v.mauSac);
        fd.append(`BienThe[${i}].Ram`, v.ram);
        fd.append(`BienThe[${i}].OCung`, v.oCung);
        fd.append(`BienThe[${i}].BoXuLyTrungTam`, v.boXuLyTrungTam);
        fd.append(`BienThe[${i}].BoXuLyDoHoa`, v.boXuLyDoHoa);
        fd.append(`BienThe[${i}].SoLuongTon`, v.soLuongTon);

        fd.append(
          `BienThe[${i}].ThongSoKyThuat.KichThuocManHinh`,
          formData.kichThuocManHinh
        );
        fd.append(
          `BienThe[${i}].ThongSoKyThuat.SoKheRam`,
          formData.soKheRam
        );
        fd.append(
          `BienThe[${i}].ThongSoKyThuat.OCung`,
          formData.oCung
        );
        fd.append(
          `BienThe[${i}].ThongSoKyThuat.Pin`,
          formData.pin
        );
        fd.append(
          `BienThe[${i}].ThongSoKyThuat.HeDieuHanh`,
          formData.heDieuHanh
        );
        fd.append(
          `BienThe[${i}].ThongSoKyThuat.DoPhanGiaiManHinh`,
          formData.doPhanGiaiManHinh
        );
        fd.append(
          `BienThe[${i}].ThongSoKyThuat.LoaiXuLyTrungTam`,
          formData.loaiXuLyTrungTam
        );
        fd.append(
          `BienThe[${i}].ThongSoKyThuat.LoaiXuLyDoHoa`,
          formData.loaiXuLyDoHoa
        );
        fd.append(
          `BienThe[${i}].ThongSoKyThuat.CongGiaoTiep`,
          formData.congGiaoTiep
        );
      });

      await productService.create(fd);
      setToast({ type: "success", message: "Thêm sản phẩm thành công" });
      setTimeout(() => navigate("/quan-ly/san-pham"), 1200);
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Thêm sản phẩm thất bại" });
    } finally {
      setLoading(false);
    }
  };

  /* ===== RENDER ===== */
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
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-800 cursor-pointer"
        >
          {loading ? "Đang lưu..." : "Thêm sản phẩm"}
        </button>
      </div>

      {/* IMAGES */}
      <section className="bg-white p-6 rounded-2xl">
        <h3 className="font-bold mb-3">Ảnh sản phẩm</h3>
        <div className="flex gap-3 flex-wrap">
          {images.map((img, i) => (
            <div key={i} className="relative w-24 h-24">
              <img
                src={URL.createObjectURL(img)}
                className="w-full h-full object-cover rounded-xl"
              />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-black/50 text-white rounded-full"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <label className="w-24 h-24 border-dashed border flex items-center justify-center rounded-xl cursor-pointer">
            <Camera />
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={uploadImages}
            />
          </label>
        </div>
      </section>

      {/* BASIC INFO */}
      <section className="bg-white p-6 rounded-2xl grid grid-cols-2 gap-4">
        <InputField
        label="Tên sản phẩm"
        value={formData.tenSanPham}
        onChange={(v) => handleChange("tenSanPham", v)}
        error={errors.tenSanPham}
        />

        <InputField
        label="Giá cơ bản"
        type="number"
        value={formData.giaCoBan}
        onChange={(v) => handleChange("giaCoBan", v)}
        error={errors.giaCoBan}
        />

        <InputField
        label="Khuyến mãi (%)"
        type="number"
        value={formData.khuyenMai}
        onChange={(v) => handleChange("khuyenMai", v)}
        error={errors.khuyenMai}
        />

        <InputField label="Tổng tồn" value={totalStock} disabled />

        <SelectField
        label="Danh mục"
        value={formData.maDanhMuc}
        onChange={(v) => handleChange("maDanhMuc", v)}
        options={categories}
        valueKey="maDanhMuc"
        labelKey="tenDanhMuc"
        error={errors.maDanhMuc}
        onAdd={() => setShowAddCategory(true)}
        />

        <SelectField
        label="Thương hiệu"
        value={formData.maThuongHieu}
        onChange={(v) => handleChange("maThuongHieu", v)}
        options={brands}
        valueKey="maThuongHieu"
        labelKey="tenThuongHieu"
        error={errors.maThuongHieu}
        onAdd={() => setShowAddBrand(true)}
        />
      </section>

{/* SPECIFICATIONS */}
<section className="bg-white p-6 rounded-2xl space-y-4">
  <h3 className="font-bold text-lg">Thông số kỹ thuật</h3>

  <div className="grid grid-cols-3 gap-4">
    <InputField
      label="Kích thước màn hình"
      value={formData.kichThuocManHinh}
      onChange={(v) => handleChange("kichThuocManHinh", v)}
    />

    <InputField
      label="Độ phân giải màn hình"
      value={formData.doPhanGiaiManHinh}
      onChange={(v) => handleChange("doPhanGiaiManHinh", v)}
    />

    <InputField
      label="Hệ điều hành"
      value={formData.heDieuHanh}
      onChange={(v) => handleChange("heDieuHanh", v)}
    />

    <InputField
      label="Loại xử lý trung tâm (CPU)"
      value={formData.loaiXuLyTrungTam}
      onChange={(v) => handleChange("loaiXuLyTrungTam", v)}
    />

    <InputField
      label="Loại xử lý đồ họa (GPU)"
      value={formData.loaiXuLyDoHoa}
      onChange={(v) => handleChange("loaiXuLyDoHoa", v)}
    />

    <InputField
      label="Số khe RAM"
      value={formData.soKheRam}
      onChange={(v) => handleChange("soKheRam", v)}
    />

    <InputField
      label="Ổ cứng mặc định"
      value={formData.oCung}
      onChange={(v) => handleChange("oCung", v)}
    />

    <InputField
      label="Pin"
      value={formData.pin}
      onChange={(v) => handleChange("pin", v)}
    />

    <InputField
      label="Cổng giao tiếp"
      value={formData.congGiaoTiep}
      onChange={(v) => handleChange("congGiaoTiep", v)}
    />
  </div>
</section>
      {/* VARIANTS */}
<section className="bg-white p-6 rounded-2xl space-y-4">
  {/* Header */}
  <div className="flex items-center justify-between">
    <h3 className="font-bold text-lg">Biến thể sản phẩm</h3>
    <button
      type="button"
      onClick={addVariant}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
    >
      <Plus size={18} />
      Thêm biến thể
    </button>
  </div>

  {/* List variants with scrollbar */}
  <div
    className="space-y-4 pr-2"
    style={{ maxHeight: "520px", overflowY: "auto" }}
  >
    {variants.map((v) => (
      <div
        key={v.uid}
        className="relative border rounded-2xl p-4 bg-gray-50"
      >
        {/* Card header */}
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-700">
          </h4>
          {variants.length > 1 && (
            <button
              type="button"
              onClick={() => removeVariant(v.uid)}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>

        {/* Fields */}
        <div className="grid grid-cols-3 gap-4">
          <InputField
            label="Tên biến thể"
            value={v.tenBienThe}
            onChange={(val) =>
              updateVariant(v.uid, "tenBienThe", val)
            }
            error={errors[`variant_${v.uid}_tenBienThe`]}
          />

          <InputField
            label="Màu sắc"
            value={v.mauSac}
            onChange={(val) =>
              updateVariant(v.uid, "mauSac", val)
            }
          />

          <InputField
            label="RAM"
            value={v.ram}
            onChange={(val) => updateVariant(v.uid, "ram", val)}
          />

          <InputField
            label="Ổ cứng"
            value={v.oCung}
            onChange={(val) =>
              updateVariant(v.uid, "oCung", val)
            }
          />

          <InputField
            label="Bộ xử lý trung tâm (CPU)"
            value={v.boXuLyTrungTam}
            onChange={(val) =>
              updateVariant(v.uid, "boXuLyTrungTam", val)
            }
          />

          <InputField
            label="Bộ xử lý đồ họa (GPU)"
            value={v.boXuLyDoHoa}
            onChange={(val) =>
              updateVariant(v.uid, "boXuLyDoHoa", val)
            }
          />

          <InputField
            label="Giá bán"
            type="number"
            value={v.giaBan}
            onChange={(val) =>
              updateVariant(v.uid, "giaBan", val)
            }
            error={errors[`variant_${v.uid}_giaBan`]}
          />

          <InputField
            label="Giá khuyến mãi"
            type="number"
            value={v.giaKhuyenMai}
            onChange={(val) =>
              updateVariant(v.uid, "giaKhuyenMai", val)
            }
            error={errors[`variant_${v.uid}_giaKhuyenMai`]}
          />

          <InputField
            label="Số lượng tồn"
            type="number"
            value={v.soLuongTon}
            onChange={(val) =>
              updateVariant(v.uid, "soLuongTon", val)
            }
            error={errors[`variant_${v.uid}_soLuongTon`]}
          />
        </div>
      </div>
    ))}
  </div>
</section>


      <AddCategoryModal
        isOpen={showAddCategory}
        onClose={() => setShowAddCategory(false)}
        onSuccess={handleCategoryAdded}
        />

        <AddBrandModal
        isOpen={showAddBrand}
        onClose={() => setShowAddBrand(false)}
        onSuccess={handleBrandAdded}
        />


      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AddProduct;