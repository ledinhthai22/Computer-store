import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { productService, handleApiError } from "../../../services/api/productService";
import { brandService } from "../../../services/api/brandService";
import ProductCard from "../../../components/user/product/ProductCard";
import FilterSidebar from "../../../components/user/product/FilterSidebar";

export default function CategoryProduct() {
  const { maDanhMuc } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = 12;
  const urlMaThuongHieu = searchParams.get("maThuongHieu");
  const urlGiaMin = searchParams.get("giaMin");
  const urlGiaMax = searchParams.get("giaMax");

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categoryName, setCategoryName] = useState("Sản phẩm theo danh mục");
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState({
    MaThuongHieu: urlMaThuongHieu ? Number(urlMaThuongHieu) : null,
    GiaMin: urlGiaMin ? Number(urlGiaMin) : null,
    GiaMax: urlGiaMax ? Number(urlGiaMax) : null,
  });

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brandRes = await brandService.usergetAll();
        if (Array.isArray(brandRes)) {
          setBrands(
            brandRes.map((b) => ({
              id: b.maThuongHieu,
              name: b.tenThuongHieu,
            }))
          );
        }
      } catch (error) {
        console.error("Không tải được thương hiệu:", error);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    const newFilters = {
      MaThuongHieu: urlMaThuongHieu ? Number(urlMaThuongHieu) : null,
      GiaMin: urlGiaMin ? Number(urlGiaMin) : null,
      GiaMax: urlGiaMax ? Number(urlGiaMax) : null,
    };
    setFilters(newFilters);
  }, [urlMaThuongHieu, urlGiaMin, urlGiaMax]);

  useEffect(() => {
    if (!maDanhMuc) return;

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await productService.userGetByCategoryPaging(
          maDanhMuc,
          page,
          pageSize,
          filters
        );

        setProducts(res.items || []);
        setTotalPages(res.totalPages || 1);

        if (res.items?.length > 0 && res.items[0].tenDanhMuc) {
          setCategoryName(res.items[0].tenDanhMuc);
        }
      } catch (error) {
        handleApiError(error, "Không tải được sản phẩm theo danh mục");
        setProducts([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [maDanhMuc, page, filters]);

  const handleFilterChange = (type, value) => {
    const newParams = { page: "1" };

    if (type === "Gia") {
      if (value.min) newParams.giaMin = value.min.toString();
      if (value.max) newParams.giaMax = value.max.toString();
      if (filters.MaThuongHieu) newParams.maThuongHieu = filters.MaThuongHieu.toString();
    } else if (type === "MaThuongHieu") {
      if (value) newParams.maThuongHieu = value.toString();
      if (filters.GiaMin) newParams.giaMin = filters.GiaMin.toString();
      if (filters.GiaMax) newParams.giaMax = filters.GiaMax.toString();
    }

    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({ page: "1" });
  };

  const selectedBrandName = filters.MaThuongHieu 
    ? brands.find(b => b.id === filters.MaThuongHieu)?.name 
    : null;

  return (
    <div className="w-full bg-stone-50 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold border-l-4 border-[#2f9ea0] pl-3">
            {categoryName}
          </h2>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <FilterSidebar
              categories={[]}
              brands={brands}
              showCategories={false}
              showBrands={true}
              onFilterChange={handleFilterChange}
              onClear={clearFilters}
              selectedBrand={filters.MaThuongHieu}
              selectedPriceRange={{ min: filters.GiaMin, max: filters.GiaMax }}
            />
          </div>

          {/* Products Area */}
          <div className="flex-1">
            {/* Active Filters Badge */}
            {(selectedBrandName || filters.GiaMin || filters.GiaMax) && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-600">Đang lọc:</span>
                    {selectedBrandName && (
                      <span className="px-3 py-1 bg-[#2f9ea0] text-white rounded-full text-sm">
                        {selectedBrandName}
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
                    {selectedBrandName && (
                      <span className="text-[#2f9ea0]"> của thương hiệu "{selectedBrandName}"</span>
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
                      if (filters.MaThuongHieu) pageParams.maThuongHieu = filters.MaThuongHieu.toString();
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
                {selectedBrandName ? (
                  <p className="text-gray-500 mb-6">
                    Không có sản phẩm của thương hiệu "{selectedBrandName}" trong danh mục này
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