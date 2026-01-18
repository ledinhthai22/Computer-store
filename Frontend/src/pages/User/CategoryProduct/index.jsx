import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { productService, handleApiError } from "../../../services/api/productService";
import { brandService } from "../../../services/api/brandService"; // Import service lấy thương hiệu
import ProductCard from "../../../components/user/product/ProductCard";
import FilterSidebar from "../../../components/user/product/FilterSidebar";

export default function CategoryProduct() {
    // --- 1. State ---
    const [originalProducts, setOriginalProducts] = useState([]); 
    const [displayProducts, setDisplayProducts] = useState([]);   
    const [brands, setBrands] = useState([]); // List thương hiệu cho Sidebar
    const [isLoading, setIsLoading] = useState(true);
    const [categoryName, setCategoryName] = useState("Sản phẩm"); // Để hiển thị tiêu đề trang

    // Bộ lọc
    const [filters, setFilters] = useState({
        MaThuongHieu: null, // Lọc theo thương hiệu
        GiaMin: null,
        GiaMax: null
    });

    // Lấy maDanhMuc từ URL (Router trong App.js phải là /san-pham/danh-muc/:maDanhMuc)
    const { maDanhMuc } = useParams();

    useEffect(()=>{
        document.title = "Sản phẩm theo danh mục";
    },[])

    // --- 2. Fetch Dữ liệu ---
    useEffect(() => {
        const fetchInitialData = async () => {
            if (!maDanhMuc) return;

            setIsLoading(true);
            try {
                // Gọi song song: Lấy SP theo danh mục VÀ Lấy tất cả Thương hiệu
                // Giả sử productService có hàm usergetByCategory, nếu chưa có bạn cần thêm vào service
                const [productsData, brandsList] = await Promise.all([
                    productService.usergetByCategory(maDanhMuc, 50), 
                    brandService.usergetAll()
                ]);

                // Sort sản phẩm
                const sortedProducts = productsData?.sort((a, b) => 
                    new Date(b.ngayTao) - new Date(a.ngayTao)
                ) || [];

                setOriginalProducts(sortedProducts);
                setDisplayProducts(sortedProducts);

                // Lấy tên danh mục từ sản phẩm đầu tiên (nếu có) để làm tiêu đề cho đẹp
                if (sortedProducts.length > 0 && sortedProducts[0].tenDanhMuc) {
                    setCategoryName(sortedProducts[0].tenDanhMuc);
                }

                // Xử lý list Thương hiệu cho Sidebar
                if (Array.isArray(brandsList)) {
                    setBrands(brandsList.map(b => ({
                        id: b.maThuongHieu, 
                        name: b.tenThuongHieu
                    })));
                }

            } catch (error) {
                handleApiError(error, "Lỗi tải dữ liệu trang danh mục");
                setOriginalProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, [maDanhMuc]);

    // --- 3. Logic Lọc (Ngược lại với BrandProduct) ---
    useEffect(() => {
        let result = [...originalProducts];

        // LỌC THƯƠNG HIỆU (Bridge Logic: ID -> Name -> Filter)
        if (filters.MaThuongHieu) {
            // Bước 1: Tìm tên thương hiệu dựa trên ID từ sidebar
            const selectedBrandObj = brands.find(b => b.id == filters.MaThuongHieu);
            
            if (selectedBrandObj) {
                const brandName = selectedBrandObj.name; // VD: "Dell"
                
                // Bước 2: So sánh với tenThuongHieu trong sản phẩm
                result = result.filter(p => 
                    p.tenThuongHieu && p.tenThuongHieu.trim() === brandName.trim()
                );
            }
        }

        // Lọc Giá
        if (filters.GiaMin !== null && filters.GiaMin !== "") {
            result = result.filter(p => Number(p.giaNhoNhat || p.giaBan) >= Number(filters.GiaMin));
        }
        if (filters.GiaMax !== null && filters.GiaMax !== "") {
            result = result.filter(p => Number(p.giaNhoNhat || p.giaBan) <= Number(filters.GiaMax));
        }

        setDisplayProducts(result);
    }, [filters, originalProducts, brands]);

    // --- 4. Handlers ---
    const handleFilterChange = (type, value) => {
        setFilters(prev => {
            if (type === "Gia") {
                return { ...prev, GiaMin: value.min, GiaMax: value.max };
            }
            return { ...prev, [type]: value };
        });
    };

    const clearFilters = () => {
        setFilters({ MaThuongHieu: null, GiaMin: null, GiaMax: null });
    };

    // --- 5. Render ---
    return (
        <div className="w-full bg-stone-50 py-8 min-h-screen">
            <div className="container mx-auto px-4">
                
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-[#2f9ea0] pl-3">
                        {categoryName} {/* Hiển thị tên danh mục động */}
                    </h2>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* SIDEBAR */}
                    <div className="w-full lg:w-1/4 flex-shrink-0">
                        <FilterSidebar 
                            categories={[]} // Không cần truyền danh mục
                            brands={brands} // Truyền danh sách thương hiệu
                            filters={filters}
                            showCategories={false} // Ẩn phần Danh mục
                            showBrands={true}      // Hiện phần Thương hiệu
                            onFilterChange={handleFilterChange}
                        />
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="w-full lg:w-3/4 flex flex-col justify-between">
                        <div>
                            {isLoading ? (
                                <div className="flex justify-center items-center py-32 bg-white rounded-xl shadow-sm">
                                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-100 border-t-[#2f9ea0]"></div>
                                </div>
                            ) : (
                                displayProducts.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">    
                                        {displayProducts.map((product, index) => (
                                            <div 
                                                key={product.maSanPham || index} 
                                                className="transform hover:-translate-y-1 transition-transform duration-300"
                                            >
                                                <ProductCard product={product} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm text-center">
                                        <p className="text-gray-500 font-medium mb-4">
                                            Không tìm thấy sản phẩm phù hợp.
                                        </p>
                                        <button 
                                            onClick={clearFilters}
                                            className="px-6 py-2 bg-[#2f9ea0] text-white rounded-md hover:bg-[#258b8d] transition-colors"
                                        >
                                            Xóa bộ lọc
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}