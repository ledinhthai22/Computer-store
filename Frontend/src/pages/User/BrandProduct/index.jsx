import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { productService, handleApiError } from "../../../services/api/productService";
import { categoryService } from "../../../services/api/categoryService";
import ProductCard from "../../../components/user/product/ProductCard";
import FilterSidebar from "../../../components/user/product/FilterSidebar";

export default function BrandProduct() {
  const { maThuongHieu } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = 12;
  
  // Đọc filters từ URL
  const urlMaDanhMuc = searchParams.get("maDanhMuc");
  const urlGiaMin = searchParams.get("giaMin");
  const urlGiaMax = searchParams.get("giaMax");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brandName, setBrandName] = useState("Sản phẩm theo thương hiệu");
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState({
    MaDanhMuc: urlMaDanhMuc ? Number(urlMaDanhMuc) : null,
    GiaMin: urlGiaMin ? Number(urlGiaMin) : null,
    GiaMax: urlGiaMax ? Number(urlGiaMax) : null,
  });

  // Fetch categories một lần
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catRes = await categoryService.usergetAll();
        if (Array.isArray(catRes)) {
          setCategories(
            catRes.map((c) => ({
              id: c.maDanhMuc,
              name: c.tenDanhMuc,
            }))
          );
        }
      } catch (error) {
        console.error("Không tải được danh mục:", error);
      }
    };

    fetchCategories();
  }, []);

  // Sync filters với URL params
  useEffect(() => {
    const newFilters = {
      MaDanhMuc: urlMaDanhMuc ? Number(urlMaDanhMuc) : null,
      GiaMin: urlGiaMin ? Number(urlGiaMin) : null,
      GiaMax: urlGiaMax ? Number(urlGiaMax) : null,
    };
    setFilters(newFilters);
  }, [urlMaDanhMuc, urlGiaMin, urlGiaMax]);

  // Fetch products khi filters thay đổi
  useEffect(() => {
    if (!maThuongHieu) return;

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await productService.userGetByBrandPaging(
          maThuongHieu,
          page,
          pageSize,
          filters
        );

        setProducts(res.items || []);
        setTotalPages(res.totalPages || 1);

        if (res.items?.length > 0 && res.items[0].tenThuongHieu) {
          setBrandName(res.items[0].tenThuongHieu);
        }
      } catch (error) {
        handleApiError(error, "Không tải được sản phẩm theo thương hiệu");
        setProducts([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [maThuongHieu, page, filters]);

  const handleFilterChange = (type, value) => {
    const newParams = { page: "1" };

    if (type === "Gia") {
      if (value.min) newParams.giaMin = value.min.toString();
      if (value.max) newParams.giaMax = value.max.toString();
      if (filters.MaDanhMuc) newParams.maDanhMuc = filters.MaDanhMuc.toString();
    } else if (type === "MaDanhMuc") {
      if (value) newParams.maDanhMuc = value.toString();
      if (filters.GiaMin) newParams.giaMin = filters.GiaMin.toString();
      if (filters.GiaMax) newParams.giaMax = filters.GiaMax.toString();
    }

    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({ page: "1" });
  };

  const selectedCategoryName = filters.MaDanhMuc 
    ? categories.find(c => c.id === filters.MaDanhMuc)?.name 
    : null;

  return (
    <div className="w-full bg-stone-50 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold border-l-4 border-[#2f9ea0] pl-3">
            {brandName}
          </h2>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <FilterSidebar
              categories={categories}
              brands={[]}
              showCategories={true}
              showBrands={false}
              onFilterChange={handleFilterChange}
              onClear={clearFilters}
              selectedCategory={filters.MaDanhMuc}
              selectedPriceRange={{ min: filters.GiaMin, max: filters.GiaMax }}
            />
          </div>

          {/* Products Area */}
          <div className="flex-1">
            {/* Active Filters Badge */}
            {(selectedCategoryName || filters.GiaMin || filters.GiaMax) && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-600">Đang lọc:</span>
                    {selectedCategoryName && (
                      <span className="px-3 py-1 bg-[#2f9ea0] text-white rounded-full text-sm">
                        {selectedCategoryName}
                      </span>
                    )}
                    {(filters.GiaMin || filters.GiaMax) && (
                      <span className="px-3 py-1 bg-[#2f9ea0] text-white rounded-full text-sm">
                        {filters.GiaMin?.toLocaleString() || "0"}₫ - {filters.GiaMax?.toLocaleString() || "∞"}₫
                      </span>
                    )}
                  </div>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-[#2f9ea0] hover:underline"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading ? (
              <div className="flex justify-center items-center py-32">
                <div className="animate-spin h-12 w-12 border-4 border-[#2f9ea0] border-t-transparent rounded-full" />
              </div>
            ) : products.length > 0 ? (
              <>
                {/* Product Count */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Hiển thị <strong className="text-gray-900">{products.length}</strong> sản phẩm
                    {selectedCategoryName && (
                      <span className="text-[#2f9ea0]"> trong nhu cầu sử dụng {selectedCategoryName}</span>
                    )}
                  </p>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
                  {products.map((product) => (
                    <ProductCard key={product.maSanPham} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 flex-wrap mt-8">
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      const pageParams = { page: pageNum.toString() };
                      if (filters.MaDanhMuc) pageParams.maDanhMuc = filters.MaDanhMuc.toString();
                      if (filters.GiaMin) pageParams.giaMin = filters.GiaMin.toString();
                      if (filters.GiaMax) pageParams.giaMax = filters.GiaMax.toString();
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setSearchParams(pageParams)}
                          className={`min-w-[40px] h-10 px-3 rounded-md text-sm font-medium transition-all ${
                            page === pageNum
                              ? "bg-[#2f9ea0] text-white shadow-md"
                              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                <div className="text-6xl mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                {selectedCategoryName ? (
                  <p className="text-gray-500 mb-6">
                    Không có sản phẩm {brandName} trong nhu cầu sử dụng "{selectedCategoryName}"
                  </p>
                ) : (
                  <p className="text-gray-500 mb-6">
                    Thử điều chỉnh bộ lọc để xem thêm sản phẩm
                  </p>
                )}
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-[#2f9ea0] text-white rounded-lg hover:bg-[#258b8d] transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}