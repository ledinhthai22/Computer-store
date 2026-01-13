// ===================================
// IProductService.cs
// ===================================
using Backend.DTO.Product;

namespace Backend.Services.Product
{
    public interface IProductService
    {
        // ========== ADMIN - CRUD ==========
        Task<ProductResult?> GetByIdAsync(int id);
        Task<ProductListResponse> GetAdminProductListAsync(AdminProductFilterRequest filter);
        Task<ProductResult?> CreateAsync(CreateProductRequest request);
        Task<ProductResult?> UpdateAsync(int id, UpdateProductRequest request);
        Task<bool> DeleteAsync(int id);
        Task<bool> RestoreAsync(int id);

        // ========== USER - PUBLIC ==========
        Task<ProductResult?> GetByIdForUserAsync(int id);
        Task<ProductResult?> GetBySlugAsync(string slug);
        Task<ProductListResponse> GetProductListAsync(ProductFilterRequest filter);
        Task<List<ProductListItem>> GetBestSellingProductsAsync(int soLuong = 10);
        Task<List<ProductListItem>> GetNewestProductsAsync(int soLuong = 10);
        Task<List<ProductListItem>> GetProductsByCategoryAsync(int maDanhMuc, int soLuong = 12);
        Task<List<ProductListItem>> GetProductsByBrandAsync(int maThuongHieu, int soLuong = 12);
    }
}