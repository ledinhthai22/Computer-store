using Backend.DTO.Product;
using Ecommerce.DTO.Common;

namespace Backend.Services.Product
{
    public interface IProductService
    {
        // admin
        Task<ProductResult?> GetByIdAsync(int id);
        Task<List<AdminListProductItem>> GetAdminProductListAsync();
        Task<ProductResult?> CreateAsync(CreateProductRequest request);
        Task<ProductResult?> UpdateAsync(int id, UpdateProductRequest request);
        Task<bool> DeleteAsync(int id);
        Task<bool> RestoreAsync(int id);

        // user
        Task<ProductResult?> GetByIdForUserAsync(int id);
        Task<ProductResult?> GetBySlugAsync(string slug);
        Task<ProductListResponse> GetProductListAsync(ProductFilterRequest filter);
        Task<List<ProductListItem>> GetBestSellingProductsAsync(int soLuong = 10);
        Task<List<ProductListItem>> GetNewestProductsAsync(int soLuong = 10);

        Task<PagedResult<ProductListItem>> GetProductsByCategoryPagingAsync(
            int maDanhMuc,
            int page = 1,
            int pageSize = 12,
            int? maThuongHieu = null,
            decimal? giaMin = null,
            decimal? giaMax = null);

        Task<PagedResult<ProductListItem>> GetProductsByBrandPagingAsync(
            int maThuongHieu,
            int page = 1,
            int pageSize = 12,
            int? maDanhMuc = null,
            decimal? giaMin = null,
            decimal? giaMax = null);
    }
}