import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../../components/user/product/ProductCard';
import UserPagination from '../../../components/user/product/UserPagination';
import { Search, Loader2 } from 'lucide-react';

const API_BASE_URL = "https://localhost:7012";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  
  const itemsPerPage = 10;

  // Reset về trang 1 khi keyword thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [keyword]);

  // Fetch dữ liệu khi keyword hoặc currentPage thay đổi
  useEffect(() => {
    if (keyword) {
      fetchSearchResults();
    } else {
      setProducts([]);
      setTotalResults(0);
      setTotalPages(0);
    }
  }, [keyword, currentPage]);

  const fetchSearchResults = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/Search`, {
        params: {
          Keyword: keyword,
          Page: currentPage,
          Limit: itemsPerPage
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      const data = response.data;
      
      // Xử lý dữ liệu từ API
      const formattedProducts = (data.ketQua || []).map(product => ({
        ...product,
        anhDaiDien: product.hinhAnhSanPham?.find(img => img.anhChinh)?.duongDanAnh || null,
        giaNhoNhat: product.bienThe?.[0]?.giaBan || 0,
        giaKhuyenMaiNhoNhat: product.bienThe?.[0]?.giaKhuyenMai || product.bienThe?.[0]?.giaBan || 0,
        slug: product.tenSanPham?.toLowerCase().replace(/\s+/g, '-') || `product-${product.maSanPham}`
      }));
      
      setProducts(formattedProducts);
      setTotalResults(data.tong || 0);
      setTotalPages(Math.ceil((data.tong || 0) / itemsPerPage));
      
    } catch (err) {
      console.error('Error fetching search results:', err);
      
      // Xử lý các loại lỗi khác nhau
      if (err.response) {
        // Server trả về response với status code lỗi
        setError(`Lỗi ${err.response.status}: ${err.response.data?.message || 'Không thể tải dữ liệu'}`);
      } else if (err.request) {
        // Request được gửi nhưng không nhận được response
        setError('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      } else {
        // Lỗi khác
        setError(err.message || 'Đã xảy ra lỗi không xác định');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    
    // Cập nhật URL với trang mới
    setSearchParams({ keyword, page });
    
    // Scroll lên đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render Loading
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="animate-spin text-[#2f9ea0] mb-4" size={48} />
          <p className="text-gray-600">Đang tìm kiếm...</p>
        </div>
      </div>
    );
  }

  // Render Error
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium mb-2">Đã xảy ra lỗi</p>
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button 
            onClick={fetchSearchResults}
            className="mt-2 px-6 py-2 bg-[#2f9ea0] text-white rounded-lg hover:bg-[#278587] transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Render Empty keyword
  if (!keyword) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Search className="text-gray-300 mb-4" size={64} />
          <p className="text-gray-500 text-lg">Nhập từ khóa để tìm kiếm sản phẩm</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Kết quả tìm kiếm cho: <span className="text-[#2f9ea0]">"{keyword}"</span>
        </h1>
        <p className="text-gray-600">
          Tìm thấy <span className="font-semibold">{totalResults}</span> sản phẩm
        </p>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
            {products.map((product) => (
              <ProductCard 
                key={product.maSanPham} 
                product={product}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <UserPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg">
          <Search className="text-gray-300 mb-4" size={64} />
          <p className="text-gray-600 text-lg font-medium mb-2">
            Không tìm thấy sản phẩm nào
          </p>
          <p className="text-gray-500">
            Thử tìm kiếm với từ khóa khác
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;