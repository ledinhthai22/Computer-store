import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { productService } from "../../../services/api/productService";
import useAddToCart from "../../../hooks/useAddToCart";
import { 
  ShoppingCart, 
  Star, 
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Cpu,
  MemoryStick,
  HardDrive,
  Monitor,
  Battery,
  Hd,
  Airplay,
  Plug2
} from "lucide-react";
import RelatedProduct from "../../../components/user/product/RelatedProduct";

const API_BASE_URL = "https://localhost:7012"; 

export default function Details() {
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);

  const { handleAddToCart } = useAddToCart(product);

  // Hàm chuyển ảnh tiếp theo (dùng cho cả nút bấm và slideshow)
  const nextImage = useCallback(() => {
    if (product?.hinhAnh?.length > 0) {
      setSelectedImage((prev) => (prev + 1) % product.hinhAnh.length);
    }
  }, [product?.hinhAnh?.length]);

  const prevImage = () => {
    if (product?.hinhAnh?.length > 0) {
      setSelectedImage((prev) => (prev - 1 + product.hinhAnh.length) % product.hinhAnh.length);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!loading && product?.hinhAnh?.length > 1) {
      const timer = setInterval(nextImage, 3000);
      return () => clearInterval(timer);
    }
  }, [loading, product?.hinhAnh?.length, nextImage]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await productService.usergetBySlug(slug);
        
        if (res && res.bienThe && res.bienThe.length > 0) {
          setProduct(res);
          setQuantity(1);
          if (res.bienThe && res.bienThe.length > 0) {
            setSelectedVariant(res.bienThe[0]);
          }
        }
      } catch (err) {
        console.log(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/2">
                <div className="bg-white rounded-2xl p-8">
                  <div className="h-96 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="flex gap-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="bg-white rounded-2xl p-8">
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                  <div className="h-12 bg-gray-200 rounded mb-6"></div>
                  <div className="h-48 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product || !selectedVariant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Sản phẩm không tồn tại</h2>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2f9ea0] to-[#25888a] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            <ChevronRight className="rotate-180" size={20} />
            Quay về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const discountPercent = selectedVariant.giaBan > 0 
    ? Math.round(((selectedVariant.giaBan - selectedVariant.giaKhuyenMai) / selectedVariant.giaBan) * 100)
    : 0;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="fill-yellow-400 text-yellow-400" size={20} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="fill-yellow-400 text-yellow-400" size={20} />);
      } else {
        stars.push(<Star key={i} className="text-gray-300" size={20} />);
      }
    }
    return stars;
  };
  const getImageUrl = (imgData) => {
    if (!imgData) return "https://placehold.co/600x400?text=No+Image";
    // Nếu imgData là string thì dùng trực tiếp, nếu là Object thì lấy thuộc tính duongDan
    const path = typeof imgData === 'string' ? imgData : imgData.duongDan;
    if (!path) return "https://placehold.co/600x400?text=No+Image";
    return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-gray-600">
            <li><Link to="/" className="hover:text-[#2f9ea0] transition-colors">Trang chủ</Link></li>
            <li><ChevronRight size={16} /></li>
            <li><Link to="/" className="hover:text-[#2f9ea0] transition-colors">Sản phẩm</Link></li>
            <li><ChevronRight size={16} /></li>
            <li><Link to={`/chi-tiet-san-pham/${slug}`}><span className="text-gray-900 font-medium">{product.tenSanPham}</span></Link></li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Images */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              {/* Main Image */}
              <div className="relative group">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-8 border border-gray-100">
                  <img
                  src={getImageUrl(product.hinhAnh[selectedImage])}
                  alt={product.tenSanPham}
                  className="w-full h-153 object-contain transition-all duration-500 ease-in-out"
                />
                </div>
                <button 
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <ChevronRight size={24} />
                </button>

                {/* Chấm tròn báo vị trí ảnh (Dots) */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {product.hinhAnh.map((_, i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all ${selectedImage === i ? "w-6 bg-[#2f9ea0]" : "w-2 bg-gray-300"}`} />
                  ))}
                </div>
                {/* Discount Badge */}
                {discountPercent > 0 && (
                  <div className="absolute top-4 -left-[6px] z-10">
                    <div className="relative">
                      {/* Thẻ giảm giá chính: Bo góc trên bên trái nhỏ hơn để trông tự nhiên khi quấn */}
                      <div className="bg-[#e30019] text-white px-2 py-1 rounded-r-md rounded-tl-sm font-bold shadow-md flex items-baseline">
                        <span className="text-[11px] leading-none uppercase">Giảm</span>
                        <span className="pl-1 text-base leading-none">{discountPercent}%</span>
                      </div>

                      {/* Nếp gấp ở cạnh bên trái (quấn từ hông ra sau) */}
                      <div 
                        className="absolute top-full left-0 w-[6px] h-[6px] bg-[#8b0000]" 
                        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.hinhAnh.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                      selectedImage === index ? "border-[#2f9ea0] shadow-md" : "border-transparent hover:border-gray-200"
                    }`}
                  >
                    <img
                      src={getImageUrl(img)}
                      className="w-full h-full object-cover"
                      alt="thumbnail"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:w-1/2">
            {/* Product Info - Moved to top */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">{product.tenSanPham}</h1>
              {/* Stock Status Badge */}
              <div className="mb-6">
                <span className={`inline-flex items-center gap-2 rounded-full font-semibold ${
                  selectedVariant.trangThai && selectedVariant.soLuongTon > 0
                    ? "text-green-700"
                    : "text-red-700"
                }`}>
                  <CheckCircle size={16} />
                  {selectedVariant.trangThai && selectedVariant.soLuongTon > 0 ? "Còn hàng" : "Hết hàng"}
                </span>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <span className="font-semibold text-gray-700 min-w-28">Thương hiệu:</span>
                  <span className="text-gray-900">{product.tenThuongHieu}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-semibold text-gray-700 min-w-28">Danh mục:</span>
                  <span className="text-gray-900">{product.tenDanhMuc}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-semibold text-gray-700 min-w-28">Đánh giá:</span>
                  <div className="flex items-center gap-2">
                    {renderStars(product.danhGiaTrungBinh || 0)}
                    <span className="text-gray-700">({product.luotMua || 0} đã bán)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Variant Selection */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.bienThe?.map((variant) => (
                  <button
                    key={variant.maBTSP}
                    onClick={() => setSelectedVariant(variant)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                      selectedVariant?.maBTSP === variant.maBTSP
                        ? "border-[#2f9ea0] bg-gradient-to-r from-[#2f9ea0]/10 to-transparent shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-medium text-gray-900 mb-1">{variant.tenBienThe}</div>
                      <div className="text-sm text-gray-500 mb-2">{variant.mauSac}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-[#2f9ea0]">
                          {formatPrice(variant.giaKhuyenMai)}
                        </span>
                        {variant.soLuongTon <= 5 && variant.soLuongTon > 0 && (
                          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                            Còn {variant.soLuongTon} sản phẩm
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <div className="flex items-end gap-4 mb-2">
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(selectedVariant.giaKhuyenMai)}
                </span>
                {selectedVariant.giaBan > selectedVariant.giaKhuyenMai && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      {formatPrice(selectedVariant.giaBan)}
                    </span>
                    <span className="text-sm bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full font-bold">
                      Tiết kiệm {formatPrice(selectedVariant.giaBan - selectedVariant.giaKhuyenMai)}
                    </span>
                  </>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">Số lượng</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={decreaseQuantity}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center py-2 border-0 focus:ring-0 focus:outline-none"
                      min="1"
                    />
                    <button
                      onClick={increaseQuantity}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    Còn {selectedVariant.soLuongTon} sản phẩm trong kho
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={handleAddToCart}
                  disabled={!selectedVariant.trangThai || selectedVariant.soLuongTon <= 0}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 add-to-cart-btn cursor-pointer ${
                    selectedVariant.trangThai && selectedVariant.soLuongTon > 0
                      ? "bg-gradient-to-r from-[#2f9ea0] to-[#25888a] hover:from-[#25888a] hover:to-[#1d6e70] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart size={24} />
                  Thêm vào giỏ hàng
                </button>
                
                <Link 
                  to={`/checkout?product=${selectedVariant.maBTSP}&quantity=${quantity}`}
                  className="block w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-xl font-semibold text-lg text-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  Mua ngay
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications - Moved to bottom */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-xl font-bold text-gray-900">THÔNG SỐ KỸ THUẬT</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <Cpu className="text-gray-400" size={20} />
                <div className="flex-1">
                  <div className="text-sm text-gray-500">CPU</div>
                  <div className="font-medium">{selectedVariant.thongSoKyThuat?.loaiXuLyTrungTam || selectedVariant.boXuLyTrungTam}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <Hd className="text-gray-400" size={20} />
                <div className="flex-1">
                  <div className="text-sm text-gray-500">VGA</div>
                  <div className="font-medium">{selectedVariant.thongSoKyThuat?.loaiXuLyDoHoa || selectedVariant.boXuLyDoHoa}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <MemoryStick className="text-gray-400" size={20} />
                <div className="flex-1">
                  <div className="text-sm text-gray-500">RAM</div>
                  <div className="font-medium">
                    {selectedVariant.thongSoKyThuat?.soKheRam 
                      ? `${selectedVariant.thongSoKyThuat.soKheRam} x ${selectedVariant.ram}`
                      : selectedVariant.ram}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <HardDrive className="text-gray-400" size={20} />
                <div className="flex-1">
                  <div className="text-sm text-gray-500">Ổ cứng</div>
                  <div className="font-medium">{selectedVariant.thongSoKyThuat?.oCung || selectedVariant.oCung}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <Monitor className="text-gray-400" size={20} />
                <div className="flex-1">
                  <div className="text-sm text-gray-500">Màn hình</div>
                  <div className="font-medium">
                    {selectedVariant.thongSoKyThuat?.kichThuocManHinh && selectedVariant.thongSoKyThuat?.doPhanGiaiManHinh
                      ? `${selectedVariant.thongSoKyThuat.kichThuocManHinh}, ${selectedVariant.thongSoKyThuat.doPhanGiaiManHinh}`
                      : "Thông tin đang cập nhật"}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <Battery className="text-gray-400" size={20} />
                <div className="flex-1">
                  <div className="text-sm text-gray-500">PIN</div>
                  <div className="font-medium">{selectedVariant.thongSoKyThuat?.pin || "Thông tin đang cập nhật"}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <Airplay className="text-gray-400" size={20} />
                <div className="flex-1">
                  <div className="text-sm text-gray-500">Hệ điều hành</div>
                  <div className="font-medium">{selectedVariant.thongSoKyThuat?.heDieuHanh || "Thông tin đang cập nhật"}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <Plug2 className="text-gray-400" size={20} />
                <div className="flex-1">
                  <div className="text-sm text-gray-500">Cổng giao tiếp</div>
                  <div className="font-medium">{selectedVariant.thongSoKyThuat?.congGiaoTiep || "Thông tin đang cập nhật"}</div>
                </div>
              </div>
            </div>
          </div>

          <RelatedProduct productId={product.maSanPham} /> 

          {/* Reviews Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">ĐÁNH GIÁ SẢN PHẨM</h3>
            </div>
            
            <div className="text-center py-8">
              <h4 className="text-xl font-semibold text-gray-700 mb-3">Sản phẩm chưa có đánh giá</h4>
              <p className="text-gray-500 mb-8">Hãy là người đầu tiên đánh giá sản phẩm này</p>
              <div className="flex justify-center mb-8">
                {renderStars(0)}
              </div>
              <p className="text-sm text-gray-500 mb-8">Đánh giá trung bình: {product.danhGiaTrungBinh || 0}/5</p>
              <button className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2f9ea0] to-[#25888a] text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                Viết đánh giá
              </button>
            </div>
          </div>
        </div>
       </div>
    </div>
  );
}